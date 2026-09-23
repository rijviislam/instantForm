"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Star,
  CircleDot,
  CheckSquare,
  ChevronDownSquare,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Send,
  CheckCircle2,
  Check,
} from "lucide-react";
import { FormField, FormStyle } from "@/lib/api-client";
import { ViewportMode } from "./BuilderTopBar";

interface BuilderPreviewProps {
  title: string;
  description: string | null;
  style: FormStyle;
  fields: FormField[];
  viewport: ViewportMode;
  onClose: () => void;
}

export function BuilderPreview({
  title,
  description,
  style,
  fields,
  viewport,
  onClose,
}: BuilderPreviewProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0); // for Conversation style
  const [chatMessages, setChatMessages] = useState<Array<{ type: "question" | "answer"; text: string; fieldId?: string }>>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const currentField = fields[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] dark:bg-[#141210] flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Preview Header */}
      <div className="h-14 border-b border-[#E7E2D8] dark:border-[#2E2824] bg-white dark:bg-[#1C1917] px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF0EB] text-[#FF5A36] border border-[#FFD8CC] dark:bg-[#2A1B17] dark:border-[#522920]">
            Preview Mode
          </span>
          <span className="text-xs text-[#78716C] dark:text-[#A8A29E] hidden sm:inline">
            ({style.charAt(0).toUpperCase() + style.slice(1)} style)
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5] hover:bg-[#FAF8F5] dark:hover:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Exit Preview</span>
        </button>
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            viewport === "mobile" ? "max-w-sm" : "max-w-2xl"
          }`}
        >
          {submitted ? (
            /* Success screen simulation */
            <div className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] p-10 sm:p-14 text-center shadow-lg space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif-editorial text-[#1C1917] dark:text-[#FBF9F5]">
                Thank you!
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] max-w-sm mx-auto">
                Your response was recorded in preview mode.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setCurrentStep(0);
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-[#FF5A36] hover:underline"
              >
                Restart Preview
              </button>
            </div>
          ) : style.toLowerCase() === "conversation" ? (
            /* Conversation: One question at a time */
            <div className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] p-8 sm:p-12 shadow-lg space-y-8 min-h-[380px] flex flex-col justify-between">
              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-medium text-[#78716C] dark:text-[#A8A29E] mb-6">
                  <span>
                    Question {currentStep + 1} of {fields.length || 1}
                  </span>
                  <span>
                    {Math.round(((currentStep + 1) / (fields.length || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#F5F2EB] dark:bg-[#24201D] rounded-full overflow-hidden mb-8">
                  <div
                    className="h-full bg-[#FF5A36] transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / (fields.length || 1)) * 100}%`,
                    }}
                  />
                </div>

                {currentField ? (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-xl sm:text-2xl font-normal text-[#1C1917] dark:text-[#FBF9F5]">
                      {currentField.label}
                      {currentField.required && (
                        <span className="text-[#FF5A36] ml-1">*</span>
                      )}
                    </h3>
                    {currentField.description && (
                      <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                        {currentField.description}
                      </p>
                    )}

                    {/* Input */}
                    <div className="pt-2">
                      {renderPreviewInput(currentField, answers, handleAnswerChange)}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#78716C]">No questions in form.</p>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-[#F5F2EB] dark:border-[#2E2824]">
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                  disabled={currentStep === 0}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#78716C] disabled:opacity-30 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                {currentStep < fields.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s + 1)}
                    className="px-5 py-2 rounded-xl bg-[#FF5A36] text-white text-xs font-semibold shadow-md shadow-[#FF5A36]/20 flex items-center gap-1"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    className="px-5 py-2 rounded-xl bg-[#FF5A36] text-white text-xs font-semibold shadow-md shadow-[#FF5A36]/20"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Standard / Classic / Editorial / Minimal / Chat multi-field list */
            <div className="rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] p-8 sm:p-12 shadow-lg space-y-6">
              <div className="border-b border-[#F5F2EB] dark:border-[#2E2824] pb-6 space-y-2">
                <h1 className="text-2xl sm:text-3xl font-serif-editorial text-[#1C1917] dark:text-[#FBF9F5]">
                  {title || "Untitled Form"}
                </h1>
                {description && (
                  <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E]">
                    {description}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                {fields.map((field, idx) => (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                      {idx + 1}. {field.label}
                      {field.required && (
                        <span className="text-[#FF5A36] ml-1">*</span>
                      )}
                    </label>
                    {field.description && (
                      <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                        {field.description}
                      </p>
                    )}
                    {renderPreviewInput(field, answers, handleAnswerChange)}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[#F5F2EB] dark:border-[#2E2824] flex justify-end">
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="px-6 py-2.5 rounded-xl bg-[#FF5A36] text-white text-xs font-semibold shadow-md shadow-[#FF5A36]/20 hover:bg-[#E04826] transition-colors"
                >
                  Submit Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderPreviewInput(
  field: FormField,
  answers: Record<string, any>,
  onChange: (fieldId: string, val: any) => void
) {
  const currentVal = answers[field.id];

  if (field.type === "rating") {
    return (
      <div className="flex items-center gap-2 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(field.id, star)}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              (currentVal || 0) >= star
                ? "bg-amber-50 border-amber-300 text-amber-400"
                : "bg-white dark:bg-[#24201D] border-[#E7E2D8] dark:border-[#2E2824] text-stone-300 hover:text-amber-400"
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                (currentVal || 0) >= star ? "fill-amber-400" : ""
              }`}
            />
          </button>
        ))}
      </div>
    );
  }

  if (field.type === "single_choice") {
    return (
      <div className="space-y-2">
        {(field.options || ["Option 1", "Option 2", "Option 3"]).map((opt) => (
          <label
            key={opt}
            onClick={() => onChange(field.id, opt)}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              currentVal === opt
                ? "bg-[#FFF0EB] border-[#FF5A36] text-[#FF5A36] dark:bg-[#2A1B17]"
                : "bg-white dark:bg-[#24201D] border-[#E7E2D8] dark:border-[#2E2824] text-[#1C1917] dark:text-[#FBF9F5]"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                currentVal === opt ? "border-[#FF5A36] bg-[#FF5A36]" : "border-[#D6D3D1]"
              }`}
            >
              {currentVal === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-xs font-medium">{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "multiple_choice") {
    const selected: string[] = Array.isArray(currentVal) ? currentVal : [];
    return (
      <div className="space-y-2">
        {(field.options || ["Option 1", "Option 2", "Option 3"]).map((opt) => {
          const isChecked = selected.includes(opt);
          return (
            <label
              key={opt}
              onClick={() => {
                const next = isChecked
                  ? selected.filter((s) => s !== opt)
                  : [...selected, opt];
                onChange(field.id, next);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                isChecked
                  ? "bg-[#FFF0EB] border-[#FF5A36] text-[#FF5A36] dark:bg-[#2A1B17]"
                  : "bg-white dark:bg-[#24201D] border-[#E7E2D8] dark:border-[#2E2824] text-[#1C1917] dark:text-[#FBF9F5]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                  isChecked ? "border-[#FF5A36] bg-[#FF5A36] text-white" : "border-[#D6D3D1]"
                }`}
              >
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs font-medium">{opt}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (field.type === "dropdown") {
    return (
      <select
        value={currentVal || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36]"
      >
        <option value="">{field.placeholder || "Select an option..."}</option>
        {(field.options || ["Option 1", "Option 2"]).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "yes_no") {
    return (
      <div className="flex items-center gap-3">
        {["Yes", "No"].map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onChange(field.id, choice)}
            className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
              currentVal === choice
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                : "bg-white dark:bg-[#24201D] border-[#E7E2D8] dark:border-[#2E2824] text-[#57534E] dark:text-[#A8A29E]"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
    );
  }

  if (field.type === "long_text") {
    return (
      <textarea
        value={currentVal || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder || "Type your response..."}
        rows={3}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36]"
      />
    );
  }

  return (
    <input
      type={
        field.type === "email"
          ? "email"
          : field.type === "number"
          ? "number"
          : field.type === "date"
          ? "date"
          : field.type === "time"
          ? "time"
          : "text"
      }
      value={currentVal || ""}
      onChange={(e) => onChange(field.id, e.target.value)}
      placeholder={
        field.placeholder ||
        (field.type === "email"
          ? "name@example.com"
          : field.type === "url"
          ? "https://..."
          : "Enter your answer...")
      }
      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36]"
    />
  );
}
