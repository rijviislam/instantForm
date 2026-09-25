"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  LayoutTemplate,
  Layers,
  Wand2,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createFormApi, FormField, FormStyle } from "@/lib/api-client";

const STARTER_PRESETS = [
  {
    id: "name",
    type: "short_text" as const,
    label: "Full Name",
    placeholder: "Jane Doe",
    required: true,
  },
  {
    id: "email",
    type: "email" as const,
    label: "Email Address",
    placeholder: "jane@company.com",
    required: true,
  },
  {
    id: "rating",
    type: "rating" as const,
    label: "Rating",
    required: false,
  },
  {
    id: "message",
    type: "long_text" as const,
    label: "Message / Feedback",
    placeholder: "Tell us what you think...",
    required: false,
  },
];

const FORM_STYLES: Array<{ id: FormStyle; name: string }> = [
  { id: "classic", name: "Classic" },
  { id: "conversation", name: "Conversation" },
  { id: "chat", name: "Chat" },
  { id: "editorial", name: "Editorial" },
  { id: "minimal", name: "Minimal" },
];

export function NewFormSelector() {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "scratch">("choose");

  // Scratch form creation state
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<FormStyle>("classic");
  const [selectedPresets, setSelectedPresets] = useState<string[]>([
    "name",
    "email",
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const togglePreset = (id: string) => {
    setSelectedPresets((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreateForm = async () => {
    try {
      setIsCreating(true);
      setErrorMessage(null);

      const initialFields: FormField[] = selectedPresets.map((pId) => {
        const preset = STARTER_PRESETS.find((p) => p.id === pId)!;
        return {
          id: `field_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
          type: preset.type,
          label: preset.label,
          placeholder: preset.placeholder,
          required: preset.required,
        };
      });

      const res = await createFormApi({
        title: title.trim() || "Untitled Form",
        description: description.trim() || null,
        style,
        fields: initialFields,
      });

      if (res.success && res.data) {
        router.push(`/forms/${res.data.id}/edit`);
      } else {
        setErrorMessage(res.message || "Failed to create form.");
        setIsCreating(false);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred while creating form.");
      setIsCreating(false);
    }
  };

  if (mode === "scratch") {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMode("choose")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57534E] hover:text-[#1C1917] px-3.5 py-1.5 rounded-full bg-white border border-[#EAE3D6] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Starting Point</span>
          </button>
        </div> */}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 sm:p-10 card-shadow space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#FF5A36]/10 text-[#FF5A36] text-xs font-semibold uppercase tracking-wider border border-[#FFD8CC] dark:border-[#FF5A36]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create New Form</span>
            </span>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#1C1917] dark:text-[#F8FAFC] mt-3">
              Set up your form
            </h1>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] mt-1">
              Configure basic details and starter questions before entering the builder.
            </p>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
              Form Title <span className="text-[#FF5A36]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Customer Feedback Survey"
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell respondents the purpose of this form..."
              rows={2}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all resize-none"
            />
          </div>

          {/* Style Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
              Initial Visual Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {FORM_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStyle(st.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    style === st.id
                      ? "bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border-[#FF5A36] text-[#FF5A36]"
                      : "bg-[#FAF8F5] dark:bg-[#161F30] border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8] hover:border-[#D6D3D1] dark:hover:border-[#374151]"
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Starter Fields Checklist */}
          <div className="space-y-2.5 pt-2 border-t border-[#EAE3D6] dark:border-[#1F2937]">
            <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC]">
              Add Starter Questions (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STARTER_PRESETS.map((preset) => {
                const isChecked = selectedPresets.includes(preset.id);
                return (
                  <label
                    key={preset.id}
                    onClick={() => togglePreset(preset.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? "bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border-[#FF5A36] text-[#1C1917] dark:text-[#F8FAFC]"
                        : "bg-[#FAF8F5] dark:bg-[#161F30] border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isChecked
                          ? "bg-[#FF5A36] border-[#FF5A36] text-white"
                          : "border-[#D6D3D1] dark:border-[#374151]"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium">{preset.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-[#EAE3D6] dark:border-[#1F2937] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="px-4 py-2 text-xs font-semibold text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>

            <Button
              variant="primary"
              size="md"
              onClick={handleCreateForm}
              disabled={isCreating}
              iconLeft={
                isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )
              }
              className="shadow-md shadow-[#FF5A36]/20"
            >
              {isCreating ? "Opening Builder..." : "Create & Open Builder"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#FF5A36]/10 text-[#FF5A36] text-xs font-semibold uppercase tracking-wider border border-[#FFD8CC] dark:border-[#FF5A36]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Form Creator</span>
        </div>

        <h1 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
          How would you like to start?
        </h1>

        <p className="text-sm sm:text-base text-[#57534E] dark:text-[#94A3B8]">
          Choose a starting point for your next form.
        </p>
      </div>

      {/* Creation Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* 1. Start from Scratch */}
        <div
          onClick={() => setMode("scratch")}
          className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 sm:p-8 card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] dark:text-[#FF6B4A] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F8FAFC]">
              Start from scratch
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Build your custom form block by block with complete creative freedom.
            </p>
          </div>

          <div className="pt-6">
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center shadow-md shadow-[#FF5A36]/20"
            >
              Configure & start
            </Button>
          </div>
        </div>

        {/* 2. Choose Template */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 sm:p-8 card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all flex flex-col justify-between group cursor-pointer">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-blue-950/30 border border-[#DBEAFE] dark:border-blue-900/40 text-[#3B82F6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F8FAFC]">
              Use a template
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Pick from our library of designer templates tailored for feedback, leads, and events.
            </p>
          </div>

          <div className="pt-6">
            <Link href="/templates" className="w-full block">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
              >
                Explore templates
              </Button>
            </Link>
          </div>
        </div>

        {/* 3. AI Generated */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 sm:p-8 card-shadow transition-all flex flex-col justify-between group relative overflow-hidden">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] dark:bg-purple-950/30 border border-[#F3E8FF] dark:border-purple-900/40 text-[#9333EA] dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Wand2 className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F8FAFC]">
                Generate with AI
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5FF] dark:bg-purple-950/40 text-[#9333EA] dark:text-purple-400 border border-[#F3E8FF] dark:border-purple-800/40">
                Coming Soon
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] mt-2 leading-relaxed">
              Describe what you want to collect and let InstantForm compose the questions.
            </p>
          </div>

          <div className="pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="w-full justify-center opacity-60"
            >
              Generate form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

