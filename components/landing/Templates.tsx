"use client";

import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Eye,
  Headphones,
  HelpCircle,
  Mail,
  MessageSquare,
  Smile,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface TemplateItem {
  id: string;
  name: string;
  category: "Feedback" | "Business" | "Events" | "Hiring" | "Growth";
  description: string;
  questionsCount: number;
  timeToFill: string;
  badgeColor: string;
  icon: React.ReactNode;
  sampleFields: string[];
}

export function Templates() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);

  const categories = ["All", "Feedback", "Events", "Business", "Hiring", "Growth"];

  const templates: TemplateItem[] = [
    {
      id: "customer-feedback",
      name: "Customer Feedback",
      category: "Feedback",
      description: "Measure Net Promoter Score, feature satisfaction, and open-ended impressions.",
      questionsCount: 4,
      timeToFill: "45 sec",
      badgeColor: "bg-[#FFF0EB] text-[#FF5A36] border-[#FFD8CC]",
      icon: <Smile className="w-5 h-5 text-[#FF5A36]" />,
      sampleFields: ["Overall Experience (1-5★)", "Key highlights", "Feature wishlist", "Email"],
    },
    {
      id: "quick-survey",
      name: "Quick Survey",
      category: "Feedback",
      description: "Bite-sized pulse checks with zero friction to maximize completion rates.",
      questionsCount: 3,
      timeToFill: "30 sec",
      badgeColor: "bg-[#F4EFE6] text-[#292524] border-[#E7E2D8]",
      icon: <ClipboardList className="w-5 h-5 text-[#292524]" />,
      sampleFields: ["Role in company", "Primary workflow tool", "Single improvement request"],
    },
    {
      id: "event-registration",
      name: "Event Registration",
      category: "Events",
      description: "RSVP collection with attendee dietary preferences, ticketing, and workshop choices.",
      questionsCount: 5,
      timeToFill: "1 min",
      badgeColor: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
      icon: <Calendar className="w-5 h-5 text-[#2563EB]" />,
      sampleFields: ["Full name", "Work email", "Attending in-person / online", "Breakout session"],
    },
    {
      id: "job-application",
      name: "Job Application",
      category: "Hiring",
      description: "Structured intake for candidates with resume attachment, portfolio link, and cover notes.",
      questionsCount: 6,
      timeToFill: "2 min",
      badgeColor: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]",
      icon: <Briefcase className="w-5 h-5 text-[#7C3AED]" />,
      sampleFields: ["Candidate Name", "Portfolio URL", "Years of experience", "Resume file upload"],
    },
    {
      id: "lead-capture",
      name: "Lead Capture",
      category: "Growth",
      description: "High-converting inquiry form with smart qualification and company enrichment fields.",
      questionsCount: 4,
      timeToFill: "45 sec",
      badgeColor: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
      icon: <Target className="w-5 h-5 text-[#D97706]" />,
      sampleFields: ["Company domain", "Estimated budget", "Project timeline", "Contact phone"],
    },
    {
      id: "product-feedback",
      name: "Product Feedback",
      category: "Feedback",
      description: "Deep-dive usability surveys for product managers and UX research teams.",
      questionsCount: 5,
      timeToFill: "1 min",
      badgeColor: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
      icon: <MessageSquare className="w-5 h-5 text-[#059669]" />,
      sampleFields: ["Feature tested", "Ease of navigation", "Blockers encountered", "Screenshot upload"],
    },
    {
      id: "contact-us",
      name: "Contact Us",
      category: "Business",
      description: "Warm, polite inbound message portal that routes queries to the appropriate team.",
      questionsCount: 4,
      timeToFill: "40 sec",
      badgeColor: "bg-[#FAF8F5] text-[#57534E] border-[#EAE3D6]",
      icon: <Mail className="w-5 h-5 text-[#57534E]" />,
      sampleFields: ["Your name", "Email address", "Inquiry department", "Message text"],
    },
    {
      id: "quiz",
      name: "Interactive Quiz",
      category: "Growth",
      description: "Scored interactive questions that engage respondents and deliver instant tailored outcomes.",
      questionsCount: 6,
      timeToFill: "90 sec",
      badgeColor: "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]",
      icon: <HelpCircle className="w-5 h-5 text-[#E11D48]" />,
      sampleFields: ["Knowledge checks", "Multiple choice matrix", "Instant calculated scorecard"],
    },
    {
      id: "customer-support",
      name: "Customer Support",
      category: "Business",
      description: "Issue ticket creator with severity levels, platform versioning, and bug reporting.",
      questionsCount: 5,
      timeToFill: "1 min",
      badgeColor: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
      icon: <Headphones className="w-5 h-5 text-[#16A34A]" />,
      sampleFields: ["Account ID", "Urgency level", "Error code / details", "Device environment"],
    },
  ];

  const filteredTemplates =
    activeCategory === "All"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  // useEffect(() => {
  //   registerGSAP();
  //   if (prefersReducedMotion()) return;

  //   const ctx = gsap.context(() => {
  //     gsap.from(".template-card", {
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 75%",
  //       },
  //       y: 35,
  //       opacity: 0,
  //       stagger: 0.08,
  //       duration: 0.6,
  //       ease: "power3.out",
  //     });
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, [activeCategory]);

  return (
    <section
      ref={sectionRef}
      id="templates"
      className="py-24 md:py-32 bg-[#FAF8F5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge
            variant="coral"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            className="mb-4"
          >
            Start With a Template
          </Badge>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight font-normal leading-[1.1]">
            Don&apos;t start from{" "}
            <span className="italic font-medium text-[#FF5A36]">scratch</span>.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#57534E] leading-relaxed">
            Choose from battle-tested layouts crafted by design experts. Customise fonts, colors, and questions in seconds.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#1C1917] text-white shadow-xs"
                  : "bg-white text-[#57534E] border border-[#EAE3D6] hover:bg-[#F4EFE6] hover:text-[#1C1917]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 9 Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="template-card group bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D6] card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Icon & Metadata badges */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D6] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {template.icon}
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${template.badgeColor}`}
                  >
                    {template.category}
                  </span>
                </div>

                {/* Template Name & Description */}
                <h3 className="font-serif-editorial text-2xl text-[#1C1917] font-medium group-hover:text-[#FF5A36] transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] mt-2 leading-relaxed">
                  {template.description}
                </p>

                {/* Mini Preview Box */}
                <div className="mt-5 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                    <span>{template.questionsCount} Questions</span>
                    <span>~{template.timeToFill} to complete</span>
                  </div>
                  <div className="space-y-1">
                    {template.sampleFields.slice(0, 2).map((field, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-[#1C1917] bg-white px-2.5 py-1 rounded-lg border border-[#EAE3D6] truncate flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36]" />
                        {field}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA Action Button */}
              <div className="mt-6 pt-4 border-t border-[#EAE3D6] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(template)}
                  className="text-xs font-semibold text-[#57534E] hover:text-[#FF5A36] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Quick preview
                </button>

                <Button
                  variant="secondary"
                  size="sm"
                  className="group-hover:bg-[#FF5A36] group-hover:text-white group-hover:border-[#FF5A36] transition-all"
                  iconRight={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedTemplate(template)}
                >
                  Use template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Template Quick Preview Modal */}
      {selectedTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedTemplate.name} preview`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl border border-[#EAE3D6] max-w-lg w-full p-6 sm:p-8 card-shadow-hover relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF8F5] border border-[#EAE3D6] text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
              aria-label="Close template preview"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0EB] text-[#FF5A36] flex items-center justify-center">
                {selectedTemplate.icon}
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#FF5A36] uppercase tracking-wider">
                  {selectedTemplate.category} Template
                </span>
                <h3 className="font-serif-editorial text-2xl text-[#1C1917] font-medium">
                  {selectedTemplate.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#57534E] mb-5">
              {selectedTemplate.description}
            </p>

            <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE3D6] mb-6">
              <p className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Included Question Modules:
              </p>
              <div className="space-y-2">
                {selectedTemplate.sampleFields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-xl border border-[#EAE3D6] text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-[#1C1917]">{field}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => setSelectedTemplate(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                iconRight={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setSelectedTemplate(null);
                  const el = document.getElementById("hero-preview");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Customize form
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
