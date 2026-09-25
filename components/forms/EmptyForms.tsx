"use client";

import React from "react";
import Link from "next/link";
import { FileText, SearchX, Plus, LayoutTemplate, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyFormsProps {
  type: "first-time" | "search-empty";
  onClearFilters?: () => void;
}

export function EmptyForms({ type, onClearFilters }: EmptyFormsProps) {
  if (type === "search-empty") {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-12 sm:p-16 text-center card-shadow flex flex-col items-center justify-center animate-in fade-in duration-200">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8] flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7" />
        </div>

        <h3 className="font-serif-editorial text-2xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
          No forms found
        </h3>

        <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] max-w-sm mt-2 mb-6 leading-relaxed">
          We couldn&apos;t find any forms matching your search or active filter.
        </p>

        {onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Clear search & filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-12 sm:p-16 text-center card-shadow flex flex-col items-center justify-center animate-in fade-in duration-200">
      <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] dark:text-[#FF6B4A] flex items-center justify-center mb-4">
        <FileText className="w-7 h-7" />
      </div>

      <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
        No forms yet
      </h3>

      <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] max-w-md mt-2 mb-6 leading-relaxed">
        Create your first form and start collecting responses with InstantForm&apos;s design-first builder, or choose from our curated templates.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/forms/new">
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-md shadow-[#FF5A36]/20"
          >
            New Form
          </Button>
        </Link>

        <Link href="/templates">
          <Button
            variant="secondary"
            size="md"
            iconLeft={<LayoutTemplate className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Browse Templates
          </Button>
        </Link>
      </div>
    </div>
  );
}
