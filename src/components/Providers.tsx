"use client";

import { AuthProvider } from "@/context/AuthContext";
import { BooksProvider } from "@/context/BooksContext";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider><BooksProvider>{children}</BooksProvider></AuthProvider>;
}

