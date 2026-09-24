"use client";

import React, { useEffect } from "react";
import { X, Sparkles, Star, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TemplateItem } from "@/lib/api-client";

interface TemplatePreviewModalProps {
  template: TemplateItem | null;
  isOpen: boolean;
  isUsing: boolean;
  onUseTemplate: (template: TemplateItem) => void;
  onClose: () => void;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isUsing) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl rounded-3xl bg-white border border-[#EAE3D6] shadow-2xl z-10 my-auto overflow-hidden animate-in zoom-in-95 fade-in duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EAE3D6]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF0EB] text-[#FF5A36] border border-[#FFD8CC]">
              {template.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#57534E] border border-[#EAE3D6]">
              {template.style} Style
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#57534E] hover:text-[#1C1917] bg-[#FAF8F5] border border-[#EAE3D6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Form Interactive Mockup Preview */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto bg-[#FAF8F5]">
          <div className="text-center max-w-md mx-auto space-y-2">
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
              {template.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              {template.description}
            </p>
          </div>

          {/* Form Fields Simulation */}
          <div className="space-y-4 max-w-md mx-auto">
            {template.fields.map((field, index) => (
              <div
                key={field.id || index}
                className="p-4 rounded-2xl bg-white border border-[#EAE3D6] space-y-2 shadow-2xs"
              >
                <label className="block text-xs font-semibold text-[#1C1917]">
                  {field.label}
                  {field.required && <span className="text-[#FF5A36] ml-1">*</span>}
                </label>

                {field.type === "rating" && (
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EAE3D6] flex items-center justify-center text-amber-400"
                      >
                        <Star className="w-4 h-4 fill-amber-400" />
                      </div>
                    ))}
                  </div>
                )}

                {field.type === "multiple_choice" && (
                  <div className="space-y-2 pt-1">
                    {field.options?.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-xs text-[#57534E]"
                      >
                        <div className="w-3.5 h-3.5 rounded-full border border-[#D6D3D1]" />
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === "short_text" && (
                  <div className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-xs text-[#57534E]">
                    {field.placeholder || "Enter answer..."}
                  </div>
                )}

                {field.type === "email" && (
                  <div className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-xs text-[#57534E]">
                    {field.placeholder || "email@example.com"}
                  </div>
                )}

                {field.type === "long_text" && (
                  <div className="px-3 py-2 h-16 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-xs text-[#57534E]">
                    {field.placeholder || "Write your response..."}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="flex items-center justify-between p-6 border-t border-[#EAE3D6] bg-white">
          <p className="text-xs text-[#57534E]">
            {template.fields.length} {template.fields.length === 1 ? "question" : "questions"} included
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

