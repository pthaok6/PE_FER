"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  return <header className="border-b border-stone-200 bg-[#fffdf9]"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
    <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-emerald-950"><span className="grid size-8 place-items-center rounded-lg bg-emerald-900 text-sm text-white">S</span>ShelfLife</Link>
    <nav className="flex items-center gap-2">
      {!loading && (user ? <><span data-testid="user-email" className="hidden text-sm text-stone-600 sm:inline">{user.email}</span><Link data-testid="link-books" href="/books" className="rounded-md px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50">My shelf</Link><Button data-testid="btn-logout" variant="outline" size="sm" onClick={async () => { await signOut(); router.push("/"); }}>Logout</Button></> : <><Button data-testid="btn-login" variant="ghost" size="sm" onClick={() => router.push("/login")}>Login</Button><Button data-testid="btn-register" size="sm" className="bg-emerald-900 text-white hover:bg-emerald-800" onClick={() => router.push("/register")}>Register</Button></>)}
    </nav>
  </div></header>;
}
