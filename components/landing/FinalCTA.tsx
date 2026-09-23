"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "../ui/Button";
import {
  ArrowRight,
  Sparkles,
  Smile,
  ShieldCheck,
} from "lucide-react";
import { registerGSAP, prefersReducedMotion, gsap } from "@/lib/animations/gsapUtils";
import confetti from "canvas-confetti";

import { useRouter } from "next/navigation";

export function FinalCTA() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Floating chips subtle movement
      gsap.to(".cta-floating-chip-1", {
        y: -12,
        rotation: 3,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".cta-floating-chip-2", {
        y: 10,
        rotation: -3,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.3,
      });

      // Scroll reveal
      gsap.from("#cta-inner-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 40,
        scale: 0.98,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF5A36", "#FFA07A", "#292524", "#F4EFE6", "#FFFFFF"],
    });
    setTimeout(() => {
      router.push("/register");
    }, 400);
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-[#FAF8F5] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Canvas Box */}
        <div
          id="cta-inner-card"
          className="relative rounded-3xl bg-gradient-to-br from-[#FFF5F0] via-[#FFFDF9] to-[#FDF4EC] border border-[#FFD8CC] p-8 sm:p-14 md:p-16 text-center shadow-xl shadow-[#FF5A36]/5 overflow-hidden"
        >
          {/* Ambient coral glow circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FF5A36]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#FFA07A]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Floating decorative chip 1: top right */}
          <div className="cta-floating-chip-1 hidden sm:flex absolute top-8 right-8 z-10 items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#FFD8CC] shadow-md text-xs font-semibold text-[#1C1917]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>60s to Publish</span>
          </div>

          {/* Floating decorative chip 2: bottom left */}
          <div className="cta-floating-chip-2 hidden sm:flex absolute bottom-8 left-8 z-10 items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#FFD8CC] shadow-md text-xs font-semibold text-[#1C1917]">
            <Smile className="w-4 h-4 text-[#FF5A36]" />
            <span>Zero Boring Forms</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] text-[#FF5A36] text-xs font-semibold uppercase tracking-wider border border-[#FFD8CC] mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Start Free Today
          </div>

          {/* Main Headline */}
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight font-normal max-w-2xl mx-auto leading-[1.08]">
            Ready to build your{" "}
            <span className="italic font-medium text-[#FF5A36]">first form</span>?
          </h2>

          {/* Supporting text */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-[#57534E] max-w-xl mx-auto font-normal leading-relaxed">
            Turn your next survey, application, signup, or feedback form into something people actually enjoy using.
          </p>

          {/* Action CTA Button */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-4 shadow-lg shadow-[#FF5A36]/25 group"
              iconRight={
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              }
              onClick={triggerCelebration}
            >
              Start building
            </Button>
          </div>

          {/* Secondary subtle guarantee */}
          <p className="mt-5 text-xs text-[#78716C] font-medium tracking-wide flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF5A36]" />
            No code. No boring templates. Free forever on start.
          </p>
        </div>
      </div>
    </section>
  );
}
