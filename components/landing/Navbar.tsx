"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import {
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthenticated = status === "authenticated" && Boolean(user);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Product", href: "#hero-preview" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Form Styles", href: "#form-styles" },
    { label: "Templates", href: "#templates" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 px-4 sm:px-6 lg:px-8 py-3.5",
          isScrolled
            ? "bg-[#FAF8F5]/85 dark:bg-[#0B0F17]/85 backdrop-blur-md border-b border-[#EAE3D6] dark:border-[#1F2937] shadow-xs"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-sm font-medium text-[#57534E] dark:text-[#94A3B8] hover:text-[#FF5A36] dark:hover:text-[#FF6B4A] hover:bg-[#FFF0EB] dark:hover:bg-[#FF5A36]/15 rounded-full transition-all duration-150 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark/Light mode quick switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#57534E] dark:text-[#94A3B8] hover:text-[#FF5A36] dark:hover:text-[#FF6B4A] hover:bg-[#FFF0EB] dark:hover:bg-[#FF5A36]/15 transition-colors cursor-pointer"
              title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-[#FF5A36]" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {isAuthenticated ? (
              <Link
                href="/forms"
                title={user?.name || user?.email || "Go to Dashboard"}
                className="rounded-full ring-2 ring-transparent hover:ring-[#FF5A36]/40 transition-all cursor-pointer focus:outline-none flex items-center justify-center shrink-0"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User avatar"}
                    className="w-8 h-8 rounded-full object-cover border border-[#EAE3D6] dark:border-[#374151]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#FFF0EB] dark:bg-[#FF5A36]/20 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] font-bold text-xs flex items-center justify-center shrink-0">
                    {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  router.push("/login");
                }}
                className="px-4 py-2 text-sm font-medium text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                Log in
              </button>
            )}

            <Button
              variant="primary"
              size="md"
              iconRight={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                router.push(isAuthenticated ? "/forms" : "/register");
              }}
            >
              {isAuthenticated ? "Dashboard" : "Start building"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#F4EFE6] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] text-[#1C1917] dark:text-[#F8FAFC] focus:outline-hidden"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-[#FF5A36]" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                router.push(isAuthenticated ? "/forms" : "/register");
              }}
            >
              {isAuthenticated ? "Dashboard" : "Build"}
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#F4EFE6] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] text-[#1C1917] dark:text-[#F8FAFC] hover:bg-[#ECE5D9] dark:hover:bg-[#1F2937] transition-colors focus:outline-hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-40 bg-[#FAF8F5] dark:bg-[#0B0F17] pt-20 px-6 pb-8 flex flex-col justify-between md:hidden animate-in fade-in duration-200"
        >
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-[#FFF0EB] dark:bg-[#FF5A36]/15 rounded-2xl border border-[#FFD8CC] dark:border-[#FF5A36]/30 flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF5A36] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#FF5A36] uppercase tracking-wider">
                  InstantForm 2.0
                </p>
                <p className="text-xs text-[#57534E] dark:text-[#94A3B8]">
                  Create forms that stand out
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-lg font-medium text-[#1C1917] dark:text-[#F8FAFC] hover:text-[#FF5A36] dark:hover:text-[#FF6B4A] hover:bg-[#FFF0EB] dark:hover:bg-[#FF5A36]/15 rounded-xl transition-colors border border-transparent hover:border-[#FF5A36]/20"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-3 pt-6 border-t border-[#EAE3D6] dark:border-[#1F2937]">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#161F30] rounded-2xl border border-[#EAE3D6] dark:border-[#293548]">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User avatar"}
                    className="w-10 h-10 rounded-full object-cover border border-[#EAE3D6] dark:border-[#374151]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FFF0EB] dark:bg-[#FF5A36]/20 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] font-bold text-sm flex items-center justify-center shrink-0">
                    {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1C1917] dark:text-[#F8FAFC] truncate">
                    {user?.name || "Account"}
                  </p>
                  <p className="text-xs text-[#78716C] dark:text-[#94A3B8] truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                iconRight={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/forms");
                }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-6 border-t border-[#EAE3D6] dark:border-[#1F2937]">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/login");
                }}
              >
                Log in
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                iconRight={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/register");
                }}
              >
                Start building free
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
