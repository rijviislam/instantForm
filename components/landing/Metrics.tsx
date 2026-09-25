"use client";

import React, { useEffect, useRef } from "react";
import { registerGSAP, prefersReducedMotion, gsap, ScrollTrigger } from "@/lib/animations/gsapUtils";
import { FormInput, Clock, Code2, Infinity as InfinityIcon } from "lucide-react";

export function Metrics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const num1Ref = useRef<HTMLSpanElement>(null);
  const num2Ref = useRef<HTMLSpanElement>(null);
  const num3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGSAP();

    if (prefersReducedMotion()) {
      if (num1Ref.current) num1Ref.current.innerText = "20";
      if (num2Ref.current) num2Ref.current.innerText = "60";
      if (num3Ref.current) num3Ref.current.innerText = "100";
      return;
    }

    const obj = { v1: 0, v2: 0, v3: 0 };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.to(obj, {
            v1: 20,
            v2: 60,
            v3: 100,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              if (num1Ref.current) num1Ref.current.innerText = Math.floor(obj.v1).toString();
              if (num2Ref.current) num2Ref.current.innerText = Math.floor(obj.v2).toString();
              if (num3Ref.current) num3Ref.current.innerText = Math.floor(obj.v3).toString();
            },
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 border-y border-[#EAE3D6] dark:border-[#1F2937] bg-white dark:bg-[#0B0F17] relative z-10 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Metric 01 */}
          <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] hover:border-[#D9CFBE] dark:hover:border-[#334155] hover:bg-white dark:hover:bg-[#161F30] transition-all duration-300 group card-shadow hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#293548] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <FormInput className="w-5 h-5 text-[#FF5A36]" />
              </span>
              <span className="text-[11px] font-mono text-[#A8A29E] dark:text-[#64748B] font-medium">
                01
              </span>
            </div>
            <div className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1C1917] dark:text-[#F8FAFC] tracking-tight flex items-baseline gap-1">
              <span ref={num1Ref}>20</span>+
            </div>
            <h4 className="font-sans-modern text-sm sm:text-base font-semibold text-[#292524] dark:text-[#F1F5F9] mt-2">
              Field types
            </h4>
            <p className="font-sans-modern text-xs text-[#78716C] dark:text-[#94A3B8] mt-1 leading-relaxed">
              Text, ratings, logic, uploads & more
            </p>
          </div>

          {/* Metric 02 */}
          <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] hover:border-[#D9CFBE] dark:hover:border-[#334155] hover:bg-white dark:hover:bg-[#161F30] transition-all duration-300 group card-shadow hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#293548] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5 text-[#FF5A36]" />
              </span>
              <span className="text-[11px] font-mono text-[#A8A29E] dark:text-[#64748B] font-medium">
                02
              </span>
            </div>
            <div className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1C1917] dark:text-[#F8FAFC] tracking-tight flex items-baseline gap-1">
              <span ref={num2Ref}>60</span> sec
            </div>
            <h4 className="font-sans-modern text-sm sm:text-base font-semibold text-[#292524] dark:text-[#F1F5F9] mt-2">
              To publish
            </h4>
            <p className="font-sans-modern text-xs text-[#78716C] dark:text-[#94A3B8] mt-1 leading-relaxed">
              Zero boilerplate or complex setup
            </p>
          </div>

          {/* Metric 03 */}
          <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] hover:border-[#D9CFBE] dark:hover:border-[#334155] hover:bg-white dark:hover:bg-[#161F30] transition-all duration-300 group card-shadow hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#293548] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5 text-[#FF5A36]" />
              </span>
              <span className="text-[11px] font-mono text-[#A8A29E] dark:text-[#64748B] font-medium">
                03
              </span>
            </div>
            <div className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1C1917] dark:text-[#F8FAFC] tracking-tight flex items-baseline gap-1">
              <span ref={num3Ref}>100</span>%
            </div>
            <h4 className="font-sans-modern text-sm sm:text-base font-semibold text-[#292524] dark:text-[#F1F5F9] mt-2">
              No-code
            </h4>
            <p className="font-sans-modern text-xs text-[#78716C] dark:text-[#94A3B8] mt-1 leading-relaxed">
              Intuitive visual canvas for everyone
            </p>
          </div>

          {/* Metric 04 */}
          <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] hover:border-[#D9CFBE] dark:hover:border-[#334155] hover:bg-white dark:hover:bg-[#161F30] transition-all duration-300 group card-shadow hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#293548] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <InfinityIcon className="w-5 h-5 text-[#FF5A36]" />
              </span>
              <span className="text-[11px] font-mono text-[#A8A29E] dark:text-[#64748B] font-medium">
                04
              </span>
            </div>
            <div className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1C1917] dark:text-[#F8FAFC] tracking-tight flex items-baseline gap-1">
              ∞
            </div>
            <h4 className="font-sans-modern text-sm sm:text-base font-semibold text-[#292524] dark:text-[#F1F5F9] mt-2">
              Responses
            </h4>
            <p className="font-sans-modern text-xs text-[#78716C] dark:text-[#94A3B8] mt-1 leading-relaxed">
              Scale from 10 to 100,000+ smoothly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
