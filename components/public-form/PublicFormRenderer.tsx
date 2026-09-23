"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Check,
  CircleDot,
  CheckSquare,
  ChevronDownSquare,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { PublicFormItem, FormField, submitPublicResponseApi } from "@/lib/api-client";

interface PublicFormRendererProps {
  form: PublicFormItem;
}

export function PublicFormRenderer({ form }: PublicFormRendererProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // For Conversation & Chat styles
  const [currentStep, setCurrentStep] = useState(0);

  const fields = form.fields || [];
  const currentField = fields[currentStep];
  const style = (form.style || "classic").toLowerCase();

  const handleAnswerChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error for field
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateField = (field: FormField): string | null => {
    const val = answers[field.id];
    if (field.required) {
      if (
        val === undefined ||
        val === null ||
        val === "" ||
        (Array.isArray(val) && val.length === 0)
      ) {
        return "This question is required";
      }
    }

    if (val !== undefined && val !== null && val !== "") {
      if (field.type === "email" && typeof val === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          return "Please enter a valid email address";
        }
      }
      if (field.type === "url" && typeof val === "string") {
        try {
          new URL(val.startsWith("http") ? val : `https://${val}`);
        } catch {
          return "Please enter a valid URL";
        }
      }
      if (field.type === "number" && isNaN(Number(val))) {
        return "Please enter a valid number";
      }
    }
    return null;
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      const err = validateField(field);
      if (err) {
        newErrors[field.id] = err;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentField) {
      const err = validateField(currentField);
      if (err) {
        setErrors((prev) => ({ ...prev, [currentField.id]: err }));
        return;
      }
    }
    if (currentStep < fields.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await submitPublicResponseApi(form.slug, answers);

      if (res.success) {
        setIsSubmitted(true);
        // Trigger celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#FF5A36", "#FFB347", "#6366F1", "#10B981"],
          });
        } catch {}
      } else {
        setServerError(res.message || "Failed to submit form.");
      }
    } catch {
      setServerError("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setErrors({});
    setCurrentStep(0);
    setIsSubmitted(false);
    setServerError(null);
  };

  // Keyboard navigation for Conversation style (Enter to proceed)
  useEffect(() => {
    if (style !== "conversation" || isSubmitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && currentField?.type !== "long_text") {
        e.preventDefault();
        handleNextStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [style, currentStep, currentField, answers, isSubmitted]);

  // Style container wrapper
  const getContainerStyle = () => {
    switch (style) {
      case "editorial":
        return "font-serif border-stone-300 dark:border-stone-700 bg-[#FCFAF6] dark:bg-[#161412] max-w-2xl";
      case "minimal":
        return "font-sans border-transparent bg-transparent shadow-none max-w-lg";
      case "conversation":
        return "font-sans border-[#E7E2D8] dark:border-[#2E2824] bg-white dark:bg-[#1C1917] max-w-xl";
      case "chat":
        return "font-sans border-[#E7E2D8] dark:border-[#2E2824] bg-white dark:bg-[#1C1917] max-w-xl";
      case "classic":
      default:
        return "font-sans border-[#E7E2D8] dark:border-[#2E2824] bg-white dark:bg-[#1C1917] max-w-xl";
    }
  };

  // 1. Success State
  if (isSubmitted) {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1C1917] border border-[#E7E2D8] dark:border-[#2E2824] p-8 sm:p-12 text-center shadow-lg animate-in zoom-in-95 duration-200 space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h2 className="font-serif-editorial text-3xl font-normal text-[#1C1917] dark:text-[#FBF9F5]">
          Thank you!
        </h2>

        <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed max-w-xs mx-auto">
          Your response has been submitted successfully.
        </p>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1C1917] dark:text-[#A8A29E] dark:hover:text-[#FBF9F5] hover:bg-[#FAF8F5] dark:hover:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Submit another response</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Conversation Style (One Question at a Time)
  if (style === "conversation") {
    const progressPercent = Math.round(
      ((currentStep + 1) / (fields.length || 1)) * 100
    );

    return (
      <div
        className={`w-full rounded-3xl border p-6 sm:p-10 shadow-lg min-h-[420px] flex flex-col justify-between ${getContainerStyle()}`}
      >
        <div>
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-3">
            <span>
              Question {currentStep + 1} of {fields.length}
            </span>
            <span>{progressPercent}%</span>
          </div>

          <div className="w-full h-1.5 bg-[#F5F2EB] dark:bg-[#24201D] rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-[#FF5A36] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Current Question */}
          {currentField ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal text-[#1C1917] dark:text-[#FBF9F5] leading-snug">
                  {currentField.label}
                  {currentField.required && (
                    <span className="text-[#FF5A36] ml-1 font-bold">*</span>
                  )}
                </h2>
                {currentField.description && (
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-1">
                    {currentField.description}
                  </p>
                )}
              </div>

              {/* Input Component */}
              <div className="pt-2">
                {renderInput(
                  currentField,
                  answers[currentField.id],
                  (val) => handleAnswerChange(currentField.id, val),
                  errors[currentField.id]
                )}
              </div>

              {errors[currentField.id] && (
                <p className="text-xs font-semibold text-red-500 animate-in fade-in">
                  {errors[currentField.id]}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#78716C]">This form has no questions.</p>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-[#F5F2EB] dark:border-[#2E2824]">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0 || isSubmitting}
            className="px-3.5 py-2 text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#FBF9F5] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < fields.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-semibold shadow-md shadow-[#FF5A36]/20 flex items-center gap-1.5 transition-all"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-semibold shadow-md shadow-[#FF5A36]/20 flex items-center gap-1.5 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Response</span>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. Multi-Field Card Styles (Classic, Editorial, Minimal, Chat)
  return (
    <div
      className={`w-full rounded-3xl border p-6 sm:p-10 shadow-lg space-y-6 ${getContainerStyle()}`}
    >
      {/* Header */}
      <div className="border-b border-[#F5F2EB] dark:border-[#2E2824] pb-6 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-serif-editorial text-[#1C1917] dark:text-[#FBF9F5] tracking-tight">
          {form.title}
        </h1>
        {form.description && (
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
            {form.description}
          </p>
        )}
      </div>

      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Questions Stack */}
      <div className="space-y-6">
        {fields.map((field, idx) => (
          <div key={field.id} className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
              {idx + 1}. {field.label}
              {field.required && (
                <span className="text-[#FF5A36] ml-1 font-bold">*</span>
              )}
            </label>
            {field.description && (
              <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                {field.description}
              </p>
            )}

            {renderInput(
              field,
              answers[field.id],
              (val) => handleAnswerChange(field.id, val),
              errors[field.id]
            )}

            {errors[field.id] && (
              <p className="text-xs font-semibold text-red-500 animate-in fade-in">
                {errors[field.id]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-[#F5F2EB] dark:border-[#2E2824] flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-semibold shadow-md shadow-[#FF5A36]/20 flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Response</span>
          )}
        </button>
      </div>
    </div>
  );
}

function renderInput(
  field: FormField,
  value: any,
  onChange: (val: any) => void,
  hasError?: string
) {
  const errorBorder = hasError ? "border-red-500 ring-1 ring-red-500/20" : "";

  if (field.type === "rating") {
    return (
      <div className="flex items-center gap-2 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              (value || 0) >= star
                ? "bg-amber-50 border-amber-300 text-amber-400 scale-105"
                : "bg-white dark:bg-[#24201D] border-[#E7E2D8] dark:border-[#2E2824] text-stone-300 hover:text-amber-400"
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                (value || 0) >= star ? "fill-amber-400" : ""
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
            onClick={() => onChange(opt)}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              value === opt
                ? "bg-[#FFF0EB] border-[#FF5A36] text-[#FF5A36] dark:bg-[#2A1B17]"
                : `bg-white dark:bg-[#24201D] border-[#E7E2D8] dark:border-[#2E2824] text-[#1C1917] dark:text-[#FBF9F5] ${errorBorder}`
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                value === opt ? "border-[#FF5A36] bg-[#FF5A36]" : "border-[#D6D3D1]"
              }`}
            >
              {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-xs font-medium">{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "multiple_choice") {
    const selected: string[] = Array.isArray(value) ? value : [];
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
                onChange(next);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                isChecked
                  ? "bg-[#FFF0EB] border-[#FF5A36] text-[#FF5A36] dark:bg-[#2A1B17]"
                  : `bg-white dark:bg-[#24201D] border-[#E7E2D8] dark:border-[#2E2824] text-[#1C1917] dark:text-[#FBF9F5] ${errorBorder}`
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
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] ${errorBorder}`}
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
            onClick={() => onChange(choice)}
            className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
              value === choice
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                : `bg-white dark:bg-[#24201D] border-[#E7E2D8] dark:border-[#2E2824] text-[#57534E] dark:text-[#A8A29E] ${errorBorder}`
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
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || "Type your response..."}
        rows={3}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] ${errorBorder}`}
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
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={
        field.placeholder ||
        (field.type === "email"
          ? "name@example.com"
          : field.type === "url"
          ? "https://..."
          : "Enter your answer...")
      }
      className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] text-xs text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] ${errorBorder}`}
    />
  );
}
