"use client";

import React from "react";
import { Inbox, CheckCircle2 } from "lucide-react";

interface RecentActivityListProps {
  activity: Array<{
    id: string;
    formId: string;
    formTitle: string;
    createdAt: string;
  }>;
  isLoading?: boolean;
}

export function RecentActivityList({ activity, isLoading = false }: RecentActivityListProps) {
  return (
    <div className="rounded-3xl bg-white border border-[#E7E2D8] p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-normal text-[#1C1917] tracking-tight">
              Recent responses
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] mt-0.5">
              Live submission feed across your forms
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-[#FAF8F5] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : activity.length === 0 ? (
          /* Empty State */
          <div className="py-10 px-4 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#E7E2D8] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] border border-[#E7E2D8] text-[#78716C] flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1C1917]">No responses yet</h3>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-xs mt-1 leading-relaxed">
              Responses will appear here once people start submitting your published forms.
            </p>
          </div>
        ) : (
          /* Activity Feed */
          <div className="space-y-2.5">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#F4EFE6] bg-[#FAF8F5]/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#EBF9F1] text-[#15803D] flex items-center justify-center shrink-0 border border-[#DCFCE7]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1C1917] truncate">
                      Submission for &ldquo;{item.formTitle}&rdquo;
                    </p>
                    <p className="text-[11px] text-[#78716C] mt-0.5">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-[#15803D] bg-[#EBF9F1] px-2 py-0.5 rounded-md">
                  Received
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
