"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TemplateItem, getTemplatesApi, useTemplateApi } from "@/lib/api-client";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreviewModal } from "./TemplatePreviewModal";

const CATEGORIES = [
  "All",
  "Feedback",
  "Contact",
  "Event",
  "Survey",
  "Lead",
  "Application",
  "Quiz",
];

export function TemplateGallery() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use Template mutation state
  const [usingTemplateId, setUsingTemplateId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const res = await getTemplatesApi(selectedCategory);
    if (res.success && res.data) {
      setTemplates(res.data);
    } else {
      setErrorMessage(res.message || "Failed to load templates.");
    }
    setIsLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // "Use Template" Flow:
  // Creates a brand-new user-owned Draft form with copied structure and navigates to builder edit route
  const handleUseTemplate = async (template: TemplateItem) => {
    try {
      setUsingTemplateId(template.id);
      const res = await useTemplateApi(template.id);

      if (res.success && res.data) {
        setToastMessage({
          text: `Created draft form from "${template.title}". Redirecting to builder...`,
          type: "success",
        });

        // Close preview modal if open
        setPreviewTemplate(null);

        // Redirect to form builder placeholder
        router.push(`/forms/${res.data.id}/edit`);
      } else {
        setToastMessage({
          text: res.message || "Failed to create form from template.",
          type: "error",
        });
        setUsingTemplateId(null);
      }
    } catch (error) {
      setToastMessage({
        text: "An unexpected error occurred while creating form.",
        type: "error",
      });
      setUsingTemplateId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1C1917] text-white shadow-xl text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-3 duration-200">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D6]">
        <div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
            Template Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-1">
            Choose from our curated collection of designer templates crafted for high conversion.
          </p>
        </div>

        <Link href="/forms/new">
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus className="w-4 h-4" />}
            className="shadow-md shadow-[#FF5A36]/20"
          >
            Start Blank Form
          </Button>
        </Link>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-xs shadow-[#FF5A36]/20"
                  : "bg-white text-[#57534E] border border-[#EAE3D6] hover:bg-[#FAF8F5] hover:text-[#1C1917]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Template Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white border border-[#EAE3D6] p-6 sm:p-7 card-shadow animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 bg-[#FAF8F5] border border-[#EAE3D6] rounded-full" />
                <div className="h-5 w-20 bg-[#FAF8F5] border border-[#EAE3D6] rounded-full" />
              </div>
              <div className="h-36 bg-[#FAF8F5] border border-[#EAE3D6] rounded-2xl" />
              <div className="h-6 w-3/4 bg-[#FAF8F5] rounded-md" />
              <div className="h-4 w-full bg-[#FAF8F5] rounded-md" />
              <div className="pt-4 border-t border-[#EAE3D6] flex justify-between">
                <div className="h-8 w-16 bg-[#FAF8F5] rounded-md" />
                <div className="h-8 w-24 bg-[#FAF8F5] rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-8 text-center text-red-700">
          <p className="text-sm font-semibold">{errorMessage}</p>
          <Button variant="outline" size="sm" onClick={fetchTemplates} className="mt-4">
            Try again
          </Button>
        </div>
      ) : templates.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#EAE3D6] p-12 text-center">
          <h3 className="text-lg font-semibold text-[#1C1917]">
            No templates found
          </h3>
          <p className="text-xs text-[#57534E] mt-1">
            No templates currently match the selected category.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory("All")}
            className="mt-4"
          >
            Show all templates
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isUsing={usingTemplateId === template.id}
              onUseTemplate={handleUseTemplate}
              onPreview={(t) => setPreviewTemplate(t)}
            />
          ))}
        </div>
      )}

      {/* Quick Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        isUsing={usingTemplateId === previewTemplate?.id}
        onUseTemplate={handleUseTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}

