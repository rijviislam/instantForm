"use client";

import {
  Check,
  CheckCircle,
  Copy,
  Inbox,
  Layers,
  Plus,
  QrCode,
  Share2,
  Sparkles,
} from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "../ui/Badge";

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeBuilderField, setActiveBuilderField] = useState(1);
  const [collectedCount, setCollectedCount] = useState(128);

  // useEffect(() => {
  //   registerGSAP();

  //   if (prefersReducedMotion()) return;

  //   const ctx = gsap.context(() => {
  //     // Stagger animate cards on scroll
  //     gsap.from(".how-it-works-card", {
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 75%",
  //       },
  //       y: 45,
  //       opacity: 0,
  //       stagger: 0.2,
  //       duration: 0.8,
  //       ease: "power3.out",
  //     });

  //     // Animated connector line drawing
  //     gsap.from("#timeline-line", {
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 70%",
  //         end: "bottom 80%",
  //         scrub: 1,
  //       },
  //       scaleX: 0,
  //       transformOrigin: "left center",
  //       ease: "none",
  //     });
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  const handleCopy = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-24 md:py-32 bg-[#FAF8F5] dark:bg-[#0B0F17] relative overflow-hidden transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge
            variant="neutral"
            icon={<Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />}
            className="mb-4"
          >
            How It Works
          </Badge>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#F8FAFC] tracking-tight font-normal leading-[1.1]">
            From blank page to{" "}
            <span className="italic font-medium text-[#FF5A36]">beautiful form</span>{" "}
            in minutes.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#57534E] dark:text-[#94A3B8] leading-relaxed">
            No complex configuration. No messy code. Just a clean, fluid canvas designed for effortless creation.
          </p>
        </div>

        {/* 3-Step Timeline Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          {/* STEP 01 — Build */}
          <div className="how-it-works-card flex flex-col bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-[#EAE3D6] dark:border-[#1F2937] card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all duration-300 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="w-11 h-11 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FFD8CC] dark:border-[#FF5A36]/30 flex items-center justify-center font-bold text-sm">
                01
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#94A3B8] bg-[#FAF8F5] dark:bg-[#161F30] px-3 py-1 rounded-full border border-[#EAE3D6] dark:border-[#293548]">
                Design & Build
              </span>
            </div>

            <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1C1917] dark:text-[#F8FAFC] font-medium">
              Build
            </h3>
            <p className="text-sm text-[#57534E] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Start with a blank canvas or choose a ready-made template. Assemble questions with effortless visual editing.
            </p>

            {/* Step 1 Visual Mockup: Interactive Mini Builder */}
            <div className="mt-6 pt-5 border-t border-[#EAE3D6] dark:border-[#1F2937] flex-1 flex flex-col justify-between">
              <div className="bg-[#FAF8F5] dark:bg-[#161F30] rounded-2xl p-3.5 border border-[#EAE3D6] dark:border-[#293548] space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-[#78716C] dark:text-[#94A3B8] px-1">
                  <span className="font-semibold text-[#1C1917] dark:text-[#F8FAFC]">Form Canvas</span>
                  <span className="flex items-center gap-1 text-[#FF5A36]">
                    <Layers className="w-3 h-3" /> 3 Fields added
                  </span>
                </div>

                <div className="space-y-1.5">
                  {[
                    { id: 1, title: "Full Name", type: "Short Text" },
                    { id: 2, title: "Work Email", type: "Email Input" },
                    { id: 3, title: "Satisfaction", type: "Rating Scale" },
                  ].map((field) => (
                    <div
                      key={field.id}
                      onClick={() => setActiveBuilderField(field.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                        activeBuilderField === field.id
                          ? "bg-white dark:bg-[#1E293B] border-[#FF5A36] shadow-xs"
                          : "bg-white/60 dark:bg-[#1E293B]/60 border-[#EAE3D6] dark:border-[#293548] hover:bg-white dark:hover:bg-[#1E293B]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36]" />
                        <span className="font-medium text-[#1C1917] dark:text-[#F8FAFC]">
                          {field.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8] bg-[#FAF8F5] dark:bg-[#161F30] px-2 py-0.5 rounded-md border border-[#EAE3D6] dark:border-[#293548]">
                        {field.type}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-center">
                  <span className="text-[11px] font-medium text-[#FF5A36] hover:text-[#E44825] flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Add custom block
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 02 — Share */}
          <div className="how-it-works-card flex flex-col bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-[#EAE3D6] dark:border-[#1F2937] card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all duration-300 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="w-11 h-11 rounded-2xl bg-[#F4EFE6] dark:bg-[#1E293B] text-[#292524] dark:text-[#F8FAFC] border border-[#E7E2D8] dark:border-[#334155] flex items-center justify-center font-bold text-sm">
                02
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#94A3B8] bg-[#FAF8F5] dark:bg-[#161F30] px-3 py-1 rounded-full border border-[#EAE3D6] dark:border-[#293548]">
                Instant Publish
              </span>
            </div>

            <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1C1917] dark:text-[#F8FAFC] font-medium">
              Share
            </h3>
            <p className="text-sm text-[#57534E] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Publish instantly and share a clean link anywhere. Embed seamlessly on your site, Notion, or social channels.
            </p>

            {/* Step 2 Visual Mockup: Share interaction */}
            <div className="mt-6 pt-5 border-t border-[#EAE3D6] dark:border-[#1F2937] flex-1 flex flex-col justify-between">
              <div className="bg-[#FAF8F5] dark:bg-[#161F30] rounded-2xl p-4 border border-[#EAE3D6] dark:border-[#293548] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                      Live on Web
                    </span>
                  </div>
                  <span className="text-[10px] text-[#57534E] dark:text-[#94A3B8] bg-white dark:bg-[#1E293B] px-2 py-0.5 rounded-full border border-[#EAE3D6] dark:border-[#293548]">
                    SSL Secured
                  </span>
                </div>

                {/* Copyable link input */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-[#1E293B] p-1.5 rounded-xl border border-[#EAE3D6] dark:border-[#293548]">
                  <span className="text-xs font-mono text-[#57534E] dark:text-[#94A3B8] px-2 truncate flex-1">
                    instantform.io/f/feedback-2026
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#161F30] hover:bg-[#FFF0EB] dark:hover:bg-[#FF5A36]/20 hover:text-[#FF5A36] text-[#57534E] dark:text-[#94A3B8] transition-colors cursor-pointer"
                    title="Copy Link"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Quick Share pills */}
                <div className="flex items-center justify-between text-[11px] text-[#78716C] dark:text-[#94A3B8] pt-1">
                  <span className="flex items-center gap-1 hover:text-[#FF5A36] cursor-pointer">
                    <QrCode className="w-3.5 h-3.5" /> QR Code
                  </span>
                  <span className="flex items-center gap-1 hover:text-[#FF5A36] cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" /> Embed snippet
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 03 — Collect */}
          <div className="how-it-works-card flex flex-col bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-[#EAE3D6] dark:border-[#1F2937] card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all duration-300 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="w-11 h-11 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FFD8CC] dark:border-[#FF5A36]/30 flex items-center justify-center font-bold text-sm">
                03
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#94A3B8] bg-[#FAF8F5] dark:bg-[#161F30] px-3 py-1 rounded-full border border-[#EAE3D6] dark:border-[#293548]">
                Real-Time Insights
              </span>
            </div>

            <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1C1917] dark:text-[#F8FAFC] font-medium">
              Collect
            </h3>
            <p className="text-sm text-[#57534E] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Watch responses arrive in a focused, easy-to-understand workspace with instant summaries and zero clutter.
            </p>

            {/* Step 3 Visual Mockup: Response feed */}
            <div className="mt-6 pt-5 border-t border-[#EAE3D6] dark:border-[#1F2937] flex-1 flex flex-col justify-between">
              <div className="bg-[#FAF8F5] dark:bg-[#161F30] rounded-2xl p-3.5 border border-[#EAE3D6] dark:border-[#293548] space-y-2">
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="font-semibold text-[#1C1917] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <Inbox className="w-3.5 h-3.5 text-[#FF5A36]" /> Inbound Feed
                  </span>
                  <button
                    type="button"
                    onClick={() => setCollectedCount((c) => c + 1)}
                    className="text-[10px] font-bold text-[#FF5A36] bg-[#FFF0EB] dark:bg-[#FF5A36]/15 px-2 py-0.5 rounded-full hover:bg-[#FFE5DE] dark:hover:bg-[#FF5A36]/25 transition-colors cursor-pointer"
                  >
                    +{collectedCount} Total
                  </button>
                </div>

                {/* Submissions list */}
                <div className="space-y-1.5">
                  <div className="p-2 bg-white dark:bg-[#1E293B] rounded-xl border border-[#EAE3D6] dark:border-[#293548] flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-[9px]">
                        SM
                      </span>
                      <span className="font-medium text-[#1C1917] dark:text-[#F8FAFC]">Sarah M.</span>
                    </div>
                    <span className="text-[10px] text-[#22C55E] font-medium flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" /> 5★ Rating
                    </span>
                  </div>

                  <div className="p-2 bg-white dark:bg-[#1E293B] rounded-xl border border-[#EAE3D6] dark:border-[#293548] flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/50 text-[#FF5A36] flex items-center justify-center font-bold text-[9px]">
                        JD
                      </span>
                      <span className="font-medium text-[#1C1917] dark:text-[#F8FAFC]">John D.</span>
                    </div>
                    <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8]">1 min ago</span>
                  </div>
                </div>

                <p className="text-[10px] text-center text-[#78716C] dark:text-[#94A3B8] pt-0.5">
                  Instant webhook & sync available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
