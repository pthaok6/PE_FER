"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validatePassword, validateConfirmPassword } from "@/lib/validation";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [errors, setErrors] = useState({ email: "", password: "", confirm: "" }); const [submitted, setSubmitted] = useState(false); const [authError, setAuthError] = useState(""); const [success, setSuccess] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); setAuthError(""); setSuccess(""); const next = { email: validateEmail(email), password: validatePassword(password, true), confirm: validateConfirmPassword(confirm, password) }; setErrors(next); if (next.email || next.password || next.confirm) return; setBusy(true); try { const { error } = await signUp(email.trim(), password); if (error) setAuthError(error.message); else setSuccess("Registration successful"); } catch (error) { setAuthError(error instanceof Error ? error.message : "Unable to connect to Supabase. Check your connection and try again."); } finally { setBusy(false); } };
  const emailChange = (v: string) => { setEmail(v); if (submitted) setErrors((e) => ({ ...e, email: validateEmail(v) })); };
  const passwordChange = (v: string) => { setPassword(v); if (submitted) setErrors((e) => ({ ...e, password: validatePassword(v, true), confirm: confirm ? validateConfirmPassword(confirm, v) : e.confirm })); };
  const confirmChange = (v: string) => { setConfirm(v); if (submitted) setErrors((e) => ({ ...e, confirm: validateConfirmPassword(v, password) })); };
  return <div className="min-h-screen bg-[#fffdf9]"><SiteHeader /><main className="mx-auto max-w-lg px-4 py-12"><Card className="border-stone-200 shadow-sm"><CardHeader><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-800">Start your collection</p><CardTitle className="font-serif text-3xl text-emerald-950">Create your account</CardTitle></CardHeader><CardContent>
    {success && <p data-testid="form-success" className="mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">Registration successful</p>}{authError && <p data-testid="error-auth" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{authError}</p>}
    <form noValidate data-testid="register-form" onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="register-email">Email</Label><Input id="register-email" data-testid="register-email" type="email" value={email} onChange={(e) => emailChange(e.target.value)} />{errors.email && <p data-testid="error-email" className="text-sm text-red-700">{errors.email}</p>}</div><div className="space-y-2"><Label htmlFor="register-password">Password</Label><Input id="register-password" data-testid="register-password" type="password" value={password} onChange={(e) => passwordChange(e.target.value)} />{errors.password && <p data-testid="error-password" className="text-sm text-red-700">{errors.password}</p>}</div><div className="space-y-2"><Label htmlFor="register-confirm-password">Confirm password</Label><Input id="register-confirm-password" data-testid="register-confirm-password" type="password" value={confirm} onChange={(e) => confirmChange(e.target.value)} />{errors.confirm && <p data-testid="error-confirm-password" className="text-sm text-red-700">{errors.confirm}</p>}</div><Button data-testid="register-submit" type="submit" disabled={busy} className="w-full bg-emerald-900 hover:bg-emerald-800">{busy ? "Creating account…" : "Register"}</Button></form>
    <p className="mt-5 text-center text-sm text-stone-600">Already registered? <Link href="/login" className="font-medium text-emerald-900 underline">Log in</Link></p>
  </CardContent></Card></main></div>;
}
