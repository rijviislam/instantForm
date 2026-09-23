"use client";

import {
  ArrowRight,
  Check,
  FileCheck2,
  Layers,
  MessageSquare,
  Minimize2,
  ScrollText,
  Send,
  Sparkles,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Badge } from "../ui/Badge";

type StyleKey = "classic" | "conversation" | "chat" | "editorial" | "minimal";

interface StyleDefinition {
  key: StyleKey;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  bgClass: string;
  badgeClass: string;
  description: string;
}

export function FormStyles() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStyle, setActiveStyle] = useState<StyleKey>("classic");

  const styles: StyleDefinition[] = [
    {
      key: "classic",
      name: "Classic",
      tagline: "Clean, structured & dependable",
      icon: <FileCheck2 className="w-4 h-4" />,
      bgClass: "bg-white border-[#EAE3D6]",
      badgeClass: "bg-[#F4EFE6] text-[#292524]",
      description: "Structured card-based layout with clean borders, gentle labels, and effortless field scanning.",
    },
    {
      key: "conversation",
      name: "Conversation",
      tagline: "One focused question at a time",
      icon: <Layers className="w-4 h-4" />,
      bgClass: "bg-[#FFFDFC] border-[#FFD8CC]",
      badgeClass: "bg-[#FFF0EB] text-[#FF5A36]",
      description: "Typeform-style single question spotlight with fluid keyboard navigation and immersive focus.",
    },
    {
      key: "chat",
      name: "Chat",
      tagline: "Friendly messaging interface",
      icon: <MessageSquare className="w-4 h-4" />,
      bgClass: "bg-[#F4F9F8] border-[#D1E7E2]",
      badgeClass: "bg-[#E6F4F1] text-[#0D9488]",
      description: "Natural conversational speech bubbles that turn any inquiry into a casual, engaging dialogue.",
    },
    {
      key: "editorial",
      name: "Editorial",
      tagline: "Magazine typography & serif grace",
      icon: <ScrollText className="w-4 h-4" />,
      bgClass: "bg-[#FBF8F3] border-[#E3D8C6]",
      badgeClass: "bg-[#F3EAD8] text-[#854D0E]",
      description: "Poised serif headings, expansive whitespace, and refined literary typography for premium brands.",
    },
    {
      key: "minimal",
      name: "Minimal",
      tagline: "Zero distraction, pure clarity",
      icon: <Minimize2 className="w-4 h-4" />,
      bgClass: "bg-[#FAF8F5] border-[#EAE3D6]",
      badgeClass: "bg-[#EAE3D6] text-[#57534E]",
      description: "Stripped of all ornamentation. Pure monochrome lines and hyper-efficient data collection.",
    },
  ];

  // useEffect(() => {
  //   registerGSAP();
  //   if (prefersReducedMotion()) return;

  //   const ctx = gsap.context(() => {
  //     gsap.from(".style-card", {
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 75%",
  //       },
  //       y: 35,
  //       opacity: 0,
  //       stagger: 0.1,
  //       duration: 0.7,
  //       ease: "power3.out",
  //     });
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  return (
    <section
      ref={sectionRef}
      id="form-styles"
      className="py-24 md:py-32 bg-[#FAF8F5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <Badge
            variant="neutral"
            icon={<Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />}
            className="mb-4"
          >
            Beautiful by Default
          </Badge>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight font-normal leading-[1.1]">
            One form.{" "}
            <span className="italic font-medium text-[#FF5A36]">Five different</span>{" "}
            personalities.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#57534E] leading-relaxed">
            Every audience is unique. Switch the entire visual personality of your form in a single click without touching the question structure.
          </p>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {styles.map((style) => {
            const isActive = activeStyle === style.key;
            return (
              <button
                key={style.key}
                type="button"
                onClick={() => setActiveStyle(style.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#1C1917] text-white shadow-md scale-105"
                    : "bg-white text-[#57534E] border border-[#EAE3D6] hover:bg-[#F4EFE6] hover:text-[#1C1917]"
                }`}
              >
                {style.icon}
                <span>{style.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Main Style Showcase */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl border border-[#EAE3D6] p-6 sm:p-10 card-shadow transition-all duration-300">
            {/* Style 01: CLASSIC */}
            {activeStyle === "classic" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#FF5A36] uppercase tracking-wider">
                      Classic Theme
                    </span>
                    <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1C1917] font-medium">
                      Event RSVP & Workshop Intake
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#78716C] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#EAE3D6]">
                    Standard Layout
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#292524]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Elena Rostova"
                      className="w-full text-sm p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-[#1C1917]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#292524]">
                      Will you attend in-person or virtually?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#FFF0EB] border border-[#FF5A36] text-xs font-semibold text-[#FF5A36] flex items-center justify-between">
                        <span>In-person (San Francisco)</span>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-xs font-medium text-[#57534E]">
                        Virtual Livestream
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-full bg-[#FF5A36] text-white text-xs font-semibold"
                  >
                    Confirm RSVP
                  </button>
                </div>
              </div>
            )}

            {/* Style 02: CONVERSATION */}
            {activeStyle === "conversation" && (
              <div className="py-6 sm:py-8 space-y-6 text-center animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A36] bg-[#FFF0EB] px-3 py-1 rounded-full uppercase tracking-wider">
                  Question 1 of 4 • Press Enter ↵
                </div>
                <h3 className="font-serif-editorial text-3xl sm:text-4xl text-[#1C1917] font-medium max-w-xl mx-auto">
                  What is the primary goal of your new project?
                </h3>
                <div className="max-w-md mx-auto pt-2">
                  <input
                    type="text"
                    readOnly
                    value="Launch a high-converting waitlist page"
                    className="w-full text-base sm:text-lg p-3.5 border-b-2 border-[#FF5A36] bg-transparent text-center text-[#1C1917] font-medium focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center justify-center gap-3 pt-4 text-xs text-[#78716C]">
                  <button
                    type="button"
                    className="px-5 py-2 rounded-full bg-[#FF5A36] text-white font-semibold flex items-center gap-1.5"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Style 03: CHAT */}
            {activeStyle === "chat" && (
              <div className="space-y-4 max-w-lg mx-auto animate-in fade-in duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    IF
                  </div>
                  <div className="bg-[#E6F4F1] border border-[#B2DFDB] p-3.5 rounded-2xl rounded-tl-xs text-xs sm:text-sm text-[#004D40]">
                    👋 Hey there! Welcome to the beta. What should we call you?
                  </div>
                </div>

                <div className="flex items-start justify-end gap-3">
                  <div className="bg-[#1C1917] text-white p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm">
                    Hi! I&apos;m Jordan, founder at Acme Labs.
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#EAE3D6] flex items-center justify-center text-xs font-bold shrink-0">
                    JD
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    IF
                  </div>
                  <div className="bg-[#E6F4F1] border border-[#B2DFDB] p-3.5 rounded-2xl rounded-tl-xs text-xs sm:text-sm text-[#004D40]">
                    Awesome to meet you Jordan! What team size do you manage?
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    readOnly
                    value="10 to 50 people"
                    className="flex-1 text-xs p-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE3D6] text-[#1C1917]"
                  />
                  <button
                    type="button"
                    className="p-2.5 rounded-full bg-[#0D9488] text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Style 04: EDITORIAL */}
            {activeStyle === "editorial" && (
              <div className="space-y-6 max-w-xl mx-auto py-4 bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8DFC8] animate-in fade-in duration-300">
                <div className="text-center space-y-1">
                  <span className="font-serif-editorial italic text-xs tracking-widest text-[#854D0E] uppercase">
                    Vol. IV — Issue 2026
                  </span>
                  <h3 className="font-serif-editorial text-3xl sm:text-4xl text-[#1C1917] font-normal">
                    Creative Residency Application
                  </h3>
                  <p className="font-serif-editorial italic text-xs text-[#78716C]">
                    Please furnish your portfolio and artistic philosophy below.
                  </p>
                </div>

                <div className="space-y-3 font-serif-editorial">
                  <div className="border-b border-[#D6CEC1] pb-2">
                    <span className="text-xs uppercase text-[#78716C] tracking-wider block">
                      Candidate Portfolio Link
                    </span>
                    <span className="text-base text-[#1C1917]">
                      https://atelier-studio.design/archive
                    </span>
                  </div>
                  <div className="border-b border-[#D6CEC1] pb-2">
                    <span className="text-xs uppercase text-[#78716C] tracking-wider block">
                      Medium & Discipline
                    </span>
                    <span className="text-base text-[#1C1917]">
                      Typography, Spatial Installation, Generative Art
                    </span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-full bg-[#292524] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase font-sans-modern"
                  >
                    Submit Portfolio
                  </button>
                </div>
              </div>
            )}

            {/* Style 05: MINIMAL */}
            {activeStyle === "minimal" && (
              <div className="space-y-6 max-w-lg mx-auto py-4 animate-in fade-in duration-300 font-mono text-xs">
                <div className="border-b border-black pb-2 flex justify-between items-baseline">
                  <span className="font-bold uppercase tracking-widest text-black">
                    FEEDBACK_V1.0
                  </span>
                  <span className="text-[#78716C]">[STATUS: READY]</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-black font-bold">01.</span>
                    <span className="text-[#1C1917]">Rate API reliability (1-5):</span>
                    <span className="ml-auto font-bold text-black">[ 5 / 5 ]</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-black font-bold">02.</span>
                    <span className="text-[#1C1917]">Latency satisfaction:</span>
                    <span className="ml-auto font-bold text-black">[ 12ms OK ]</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-black flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-wider"
                  >
                    SEND_PAYLOAD
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5 Distinct Form Cards Horizontal / Responsive Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {styles.map((style) => {
            const isSelected = activeStyle === style.key;
            return (
              <div
                key={style.key}
                onClick={() => setActiveStyle(style.key)}
                className={`style-card p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-[#FF5A36] shadow-lg shadow-[#FF5A36]/10 -translate-y-1"
                    : "bg-white/80 border-[#EAE3D6] hover:bg-white hover:border-[#D6CEC1]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] flex items-center justify-center text-[#FF5A36]">
                      {style.icon}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#FF5A36] bg-[#FFF0EB] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif-editorial text-lg text-[#1C1917] font-medium">
                    {style.name}
                  </h4>
                  <p className="text-[11px] text-[#78716C] mt-1 leading-snug">
                    {style.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE3D6]/70 flex items-center justify-between text-[11px] font-semibold text-[#57534E]">
                  <span>Preview</span>
                  <ArrowRight className="w-3 h-3 text-[#FF5A36]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
