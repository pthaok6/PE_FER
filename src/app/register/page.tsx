"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/lib/validation";
import { supabase } from "@/lib/supabase";
import { AlertCircle, CheckCircle2, Loader2, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      const passErr = validatePassword(val, true);
      const confirmErr = confirmPassword
        ? validateConfirmPassword(confirmPassword, val)
        : errors.confirmPassword;

      setErrors((prev) => ({
        ...prev,
        password: passErr,
        confirmPassword: confirmErr,
      }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (hasSubmitted) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(val, password),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);
    setAuthError("");
    setSuccessMessage("");

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password, true);
    const confirmErr = validateConfirmPassword(confirmPassword, password);

    setErrors({
      email: emailErr,
      password: passwordErr,
      confirmPassword: confirmErr,
    });

    if (emailErr || passwordErr || confirmErr) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        // Trường hợp email đã tồn tại nhưng Supabase bật xác nhận email
        setAuthError("User already registered");
      } else {
        setSuccessMessage("Registration successful");
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
            <UserPlus className="size-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Tạo tài khoản mới
          </CardTitle>
          <CardDescription>
            Đăng ký tài khoản để quản lý chi tiêu của bạn
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Thông báo thành công */}
          {successMessage && (
            <div
              id="form-success"
              className="form-success mb-4 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2"
              data-testid="form-success"
            >
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                disabled={isSubmitting}
                className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/20" : ""}
              />
              {errors.confirmPassword && (
                <p
                  id="error-confirm-password"
                  className="error-confirm-password error-confirmPassword text-sm text-destructive font-medium mt-1"
                  data-testid="error-confirm-password"
                >
                  {errors.confirmPassword}
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
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-4 text-sm text-muted-foreground">
          <span>Đã có tài khoản?</span>
          <Link
            href="/login"
            className="ml-1 text-primary hover:underline font-medium"
          >
            Đăng nhập ngay
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

