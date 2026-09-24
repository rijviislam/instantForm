"use client";

import React, { useState } from "react";
import {
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  Link as LinkIcon,
  KeyRound,
  CircleDot,
  CheckSquare,
  ChevronDownSquare,
  ToggleLeft,
  Grid3X3,
  CheckCheck,
  Star,
  SlidersHorizontal,
  SmilePlus,
  Calendar,
  Clock,
  CalendarRange,
  Hourglass,
  Upload,
  Image as ImageIcon,
  Video,
  Mic,
  Camera,
  Music,
  PenTool,
  MapPin,
  Globe2,
  Building,
  Navigation,
  DollarSign,
  Percent,
  Calculator,
  Layers,
  Palette,
  Heading,
  Minus,
  EyeOff,
  Fingerprint,
  Tag,
  Share2,
  UserCheck,
  Search,
  Plus,
  Sparkles,
} from "lucide-react";
import { FormFieldType } from "@/lib/api-client";

export interface FieldDefinition {
  type: FormFieldType;
  label: string;
  defaultLabel: string;
  description: string;
  category:
    | "Text"
    | "Choices"
    | "Ratings & Scales"
    | "Media & Capture"
    | "Date & Time"
    | "Location & Address"
    | "Numbers & Finance"
    | "Layout & Design"
    | "Hidden & System";
  icon: React.ComponentType<{ className?: string }>;
  defaultProps?: Record<string, any>;
}

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  // 1. Text & Standard Inputs
  {
    type: "short_text",
    label: "Short Text",
    defaultLabel: "What is your answer?",
    description: "Single-line input for names or quick responses",
    category: "Text",
    icon: Type,
  },
  {
    type: "long_text",
    label: "Long Text",
    defaultLabel: "Please describe in detail",
    description: "Multi-line text area for feedback & paragraphs",
    category: "Text",
    icon: AlignLeft,
  },
  {
    type: "email",
    label: "Email Address",
    defaultLabel: "What is your email address?",
    description: "Verified email input with RFC format check",
    category: "Text",
    icon: Mail,
  },
  {
    type: "phone",
    label: "Phone Number",
    defaultLabel: "What is your phone number?",
    description: "International phone number input",
    category: "Text",
    icon: Phone,
  },
  {
    type: "url",
    label: "Website / URL",
    defaultLabel: "What is your website link?",
    description: "Web address link with URL validation",
    category: "Text",
    icon: LinkIcon,
  },
  {
    type: "password",
    label: "Password",
    defaultLabel: "Enter your secure password",
    description: "Masked text input for credentials",
    category: "Text",
    icon: KeyRound,
  },

  // 2. Choices & Selection
  {
    type: "single_choice",
    label: "Radio Group / Single Choice",
    defaultLabel: "Select one option",
    description: "Radio selection for pick-one questions",
    category: "Choices",
    icon: CircleDot,
    defaultProps: { options: ["Option 1", "Option 2", "Option 3"] },
  },
  {
    type: "multiple_choice",
    label: "Multiple Choice / Checkbox",
    defaultLabel: "Select all that apply",
    description: "Checkbox options for multi-selection",
    category: "Choices",
    icon: CheckSquare,
    defaultProps: { options: ["Option 1", "Option 2", "Option 3"] },
  },
  {
    type: "dropdown",
    label: "Dropdown Select",
    defaultLabel: "Select an option from the list",
    description: "Compact select menu for long option lists",
    category: "Choices",
    icon: ChevronDownSquare,
    defaultProps: { options: ["Option 1", "Option 2", "Option 3"] },
  },
  {
    type: "yes_no",
    label: "Yes / No Toggle",
    defaultLabel: "Do you agree with this statement?",
    description: "Binary yes/no switch button",
    category: "Choices",
    icon: ToggleLeft,
  },
  {
    type: "multiple_choice_grid",
    label: "Multiple Choice Grid",
    defaultLabel: "Rate each item in the matrix",
    description: "Grid matrix with radio buttons per row",
    category: "Choices",
    icon: Grid3X3,
    defaultProps: {
      rows: ["Row 1", "Row 2"],
      columns: ["Column 1", "Column 2", "Column 3"],
    },
  },
  {
    type: "checkbox_grid",
    label: "Checkbox Grid",
    defaultLabel: "Check all matching options per row",
    description: "Matrix of checkboxes across rows and columns",
    category: "Choices",
    icon: CheckCheck,
    defaultProps: {
      rows: ["Row 1", "Row 2"],
      columns: ["Column 1", "Column 2", "Column 3"],
    },
  },

  // 3. Ratings & Scales
  {
    type: "rating",
    label: "Star Rating",
    defaultLabel: "How would you rate your overall experience?",
    description: "Visual 1 to 5 star rating score",
    category: "Ratings & Scales",
    icon: Star,
  },
  {
    type: "linear_scale",
    label: "Linear Scale / Slider",
    defaultLabel: "Rate from 1 to 10",
    description: "Numeric scale slider from min to max",
    category: "Ratings & Scales",
    icon: SlidersHorizontal,
    defaultProps: { min: 1, max: 10, minLabel: "Poor", maxLabel: "Excellent" },
  },
  {
    type: "nps",
    label: "Net Promoter Score (NPS)",
    defaultLabel: "How likely are you to recommend us to a friend?",
    description: "Standard 0–10 Net Promoter Score layout",
    category: "Ratings & Scales",
    icon: SmilePlus,
    defaultProps: { min: 0, max: 10, minLabel: "Not likely", maxLabel: "Extremely likely" },
  },

  // 4. Media, Capture & Signature
  {
    type: "file_upload",
    label: "File Upload",
    defaultLabel: "Upload your document or file",
    description: "Drag-and-drop file attachment input",
    category: "Media & Capture",
    icon: Upload,
  },
  {
    type: "image_upload",
    label: "Image Upload",
    defaultLabel: "Upload photo or graphic",
    description: "Photo uploader with visual thumbnail preview",
    category: "Media & Capture",
    icon: ImageIcon,
  },
  {
    type: "video_upload",
    label: "Video Upload",
    defaultLabel: "Upload video recording",
    description: "Video clip attachment uploader",
    category: "Media & Capture",
    icon: Video,
  },
  {
    type: "audio_upload",
    label: "Audio Upload",
    defaultLabel: "Upload audio file",
    description: "Audio track attachment uploader",
    category: "Media & Capture",
    icon: Music,
  },
  {
    type: "camera_capture",
    label: "Camera Capture",
    defaultLabel: "Take a photo with your device camera",
    description: "Direct device camera snapshot capture",
    category: "Media & Capture",
    icon: Camera,
  },
  {
    type: "voice_recording",
    label: "Voice Recording",
    defaultLabel: "Record a voice note",
    description: "Direct microphone audio voice memo recorder",
    category: "Media & Capture",
    icon: Mic,
  },
  {
    type: "signature",
    label: "Digital Signature",
    defaultLabel: "Sign your signature here",
    description: "Interactive canvas signature drawing pad",
    category: "Media & Capture",
    icon: PenTool,
  },

  // 5. Date, Time & Duration
  {
    type: "date",
    label: "Date Picker",
    defaultLabel: "Select a date",
    description: "Calendar date selector for bookings & events",
    category: "Date & Time",
    icon: Calendar,
  },
  {
    type: "time",
    label: "Time Selector",
    defaultLabel: "Select a time",
    description: "Time of day picker for appointments",
    category: "Date & Time",
    icon: Clock,
  },
  {
    type: "date_range",
    label: "Date Range",
    defaultLabel: "Select start and end dates",
    description: "From date to to date interval selector",
    category: "Date & Time",
    icon: CalendarRange,
  },
  {
    type: "duration",
    label: "Duration",
    defaultLabel: "Specify elapsed duration",
    description: "Hours and minutes duration counter",
    category: "Date & Time",
    icon: Hourglass,
  },

  // 6. Location & Address
  {
    type: "address",
    label: "Full Address Block",
    defaultLabel: "What is your physical address?",
    description: "Street, City, State/Province, Postal Code, Country",
    category: "Location & Address",
    icon: MapPin,
  },
  {
    type: "country",
    label: "Country Selector",
    defaultLabel: "Select your country",
    description: "Comprehensive global country dropdown",
    category: "Location & Address",
    icon: Globe2,
  },
  {
    type: "state",
    label: "State / Province",
    defaultLabel: "State or Province",
    description: "Region or state input field",
    category: "Location & Address",
    icon: Building,
  },
  {
    type: "city",
    label: "City",
    defaultLabel: "City or Municipality",
    description: "City name input",
    category: "Location & Address",
    icon: Building,
  },
  {
    type: "postal_code",
    label: "Postal / ZIP Code",
    defaultLabel: "Postal or ZIP code",
    description: "ZIP/Postal code format input",
    category: "Location & Address",
    icon: MapPin,
  },
  {
    type: "gps_location",
    label: "GPS / Map Location",
    defaultLabel: "Capture current GPS location",
    description: "Coordinates & Google Maps pin locator",
    category: "Location & Address",
    icon: Navigation,
  },

  // 7. Numbers & Finance
  {
    type: "number",
    label: "Number",
    defaultLabel: "Enter a number",
    description: "Numerical input with step and limits",
    category: "Numbers & Finance",
    icon: Hash,
  },
  {
    type: "currency",
    label: "Currency Amount",
    defaultLabel: "Enter price or amount",
    description: "Formatted financial currency input with symbol",
    category: "Numbers & Finance",
    icon: DollarSign,
    defaultProps: { currencySymbol: "$" },
  },
  {
    type: "percentage",
    label: "Percentage (%)",
    defaultLabel: "Enter percentage rate",
    description: "Percentage calculation field with % suffix",
    category: "Numbers & Finance",
    icon: Percent,
  },
  {
    type: "decimal",
    label: "Decimal Number",
    defaultLabel: "Enter precise decimal value",
    description: "Floating point decimal number with precision",
    category: "Numbers & Finance",
    icon: Calculator,
  },
  {
    type: "quantity",
    label: "Quantity Stepper",
    defaultLabel: "Select quantity",
    description: "Increment / decrement counter buttons",
    category: "Numbers & Finance",
    icon: Layers,
    defaultProps: { min: 1, max: 100, step: 1 },
  },

  // 8. Layout & Special
  {
    type: "color_picker",
    label: "Color Picker",
    defaultLabel: "Choose a brand or custom color",
    description: "Hex & palette visual color selector",
    category: "Layout & Design",
    icon: Palette,
  },
  {
    type: "section_heading",
    label: "Section Heading",
    defaultLabel: "Section Title Header",
    description: "Visual chapter heading to organize sections",
    category: "Layout & Design",
    icon: Heading,
  },
  {
    type: "divider",
    label: "Visual Divider Line",
    defaultLabel: "Divider",
    description: "Subtle separator line dividing form sections",
    category: "Layout & Design",
    icon: Minus,
  },

  // 9. Hidden & System Metadata
  {
    type: "hidden_input",
    label: "Hidden Field",
    defaultLabel: "Hidden Parameter",
    description: "Invisible field passed silently in payload",
    category: "Hidden & System",
    icon: EyeOff,
  },
  {
    type: "auto_id",
    label: "Auto-generated ID",
    defaultLabel: "Record Identifier",
    description: "Automated unique submission UUID identifier",
    category: "Hidden & System",
    icon: Fingerprint,
  },
  {
    type: "utm_source",
    label: "UTM Source Tracker",
    defaultLabel: "utm_source",
    description: "Auto-extracts ?utm_source from referral query string",
    category: "Hidden & System",
    icon: Tag,
  },
  {
    type: "utm_medium",
    label: "UTM Medium Tracker",
    defaultLabel: "utm_medium",
    description: "Auto-extracts ?utm_medium from campaign link",
    category: "Hidden & System",
    icon: Tag,
  },
  {
    type: "utm_campaign",
    label: "UTM Campaign Tracker",
    defaultLabel: "utm_campaign",
    description: "Auto-extracts ?utm_campaign from promotion link",
    category: "Hidden & System",
    icon: Tag,
  },
  {
    type: "referrer",
    label: "Referrer URL Tracker",
    defaultLabel: "Referring Page",
    description: "Auto-captures document.referrer source page",
    category: "Hidden & System",
    icon: Share2,
  },
  {
    type: "user_id",
    label: "Authenticated User ID",
    defaultLabel: "User ID",
    description: "Passes authenticated account ID automatically",
    category: "Hidden & System",
    icon: UserCheck,
  },
  // 10. Custom & Dynamic Fields
  {
    type: "custom_input",
    label: "Custom Input Field",
    defaultLabel: "Custom Field",
    description: "Configurable field with custom type, regex pattern & CSS",
    category: "Text",
    icon: Sparkles,
    defaultProps: {
      customInputType: "text",
      customFieldName: "custom_field_1",
      customPattern: "",
      customErrorMessage: "",
      helpText: "",
      customClass: "",
    },
  },
];

