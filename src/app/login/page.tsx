"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validatePassword } from "@/lib/validation";

export default function LoginPage() {
  const { signIn } = useAuth(); const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [errors, setErrors] = useState({ email: "", password: "" }); const [submitted, setSubmitted] = useState(false); const [authError, setAuthError] = useState(""); const [busy, setBusy] = useState(false);
  const changeEmail = (value: string) => { setEmail(value); if (submitted) setErrors((e) => ({ ...e, email: validateEmail(value) })); };
  const changePassword = (value: string) => { setPassword(value); if (submitted) setErrors((e) => ({ ...e, password: validatePassword(value) })); };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); setAuthError(""); const next = { email: validateEmail(email), password: validatePassword(password) }; setErrors(next); if (next.email || next.password) return; setBusy(true); const { error } = await signIn(email.trim(), password); setBusy(false); if (error) setAuthError(error.message); else router.push("/books"); };
  return <div className="min-h-screen bg-[#fffdf9]"><SiteHeader /><main className="mx-auto max-w-lg px-4 py-12"><Card className="border-stone-200 shadow-sm"><CardHeader><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-800">Welcome back</p><CardTitle className="font-serif text-3xl text-emerald-950">Log in to your shelf</CardTitle></CardHeader><CardContent>
    {authError && <p data-testid="error-auth" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{authError}</p>}
    <form noValidate data-testid="login-form" onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="login-email">Email</Label><Input id="login-email" data-testid="login-email" type="email" value={email} onChange={(e) => changeEmail(e.target.value)} />{errors.email && <p data-testid="error-email" className="text-sm text-red-700">{errors.email}</p>}</div><div className="space-y-2"><Label htmlFor="login-password">Password</Label><Input id="login-password" data-testid="login-password" type="password" value={password} onChange={(e) => changePassword(e.target.value)} />{errors.password && <p data-testid="error-password" className="text-sm text-red-700">{errors.password}</p>}</div><Button data-testid="login-submit" type="submit" disabled={busy} className="w-full bg-emerald-900 hover:bg-emerald-800">{busy ? "Logging in…" : "Login"}</Button></form>
    <p className="mt-5 text-center text-sm text-stone-600">New to ShelfLife? <Link href="/register" className="font-medium text-emerald-900 underline">Create an account</Link></p>
  </CardContent></Card></main></div>;
}
