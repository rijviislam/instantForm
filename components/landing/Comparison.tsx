"use client";

import React, { useEffect, useRef } from "react";
import { Badge } from "../ui/Badge";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from "lucide-react";
import { registerGSAP, prefersReducedMotion, gsap } from "@/lib/animations/gsapUtils";

export function Comparison() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(".comparison-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const genericCons = [
    "Feel outdated, corporate, and rigid",
    "Limited visual personality with standard presets",
    "Clunky respondent experience and slow load times",
    "Overwhelmed with unnecessary confusing settings",
    "Forms often look identical and generic across sites",
    "Responses buried in confusing, cluttered sheets",
  ];

  const instantFormPros = [
    "Beautiful by default with warm, editorial craftsmanship",
    "Fast visual creation in under 60 seconds",
    "Multiple distinct form styles (Classic, Chat, Editorial...)",
    "Delightful respondent experience with tactile flow",
    "Instant 1-click publishing with custom links & QR codes",
    "Clear, human-centered response intelligence & feed",
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-white dark:bg-[#0B0F17] relative border-b border-[#EAE3D6] dark:border-[#1F2937] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge
            variant="neutral"
            icon={<Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />}
            className="mb-4"
          >
            Why InstantForm
          </Badge>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#F8FAFC] tracking-tight font-normal leading-[1.1]">
            Forms shouldn&apos;t feel like{" "}
            <span className="italic font-medium text-[#FF5A36]">paperwork</span>.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#57534E] dark:text-[#94A3B8] leading-relaxed">
            We reimagined every layer of form creation so both creators and respondents actually enjoy the process.
          </p>
        </div>

        {/* 2-Column Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 max-w-5xl mx-auto">
          {/* Card 1: Generic Form Builders */}
          <div className="comparison-card bg-[#FAF8F5] dark:bg-[#111827] rounded-3xl p-7 sm:p-9 border border-[#EAE3D6] dark:border-[#1F2937] card-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EAE3D6] dark:border-[#1F2937]">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E] dark:text-[#64748B]">
                    The Old Way
                  </span>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#57534E] dark:text-[#94A3B8] font-medium mt-1">
                    Generic Form Builders
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#293548] flex items-center justify-center text-[#A8A29E] dark:text-[#64748B]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {genericCons.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-[#A8A29E] dark:text-[#64748B] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#78716C] dark:text-[#94A3B8] leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#EAE3D6] dark:border-[#1F2937] text-xs text-[#A8A29E] dark:text-[#64748B] font-medium text-center">
              Leads to high drop-off rates & respondent fatigue
            </div>
          </div>

          {/* Card 2: InstantForm */}
          <div className="comparison-card bg-[#FFFDFC] dark:bg-[#161F30] rounded-3xl p-7 sm:p-9 border-2 border-[#FF5A36] shadow-xl shadow-[#FF5A36]/5 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient subtle coral top glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5A36]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#FFD8CC] dark:border-[#FF5A36]/30">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
                    The Modern Standard
                  </span>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1C1917] dark:text-[#F8FAFC] font-medium mt-1">
                    InstantForm
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/20 border border-[#FFD8CC] dark:border-[#FF5A36]/30 flex items-center justify-center text-[#FF5A36]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {instantFormPros.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF5A36] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-[#1C1917] dark:text-[#F8FAFC] leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#FFD8CC] dark:border-[#FF5A36]/30 flex items-center justify-between">
              <span className="text-xs font-bold text-[#FF5A36] bg-[#FFF0EB] dark:bg-[#FF5A36]/15 px-3 py-1 rounded-full">
                Up to 2.4x higher completion
              </span>
              <span className="text-xs text-[#57534E] dark:text-[#94A3B8] font-medium">
                100% No-code
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
