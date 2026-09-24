"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/Button";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    // Client-side Zod validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setServerError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Successful login
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error("Login submission error:", err);
      setServerError("An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-3.5 rounded-2xl bg-[#FFF0EB] border border-[#FFD8CC] text-[#E44825] text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Social Login Buttons (Google + GitHub) */}
      <SocialAuthButtons callbackUrl={callbackUrl} actionText="Sign in" />

      {/* Or Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-[#E7E2D8] w-full" />
        <span className="bg-white/90 px-3 text-xs text-[#78716C] font-normal uppercase tracking-wider absolute">
          or sign in with email
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-[#1C1917] mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="name@example.com"
            disabled={isLoading}
            className={clsx(
              "w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] transition-all focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36] focus:border-transparent",
              errors.email ? "border-[#FF5A36] bg-[#FFF8F6]" : "border-[#E7E2D8] hover:border-[#D0C8B8]"
            )}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-[#E44825]">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#1C1917]"
            >
              Password
            </label>
            <span className="text-xs text-[#78716C] hover:text-[#FF5A36] transition-colors cursor-pointer">
              Forgot password?
            </span>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="Enter your password"
              disabled={isLoading}
              className={clsx(
                "w-full px-4 py-2.5 pr-11 rounded-xl border bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] transition-all focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36] focus:border-transparent",
                errors.password ? "border-[#FF5A36] bg-[#FFF8F6]" : "border-[#E7E2D8] hover:border-[#D0C8B8]"
              )}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#78716C] hover:text-[#1C1917] transition-colors focus:outline-hidden"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-[#E44825]">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full justify-center shadow-md shadow-[#FF5A36]/20 group"
            iconRight={
              !isLoading && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              )
            }
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 text-center text-xs sm:text-sm text-[#57534E]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#FF5A36] hover:text-[#E44825] transition-colors underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}
