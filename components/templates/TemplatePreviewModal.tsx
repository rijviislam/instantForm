"use client";

import React, { useEffect } from "react";
import { X, Sparkles, Star, Loader2, ArrowRight, Check, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TemplateItem } from "@/lib/api-client";
import { resolveFormTheme, FormTheme } from "@/lib/form-theme";
import { DynamicFontLoader } from "@/components/builder/DynamicFontLoader";

interface TemplatePreviewModalProps {
  template: TemplateItem | null;
  isOpen: boolean;
  isUsing: boolean;
  onUseTemplate: (template: TemplateItem) => void;
  onClose: () => void;
}

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

export function TemplatePreviewModal({
  template,
  isOpen,
  isUsing,
  onUseTemplate,
  onClose,
}: TemplatePreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isUsing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isUsing, onClose]);

  if (!isOpen || !template) return null;

  const resolvedTheme = resolveFormTheme(template.theme, template.style as any);
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
  const inputTextColor = resolvedTheme.inputs?.textColor || "#1C1917";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <DynamicFontLoader theme={resolvedTheme} />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isUsing) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] shadow-2xl z-10 my-auto overflow-hidden animate-in zoom-in-95 fade-in duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#EAE3D6] dark:border-[#1F2937] bg-white dark:bg-[#111827] shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF0EB] dark:bg-[#FF5A36]/15 text-[#FF5A36] dark:text-[#FF6B4A] border border-[#FFD8CC] dark:border-[#FF5A36]/30">
              {template.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF8F5] dark:bg-[#1E293B] text-[#57534E] dark:text-[#94A3B8] border border-[#EAE3D6] dark:border-[#334155]">
              {template.style} Style
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              Font: {headingFont}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#334155] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Form Interactive Mockup Preview with Theme Styling */}
        <div
          style={bgStyle}
          className="p-4 sm:p-8 space-y-6 overflow-y-auto flex-1 transition-all"
        >
          {/* Card Container styled by theme */}
          <div
            style={{
              backgroundColor: containerBg,
              borderColor: containerBorder,
              borderRadius: containerRadius,
            }}
            className="max-w-xl mx-auto p-6 sm:p-8 border shadow-sm space-y-6 transition-all"
          >
            {/* Header / Title */}
            <div className="text-center space-y-2 pb-2">
              <h2
                style={{ fontFamily: headingFont }}
                className="text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight leading-snug"
              >
                {template.title}
              </h2>
              <p
                style={{ fontFamily: bodyFont }}
                className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto"
              >
                {template.description}
              </p>
            </div>

            {/* Form Fields Simulation */}
            <div className="space-y-4">
              {template.fields.map((field, index) => (
                <div
                  key={field.id || index}
                  style={{
                    backgroundColor: inputBg,
                    borderColor: inputBorder,
                    borderRadius: inputRadius,
                    fontFamily: bodyFont,
                  }}
                  className="p-4 border space-y-2.5 transition-all shadow-2xs"
                >
                  <label
                    style={{ color: inputTextColor }}
                    className="block text-xs font-semibold"
                  >
                    {field.label}
                    {field.required && <span style={{ color: primaryColor }} className="ml-1">*</span>}
                  </label>

                  {/* Rating Field */}
                  {field.type === "rating" && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          style={{
                            borderColor: inputBorder,
                            borderRadius: getRadiusCss(resolvedTheme.inputs?.borderRadius),
                          }}
                          className="w-9 h-9 bg-white border flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                        >
                          <Star style={{ color: primaryColor, fill: primaryColor }} className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Multiple Choice Field */}
                  {field.type === "multiple_choice" && (
                    <div className="space-y-2 pt-1">
                      {field.options?.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          style={{
                            borderColor: oIdx === 0 ? primaryColor : inputBorder,
                            backgroundColor: oIdx === 0 ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                            borderRadius: getRadiusCss(resolvedTheme.inputs?.borderRadius),
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 border text-xs text-[#1C1917] cursor-pointer hover:border-black/30 transition-colors"
                        >
                          <div
                            style={{
                              borderColor: oIdx === 0 ? primaryColor : "#D6D3D1",
                              backgroundColor: oIdx === 0 ? primaryColor : "transparent",
                            }}
                            className="w-4 h-4 rounded-full border flex items-center justify-center text-white"
                          >
                            {oIdx === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className="font-medium">{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Checkboxes Field */}
                  {field.type === "checkboxes" && (
                    <div className="space-y-2 pt-1">
                      {field.options?.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          style={{
                            borderColor: oIdx === 0 ? primaryColor : inputBorder,
                            backgroundColor: oIdx === 0 ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                            borderRadius: getRadiusCss(resolvedTheme.inputs?.borderRadius),
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 border text-xs text-[#1C1917] cursor-pointer hover:border-black/30 transition-colors"
                        >
                          <div
                            style={{
                              borderColor: oIdx === 0 ? primaryColor : "#D6D3D1",
                              backgroundColor: oIdx === 0 ? primaryColor : "transparent",
                            }}
                            className="w-4 h-4 rounded-md border flex items-center justify-center text-white"
                          >
                            {oIdx === 0 && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-medium">{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dropdown Field */}
                  {field.type === "dropdown" && (
                    <div
                      style={{
                        borderColor: inputBorder,
                        borderRadius: getRadiusCss(resolvedTheme.inputs?.borderRadius),
                      }}
                      className="px-3 py-2.5 bg-white border text-xs text-[#57534E] flex items-center justify-between"
                    >
                      <span>{field.placeholder || "Select an option..."}</span>
                      <span className="text-xs">▼</span>
                    </div>
                  )}

                  {/* Text / Phone / URL / Number */}
                  {(field.type === "short_text" || field.type === "phone" || field.type === "url" || field.type === "number") && (
                    <div
                      style={{
                        borderColor: inputBorder,
                        borderRadius: getRadiusCss(resolvedTheme.inputs?.borderRadius),
                      }}
                      className="px-3 py-2.5 bg-white border text-xs text-[#78716C]"
                    >
                      {field.placeholder || (field.type === "phone" ? "+1 (555) 000-0000" : field.type === "url" ? "https://..." : field.type === "number" ? "42" : "Enter response...")}
                    </div>
                  )}

                  {/* Email Field */}
                  {field.type === "email" && (
                    <div
                      style={{
                        borderColor: inputBorder,
                        borderRadius: getRadiusCss(resolvedTheme.inputs?.borderRadius),
                      }}
                      className="px-3 py-2.5 bg-white border text-xs text-[#78716C]"
                    >
                      {field.placeholder || "name@company.com"}
                    </div>
                  )}

                  {/* Long Text Field */}
                  {field.type === "long_text" && (
                    <div
                      style={{
                        borderColor: inputBorder,
                        borderRadius: getRadiusCss(resolvedTheme.inputs?.borderRadius),
                      }}
                      className="px-3 py-2.5 h-20 bg-white border text-xs text-[#78716C]"
                    >
                      {field.placeholder || "Type your detailed answer here..."}
                    </div>
                  )}

                  {/* File Upload Field */}
                  {(field.type === "file_upload" || field.type === "image_upload") && (
                    <div
                      style={{
                        borderColor: inputBorder,
                        borderRadius: getRadiusCss(resolvedTheme.inputs?.borderRadius),
                      }}
                      className="p-4 bg-white border border-dashed text-xs text-[#78716C] flex flex-col items-center justify-center gap-1 text-center"
                    >
                      <UploadCloud className="w-5 h-5 text-[#78716C]" />
                      <span className="font-medium text-[#1C1917]">Drag and drop files here, or browse</span>
                      <span className="text-[10px]">PDF, PNG, JPG up to 10MB</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Simulation Form Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                style={{
                  backgroundColor: btnBg,
                  color: btnTextColor,
                  borderRadius: btnRadius,
                  fontFamily: headingFont,
                }}
                className="w-full py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-opacity cursor-pointer"
              >
                <span>Submit Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-t border-[#EAE3D6] dark:border-[#1F2937] bg-white dark:bg-[#111827] shrink-0">
          <p className="text-xs text-[#57534E] dark:text-[#94A3B8]">
            {template.fields.length} {template.fields.length === 1 ? "field" : "fields"} included
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isUsing}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
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
              className="shadow-md shadow-[#FF5A36]/20"
            >
              {isUsing ? "Creating Form..." : "Use This Template"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


