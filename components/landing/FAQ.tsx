"use client";

import React, { useState } from "react";
import { Badge } from "../ui/Badge";
import { HelpCircle, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Do I need an account to create a form?",
      answer:
        "No! You can jump straight into the canvas and start designing your form immediately without signing up. When you are ready to publish and collect live responses, you can connect an account in one click to retain your custom link.",
    },
    {
      id: 2,
      question: "How quickly can I publish a form?",
      answer:
        "Most users go from an empty canvas or pre-built template to a published, shareable URL in under 60 seconds. There are zero cumbersome settings or mandatory configurations required.",
    },
    {
      id: 3,
      question: "What types of fields are supported?",
      answer:
        "InstantForm supports 20+ versatile field types including Short Text, Long Notes, Verified Email, Phone Number, Star & Emoji Ratings, Multiple Choice, Dropdown Selectors, Date/Time pickers, File Uploads, Net Promoter Score (NPS), and Digital Signatures.",
    },
    {
      id: 4,
      question: "Can I customize how my form looks?",
      answer:
        "Absolutely. Choose from 5 signature layout personalities (Classic, Conversation, Chat, Editorial, and Minimal) and select curated color palettes or define your own custom hex codes, typography weights, and background treatments.",
    },
    {
      id: 5,
      question: "Can I share my form?",
      answer:
        "Yes! Every form generates a clean, short public link (e.g. instantform.io/f/your-slug), a high-resolution QR code, and lightweight embed code snippets for Notion, WordPress, Webflow, React, or standard HTML sites.",
    },
    {
      id: 6,
      question: "Can I view responses?",
      answer:
        "Yes. Responses stream directly into your focused InstantForm dashboard in real-time. You can filter submissions, review summary charts, download CSV exports, or trigger webhooks to tools like Slack, Zapier, and Google Sheets.",
    },
    {
      id: 7,
      question: "Does InstantForm support dark mode?",
      answer:
        "Yes. InstantForm provides full support for Light, Velvet Dark, and System preference-based themes, ensuring your forms look stunning in any environment.",
    },
    {
      id: 8,
      question: "Does InstantForm support Bangla?",
      answer:
        "Yes! English and Bangla (বাংলা) are planned initial first-class languages, complete with native typography pairing, bidirectional UTF-8 support, and localized validation messages.",
    },
  ];

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="py-24 md:py-32 bg-[#FAF8F5] dark:bg-[#0B0F17] relative overflow-hidden transition-colors duration-200"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <Badge
            variant="neutral"
            icon={<HelpCircle className="w-3.5 h-3.5 text-[#FF5A36]" />}
            className="mb-4"
          >
            FAQ
          </Badge>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl text-[#1C1917] dark:text-[#F8FAFC] tracking-tight font-normal leading-[1.1]">
            Questions? We&apos;ve got{" "}
            <span className="italic font-medium text-[#FF5A36]">answers</span>.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#57534E] dark:text-[#94A3B8] leading-relaxed">
            Everything you need to know about creating, publishing, and scaling with InstantForm.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={clsx(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "bg-white dark:bg-[#111827] border-[#FF5A36] shadow-sm shadow-[#FF5A36]/10"
                    : "bg-white/80 dark:bg-[#111827]/80 border-[#EAE3D6] dark:border-[#1F2937] hover:bg-white dark:hover:bg-[#161F30] hover:border-[#D6CEC1] dark:hover:border-[#293548]"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                >
                  <span className="font-serif-editorial text-lg sm:text-xl text-[#1C1917] dark:text-[#F8FAFC] font-medium leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300",
                      isOpen
                        ? "bg-[#FFF0EB] dark:bg-[#FF5A36]/20 border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] rotate-180"
                        : "bg-[#FAF8F5] dark:bg-[#161F30] border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8]"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-[#57534E] dark:text-[#94A3B8] leading-relaxed border-t border-[#FAF8F5] dark:border-[#1F2937] animate-in fade-in duration-200">
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
