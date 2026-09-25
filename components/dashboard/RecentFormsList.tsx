"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ArrowRight, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

interface RecentFormsListProps {
  forms: Array<{
    id: string;
    title: string;
    description: string | null;
    isPublished: boolean;
    style: string | null;
    responsesCount: number;
    updatedAt: string;
  }>;
  isLoading?: boolean;
}

export function RecentFormsList({ forms, isLoading = false }: RecentFormsListProps) {
  const router = useRouter();

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#E7E2D8] dark:border-[#1F2937] p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
              Recent forms
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8] mt-0.5">
              Forms created or modified recently
            </p>
          </div>

          <Link
            href="/forms"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF5A36] dark:text-[#FF6B4A] hover:text-[#E44825] transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-[#FAF8F5] dark:bg-[#1F2937] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : forms.length === 0 ? (
          /* Empty State */
          <div className="py-10 px-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#161F30] border border-dashed border-[#E7E2D8] dark:border-[#293548] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] dark:text-[#FF6B4A] flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F8FAFC]">No forms yet</h3>
            <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8] max-w-xs mt-1 mb-4 leading-relaxed">
              Create your first form and start collecting responses in minutes.
            </p>
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Plus className="w-4 h-4" />}
              onClick={() => router.push("/forms/new")}
            >
              Create your first form
            </Button>
          </div>
        ) : (
          /* Forms List */
          <div className="space-y-2.5">
            {forms.map((form) => (
              <div
                key={form.id}
                onClick={() => router.push(`/forms`)}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#F4EFE6] dark:border-[#1F2937] hover:border-[#E7E2D8] dark:hover:border-[#374151] hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B]/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 text-[#FF5A36] dark:text-[#FF6B4A] flex items-center justify-center shrink-0 border border-[#FFD8CC] dark:border-[#FF5A36]/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1C1917] dark:text-[#F8FAFC] truncate group-hover:text-[#FF5A36] dark:group-hover:text-[#FF6B4A] transition-colors">
                      {form.title}
                    </p>
                    <p className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-0.5">
                      {form.responsesCount} response{form.responsesCount !== 1 ? "s" : ""} • Updated {new Date(form.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                      form.isPublished
                        ? "bg-[#EBF9F1] dark:bg-emerald-950/40 text-[#15803D] dark:text-emerald-400 border border-[#DCFCE7] dark:border-emerald-800/40"
                        : "bg-[#FAF8F5] dark:bg-[#1F2937] text-[#78716C] dark:text-[#94A3B8] border border-[#E7E2D8] dark:border-[#374151]"
                    )}
                  >
                    {form.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
