"use client";

import React, { useState } from "react";
import {
  FormTheme,
  GOOGLE_FONTS_LIST,
  THEME_PRESETS,
  INPUT_STYLE_PRESETS,
  FIELD_CARD_STYLE_PRESETS,
  resolveFormTheme,
  applyThemeMood,
} from "@/lib/form-theme";
import {
  Palette,
  Type,
  Layout,
  Maximize2,
  Sliders,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  RotateCcw,
  Square,
  CircleDot,
  Star,
  Layers,
  Sparkle,
  BoxSelect,
  MousePointer,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react";

interface FormStyleCustomizerProps {
  theme?: FormTheme;
  onChange: (updatedTheme: FormTheme) => void;
}

export function FormStyleCustomizer({
  theme: rawTheme,
  onChange,
}: FormStyleCustomizerProps) {
  const theme = resolveFormTheme(rawTheme);
  const [activeSection, setActiveSection] = useState<string>("presets");
  const [activeFieldCardSubTab, setActiveFieldCardSubTab] = useState<string>("presets");
  const [activeInputSubTab, setActiveInputSubTab] = useState<string>("presets");

  const isFormDark = () => {
    const bg = (theme.background?.color || "").toLowerCase();
    const cardBg = (theme.container?.backgroundColor || "").toLowerCase();
    const text = (theme.colors?.text || "").toLowerCase();
    return (
      bg === "#0b0f17" ||
      bg === "#0f172a" ||
      bg === "#111827" ||
      bg === "#18181b" ||
      bg === "#000000" ||
      bg === "#1e293b" ||
      cardBg === "#1e293b" ||
      cardBg === "#1f2937" ||
      cardBg === "#18181b" ||
      cardBg === "#0f172a" ||
      cardBg === "#161f30" ||
      text === "#f8fafc" ||
      text === "#ffffff" ||
      text === "#f1f5f9"
    );
  };

  const handleApplyFormLightMode = () => {
    updateMultiple({
      background: {
        type: "solid",
        color: "#FAF8F5",
      },
      container: {
        backgroundColor: "#FFFFFF",
        borderColor: "#EAE3D6",
      },
      colors: {
        text: "#1C1917",
      },
      typography: {
        headingColor: "#1C1917",
        descriptionColor: "#78716C",
      },
      inputs: {
        backgroundColor: "#FFFFFF",
        textColor: "#1C1917",
        borderColor: "#EAE3D6",
        placeholderColor: "#A8A29E",
      },
      fieldCard: {
        backgroundColor: "#FFFFFF",
        borderColor: "#EAE3D6",
      },
    });
  };

  const handleApplyFormDarkMode = () => {
    updateMultiple({
      background: {
        type: "solid",
        color: "#0F172A",
      },
      container: {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
      },
      colors: {
        text: "#F8FAFC",
      },
      typography: {
        headingColor: "#FFFFFF",
        descriptionColor: "#94A3B8",
      },
      inputs: {
        backgroundColor: "#0F172A",
        textColor: "#F8FAFC",
        borderColor: "#334155",
        placeholderColor: "#64748B",
      },
      fieldCard: {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
      },
    });
  };

  const updateMultiple = (updates: any) => {
    let nextTheme: any = { ...theme };
    Object.keys(updates).forEach((section) => {
      const sectionUpdates = updates[section];
      if (typeof sectionUpdates === "object" && sectionUpdates !== null) {
        nextTheme[section] = {
          ...(nextTheme[section] || {}),
          ...sectionUpdates,
        };
      } else {
        nextTheme[section] = sectionUpdates;
      }
    });
    onChange(nextTheme as FormTheme);
  };

  const updateSubKey = <K extends keyof FormTheme>(
    section: K,
    updates: Partial<FormTheme[K]>
  ) => {
    updateMultiple({ [section]: updates });
  };

  const handleApplyPreset = (presetTheme: Partial<FormTheme>) => {
    onChange(resolveFormTheme({ ...theme, ...presetTheme }));
  };

  const handleResetToDefault = () => {
    onChange(resolveFormTheme(undefined));
  };

  const handleCustomFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateSubKey("typography", {
          fontFamily: "Custom Uploaded",
          customFontUrl: dataUrl,
          customFontName: file.name.replace(/\.[^/.]+$/, ""),
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateSubKey("background", {
          type: "image",
          imageUrl: dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCardBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateSubKey("container", {
          backgroundType: "image",
          imageUrl: dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFieldCardBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateSubKey("fieldCard", {
          backgroundType: "image",
          imageUrl: dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateSubKey("branding", {
          logoUrl: dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateSubKey("branding", {
          headerImageUrl: dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleSection = (id: string) => {
    setActiveSection(activeSection === id ? "" : id);
  };

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Quick Reset Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F5F2EB]">
        <div className="flex items-center gap-1.5 font-semibold text-[#1C1917]">
          <Palette className="w-3.5 h-3.5 text-[#FF5A36]" />
          <span>Form Visual Style</span>
        </div>
        <button
          type="button"
          onClick={handleResetToDefault}
          className="flex items-center gap-1 text-[11px] text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
          title="Reset to default theme"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Quick Form Mood & Publishing Mode Switcher */}
      <div className="space-y-2.5 p-3 bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#1C1917] dark:text-[#F8FAFC] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Publishing Color Mood</span>
          </div>
          <span className="text-[10px] font-semibold text-[#FF5A36] bg-[#FFF0EB] dark:bg-[#FF5A36]/15 px-2 py-0.5 rounded-full border border-[#FFD8CC] dark:border-[#FF5A36]/30">
            {theme.colorMood === "dark"
              ? "Dark Mood"
              : theme.colorMood === "auto"
              ? "Auto (System)"
              : theme.colorMood === "toggle"
              ? "Interactive"
              : "Light Mood"}
          </span>
        </div>

        {/* 4-way Mode Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#293548] rounded-xl">
          <button
            type="button"
            onClick={() => {
              const updated = applyThemeMood(theme, "light");
              onChange({ ...updated, colorMood: "light" });
            }}
            className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-xs transition-all cursor-pointer ${
              theme.colorMood === "light" || (!theme.colorMood && !isFormDark())
                ? "bg-[#FFF0EB] dark:bg-[#FF5A36]/20 text-[#FF5A36] shadow-xs border border-[#FFD8CC] dark:border-[#FF5A36]/30"
                : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B]"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light Mood</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const updated = applyThemeMood(theme, "dark");
              onChange({ ...updated, colorMood: "dark" });
            }}
            className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-xs transition-all cursor-pointer ${
              theme.colorMood === "dark" || (!theme.colorMood && isFormDark())
                ? "bg-[#0B0F17] dark:bg-[#1E293B] text-white shadow-xs border border-[#1F2937] dark:border-[#334155]"
                : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B]"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark Mood</span>
          </button>
        </div>

        {/* Secondary Options: Auto & Toggle */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onChange({ ...theme, colorMood: "auto" });
            }}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] font-medium border transition-all cursor-pointer ${
              theme.colorMood === "auto"
                ? "bg-[#FFF0EB] dark:bg-[#FF5A36]/20 border-[#FF5A36] text-[#FF5A36] font-semibold"
                : "bg-white dark:bg-[#111827] border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8] hover:border-[#D6CEC0]"
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Auto System</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChange({ ...theme, colorMood: "toggle", allowRespondentMoodToggle: true });
            }}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] font-medium border transition-all cursor-pointer ${
              theme.colorMood === "toggle"
                ? "bg-[#FFF0EB] dark:bg-[#FF5A36]/20 border-[#FF5A36] text-[#FF5A36] font-semibold"
                : "bg-white dark:bg-[#111827] border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8] hover:border-[#D6CEC0]"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Respondent Switch</span>
          </button>
        </div>

        {/* Respondent Switcher Checkbox */}
        <div className="pt-2 border-t border-[#EAE3D6] dark:border-[#293548] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
              Respondent Mood Switcher
            </div>
            <div className="text-[10px] text-[#78716C] dark:text-[#94A3B8]">
              Show Sun/Moon toggle button on published form
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme.allowRespondentMoodToggle !== false}
              onChange={(e) => {
                onChange({ ...theme, allowRespondentMoodToggle: e.target.checked });
              }}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-[#EAE3D6] dark:bg-[#293548] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#FF5A36]" />
          </label>
        </div>
      </div>

      {/* 1. Theme Presets Bar */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
          Style Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {THEME_PRESETS.map((p) => {
            const isSelected =
              p.theme.colors?.primary === theme.colors?.primary &&
              p.theme.background?.color === theme.background?.color;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p.theme)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${isSelected
                    ? "border-[#FF5A36] bg-[#FFF0EB] ring-1 ring-[#FF5A36]"
                    : "border-[#EAE3D6] bg-[#FAF8F5] hover:border-[#D6CEC0]"
                  }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0 flex items-center justify-center text-white"
                  style={{ backgroundColor: p.previewColor }}
                >
                  {isSelected && <Check className="w-2.5 h-2.5" />}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-[#1C1917] truncate">
                    {p.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Accordion Customization Sections */}
      <div className="space-y-2">
        {/* Colors Section */}
        <div className="border border-[#EAE3D6] rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection("colors")}
            className="w-full p-2.5 bg-[#FAF8F5] flex items-center justify-between font-semibold text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <span>Colors & Palette</span>
            </div>
            {activeSection === "colors" ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#78716C]" />
            )}
          </button>

          {activeSection === "colors" && (
            <div className="p-3 space-y-3 bg-white">
              {/* Quick Mode Toggle in Colors */}
              <div className="flex items-center justify-between pb-2 border-b border-[#F5F2EB]">
                <span className="text-stone-700 font-medium">Form Color Mood</span>
                <div className="flex items-center gap-1 p-0.5 bg-[#FAF8F5] border border-[#EAE3D6] rounded-lg">
                  <button
                    type="button"
                    onClick={handleApplyFormLightMode}
                    className={`p-1 rounded-md flex items-center gap-1 text-[11px] cursor-pointer ${
                      !isFormDark() ? "bg-white text-[#FF5A36] font-semibold shadow-2xs" : "text-[#78716C]"
                    }`}
                    title="Switch form to light mode"
                  >
                    <Sun className="w-3 h-3" /> Light
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFormDarkMode}
                    className={`p-1 rounded-md flex items-center gap-1 text-[11px] cursor-pointer ${
                      isFormDark() ? "bg-[#0F172A] text-white font-semibold shadow-2xs" : "text-[#78716C]"
                    }`}
                    title="Switch form to dark mode"
                  >
                    <Moon className="w-3 h-3" /> Dark
                  </button>
                </div>
              </div>
              {/* Primary Color */}
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Primary Accent</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.colors.primary}
                    onChange={(e) => {
                      updateMultiple({
                        colors: { primary: e.target.value },
                        buttons: { backgroundColor: e.target.value },
                      });
                    }}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.colors.primary}
                    onChange={(e) => {
                      updateMultiple({
                        colors: { primary: e.target.value },
                        buttons: { backgroundColor: e.target.value },
                      });
                    }}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Page Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.background.color}
                    onChange={(e) => {
                      updateSubKey("background", { color: e.target.value });
                    }}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.background.color}
                    onChange={(e) => {
                      updateSubKey("background", { color: e.target.value });
                    }}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Card / Surface Color */}
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Card Surface</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.container.backgroundColor?.startsWith("#") ? theme.container.backgroundColor : "#FFFFFF"}
                    onChange={(e) => {
                      updateSubKey("container", { backgroundColor: e.target.value });
                    }}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.container.backgroundColor || "#FFFFFF"}
                    onChange={(e) => {
                      updateSubKey("container", { backgroundColor: e.target.value });
                    }}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Main Text Color */}
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Body Text</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.colors.text}
                    onChange={(e) => {
                      updateMultiple({
                        colors: { text: e.target.value },
                        inputs: { textColor: e.target.value },
                      });
                    }}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.colors.text}
                    onChange={(e) => {
                      updateMultiple({
                        colors: { text: e.target.value },
                        inputs: { textColor: e.target.value },
                      });
                    }}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Form Title Color */}
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-medium">Form Title</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      theme.typography.headingColor?.startsWith("#")
                        ? theme.typography.headingColor
                        : (theme.colors.text?.startsWith("#") ? theme.colors.text : "#1C1917")
                    }
                    onChange={(e) => {
                      updateSubKey("typography", { headingColor: e.target.value });
                    }}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.typography.headingColor || theme.colors.text || "#1C1917"}
                    onChange={(e) => {
                      updateSubKey("typography", { headingColor: e.target.value });
                    }}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Form Description Color */}
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-medium">Form Description</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      theme.typography.descriptionColor?.startsWith("#")
                        ? theme.typography.descriptionColor
                        : (theme.colors.mutedText?.startsWith("#") ? theme.colors.mutedText : "#78716C")
                    }
                    onChange={(e) => {
                      updateMultiple({
                        typography: { descriptionColor: e.target.value },
                        colors: { mutedText: e.target.value },
                      });
                    }}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.typography.descriptionColor || theme.colors.mutedText || "#78716C"}
                    onChange={(e) => {
                      updateMultiple({
                        typography: { descriptionColor: e.target.value },
                        colors: { mutedText: e.target.value },
                      });
                    }}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Flow Style Badge Colors */}
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-medium">Style Badge Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      theme.branding.badgeBackgroundColor?.startsWith("#")
                        ? theme.branding.badgeBackgroundColor
                        : (theme.colors.accent?.startsWith("#") ? theme.colors.accent : "#FFF0EB")
                    }
                    onChange={(e) => {
                      updateSubKey("branding", { badgeBackgroundColor: e.target.value });
                    }}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.branding.badgeBackgroundColor || theme.colors.accent || "#FFF0EB"}
                    onChange={(e) => {
                      updateSubKey("branding", { badgeBackgroundColor: e.target.value });
                    }}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-medium">Style Badge Text & Icon</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      theme.branding.badgeTextColor?.startsWith("#")
                        ? theme.branding.badgeTextColor
                        : (theme.colors.primary?.startsWith("#") ? theme.colors.primary : "#FF5A36")
                    }
                    onChange={(e) => {
                      updateSubKey("branding", { badgeTextColor: e.target.value });
                    }}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.branding.badgeTextColor || theme.colors.primary || "#FF5A36"}
                    onChange={(e) => {
                      updateSubKey("branding", { badgeTextColor: e.target.value });
                    }}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Border Color */}
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-medium">Borders</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.container.borderColor || theme.colors.border || "#EAE3D6"}
                    onChange={(e) => {
                      updateMultiple({
                        colors: { border: e.target.value },
                        container: { borderColor: e.target.value },
                        fieldCard: { borderColor: e.target.value },
                        inputs: { borderColor: e.target.value, dropzoneBorderColor: e.target.value },
                      });
                    }}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.container.borderColor || theme.colors.border || "#EAE3D6"}
                    onChange={(e) => {
                      updateMultiple({
                        colors: { border: e.target.value },
                        container: { borderColor: e.target.value },
                        fieldCard: { borderColor: e.target.value },
                        inputs: { borderColor: e.target.value, dropzoneBorderColor: e.target.value },
                      });
                    }}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Background Section */}
        <div className="border border-[#EAE3D6] rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection("background")}
            className="w-full p-2.5 bg-[#FAF8F5] flex items-center justify-between font-semibold text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Background (Color, Gradient, Image)</span>
            </div>
            {activeSection === "background" ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#78716C]" />
            )}
          </button>

          {activeSection === "background" && (
            <div className="p-3 space-y-3 bg-white">
              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                {(["solid", "gradient", "image"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateSubKey("background", { type: t })}
                    className={`py-1 text-center font-semibold rounded-lg capitalize cursor-pointer transition-colors ${theme.background.type === t
                        ? "bg-[#FF5A36] text-white shadow-xs"
                        : "text-[#78716C] hover:text-[#1C1917]"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {theme.background.type === "solid" && (
                <div className="space-y-2">
                  <label className="block text-[#78716C]">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.background.color}
                      onChange={(e) => updateSubKey("background", { color: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-[#EAE3D6] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.background.color}
                      onChange={(e) => updateSubKey("background", { color: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {theme.background.type === "gradient" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#78716C] mb-1">From Color</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={theme.background.gradientFrom}
                          onChange={(e) => updateSubKey("background", { gradientFrom: e.target.value })}
                          className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.background.gradientFrom}
                          onChange={(e) => updateSubKey("background", { gradientFrom: e.target.value })}
                          className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#78716C] mb-1">To Color</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={theme.background.gradientTo}
                          onChange={(e) => updateSubKey("background", { gradientTo: e.target.value })}
                          className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.background.gradientTo}
                          onChange={(e) => updateSubKey("background", { gradientTo: e.target.value })}
                          className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#78716C] mb-1">Gradient Style</label>
                    <select
                      value={theme.background.gradientType}
                      onChange={(e) => updateSubKey("background", { gradientType: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] text-xs"
                    >
                      <option value="linear">Linear Gradient</option>
                      <option value="radial">Radial Gradient</option>
                    </select>
                  </div>
                </div>
              )}

              {theme.background.type === "image" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#78716C] mb-1">Image URL</label>
                    <input
                      type="text"
                      value={theme.background.imageUrl || ""}
                      onChange={(e) => updateSubKey("background", { imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#78716C] mb-1">Or Upload Local Image</label>
                    <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-[#EAE3D6] hover:border-[#FF5A36] rounded-xl bg-[#FAF8F5] cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-[#FF5A36]" />
                      <span className="text-[11px] font-semibold text-[#1C1917]">Browse Image</span>
                      <input type="file" accept="image/*" onChange={handleBgImageUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#78716C] mb-1">Position</label>
                      <select
                        value={theme.background.imagePosition}
                        onChange={(e) => updateSubKey("background", { imagePosition: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#78716C] mb-1">Size Fit</label>
                      <select
                        value={theme.background.imageSize}
                        onChange={(e) => updateSubKey("background", { imageSize: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                      >
                        <option value="cover">Cover (Fill)</option>
                        <option value="contain">Contain</option>
                        <option value="auto">Original</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#78716C] mb-1">
                      <span>Background Blur</span>
                      <span>{theme.background.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={theme.background.blur}
                      onChange={(e) => updateSubKey("background", { blur: Number(e.target.value) })}
                      className="w-full accent-[#FF5A36]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Typography / Fonts Section */}
        <div className="border border-[#EAE3D6] rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection("typography")}
            className="w-full p-2.5 bg-[#FAF8F5] flex items-center justify-between font-semibold text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Typography & Google / Custom Fonts</span>
            </div>
            {activeSection === "typography" ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#78716C]" />
            )}
          </button>

          {activeSection === "typography" && (
            <div className="p-3 space-y-3 bg-white">
              {/* Primary Font */}
              <div>
                <label className="block text-[#78716C] mb-1">Primary Font Family</label>
                <select
                  value={theme.typography.fontFamily}
                  onChange={(e) => updateSubKey("typography", { fontFamily: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] text-xs font-semibold text-[#1C1917]"
                >
                  {GOOGLE_FONTS_LIST.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Heading Font */}
              <div>
                <label className="block text-[#78716C] mb-1">Heading Font Family</label>
                <select
                  value={theme.typography.headingFont || theme.typography.fontFamily}
                  onChange={(e) => updateSubKey("typography", { headingFont: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] text-xs font-semibold text-[#1C1917]"
                >
                  {GOOGLE_FONTS_LIST.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Font File Upload */}
              <div>
                <label className="block text-[#78716C] mb-1">Upload Custom Font (.woff, .woff2, .ttf, .otf)</label>
                <label className="flex items-center justify-between p-2.5 border border-dashed border-[#EAE3D6] hover:border-[#FF5A36] rounded-xl bg-[#FAF8F5] cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <Upload className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span className="text-[11px] text-[#1C1917] truncate font-medium">
                      {theme.typography.customFontName ? theme.typography.customFontName : "Upload font file..."}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#1C1917] text-white px-2 py-0.5 rounded-lg shrink-0">Upload</span>
                  <input type="file" accept=".woff,.woff2,.ttf,.otf" onChange={handleCustomFontUpload} className="hidden" />
                </label>
              </div>

              {/* Font Weight & Heading Size */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#78716C] mb-1">Title Size</label>
                  <select
                    value={theme.typography.headingSize}
                    onChange={(e) => updateSubKey("typography", { headingSize: e.target.value as any })}
                    className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                  >
                    <option value="base">Small</option>
                    <option value="lg">Medium</option>
                    <option value="xl">Large</option>
                    <option value="2xl">Extra Large (2XL)</option>
                    <option value="3xl">Huge (3XL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#78716C] mb-1">Weight</label>
                  <select
                    value={theme.typography.fontWeight}
                    onChange={(e) => updateSubKey("typography", { fontWeight: e.target.value as any })}
                    className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                  >
                    <option value="normal">Regular (400)</option>
                    <option value="medium">Medium (500)</option>
                    <option value="semibold">Semibold (600)</option>
                    <option value="bold">Bold (700)</option>
                  </select>
                </div>
              </div>

              {/* Form Title & Description Colors */}
              <div className="pt-2.5 border-t border-[#F5F2EB] space-y-2">
                <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                  Text & Description Colors
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#78716C]">Title Color</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <input
                        type="color"
                        value={
                          theme.typography.headingColor?.startsWith("#")
                            ? theme.typography.headingColor
                            : (theme.colors.text?.startsWith("#") ? theme.colors.text : "#1C1917")
                        }
                        onChange={(e) =>
                          updateSubKey("typography", { headingColor: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.typography.headingColor || theme.colors.text || "#1C1917"}
                        onChange={(e) =>
                          updateSubKey("typography", { headingColor: e.target.value })
                        }
                        className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#78716C]">Description Color</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <input
                        type="color"
                        value={
                          theme.typography.descriptionColor?.startsWith("#")
                            ? theme.typography.descriptionColor
                            : (theme.colors.mutedText?.startsWith("#") ? theme.colors.mutedText : "#78716C")
                        }
                        onChange={(e) => {
                          updateMultiple({
                            typography: { descriptionColor: e.target.value },
                            colors: { mutedText: e.target.value },
                          });
                        }}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.typography.descriptionColor || theme.colors.mutedText || "#78716C"}
                        onChange={(e) => {
                          updateMultiple({
                            typography: { descriptionColor: e.target.value },
                            colors: { mutedText: e.target.value },
                          });
                        }}
                        className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Card Surface Section */}
        <div className="border border-[#EAE3D6] rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection("container")}
            className="w-full p-2.5 bg-[#FAF8F5] flex items-center justify-between font-semibold text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Layout className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Main Card Surface</span>
            </div>
            {activeSection === "container" ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#78716C]" />
            )}
          </button>

          {activeSection === "container" && (
            <div className="p-3 space-y-4 bg-white">
              {/* 1. Card Background */}
              <div className="space-y-2 pb-3 border-b border-[#F5F2EB]">
                <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                  Card Background
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                  {(["solid", "gradient", "image"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateSubKey("container", { backgroundType: t })}
                      className={`py-1 text-center font-semibold rounded-lg capitalize cursor-pointer transition-colors ${(theme.container.backgroundType || "solid") === t
                          ? "bg-[#FF5A36] text-white shadow-xs"
                          : "text-[#78716C] hover:text-[#1C1917]"
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {(theme.container.backgroundType || "solid") === "solid" && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#78716C]">Color</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={
                            theme.container.backgroundColor?.startsWith("#")
                              ? theme.container.backgroundColor
                              : "#FFFFFF"
                          }
                          onChange={(e) =>
                            updateSubKey("container", { backgroundColor: e.target.value })
                          }
                          className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.container.backgroundColor || "#FFFFFF"}
                          onChange={(e) =>
                            updateSubKey("container", { backgroundColor: e.target.value })
                          }
                          className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {theme.container.backgroundType === "gradient" && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-[#78716C]">From</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <input
                            type="color"
                            value={theme.container.gradientFrom || "#FFFFFF"}
                            onChange={(e) =>
                              updateSubKey("container", { gradientFrom: e.target.value })
                            }
                            className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.container.gradientFrom || "#FFFFFF"}
                            onChange={(e) =>
                              updateSubKey("container", { gradientFrom: e.target.value })
                            }
                            className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#78716C]">To</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <input
                            type="color"
                            value={theme.container.gradientTo || "#FAF8F5"}
                            onChange={(e) =>
                              updateSubKey("container", { gradientTo: e.target.value })
                            }
                            className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.container.gradientTo || "#FAF8F5"}
                            onChange={(e) =>
                              updateSubKey("container", { gradientTo: e.target.value })
                            }
                            className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-[#78716C]">Gradient Style</span>
                        <select
                          value={theme.container.gradientType || "linear"}
                          onChange={(e) =>
                            updateSubKey("container", { gradientType: e.target.value as any })
                          }
                          className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                        >
                          <option value="linear">Linear</option>
                          <option value="radial">Radial</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#78716C]">Direction</span>
                        <select
                          value={theme.container.gradientDirection || "135deg"}
                          onChange={(e) =>
                            updateSubKey("container", { gradientDirection: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                        >
                          <option value="135deg">135° Angle</option>
                          <option value="to bottom">To Bottom</option>
                          <option value="to right">To Right</option>
                          <option value="to top">To Top</option>
                          <option value="45deg">45° Diagonal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {theme.container.backgroundType === "image" && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <span className="text-[10px] text-[#78716C]">Image URL</span>
                      <input
                        type="text"
                        value={theme.container.imageUrl || ""}
                        onChange={(e) =>
                          updateSubKey("container", { imageUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full px-2.5 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="flex items-center justify-center gap-2 p-2.5 border border-dashed border-[#EAE3D6] hover:border-[#FF5A36] rounded-xl bg-[#FAF8F5] cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#FF5A36]" />
                        <span className="text-[11px] font-semibold text-[#1C1917]">
                          {theme.container.imageUrl ? "Change Card Image" : "Upload Card Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCardBgImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Background Image Blur Slider */}
                    <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-1.5">
                      <div className="flex justify-between items-center text-[#78716C]">
                        <span className="text-[10px] font-semibold text-[#1C1917]">Card Background Image Blur</span>
                        <span className="text-[11px] font-mono font-bold text-[#FF5A36] bg-white px-1.5 py-0.5 rounded border border-[#EAE3D6]">
                          {(theme.container.imageBlur ?? theme.container.bgBlur ?? 0)}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={theme.container.imageBlur ?? theme.container.bgBlur ?? 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateSubKey("container", { imageBlur: val, bgBlur: val });
                        }}
                        className="w-full accent-[#FF5A36] h-1.5 bg-[#EAE3D6] rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-[#A8A29E]">
                        <span>0px (Crisp)</span>
                        <span>12px</span>
                        <span>24px</span>
                        <span>40px (Heavy)</span>
                      </div>
                    </div>

                    {/* Position & Fit */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-[#78716C]">Position</span>
                        <select
                          value={theme.container.imagePosition || "center"}
                          onChange={(e) =>
                            updateSubKey("container", { imagePosition: e.target.value as any })
                          }
                          className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                        >
                          <option value="center">Center</option>
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#78716C]">Size Fit</span>
                        <select
                          value={theme.container.imageSize || "cover"}
                          onChange={(e) =>
                            updateSubKey("container", { imageSize: e.target.value as any })
                          }
                          className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                        >
                          <option value="cover">Cover (Fill)</option>
                          <option value="contain">Contain</option>
                          <option value="auto">Original</option>
                        </select>
                      </div>
                    </div>

                    {/* Overlay Tint & Opacity */}
                    <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[#1C1917]">Overlay Tint Color</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={theme.container.overlayColor || "#000000"}
                            onChange={(e) =>
                              updateSubKey("container", { overlayColor: e.target.value })
                            }
                            className="w-6 h-6 rounded-lg border border-[#EAE3D6] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.container.overlayColor || "#000000"}
                            onChange={(e) =>
                              updateSubKey("container", { overlayColor: e.target.value })
                            }
                            className="w-16 px-1.5 py-0.5 text-[10px] font-mono rounded-lg border border-[#EAE3D6] bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-[#78716C] mb-1">
                          <span className="text-[10px]">Overlay Tint Opacity</span>
                          <span className="text-[10px] font-mono font-semibold text-[#1C1917]">
                            {theme.container.overlayOpacity ?? 0}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={theme.container.overlayOpacity ?? 0}
                          onChange={(e) =>
                            updateSubKey("container", { overlayOpacity: Number(e.target.value) })
                          }
                          className="w-full accent-[#FF5A36] h-1.5 bg-[#EAE3D6] rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Clear Image Button if image exists */}
                    {theme.container.imageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          updateSubKey("container", {
                            imageUrl: "",
                            backgroundType: "solid",
                          })
                        }
                        className="w-full py-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                      >
                        Remove Card Image
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Card Borders */}
              <div className="space-y-2.5 pb-3 border-b border-[#F5F2EB]">
                <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                  Borders
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#78716C]">Border Style</span>
                    <select
                      value={theme.container.borderStyle || "solid"}
                      onChange={(e) =>
                        updateSubKey("container", { borderStyle: e.target.value as any })
                      }
                      className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#78716C]">Border Width</span>
                    <select
                      value={theme.container.borderWidth || "thin"}
                      onChange={(e) =>
                        updateSubKey("container", { borderWidth: e.target.value as any })
                      }
                      className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                    >
                      <option value="none">0px (None)</option>
                      <option value="thin">1px (Thin)</option>
                      <option value="medium">2px (Medium)</option>
                      <option value="thick">4px (Thick)</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {theme.container.borderWidth === "custom" && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#78716C]">Custom Width</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={theme.container.customBorderWidth ?? 1}
                        onChange={(e) =>
                          updateSubKey("container", {
                            customBorderWidth: Number(e.target.value),
                          })
                        }
                        className="w-16 px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                      <span className="text-[10px] text-[#78716C]">px</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#78716C]">Border Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.container.borderColor || "#EAE3D6"}
                      onChange={(e) =>
                        updateSubKey("container", { borderColor: e.target.value })
                      }
                      className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.container.borderColor || "#EAE3D6"}
                      onChange={(e) =>
                        updateSubKey("container", { borderColor: e.target.value })
                      }
                      className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                {/* Individual Border Sides Toggle */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-[#78716C]">Active Border Sides</span>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { key: "borderTop", label: "Top" },
                      { key: "borderRight", label: "Right" },
                      { key: "borderBottom", label: "Bottom" },
                      { key: "borderLeft", label: "Left" },
                    ].map((side) => {
                      const isActive = (theme.container as any)[side.key] !== false;
                      return (
                        <button
                          key={side.key}
                          type="button"
                          onClick={() =>
                            updateSubKey("container", {
                              [side.key]: !isActive,
                            })
                          }
                          className={`py-1 text-[11px] font-semibold rounded-lg border text-center transition-colors cursor-pointer ${isActive
                              ? "bg-[#FFF0EB] border-[#FF5A36] text-[#FF5A36]"
                              : "bg-[#FAF8F5] border-[#EAE3D6] text-[#A8A29E]"
                            }`}
                        >
                          {side.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Corner Radius */}
              <div className="space-y-3 pb-3 border-b border-[#F5F2EB]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                    Corner Radius
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateSubKey("container", {
                        individualRadius: !theme.container.individualRadius,
                      })
                    }
                    className="text-[10px] text-[#FF5A36] font-semibold hover:underline cursor-pointer"
                  >
                    {theme.container.individualRadius ? "Uniform Corners" : "Individual 4 Corners"}
                  </button>
                </div>

                {!theme.container.individualRadius ? (
                  <div className="space-y-2.5">
                    {/* Quick Preset Buttons */}
                    <div className="grid grid-cols-4 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                      {[
                        { id: "none", label: "0px (Square)" },
                        { id: "md", label: "8px" },
                        { id: "xl", label: "16px" },
                        { id: "2xl", label: "24px" },
                        { id: "3xl", label: "32px" },
                        { id: "custom", label: "Custom" },
                      ].map((preset) => {
                        const isSelected = theme.container.borderRadius === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() =>
                              updateSubKey("container", {
                                borderRadius: preset.id as any,
                                customBorderRadius: preset.id === "custom" ? (theme.container.customBorderRadius || 24) : undefined,
                              })
                            }
                            className={`py-1 px-1 text-center text-[10px] font-semibold rounded-lg transition-colors cursor-pointer truncate ${isSelected
                                ? "bg-[#FF5A36] text-white shadow-xs"
                                : "text-[#78716C] hover:text-[#1C1917] hover:bg-white"
                              }`}
                          >
                            <span>{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Interactive Real-Time Range Slider */}
                    <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-1.5">
                      <div className="flex justify-between items-center text-[#78716C]">
                        <span className="text-[10px] font-semibold text-[#1C1917]">Adjust Corner Radius</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="64"
                            value={
                              theme.container.borderRadius === "none"
                                ? 0
                                : theme.container.borderRadius === "sm"
                                  ? 4
                                  : theme.container.borderRadius === "md"
                                    ? 8
                                    : theme.container.borderRadius === "lg"
                                      ? 12
                                      : theme.container.borderRadius === "xl"
                                        ? 16
                                        : theme.container.borderRadius === "2xl"
                                          ? 24
                                          : theme.container.borderRadius === "3xl"
                                            ? 32
                                            : theme.container.borderRadius === "full"
                                              ? 9999
                                              : (theme.container.customBorderRadius ?? 24)
                            }
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateSubKey("container", {
                                borderRadius: "custom",
                                customBorderRadius: val,
                              });
                            }}
                            className="w-14 px-1.5 py-0.5 text-[11px] font-mono font-bold text-[#FF5A36] bg-white rounded border border-[#EAE3D6] text-center"
                          />
                          <span className="text-[10px] font-mono text-[#A8A29E]">px</span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="48"
                        step="1"
                        value={
                          theme.container.borderRadius === "none"
                            ? 0
                            : theme.container.borderRadius === "sm"
                              ? 4
                              : theme.container.borderRadius === "md"
                                ? 8
                                : theme.container.borderRadius === "lg"
                                  ? 12
                                  : theme.container.borderRadius === "xl"
                                    ? 16
                                    : theme.container.borderRadius === "2xl"
                                      ? 24
                                      : theme.container.borderRadius === "3xl"
                                        ? 32
                                        : theme.container.borderRadius === "full"
                                          ? 48
                                          : Math.min(theme.container.customBorderRadius ?? 24, 48)
                        }
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateSubKey("container", {
                            borderRadius: "custom",
                            customBorderRadius: val,
                          });
                        }}
                        className="w-full accent-[#FF5A36] h-1.5 bg-[#EAE3D6] rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-[#A8A29E]">
                        <span>0px (Sharp)</span>
                        <span>16px</span>
                        <span>24px</span>
                        <span>48px (Pill)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                    <span className="text-[10px] font-bold text-[#1C1917]">Individual Corner Radii</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-[#78716C]">Top-Left Radius</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="number"
                            min="0"
                            max="64"
                            value={theme.container.radiusTopLeft ?? 24}
                            onChange={(e) =>
                              updateSubKey("container", {
                                radiusTopLeft: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white font-mono"
                          />
                          <span className="text-[10px] text-[#78716C]">px</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#78716C]">Top-Right Radius</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="number"
                            min="0"
                            max="64"
                            value={theme.container.radiusTopRight ?? 24}
                            onChange={(e) =>
                              updateSubKey("container", {
                                radiusTopRight: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white font-mono"
                          />
                          <span className="text-[10px] text-[#78716C]">px</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#78716C]">Bottom-Left Radius</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="number"
                            min="0"
                            max="64"
                            value={theme.container.radiusBottomLeft ?? 24}
                            onChange={(e) =>
                              updateSubKey("container", {
                                radiusBottomLeft: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white font-mono"
                          />
                          <span className="text-[10px] text-[#78716C]">px</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#78716C]">Bottom-Right Radius</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="number"
                            min="0"
                            max="64"
                            value={theme.container.radiusBottomRight ?? 24}
                            onChange={(e) =>
                              updateSubKey("container", {
                                radiusBottomRight: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white font-mono"
                          />
                          <span className="text-[10px] text-[#78716C]">px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Shadow */}
              <div className="space-y-2.5 pb-3 border-b border-[#F5F2EB]">
                <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                  Card Shadow
                </label>
                <select
                  value={theme.container.boxShadow || "soft"}
                  onChange={(e) =>
                    updateSubKey("container", { boxShadow: e.target.value as any })
                  }
                  className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                >
                  <option value="none">None</option>
                  <option value="sm">Subtle (SM)</option>
                  <option value="md">Medium (MD)</option>
                  <option value="lg">Elevated (LG)</option>
                  <option value="xl">Extra Large (XL)</option>
                  <option value="2xl">2XL Deep</option>
                  <option value="soft">Soft Ambient</option>
                  <option value="glow">Neon Glow</option>
                  <option value="inner">Inner Shadow</option>
                  <option value="custom">Custom Shadow</option>
                </select>

                {theme.container.boxShadow === "custom" && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-[#78716C]">X Offset</span>
                        <input
                          type="number"
                          value={theme.container.customShadowX ?? 0}
                          onChange={(e) =>
                            updateSubKey("container", {
                              customShadowX: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#78716C]">Y Offset</span>
                        <input
                          type="number"
                          value={theme.container.customShadowY ?? 4}
                          onChange={(e) =>
                            updateSubKey("container", {
                              customShadowY: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-[#78716C]">Blur</span>
                        <input
                          type="number"
                          min="0"
                          value={theme.container.customShadowBlur ?? 20}
                          onChange={(e) =>
                            updateSubKey("container", {
                              customShadowBlur: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#78716C]">Spread</span>
                        <input
                          type="number"
                          value={theme.container.customShadowSpread ?? 0}
                          onChange={(e) =>
                            updateSubKey("container", {
                              customShadowSpread: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#78716C]">Inset Shadow</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSubKey("container", {
                            customShadowInset: !theme.container.customShadowInset,
                          })
                        }
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${theme.container.customShadowInset ? "bg-[#FF5A36]" : "bg-[#EAE3D6]"
                          }`}
                      >
                        <span
                          className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${theme.container.customShadowInset
                              ? "translate-x-4.5"
                              : "translate-x-0.5"
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Size & Max Width */}
              <div className="space-y-2.5 pb-3 border-b border-[#F5F2EB]">
                <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                  Card Size & Width
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#78716C]">Max Width</span>
                    <select
                      value={theme.container.maxWidth || "2xl"}
                      onChange={(e) =>
                        updateSubKey("container", { maxWidth: e.target.value as any })
                      }
                      className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                    >
                      <option value="sm">Compact (24rem)</option>
                      <option value="md">Medium (28rem)</option>
                      <option value="lg">Standard (32rem)</option>
                      <option value="xl">Wide (36rem)</option>
                      <option value="2xl">Spacious (42rem)</option>
                      <option value="full">Full Width (100%)</option>
                      <option value="custom">Custom px</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#78716C]">Min Height</span>
                    <select
                      value={theme.container.minHeight || "none"}
                      onChange={(e) =>
                        updateSubKey("container", {
                          minHeight: e.target.value === "none" ? "none" : Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                    >
                      <option value="none">Auto</option>
                      <option value="400">400px</option>
                      <option value="600">600px</option>
                      <option value="800">800px</option>
                    </select>
                  </div>
                </div>

                {theme.container.maxWidth === "custom" && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#78716C]">Custom Max Width</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="320"
                        max="1400"
                        value={theme.container.customMaxWidth ?? 672}
                        onChange={(e) =>
                          updateSubKey("container", {
                            customMaxWidth: Number(e.target.value),
                          })
                        }
                        className="w-20 px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                      <span className="text-[10px] text-[#78716C]">px</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Padding & Spacing */}
              <div className="space-y-2.5 pb-3 border-b border-[#F5F2EB]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                    Card Padding
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateSubKey("container", {
                        individualPadding: !theme.container.individualPadding,
                      })
                    }
                    className="text-[10px] text-[#FF5A36] font-semibold hover:underline cursor-pointer"
                  >
                    {theme.container.individualPadding ? "Uniform Padding" : "Individual Sides"}
                  </button>
                </div>

                {!theme.container.individualPadding ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <select
                        value={theme.container.padding || "lg"}
                        onChange={(e) =>
                          updateSubKey("container", { padding: e.target.value as any })
                        }
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                      >
                        <option value="sm">Compact (16px)</option>
                        <option value="md">Balanced (24px)</option>
                        <option value="lg">Comfortable (32px)</option>
                        <option value="xl">Roomy (48px)</option>
                        <option value="custom">Custom px</option>
                      </select>
                    </div>

                    {theme.container.padding === "custom" && (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="80"
                          value={theme.container.customPadding ?? 32}
                          onChange={(e) =>
                            updateSubKey("container", {
                              customPadding: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                        />
                        <span className="text-[10px] text-[#78716C]">px</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#78716C]">Top</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={theme.container.paddingTop ?? 32}
                        onChange={(e) =>
                          updateSubKey("container", {
                            paddingTop: Number(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C]">Right</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={theme.container.paddingRight ?? 32}
                        onChange={(e) =>
                          updateSubKey("container", {
                            paddingRight: Number(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C]">Bottom</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={theme.container.paddingBottom ?? 32}
                        onChange={(e) =>
                          updateSubKey("container", {
                            paddingBottom: Number(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C]">Left</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={theme.container.paddingLeft ?? 32}
                        onChange={(e) =>
                          updateSubKey("container", {
                            paddingLeft: Number(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Appearance & Effects */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                  Appearance & Effects
                </label>
                <div>
                  <div className="flex justify-between text-[#78716C] mb-1">
                    <span>Backdrop Blur (Glass Effect)</span>
                    <span>{theme.container.glassBlur || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={theme.container.glassBlur || 0}
                    onChange={(e) =>
                      updateSubKey("container", { glassBlur: Number(e.target.value) })
                    }
                    className="w-full accent-[#FF5A36]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#78716C] mb-1">
                    <span>Card Opacity</span>
                    <span>{theme.container.opacity ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={theme.container.opacity ?? 100}
                    onChange={(e) =>
                      updateSubKey("container", { opacity: Number(e.target.value) })
                    }
                    className="w-full accent-[#FF5A36]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Field / Question Card Surface Section */}
        <div className="border border-[#EAE3D6] rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection("fieldCard")}
            className="w-full p-2.5 bg-[#FAF8F5] flex items-center justify-between font-semibold text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BoxSelect className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Field / Question Cards</span>
            </div>
            {activeSection === "fieldCard" ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#78716C]" />
            )}
          </button>

          {activeSection === "fieldCard" && (
            <div className="p-3 space-y-4 bg-white">
              {/* Field Card Sub-navigation Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#F5F2EB] no-scrollbar">
                {[
                  { id: "presets", label: "Presets" },
                  { id: "background", label: "Background" },
                  { id: "borders", label: "Borders" },
                  { id: "radius", label: "Radius" },
                  { id: "shadow", label: "Shadow" },
                  { id: "spacing", label: "Spacing" },
                  { id: "hover", label: "Hover" },
                  { id: "selected", label: "Selected" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFieldCardSubTab(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex-shrink-0 cursor-pointer ${activeFieldCardSubTab === tab.id
                        ? "bg-[#FF5A36] text-white shadow-xs"
                        : "text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1C1917]"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 1. Presets Tab */}
              {activeFieldCardSubTab === "presets" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                      Card Appearance Presets
                    </span>
                    <span className="text-[10px] text-[#78716C] font-mono">
                      Current: {theme.fieldCard.preset || "default"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {FIELD_CARD_STYLE_PRESETS.map((preset) => {
                      const isSelected = theme.fieldCard.preset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            updateSubKey("fieldCard", {
                              ...preset.style,
                              preset: preset.id,
                            });
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${isSelected
                              ? "border-[#FF5A36] bg-[#FFF0EB]/40 ring-2 ring-[#FF5A36]/20 shadow-xs"
                              : "border-[#EAE3D6] bg-[#FAF8F5] hover:border-[#D9CFBE] hover:bg-white"
                            }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-xs text-[#1C1917]">
                                {preset.name}
                              </span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#FF5A36]" />
                              )}
                            </div>
                            <p className="text-[10px] text-[#78716C] line-clamp-2 leading-relaxed">
                              {preset.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Background Tab */}
              {activeFieldCardSubTab === "background" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider mb-2">
                      Background Type
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                      {(["solid", "glass", "gradient", "image", "transparent"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            if (type === "glass") {
                              updateSubKey("fieldCard", {
                                backgroundType: "glass",
                                glassEnabled: true,
                              });
                            } else {
                              updateSubKey("fieldCard", {
                                backgroundType: type,
                                glassEnabled: false,
                              });
                            }
                          }}
                          className={`py-1 text-center font-semibold rounded-lg text-xs capitalize transition-all cursor-pointer ${(theme.fieldCard.backgroundType === type) ||
                              (type === "glass" && theme.fieldCard.glassEnabled)
                              ? "bg-white text-[#1C1917] shadow-2xs font-bold"
                              : "text-[#78716C] hover:text-[#1C1917]"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Solid / Color Settings */}
                  {theme.fieldCard.backgroundType === "solid" && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#1C1917] font-medium text-xs">Background Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={theme.fieldCard.backgroundColor}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { backgroundColor: e.target.value })
                            }
                            className="w-20 px-2 py-1 text-xs font-mono rounded-lg border border-[#EAE3D6] uppercase"
                          />
                          <input
                            type="color"
                            value={theme.fieldCard.backgroundColor}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { backgroundColor: e.target.value })
                            }
                            className="w-7 h-7 rounded-lg border border-black/10 cursor-pointer p-0.5"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-[#78716C]">
                          <span>Background Opacity</span>
                          <span>{theme.fieldCard.backgroundOpacity ?? 100}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={theme.fieldCard.backgroundOpacity ?? 100}
                          onChange={(e) =>
                            updateSubKey("fieldCard", {
                              backgroundOpacity: Number(e.target.value),
                            })
                          }
                          className="w-full accent-[#FF5A36]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Glassmorphism Controls */}
                  {(theme.fieldCard.backgroundType === "glass" || theme.fieldCard.glassEnabled) && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-[#1C1917]">
                          <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                          <span>Frosted Glass Effect</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateSubKey("fieldCard", {
                              glassEnabled: !theme.fieldCard.glassEnabled,
                              backgroundType: !theme.fieldCard.glassEnabled ? "glass" : "solid",
                            })
                          }
                          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${theme.fieldCard.glassEnabled !== false ? "bg-[#FF5A36]" : "bg-[#D9CFBE]"
                            }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${theme.fieldCard.glassEnabled !== false ? "translate-x-4.5" : "translate-x-0.5"
                              }`}
                          />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-[#78716C]">
                          <span>Backdrop Blur</span>
                          <span>{theme.fieldCard.glassBlur ?? 12}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={theme.fieldCard.glassBlur ?? 12}
                          onChange={(e) =>
                            updateSubKey("fieldCard", { glassBlur: Number(e.target.value) })
                          }
                          className="w-full accent-[#FF5A36]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-[#78716C]">
                          <span>Glass Transparency</span>
                          <span>{theme.fieldCard.glassOpacity ?? 70}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={theme.fieldCard.glassOpacity ?? 70}
                          onChange={(e) =>
                            updateSubKey("fieldCard", { glassOpacity: Number(e.target.value) })
                          }
                          className="w-full accent-[#FF5A36]"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[#1C1917] font-medium">Highlight Shine</span>
                        <input
                          type="checkbox"
                          checked={theme.fieldCard.glassHighlight ?? false}
                          onChange={(e) =>
                            updateSubKey("fieldCard", { glassHighlight: e.target.checked })
                          }
                          className="w-4 h-4 accent-[#FF5A36] rounded"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gradient Controls */}
                  {theme.fieldCard.backgroundType === "gradient" && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#78716C] mb-1 font-semibold">
                            Type
                          </label>
                          <select
                            value={theme.fieldCard.gradientType || "linear"}
                            onChange={(e) =>
                              updateSubKey("fieldCard", {
                                gradientType: e.target.value as any,
                              })
                            }
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          >
                            <option value="linear">Linear</option>
                            <option value="radial">Radial</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#78716C] mb-1 font-semibold">
                            Direction
                          </label>
                          <select
                            value={theme.fieldCard.gradientDirection || "135deg"}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { gradientDirection: e.target.value })
                            }
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          >
                            <option value="135deg">Diagonal (135°)</option>
                            <option value="to bottom">Vertical ↓</option>
                            <option value="to right">Horizontal →</option>
                            <option value="to top right">Top Right ↗</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-[#EAE3D6]">
                          <span className="text-[10px] text-[#78716C]">From</span>
                          <input
                            type="color"
                            value={theme.fieldCard.gradientFrom || "#FAF8F5"}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { gradientFrom: e.target.value })
                            }
                            className="w-5 h-5 rounded cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-[#EAE3D6]">
                          <span className="text-[10px] text-[#78716C]">To</span>
                          <input
                            type="color"
                            value={theme.fieldCard.gradientTo || "#FFFFFF"}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { gradientTo: e.target.value })
                            }
                            className="w-5 h-5 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Background */}
                  {theme.fieldCard.backgroundType === "image" && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-3">
                      <div>
                        <label className="block text-[10px] text-[#78716C] mb-1 font-semibold">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={theme.fieldCard.imageUrl || ""}
                          placeholder="https://..."
                          onChange={(e) =>
                            updateSubKey("fieldCard", { imageUrl: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#EAE3D6] bg-white mb-2"
                        />
                        <label className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-white border border-[#EAE3D6] hover:bg-[#FAF8F5] rounded-lg text-xs font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#FF5A36]" />
                          <span>Upload Card Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFieldCardBgImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#78716C] mb-1 font-semibold">
                            Size
                          </label>
                          <select
                            value={theme.fieldCard.imageSize || "cover"}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { imageSize: e.target.value as any })
                            }
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          >
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="auto">Auto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#78716C] mb-1 font-semibold">
                            Repeat
                          </label>
                          <select
                            value={theme.fieldCard.imageRepeat || "no-repeat"}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { imageRepeat: e.target.value as any })
                            }
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          >
                            <option value="no-repeat">No Repeat</option>
                            <option value="repeat">Repeat</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Borders Tab */}
              {activeFieldCardSubTab === "borders" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1917] font-medium text-xs">Enable Card Border</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSubKey("fieldCard", {
                          borderEnabled: theme.fieldCard.borderEnabled === false,
                        })
                      }
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${theme.fieldCard.borderEnabled !== false ? "bg-[#FF5A36]" : "bg-[#D9CFBE]"
                        }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${theme.fieldCard.borderEnabled !== false ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                      />
                    </button>
                  </div>

                  {theme.fieldCard.borderEnabled !== false && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#1C1917] font-medium text-xs">Border Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={theme.fieldCard.borderColor}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { borderColor: e.target.value })
                            }
                            className="w-20 px-2 py-1 text-xs font-mono rounded-lg border border-[#EAE3D6] uppercase"
                          />
                          <input
                            type="color"
                            value={theme.fieldCard.borderColor}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { borderColor: e.target.value })
                            }
                            className="w-7 h-7 rounded-lg border border-black/10 cursor-pointer p-0.5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider mb-1.5">
                          Border Width
                        </label>
                        <div className="grid grid-cols-5 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                          {(["none", "thin", "medium", "thick", "custom"] as const).map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => updateSubKey("fieldCard", { borderWidth: w })}
                              className={`py-1 text-center font-semibold rounded-lg text-xs capitalize transition-all cursor-pointer ${theme.fieldCard.borderWidth === w
                                  ? "bg-white text-[#1C1917] shadow-2xs font-bold"
                                  : "text-[#78716C] hover:text-[#1C1917]"
                                }`}
                            >
                              {w === "thin" ? "1px" : w === "medium" ? "2px" : w === "thick" ? "4px" : w}
                            </button>
                          ))}
                        </div>

                        {theme.fieldCard.borderWidth === "custom" && (
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-[#78716C]">Custom Width</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={theme.fieldCard.customBorderWidth ?? 1}
                                onChange={(e) =>
                                  updateSubKey("fieldCard", {
                                    customBorderWidth: Number(e.target.value),
                                  })
                                }
                                className="w-16 px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                              />
                              <span className="text-xs text-[#78716C]">px</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider mb-1.5">
                          Border Style
                        </label>
                        <select
                          value={theme.fieldCard.borderStyle || "solid"}
                          onChange={(e) =>
                            updateSubKey("fieldCard", { borderStyle: e.target.value as any })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#EAE3D6] bg-white capitalize"
                        >
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                          <option value="double">Double</option>
                        </select>
                      </div>

                      {/* Individual Border Sides */}
                      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#1C1917]">
                            Individual Border Sides
                          </span>
                          <input
                            type="checkbox"
                            checked={theme.fieldCard.individualBorders ?? false}
                            onChange={(e) =>
                              updateSubKey("fieldCard", { individualBorders: e.target.checked })
                            }
                            className="w-4 h-4 accent-[#FF5A36] rounded"
                          />
                        </div>

                        {theme.fieldCard.individualBorders && (
                          <div className="grid grid-cols-4 gap-1.5 pt-1">
                            {[
                              { key: "borderTop", label: "Top" },
                              { key: "borderRight", label: "Right" },
                              { key: "borderBottom", label: "Bottom" },
                              { key: "borderLeft", label: "Left" },
                            ].map((side) => (
                              <button
                                key={side.key}
                                type="button"
                                onClick={() =>
                                  updateSubKey("fieldCard", {
                                    [side.key]: (theme.fieldCard as any)[side.key] === false,
                                  })
                                }
                                className={`py-1 text-center font-semibold rounded-lg text-xs transition-colors cursor-pointer border ${(theme.fieldCard as any)[side.key] !== false
                                    ? "bg-white text-[#1C1917] border-[#FF5A36]"
                                    : "bg-[#F5F2EB] text-[#A8A29E] border-transparent"
                                  }`}
                              >
                                {side.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Radius Tab */}
              {activeFieldCardSubTab === "radius" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider mb-2">
                      Corner Radius
                    </label>
                    <div className="grid grid-cols-4 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                      {(["none", "sm", "md", "lg", "xl", "2xl", "3xl", "full", "custom"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => updateSubKey("fieldCard", { borderRadius: r })}
                          className={`py-1 text-center font-semibold rounded-lg text-xs capitalize transition-all cursor-pointer ${theme.fieldCard.borderRadius === r
                              ? "bg-white text-[#1C1917] shadow-2xs font-bold"
                              : "text-[#78716C] hover:text-[#1C1917]"
                            }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    {theme.fieldCard.borderRadius === "custom" && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-[#78716C]">Radius (px)</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={theme.fieldCard.customBorderRadius ?? 16}
                            onChange={(e) =>
                              updateSubKey("fieldCard", {
                                customBorderRadius: Number(e.target.value),
                              })
                            }
                            className="w-16 px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                          <span className="text-xs text-[#78716C]">px</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Individual Corners */}
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#1C1917]">
                        Individual Corners
                      </span>
                      <input
                        type="checkbox"
                        checked={theme.fieldCard.individualRadius ?? false}
                        onChange={(e) =>
                          updateSubKey("fieldCard", { individualRadius: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#FF5A36] rounded"
                      />
                    </div>

                    {theme.fieldCard.individualRadius && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {[
                          { key: "radiusTopLeft", label: "Top Left" },
                          { key: "radiusTopRight", label: "Top Right" },
                          { key: "radiusBottomRight", label: "Bottom Right" },
                          { key: "radiusBottomLeft", label: "Bottom Left" },
                        ].map((corner) => (
                          <div key={corner.key} className="space-y-1">
                            <div className="flex justify-between text-[10px] text-[#78716C]">
                              <span>{corner.label}</span>
                              <span>{(theme.fieldCard as any)[corner.key] ?? 16}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="48"
                              value={(theme.fieldCard as any)[corner.key] ?? 16}
                              onChange={(e) =>
                                updateSubKey("fieldCard", {
                                  [corner.key]: Number(e.target.value),
                                })
                              }
                              className="w-full accent-[#FF5A36]"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Shadow Tab */}
              {activeFieldCardSubTab === "shadow" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1917] font-medium text-xs">Enable Card Shadow</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSubKey("fieldCard", {
                          shadowEnabled: theme.fieldCard.shadowEnabled === false,
                        })
                      }
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${theme.fieldCard.shadowEnabled !== false ? "bg-[#FF5A36]" : "bg-[#D9CFBE]"
                        }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${theme.fieldCard.shadowEnabled !== false ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                      />
                    </button>
                  </div>

                  {theme.fieldCard.shadowEnabled !== false && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider mb-1.5">
                          Shadow Preset
                        </label>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                          {(["none", "sm", "md", "lg", "soft", "glow", "neumorphism", "inner", "custom"] as const).map(
                            (s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => updateSubKey("fieldCard", { shadow: s })}
                                className={`py-1 text-center font-semibold rounded-lg text-xs capitalize transition-all cursor-pointer ${theme.fieldCard.shadow === s
                                    ? "bg-white text-[#1C1917] shadow-2xs font-bold"
                                    : "text-[#78716C] hover:text-[#1C1917]"
                                  }`}
                              >
                                {s}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Custom Shadow Fine-tuning */}
                      {theme.fieldCard.shadow === "custom" && (
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-2.5">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <span className="text-[10px] text-[#78716C]">Offset X (px)</span>
                              <input
                                type="number"
                                value={theme.fieldCard.customShadowX ?? 0}
                                onChange={(e) =>
                                  updateSubKey("fieldCard", {
                                    customShadowX: Number(e.target.value),
                                  })
                                }
                                className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-[#78716C]">Offset Y (px)</span>
                              <input
                                type="number"
                                value={theme.fieldCard.customShadowY ?? 2}
                                onChange={(e) =>
                                  updateSubKey("fieldCard", {
                                    customShadowY: Number(e.target.value),
                                  })
                                }
                                className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <span className="text-[10px] text-[#78716C]">Blur (px)</span>
                              <input
                                type="number"
                                min="0"
                                value={theme.fieldCard.customShadowBlur ?? 8}
                                onChange={(e) =>
                                  updateSubKey("fieldCard", {
                                    customShadowBlur: Number(e.target.value),
                                  })
                                }
                                className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-[#78716C]">Spread (px)</span>
                              <input
                                type="number"
                                value={theme.fieldCard.customShadowSpread ?? 0}
                                onChange={(e) =>
                                  updateSubKey("fieldCard", {
                                    customShadowSpread: Number(e.target.value),
                                  })
                                }
                                className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-[#78716C]">Shadow Inset</span>
                            <input
                              type="checkbox"
                              checked={theme.fieldCard.customShadowInset ?? false}
                              onChange={(e) =>
                                updateSubKey("fieldCard", {
                                  customShadowInset: e.target.checked,
                                })
                              }
                              className="w-4 h-4 accent-[#FF5A36] rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 6. Spacing & Padding Tab */}
              {activeFieldCardSubTab === "spacing" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider mb-2">
                      Card Padding
                    </label>
                    <div className="grid grid-cols-4 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                      {(["compact", "normal", "spacious", "custom"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateSubKey("fieldCard", { padding: p })}
                          className={`py-1 text-center font-semibold rounded-lg text-xs capitalize transition-all cursor-pointer ${theme.fieldCard.padding === p
                              ? "bg-white text-[#1C1917] shadow-2xs font-bold"
                              : "text-[#78716C] hover:text-[#1C1917]"
                            }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    {theme.fieldCard.padding === "custom" && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-[#78716C]">Padding (px)</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={theme.fieldCard.customPadding ?? 20}
                            onChange={(e) =>
                              updateSubKey("fieldCard", {
                                customPadding: Number(e.target.value),
                              })
                            }
                            className="w-16 px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                          <span className="text-xs text-[#78716C]">px</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Header-to-content spacing */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-[#78716C]">
                      <span>Header to Input Spacing</span>
                      <span>{theme.fieldCard.headerContentSpacing ?? 12}px</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="32"
                      value={theme.fieldCard.headerContentSpacing ?? 12}
                      onChange={(e) =>
                        updateSubKey("fieldCard", {
                          headerContentSpacing: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#FF5A36]"
                    />
                  </div>

                  {/* Description Spacing */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#78716C]">
                      <span>Description Spacing</span>
                      <span>{theme.fieldCard.descriptionSpacing ?? 6}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={theme.fieldCard.descriptionSpacing ?? 6}
                      onChange={(e) =>
                        updateSubKey("fieldCard", {
                          descriptionSpacing: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#FF5A36]"
                    />
                  </div>
                </div>
              )}

              {/* 7. Hover State Tab */}
              {activeFieldCardSubTab === "hover" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1917] font-medium text-xs">Hover Background</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.fieldCard.hoverBackgroundColor || "#FFFFFF"}
                        onChange={(e) =>
                          updateSubKey("fieldCard", { hoverBackgroundColor: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg border border-black/10 cursor-pointer p-0.5"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1917] font-medium text-xs">Hover Border Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.fieldCard.hoverBorderColor || "#D9CFBE"}
                        onChange={(e) =>
                          updateSubKey("fieldCard", { hoverBorderColor: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg border border-black/10 cursor-pointer p-0.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider mb-1.5">
                      Hover Shadow
                    </label>
                    <select
                      value={theme.fieldCard.hoverShadow || "none"}
                      onChange={(e) =>
                        updateSubKey("fieldCard", { hoverShadow: e.target.value as any })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#EAE3D6] bg-white capitalize"
                    >
                      <option value="none">None</option>
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                      <option value="soft">Soft</option>
                      <option value="glow">Glow</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#78716C]">
                      <span>Transition Duration</span>
                      <span>{theme.fieldCard.transitionDuration ?? 200}ms</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="50"
                      value={theme.fieldCard.transitionDuration ?? 200}
                      onChange={(e) =>
                        updateSubKey("fieldCard", {
                          transitionDuration: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#FF5A36]"
                    />
                  </div>
                </div>
              )}

              {/* 8. Selected State Tab */}
              {activeFieldCardSubTab === "selected" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1917] font-medium text-xs">Selected Background</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.fieldCard.selectedBackgroundColor || "#FFFFFF"}
                        onChange={(e) =>
                          updateSubKey("fieldCard", {
                            selectedBackgroundColor: e.target.value,
                          })
                        }
                        className="w-7 h-7 rounded-lg border border-black/10 cursor-pointer p-0.5"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#1C1917]">
                        Active Selection Ring
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSubKey("fieldCard", {
                            selectedRingEnabled: theme.fieldCard.selectedRingEnabled === false,
                          })
                        }
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${theme.fieldCard.selectedRingEnabled !== false
                            ? "bg-[#FF5A36]"
                            : "bg-[#D9CFBE]"
                          }`}
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${theme.fieldCard.selectedRingEnabled !== false
                              ? "translate-x-4.5"
                              : "translate-x-0.5"
                            }`}
                        />
                      </button>
                    </div>

                    {theme.fieldCard.selectedRingEnabled !== false && (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#78716C]">Ring Color</span>
                          <input
                            type="color"
                            value={theme.fieldCard.selectedRingColor || "#FF5A36"}
                            onChange={(e) =>
                              updateSubKey("fieldCard", {
                                selectedRingColor: e.target.value,
                              })
                            }
                            className="w-6 h-6 rounded cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-[#78716C]">
                            <span>Ring Width</span>
                            <span>{theme.fieldCard.selectedRingWidth ?? 2}px</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="6"
                            value={theme.fieldCard.selectedRingWidth ?? 2}
                            onChange={(e) =>
                              updateSubKey("fieldCard", {
                                selectedRingWidth: Number(e.target.value),
                              })
                            }
                            className="w-full accent-[#FF5A36]"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-[#78716C]">
                            <span>Ring Opacity</span>
                            <span>{theme.fieldCard.selectedRingOpacity ?? 100}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={theme.fieldCard.selectedRingOpacity ?? 100}
                            onChange={(e) =>
                              updateSubKey("fieldCard", {
                                selectedRingOpacity: Number(e.target.value),
                              })
                            }
                            className="w-full accent-[#FF5A36]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider mb-1.5">
                      Selected Card Shadow
                    </label>
                    <select
                      value={theme.fieldCard.selectedShadow || "md"}
                      onChange={(e) =>
                        updateSubKey("fieldCard", { selectedShadow: e.target.value as any })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#EAE3D6] bg-white capitalize"
                    >
                      <option value="none">None</option>
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                      <option value="soft">Soft</option>
                      <option value="glow">Glow</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Fields Styling Section */}
        <div className="border border-[#EAE3D6] rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection("inputs")}
            className="w-full p-2.5 bg-[#FAF8F5] flex items-center justify-between font-semibold text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Input Fields & Form Controls</span>
            </div>
            {activeSection === "inputs" ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#78716C]" />
            )}
          </button>

          {activeSection === "inputs" && (
            <div className="p-3 space-y-3.5 bg-white">
              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1.5 border-b border-[#F5F2EB] scrollbar-none">
                {[
                  { id: "presets", label: "Presets" },
                  { id: "background", label: "Background" },
                  { id: "borders", label: "Borders" },
                  { id: "radius", label: "Radius" },
                  { id: "shadow", label: "Shadow" },
                  { id: "typography", label: "Typography" },
                  { id: "labels", label: "Labels" },
                  { id: "states", label: "States" },
                  { id: "sizing", label: "Sizing" },
                  { id: "controls", label: "Controls" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setActiveInputSubTab(st.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${activeInputSubTab === st.id
                        ? "bg-[#FF5A36] text-white shadow-xs"
                        : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]"
                      }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* 1. INPUT PRESETS */}
              {activeInputSubTab === "presets" && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    {INPUT_STYLE_PRESETS.map((preset) => {
                      const isSelected = theme.inputs.preset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            updateSubKey("inputs", {
                              ...preset.inputs,
                              preset: preset.id,
                            });
                          }}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${isSelected
                              ? "border-[#FF5A36] bg-[#FFF0EB] ring-1 ring-[#FF5A36]"
                              : "border-[#EAE3D6] bg-[#FAF8F5] hover:border-[#D6CEC0]"
                            }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-[11px] font-bold text-[#1C1917]">
                              {preset.name}
                            </span>
                            {isSelected && (
                              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5A36] text-white flex items-center justify-center">
                                <Check className="w-2 h-2 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-[#78716C] line-clamp-2 leading-relaxed">
                            {preset.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. BACKGROUND & GLASS EFFECT */}
              {activeInputSubTab === "background" && (
                <div className="space-y-3">
                  {/* Background Type Switcher */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#78716C]">
                      Background Type
                    </label>
                    <div className="grid grid-cols-4 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6]">
                      {(["solid", "glass", "transparent", "gradient"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => updateSubKey("inputs", { backgroundType: t, glassEnabled: t === "glass" })}
                          className={`py-1 text-center font-semibold rounded-lg capitalize text-[10px] cursor-pointer transition-colors ${(theme.inputs.backgroundType || "solid") === t
                              ? "bg-[#FF5A36] text-white shadow-xs"
                              : "text-[#78716C] hover:text-[#1C1917]"
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Solid Color Controls */}
                  {theme.inputs.backgroundType !== "transparent" && theme.inputs.backgroundType !== "gradient" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-700">Background Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={theme.inputs.backgroundColor.startsWith("#") ? theme.inputs.backgroundColor : "#FAF8F5"}
                            onChange={(e) => updateSubKey("inputs", { backgroundColor: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.inputs.backgroundColor}
                            onChange={(e) => updateSubKey("inputs", { backgroundColor: e.target.value })}
                            className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                          />
                        </div>
                      </div>

                      {/* Opacity Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#78716C]">Background Opacity</span>
                          <span className="font-mono text-[#1C1917]">{theme.inputs.backgroundOpacity ?? 100}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={theme.inputs.backgroundOpacity ?? 100}
                          onChange={(e) => updateSubKey("inputs", { backgroundOpacity: Number(e.target.value) })}
                          className="w-full accent-[#FF5A36]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Glassmorphism Controls */}
                  {(theme.inputs.backgroundType === "glass" || theme.inputs.glassEnabled) && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#1C1917] flex items-center gap-1.5">
                          <Sparkle className="w-3 h-3 text-[#FF5A36]" />
                          Glassmorphism Settings
                        </span>
                        <button
                          type="button"
                          onClick={() => updateSubKey("inputs", { glassHighlight: !theme.inputs.glassHighlight })}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border cursor-pointer ${theme.inputs.glassHighlight
                              ? "bg-[#FFF0EB] text-[#FF5A36] border-[#FF5A36]"
                              : "bg-white text-[#78716C] border-[#EAE3D6]"
                            }`}
                        >
                          Highlight: {theme.inputs.glassHighlight ? "ON" : "OFF"}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#78716C]">Backdrop Blur</span>
                          <span className="font-mono text-[#1C1917]">{theme.inputs.glassBlur ?? 14}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={theme.inputs.glassBlur ?? 14}
                          onChange={(e) => updateSubKey("inputs", { glassBlur: Number(e.target.value) })}
                          className="w-full accent-[#FF5A36]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#78716C]">Glass Opacity</span>
                          <span className="font-mono text-[#1C1917]">{theme.inputs.glassOpacity ?? 65}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={theme.inputs.glassOpacity ?? 65}
                          onChange={(e) => updateSubKey("inputs", { glassOpacity: Number(e.target.value) })}
                          className="w-full accent-[#FF5A36]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gradient Controls */}
                  {theme.inputs.backgroundType === "gradient" && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#78716C] mb-1">Gradient Type</label>
                          <select
                            value={theme.inputs.gradientType || "linear"}
                            onChange={(e) => updateSubKey("inputs", { gradientType: e.target.value as any })}
                            className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-white"
                          >
                            <option value="linear">Linear</option>
                            <option value="radial">Radial</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#78716C] mb-1">Direction</label>
                          <select
                            value={theme.inputs.gradientDirection || "135deg"}
                            onChange={(e) => updateSubKey("inputs", { gradientDirection: e.target.value })}
                            className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-white"
                          >
                            <option value="135deg">Diagonal (135°)</option>
                            <option value="to bottom">To Bottom</option>
                            <option value="to right">To Right</option>
                            <option value="to top right">To Top Right</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#EAE3D6]">
                          <span className="text-[10px] text-[#78716C]">From</span>
                          <input
                            type="color"
                            value={theme.inputs.gradientFrom || "#FAF8F5"}
                            onChange={(e) => updateSubKey("inputs", { gradientFrom: e.target.value })}
                            className="w-6 h-6 rounded border border-black/10 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#EAE3D6]">
                          <span className="text-[10px] text-[#78716C]">To</span>
                          <input
                            type="color"
                            value={theme.inputs.gradientTo || "#FFF0EB"}
                            onChange={(e) => updateSubKey("inputs", { gradientTo: e.target.value })}
                            className="w-6 h-6 rounded border border-black/10 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. BORDERS & RADIUS */}
              {activeInputSubTab === "borders" && (
                <div className="space-y-3">
                  {/* Border Toggle & Style */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1C1917]">Enable Border</span>
                    <button
                      type="button"
                      onClick={() => updateSubKey("inputs", { borderEnabled: theme.inputs.borderEnabled === false ? true : false })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${theme.inputs.borderEnabled !== false ? "bg-[#FF5A36]" : "bg-[#EAE3D6]"
                        }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${theme.inputs.borderEnabled !== false ? "translate-x-4.5" : "translate-x-1"
                          }`}
                      />
                    </button>
                  </div>

                  {theme.inputs.borderEnabled !== false && (
                    <>
                      {/* Border Color */}
                      <div className="flex items-center justify-between">
                        <span className="text-stone-700">Border Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={theme.inputs.borderColor.startsWith("#") ? theme.inputs.borderColor : "#EAE3D6"}
                            onChange={(e) => updateSubKey("inputs", { borderColor: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.inputs.borderColor}
                            onChange={(e) => updateSubKey("inputs", { borderColor: e.target.value })}
                            className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                          />
                        </div>
                      </div>

                      {/* Border Style & Width */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#78716C] mb-1">Border Style</label>
                          <select
                            value={theme.inputs.borderStyle || "solid"}
                            onChange={(e) => updateSubKey("inputs", { borderStyle: e.target.value as any })}
                            className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                          >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                            <option value="double">Double</option>
                            <option value="none">None</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#78716C] mb-1">Border Width</label>
                          <select
                            value={theme.inputs.borderWidth || "thin"}
                            onChange={(e) => updateSubKey("inputs", { borderWidth: e.target.value as any })}
                            className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                          >
                            <option value="none">None (0px)</option>
                            <option value="thin">Thin (1px)</option>
                            <option value="medium">Medium (2px)</option>
                            <option value="thick">Thick (4px)</option>
                            <option value="custom">Custom (px)</option>
                          </select>
                        </div>
                      </div>

                      {theme.inputs.borderWidth === "custom" && (
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#78716C]">Custom Width</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="12"
                              value={theme.inputs.customBorderWidth ?? 1}
                              onChange={(e) => updateSubKey("inputs", { customBorderWidth: Number(e.target.value) })}
                              className="w-16 px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                            />
                            <span className="text-xs text-[#78716C]">px</span>
                          </div>
                        </div>
                      )}

                      {/* Underline only toggle */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]">
                        <span className="text-[11px] text-stone-700 font-medium">Bottom Border Only (Underline)</span>
                        <button
                          type="button"
                          onClick={() => updateSubKey("inputs", { bottomBorderOnly: !theme.inputs.bottomBorderOnly })}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border cursor-pointer ${theme.inputs.bottomBorderOnly
                              ? "bg-[#FFF0EB] text-[#FF5A36] border-[#FF5A36]"
                              : "bg-white text-[#78716C] border-[#EAE3D6]"
                            }`}
                        >
                          {theme.inputs.bottomBorderOnly ? "Active" : "Standard"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 4. RADIUS */}
              {activeInputSubTab === "radius" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#78716C]">
                      Corner Radius Preset
                    </label>
                    <select
                      value={theme.inputs.borderRadius || "xl"}
                      onChange={(e) => updateSubKey("inputs", { borderRadius: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                    >
                      <option value="none">Square (0px)</option>
                      <option value="sm">Small (6px)</option>
                      <option value="md">Medium (8px)</option>
                      <option value="lg">Large (12px)</option>
                      <option value="xl">Rounded (16px)</option>
                      <option value="2xl">Extra Rounded (24px)</option>
                      <option value="full">Pill / Full</option>
                      <option value="custom">Custom (px)</option>
                    </select>
                  </div>

                  {theme.inputs.borderRadius === "custom" && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#78716C]">Custom Corner Radius</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={theme.inputs.customBorderRadius ?? 12}
                          onChange={(e) => updateSubKey("inputs", { customBorderRadius: Number(e.target.value) })}
                          className="w-16 px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                        />
                        <span className="text-xs text-[#78716C]">px</span>
                      </div>
                    </div>
                  )}

                  {/* Individual Corner Radii */}
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#1C1917]">Individual Corner Radii</span>
                      <button
                        type="button"
                        onClick={() => updateSubKey("inputs", { individualRadius: !theme.inputs.individualRadius })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border cursor-pointer ${theme.inputs.individualRadius
                            ? "bg-[#FFF0EB] text-[#FF5A36] border-[#FF5A36]"
                            : "bg-white text-[#78716C] border-[#EAE3D6]"
                          }`}
                      >
                        {theme.inputs.individualRadius ? "ON" : "OFF"}
                      </button>
                    </div>

                    {theme.inputs.individualRadius && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[10px] text-[#78716C]">Top Left</label>
                          <input
                            type="number"
                            value={theme.inputs.radiusTopLeft ?? 12}
                            onChange={(e) => updateSubKey("inputs", { radiusTopLeft: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#78716C]">Top Right</label>
                          <input
                            type="number"
                            value={theme.inputs.radiusTopRight ?? 12}
                            onChange={(e) => updateSubKey("inputs", { radiusTopRight: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#78716C]">Bottom Left</label>
                          <input
                            type="number"
                            value={theme.inputs.radiusBottomLeft ?? 12}
                            onChange={(e) => updateSubKey("inputs", { radiusBottomLeft: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#78716C]">Bottom Right</label>
                          <input
                            type="number"
                            value={theme.inputs.radiusBottomRight ?? 12}
                            onChange={(e) => updateSubKey("inputs", { radiusBottomRight: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. SHADOW & ELEVATION */}
              {activeInputSubTab === "shadow" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#78716C]">
                      Shadow Preset
                    </label>
                    <select
                      value={theme.inputs.shadow || "none"}
                      onChange={(e) => updateSubKey("inputs", { shadow: e.target.value as any, shadowEnabled: e.target.value !== "none" })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                    >
                      <option value="none">None</option>
                      <option value="sm">Subtle (sm)</option>
                      <option value="md">Medium (md)</option>
                      <option value="lg">Large (lg)</option>
                      <option value="soft">Soft Ambient</option>
                      <option value="glow">Glow Ring</option>
                      <option value="inner">Inner Shadow</option>
                      <option value="neumorphism">Neumorphic 3D</option>
                      <option value="custom">Custom Shadow</option>
                    </select>
                  </div>

                  {theme.inputs.shadow === "neumorphism" && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#1C1917]">Neumorphism Style</span>
                        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#EAE3D6]">
                          <button
                            type="button"
                            onClick={() => updateSubKey("inputs", { neumorphismRaised: false })}
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer ${!theme.inputs.neumorphismRaised ? "bg-[#FF5A36] text-white" : "text-[#78716C]"
                              }`}
                          >
                            Pressed (Inset)
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSubKey("inputs", { neumorphismRaised: true })}
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer ${theme.inputs.neumorphismRaised ? "bg-[#FF5A36] text-white" : "text-[#78716C]"
                              }`}
                          >
                            Raised (Outer)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {theme.inputs.shadow === "custom" && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#1C1917]">Custom Shadow Config</span>
                        <button
                          type="button"
                          onClick={() => updateSubKey("inputs", { customShadowInset: !theme.inputs.customShadowInset })}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border cursor-pointer ${theme.inputs.customShadowInset
                              ? "bg-[#FFF0EB] text-[#FF5A36] border-[#FF5A36]"
                              : "bg-white text-[#78716C] border-[#EAE3D6]"
                            }`}
                        >
                          Inset: {theme.inputs.customShadowInset ? "ON" : "OFF"}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#78716C]">X Offset</label>
                          <input
                            type="number"
                            value={theme.inputs.customShadowX ?? 0}
                            onChange={(e) => updateSubKey("inputs", { customShadowX: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#78716C]">Y Offset</label>
                          <input
                            type="number"
                            value={theme.inputs.customShadowY ?? 2}
                            onChange={(e) => updateSubKey("inputs", { customShadowY: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#78716C]">Blur</label>
                          <input
                            type="number"
                            value={theme.inputs.customShadowBlur ?? 8}
                            onChange={(e) => updateSubKey("inputs", { customShadowBlur: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#78716C]">Spread</label>
                          <input
                            type="number"
                            value={theme.inputs.customShadowSpread ?? 0}
                            onChange={(e) => updateSubKey("inputs", { customShadowSpread: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. TYPOGRAPHY & PLACEHOLDERS */}
              {activeInputSubTab === "typography" && (
                <div className="space-y-3">
                  {/* Input Text Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-700">Input Text Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.inputs.textColor.startsWith("#") ? theme.inputs.textColor : "#1C1917"}
                        onChange={(e) => updateSubKey("inputs", { textColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.inputs.textColor}
                        onChange={(e) => updateSubKey("inputs", { textColor: e.target.value })}
                        className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  {/* Placeholder Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-700">Placeholder Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.inputs.placeholderColor.startsWith("#") ? theme.inputs.placeholderColor : "#A8A29E"}
                        onChange={(e) => updateSubKey("inputs", { placeholderColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.inputs.placeholderColor}
                        onChange={(e) => updateSubKey("inputs", { placeholderColor: e.target.value })}
                        className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  {/* Font Size & Weight */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#78716C] mb-1">Font Size</label>
                      <select
                        value={theme.inputs.fontSize || "sm"}
                        onChange={(e) => updateSubKey("inputs", { fontSize: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                      >
                        <option value="xs">Small (12px)</option>
                        <option value="sm">Regular (14px)</option>
                        <option value="base">Medium (16px)</option>
                        <option value="lg">Large (18px)</option>
                        <option value="custom">Custom (px)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#78716C] mb-1">Font Weight</label>
                      <select
                        value={theme.inputs.fontWeight || "normal"}
                        onChange={(e) => updateSubKey("inputs", { fontWeight: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                      >
                        <option value="normal">Normal (400)</option>
                        <option value="medium">Medium (500)</option>
                        <option value="semibold">Semibold (600)</option>
                        <option value="bold">Bold (700)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. LABELS & REQUIRED */}
              {activeInputSubTab === "labels" && (
                <div className="space-y-3">
                  {/* Label Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-700">Label Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.inputs.labelColor.startsWith("#") ? theme.inputs.labelColor : "#1C1917"}
                        onChange={(e) => updateSubKey("inputs", { labelColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.inputs.labelColor}
                        onChange={(e) => updateSubKey("inputs", { labelColor: e.target.value })}
                        className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  {/* Required Indicator Style */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#78716C] mb-1">Required Indicator</label>
                      <select
                        value={theme.inputs.requiredIndicator || "asterisk"}
                        onChange={(e) => updateSubKey("inputs", { requiredIndicator: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                      >
                        <option value="asterisk">Asterisk (*)</option>
                        <option value="badge">Badge (Required)</option>
                        <option value="dot">Dot (•)</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#78716C] mb-1">Required Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.inputs.requiredColor || "#FF5A36"}
                          onChange={(e) => updateSubKey("inputs", { requiredColor: e.target.value })}
                          className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.inputs.requiredColor || "#FF5A36"}
                          onChange={(e) => updateSubKey("inputs", { requiredColor: e.target.value })}
                          className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Label Bottom Spacing */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#78716C]">Spacing Below Label</span>
                      <span className="font-mono text-[#1C1917]">{theme.inputs.labelSpacing ?? 6}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={theme.inputs.labelSpacing ?? 6}
                      onChange={(e) => updateSubKey("inputs", { labelSpacing: Number(e.target.value) })}
                      className="w-full accent-[#FF5A36]"
                    />
                  </div>
                </div>
              )}

              {/* 8. FOCUS & HOVER STATES */}
              {activeInputSubTab === "states" && (
                <div className="space-y-3">
                  {/* Focus Border Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-700">Focus Border</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.inputs.focusBorderColor.startsWith("#") ? theme.inputs.focusBorderColor : "#FF5A36"}
                        onChange={(e) => updateSubKey("inputs", { focusBorderColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.inputs.focusBorderColor}
                        onChange={(e) => updateSubKey("inputs", { focusBorderColor: e.target.value })}
                        className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  {/* Focus Ring Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-700">Focus Ring Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.inputs.focusRingColor.startsWith("#") ? theme.inputs.focusRingColor : "#FF5A36"}
                        onChange={(e) => updateSubKey("inputs", { focusRingColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.inputs.focusRingColor}
                        onChange={(e) => updateSubKey("inputs", { focusRingColor: e.target.value })}
                        className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  {/* Focus Background */}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-700">Focus Background</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.inputs.focusBackgroundColor || "#FFFFFF"}
                        onChange={(e) => updateSubKey("inputs", { focusBackgroundColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.inputs.focusBackgroundColor || "#FFFFFF"}
                        onChange={(e) => updateSubKey("inputs", { focusBackgroundColor: e.target.value })}
                        className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 9. SIZING & PADDING */}
              {activeInputSubTab === "sizing" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#78716C]">
                      Input Height
                    </label>
                    <select
                      value={theme.inputs.height || "normal"}
                      onChange={(e) => updateSubKey("inputs", { height: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                    >
                      <option value="compact">Compact (36px)</option>
                      <option value="normal">Normal (44px)</option>
                      <option value="spacious">Spacious (52px)</option>
                      <option value="custom">Custom (px)</option>
                    </select>
                  </div>

                  {theme.inputs.height === "custom" && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#78716C]">Custom Height</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="24"
                          max="80"
                          value={theme.inputs.customHeight ?? 44}
                          onChange={(e) => updateSubKey("inputs", { customHeight: Number(e.target.value) })}
                          className="w-16 px-2 py-1 text-xs rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                        />
                        <span className="text-xs text-[#78716C]">px</span>
                      </div>
                    </div>
                  )}

                  {/* Horizontal Padding Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#78716C]">Horizontal Padding</span>
                      <span className="font-mono text-[#1C1917]">{theme.inputs.paddingHorizontal ?? 14}px</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="32"
                      value={theme.inputs.paddingHorizontal ?? 14}
                      onChange={(e) => updateSubKey("inputs", { paddingHorizontal: Number(e.target.value) })}
                      className="w-full accent-[#FF5A36]"
                    />
                  </div>

                  {/* Field Spacing Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#78716C]">Field-to-Field Spacing</span>
                      <span className="font-mono text-[#1C1917]">{theme.inputs.customFieldSpacing ?? 16}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="40"
                      value={theme.inputs.customFieldSpacing ?? 16}
                      onChange={(e) => updateSubKey("inputs", { customFieldSpacing: Number(e.target.value) })}
                      className="w-full accent-[#FF5A36]"
                    />
                  </div>
                </div>
              )}

              {/* 10. SPECIAL CONTROLS */}
              {activeInputSubTab === "controls" && (
                <div className="space-y-3">
                  {/* Checkbox / Radio Accent Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-700">Checkbox & Radio Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.inputs.accentColor || theme.colors.primary}
                        onChange={(e) => updateSubKey("inputs", { accentColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.inputs.accentColor || theme.colors.primary}
                        onChange={(e) => updateSubKey("inputs", { accentColor: e.target.value })}
                        className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  {/* Rating Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-700">Rating Star Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.inputs.ratingActiveColor || "#F59E0B"}
                        onChange={(e) => updateSubKey("inputs", { ratingActiveColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.inputs.ratingActiveColor || "#F59E0B"}
                        onChange={(e) => updateSubKey("inputs", { ratingActiveColor: e.target.value })}
                        className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  {/* Dropzone Border Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-700">Dropzone Border Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.inputs.dropzoneBorderColor || "#EAE3D6"}
                        onChange={(e) => updateSubKey("inputs", { dropzoneBorderColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.inputs.dropzoneBorderColor || "#EAE3D6"}
                        onChange={(e) => updateSubKey("inputs", { dropzoneBorderColor: e.target.value })}
                        className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons Customization Section */}
        <div className="border border-[#EAE3D6] rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection("buttons")}
            className="w-full p-2.5 bg-[#FAF8F5] flex items-center justify-between font-semibold text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Buttons & Action Triggers</span>
            </div>
            {activeSection === "buttons" ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#78716C]" />
            )}
          </button>

          {activeSection === "buttons" && (
            <div className="p-3 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Button Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.buttons.backgroundColor}
                    onChange={(e) => updateSubKey("buttons", { backgroundColor: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.buttons.backgroundColor}
                    onChange={(e) => updateSubKey("buttons", { backgroundColor: e.target.value })}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-700">Button Text Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.buttons.textColor}
                    onChange={(e) => updateSubKey("buttons", { textColor: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.buttons.textColor}
                    onChange={(e) => updateSubKey("buttons", { textColor: e.target.value })}
                    className="w-20 px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#78716C] mb-1">Button Size</label>
                  <select
                    value={theme.buttons.size}
                    onChange={(e) => updateSubKey("buttons", { size: e.target.value as any })}
                    className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#78716C] mb-1">Corner Radius</label>
                  <select
                    value={theme.buttons.borderRadius}
                    onChange={(e) => updateSubKey("buttons", { borderRadius: e.target.value as any })}
                    className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5]"
                  >
                    <option value="none">Square</option>
                    <option value="md">Rounded</option>
                    <option value="xl">Extra Rounded</option>
                    <option value="full">Pill</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme.buttons.fullWidth}
                  onChange={(e) => updateSubKey("buttons", { fullWidth: e.target.checked })}
                  className="rounded text-[#FF5A36] focus:ring-[#FF5A36]"
                />
                <span className="text-xs font-semibold text-[#1C1917]">Full Width Buttons</span>
              </label>
            </div>
          )}
        </div>

        {/* Branding & Logo Section */}
        <div className="border border-[#EAE3D6] rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection("branding")}
            className="w-full p-2.5 bg-[#FAF8F5] flex items-center justify-between font-semibold text-[#1C1917] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Branding & Header Images</span>
            </div>
            {activeSection === "branding" ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#78716C]" />
            )}
          </button>

          {activeSection === "branding" && (
            <div className="p-3 space-y-3 bg-white">
              {/* Form Logo */}
              <div>
                <label className="block text-[#78716C] mb-1">Form Logo (URL or Upload)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={theme.branding.logoUrl || ""}
                    onChange={(e) => updateSubKey("branding", { logoUrl: e.target.value })}
                    placeholder="https://yourbrand.com/logo.png"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] text-xs"
                  />
                  <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-[#EAE3D6] hover:border-[#FF5A36] rounded-xl bg-[#FAF8F5] cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#FF5A36]" />
                    <span className="text-[11px] font-semibold text-[#1C1917]">Upload Logo Image</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>

                {theme.branding.logoUrl && (
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#F5F2EB]">
                    <div>
                      <span className="text-[10px] text-[#78716C]">Position</span>
                      <select
                        value={theme.branding.logoPosition || "center"}
                        onChange={(e) => updateSubKey("branding", { logoPosition: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5 font-medium"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                        <option value="center-top">Center Top</option>
                        <option value="center-bottom">Center Bottom</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C]">Size</span>
                      <select
                        value={theme.branding.logoSize || "md"}
                        onChange={(e) => updateSubKey("branding", { logoSize: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                      >
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C]">Frame Style</span>
                      <select
                        value={theme.branding.logoFrame || "badge"}
                        onChange={(e) => updateSubKey("branding", { logoFrame: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                      >
                        <option value="badge">Badge Frame</option>
                        <option value="circle">Circular Avatar</option>
                        <option value="plain">Transparent</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Header Banner */}
              <div>
                <label className="block text-[#78716C] mb-1">Header Banner Image</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={theme.branding.headerImageUrl || ""}
                    onChange={(e) => updateSubKey("branding", { headerImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] text-xs"
                  />
                  <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-[#EAE3D6] hover:border-[#FF5A36] rounded-xl bg-[#FAF8F5] cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#FF5A36]" />
                    <span className="text-[11px] font-semibold text-[#1C1917]">Upload Header Banner</span>
                    <input type="file" accept="image/*" onChange={handleHeaderImageUpload} className="hidden" />
                  </label>
                </div>

                {theme.branding.headerImageUrl && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#F5F2EB]">
                    <div>
                      <span className="text-[10px] text-[#78716C]">Banner Height</span>
                      <select
                        value={theme.branding.headerImageHeight || "md"}
                        onChange={(e) => updateSubKey("branding", { headerImageHeight: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                      >
                        <option value="sm">Compact (130px)</option>
                        <option value="md">Medium (180px)</option>
                        <option value="lg">Tall (240px)</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C]">Image Fit</span>
                      <select
                        value={theme.branding.headerImageFit || "cover"}
                        onChange={(e) => updateSubKey("branding", { headerImageFit: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] mt-0.5"
                      >
                        <option value="cover">Cover (Fill)</option>
                        <option value="contain">Contain (Fit)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Flow Style Badge Styling */}
              <div className="pt-2 border-t border-[#F5F2EB] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
                    Flow Style Badge
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={theme.branding.showStyleBadge !== false}
                      onChange={(e) => updateSubKey("branding", { showStyleBadge: e.target.checked })}
                      className="w-3.5 h-3.5 rounded text-[#FF5A36] focus:ring-[#FF5A36] cursor-pointer"
                    />
                    <span className="text-[11px] text-[#78716C]">Show Badge</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#78716C]">Badge Background</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <input
                        type="color"
                        value={
                          theme.branding.badgeBackgroundColor?.startsWith("#")
                            ? theme.branding.badgeBackgroundColor
                            : (theme.colors.accent?.startsWith("#") ? theme.colors.accent : "#FFF0EB")
                        }
                        onChange={(e) => updateSubKey("branding", { badgeBackgroundColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.branding.badgeBackgroundColor || theme.colors.accent || "#FFF0EB"}
                        onChange={(e) => updateSubKey("branding", { badgeBackgroundColor: e.target.value })}
                        className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#78716C]">Badge Text & Icon</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <input
                        type="color"
                        value={
                          theme.branding.badgeTextColor?.startsWith("#")
                            ? theme.branding.badgeTextColor
                            : (theme.colors.primary?.startsWith("#") ? theme.colors.primary : "#FF5A36")
                        }
                        onChange={(e) => updateSubKey("branding", { badgeTextColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.branding.badgeTextColor || theme.colors.primary || "#FF5A36"}
                        onChange={(e) => updateSubKey("branding", { badgeTextColor: e.target.value })}
                        className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#78716C]">Badge Border Color</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="color"
                      value={
                        theme.branding.badgeBorderColor?.startsWith("#")
                          ? theme.branding.badgeBorderColor.slice(0, 7)
                          : "#FFD8CC"
                      }
                      onChange={(e) => updateSubKey("branding", { badgeBorderColor: e.target.value })}
                      className="w-7 h-7 rounded-lg border border-[#EAE3D6] cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.branding.badgeBorderColor || (theme.colors.primary ? `${theme.colors.primary}40` : "#FFD8CC")}
                      onChange={(e) => updateSubKey("branding", { badgeBorderColor: e.target.value })}
                      className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-[#EAE3D6] bg-[#FAF8F5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
