"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  Upload,
  Image as ImageIcon,
  Video,
  Mic,
  Camera,
  PenTool,
  MapPin,
  Globe2,
  Navigation,
  KeyRound,
  CalendarRange,
  Hourglass,
  Calendar,
  Clock,
  CircleDot,
  CheckSquare,
} from "lucide-react";
import { FormField, FormStyle } from "@/lib/api-client";
import { FormTheme, resolveFormTheme, getThemeComputedStyles, getComputedFieldStyles } from "@/lib/form-theme";
import { DynamicFontLoader } from "./DynamicFontLoader";
import { ViewportMode } from "./BuilderTopBar";

interface BuilderPreviewProps {
  title: string;
  description: string | null;
  style: FormStyle;
  theme?: FormTheme;
  fields: FormField[];
  viewport: ViewportMode;
  onClose: () => void;
}

export function BuilderPreview({
  title,
  description,
  style,
  theme: rawTheme,
  fields,
  viewport,
  onClose,
}: BuilderPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const theme = resolveFormTheme(rawTheme, style);
  const { backgroundStyle, containerStyle, inputStyle, buttonStyle, headingStyle } =
    getThemeComputedStyles(theme);

  const handleAnswerChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const currentField = fields[currentStep];
  const currentFieldStyles = currentField ? getComputedFieldStyles(currentField, theme) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden animate-in fade-in duration-200"
      style={backgroundStyle}
      data-lenis-prevent="true"
    >
      <DynamicFontLoader theme={theme} />

      {/* Preview Header */}
      <div className="h-14 border-b border-[#EAE3D6] bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF0EB] text-[#FF5A36] border border-[#FFD8CC]">
            Preview Mode
          </span>
          <span className="text-xs text-[#78716C] hidden sm:inline">
            ({style.charAt(0).toUpperCase() + style.slice(1)} style)
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] border border-[#EAE3D6] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Exit Preview</span>
        </button>
      </div>

      {/* Preview Content Area */}
      <div
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8 flex items-center justify-center overscroll-contain"
        data-lenis-prevent="true"
      >
        <div
          className={`w-full transition-all duration-300 ${
            viewport === "mobile" ? "max-w-[390px]" : "max-w-2xl"
          }`}
        >
          {submitted ? (
            /* Success screen simulation */
            <div
              className="p-10 sm:p-14 text-center card-shadow space-y-4"
              style={containerStyle}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 style={headingStyle} className="tracking-tight">
                Thank you!
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] max-w-sm mx-auto">
                Your response was recorded in preview simulation mode.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setCurrentStep(0);
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-[#FF5A36] hover:underline cursor-pointer"
              >
                Restart Preview
              </button>
            </div>
          ) : style.toLowerCase() === "conversation" ? (
            /* Conversation: One question at a time */
            <div
              className="p-8 sm:p-12 card-shadow space-y-8 min-h-[380px] flex flex-col justify-between"
              style={containerStyle}
            >
              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-medium text-[#78716C] mb-6">
                  <span>
                    Question {currentStep + 1} of {fields.length || 1}
                  </span>
                  <span>
                    {Math.round(((currentStep + 1) / (fields.length || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#F5F2EB] rounded-full overflow-hidden mb-8">
                  <div
                    className="h-full bg-[#FF5A36] transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / (fields.length || 1)) * 100}%`,
                      backgroundColor: theme.colors.primary || "#FF5A36",
                    }}
                  />
                </div>

                {currentField ? (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h3 style={currentFieldStyles?.inputLabelStyle || headingStyle}>
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
                    </h3>
                    {currentField.description && (
                      <p className="text-xs text-[#78716C]">
                        {currentField.description}
                      </p>
                    )}

                    {/* Input */}
                    <div className="pt-2">
                      {renderPreviewInput(currentField, answers, handleAnswerChange, theme)}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#78716C]">No questions in form.</p>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-[#F5F2EB]">
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                  disabled={currentStep === 0}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#78716C] disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                {currentStep < fields.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s + 1)}
                    style={buttonStyle}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    style={buttonStyle}
                    className="cursor-pointer"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Multi-field list view */
            <div
              className="p-8 sm:p-12 card-shadow space-y-6"
              style={containerStyle}
            >
              <div className="border-b border-[#F5F2EB] pb-6 space-y-2">
                <h1 style={headingStyle} className="tracking-tight">
                  {title || "Untitled Form"}
                </h1>
                {description && (
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: theme.colors.mutedText || "#78716C" }}
                  >
                    {description}
                  </p>
                )}
              </div>

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

                  return (
                    <div key={field.id} style={fieldStyles.fieldCardStyle} className="space-y-2">
                      <label
                        className="block text-xs sm:text-sm"
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
                        <p className="text-[11px] text-[#78716C]">
                          {field.description}
                        </p>
                      )}
                      {renderPreviewInput(field, answers, handleAnswerChange, theme)}
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-[#F5F2EB] flex justify-end">
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  style={buttonStyle}
                  className="cursor-pointer"
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
  onChange: (fieldId: string, val: any) => void,
  theme: FormTheme
) {
  const currentVal = answers[field.id];
  const fieldStyles = getComputedFieldStyles(field, theme);

  // 1. Rating (Stars)
  if (field.type === "rating") {
    return (
      <div className="flex items-center gap-2 pt-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (currentVal || 0) >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(field.id, star)}
              style={fieldStyles.ratingStyle}
              className={`w-9 h-9 border flex items-center justify-center transition-all cursor-pointer ${
                isFilled
                  ? "border-amber-300"
                  : "hover:text-amber-400"
              }`}
            >
              <Star
                className="w-4 h-4"
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

  // 2. Linear Scale (1-10)
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
              onClick={() => onChange(field.id, num)}
              style={
                currentVal === num
                  ? {
                      backgroundColor: fieldStyles.accentColor,
                      color: "#FFFFFF",
                      borderColor: fieldStyles.accentColor,
                      borderRadius: fieldStyles.inputStyle.borderRadius,
                    }
                  : {
                      ...fieldStyles.inputStyle,
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

  // 3. NPS (0-10)
  if (field.type === "nps") {
    return (
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-11 gap-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(field.id, num)}
              style={
                currentVal === num
                  ? {
                      backgroundColor: fieldStyles.accentColor,
                      color: "#FFFFFF",
                      borderColor: fieldStyles.accentColor,
                      borderRadius: fieldStyles.inputStyle.borderRadius,
                    }
                  : {
                      ...fieldStyles.inputStyle,
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

  // 4. Single Choice (Radio)
  if (field.type === "single_choice") {
    return (
      <div className="space-y-2">
        {(field.options || ["Option 1", "Option 2", "Option 3"]).map((opt) => (
          <label
            key={opt}
            onClick={() => onChange(field.id, opt)}
            style={{
              ...fieldStyles.radioStyle,
              borderColor: currentVal === opt ? fieldStyles.accentColor : fieldStyles.radioStyle.borderColor,
              backgroundColor: currentVal === opt ? `${fieldStyles.accentColor}10` : fieldStyles.radioStyle.backgroundColor,
            }}
            className="flex items-center gap-3 p-3 cursor-pointer transition-all"
          >
            <div
              style={{
                borderColor: currentVal === opt ? fieldStyles.accentColor : "#D6D3D1",
                backgroundColor: currentVal === opt ? fieldStyles.accentColor : "transparent",
              }}
              className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
            >
              {currentVal === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: currentVal === opt ? fieldStyles.accentColor : fieldStyles.inputStyle.color }}
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
    );
  }

  // 5. Multiple Choice (Checkboxes)
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
              style={{
                ...fieldStyles.checkboxStyle,
                borderColor: isChecked ? fieldStyles.accentColor : fieldStyles.checkboxStyle.borderColor,
                backgroundColor: isChecked ? `${fieldStyles.accentColor}10` : fieldStyles.checkboxStyle.backgroundColor,
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

  // 6. Matrix Grids (Multiple Choice Grid & Checkbox Grid)
  if (field.type === "multiple_choice_grid" || field.type === "checkbox_grid") {
    const rows = field.rows || ["Row 1", "Row 2"];
    const cols = field.columns || ["Col 1", "Col 2", "Col 3"];
    const gridState: Record<string, any> = currentVal || {};

    return (
      <div
        className="overflow-x-auto p-3"
        style={fieldStyles.inputStyle}
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
                            onChange(field.id, { ...gridState, [row]: col });
                          } else {
                            const currentList = Array.isArray(gridState[row]) ? gridState[row] : [];
                            const nextList = isChecked
                              ? currentList.filter((c: string) => c !== col)
                              : [...currentList, col];
                            onChange(field.id, { ...gridState, [row]: nextList });
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

  // 7. Dropdown & Country Select
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
    ];
    const options =
      field.type === "country"
        ? defaultCountries
        : field.options || ["Option 1", "Option 2"];

    return (
      <select
        value={currentVal || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        style={fieldStyles.inputStyle}
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
            onClick={() => onChange(field.id, choice)}
            style={
              currentVal === choice
                ? {
                    backgroundColor: fieldStyles.accentColor,
                    color: "#FFFFFF",
                    borderColor: fieldStyles.accentColor,
                    borderRadius: fieldStyles.inputStyle.borderRadius,
                  }
                : fieldStyles.inputStyle
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
        style={fieldStyles.inputStyle}
      >
        <span className="px-3.5 py-2.5 border-r border-[#EAE3D6] text-xs font-bold opacity-75">
          {field.currencySymbol || "$"}
        </span>
        <input
          type="number"
          step="0.01"
          value={currentVal || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
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
        style={fieldStyles.inputStyle}
      >
        <input
          type="number"
          value={currentVal || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
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
    const qty = typeof currentVal === "number" ? currentVal : 1;
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(field.id, Math.max(1, qty - 1))}
          style={fieldStyles.inputStyle}
          className="w-9 h-9 flex items-center justify-center text-sm font-bold cursor-pointer"
        >
          -
        </button>
        <span className="text-sm font-semibold w-6 text-center" style={{ color: fieldStyles.inputStyle.color }}>
          {qty}
        </span>
        <button
          type="button"
          onClick={() => onChange(field.id, qty + 1)}
          style={fieldStyles.inputStyle}
          className="w-9 h-9 flex items-center justify-center text-sm font-bold cursor-pointer"
        >
          +
        </button>
      </div>
    );
  }

  // 11. Full Address Block
  if (field.type === "address") {
    const addr = currentVal || {};
    return (
      <div
        className="space-y-2.5 p-4"
        style={fieldStyles.inputStyle}
      >
        <input
          type="text"
          value={addr.line1 || ""}
          onChange={(e) => onChange(field.id, { ...addr, line1: e.target.value })}
          placeholder="Street Address Line 1"
          className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
        />
        <input
          type="text"
          value={addr.line2 || ""}
          onChange={(e) => onChange(field.id, { ...addr, line2: e.target.value })}
          placeholder="Apartment, suite, unit (optional)"
          className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={addr.city || ""}
            onChange={(e) => onChange(field.id, { ...addr, city: e.target.value })}
            placeholder="City"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
          />
          <input
            type="text"
            value={addr.state || ""}
            onChange={(e) => onChange(field.id, { ...addr, state: e.target.value })}
            placeholder="State / Province"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={addr.postalCode || ""}
            onChange={(e) => onChange(field.id, { ...addr, postalCode: e.target.value })}
            placeholder="Postal / ZIP Code"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
          />
          <input
            type="text"
            value={addr.country || ""}
            onChange={(e) => onChange(field.id, { ...addr, country: e.target.value })}
            placeholder="Country"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE3D6] bg-white/70 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  // 12. File Upload / Image / Video / Audio
  if (
    field.type === "file_upload" ||
    field.type === "image_upload" ||
    field.type === "video_upload" ||
    field.type === "audio_upload"
  ) {
    const Icon =
      field.type === "image_upload"
        ? ImageIcon
        : field.type === "video_upload"
        ? Video
        : field.type === "audio_upload"
        ? Mic
        : Upload;

    return (
      <div
        onClick={() => onChange(field.id, "sample_uploaded_file.png")}
        style={fieldStyles.dropzoneStyle}
        className="p-6 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            color: fieldStyles.accentColor,
            border: `1px solid ${fieldStyles.dropzoneStyle.borderColor}`,
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-xs font-semibold">
          {currentVal ? `Attached: ${currentVal}` : "Click to select or drag & drop"}
        </div>
        <div className="text-[10px] opacity-70">
          Up to 25MB file attachment simulated in preview
        </div>
      </div>
    );
  }

  // 13. Camera Capture
  if (field.type === "camera_capture") {
    return (
      <div
        onClick={() => onChange(field.id, "camera_capture_photo.jpg")}
        style={fieldStyles.inputStyle}
        className="p-4 text-center flex items-center justify-center gap-2 text-xs font-semibold hover:opacity-90 cursor-pointer"
      >
        <Camera className="w-4 h-4" style={{ color: fieldStyles.accentColor }} />
        <span>{currentVal ? `Captured: ${currentVal}` : "Open Device Camera to Take Snapshot"}</span>
      </div>
    );
  }

  // 14. Voice Recording
  if (field.type === "voice_recording") {
    return (
      <div
        style={fieldStyles.inputStyle}
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
              {currentVal ? "Voice Note Recorded (00:32)" : "Voice Recording"}
            </div>
            <div className="text-[10px] opacity-70">Max 2 minutes memo</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(field.id, "voice_memo_01.mp3")}
          style={{
            backgroundColor: fieldStyles.accentColor,
            color: "#FFFFFF",
            borderRadius: fieldStyles.inputStyle.borderRadius,
          }}
          className="px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
        >
          {currentVal ? "Re-record" : "Record"}
        </button>
      </div>
    );
  }

  // 15. Signature Pad
  if (field.type === "signature") {
    return (
      <div
        style={fieldStyles.inputStyle}
        className="p-4 h-28 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-[11px] opacity-70">
          <span className="flex items-center gap-1">
            <PenTool className="w-3 h-3" style={{ color: fieldStyles.accentColor }} /> Digital Signature Pad
          </span>
          <button
            type="button"
            onClick={() => onChange(field.id, null)}
            style={{ color: fieldStyles.accentColor }}
            className="hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div
          onClick={() => onChange(field.id, "signature_svg_data")}
          className="h-12 border-b-2 border-dashed border-[#EAE3D6] flex items-center justify-center text-xs opacity-70 italic cursor-crosshair"
        >
          {currentVal ? "Signed ✓" : "Click / Drag mouse to draw signature"}
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
          value={currentVal || "#FF5A36"}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="w-10 h-10 rounded-xl cursor-pointer border border-[#EAE3D6] p-1 bg-white"
        />
        <span className="text-xs font-mono font-semibold" style={{ color: fieldStyles.inputStyle.color }}>
          {currentVal || "#FF5A36"}
        </span>
      </div>
    );
  }

  // 17. Date Range & Duration
  if (field.type === "date_range") {
    const range = currentVal || {};
    return (
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={range.start || ""}
          onChange={(e) => onChange(field.id, { ...range, start: e.target.value })}
          style={fieldStyles.inputStyle}
          className="flex-1 focus:outline-none"
        />
        <span className="text-xs opacity-60">to</span>
        <input
          type="date"
          value={range.end || ""}
          onChange={(e) => onChange(field.id, { ...range, end: e.target.value })}
          style={fieldStyles.inputStyle}
          className="flex-1 focus:outline-none"
        />
      </div>
    );
  }

  if (field.type === "duration") {
    const dur = currentVal || {};
    return (
      <div className="flex items-center gap-2">
        <div
          className="flex-1 flex items-center overflow-hidden"
          style={fieldStyles.inputStyle}
        >
          <input
            type="number"
            min={0}
            value={dur.hours || ""}
            onChange={(e) => onChange(field.id, { ...dur, hours: e.target.value })}
            placeholder="0"
            className="w-full px-3 py-2 text-xs bg-transparent focus:outline-none"
            style={{ color: fieldStyles.inputStyle.color }}
          />
          <span className="pr-3 text-xs opacity-70">hours</span>
        </div>
        <div
          className="flex-1 flex items-center overflow-hidden"
          style={fieldStyles.inputStyle}
        >
          <input
            type="number"
            min={0}
            max={59}
            value={dur.minutes || ""}
            onChange={(e) => onChange(field.id, { ...dur, minutes: e.target.value })}
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
        value={currentVal || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder || "Type your response..."}
        rows={3}
        style={fieldStyles.textareaStyle}
        className="w-full focus:outline-none"
      />
    );
  }

  // Custom Input Field
  if (field.type === "custom_input") {
    const inputType = field.customInputType || "text";
    return (
      <div className="space-y-1.5">
        <input
          type={inputType}
          value={currentVal || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder || `Enter ${field.label}...`}
          style={fieldStyles.inputStyle}
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
      value={currentVal || ""}
      onChange={(e) => onChange(field.id, e.target.value)}
      placeholder={
        field.placeholder ||
        (field.type === "email"
          ? "name@example.com"
          : field.type === "url"
          ? "https://..."
          : field.type === "phone"
          ? "+1 (555) 000-0000"
          : "Enter your answer...")
      }
      style={fieldStyles.inputStyle}
      className="w-full focus:outline-none"
    />
  );
}
