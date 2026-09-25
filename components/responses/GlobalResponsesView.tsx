"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Inbox, Plus, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getUserAllResponsesApi } from "@/lib/api-client";
import { formatRelativeTime } from "@/lib/date-utils";

export function GlobalResponsesView() {
  const [responses, setResponses] = useState<
    Array<{
      id: string;
      formId: string;
      formTitle: string;
      submittedAt: string;
      answersSummary: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await getUserAllResponsesApi();
      if (res.success && res.data) {
        setResponses(res.data);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D6] dark:border-[#1F2937]">
        <div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
            Responses
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] mt-1">
            Real-time response tracking and submission overview across all your forms.
          </p>
        </div>

        <Link href="/forms/new">
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus className="w-4 h-4" />}
            className="shadow-md shadow-[#FF5A36]/20"
          >
            New Form
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-12 text-center card-shadow animate-pulse space-y-3">
          <div className="h-6 w-32 bg-[#FAF8F5] dark:bg-[#1F2937] rounded mx-auto" />
          <div className="h-4 w-48 bg-[#FAF8F5] dark:bg-[#1F2937] rounded mx-auto" />
        </div>
      ) : responses.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-12 sm:p-16 text-center card-shadow flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] dark:text-[#FF6B4A] flex items-center justify-center mb-4">
            <Inbox className="w-7 h-7" />
          </div>

          <h2 className="font-serif-editorial text-2xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
            No responses recorded yet
          </h2>

          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] max-w-sm mt-2 mb-6 leading-relaxed">
            Submissions and analytics will appear here automatically once respondents complete your published forms.
          </p>

          <Link href="/forms">
            <Button variant="primary" size="md">
              View My Forms
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] card-shadow divide-y divide-[#EAE3D6] dark:divide-[#1F2937] overflow-hidden">
          {responses.map((item) => (
            <Link
              key={item.id}
              href={`/forms/${item.formId}/responses`}
              className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B]/70 transition-colors group cursor-pointer"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1C1917] dark:text-[#F8FAFC] group-hover:text-[#FF5A36] dark:group-hover:text-[#FF6B4A] transition-colors font-serif-editorial">
                    {item.formTitle}
                  </span>
                  <span className="text-[11px] text-[#A8A29E] dark:text-[#64748B] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(item.submittedAt)}
                  </span>
                </div>
                <p className="text-xs text-[#57534E] dark:text-[#94A3B8] truncate">
                  {item.answersSummary}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-[#A8A29E] dark:text-[#64748B] group-hover:text-[#FF5A36] dark:group-hover:text-[#FF6B4A] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