interface FieldLibraryProps {
  onAddField: (type: FormFieldType, defaultProps?: Record<string, any>) => void;
}

export function FieldLibrary({ onAddField }: FieldLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories: Array<FieldDefinition["category"]> = [
    "Text",
    "Choices",
    "Ratings & Scales",
    "Media & Capture",
    "Date & Time",
    "Location & Address",
    "Numbers & Finance",
    "Layout & Design",
    "Hidden & System",
  ];

  const filteredFields = FIELD_DEFINITIONS.filter((field) => {
    const matchesCategory =
      selectedCategory === "All" || field.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      field.label.toLowerCase().includes(query) ||
      field.description.toLowerCase().includes(query) ||
      field.type.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <aside className="w-full lg:w-80 border-r border-[#EAE3D6] bg-white p-4 flex flex-col h-full min-h-0 overflow-hidden" data-lenis-prevent="true">
      {/* Header */}
      <div className="pb-3 mb-3 border-b border-[#F5F2EB] space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Fields Library</span>
          </div>
          <span className="text-[10px] font-semibold text-[#FF5A36] bg-[#FFF0EB] px-2 py-0.5 rounded-full border border-[#FFD8CC]">
            {FIELD_DEFINITIONS.length} Options
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all field types..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-xl text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#FF5A36] transition-all"
          />
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "All"
                ? "bg-[#1C1917] text-white"
                : "bg-[#FAF8F5] text-[#78716C] hover:text-[#1C1917] border border-[#EAE3D6]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1C1917] text-white"
                  : "bg-[#FAF8F5] text-[#78716C] hover:text-[#1C1917] border border-[#EAE3D6]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fields List */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 overscroll-contain" data-lenis-prevent="true">
        {categories
          .filter(
            (category) =>
              selectedCategory === "All" || selectedCategory === category
          )
          .map((category) => {
            const catFields = filteredFields.filter(
              (f) => f.category === category
            );
            if (catFields.length === 0) return null;

            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider">
                    {category}
                  </h4>
                  <span className="text-[10px] text-[#A8A29E] font-mono">
                    {catFields.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {catFields.map((def) => {
                    const Icon = def.icon;
                    return (
                      <button
                        key={def.type}
                        type="button"
                        onClick={() => onAddField(def.type, def.defaultProps)}
                        className="group w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[#FAF8F5] border border-transparent hover:border-[#EAE3D6] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#EAE3D6] text-[#78716C] group-hover:text-[#FF5A36] group-hover:border-[#FFD8CC] flex items-center justify-center transition-colors flex-shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#1C1917] group-hover:text-[#FF5A36] truncate transition-colors">
                              {def.label}
                            </div>
                            <div className="text-[10px] text-[#A8A29E] truncate">
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

        {filteredFields.length === 0 && (
          <div className="text-center py-8 px-4 text-[#A8A29E] space-y-1">
            <p className="text-xs font-semibold text-[#57534E]">
              No matching fields
            </p>
            <p className="text-[11px]">
              Try searching with a different term or clear filters.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
