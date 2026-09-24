"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Check,
  Upload,
  Image as ImageIcon,
  Video,
  Mic,
  Camera,
  PenTool,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import { PublicFormItem, FormField, submitPublicResponseApi } from "@/lib/api-client";
import { FormTheme, resolveFormTheme, getThemeComputedStyles, getComputedFieldStyles } from "@/lib/form-theme";
import { DynamicFontLoader } from "@/components/builder/DynamicFontLoader";

interface PublicFormRendererProps {
  form: PublicFormItem;
}

export function PublicFormRenderer({ form }: PublicFormRendererProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Theme resolution
  const theme = resolveFormTheme(form.theme, form.style);
  const { backgroundStyle, containerStyle, inputStyle, buttonStyle, headingStyle } =
    getThemeComputedStyles(theme);

  // For Conversation & Chat styles
  const [currentStep, setCurrentStep] = useState(0);

  const fields = (form.fields || []).filter(
    (f) => f.type !== "hidden_input" && f.type !== "auto_id"
  );
  const currentField = fields[currentStep];
  const currentFieldStyles = currentField ? getComputedFieldStyles(currentField, theme) : null;
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

    // 1. Required Check
    if (field.required) {
      if (
        val === undefined ||
        val === null ||
        val === "" ||
        (Array.isArray(val) && val.length === 0) ||
        (typeof val === "object" && Object.keys(val).length === 0)
      ) {
        return "This question is required";
      }
      // Address required sub-fields
      if (field.type === "address" && typeof val === "object") {
        if (!val.line1?.trim()) {
          return "Street address line 1 is required";
        }
        if (!val.city?.trim()) {
          return "City is required";
        }
      }
      // Date range required
      if (field.type === "date_range" && typeof val === "object") {
        if (!val.start || !val.end) {
          return "Both start and end dates are required";
        }
      }
      // Duration required
      if (field.type === "duration" && typeof val === "object") {
        if (!val.hours && !val.minutes) {
          return "Duration is required";
        }
      }
      // Grids required check
      if (
        (field.type === "multiple_choice_grid" || field.type === "checkbox_grid") &&
        field.rows &&
        field.rows.length > 0
      ) {
        const gridState = typeof val === "object" && val !== null ? val : {};
        const unansweredRow = field.rows.find((row) => {
          const rowVal = gridState[row];
          return !rowVal || (Array.isArray(rowVal) && rowVal.length === 0);
        });
        if (unansweredRow) {
          return `Please provide an answer for "${unansweredRow}"`;
        }
      }
    }

    // 2. Format & Value Type Validations (if value is provided)
    if (val !== undefined && val !== null && val !== "") {
      // Email format validation
      if (field.type === "email" && typeof val === "string") {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(val.trim())) {
          return "Please enter a valid email address (e.g. name@example.com)";
        }
      }

      // Phone Number validation (strict digit check, no sentences/words)
      if (field.type === "phone" && typeof val === "string") {
        const digitsOnly = val.replace(/\D/g, "");
        const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}$/;
        if (digitsOnly.length < 7 || digitsOnly.length > 16 || !phoneRegex.test(val.trim())) {
          return "Please enter a valid phone number (e.g. +1 555-0123)";
        }
      }

      // Number & Decimal validation
      if (field.type === "number" || field.type === "decimal" || field.type === "currency" || field.type === "percentage") {
        const num = Number(val);
        if (isNaN(num)) {
          return "Please enter a valid numeric value";
        }
        if (field.min !== undefined && num < field.min) {
          return `Value must be at least ${field.min}`;
        }
        if (field.max !== undefined && num > field.max) {
          return `Value cannot exceed ${field.max}`;
        }
      }

      // URL validation
      if (field.type === "url" && typeof val === "string") {
        try {
          const formatted = val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`;
          new URL(formatted);
          if (!val.includes(".")) {
            return "Please enter a valid website URL (e.g. https://example.com)";
          }
        } catch {
          return "Please enter a valid website URL (e.g. https://example.com)";
        }
      }

      // Custom Input regex validation
      if (field.type === "custom_input" && field.customPattern && typeof val === "string") {
        try {
          const regex = new RegExp(field.customPattern);
          if (!regex.test(val)) {
            return field.customErrorMessage || "Invalid input format";
          }
        } catch (e) {
          // ignore invalid regex parsing
        }
      }
    }

    return null;
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    let firstInvalidId: string | null = null;

    fields.forEach((field) => {
      if (field.type === "divider" || field.type === "section_heading") return;
      const err = validateField(field);
      if (err) {
        newErrors[field.id] = err;
        isValid = false;
        if (!firstInvalidId) {
          firstInvalidId = field.id;
        }
      }
    });

    setErrors(newErrors);

    // Smooth scroll to the first invalid field
    if (firstInvalidId) {
      const el = document.getElementById(`field-container-${firstInvalidId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return isValid;
  };

  const handleNextStep = () => {
    if (!currentField) return;
    const err = validateField(currentField);
    if (err) {
      setErrors((prev) => ({ ...prev, [currentField.id]: err }));
      return;
    }

    if (currentStep < fields.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (style !== "conversation") {
      const isValid = validateAll();
      if (!isValid) return;
    } else if (currentField) {
      const err = validateField(currentField);
      if (err) {
        setErrors((prev) => ({ ...prev, [currentField.id]: err }));
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setServerError(null);

      // Extract automated metadata if present
      const submissionAnswers = { ...answers };
      (form.fields || []).forEach((f) => {
        if (f.type === "timestamp") {
          submissionAnswers[f.id] = new Date().toISOString();
        } else if (f.type === "auto_id") {
          submissionAnswers[f.id] = `sub_${Date.now().toString(36)}`;
        } else if (f.type === "referrer" && typeof document !== "undefined") {
          submissionAnswers[f.id] = document.referrer || "direct";
        }
      });

      const res = await submitPublicResponseApi(form.slug, submissionAnswers);

      if (res.success) {
        setIsSubmitted(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#FF5A36", "#E44825", "#FBBF24", "#34D399", "#60A5FA"],
          });
        } catch (e) {
          // ignore canvas confetti errors
        }
      } else {
        setServerError(
          res.message || "Unable to submit your response. Please try again."
        );
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again.");
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
        return "font-serif border-[#EAE3D6] bg-[#FCFAF6] max-w-2xl";
      case "minimal":
        return "font-sans border-[#EAE3D6] bg-white shadow-none max-w-xl";
      case "conversation":
        return "font-sans border-[#EAE3D6] bg-white max-w-xl";
      case "chat":
        return "font-sans border-[#EAE3D6] bg-[#FAF8F5] max-w-xl";
      case "classic":
      default:
        return "font-sans border-[#EAE3D6] bg-white max-w-xl";
    }
  };

  // 1. Success State
  if (isSubmitted) {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <DynamicFontLoader theme={theme} />
        <div
          className="w-full max-w-md text-center animate-in zoom-in-95 duration-200 space-y-4"
          style={containerStyle}
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 style={headingStyle} className="tracking-tight">
            Thank you!
          </h2>

          <p
            className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto"
            style={{ color: theme.colors.mutedText || "#78716C" }}
          >
            Your response has been submitted successfully.
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] border border-[#EAE3D6] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Submit another response</span>
            </button>
          </div>
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
      <div className="w-full flex flex-col items-center justify-center p-4 relative">
        <DynamicFontLoader theme={theme} />

        {/* Branding Logo */}
        {theme.branding.logoUrl && (
          <div
            className={`w-full max-w-2xl mb-4 flex ${
              theme.branding.logoPosition === "center"
                ? "justify-center"
                : theme.branding.logoPosition === "right"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <img
              src={theme.branding.logoUrl}
              alt="Form logo"
              className="object-contain"
              style={{
                height:
                  theme.branding.logoSize === "sm"
                    ? "32px"
                    : theme.branding.logoSize === "lg"
                    ? "64px"
                    : "48px",
              }}
            />
          </div>
        )}

        <div
          className="w-full min-h-[420px] flex flex-col justify-between"
          style={containerStyle}
        >
          <div>
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs font-semibold text-[#78716C] mb-3">
              <span>
                Question {currentStep + 1} of {fields.length}
              </span>
              <span>{progressPercent}%</span>
            </div>

            <div className="w-full h-1.5 bg-[#F5F2EB] rounded-full overflow-hidden mb-8">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: theme.colors.primary || "#FF5A36",
                }}
              />
            </div>

            {serverError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Current Question */}
            {currentField ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 style={currentFieldStyles?.inputLabelStyle || headingStyle} className="leading-snug">
                    {currentField.label}
                    {currentField.required && (
                      currentFieldStyles?.requiredIndicator === "badge" ? (
                        <span
                          className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold border"
                          style={{
                            color: currentFieldStyles.requiredColor,
                            borderColor: `${currentFieldStyles.requiredColor}40`,
                            backgroundColor: `${currentFieldStyles.requiredColor}10`,
                          }}
                        >
                          Required
                        </span>
                      ) : currentFieldStyles?.requiredIndicator === "dot" ? (
                        <span
                          className="ml-1 text-sm font-black"
                          style={{ color: currentFieldStyles.requiredColor }}
                        >
                          •
                        </span>
                      ) : currentFieldStyles?.requiredIndicator === "none" ? null : (
                        <span
                          className="ml-1 font-bold"
                          style={{ color: currentFieldStyles?.requiredColor || "#FF5A36" }}
                        >
                          *
                        </span>
                      )
                    )}
                  </h2>
                  {currentField.description && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: theme.colors.mutedText || "#78716C" }}
                    >
                      {currentField.description}
                    </p>
                  )}
                </div>

                {/* Input Component */}
                <div className="pt-2">
                  {renderPublicInput(
                    currentField,
                    answers[currentField.id],
                    (val) => handleAnswerChange(currentField.id, val),
                    theme,
                    errors[currentField.id]
                  )}
                </div>

                {errors[currentField.id] && (
                  <p
                    className="text-xs font-semibold animate-in fade-in"
                    style={{ color: theme.inputs?.errorTextColor || "#EF4444" }}
                  >
                    {errors[currentField.id]}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#78716C]">This form has no questions.</p>
            )}
          </div>

          {/* Footer Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#F5F2EB]">
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0 || isSubmitting}
              className="px-3.5 py-2 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {currentStep < fields.length - 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                style={buttonStyle}
                className="flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={buttonStyle}
                className="flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
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
      </div>
    );
  }

  // 3. Multi-Field Card Styles
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 relative">
      <DynamicFontLoader theme={theme} />

      {/* Header Banner Image */}
      {theme.branding.headerImageUrl && (
        <div
          className="w-full rounded-t-3xl overflow-hidden mb-[-1.5rem] relative z-0 border border-b-0 border-[#EAE3D6] shadow-sm"
          style={{
            maxWidth: containerStyle.maxWidth,
            height:
              theme.branding.headerImageHeight === "sm"
                ? "120px"
                : theme.branding.headerImageHeight === "lg"
                ? "240px"
                : "180px",
          }}
        >
          <img
            src={theme.branding.headerImageUrl}
            alt="Header banner"
            className="w-full h-full"
            style={{ objectFit: theme.branding.headerImageFit || "cover" }}
          />
        </div>
      )}

      <div
        className="w-full space-y-6 relative z-10"
        style={containerStyle}
      >
        {/* Form Logo */}
        {theme.branding.logoUrl && (
          <div
            className={`mb-4 flex ${
              theme.branding.logoPosition === "center"
                ? "justify-center"
                : theme.branding.logoPosition === "right"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <img
              src={theme.branding.logoUrl}
              alt="Form logo"
              className="object-contain"
              style={{
                height:
                  theme.branding.logoSize === "sm"
                    ? "32px"
                    : theme.branding.logoSize === "lg"
                    ? "64px"
                    : "48px",
              }}
            />
          </div>
        )}

        {/* Header */}
        <div className="border-b border-[#F5F2EB] pb-6 space-y-2">
          <h1 style={headingStyle} className="tracking-tight">
            {form.title}
          </h1>
          {form.description && (
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: theme.colors.mutedText || "#78716C" }}
            >
              {form.description}
            </p>
          )}
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Questions Stack */}
        <div
          className="space-y-6"
          style={{
            gap:
              theme.inputs?.fieldSpacing === "compact"
                ? "12px"
                : theme.inputs?.fieldSpacing === "relaxed"
                ? "24px"
                : theme.inputs?.fieldSpacing === "loose"
                ? "32px"
                : theme.inputs?.fieldSpacing === "custom" && theme.inputs.customFieldSpacing !== undefined
                ? `${theme.inputs.customFieldSpacing}px`
                : "16px",
          }}
        >
          {fields.map((field, idx) => {
            if (field.type === "divider") {
              return <div key={field.id} className="h-px bg-[#EAE3D6] my-4" />;
            }
            if (field.type === "section_heading") {
              return (
                <div key={field.id} className="pt-4 pb-1 border-b border-[#F5F2EB]">
                  <h3 className="text-base font-bold text-[#1C1917]">{field.label}</h3>
                  {field.description && (
                    <p className="text-xs text-[#78716C] mt-0.5">{field.description}</p>
                  )}
                </div>
              );
            }

            const fieldStyles = getComputedFieldStyles(field, theme);
            const hasError = !!errors[field.id];

            return (
              <div
                key={field.id}
                id={`field-container-${field.id}`}
                style={{
                  ...fieldStyles.fieldCardStyle,
                  borderColor: hasError
                    ? theme.inputs?.errorBorderColor || "#EF4444"
                    : fieldStyles.fieldCardStyle.borderColor,
                }}
                className="space-y-2.5 transition-all"
              >
                <label
                  className="block text-xs sm:text-sm font-semibold"
                  style={fieldStyles.inputLabelStyle}
                >
                  {idx + 1}. {field.label}
                  {field.required && (
                    fieldStyles.requiredIndicator === "badge" ? (
                      <span
                        className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold border"
                        style={{
                          color: fieldStyles.requiredColor,
                          borderColor: `${fieldStyles.requiredColor}40`,
                          backgroundColor: `${fieldStyles.requiredColor}10`,
                        }}
                      >
                        Required
                      </span>
                    ) : fieldStyles.requiredIndicator === "dot" ? (
                      <span
                        className="ml-1 text-sm font-black"
                        style={{ color: fieldStyles.requiredColor }}
                      >
                        •
                      </span>
                    ) : fieldStyles.requiredIndicator === "none" ? null : (
                      <span
                        className="ml-1 font-bold"
                        style={{ color: fieldStyles.requiredColor }}
                      >
                        *
                      </span>
                    )
                  )}
                </label>
                {field.description && (
                  <p
                    className="text-[11px]"
                    style={{ color: theme.colors.mutedText || "#78716C" }}
                  >
                    {field.description}
                  </p>
                )}

                {renderPublicInput(
                  field,
                  answers[field.id],
                  (val) => handleAnswerChange(field.id, val),
                  theme,
                  errors[field.id]
                )}

                {errors[field.id] && (
                  <p
                    className="text-xs font-semibold flex items-center gap-1 mt-1 animate-in fade-in"
                    style={{ color: theme.inputs?.errorTextColor || "#EF4444" }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors[field.id]}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-[#F5F2EB] flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={buttonStyle}
            className="flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
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
    </div>
  );
}

interface FileUploadFieldControlProps {
  field: FormField;
  value: any;
  onChange: (val: any) => void;
  fieldStyles: any;
  hasError?: boolean | string;
  errorBorderColor?: string;
}

function FileUploadFieldControl({
  field,
  value,
  onChange,
  fieldStyles,
  hasError,
  errorBorderColor,
}: FileUploadFieldControlProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isImage = field.type === "image_upload";
  const isVideo = field.type === "video_upload";
  const isAudio = field.type === "audio_upload";

  const accept = isImage
    ? "image/*"
    : isVideo
    ? "video/*"
    : isAudio
    ? "audio/*"
    : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.png,.jpg,.jpeg";

  const Icon = isImage ? ImageIcon : isVideo ? Video : isAudio ? Mic : Upload;

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChange({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const fileInfo =
    typeof value === "object" && value !== null
      ? value
      : typeof value === "string" && value
      ? { name: value }
      : null;

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      {fileInfo ? (
        <div
          style={{
            ...fieldStyles.dropzoneStyle,
            borderColor: hasError ? errorBorderColor : fieldStyles.dropzoneStyle.borderColor,
            backgroundColor: `${fieldStyles.accentColor}08`,
          }}
          className="p-4 rounded-xl flex items-center justify-between gap-3 border transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            {fileInfo.dataUrl && (fileInfo.type?.startsWith("image/") || isImage) ? (
              <img
                src={fileInfo.dataUrl}
                alt={fileInfo.name}
                className="w-12 h-12 object-cover rounded-lg border border-[#EAE3D6] shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  color: fieldStyles.accentColor,
                  border: `1px solid ${fieldStyles.dropzoneStyle.borderColor}`,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: fieldStyles.inputStyle.color }}
              >
                {fileInfo.name}
              </p>
              {fileInfo.size && (
                <p className="text-[10px] opacity-70">
                  {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border hover:bg-black/5 transition-all cursor-pointer"
              style={{
                borderColor: fieldStyles.dropzoneStyle.borderColor,
                color: fieldStyles.accentColor,
              }}
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="p-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            ...fieldStyles.dropzoneStyle,
            borderColor: hasError
              ? errorBorderColor
              : isDragging
              ? fieldStyles.accentColor
              : fieldStyles.dropzoneStyle.borderColor,
            backgroundColor: isDragging
              ? `${fieldStyles.accentColor}10`
              : fieldStyles.dropzoneStyle.backgroundColor,
          }}
          className="p-6 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all hover:opacity-90"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-110"
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              color: fieldStyles.accentColor,
              border: `1px solid ${fieldStyles.dropzoneStyle.borderColor}`,
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold" style={{ color: fieldStyles.inputStyle.color }}>
            {field.placeholder || "Click to browse or drag & drop file here"}
          </div>
          <div className="text-[10px] opacity-70">
            {isImage
              ? "PNG, JPG, WEBP, SVG up to 10MB"
              : isVideo
              ? "MP4, WebM, MOV up to 50MB"
              : isAudio
              ? "MP3, WAV, M4A up to 25MB"
              : "PDF, DOCX, XLSX, TXT, ZIP up to 25MB"}
          </div>
        </div>
      )}
    </div>
  );
}

function renderPublicInput(
  field: FormField,
  value: any,
  onChange: (val: any) => void,
  theme: FormTheme,
  hasError?: string
) {
  const fieldStyles = getComputedFieldStyles(field, theme);

  const errorBorderColor = theme.inputs?.errorBorderColor || "#EF4444";
  const errorBgColor = theme.inputs?.errorBackgroundColor || undefined;

  const currentInputStyle: React.CSSProperties = hasError
    ? {
        ...fieldStyles.inputStyle,
        borderColor: errorBorderColor,
        boxShadow: `0 0 0 1px ${errorBorderColor}33`,
        backgroundColor: errorBgColor || fieldStyles.inputStyle.backgroundColor,
      }
    : fieldStyles.inputStyle;

  // 1. Star Rating
  if (field.type === "rating") {
    return (
      <div className="flex items-center gap-2 pt-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (value || 0) >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              style={fieldStyles.ratingStyle}
              className={`w-10 h-10 border flex items-center justify-center transition-all cursor-pointer ${
                isFilled ? "scale-105" : "hover:opacity-80"
              }`}
            >
              <Star
                className="w-5 h-5"
                style={{
                  fill: isFilled ? fieldStyles.ratingStyle.color : "none",
                  color: isFilled ? fieldStyles.ratingStyle.color : `${fieldStyles.ratingStyle.color}60`,
                }}
              />
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Linear Scale
  if (field.type === "linear_scale") {
    const min = field.min || 1;
    const max = field.max || 10;
    const scaleItems = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {scaleItems.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              style={
                value === num
                  ? {
                      backgroundColor: fieldStyles.accentColor,
                      color: "#FFFFFF",
                      borderColor: fieldStyles.accentColor,
                      borderRadius: fieldStyles.inputStyle.borderRadius,
                    }
                  : {
                      ...currentInputStyle,
                      padding: "0.25rem",
                    }
              }
              className="flex-1 min-w-[28px] h-9 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center"
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-[#78716C]">
          <span>{field.minLabel || `${min} = Poor`}</span>
          <span>{field.maxLabel || `${max} = Excellent`}</span>
        </div>
      </div>
    );
  }

  // 3. NPS
  if (field.type === "nps") {
    return (
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-11 gap-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              style={
                value === num
                  ? {
                      backgroundColor: fieldStyles.accentColor,
                      color: "#FFFFFF",
                      borderColor: fieldStyles.accentColor,
                      borderRadius: fieldStyles.inputStyle.borderRadius,
                    }
                  : {
                      ...currentInputStyle,
                      padding: "0.25rem",
                    }
              }
              className="h-9 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center"
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-[#78716C]">
          <span>0 (Not likely)</span>
          <span>10 (Extremely likely)</span>
        </div>
      </div>
    );
  }

  // 4. Single choice (Radio)
  if (field.type === "single_choice") {
    return (
      <div className="space-y-2">
        {(field.options || ["Option 1", "Option 2", "Option 3"]).map((opt) => (
          <label
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              ...fieldStyles.radioStyle,
              borderColor: hasError
                ? errorBorderColor
                : value === opt
                ? fieldStyles.accentColor
                : fieldStyles.radioStyle.borderColor,
              backgroundColor:
                value === opt ? `${fieldStyles.accentColor}10` : fieldStyles.radioStyle.backgroundColor,
            }}
            className="flex items-center gap-3 p-3 cursor-pointer transition-all"
          >
            <div
              style={{
                borderColor: value === opt ? fieldStyles.accentColor : "#D6D3D1",
                backgroundColor: value === opt ? fieldStyles.accentColor : "transparent",
              }}
              className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
            >
              {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: value === opt ? fieldStyles.accentColor : fieldStyles.inputStyle.color }}
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
    );
  }

  // 5. Multiple choice (Checkboxes)
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
              style={{
                ...fieldStyles.checkboxStyle,
                borderColor: hasError
                  ? errorBorderColor
                  : isChecked
                  ? fieldStyles.accentColor
                  : fieldStyles.checkboxStyle.borderColor,
                backgroundColor:
                  isChecked ? `${fieldStyles.accentColor}10` : fieldStyles.checkboxStyle.backgroundColor,
              }}
              className="flex items-center gap-3 p-3 cursor-pointer transition-all"
            >
              <div
                style={{
                  borderRadius: fieldStyles.checkboxStyle.borderRadius,
                  borderColor: isChecked ? fieldStyles.accentColor : "#D6D3D1",
                  backgroundColor: isChecked ? fieldStyles.accentColor : "transparent",
                  color: "#FFFFFF",
                }}
                className="w-4 h-4 border flex items-center justify-center shrink-0"
              >
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: isChecked ? fieldStyles.accentColor : fieldStyles.inputStyle.color }}
              >
                {opt}
              </span>
            </label>
          );
        })}
      </div>
    );
  }

  // 6. Matrix Grids
  if (field.type === "multiple_choice_grid" || field.type === "checkbox_grid") {
    const rows = field.rows || ["Row 1", "Row 2"];
    const cols = field.columns || ["Col 1", "Col 2", "Col 3"];
    const gridState: Record<string, any> = value || {};

    return (
      <div
        className="overflow-x-auto p-3"
        style={currentInputStyle}
      >
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-[#F5F2EB]">
              <th className="p-2 font-medium text-[#78716C]"></th>
              {cols.map((col, cIdx) => (
                <th key={cIdx} className="p-2 text-center font-medium text-[#78716C]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="border-b border-[#F5F2EB] last:border-none">
                <td className="p-2 font-medium text-[#1C1917]">{row}</td>
                {cols.map((col) => {
                  const isChecked =
                    field.type === "multiple_choice_grid"
                      ? gridState[row] === col
                      : Array.isArray(gridState[row]) && gridState[row].includes(col);

                  return (
                    <td key={col} className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (field.type === "multiple_choice_grid") {
                            onChange({ ...gridState, [row]: col });
                          } else {
                            const currentList = Array.isArray(gridState[row]) ? gridState[row] : [];
                            const nextList = isChecked
                              ? currentList.filter((c: string) => c !== col)
                              : [...currentList, col];
                            onChange({ ...gridState, [row]: nextList });
                          }
                        }}
                        style={{
                          backgroundColor: isChecked ? fieldStyles.accentColor : "#FAF8F5",
                          borderColor: isChecked ? fieldStyles.accentColor : "#D6D3D1",
                          color: "#FFFFFF",
                        }}
                        className={`w-4 h-4 mx-auto border flex items-center justify-center transition-all cursor-pointer ${
                          field.type === "multiple_choice_grid" ? "rounded-full" : "rounded-md"
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 7. Dropdown & Country
  if (field.type === "dropdown" || field.type === "country") {
    const defaultCountries = [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "Germany",
      "France",
      "Japan",
      "Singapore",
      "Other",
    ];
    const options =
      field.type === "country"
        ? defaultCountries
        : field.options || ["Option 1", "Option 2"];

    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={currentInputStyle}
        className="w-full focus:outline-none"
      >
        <option value="">{field.placeholder || "Select an option..."}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  // 8. Yes / No
  if (field.type === "yes_no") {
    return (
      <div className="flex items-center gap-3">
        {["Yes", "No"].map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onChange(choice)}
            style={
              value === choice
                ? {
                    backgroundColor: fieldStyles.accentColor,
                    color: "#FFFFFF",
                    borderColor: fieldStyles.accentColor,
                    borderRadius: fieldStyles.inputStyle.borderRadius,
                  }
                : currentInputStyle
            }
            className="flex-1 py-2.5 px-4 text-xs font-semibold transition-all cursor-pointer text-center"
          >
            {choice}
          </button>
        ))}
      </div>
    );
  }

  // 9. Currency & Percentage
  if (field.type === "currency") {
    return (
      <div
        className="flex items-center overflow-hidden"
        style={currentInputStyle}
      >
        <span className="px-3.5 py-2.5 border-r border-[#EAE3D6] text-xs font-bold opacity-75">
          {field.currencySymbol || "$"}
        </span>
        <input
          type="number"
          step="0.01"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 text-xs bg-transparent focus:outline-none"
          style={{ color: fieldStyles.inputStyle.color }}
        />
      </div>
    );
  }

  if (field.type === "percentage") {
    return (
      <div
        className="flex items-center overflow-hidden"
        style={currentInputStyle}
      >
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2 text-xs bg-transparent focus:outline-none"
          style={{ color: fieldStyles.inputStyle.color }}
        />
        <span className="px-3.5 py-2.5 border-l border-[#EAE3D6] text-xs font-bold opacity-75">
          %
        </span>
      </div>
    );
  }

  // 10. Quantity Stepper
  if (field.type === "quantity") {
    const qty = typeof value === "number" ? value : 1;
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, qty - 1))}
          style={currentInputStyle}
          className="w-9 h-9 flex items-center justify-center text-sm font-bold cursor-pointer"
        >
          -
        </button>
        <span className="text-sm font-semibold w-6 text-center" style={{ color: fieldStyles.inputStyle.color }}>
          {qty}
        </span>
        <button
          type="button"
          onClick={() => onChange(qty + 1)}
          style={currentInputStyle}
          className="w-9 h-9 flex items-center justify-center text-sm font-bold cursor-pointer"
        >
          +
        </button>
      </div>
    );
  }

  // 11. Full Address Block
  if (field.type === "address") {
    const addr = value || {};
    return (
      <div
        className="space-y-2.5 p-4"
        style={currentInputStyle}
      >
        <input
          type="text"
          value={addr.line1 || ""}
          onChange={(e) => onChange({ ...addr, line1: e.target.value })}
          placeholder="Street Address Line 1"
          className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
        />
        <input
          type="text"
          value={addr.line2 || ""}
          onChange={(e) => onChange({ ...addr, line2: e.target.value })}
          placeholder="Apartment, suite, unit (optional)"
          className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={addr.city || ""}
            onChange={(e) => onChange({ ...addr, city: e.target.value })}
            placeholder="City"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
          />
          <input
            type="text"
            value={addr.state || ""}
            onChange={(e) => onChange({ ...addr, state: e.target.value })}
            placeholder="State / Province"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={addr.postalCode || ""}
            onChange={(e) => onChange({ ...addr, postalCode: e.target.value })}
            placeholder="Postal / ZIP Code"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
          />
          <input
            type="text"
            value={addr.country || ""}
            onChange={(e) => onChange({ ...addr, country: e.target.value })}
            placeholder="Country"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  // 12. File Upload / Image / Video / Audio (Real File Dialog & Storage)
  if (
    field.type === "file_upload" ||
    field.type === "image_upload" ||
    field.type === "video_upload" ||
    field.type === "audio_upload"
  ) {
    return (
      <FileUploadFieldControl
        field={field}
        value={value}
        onChange={onChange}
        fieldStyles={fieldStyles}
        hasError={hasError}
        errorBorderColor={errorBorderColor}
      />
    );
  }

  // 13. Camera Capture
  if (field.type === "camera_capture") {
    return (
      <div
        onClick={() => onChange("snapshot_capture.jpg")}
        style={currentInputStyle}
        className="p-4 text-center flex items-center justify-center gap-2 text-xs font-semibold hover:opacity-90 cursor-pointer"
      >
        <Camera className="w-4 h-4" style={{ color: fieldStyles.accentColor }} />
        <span>{value ? `Snapshot captured: ${value}` : "Open Device Camera to Snap Photo"}</span>
      </div>
    );
  }

  // 14. Voice Recording
  if (field.type === "voice_recording") {
    return (
      <div
        style={currentInputStyle}
        className="p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${fieldStyles.accentColor}15`, color: fieldStyles.accentColor }}
          >
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold">
              {value ? "Voice Note Recorded" : "Voice Recording"}
            </div>
            <div className="text-[10px] opacity-70">Max 2 minutes</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange("voice_recording.mp3")}
          style={{
            backgroundColor: fieldStyles.accentColor,
            color: "#FFFFFF",
            borderRadius: fieldStyles.inputStyle.borderRadius,
          }}
          className="px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
        >
          {value ? "Re-record" : "Record"}
        </button>
      </div>
    );
  }

  // 15. Signature Pad
  if (field.type === "signature") {
    return (
      <div
        style={currentInputStyle}
        className="p-4 h-28 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-[11px] opacity-70">
          <span className="flex items-center gap-1">
            <PenTool className="w-3 h-3" style={{ color: fieldStyles.accentColor }} /> Draw signature
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{ color: fieldStyles.accentColor }}
            className="hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div
          onClick={() => onChange("signature_token_svg")}
          className="h-12 border-b-2 border-dashed border-[#EAE3D6] flex items-center justify-center text-xs opacity-70 italic cursor-crosshair"
        >
          {value ? "Signed ✓" : "Click to sign"}
        </div>
      </div>
    );
  }

  // 16. Color Picker
  if (field.type === "color_picker") {
    return (
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#FF5A36"}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-xl cursor-pointer border border-[#EAE3D6] p-1 bg-white"
        />
        <span className="text-xs font-mono font-semibold" style={{ color: fieldStyles.inputStyle.color }}>
          {value || "#FF5A36"}
        </span>
      </div>
    );
  }

  // 17. Date Range & Duration
  if (field.type === "date_range") {
    const range = value || {};
    return (
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={range.start || ""}
          onChange={(e) => onChange({ ...range, start: e.target.value })}
          style={currentInputStyle}
          className="flex-1 focus:outline-none"
        />
        <span className="text-xs opacity-60">to</span>
        <input
          type="date"
          value={range.end || ""}
          onChange={(e) => onChange({ ...range, end: e.target.value })}
          style={currentInputStyle}
          className="flex-1 focus:outline-none"
        />
      </div>
    );
  }

  if (field.type === "duration") {
    const dur = value || {};
    return (
      <div className="flex items-center gap-2">
        <div
          className="flex-1 flex items-center overflow-hidden"
          style={currentInputStyle}
        >
          <input
            type="number"
            min={0}
            value={dur.hours || ""}
            onChange={(e) => onChange({ ...dur, hours: e.target.value })}
            placeholder="0"
            className="w-full px-3 py-2 text-xs bg-transparent focus:outline-none"
            style={{ color: fieldStyles.inputStyle.color }}
          />
          <span className="pr-3 text-xs opacity-70">hrs</span>
        </div>
        <div
          className="flex-1 flex items-center overflow-hidden"
          style={currentInputStyle}
        >
          <input
            type="number"
            min={0}
            max={59}
            value={dur.minutes || ""}
            onChange={(e) => onChange({ ...dur, minutes: e.target.value })}
            placeholder="0"
            className="w-full px-3 py-2 text-xs bg-transparent focus:outline-none"
            style={{ color: fieldStyles.inputStyle.color }}
          />
          <span className="pr-3 text-xs opacity-70">mins</span>
        </div>
      </div>
    );
  }

  // 18. Long text
  if (field.type === "long_text") {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || "Type your response..."}
        rows={3}
        style={
          hasError
            ? {
                ...fieldStyles.textareaStyle,
                borderColor: errorBorderColor,
                boxShadow: `0 0 0 1px ${errorBorderColor}33`,
                backgroundColor: errorBgColor || fieldStyles.textareaStyle.backgroundColor,
              }
            : fieldStyles.textareaStyle
        }
        className="w-full focus:outline-none"
      />
    );
  }

  // 19. Phone Number input (Strict digit & phone format filtering)
  if (field.type === "phone") {
    return (
      <input
        type="tel"
        inputMode="tel"
        value={value || ""}
        onChange={(e) => {
          // Strictly reject sentences and letter characters: allow digits, +, -, (, ), spaces, .
          const cleaned = e.target.value.replace(/[^0-9+\s()\-.]/g, "");
          onChange(cleaned);
        }}
        onKeyDown={(e) => {
          const allowedKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Enter",
            "Home",
            "End",
          ];
          if (
            !allowedKeys.includes(e.key) &&
            !e.ctrlKey &&
            !e.metaKey &&
            !/^[0-9+\s()\-.]*$/.test(e.key)
          ) {
            e.preventDefault();
          }
        }}
        placeholder={field.placeholder || "+1 (555) 000-0000"}
        style={currentInputStyle}
        className="w-full focus:outline-none"
      />
    );
  }

  // Custom Input Field
  if (field.type === "custom_input") {
    const inputType = field.customInputType || "text";
    if (inputType === "color") {
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || "#FF5A36"}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded-xl border border-[#EAE3D6] cursor-pointer p-0.5 bg-white"
          />
          <span className="text-xs font-mono font-semibold" style={{ color: fieldStyles.inputStyle.color }}>
            {value || "#FF5A36"}
          </span>
        </div>
      );
    }
    if (inputType === "range") {
      return (
        <div
          className="space-y-1.5 p-3"
          style={currentInputStyle}
        >
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={value ?? 50}
            onChange={(e) => onChange(e.target.value)}
            className="w-full accent-[#FF5A36]"
            style={{ accentColor: fieldStyles.accentColor }}
          />
          <div className="flex justify-between text-xs opacity-70">
            <span>{field.min ?? 0}</span>
            <span className="font-semibold">{value ?? 50}</span>
            <span>{field.max ?? 100}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <input
          type={inputType}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || `Enter ${field.label}...`}
          style={currentInputStyle}
          className={`w-full focus:outline-none ${field.customClass || ""}`}
        />
        {field.helpText && (
          <p className="text-[11px] text-[#78716C]">{field.helpText}</p>
        )}
      </div>
    );
  }

  // Default text, password, number, etc.
  return (
    <input
      type={
        field.type === "email"
          ? "email"
          : field.type === "password"
          ? "password"
          : field.type === "number" || field.type === "decimal"
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
      style={currentInputStyle}
      className="w-full focus:outline-none"
    />
  );
}
