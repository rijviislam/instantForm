"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";
import { clsx } from "clsx";

import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-3.5",
          isScrolled
            ? "py-3 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#EAE3D6] shadow-xs"
            : "bg-transparent py-5"
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
            className="hidden md:flex items-center gap-1 bg-[#F4EFE6]/70 backdrop-blur-xs px-4 py-1.5 rounded-full border border-[#EAE3D6]"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-sm font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-white/60 rounded-full transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                router.push("/login");
              }}
              className="px-4 py-2 text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              Log in
            </button>
            <Button
              variant="primary"
              size="md"
              iconRight={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                router.push("/register");
              }}
            >
              Start building
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                router.push("/register");
              }}
            >
              Build
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#F4EFE6] border border-[#EAE3D6] text-[#1C1917] hover:bg-[#ECE5D9] transition-colors focus:outline-hidden"
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
          className="fixed inset-0 z-40 bg-[#FAF8F5] pt-20 px-6 pb-8 flex flex-col justify-between md:hidden animate-in fade-in duration-200"
        >
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-[#FFF0EB] rounded-2xl border border-[#FFD8CC] flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF5A36] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#FF5A36] uppercase tracking-wider">
                  InstantForm 2.0
                </p>
                <p className="text-xs text-[#57534E]">
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
                  className="px-4 py-3 text-lg font-medium text-[#1C1917] hover:bg-[#F4EFE6] rounded-xl transition-colors border border-transparent hover:border-[#EAE3D6]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-[#EAE3D6]">
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
        </div>
      )}
    </>
  );
}
