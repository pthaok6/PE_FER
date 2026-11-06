"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export type BookStatus = "To Read" | "Reading" | "Finished";
export type Book = { id: string; user_id: string; title: string; author: string; pages: number; status: BookStatus; created_at: string };
type BooksContextType = { books: Book[]; loading: boolean; refresh: () => Promise<void>; addBook: (book: Omit<Book, "id" | "user_id" | "created_at">) => Promise<string | null>; updateStatus: (book: Book, status: BookStatus) => Promise<string | null>; deleteBook: (id: string) => Promise<string | null> };
const BooksContext = createContext<BooksContextType | null>(null);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    if (!user) { setBooks([]); setLoadedFor(null); setLoading(false); return; }
    const userId = user.id;
    setLoading(true);
    const { data, error } = await supabase.from("books").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (userId === user?.id && !error) { setBooks((data ?? []) as Book[]); setLoadedFor(userId); }
    setLoading(false);
  };
  useEffect(() => { if (!authLoading) void refresh(); }, [user?.id, authLoading]);
  const addBook: BooksContextType["addBook"] = async (book) => {
    if (!user) return "You must be logged in to add a book.";
    const { data, error } = await supabase.from("books").insert({ ...book, user_id: user.id }).select().single();
    if (error) return error.message;
    setBooks((current) => [data as Book, ...current]);
    return null;
  };
  const updateStatus: BooksContextType["updateStatus"] = async (book, status) => {
    const { error } = await supabase.from("books").update({ status }).eq("id", book.id).eq("user_id", book.user_id);
    if (error) return error.message;
    setBooks((current) => current.map((item) => item.id === book.id ? { ...item, status } : item));
    return null;
  };
  const deleteBook: BooksContextType["deleteBook"] = async (id) => {
    const { error } = await supabase.from("books").delete().eq("id", id).eq("user_id", user?.id);
    if (error) return error.message;
    setBooks((current) => current.filter((book) => book.id !== id));
    return null;
  };
  return <BooksContext.Provider value={{ books: user && loadedFor === user.id ? books : [], loading: loading || authLoading, refresh, addBook, updateStatus, deleteBook }}>{children}</BooksContext.Provider>;
}
export function useBooks() { const value = useContext(BooksContext); if (!value) throw new Error("useBooks must be used within BooksProvider"); return value; }
