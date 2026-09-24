"use client";

import React, { useEffect, useRef } from "react";
import { Logo } from "@/components/ui/Logo";
import { registerGSAP, prefersReducedMotion, gsap } from "@/lib/animations/gsapUtils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}

export function AuthLayout({
  children,
  heading,
  subheading,
}: AuthLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between relative overflow-hidden warm-mesh-bg"
    >
      {/* Decorative ambient radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#FF5A36]/10 via-[#FFA07A]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-to-tl from-[#FF5A36]/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between z-10">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#57534E] hover:text-[#1C1917] px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white border border-[#E7E2D8] transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10">
        <div
          ref={cardRef}
          className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-[#E7E2D8] p-6 sm:p-10 shadow-xl shadow-[#1C1917]/5"
        >
          {/* Card Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight leading-tight">
              {heading}
            </h1>
            <p className="mt-2 text-sm text-[#57534E] font-normal leading-relaxed">
              {subheading}
            </p>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-[#78716C] z-10">
        <p>© {new Date().getFullYear()} InstantForm Inc. Design-first form builder.</p>
      </footer>
    </div>
  );
}
