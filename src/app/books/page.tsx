"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Check, Plus, Search, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Book, BookStatus, useBooks } from "@/context/BooksContext";

const statuses: BookStatus[] = ["To Read", "Reading", "Finished"];
const blank = { title: "", author: "", pages: "", status: "" };
type FormErrors = { title: string; author: string; pages: string; status: string };

function validate(values: typeof blank): FormErrors {
  const pages = Number(values.pages);
  return {
    title: !values.title.trim() ? "Title is required" : values.title.trim().length > 80 ? "Title must be at most 80 characters" : "",
    author: !values.author.trim() ? "Author is required" : values.author.trim().length > 60 ? "Author must be at most 60 characters" : "",
    pages: !values.pages.trim() ? "Pages is required" : !Number.isInteger(pages) || pages < 1 || pages > 5000 ? "Pages must be a whole number between 1 and 5000" : "",
    status: !values.status ? "Please choose a status" : "",
  };
}

export default function BooksPage() {
  const { user, loading: authLoading } = useAuth(); const { books, loading, addBook, updateStatus, deleteBook } = useBooks(); const router = useRouter();
  const userId = user?.id;
  const [values, setValues] = useState(blank); const [errors, setErrors] = useState<FormErrors>({ title: "", author: "", pages: "", status: "" }); const [submitted, setSubmitted] = useState(false); const [bookError, setBookError] = useState(""); const [success, setSuccess] = useState(""); const [busy, setBusy] = useState(false); const [filter, setFilter] = useState(""); const [query, setQuery] = useState(""); const [actionError, setActionError] = useState("");
  const currentUserId = useRef<string | null>(user?.id ?? null);
  currentUserId.current = user?.id ?? null;
  useEffect(() => { if (!authLoading && !user) router.replace("/login"); }, [authLoading, user, router]);
  useEffect(() => {
    setValues(blank);
    setErrors({ title: "", author: "", pages: "", status: "" });
    setSubmitted(false);
    setBookError("");
    setSuccess("");
    setBusy(false);
    setFilter("");
    setQuery("");
    setActionError("");
  }, [user?.id]);
  const shown = useMemo(() => { const needle = query.trim().toLocaleLowerCase(); return books.filter((book) => (!filter || book.status === filter) && (!needle || book.title.toLocaleLowerCase().includes(needle) || book.author.toLocaleLowerCase().includes(needle))); }, [books, filter, query]);
  const breakdown = useMemo(() => statuses.map((status, index) => ({ status, index, count: shown.filter((book) => book.status === status).length })).filter((row) => row.count > 0).sort((a, b) => b.count - a.count || a.index - b.index), [shown]);
  const field = (key: keyof typeof blank, value: string) => { const next = { ...values, [key]: value }; setValues(next); if (submitted) setErrors((prior) => ({ ...prior, [key]: validate(next)[key] })); };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); setSuccess(""); setBookError(""); const next = validate(values); setErrors(next); if (Object.values(next).some(Boolean) || !userId) return; const submittedBy = userId; setBusy(true); try { const error = await addBook({ title: values.title.trim(), author: values.author.trim(), pages: Number(values.pages), status: values.status as BookStatus }); if (currentUserId.current !== submittedBy) return; setBusy(false); if (error) setBookError(error); else { setValues(blank); setErrors({ title: "", author: "", pages: "", status: "" }); setSubmitted(false); setSuccess("Book added"); } } catch (error) { if (currentUserId.current === submittedBy) { setBusy(false); setBookError(error instanceof Error ? error.message : "Unable to add this book."); } } };
  const mutate = async (operation: () => Promise<string | null>) => { if (!userId) return; const actedBy = userId; setActionError(""); try { const error = await operation(); if (currentUserId.current === actedBy && error) setActionError(error); } catch (error) { if (currentUserId.current === actedBy) setActionError(error instanceof Error ? error.message : "Unable to update your shelf."); } };
  if (authLoading || !user) return <div className="min-h-screen bg-[#fffdf9]" aria-hidden="true" />;

  return <div className="min-h-screen bg-[#fffdf9] text-stone-900"><SiteHeader /><main data-testid="books-page" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-800">Your reading life</p><h1 className="mt-2 font-serif text-4xl font-semibold text-emerald-950">My shelf</h1><p className="mt-2 text-stone-600">A good story is always waiting.</p></div><div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-950"><span className="font-semibold">{books.length}</span> {books.length === 1 ? "book" : "books"} on your shelf</div></div>
    {actionError && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(290px,360px)_1fr]"><div className="space-y-6 lg:sticky lg:top-6">
      <Card className="border-stone-200 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 font-serif text-xl text-emerald-950"><Plus className="size-5" /> Add a book</CardTitle></CardHeader><CardContent><form noValidate data-testid="book-form" onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5"><Label htmlFor="input-title">Title</Label><Input id="input-title" data-testid="input-title" value={values.title} onChange={(e) => field("title", e.target.value)} placeholder="The book title" />{errors.title && <p data-testid="error-title" className="text-sm text-red-700">{errors.title}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="input-author">Author</Label><Input id="input-author" data-testid="input-author" value={values.author} onChange={(e) => field("author", e.target.value)} placeholder="Author name" />{errors.author && <p data-testid="error-author" className="text-sm text-red-700">{errors.author}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="input-pages">Number of pages</Label><Input id="input-pages" data-testid="input-pages" type="number" min="1" max="5000" step="1" value={values.pages} onChange={(e) => field("pages", e.target.value)} placeholder="320" />{errors.pages && <p data-testid="error-pages" className="text-sm text-red-700">{errors.pages}</p>}</div>
        <div className="space-y-1.5"><Label htmlFor="select-status">Status</Label><select id="select-status" data-testid="select-status" value={values.status} onChange={(e) => field("status", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Choose status</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>{errors.status && <p data-testid="error-status" className="text-sm text-red-700">{errors.status}</p>}</div>
        {bookError && <p data-testid="error-book" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{bookError}</p>}{success && <p data-testid="book-success" className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">Book added</p>}<Button data-testid="btn-add-book" type="submit" disabled={busy} className="w-full bg-emerald-900 hover:bg-emerald-800">{busy ? "Adding…" : "Add book"}</Button>
      </form></CardContent></Card>
      <Card className="border-stone-200 shadow-sm"><CardHeader><CardTitle className="font-serif text-xl text-emerald-950">Your shelf at a glance</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-3"><div className="rounded-lg bg-[#f7f4ed] p-3"><p className="text-xs text-stone-500">Books shown</p><p data-testid="book-count" className="mt-1 text-2xl font-semibold text-emerald-950">{shown.length}</p></div><div className="rounded-lg bg-[#f7f4ed] p-3"><p className="text-xs text-stone-500">Pages shown</p><p data-testid="total-pages" className="mt-1 text-2xl font-semibold text-emerald-950">{shown.reduce((sum, book) => sum + book.pages, 0)}</p></div></div><div data-testid="status-breakdown" className="mt-4 space-y-2">{breakdown.map(({ status, count }) => <div data-testid="breakdown-row" key={status} className="flex justify-between border-b border-stone-100 pb-2 text-sm"><span data-testid="breakdown-name">{status}</span><span data-testid="breakdown-count" className="font-medium">{count}</span></div>)}</div></CardContent></Card>
    </div>
    <section className="min-w-0"><Card className="border-stone-200 shadow-sm"><CardHeader className="gap-4"><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2 font-serif text-2xl text-emerald-950"><BookOpen className="size-5" /> Books</CardTitle><span className="text-sm text-stone-500">{shown.length} shown</span></div><div className="grid gap-3 sm:grid-cols-[180px_1fr_auto]"><select data-testid="filter-status" aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="">All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select><div className="relative"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-stone-400" /><Input data-testid="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or author" className="pl-9" /></div><Button data-testid="btn-clear-filters" variant="outline" onClick={() => { setFilter(""); setQuery(""); }}>Clear</Button></div></CardHeader><CardContent>
      {loading ? <p className="py-10 text-center text-sm text-stone-500">Loading your books…</p> : shown.length === 0 ? <div data-testid="books-empty" className="rounded-xl border border-dashed border-stone-300 py-14 text-center"><BookOpen className="mx-auto size-8 text-stone-400" /><p className="mt-3 font-serif text-lg text-stone-700">No books found</p></div> : <div data-testid="book-list" className="space-y-3">{shown.map((book: Book) => <article data-testid="book-item" key={book.id} className="flex min-w-0 flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h2 data-testid="book-title" className="break-words font-serif text-lg font-semibold text-emerald-950">{book.title}</h2><p data-testid="book-author" className="mt-1 text-sm text-stone-600">{book.author}</p><div className="mt-3 flex flex-wrap items-center gap-2"><span data-testid="book-pages" className="text-xs text-stone-500">{book.pages} pages</span><span className="text-stone-300">·</span><span data-testid="book-status" className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900">{book.status}</span></div></div><div className="flex shrink-0 gap-2">{book.status !== "Finished" && <Button data-testid="btn-advance-status" variant="outline" size="sm" onClick={() => void mutate(() => updateStatus(book, statuses[statuses.indexOf(book.status) + 1]))} aria-label="Advance status">Advance<ArrowRight className="size-4" /></Button>}{book.status === "Finished" && <span aria-label="Finished" className="grid size-9 place-items-center rounded-md bg-emerald-50 text-emerald-800"><Check className="size-4" /></span>}<Button data-testid="btn-delete-book" variant="outline" size="sm" onClick={() => void mutate(() => deleteBook(book.id))} aria-label="Delete" className="text-stone-500 hover:text-red-700"><Trash2 className="size-4" />Delete</Button></div></article>)}</div>}
    </CardContent></Card></section></div>
  </main></div>;
}
