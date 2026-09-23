"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  Star,
  Check,
  ToggleLeft,
  CircleDot,
  CheckSquare,
  ChevronDownSquare,
  HelpCircle,
} from "lucide-react";
import { FormField, FormStyle } from "@/lib/api-client";
import { ViewportMode } from "./BuilderTopBar";

interface BuilderCanvasProps {
  title: string;
  description: string | null;
  style: FormStyle;
  fields: FormField[];
  selectedFieldId: string | null;
  viewport: ViewportMode;
  onSelectField: (fieldId: string) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDuplicateField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  onMoveField: (fieldId: string, direction: "up" | "down") => void;
  onOpenFieldLibrary?: () => void;
}

export function BuilderCanvas({
  title,
  description,
  style,
  fields,
  selectedFieldId,
  viewport,
  onSelectField,
  onUpdateField,
  onDuplicateField,
  onDeleteField,
  onMoveField,
  onOpenFieldLibrary,
}: BuilderCanvasProps) {
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);

  // Style container styling
  const getCanvasStyleClasses = () => {
    switch (style.toLowerCase()) {
      case "editorial":
        return "font-serif border-stone-300 dark:border-stone-700 bg-[#FCFAF6] dark:bg-[#161412]";
      case "minimal":
        return "font-sans border-[#E7E2D8] dark:border-[#2E2824] bg-white dark:bg-[#1C1917] shadow-none";
      case "conversation":
        return "font-sans border-blue-200 dark:border-blue-900/40 bg-white dark:bg-[#1C1917]";
      case "chat":
        return "font-sans border-orange-200 dark:border-orange-900/40 bg-[#FAF8F5] dark:bg-[#141210]";
      case "classic":
      default:
        return "font-sans border-[#E7E2D8] dark:border-[#2E2824] bg-white dark:bg-[#1C1917]";
    }
  };

  return (
    <main className="flex-1 bg-[#FAF8F5] dark:bg-[#141210] overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
      {/* Canvas Viewport Frame */}
      <div
        className={`w-full transition-all duration-300 ${
          viewport === "mobile" ? "max-w-sm" : "max-w-2xl"
        }`}
      >
        <div
          className={`rounded-3xl border p-6 sm:p-10 shadow-sm transition-all ${getCanvasStyleClasses()}`}
        >
          {/* Form Header Header */}
          <div className="border-b border-[#F5F2EB] dark:border-[#2E2824] pb-6 mb-8 space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF0EB] text-[#FF5A36] border border-[#FFD8CC] dark:bg-[#2A1B17] dark:border-[#522920]">
                <Sparkles className="w-3 h-3" />
                {style.charAt(0).toUpperCase() + style.slice(1)} Style
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-normal text-[#1C1917] dark:text-[#FBF9F5] tracking-tight">
              {title || "Untitled Form"}
            </h1>

            {description && (
              <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Form Fields Canvas */}
          {fields.length === 0 ? (
            /* Empty Canvas State */
            <div className="rounded-2xl border-2 border-dashed border-[#E7E2D8] dark:border-[#2E2824] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] text-[#FF5A36] dark:bg-[#2A1B17] dark:border-[#522920] border border-[#FFD8CC] flex items-center justify-center mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                Start building your form
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] max-w-xs mt-1.5 leading-relaxed">
                Add your first question from the left panel to begin assembling your form.
              </p>
              {onOpenFieldLibrary && (
                <button
                  type="button"
                  onClick={onOpenFieldLibrary}
                  className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#FF5A36] hover:bg-[#E04826] rounded-xl shadow-xs transition-colors"
                >
                  + Add Question
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field, index) => {
                const isSelected = selectedFieldId === field.id;
                const isEditingLabel = editingLabelId === field.id;

                return (
                  <div
                    key={field.id}
                    onClick={() => onSelectField(field.id)}
                    className={`group relative rounded-2xl p-4 sm:p-5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white dark:bg-[#1C1917] ring-2 ring-[#FF5A36] shadow-md border-transparent"
                        : "bg-[#FAF8F5]/80 dark:bg-[#1C1917]/50 hover:bg-white dark:hover:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824]"
                    }`}
                  >
                    {/* Floating Action Toolbar on Selected Field */}
                    {isSelected && (
                      <div className="absolute -top-3.5 right-4 z-10 flex items-center gap-1 bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] p-1 rounded-xl shadow-lg animate-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveField(field.id, "up");
                          }}
                          disabled={index === 0}
                          aria-label="Move question up"
                          className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveField(field.id, "down");
                          }}
                          disabled={index === fields.length - 1}
                          aria-label="Move question down"
                          className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        <div className="h-3 w-px bg-white/20 dark:bg-black/20" />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateField(field.id);
                          }}
                          aria-label="Duplicate question"
                          className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/10 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteField(field.id);
                          }}
                          aria-label="Delete question"
                          className="p-1 rounded-lg text-red-400 dark:text-red-600 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Question Header & Inline Label Editing */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#A8A29E] dark:text-[#78716C] font-semibold">
                          {index + 1}.
                        </span>

                        {isEditingLabel ? (
                          <input
                            type="text"
                            value={field.label}
                            autoFocus
                            onChange={(e) =>
                              onUpdateField(field.id, { label: e.target.value })
                            }
                            onBlur={() => setEditingLabelId(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === "Escape") {
                                setEditingLabelId(null);
                              }
                            }}
                            className="text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#FBF9F5] bg-white dark:bg-[#24201D] px-2 py-0.5 rounded-lg border border-[#FF5A36] focus:outline-none w-full"
                          />
                        ) : (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingLabelId(field.id);
                            }}
                            title="Click to edit label directly"
                            className="text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#FBF9F5] hover:text-[#FF5A36] rounded px-1 transition-colors"
                          >
                            {field.label || "Untitled Question"}
                          </span>
                        )}

                        {field.required && (
                          <span className="text-[#FF5A36] text-xs font-bold" title="Required">
                            *
                          </span>
                        )}
                      </div>

                      {field.description && (
                        <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] pl-4">
                          {field.description}
                        </p>
                      )}
                    </div>

                    {/* Question Mockup Input Previews */}
                    <div className="pl-4">
                      {/* Short text & email & phone & url & number & date & time */}
                      {(field.type === "short_text" ||
                        field.type === "email" ||
                        field.type === "phone" ||
                        field.type === "url" ||
                        field.type === "number" ||
                        field.type === "date" ||
                        field.type === "time") && (
                        <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#A8A29E] dark:text-[#78716C] shadow-2xs">
                          {field.placeholder ||
                            (field.type === "email"
                              ? "name@example.com"
                              : field.type === "url"
                              ? "https://..."
                              : field.type === "date"
                              ? "YYYY-MM-DD"
                              : "Enter response...")}
                        </div>
                      )}

                      {/* Long text */}
                      {field.type === "long_text" && (
                        <div className="px-3.5 py-3 h-20 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#A8A29E] dark:text-[#78716C] shadow-2xs">
                          {field.placeholder || "Type your detailed answer here..."}
                        </div>
                      )}

                      {/* Single Choice / Radio */}
                      {field.type === "single_choice" && (
                        <div className="space-y-2">
                          {(field.options && field.options.length > 0
                            ? field.options
                            : ["Option 1", "Option 2", "Option 3"]
                          ).map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#57534E] dark:text-[#A8A29E] shadow-2xs"
                            >
                              <CircleDot className="w-3.5 h-3.5 text-[#A8A29E]" />
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Multiple Choice / Checkbox */}
                      {field.type === "multiple_choice" && (
                        <div className="space-y-2">
                          {(field.options && field.options.length > 0
                            ? field.options
                            : ["Option 1", "Option 2", "Option 3"]
                          ).map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#57534E] dark:text-[#A8A29E] shadow-2xs"
                            >
                              <CheckSquare className="w-3.5 h-3.5 text-[#A8A29E]" />
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Dropdown */}
                      {field.type === "dropdown" && (
                        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#78716C] dark:text-[#A8A29E] shadow-2xs">
                          <span>
                            {field.placeholder ||
                              (field.options && field.options[0]) ||
                              "Select an option"}
                          </span>
                          <ChevronDownSquare className="w-3.5 h-3.5 text-[#A8A29E]" />
                        </div>
                      )}

                      {/* Rating */}
                      {field.type === "rating" && (
                        <div className="flex items-center gap-1.5 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] flex items-center justify-center text-amber-400 shadow-2xs"
                            >
                              <Star className="w-4 h-4 fill-amber-400" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Yes / No */}
                      {field.type === "yes_no" && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 py-2 px-4 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] text-center text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] shadow-2xs">
                            Yes
                          </div>
                          <div className="flex-1 py-2 px-4 rounded-xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] text-center text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] shadow-2xs">
                            No
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Submit Button Preview */}
          <div className="mt-10 pt-6 border-t border-[#F5F2EB] dark:border-[#2E2824] flex justify-end">
            <button
              type="button"
              disabled
              className="px-5 py-2 rounded-xl bg-[#FF5A36] text-white text-xs font-semibold opacity-90 shadow-md shadow-[#FF5A36]/20 cursor-default"
            >
              Submit Response
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
