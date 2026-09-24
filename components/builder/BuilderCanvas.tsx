"use client";

import React, { useState } from "react";
import {
  Check,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  Star,
  CircleDot,
  CheckSquare,
  ChevronDownSquare,
  Upload,
  Image as ImageIcon,
  Video,
  Mic,
  Camera,
  Music,
  PenTool,
  Navigation,
  KeyRound,
  CalendarRange,
  Hourglass,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { FormField, FormStyle } from "@/lib/api-client";
import { FormTheme, resolveFormTheme, getThemeComputedStyles, getComputedFieldStyles } from "@/lib/form-theme";
import { CardSurfaceBackground } from "@/components/public-form/CardSurfaceBackground";
import { ViewportMode } from "./BuilderTopBar";

interface BuilderCanvasProps {
  title: string;
  description: string | null;
  style: FormStyle;
  theme?: FormTheme;
  fields: FormField[];
  selectedFieldId: string | null;
  viewport: ViewportMode;
  onSelectField: (fieldId: string) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDuplicateField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  onMoveField: (fieldId: string, direction: "up" | "down") => void;
  onReorderFields?: (fromIndex: number, toIndex: number) => void;
  onOpenFieldLibrary?: () => void;
}

export function BuilderCanvas({
  title,
  description,
  style,
  theme: rawTheme,
  fields,
  selectedFieldId,
  viewport,
  onSelectField,
  onUpdateField,
  onDuplicateField,
  onDeleteField,
  onMoveField,
  onReorderFields,
  onOpenFieldLibrary,
}: BuilderCanvasProps) {
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);

  // Drag and Drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after">("before");

  const theme = resolveFormTheme(rawTheme, style);
  const { backgroundStyle, containerStyle, inputStyle, buttonStyle, headingStyle, descriptionStyle } =
    getThemeComputedStyles(theme);

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midpoint = targetRect.top + targetRect.height / 2;
    const position = e.clientY < midpoint ? "before" : "after";

    setDropTargetIndex(index);
    setDropPosition(position);
  };

  const handleDragLeave = () => {
    // Left container
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === undefined) return;

    let destinationIndex = targetIndex;
    if (dropPosition === "after" && draggedIndex < targetIndex) {
      destinationIndex = targetIndex;
    } else if (dropPosition === "before" && draggedIndex > targetIndex) {
      destinationIndex = targetIndex;
    }

    if (onReorderFields && draggedIndex !== destinationIndex) {
      onReorderFields(draggedIndex, destinationIndex);
    }

    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  return (
    <main
      className="flex-1 min-h-0 min-w-0 h-full overflow-y-auto p-4 sm:p-8 flex flex-col items-center overscroll-contain transition-all relative select-none"
      style={backgroundStyle}
      data-lenis-prevent="true"
    >
      {/* Background Overlay if opacity > 0 */}
      {theme.background.overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none transition-all z-0"
          style={{
            backgroundColor: theme.background.overlayColor || "#000000",
            opacity: theme.background.overlayOpacity / 100,
          }}
        />
      )}

      {/* Form Viewport Frame */}
      <div
        className={`w-full transition-all duration-300 relative z-10 ${viewport === "mobile" ? "max-w-sm" : ""
          }`}
        style={{ maxWidth: viewport === "mobile" ? "24rem" : containerStyle.maxWidth }}
      >
        {/* Header Banner Image (if configured) */}
        {theme.branding.headerImageUrl && (
          <div
            className="w-full rounded-t-3xl overflow-hidden mb-[-1.5rem] relative z-0 border border-b-0 border-[#EAE3D6] shadow-sm"
            style={{
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

        {/* ===================================================================== */}
        {/* MAIN CARD SURFACE (Highly customizable container)                     */}
        {/* ===================================================================== */}
        <div
          className="transition-all relative z-10"
          style={containerStyle}
        >
          {/* Card Background Image & Blur Layer */}
          <CardSurfaceBackground theme={theme} />

          {/* Form Branding Logo (if configured) */}
          {theme.branding.logoUrl && (
            <div
              className={`mb-6 flex ${theme.branding.logoPosition === "center"
                  ? "justify-center"
                  : theme.branding.logoPosition === "right"
                    ? "justify-end"
                    : "justify-start"
                }`}
            >
              <img
                src={theme.branding.logoUrl}
                alt="Form logo"
                className="rounded-xl object-contain"
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

          {/* Form Header */}
          <div
            className="border-b pb-6 mb-8 space-y-2"
            style={{ borderBottomColor: theme.container.borderColor || theme.colors.border || "#F5F2EB" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                style={{
                  backgroundColor: theme.colors.accent || "#FFF0EB",
                  color: theme.colors.primary || "#FF5A36",
                  borderColor: `${theme.colors.primary}33`,
                }}
              >
                <Sparkles className="w-3 h-3" />
                {style.charAt(0).toUpperCase() + style.slice(1)} Style
              </span>
            </div>

            <h1 style={headingStyle} className="tracking-tight">
              {title || "Untitled Form"}
            </h1>

            {description && (
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={descriptionStyle}
              >
                {description}
              </p>
            )}
          </div>

          {/* Form Fields Canvas */}
          {fields.length === 0 ? (
            /* Empty Canvas State */
            <div className="rounded-2xl border-2 border-dashed border-[#E7E2D8] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] text-[#FF5A36] border border-[#FFD8CC] flex items-center justify-center mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#1C1917]">
                Start building your form
              </h3>
              <p className="text-xs text-[#78716C] max-w-xs mt-1.5 leading-relaxed">
                Add questions, media, location, and choice blocks from the left library.
              </p>
              {onOpenFieldLibrary && (
                <button
                  type="button"
                  onClick={onOpenFieldLibrary}
                  className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#FF5A36] hover:bg-[#E04826] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  + Add Question
                </button>
              )}
            </div>
          ) : (
            <div
              className="space-y-4"
              style={{
                gap: theme.inputs.customFieldSpacing ? `${theme.inputs.customFieldSpacing}px` : undefined,
              }}
            >
              {fields.map((field, index) => {
                const isSelected = selectedFieldId === field.id;
                const isEditingLabel = editingLabelId === field.id;
                const isDropTarget = dropTargetIndex === index;
                const fieldStyles = getComputedFieldStyles(field, theme);

                // Special presentation for dividers
                if (field.type === "divider") {
                  return (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onSelectField(field.id)}
                      className={`group relative py-3 my-2 cursor-pointer transition-all rounded-xl p-2 ${isSelected
                          ? "bg-white ring-2 ring-[#FF5A36]"
                          : "hover:bg-white/60"
                        }`}
                    >
                      {isDropTarget && dropPosition === "before" && (
                        <div className="absolute -top-1 left-2 right-2 h-1 bg-[#FF5A36] rounded-full z-20" />
                      )}
                      <div className="h-px w-full bg-[#EAE3D6]" />
                      {isSelected && (
                        <div className="absolute -top-3.5 right-4 z-10 flex items-center gap-1 bg-[#1C1917] text-white p-1 rounded-xl shadow-lg">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteField(field.id);
                            }}
                            className="p-1 rounded-lg text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                // Special presentation for Section Headings
                if (field.type === "section_heading") {
                  return (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onSelectField(field.id)}
                      className={`group relative pt-4 pb-2 border-b border-[#F5F2EB] cursor-pointer transition-all rounded-xl p-3 ${isSelected
                          ? "bg-white ring-2 ring-[#FF5A36]"
                          : "hover:bg-white/60"
                        }`}
                    >
                      {isDropTarget && dropPosition === "before" && (
                        <div className="absolute -top-1 left-2 right-2 h-1 bg-[#FF5A36] rounded-full z-20" />
                      )}
                      <div className="flex items-center gap-2">
                        <div className="text-[#A8A29E] cursor-grab p-0.5">
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#1C1917]">
                          {field.label}
                        </h3>
                      </div>
                      {field.description && (
                        <p className="text-xs mt-0.5 pl-6" style={descriptionStyle}>
                          {field.description}
                        </p>
                      )}
                      {isSelected && (
                        <div className="absolute -top-3.5 right-4 z-10 flex items-center gap-1 bg-[#1C1917] text-white p-1 rounded-xl shadow-lg">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteField(field.id);
                            }}
                            className="p-1 rounded-lg text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onSelectField(field.id)}
                    style={isSelected ? fieldStyles.fieldCardSelectedStyle : fieldStyles.fieldCardStyle}
                    className="group relative transition-all cursor-pointer"
                  >
                    {isDropTarget && dropPosition === "before" && (
                      <div className="absolute -top-1 left-2 right-2 h-1 bg-[#FF5A36] rounded-full z-20" />
                    )}

                    {/* Floating Action Toolbar on Selected Field */}
                    {isSelected && (
                      <div className="absolute -top-3.5 right-4 z-10 flex items-center gap-1 bg-[#1C1917] text-white p-1 rounded-xl shadow-lg animate-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveField(field.id, "up");
                          }}
                          disabled={index === 0}
                          aria-label="Move question up"
                          className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
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
                          className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        <div className="h-3 w-px bg-white/20" />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateField(field.id);
                          }}
                          aria-label="Duplicate question"
                          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
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
                          className="p-1 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Question Header & Inline Label Editing */}
                    <div className="space-y-1 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="text-[#A8A29E] cursor-grab p-0.5" title="Drag to reorder">
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>

                        <span className="text-[11px] font-mono text-[#A8A29E] font-semibold">
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
                            className="text-xs sm:text-sm font-semibold text-[#1C1917] bg-white px-2 py-0.5 rounded-lg border border-[#FF5A36] focus:outline-none w-full"
                          />
                        ) : (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingLabelId(field.id);
                            }}
                            style={fieldStyles.inputLabelStyle}
                            title="Click to edit label directly"
                            className="hover:opacity-80 rounded px-1 transition-opacity cursor-pointer inline-block"
                          >
                            {field.label || "Untitled Question"}
                          </span>
                        )}

                        {field.required && fieldStyles.requiredIndicator !== "none" && (
                          fieldStyles.requiredIndicator === "badge" ? (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider"
                              style={{ color: fieldStyles.requiredColor, backgroundColor: `${fieldStyles.requiredColor}18` }}
                            >
                              Required
                            </span>
                          ) : fieldStyles.requiredIndicator === "dot" ? (
                            <span
                              className="w-1.5 h-1.5 rounded-full inline-block"
                              style={{ backgroundColor: fieldStyles.requiredColor }}
                            />
                          ) : (
                            <span style={{ color: fieldStyles.requiredColor }} className="text-xs font-bold" title="Required">
                              *
                            </span>
                          )
                        )}
                      </div>

                      {field.description && (
                        <p className="text-[11px] pl-6" style={descriptionStyle}>
                          {field.description}
                        </p>
                      )}
                    </div>

                    {/* Question Mockup Input Previews */}
                    <div className="pl-6">{renderCanvasFieldMockup(field, fieldStyles, theme)}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Submit Button Preview */}
          <div
            className="mt-10 pt-6 border-t flex justify-end"
            style={{ borderTopColor: theme.container.borderColor || theme.colors.border || "#F5F2EB" }}
          >
            <button
              type="button"
              disabled
              style={buttonStyle}
              className="opacity-95 cursor-default transition-all"
            >
              Submit Response
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function renderCanvasFieldMockup(
  field: FormField,
  fieldStyles?: ReturnType<typeof getComputedFieldStyles>,
  theme?: FormTheme
) {
  const inputStyle = fieldStyles?.inputStyle;
  const textareaStyle = fieldStyles?.textareaStyle;
  const dropzoneStyle = fieldStyles?.dropzoneStyle;
  const ratingStyle = fieldStyles?.ratingStyle;
  const ratingActiveColor = fieldStyles?.ratingActiveColor || "#F59E0B";
  const ratingInactiveColor = fieldStyles?.ratingInactiveColor || "#EAE3D6";
  const ratingSize = fieldStyles?.ratingSize || 20;
  const checkboxStyle = fieldStyles?.checkboxStyle;
  const radioStyle = fieldStyles?.radioStyle;
  const accentColor = fieldStyles?.accentColor || "#FF5A36";

  // Custom Input Field
  if (field.type === "custom_input") {
    const inputType = field.customInputType || "text";
    if (inputType === "color") {
      return (
        <div className="flex items-center gap-3 p-2 border shadow-2xs" style={inputStyle}>
          <div className="w-6 h-6 rounded-lg border border-black/10 shadow-2xs" style={{ backgroundColor: accentColor }} />
          <span className="text-xs font-mono font-semibold" style={{ color: inputStyle?.color }}>{accentColor}</span>
        </div>
      );
    }
    if (inputType === "range") {
      return (
        <div className="space-y-1.5 p-2.5 border shadow-2xs" style={inputStyle}>
          <div className="flex justify-between text-[11px] opacity-70">
            <span>Min (0)</span>
            <span>Current (50)</span>
            <span>Max (100)</span>
          </div>
          <input type="range" disabled className="w-full" style={{ accentColor }} />
        </div>
      );
    }
    return (
      <div
        className={`px-3.5 py-2.5 border flex items-center justify-between text-xs shadow-2xs ${field.customClass || ""}`}
        style={inputStyle}
      >
        <span style={{ opacity: 0.7 }}>
          {field.placeholder || `Enter custom ${inputType}...`}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-black/10 bg-black/5">
          {inputType}
        </span>
      </div>
    );
  }

  // 1. Text & Basic Inputs
  if (
    field.type === "short_text" ||
    field.type === "email" ||
    field.type === "phone" ||
    field.type === "url" ||
    field.type === "number" ||
    field.type === "decimal" ||
    field.type === "date" ||
    field.type === "time"
  ) {
    return (
      <div className="px-3.5 py-2.5 border text-xs shadow-2xs flex items-center" style={inputStyle}>
        <span style={{ opacity: 0.7 }}>
          {field.placeholder ||
            (field.type === "email"
              ? "name@example.com"
              : field.type === "phone"
                ? "+1 (555) 000-0000"
                : field.type === "url"
                  ? "https://..."
                  : field.type === "date"
                    ? "YYYY-MM-DD"
                    : field.type === "time"
                      ? "12:00 PM"
                      : field.type === "decimal"
                        ? "0.00"
                        : "Enter response...")}
        </span>
      </div>
    );
  }

  // 2. Password
  if (field.type === "password") {
    return (
      <div className="flex items-center justify-between px-3.5 py-2.5 border text-xs shadow-2xs" style={inputStyle}>
        <span style={{ opacity: 0.7 }}>••••••••••••</span>
        <KeyRound className="w-3.5 h-3.5 opacity-50" />
      </div>
    );
  }

  // 3. Long text
  if (field.type === "long_text") {
    return (
      <div className="px-3.5 py-3 border text-xs shadow-2xs" style={textareaStyle || inputStyle}>
        <span style={{ opacity: 0.7 }}>{field.placeholder || "Type your detailed answer here..."}</span>
      </div>
    );
  }

  // 4. Single choice (Radio Group)
  if (field.type === "single_choice") {
    return (
      <div className="space-y-2">
        {(field.options && field.options.length > 0
          ? field.options
          : ["Option 1", "Option 2", "Option 3"]
        ).map((opt, oIdx) => (
          <div
            key={oIdx}
            className="flex items-center gap-2.5 px-3 py-2 text-xs shadow-2xs border cursor-default"
            style={inputStyle}
          >
            <div
              className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
              style={radioStyle}
            >
              {oIdx === 0 && (
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              )}
            </div>
            <span>{opt}</span>
          </div>
        ))}
      </div>
    );
  }

  // 5. Multiple choice
  if (field.type === "multiple_choice") {
    return (
      <div className="space-y-2">
        {(field.options && field.options.length > 0
          ? field.options
          : ["Option 1", "Option 2", "Option 3"]
        ).map((opt, oIdx) => (
          <div
            key={oIdx}
            className="flex items-center gap-2.5 px-3 py-2 text-xs shadow-2xs border cursor-default"
            style={inputStyle}
          >
            <div
              className="w-4 h-4 border flex items-center justify-center shrink-0"
              style={checkboxStyle}
            >
              {oIdx === 0 && <Check className="w-3 h-3 stroke-[3]" style={{ color: accentColor }} />}
            </div>
            <span>{opt}</span>
          </div>
        ))}
      </div>
    );
  }

  // 6. Dropdown
  if (field.type === "dropdown" || field.type === "country") {
    return (
      <div className="flex items-center justify-between px-3.5 py-2.5 border text-xs shadow-2xs" style={inputStyle}>
        <span style={{ opacity: 0.8 }}>
          {field.placeholder ||
            (field.type === "country"
              ? "Select a country..."
              : (field.options && field.options[0]) || "Select an option")}
        </span>
        <ChevronDownSquare className="w-3.5 h-3.5 opacity-60" />
      </div>
    );
  }

  // 7. Yes / No
  if (field.type === "yes_no") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 py-2 px-4 border text-center text-xs font-semibold shadow-2xs flex items-center justify-center" style={inputStyle}>
          Yes
        </div>
        <div className="flex-1 py-2 px-4 border text-center text-xs font-semibold shadow-2xs flex items-center justify-center" style={inputStyle}>
          No
        </div>
      </div>
    );
  }

  // 8. Multiple Choice Grid / Checkbox Grid
  if (field.type === "multiple_choice_grid" || field.type === "checkbox_grid") {
    const rows = field.rows || ["Row 1", "Row 2"];
    const cols = field.columns || ["Col 1", "Col 2", "Col 3"];
    return (
      <div className="overflow-x-auto border p-3" style={inputStyle}>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-black/10">
              <th className="p-2 font-medium opacity-70"></th>
              {cols.map((col, cIdx) => (
                <th key={cIdx} className="p-2 text-center font-medium opacity-70">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-black/5 last:border-none">
                <td className="p-2 font-medium">{row}</td>
                {cols.map((_, cIdx) => (
                  <td key={cIdx} className="p-2 text-center">
                    <div className="w-4 h-4 mx-auto rounded-full border border-black/20 bg-white/50" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 9. Star Rating
  if (field.type === "rating") {
    const starSize = ratingSize;
    const activeColor = ratingActiveColor;
    const inactiveColor = ratingInactiveColor;
    return (
      <div className="flex items-center gap-1.5 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="p-2 border border-black/5 flex items-center justify-center shadow-2xs"
            style={{
              borderRadius: inputStyle?.borderRadius || "0.75rem",
              background: inputStyle?.background || "#FFFFFF",
            }}
          >
            <Star
              style={{
                width: `${starSize}px`,
                height: `${starSize}px`,
                color: star <= 4 ? activeColor : inactiveColor,
                fill: star <= 4 ? activeColor : "transparent",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // 10. Linear Scale / Slider
  if (field.type === "linear_scale") {
    return (
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div
              key={num}
              className="flex-1 min-w-[28px] h-8 border text-xs font-semibold flex items-center justify-center shadow-2xs"
              style={inputStyle}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] opacity-70">
          <span>{field.minLabel || "1 = Poor"}</span>
          <span>{field.maxLabel || "10 = Excellent"}</span>
        </div>
      </div>
    );
  }

  // 11. NPS
  if (field.type === "nps") {
    return (
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-11 gap-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div
              key={num}
              className="h-8 border text-xs font-semibold flex items-center justify-center shadow-2xs"
              style={inputStyle}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] opacity-70">
          <span>0 (Not likely)</span>
          <span>10 (Extremely likely)</span>
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
            ? Music
            : Upload;
    return (
      <div
        className="p-5 text-center flex flex-col items-center justify-center space-y-1.5 border-2 border-dashed"
        style={dropzoneStyle || inputStyle}
      >
        <div
          className="w-8 h-8 rounded-xl bg-white/80 border border-black/10 flex items-center justify-center"
          style={{ color: accentColor }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-xs font-semibold">
          Click to upload or drag & drop
        </div>
        <div className="text-[10px] opacity-60">
          {field.type === "image_upload"
            ? "PNG, JPG, SVG, WebP up to 10MB"
            : field.type === "video_upload"
              ? "MP4, WebM up to 50MB"
              : field.type === "audio_upload"
                ? "MP3, WAV up to 25MB"
                : "PDF, DOCX, XLSX, ZIP up to 25MB"}
        </div>
      </div>
    );
  }

  // 13. Camera Capture
  if (field.type === "camera_capture") {
    return (
      <div className="p-4 text-center flex items-center justify-center gap-2 text-xs font-semibold border shadow-2xs" style={inputStyle}>
        <Camera className="w-4 h-4" style={{ color: accentColor }} />
        <span>Open Device Camera to Snap Photo</span>
      </div>
    );
  }

  // 14. Voice Recording
  if (field.type === "voice_recording") {
    return (
      <div className="p-4 flex items-center justify-between border shadow-2xs" style={inputStyle}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center" style={{ color: accentColor }}>
            <Mic className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium">
            00:00 / 02:00 max
          </span>
        </div>
        <div className="px-3 py-1 rounded-xl text-white text-[11px] font-semibold" style={{ backgroundColor: accentColor }}>
          Record
        </div>
      </div>
    );
  }

  // 15. Signature Pad
  if (field.type === "signature") {
    return (
      <div className="p-4 h-24 flex flex-col justify-between border shadow-2xs" style={inputStyle}>
        <div className="flex items-center justify-between text-[11px] opacity-70">
          <span className="flex items-center gap-1">
            <PenTool className="w-3 h-3" style={{ color: accentColor }} /> Sign above the line
          </span>
          <span className="hover:underline cursor-pointer">Clear</span>
        </div>
        <div className="border-b-2 border-dashed border-black/20" />
      </div>
    );
  }

  // 16. Date Range & Duration
  if (field.type === "date_range") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 px-3 py-2 border text-xs flex items-center justify-between" style={inputStyle}>
          <span style={{ opacity: 0.7 }}>Start Date</span>
          <CalendarRange className="w-3.5 h-3.5 opacity-50" />
        </div>
        <span className="text-xs opacity-60">to</span>
        <div className="flex-1 px-3 py-2 border text-xs flex items-center justify-between" style={inputStyle}>
          <span style={{ opacity: 0.7 }}>End Date</span>
          <CalendarRange className="w-3.5 h-3.5 opacity-50" />
        </div>
      </div>
    );
  }

  if (field.type === "duration") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 px-3 py-2 border text-xs flex items-center justify-between" style={inputStyle}>
          <span>00 hrs</span>
          <Hourglass className="w-3.5 h-3.5 opacity-50" />
        </div>
        <div className="flex-1 px-3 py-2 border text-xs flex items-center justify-between" style={inputStyle}>
          <span>00 mins</span>
        </div>
      </div>
    );
  }

  // 17. Full Address Block
  if (field.type === "address") {
    return (
      <div className="space-y-2 border p-3.5 shadow-2xs" style={inputStyle}>
        <div className="px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-xs opacity-70">
          Street Address Line 1
        </div>
        <div className="px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-xs opacity-70">
          Apartment, suite, unit (optional)
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-xs opacity-70">
            City
          </div>
          <div className="px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-xs opacity-70">
            State / Province
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-xs opacity-70">
            Postal / ZIP Code
          </div>
          <div className="px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-xs opacity-70">
            Country
          </div>
        </div>
      </div>
    );
  }

  // 18. City, State, Postal Code, GPS Location
  if (field.type === "city" || field.type === "state" || field.type === "postal_code") {
    return (
      <div className="px-3.5 py-2.5 border text-xs shadow-2xs" style={inputStyle}>
        <span style={{ opacity: 0.7 }}>{field.placeholder || `Enter ${field.label.toLowerCase()}...`}</span>
      </div>
    );
  }

  if (field.type === "gps_location") {
    return (
      <div className="p-3 flex items-center justify-between border shadow-2xs" style={inputStyle}>
        <div className="flex items-center gap-2 text-xs">
          <Navigation className="w-4 h-4" style={{ color: accentColor }} />
          <span>37.7749° N, 122.4194° W</span>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg" style={{ color: accentColor, backgroundColor: `${accentColor}18` }}>
          Pin Location
        </span>
      </div>
    );
  }

  // 19. Currency, Percentage, Quantity
  if (field.type === "currency") {
    return (
      <div className="flex items-center border overflow-hidden shadow-2xs" style={inputStyle}>
        <span className="px-3 py-2.5 bg-black/5 border-r border-black/10 text-xs font-bold">
          {field.currencySymbol || "$"}
        </span>
        <div className="px-3 py-2 text-xs opacity-70 flex-1">0.00</div>
      </div>
    );
  }

  if (field.type === "percentage") {
    return (
      <div className="flex items-center border overflow-hidden shadow-2xs" style={inputStyle}>
        <div className="px-3 py-2 text-xs opacity-70 flex-1">0</div>
        <span className="px-3 py-2.5 bg-black/5 border-l border-black/10 text-xs font-bold">
          %
        </span>
      </div>
    );
  }

  if (field.type === "quantity") {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled
          className="w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold"
          style={inputStyle}
        >
          -
        </button>
        <span className="text-sm font-semibold">1</span>
        <button
          type="button"
          disabled
          className="w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold"
          style={inputStyle}
        >
          +
        </button>
      </div>
    );
  }

  // 20. Color Picker
  if (field.type === "color_picker") {
    return (
      <div className="flex items-center gap-3 p-2 border shadow-2xs" style={inputStyle}>
        <div className="w-7 h-7 rounded-lg border border-black/10 shadow-2xs" style={{ backgroundColor: accentColor }} />
        <span className="text-xs font-mono font-semibold">
          {accentColor}
        </span>
      </div>
    );
  }

  // 21. Hidden & System Metadata Fields
  if (
    field.type === "hidden_input" ||
    field.type === "auto_id" ||
    field.type === "utm_source" ||
    field.type === "utm_medium" ||
    field.type === "utm_campaign" ||
    field.type === "referrer" ||
    field.type === "timestamp" ||
    field.type === "user_id"
  ) {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 border border-dashed border-black/10 text-xs opacity-70">
        <div className="flex items-center gap-2">
          <EyeOff className="w-3.5 h-3.5 opacity-60" />
          <span className="font-mono text-[11px]">
            {field.defaultValue ||
              (field.type === "auto_id"
                ? "auto_generated_uuid"
                : field.type === "timestamp"
                  ? "ISO_TIMESTAMP"
                  : `[${field.type}]`)}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider">
          Hidden from user
        </span>
      </div>
    );
  }

  return (
    <div className="px-3.5 py-2.5 border text-xs" style={inputStyle}>
      <span style={{ opacity: 0.7 }}>Enter response...</span>
    </div>
  );
}
