"use client";

import React, { useState } from "react";
import {
  Sliders,
  Settings,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Palette,
  FileText,
  Code2,
  BoxSelect,
  Link2,
} from "lucide-react";
import { FormField, FormStyle } from "@/lib/api-client";
import { FormTheme, resolveFormTheme, INPUT_STYLE_PRESETS, FIELD_CARD_STYLE_PRESETS } from "@/lib/form-theme";
import { FormStyleCustomizer } from "./FormStyleCustomizer";

interface FieldSettingsPanelProps {
  selectedField: FormField | null;
  formTitle: string;
  formDescription: string | null;
  formSlug?: string;
  formStyle: FormStyle;
  formTheme?: FormTheme;
  activeTab?: "field" | "form" | "style";
  selectedElement?: "form" | "container" | "button" | "style" | null;
  onTabChange?: (tab: "field" | "form" | "style") => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onUpdateForm: (updates: {
    title?: string;
    description?: string | null;
    slug?: string;
    style?: FormStyle;
    theme?: FormTheme;
  }) => void;
  onUpdateTheme?: (theme: FormTheme) => void;
}

export function FieldSettingsPanel({
  selectedField,
  formTitle,
  formDescription,
  formSlug,
  formStyle,
  formTheme,
  activeTab: externalActiveTab,
  selectedElement,
  onTabChange,
  onUpdateField,
  onUpdateForm,
  onUpdateTheme,
}: FieldSettingsPanelProps) {
  const [internalTab, setInternalTab] = useState<"field" | "form" | "style">(
    selectedField ? "field" : "style"
  );

  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalTab;
  const setActiveTab = (tab: "field" | "form" | "style") => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const handleAddOption = () => {
    if (!selectedField) return;
    const currentOptions = selectedField.options || ["Option 1", "Option 2"];
    const nextIdx = currentOptions.length + 1;
    onUpdateField(selectedField.id, {
      options: [...currentOptions, `Option ${nextIdx}`],
    });
  };

  const handleUpdateOption = (index: number, value: string) => {
    if (!selectedField || !selectedField.options) return;
    const updated = [...selectedField.options];
    updated[index] = value;
    onUpdateField(selectedField.id, { options: updated });
  };

  const handleDeleteOption = (index: number) => {
    if (!selectedField || !selectedField.options) return;
    const updated = selectedField.options.filter((_, i) => i !== index);
    onUpdateField(selectedField.id, { options: updated });
  };

  // Rows and columns handlers for Matrix / Grids
  const handleAddRow = () => {
    if (!selectedField) return;
    const currentRows = selectedField.rows || ["Row 1"];
    onUpdateField(selectedField.id, {
      rows: [...currentRows, `Row ${currentRows.length + 1}`],
    });
  };

  const handleUpdateRow = (index: number, value: string) => {
    if (!selectedField || !selectedField.rows) return;
    const updated = [...selectedField.rows];
    updated[index] = value;
    onUpdateField(selectedField.id, { rows: updated });
  };

  const handleDeleteRow = (index: number) => {
    if (!selectedField || !selectedField.rows) return;
    onUpdateField(selectedField.id, {
      rows: selectedField.rows.filter((_, i) => i !== index),
    });
  };

  const handleAddColumn = () => {
    if (!selectedField) return;
    const currentCols = selectedField.columns || ["Col 1"];
    onUpdateField(selectedField.id, {
      columns: [...currentCols, `Column ${currentCols.length + 1}`],
    });
  };

  const handleUpdateColumn = (index: number, value: string) => {
    if (!selectedField || !selectedField.columns) return;
    const updated = [...selectedField.columns];
    updated[index] = value;
    onUpdateField(selectedField.id, { columns: updated });
  };

  const handleDeleteColumn = (index: number) => {
    if (!selectedField || !selectedField.columns) return;
    onUpdateField(selectedField.id, {
      columns: selectedField.columns.filter((_, i) => i !== index),
    });
  };

  return (
    <aside
      className="w-full lg:w-80 border-l border-[#EAE3D6] dark:border-[#1F2937] bg-white dark:bg-[#111827] flex flex-col h-full min-h-0 overflow-hidden select-none"
      data-lenis-prevent="true"
    >
      {/* Header Tabs */}
      <div className="p-2.5 border-b border-[#F5F2EB] dark:border-[#1F2937] flex items-center gap-1 shrink-0 bg-[#FAF8F5] dark:bg-[#161F30]">
        <button
          type="button"
          onClick={() => setActiveTab("field")}
          disabled={!selectedField}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "field"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-[#78716C] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B] disabled:opacity-40"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Field</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("style")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "style"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-[#78716C] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B]"
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-[#FF5A36]" />
          <span>Visual Style</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "form"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-[#78716C] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E293B]"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Tab Content */}
      <div
        className="p-4 space-y-5 flex-1 min-h-0 overflow-y-auto overscroll-contain"
        data-lenis-prevent="true"
      >
        {activeTab === "style" ? (
          /* Form Visual Style Customizer */
          <FormStyleCustomizer
            theme={formTheme}
            onChange={(updatedTheme) => {
              if (onUpdateTheme) {
                onUpdateTheme(updatedTheme);
              } else {
                onUpdateForm({ theme: updatedTheme });
              }
            }}
          />
        ) : activeTab === "field" && selectedField ? (
          /* Question / Field Settings */
          <div className="space-y-4">
            {/* Field Type Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F5F2EB] dark:border-[#1F2937]">
              <span className="text-[11px] font-semibold text-[#A8A29E] dark:text-[#64748B] uppercase tracking-wider">
                Field Type
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF0EB] dark:bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FFD8CC] dark:border-[#FF5A36]/20">
                {selectedField.type.replace(/_/g, " ")}
              </span>
            </div>

            {/* Label */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                Question Label
              </label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) =>
                  onUpdateField(selectedField.id, { label: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
              />
            </div>

            {/* Description / Subtitle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                Help Text / Description
              </label>
              <textarea
                value={selectedField.description || ""}
                onChange={(e) =>
                  onUpdateField(selectedField.id, {
                    description: e.target.value || undefined,
                  })
                }
                placeholder="Optional hint for respondents..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] placeholder-[#A8A29E] dark:placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all resize-none"
              />
            </div>

            {/* ------------------------------------------------------------- */}
            {/* CUSTOM INPUT FIELD CONFIGURATION                              */}
            {/* ------------------------------------------------------------- */}
            {selectedField.type === "custom_input" && (
              <div className="space-y-3 pt-3 border-t border-[#F5F2EB] dark:border-[#1F2937]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5A36]">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Custom Field Properties</span>
                </div>

                {/* Custom Input Type */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                    HTML Input Type
                  </label>
                  <select
                    value={selectedField.customInputType || "text"}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        customInputType: e.target.value as any,
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC]"
                  >
                    <option value="text">Text (Single-line)</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="password">Password (Masked)</option>
                    <option value="tel">Telephone</option>
                    <option value="url">Website URL</option>
                    <option value="color">Color Picker</option>
                    <option value="range">Range Slider</option>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                  </select>
                </div>

                {/* Field Identifier Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                    Field Key / Name (API Submission Key)
                  </label>
                  <input
                    type="text"
                    value={selectedField.customFieldName || ""}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        customFieldName: e.target.value,
                      })
                    }
                    placeholder="e.g. user_membership_tier"
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC]"
                  />
                </div>

                {/* Regex Validation Pattern */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                    Regex Pattern Validation (Optional)
                  </label>
                  <input
                    type="text"
                    value={selectedField.customPattern || ""}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        customPattern: e.target.value,
                      })
                    }
                    placeholder="e.g. ^[A-Z]{3}-[0-9]{4}$"
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC]"
                  />
                </div>

                {/* Custom Error Message */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                    Validation Error Message
                  </label>
                  <input
                    type="text"
                    value={selectedField.customErrorMessage || ""}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        customErrorMessage: e.target.value,
                      })
                    }
                    placeholder="e.g. Format must match XXX-0000"
                    className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC]"
                  />
                </div>

                {/* Custom CSS Class */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                    Custom CSS Class
                  </label>
                  <input
                    type="text"
                    value={selectedField.customClass || ""}
                    onChange={(e) =>
                      onUpdateField(selectedField.id, {
                        customClass: e.target.value,
                      })
                    }
                    placeholder="e.g. shadow-sm border-indigo-400"
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC]"
                  />
                </div>
              </div>
            )}

            {/* Placeholder (for text-based inputs) */}
            {(selectedField.type === "short_text" ||
              selectedField.type === "long_text" ||
              selectedField.type === "email" ||
              selectedField.type === "phone" ||
              selectedField.type === "url" ||
              selectedField.type === "number" ||
              selectedField.type === "password" ||
              selectedField.type === "custom_input") && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={selectedField.placeholder || ""}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, {
                      placeholder: e.target.value,
                    })
                  }
                  placeholder="e.g. Type your answer here..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] placeholder-[#A8A29E] dark:placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
              </div>
            )}

            {/* Currency Symbol */}
            {selectedField.type === "currency" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={selectedField.currencySymbol || "$"}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, {
                      currencySymbol: e.target.value,
                    })
                  }
                  placeholder="$"
                  maxLength={4}
                  className="w-24 px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
                />
              </div>
            )}

            {/* Linear Scale Min/Max Labels */}
            {selectedField.type === "linear_scale" && (
              <div className="space-y-3 pt-2 border-t border-[#F5F2EB] dark:border-[#1F2937]">
                <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                  Scale Endpoints & Labels
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8]">Min Label (1)</span>
                    <input
                      type="text"
                      value={selectedField.minLabel || "Poor"}
                      onChange={(e) =>
                        onUpdateField(selectedField.id, { minLabel: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78716C] dark:text-[#94A3B8]">Max Label (10)</span>
                    <input
                      type="text"
                      value={selectedField.maxLabel || "Excellent"}
                      onChange={(e) =>
                        onUpdateField(selectedField.id, { maxLabel: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Options Management (Radio / Checkbox / Dropdown) */}
            {(selectedField.type === "single_choice" ||
              selectedField.type === "multiple_choice" ||
              selectedField.type === "dropdown") && (
              <div className="space-y-2 pt-2 border-t border-[#F5F2EB] dark:border-[#1F2937]">
                <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                  Choices / Options
                </label>
                <div className="space-y-1.5">
                  {(selectedField.options || []).map((opt, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateOption(i, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
                      />
                      {(selectedField.options || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(i)}
                          className="p-1.5 text-[#A8A29E] dark:text-[#64748B] hover:text-[#EF4444] rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddOption}
                  className="mt-2 w-full py-2 border border-dashed border-[#EAE3D6] dark:border-[#293548] hover:border-[#FF5A36] dark:hover:border-[#FF5A36] text-[#FF5A36] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FFF0EB]/30 dark:hover:bg-[#FF5A36]/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Option</span>
                </button>
              </div>
            )}

            {/* Matrix / Grid Configurator */}
            {(selectedField.type === "multiple_choice_grid" ||
              selectedField.type === "checkbox_grid") && (
              <div className="space-y-4 pt-2 border-t border-[#F5F2EB] dark:border-[#1F2937]">
                {/* Rows */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                      Matrix Rows
                    </span>
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="text-[11px] text-[#FF5A36] font-semibold hover:underline"
                    >
                      + Add Row
                    </button>
                  </div>
                  {(selectedField.rows || []).map((row, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={row}
                        onChange={(e) => handleUpdateRow(i, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC]"
                      />
                      {(selectedField.rows || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(i)}
                          className="p-1 text-[#A8A29E] dark:text-[#64748B] hover:text-[#EF4444]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Columns */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                      Matrix Columns
                    </span>
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      className="text-[11px] text-[#FF5A36] font-semibold hover:underline"
                    >
                      + Add Column
                    </button>
                  </div>
                  {(selectedField.columns || []).map((col, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={col}
                        onChange={(e) => handleUpdateColumn(i, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC]"
                      />
                      {(selectedField.columns || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(i)}
                          className="p-1 text-[#A8A29E] dark:text-[#64748B] hover:text-[#EF4444]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Input / Default System Value */}
            {(selectedField.type === "hidden_input" ||
              selectedField.type === "auto_id" ||
              selectedField.type === "utm_source" ||
              selectedField.type === "utm_medium" ||
              selectedField.type === "utm_campaign" ||
              selectedField.type === "referrer" ||
              selectedField.type === "timestamp" ||
              selectedField.type === "user_id") && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                  Default / Parameter Name
                </label>
                <input
                  type="text"
                  value={selectedField.defaultValue || ""}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, {
                      defaultValue: e.target.value,
                    })
                  }
                  placeholder={`e.g. ${selectedField.type}`}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
                />
              </div>
            )}

            {/* Required Toggle (for non-system/layout fields) */}
            {selectedField.type !== "divider" &&
              selectedField.type !== "section_heading" &&
              selectedField.type !== "hidden_input" && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548]">
                  <div>
                    <div className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                      Required
                    </div>
                    <div className="text-[10px] text-[#78716C] dark:text-[#94A3B8]">
                      Respondent must answer this question
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateField(selectedField.id, {
                        required: !selectedField.required,
                      })
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      selectedField.required ? "bg-[#FF5A36]" : "bg-[#EAE3D6] dark:bg-[#293548]"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedField.required
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              )}

            {/* Global vs Custom Field Input Styling */}
            {selectedField.type !== "divider" &&
              selectedField.type !== "section_heading" &&
              selectedField.type !== "hidden_input" && (
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-[#1C1917] dark:text-[#F8FAFC]">
                      <Palette className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>Input Style Preference</span>
                    </div>
                  </div>

                  {/* Segmented Switcher */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F5] dark:bg-[#111827] rounded-lg border border-[#EAE3D6] dark:border-[#293548] text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdateField(selectedField.id, { useGlobalStyle: true })}
                      className={`py-1 text-center font-semibold rounded-md transition-colors cursor-pointer ${
                        selectedField.useGlobalStyle !== false
                          ? "bg-[#FF5A36] text-white shadow-xs"
                          : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                      }`}
                    >
                      Use Global
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateField(selectedField.id, { useGlobalStyle: false })}
                      className={`py-1 text-center font-semibold rounded-md transition-colors cursor-pointer ${
                        selectedField.useGlobalStyle === false
                          ? "bg-[#FF5A36] text-white shadow-xs"
                          : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                      }`}
                    >
                      Customize Field
                    </button>
                  </div>

                  {selectedField.useGlobalStyle === false && (
                    <div className="space-y-2.5 pt-1">
                      {/* Preset Selector */}
                      <div>
                        <label className="block text-[10px] text-[#78716C] dark:text-[#94A3B8] mb-1 font-semibold">
                          Appearance Preset
                        </label>
                        <select
                          value={selectedField.customStyle?.preset || "custom"}
                          onChange={(e) => {
                            const preset = INPUT_STYLE_PRESETS.find((p) => p.id === e.target.value);
                            onUpdateField(selectedField.id, {
                              customStyle: {
                                ...(selectedField.customStyle || {}),
                                ...(preset ? preset.inputs : {}),
                                preset: e.target.value as any,
                              },
                            });
                          }}
                          className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] dark:border-[#293548] bg-white dark:bg-[#111827] text-[#1C1917] dark:text-[#F8FAFC]"
                        >
                          {INPUT_STYLE_PRESETS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                          <option value="custom">Custom Configuration</option>
                        </select>
                      </div>

                      {/* Background Color */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Background</span>
                        <input
                          type="color"
                          value={selectedField.customStyle?.backgroundColor || "#FAF8F5"}
                          onChange={(e) =>
                            onUpdateField(selectedField.id, {
                              customStyle: {
                                ...(selectedField.customStyle || {}),
                                backgroundColor: e.target.value,
                              },
                            })
                          }
                          className="w-6 h-6 rounded border border-black/10 dark:border-white/10 cursor-pointer"
                        />
                      </div>

                      {/* Border Color */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Border Color</span>
                        <input
                          type="color"
                          value={selectedField.customStyle?.borderColor || "#EAE3D6"}
                          onChange={(e) =>
                            onUpdateField(selectedField.id, {
                              customStyle: {
                                ...(selectedField.customStyle || {}),
                                borderColor: e.target.value,
                              },
                            })
                          }
                          className="w-6 h-6 rounded border border-black/10 dark:border-white/10 cursor-pointer"
                        />
                      </div>

                      {/* Text Color */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Text Color</span>
                        <input
                          type="color"
                          value={selectedField.customStyle?.textColor || "#1C1917"}
                          onChange={(e) =>
                            onUpdateField(selectedField.id, {
                              customStyle: {
                                ...(selectedField.customStyle || {}),
                                textColor: e.target.value,
                              },
                            })
                          }
                          className="w-6 h-6 rounded border border-black/10 dark:border-white/10 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Global vs Custom Field Card Surface Styling */}
            {selectedField.type !== "divider" &&
              selectedField.type !== "section_heading" &&
              selectedField.type !== "hidden_input" && (
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-[#1C1917] dark:text-[#F8FAFC]">
                      <BoxSelect className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>Card Container Style</span>
                    </div>
                  </div>

                  {/* Segmented Switcher */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F5] dark:bg-[#111827] rounded-lg border border-[#EAE3D6] dark:border-[#293548] text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdateField(selectedField.id, { useGlobalFieldCardStyle: true })}
                      className={`py-1 text-center font-semibold rounded-md transition-colors cursor-pointer ${
                        selectedField.useGlobalFieldCardStyle !== false
                          ? "bg-[#FF5A36] text-white shadow-xs"
                          : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                      }`}
                    >
                      Use Global
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateField(selectedField.id, { useGlobalFieldCardStyle: false })}
                      className={`py-1 text-center font-semibold rounded-md transition-colors cursor-pointer ${
                        selectedField.useGlobalFieldCardStyle === false
                          ? "bg-[#FF5A36] text-white shadow-xs"
                          : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                      }`}
                    >
                      Customize Card
                    </button>
                  </div>

                  {selectedField.useGlobalFieldCardStyle === false && (
                    <div className="space-y-2.5 pt-1">
                      {/* Preset Selector */}
                      <div>
                        <label className="block text-[10px] text-[#78716C] dark:text-[#94A3B8] mb-1 font-semibold">
                          Card Preset
                        </label>
                        <select
                          value={selectedField.customFieldCardStyle?.preset || "custom"}
                          onChange={(e) => {
                            const preset = FIELD_CARD_STYLE_PRESETS.find((p) => p.id === e.target.value);
                            onUpdateField(selectedField.id, {
                              customFieldCardStyle: {
                                ...(selectedField.customFieldCardStyle || {}),
                                ...(preset ? preset.style : {}),
                                preset: e.target.value as any,
                              },
                            });
                          }}
                          className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] dark:border-[#293548] bg-white dark:bg-[#111827] text-[#1C1917] dark:text-[#F8FAFC]"
                        >
                          {FIELD_CARD_STYLE_PRESETS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                          <option value="custom">Custom Configuration</option>
                        </select>
                      </div>

                      {/* Card Background Color */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Card Background</span>
                        <input
                          type="color"
                          value={selectedField.customFieldCardStyle?.backgroundColor || "#FAF8F5"}
                          onChange={(e) =>
                            onUpdateField(selectedField.id, {
                              customFieldCardStyle: {
                                ...(selectedField.customFieldCardStyle || {}),
                                backgroundType: "solid",
                                glassEnabled: false,
                                backgroundColor: e.target.value,
                              },
                            })
                          }
                          className="w-6 h-6 rounded border border-black/10 dark:border-white/10 cursor-pointer"
                        />
                      </div>

                      {/* Card Border Color */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Card Border Color</span>
                        <input
                          type="color"
                          value={selectedField.customFieldCardStyle?.borderColor || "#EAE3D6"}
                          onChange={(e) =>
                            onUpdateField(selectedField.id, {
                              customFieldCardStyle: {
                                ...(selectedField.customFieldCardStyle || {}),
                                borderEnabled: true,
                                borderColor: e.target.value,
                              },
                            })
                          }
                          className="w-6 h-6 rounded border border-black/10 dark:border-white/10 cursor-pointer"
                        />
                      </div>

                      {/* Card Border Radius */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Border Radius</span>
                        <select
                          value={selectedField.customFieldCardStyle?.borderRadius || "2xl"}
                          onChange={(e) =>
                            onUpdateField(selectedField.id, {
                              customFieldCardStyle: {
                                ...(selectedField.customFieldCardStyle || {}),
                                borderRadius: e.target.value as any,
                              },
                            })
                          }
                          className="w-24 px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] dark:border-[#293548] bg-white dark:bg-[#111827] text-[#1C1917] dark:text-[#F8FAFC] capitalize"
                        >
                          <option value="none">None</option>
                          <option value="sm">Small</option>
                          <option value="md">Medium</option>
                          <option value="lg">Large</option>
                          <option value="xl">XL</option>
                          <option value="2xl">2XL</option>
                          <option value="3xl">3XL</option>
                          <option value="full">Pill</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        ) : (
          /* General Form Settings Tab */
          <div className="space-y-5">
            {/* Form Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                Form Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => onUpdateForm({ title: e.target.value })}
                placeholder="e.g. Customer Feedback Survey"
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
              />
            </div>

            {/* Form Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                Form Description
              </label>
              <textarea
                value={formDescription || ""}
                onChange={(e) =>
                  onUpdateForm({ description: e.target.value || null })
                }
                placeholder="Give your respondents context on what this form is for..."
                rows={3}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all resize-none"
              />
            </div>

            {/* Custom Short URL Slug */}
            <div className="space-y-1.5 pt-2 border-t border-[#F5F2EB] dark:border-[#1F2937]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC] flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Custom Short Link</span>
                </label>
                <span className="text-[10px] text-[#A8A29E] dark:text-[#64748B]">Public URL</span>
              </div>
              <div className="flex items-center bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl px-3 py-2 text-xs focus-within:ring-2 focus-within:ring-[#FF5A36]/20 focus-within:border-[#FF5A36] transition-all">
                <span className="text-[#A8A29E] dark:text-[#64748B] shrink-0 font-mono select-none">/f/</span>
                <input
                  type="text"
                  value={formSlug || ""}
                  onChange={(e) => {
                    const sanitized = e.target.value
                      .toLowerCase()
                      .replace(/[^\w-]/g, "")
                      .replace(/_+/g, "-");
                    onUpdateForm({ slug: sanitized });
                  }}
                  placeholder="job-application"
                  className="w-full bg-transparent text-[#1C1917] dark:text-[#F8FAFC] font-mono focus:outline-none ml-1"
                />
              </div>
              <p className="text-[10px] text-[#78716C] dark:text-[#94A3B8]">
                Your form's short shareable URL (e.g. <span className="font-mono text-[#FF5A36]">/f/{formSlug || "job-application"}</span>)
              </p>
            </div>

            {/* Form Style Preset Switcher */}
            <div className="space-y-2.5 pt-2 border-t border-[#F5F2EB] dark:border-[#1F2937]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Interactive Flow Style</span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: "classic",
                    title: "Classic All-in-One",
                    description: "Scrollable multi-question form layout",
                  },
                  {
                    id: "conversation",
                    title: "Conversational Step-by-Step",
                    description: "One question at a time with smooth transitions",
                  },
                  {
                    id: "editorial",
                    title: "Editorial Card",
                    description: "High readability typography layout",
                  },
                  {
                    id: "minimal",
                    title: "Minimalist Borderless",
                    description: "Clean distraction-free layout",
                  },
                ].map((styleOption) => {
                  const isSelected =
                    formStyle.toLowerCase() === styleOption.id.toLowerCase();
                  return (
                    <div
                      key={styleOption.id}
                      onClick={() => onUpdateForm({ style: styleOption.id as FormStyle })}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FFF0EB]/50 dark:bg-[#FF5A36]/15 border-[#FF5A36] ring-1 ring-[#FF5A36]"
                          : "bg-[#FAF8F5] dark:bg-[#161F30] border-[#EAE3D6] dark:border-[#293548] hover:border-[#D6D3D1] dark:hover:border-[#374151]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1C1917] dark:text-[#F8FAFC]">
                          {styleOption.title}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#FF5A36] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-[#78716C] dark:text-[#94A3B8] mt-0.5 leading-relaxed">
                        {styleOption.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Flow Style Badge Customizer */}
              {(() => {
                const currentTheme = resolveFormTheme(formTheme, formStyle);
                const badgeBg = currentTheme.branding.badgeBackgroundColor || currentTheme.colors.accent || "#FFF0EB";
                const badgeText = currentTheme.branding.badgeTextColor || currentTheme.colors.primary || "#FF5A36";
                const badgeBorder = currentTheme.branding.badgeBorderColor || (currentTheme.colors.primary ? `${currentTheme.colors.primary}40` : "#FFD8CC");
                const showBadge = currentTheme.branding.showStyleBadge !== false;

                const updateBadge = (updates: Partial<FormTheme["branding"]>) => {
                  const updated: FormTheme = {
                    ...currentTheme,
                    branding: {
                      ...currentTheme.branding,
                      ...updates,
                    },
                  };
                  if (onUpdateTheme) {
                    onUpdateTheme(updated);
                  } else {
                    onUpdateForm({ theme: updated });
                  }
                };

                return (
                  <div className="mt-3 p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C1917] dark:text-[#F8FAFC] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                        Flow Style Badge
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showBadge}
                          onChange={(e) => updateBadge({ showStyleBadge: e.target.checked })}
                          className="w-3.5 h-3.5 rounded text-[#FF5A36] focus:ring-[#FF5A36] cursor-pointer"
                        />
                        <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Visible</span>
                      </label>
                    </div>

                    {/* Live Badge Preview */}
                    {showBadge && (
                      <div className="p-2.5 rounded-lg bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#293548] flex flex-col items-center justify-center gap-1">
                        <span className="text-[10px] text-[#A8A29E] dark:text-[#64748B] font-medium">Badge Preview</span>
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs transition-all select-none"
                          style={{
                            backgroundColor: badgeBg,
                            color: badgeText,
                            borderColor: badgeBorder,
                          }}
                        >
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          {formStyle === "classic"
                            ? "Classic All-in-One"
                            : formStyle === "conversation"
                            ? "Conversational Step-by-Step"
                            : formStyle === "editorial"
                            ? "Editorial Card"
                            : formStyle === "minimal"
                            ? "Minimalist Borderless"
                            : `${formStyle} Style`}
                        </span>
                      </div>
                    )}

                    {showBadge && (
                      <div className="space-y-2 pt-1 border-t border-[#EAE3D6]/60 dark:border-[#293548]">
                        {/* Badge Background Color */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Background</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={badgeBg.startsWith("#") ? badgeBg : "#FFF0EB"}
                              onChange={(e) => updateBadge({ badgeBackgroundColor: e.target.value })}
                              className="w-6 h-6 rounded-md border border-[#EAE3D6] dark:border-[#293548] cursor-pointer p-0.5"
                            />
                            <input
                              type="text"
                              value={badgeBg}
                              onChange={(e) => updateBadge({ badgeBackgroundColor: e.target.value })}
                              className="w-20 px-2 py-1 text-[10px] font-mono rounded-lg border border-[#EAE3D6] dark:border-[#293548] bg-white dark:bg-[#111827] text-[#1C1917] dark:text-[#F8FAFC]"
                            />
                          </div>
                        </div>

                        {/* Badge Text Color */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Text & Icon</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={badgeText.startsWith("#") ? badgeText : "#FF5A36"}
                              onChange={(e) => updateBadge({ badgeTextColor: e.target.value })}
                              className="w-6 h-6 rounded-md border border-[#EAE3D6] dark:border-[#293548] cursor-pointer p-0.5"
                            />
                            <input
                              type="text"
                              value={badgeText}
                              onChange={(e) => updateBadge({ badgeTextColor: e.target.value })}
                              className="w-20 px-2 py-1 text-[10px] font-mono rounded-lg border border-[#EAE3D6] dark:border-[#293548] bg-white dark:bg-[#111827] text-[#1C1917] dark:text-[#F8FAFC]"
                            />
                          </div>
                        </div>

                        {/* Badge Border Color */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">Border</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={badgeBorder.startsWith("#") ? badgeBorder.slice(0, 7) : "#FFD8CC"}
                              onChange={(e) => updateBadge({ badgeBorderColor: e.target.value })}
                              className="w-6 h-6 rounded-md border border-[#EAE3D6] dark:border-[#293548] cursor-pointer p-0.5"
                            />
                            <input
                              type="text"
                              value={badgeBorder}
                              onChange={(e) => updateBadge({ badgeBorderColor: e.target.value })}
                              className="w-20 px-2 py-1 text-[10px] font-mono rounded-lg border border-[#EAE3D6] dark:border-[#293548] bg-white dark:bg-[#111827] text-[#1C1917] dark:text-[#F8FAFC]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
