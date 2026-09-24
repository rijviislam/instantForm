"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerSchema } from "@/lib/validations/auth";
import { registerApi } from "@/lib/api-client";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    // Client-side Zod validation
    const validation = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof errors;
        if (fieldName) {
          fieldErrors[fieldName] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Call Express backend API to create user account
      const registerRes = await registerApi({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (!registerRes.success) {
        setServerError(
          registerRes.message || "Unable to complete registration. Please try again."
        );
        setIsLoading(false);
        return;
      }

      // Step 2: Auto sign-in with Auth.js Credentials session
      const signInRes = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        // User created successfully, redirect to login to sign in
        router.push("/login?registered=true");
        return;
      }

      // Step 3: Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Registration error:", err);
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

      {/* Social Sign Up Buttons (Google + GitHub) */}
      <SocialAuthButtons callbackUrl="/dashboard" actionText="Sign up" />

      {/* Or Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-[#E7E2D8] w-full" />
        <span className="bg-white/90 px-3 text-xs text-[#78716C] font-normal uppercase tracking-wider absolute">
          or sign up with email
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold text-[#1C1917] mb-1.5"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Alex Morgan"
            disabled={isLoading}
            className={clsx(
              "w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] transition-all focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36] focus:border-transparent",
              errors.name ? "border-[#FF5A36] bg-[#FFF8F6]" : "border-[#E7E2D8] hover:border-[#D0C8B8]"
            )}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-[#E44825]">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Address Field */}
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
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-[#1C1917] mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="At least 6 characters"
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

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-[#1C1917] mb-1.5"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              placeholder="Repeat your password"
              disabled={isLoading}
              className={clsx(
                "w-full px-4 py-2.5 pr-11 rounded-xl border bg-white text-sm text-[#1C1917] placeholder:text-[#A8A29E] transition-all focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36] focus:border-transparent",
                errors.confirmPassword
                  ? "border-[#FF5A36] bg-[#FFF8F6]"
                  : "border-[#E7E2D8] hover:border-[#D0C8B8]"
              )}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#78716C] hover:text-[#1C1917] transition-colors focus:outline-hidden"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="mt-1.5 text-xs text-[#E44825]">
              {errors.confirmPassword}
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
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </form>

      {/* Terms Notice */}
      <p className="mt-4 text-[11px] text-center text-[#78716C] leading-relaxed">
        By continuing, you agree to InstantForm&apos;s Terms of Service and Privacy Policy.
      </p>

      {/* Switch to Sign In */}
      <div className="mt-6 text-center text-xs sm:text-sm text-[#57534E]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#FF5A36] hover:text-[#E44825] transition-colors underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
