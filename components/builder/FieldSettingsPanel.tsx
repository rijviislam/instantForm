"use client";

import React, { useState } from "react";
import {
  Sliders,
  Settings,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Star,
  Layers,
  HelpCircle,
} from "lucide-react";
import { FormField, FormStyle } from "@/lib/api-client";

interface FieldSettingsPanelProps {
  selectedField: FormField | null;
  formTitle: string;
  formDescription: string | null;
  formStyle: FormStyle;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onUpdateForm: (updates: {
    title?: string;
    description?: string | null;
    style?: FormStyle;
  }) => void;
}

const FORM_STYLES: Array<{
  id: FormStyle;
  title: string;
  description: string;
}> = [
  {
    id: "classic",
    title: "Classic",
    description: "Familiar multi-field clean card layout",
  },
  {
    id: "conversation",
    title: "Conversation",
    description: "One question at a time with smooth step progression",
  },
  {
    id: "chat",
    title: "Chat",
    description: "Messaging-like conversational bubble respondent experience",
  },
  {
    id: "editorial",
    title: "Editorial",
    description: "Typography-led refined editorial layout",
  },
  {
    id: "minimal",
    title: "Minimal",
    description: "Distraction-free, single column layout",
  },
];

export function FieldSettingsPanel({
  selectedField,
  formTitle,
  formDescription,
  formStyle,
  onUpdateField,
  onUpdateForm,
}: FieldSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"field" | "form">(
    selectedField ? "field" : "form"
  );

  // Switch to field tab when a field is selected
  React.useEffect(() => {
    if (selectedField) {
      setActiveTab("field");
    }
  }, [selectedField?.id]);

  const handleAddOption = () => {
    if (!selectedField) return;
    const currentOptions = selectedField.options || [];
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    onUpdateField(selectedField.id, { options: newOptions });
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

  return (
    <aside className="w-full lg:w-80 border-l border-[#E7E2D8] dark:border-[#2E2824] bg-white dark:bg-[#1C1917] flex flex-col h-full overflow-y-auto select-none">
      {/* Header Tabs */}
      <div className="p-3 border-b border-[#F5F2EB] dark:border-[#2E2824] flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("field")}
          disabled={!selectedField}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "field"
              ? "bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917] shadow-2xs"
              : "text-[#78716C] dark:text-[#A8A29E] hover:bg-[#FAF8F5] dark:hover:bg-[#24201D] disabled:opacity-40"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Question</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "form"
              ? "bg-[#1C1917] text-white dark:bg-white dark:text-[#1C1917] shadow-2xs"
              : "text-[#78716C] dark:text-[#A8A29E] hover:bg-[#FAF8F5] dark:hover:bg-[#24201D]"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Form Settings</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        {activeTab === "field" && selectedField ? (
          /* Question Settings */
          <div className="space-y-4">
            {/* Field Type Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F5F2EB] dark:border-[#2E2824]">
              <span className="text-[11px] font-semibold text-[#A8A29E] dark:text-[#78716C] uppercase tracking-wider">
                Type
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F2EB] dark:bg-[#24201D] text-[#1C1917] dark:text-[#FBF9F5] border border-[#E7E2D8] dark:border-[#2E2824]">
                {selectedField.type.replace("_", " ")}
              </span>
            </div>

            {/* Label */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                Question Label
              </label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) =>
                  onUpdateField(selectedField.id, { label: e.target.value })
                }
                placeholder="Enter question text..."
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] rounded-xl text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                Help Description (Optional)
              </label>
              <textarea
                value={selectedField.description || ""}
                onChange={(e) =>
                  onUpdateField(selectedField.id, {
                    description: e.target.value || undefined,
                  })
                }
                placeholder="Add supporting guidance for respondents..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] rounded-xl text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all resize-none"
              />
            </div>

            {/* Placeholder (for text/input fields) */}
            {(selectedField.type === "short_text" ||
              selectedField.type === "long_text" ||
              selectedField.type === "email" ||
              selectedField.type === "phone" ||
              selectedField.type === "url" ||
              selectedField.type === "number" ||
              selectedField.type === "dropdown") && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={selectedField.placeholder || ""}
                  onChange={(e) =>
                    onUpdateField(selectedField.id, {
                      placeholder: e.target.value || undefined,
                    })
                  }
                  placeholder="e.g. Type your answer..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] rounded-xl text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
              </div>
            )}

            {/* Required Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824]">
              <div>
                <div className="text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                  Required
                </div>
                <div className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">
                  Respondent must answer this question
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={selectedField.required}
                onClick={() =>
                  onUpdateField(selectedField.id, {
                    required: !selectedField.required,
                  })
                }
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  selectedField.required
                    ? "bg-[#FF5A36]"
                    : "bg-[#D6D3D1] dark:bg-[#57534E]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    selectedField.required ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Options Editor (Single choice, Multiple choice, Dropdown) */}
            {(selectedField.type === "single_choice" ||
              selectedField.type === "multiple_choice" ||
              selectedField.type === "dropdown") && (
              <div className="space-y-2.5 pt-2 border-t border-[#F5F2EB] dark:border-[#2E2824]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                    Choice Options
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF5A36] hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Option</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(selectedField.options || []).map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateOption(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] rounded-xl text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteOption(idx)}
                        disabled={(selectedField.options || []).length <= 1}
                        aria-label="Delete option"
                        className="p-1.5 text-[#A8A29E] hover:text-red-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Form Settings Tab */
          <div className="space-y-5">
            {/* Form Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                Form Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => onUpdateForm({ title: e.target.value })}
                placeholder="e.g. Customer Feedback Survey"
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] rounded-xl text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
              />
            </div>

            {/* Form Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                Form Description
              </label>
              <textarea
                value={formDescription || ""}
                onChange={(e) =>
                  onUpdateForm({ description: e.target.value || null })
                }
                placeholder="Give your respondents context on what this form is for..."
                rows={3}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] rounded-xl text-[#1C1917] dark:text-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all resize-none"
              />
            </div>

            {/* Form Style Selector */}
            <div className="space-y-2.5 pt-2 border-t border-[#F5F2EB] dark:border-[#2E2824]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>Form Visual Style</span>
              </div>

              <div className="space-y-2">
                {FORM_STYLES.map((styleOption) => {
                  const isSelected =
                    formStyle.toLowerCase() === styleOption.id.toLowerCase();
                  return (
                    <div
                      key={styleOption.id}
                      onClick={() => onUpdateForm({ style: styleOption.id })}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FFF0EB]/50 dark:bg-[#2A1B17]/40 border-[#FF5A36] ring-1 ring-[#FF5A36]"
                          : "bg-[#FAF8F5] dark:bg-[#24201D] border-[#E7E2D8] dark:border-[#2E2824] hover:border-[#D6D3D1]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1C1917] dark:text-[#FBF9F5]">
                          {styleOption.title}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#FF5A36] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5 leading-relaxed">
                        {styleOption.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
