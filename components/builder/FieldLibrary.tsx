"use client";

import React from "react";
import {
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  Link as LinkIcon,
  Calendar,
  Clock,
  CircleDot,
  CheckSquare,
  ChevronDownSquare,
  Star,
  ToggleLeft,
  Plus,
  Sparkles,
} from "lucide-react";
import { FormFieldType } from "@/lib/api-client";

export interface FieldDefinition {
  type: FormFieldType;
  label: string;
  defaultLabel: string;
  description: string;
  category: "Text" | "Choices" | "Numbers & Ratings" | "Advanced";
  icon: React.ComponentType<{ className?: string }>;
}

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  // Text
  {
    type: "short_text",
    label: "Short text",
    defaultLabel: "What is your answer?",
    description: "Single-line input for short answers",
    category: "Text",
    icon: Type,
  },
  {
    type: "long_text",
    label: "Long text",
    defaultLabel: "Please describe in detail",
    description: "Multi-line text area for feedback & notes",
    category: "Text",
    icon: AlignLeft,
  },
  {
    type: "email",
    label: "Email",
    defaultLabel: "What is your email address?",
    description: "Email input with format validation",
    category: "Text",
    icon: Mail,
  },
  {
    type: "phone",
    label: "Phone",
    defaultLabel: "What is your phone number?",
    description: "Phone number input",
    category: "Text",
    icon: Phone,
  },
  {
    type: "url",
    label: "Website / URL",
    defaultLabel: "What is your website link?",
    description: "Link input with URL validation",
    category: "Text",
    icon: LinkIcon,
  },

  // Choices
  {
    type: "single_choice",
    label: "Single choice",
    defaultLabel: "Select one option",
    description: "Radio options for a single selection",
    category: "Choices",
    icon: CircleDot,
  },
  {
    type: "multiple_choice",
    label: "Multiple choice",
    defaultLabel: "Select all that apply",
    description: "Checkboxes for selecting multiple options",
    category: "Choices",
    icon: CheckSquare,
  },
  {
    type: "dropdown",
    label: "Dropdown",
    defaultLabel: "Select an option from the list",
    description: "Clean select menu for compact lists",
    category: "Choices",
    icon: ChevronDownSquare,
  },
  {
    type: "yes_no",
    label: "Yes / No",
    defaultLabel: "Do you agree?",
    description: "Binary yes or no decision",
    category: "Choices",
    icon: ToggleLeft,
  },

  // Numbers & Ratings
  {
    type: "rating",
    label: "Rating",
    defaultLabel: "How would you rate your experience?",
    description: "1 to 5 star rating scale",
    category: "Numbers & Ratings",
    icon: Star,
  },
  {
    type: "number",
    label: "Number",
    defaultLabel: "How many?",
    description: "Numerical value input",
    category: "Numbers & Ratings",
    icon: Hash,
  },

  // Advanced / Date & Time
  {
    type: "date",
    label: "Date",
    defaultLabel: "Select a date",
    description: "Date picker for birthdays, events, bookings",
    category: "Advanced",
    icon: Calendar,
  },
  {
    type: "time",
    label: "Time",
    defaultLabel: "Select a time",
    description: "Time selector for appointments",
    category: "Advanced",
    icon: Clock,
  },
];

interface FieldLibraryProps {
  onAddField: (type: FormFieldType) => void;
}

export function FieldLibrary({ onAddField }: FieldLibraryProps) {
  const categories: Array<FieldDefinition["category"]> = [
    "Text",
    "Choices",
    "Numbers & Ratings",
    "Advanced",
  ];

  return (
    <aside className="w-full lg:w-72 border-r border-[#E7E2D8] dark:border-[#2E2824] bg-white dark:bg-[#1C1917] p-4 flex flex-col h-full overflow-y-auto select-none">
      <div className="pb-3 mb-3 border-b border-[#F5F2EB] dark:border-[#2E2824]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#FBF9F5]">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
          <span>Fields Library</span>
        </div>
        <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5">
          Click any field to add it to your form
        </p>
      </div>

      <div className="space-y-5">
        {categories.map((category) => {
          const fields = FIELD_DEFINITIONS.filter((f) => f.category === category);
          return (
            <div key={category} className="space-y-1.5">
              <h4 className="text-[11px] font-semibold text-[#A8A29E] dark:text-[#78716C] uppercase tracking-wider px-1">
                {category}
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {fields.map((def) => {
                  const Icon = def.icon;
                  return (
                    <button
                      key={def.type}
                      type="button"
                      onClick={() => onAddField(def.type)}
                      className="group w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[#FAF8F5] dark:hover:bg-[#24201D] border border-transparent hover:border-[#E7E2D8] dark:hover:border-[#2E2824] transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] text-[#78716C] dark:text-[#A8A29E] group-hover:text-[#FF5A36] group-hover:border-[#FFD8CC] dark:group-hover:border-[#522920] flex items-center justify-center transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[#1C1917] dark:text-[#FBF9F5] truncate">
                            {def.label}
                          </div>
                          <div className="text-[10px] text-[#A8A29E] dark:text-[#78716C] truncate">
                            {def.description}
                          </div>
                        </div>
                      </div>

                      <Plus className="w-3.5 h-3.5 text-[#A8A29E] opacity-0 group-hover:opacity-100 group-hover:text-[#FF5A36] transition-opacity flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
