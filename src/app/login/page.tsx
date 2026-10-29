"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateEmail, validatePassword } from "@/lib/validation";
import { supabase } from "@/lib/supabase";
import { AlertCircle, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (hasSubmitted) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(val),
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (hasSubmitted) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(val, false), // Login chỉ kiểm tra empty
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);
    setAuthError("");

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password, false);

    setErrors({
      email: emailErr,
      password: passwordErr,
    });

    if (emailErr || passwordErr) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        router.push("/expenses");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <LogIn className="size-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Đăng nhập
          </CardTitle>
          <CardDescription>
            Đăng nhập để tiếp tục vào ứng dụng quản lý chi tiêu
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Thông báo lỗi từ Supabase */}
          {authError && (
            <div
              id="error-auth"
              className="error-auth mb-4 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-2"
              data-testid="error-auth"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
                disabled={isSubmitting}
                className={errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}
              />
              {errors.email && (
                <p
                  id="error-email"
                  className="error-email text-sm text-destructive font-medium mt-1"
                  data-testid="error-email"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                disabled={isSubmitting}
                className={errors.password ? "border-destructive focus-visible:ring-destructive/20" : ""}
              />
              {errors.password && (
                <p
                  id="error-password"
                  className="error-password text-sm text-destructive font-medium mt-1"
                  data-testid="error-password"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-4 text-sm text-muted-foreground">
          <span>Chưa có tài khoản?</span>
          <Link
            href="/register"
            className="ml-1 text-primary hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

