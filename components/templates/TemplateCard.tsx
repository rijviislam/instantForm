"use client";

import React from "react";
import { Sparkles, Eye, Star, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TemplateItem } from "@/lib/api-client";
import { resolveFormTheme, FormTheme } from "@/lib/form-theme";
import { DynamicFontLoader } from "@/components/builder/DynamicFontLoader";

interface TemplateCardProps {
  template: TemplateItem;
  isUsing: boolean;
  onUseTemplate: (template: TemplateItem) => void;
  onPreview: (template: TemplateItem) => void;
}

const STYLE_BADGES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Editorial: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800/40", dot: "bg-purple-500" },
  Conversion: { bg: "bg-[#FFF0EB] dark:bg-[#FF5A36]/15", text: "text-[#FF5A36] dark:text-[#FF6B4A]", border: "border-[#FFD8CC] dark:border-[#FF5A36]/30", dot: "bg-[#FF5A36]" },
  Interactive: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800/40", dot: "bg-indigo-500" },
  Professional: { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-700 dark:text-teal-300", border: "border-teal-200 dark:border-teal-800/40", dot: "bg-teal-500" },
  Conversation: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800/40", dot: "bg-amber-500" },
  Minimal: { bg: "bg-slate-100 dark:bg-slate-800/50", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700", dot: "bg-slate-500" },
  Classic: { bg: "bg-[#FFF0EB] dark:bg-[#FF5A36]/15", text: "text-[#FF5A36] dark:text-[#FF6B4A]", border: "border-[#FFD8CC] dark:border-[#FF5A36]/30", dot: "bg-[#FF5A36]" },
  Chat: { bg: "bg-sky-50 dark:bg-sky-950/40", text: "text-sky-700 dark:text-sky-300", border: "border-sky-200 dark:border-sky-800/40", dot: "bg-sky-500" },
};

function getBackgroundStyle(theme: FormTheme): React.CSSProperties {
  const bg = theme.background;
  if (bg?.type === "gradient" && bg.gradientFrom && bg.gradientTo) {
    const dir = bg.gradientDirection || "135deg";
    if (bg.gradientVia) {
      return { background: `linear-gradient(${dir}, ${bg.gradientFrom}, ${bg.gradientVia}, ${bg.gradientTo})` };
    }
    return { background: `linear-gradient(${dir}, ${bg.gradientFrom}, ${bg.gradientTo})` };
  }
  if (bg?.color) {
    return { backgroundColor: bg.color };
  }
  return { backgroundColor: "#FAF8F5" };
}

function getRadiusCss(radius?: string): string {
  switch (radius) {
    case "none": return "0px";
    case "sm": return "4px";
    case "md": return "6px";
    case "lg": return "8px";
    case "xl": return "12px";
    case "2xl": return "16px";
    case "3xl": return "24px";
    case "full": return "9999px";
    default: return "12px";
  }
}

export function TemplateCard({
  template,
  isUsing,
  onUseTemplate,
  onPreview,
}: TemplateCardProps) {
  const resolvedTheme = resolveFormTheme(template.theme, template.style as any);
  const badge = STYLE_BADGES[template.style] || STYLE_BADGES.Classic;
  const bgStyle = getBackgroundStyle(resolvedTheme);
  
  const headingFont = resolvedTheme.typography?.headingFont || resolvedTheme.typography?.fontFamily || "inherit";
  const bodyFont = resolvedTheme.typography?.fontFamily || "inherit";
  const primaryColor = resolvedTheme.colors?.primary || "#FF5A36";
  const btnBg = resolvedTheme.buttons?.backgroundColor || primaryColor;
  const btnTextColor = resolvedTheme.buttons?.textColor || "#FFFFFF";
  const btnRadius = getRadiusCss(resolvedTheme.buttons?.borderRadius);
  const containerBg = resolvedTheme.container?.backgroundColor || "#FFFFFF";
  const containerBorder = resolvedTheme.container?.borderColor || "#EAE3D6";
  const containerRadius = getRadiusCss(resolvedTheme.container?.borderRadius);
  const inputBg = resolvedTheme.inputs?.backgroundColor || "#FAF8F5";
  const inputBorder = resolvedTheme.inputs?.borderColor || "#EAE3D6";
  const inputRadius = getRadiusCss(resolvedTheme.inputs?.borderRadius);

  return (
    <div className="group rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 sm:p-7 card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      <DynamicFontLoader theme={resolvedTheme} />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF0EB] dark:bg-[#FF5A36]/15 text-[#FF5A36] dark:text-[#FF6B4A] border border-[#FFD8CC] dark:border-[#FF5A36]/30">
            {template.category}
          </span>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {template.style} Style
          </span>
        </div>

        {/* Visual Mini-Mockup Preview Container showing authentic theme styles */}
        <div
          onClick={() => onPreview(template)}
          style={bgStyle}
          className="relative rounded-2xl border border-[#EAE3D6]/80 dark:border-[#1F2937]/80 p-4 mb-5 cursor-pointer overflow-hidden transition-all group-hover:shadow-md group-hover:scale-[1.01]"
        >
          {/* Inner Form Card Mockup */}
          <div
            style={{
              backgroundColor: containerBg,
              borderColor: containerBorder,
              borderRadius: containerRadius,
            }}
            className="p-3.5 border shadow-2xs space-y-2.5 transition-all"
          >
            {/* Form Title & Description in theme font */}
            <div className="space-y-1">
              <div
                style={{ fontFamily: headingFont }}
                className="text-[13px] font-semibold text-[#1C1917] line-clamp-1 leading-snug"
              >
                {template.title}
              </div>
              <div
                style={{ fontFamily: bodyFont }}
                className="text-[10px] text-[#78716C] line-clamp-1"
              >
                {template.description}
              </div>
            </div>

            {/* Field Mockup Snippet */}
            <div className="space-y-1.5 pt-1">
              {template.fields.slice(0, 2).map((field, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: inputBg,
                    borderColor: inputBorder,
                    borderRadius: inputRadius,
                    fontFamily: bodyFont,
                  }}
                  className="p-2 border text-[10px] space-y-1"
                >
                  <div className="font-medium text-[#1C1917] line-clamp-1 flex items-center justify-between">
                    <span>{field.label}</span>
                    {field.required && <span style={{ color: primaryColor }}>*</span>}
                  </div>

                  {field.type === "rating" ? (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} style={{ color: primaryColor, fill: primaryColor }} className="w-2.5 h-2.5" />
                      ))}
                    </div>
                  ) : field.type === "multiple_choice" || field.type === "checkboxes" ? (
                    <div className="flex items-center gap-1.5 text-[9px] text-[#57534E]">
                      <div
                        style={{
                          borderRadius: field.type === "checkboxes" ? "3px" : "9999px",
                          borderColor: primaryColor,
                        }}
                        className="w-2.5 h-2.5 border"
                      />
                      <span className="line-clamp-1">{field.options?.[0] || "Option 1"}</span>
                    </div>
                  ) : (
                    <div className="text-[9px] text-[#A8A29E] line-clamp-1">
                      {field.placeholder || "Enter response..."}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Button Mockup */}
            <div className="pt-1 flex justify-end">
              <div
                style={{
                  backgroundColor: btnBg,
                  color: btnTextColor,
                  borderRadius: btnRadius,
                  fontFamily: headingFont,
                }}
                className="px-3 py-1 text-[10px] font-semibold flex items-center gap-1 shadow-2xs"
              >
                <span>Submit</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          {/* Hover Preview Overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1E293B] text-[#1C1917] dark:text-[#F8FAFC] text-xs font-semibold shadow-md flex items-center gap-1.5 border border-[#EAE3D6] dark:border-[#334155] animate-in zoom-in-95">
              <Eye className="w-3.5 h-3.5 text-[#FF5A36]" />
              Quick Preview
            </span>
          </div>
        </div>

        {/* Template Title & Description in Gallery Card */}
        <h3
          style={{ fontFamily: headingFont }}
          className="text-xl sm:text-2xl text-[#1C1917] dark:text-[#F8FAFC] font-medium group-hover:text-[#FF5A36] dark:group-hover:text-[#FF6B4A] transition-colors leading-snug"
        >
          {template.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
          {template.description}
        </p>

        {/* Font & Design Tag Indicator */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] text-[#78716C] dark:text-[#94A3B8]">
          <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548]">
            Font: <strong className="text-[#1C1917] dark:text-[#F8FAFC] font-medium">{headingFont}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] flex items-center gap-1">
            Accent:
            <span className="w-2.5 h-2.5 rounded-full inline-block border border-black/10" style={{ backgroundColor: primaryColor }} />
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-[#EAE3D6] dark:border-[#1F2937] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="text-xs font-semibold text-[#57534E] dark:text-[#94A3B8] hover:text-[#FF5A36] dark:hover:text-[#FF6B4A] px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onUseTemplate(template)}
          disabled={isUsing}
          iconLeft={
            isUsing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )
          }
          className="group-hover:bg-[#FF5A36] group-hover:text-white group-hover:border-[#FF5A36] transition-all"
        >
          {isUsing ? "Creating Form..." : "Use Template"}
        </Button>
      </div>
    </div>
  );
}
