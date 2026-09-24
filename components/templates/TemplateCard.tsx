"use client";

import React from "react";
import { Sparkles, Eye, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TemplateItem } from "@/lib/api-client";

interface TemplateCardProps {
  template: TemplateItem;
  isUsing: boolean;
  onUseTemplate: (template: TemplateItem) => void;
  onPreview: (template: TemplateItem) => void;
}

export function TemplateCard({
  template,
  isUsing,
  onUseTemplate,
  onPreview,
}: TemplateCardProps) {
  return (
    <div className="group rounded-3xl bg-white border border-[#EAE3D6] p-6 sm:p-7 card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF0EB] text-[#FF5A36] border border-[#FFD8CC]">
            {template.category}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-[#57534E] border border-[#EAE3D6]">
            <Sparkles className="w-3 h-3 text-[#FF5A36]" />
            {template.style} Style
          </span>
        </div>

        {/* Visual Mini-Mockup Preview Container */}
        <div
          onClick={() => onPreview(template)}
          className="relative rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-4 mb-5 cursor-pointer overflow-hidden transition-all group-hover:scale-[1.01]"
        >
          {/* Subtle Form Mockup Header */}
          <div className="space-y-1.5 mb-3">
            <div className="h-3 w-2/3 bg-[#1C1917]/20 rounded-full" />
            <div className="h-2 w-1/2 bg-[#1C1917]/10 rounded-full" />
          </div>

          {/* Sample Field Preview */}
          <div className="space-y-2">
            {template.fields.slice(0, 2).map((field, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white border border-[#EAE3D6] text-[11px] space-y-1 shadow-2xs"
              >
                <div className="font-medium text-[#1C1917] line-clamp-1">
                  {field.label}
                </div>

                {field.type === "rating" ? (
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                ) : field.type === "multiple_choice" ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-[#57534E]">
                    <div className="w-2.5 h-2.5 rounded-full border border-[#D6D3D1]" />
                    <span>{field.options?.[0] || "Option 1"}</span>
                  </div>
                ) : (
                  <div className="h-4 bg-[#FAF8F5] border border-[#EAE3D6] rounded px-2 text-[10px] text-[#A8A29E] flex items-center">
                    {field.placeholder || "Enter response..."}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Fake Submit Button Mockup */}
          <div className="mt-3 flex justify-end">
            <div className="px-3 py-1 rounded-md bg-[#FF5A36] text-white text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
              <span>Submit</span>
            </div>
          </div>

          {/* Hover Preview Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-white text-[#1C1917] text-xs font-semibold shadow-md flex items-center gap-1.5 border border-[#EAE3D6]">
              <Eye className="w-3.5 h-3.5" />
              Quick Preview
            </span>
          </div>
        </div>

        {/* Template Title & Description */}
        <h3 className="font-serif-editorial text-2xl text-[#1C1917] font-medium group-hover:text-[#FF5A36] transition-colors">
          {template.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#57534E] mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
          {template.description}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-[#EAE3D6] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="text-xs font-semibold text-[#57534E] hover:text-[#FF5A36] px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
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

