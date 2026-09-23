"use client";

import React, { useEffect, useRef } from "react";
import { Badge } from "../ui/Badge";
import {
  Sparkles,
  Clock,
  ArrowUpRight,
  Download,
  Calendar,
} from "lucide-react";
import { registerGSAP, prefersReducedMotion, gsap } from "@/lib/animations/gsapUtils";

export function AnalyticsPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from("#analytics-dashboard", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      // Animate progress bar widths
      gsap.from(".completion-bar-fill", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        width: "0%",
        duration: 1.2,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const recentResponses = [
    {
      name: "Sarah M.",
      time: "2 min ago",
      rating: "5/5",
      badge: "Promoter",
      comment: "Super smooth on mobile. Took less than 30s!",
      avatarBg: "bg-emerald-100 text-emerald-800",
    },
    {
      name: "John D.",
      time: "8 min ago",
      rating: "5/5",
      badge: "Promoter",
      comment: "Loved the clean typography and warm color palette.",
      avatarBg: "bg-orange-100 text-orange-800",
    },
    {
      name: "Maria K.",
      time: "14 min ago",
      rating: "4/5",
      badge: "Passive",
      comment: "Quick flow, easy questions, clear layout.",
      avatarBg: "bg-blue-100 text-blue-800",
    },
    {
      name: "Alex R.",
      time: "21 min ago",
      rating: "5/5",
      badge: "Promoter",
      comment: "Much better than standard generic survey tools.",
      avatarBg: "bg-purple-100 text-purple-800",
    },
  ];

  const chartBars = [
    { day: "Mon", height: "45%", count: 180 },
    { day: "Tue", height: "65%", count: 240 },
    { day: "Wed", height: "55%", count: 210 },
    { day: "Thu", height: "85%", count: 320 },
    { day: "Fri", height: "95%", count: 390 },
    { day: "Sat", height: "40%", count: 160 },
    { day: "Sun", height: "50%", count: 184 },
  ];

  return (
    <section
      ref={sectionRef}
      id="analytics"
      className="py-24 md:py-32 bg-white relative border-b border-[#EAE3D6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge
            variant="coral"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            className="mb-4"
          >
            Responses, Without the Headache
          </Badge>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight font-normal leading-[1.1]">
            See what people are{" "}
            <span className="italic font-medium text-[#FF5A36]">actually saying</span>.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#57534E] leading-relaxed">
            Forget messy spreadsheets. InstantForm compiles your metrics into clear visual summaries with instant sentiment signals.
          </p>
        </div>

        {/* Large Dashboard Visual Card */}
        <div
          id="analytics-dashboard"
          className="max-w-5xl mx-auto bg-[#FAF8F5] rounded-3xl border border-[#EAE3D6] p-6 sm:p-9 card-shadow hover:card-shadow-hover transition-all duration-300 relative overflow-hidden"
        >
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE3D6] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1C1917] font-medium">
                  Customer Satisfaction Q3
                </h3>
              </div>
              <p className="text-xs text-[#78716C] mt-1 flex items-center gap-2">
                <span>Active form</span> •{" "}
                <span className="font-mono">instantform.io/f/csat-q3</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#57534E] bg-white px-3 py-1.5 rounded-full border border-[#EAE3D6] flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#FF5A36]" /> Last 7 Days
              </span>
              <button
                type="button"
                className="text-xs text-[#57534E] bg-white px-3 py-1.5 rounded-full border border-[#EAE3D6] hover:bg-[#FFF0EB] hover:text-[#FF5A36] flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {/* Top Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 my-6">
            {/* Metric 1: Total Responses */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D6] card-shadow">
              <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                <span>Total Responses</span>
                <span className="text-[#22C55E] flex items-center gap-0.5 bg-[#ECFDF5] px-2 py-0.5 rounded-full font-bold">
                  <ArrowUpRight className="w-3 h-3" /> +18.4%
                </span>
              </div>
              <div className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] mt-2">
                1,284
              </div>
              <p className="text-[11px] text-[#78716C] mt-1">
                +204 compared to previous week
              </p>
            </div>

            {/* Metric 2: Completion Rate */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D6] card-shadow">
              <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                <span>Completion Rate</span>
                <span className="text-[#FF5A36] bg-[#FFF0EB] px-2 py-0.5 rounded-full font-bold">
                  High
                </span>
              </div>
              <div className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] mt-2">
                82%
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#FAF8F5] h-2 rounded-full mt-2.5 overflow-hidden border border-[#EAE3D6]">
                <div
                  className="completion-bar-fill bg-gradient-to-r from-[#FF5A36] to-[#FFA07A] h-full rounded-full"
                  style={{ width: "82%" }}
                />
              </div>
            </div>

            {/* Metric 3: Avg Time to Fill */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D6] card-shadow">
              <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                <span>Average Time</span>
                <Clock className="w-3.5 h-3.5 text-[#FF5A36]" />
              </div>
              <div className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] mt-2">
                42 sec
              </div>
              <p className="text-[11px] text-[#78716C] mt-1">
                Fast respondent throughput
              </p>
            </div>
          </div>

          {/* Activity Chart & Recent Submissions 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart Area: 7 cols */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#EAE3D6] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                  Weekly Submissions Volume
                </span>
                <span className="text-[11px] text-[#78716C]">Daily Trend</span>
              </div>

              {/* Bar visualization */}
              <div className="flex items-end justify-between gap-2 h-40 pt-4 px-2">
                {chartBars.map((bar, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                  >
                    <div className="text-[10px] text-[#78716C] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      {bar.count}
                    </div>
                    <div
                      className="w-full bg-[#FFF0EB] hover:bg-[#FF5A36] border border-[#FFD8CC] rounded-t-lg transition-all duration-200 cursor-pointer"
                      style={{ height: bar.height }}
                    />
                    <span className="text-[11px] font-medium text-[#78716C]">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Submissions List: 5 cols */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#EAE3D6]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                  Recent Submissions
                </span>
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              </div>

              <div className="space-y-3">
                {recentResponses.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] space-y-1 hover:border-[#D6CEC1] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${item.avatarBg}`}
                        >
                          {item.name.substring(0, 2)}
                        </span>
                        <span className="text-xs font-semibold text-[#1C1917]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#78716C] font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#57534E] pl-8 truncate">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
