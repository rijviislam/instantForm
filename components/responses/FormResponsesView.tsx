"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Search,
  Clock,
  MessageSquare,
  BarChart3,
  X,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  FormResponseItem,
  FormAnalyticsSummary,
  getFormResponsesApi,
  getResponseDetailApi,
} from "@/lib/api-client";
import { formatRelativeTime } from "@/lib/date-utils";

interface FormResponsesViewProps {
  formId: string;
  formTitle: string;
  formSlug: string;
}

export function FormResponsesView({
  formId,
  formTitle,
  formSlug,
}: FormResponsesViewProps) {
  const [activeTab, setActiveTab] = useState<"responses" | "analytics">(
    "responses"
  );
  const [responses, setResponses] = useState<FormResponseItem[]>([]);
  const [analytics, setAnalytics] = useState<FormAnalyticsSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Selected response for detail drawer
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(
    null
  );
  const [responseDetail, setResponseDetail] = useState<{
    response: FormResponseItem;
    formTitle: string;
    fields: Array<{ id: string; label: string; type: string; answer: any }>;
  } | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchResponses = useCallback(async () => {
    setIsLoading(true);
    const res = await getFormResponsesApi(formId, {
      search: searchQuery || undefined,
    });

    if (res.success && res.data) {
      setResponses(res.data);
      if (res.analytics) {
        setAnalytics(res.analytics);
      }
    }
    setIsLoading(false);
  }, [formId, searchQuery]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  // Load single response detail
  const handleOpenDetail = async (respId: string) => {
    setSelectedResponseId(respId);
    setIsLoadingDetail(true);
    const res = await getResponseDetailApi(formId, respId);
    if (res.success && res.data) {
      setResponseDetail(res.data);
    }
    setIsLoadingDetail(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (responses.length === 0) return;

    // Collect all field keys
    const allKeys = Array.from(
      new Set(responses.flatMap((r) => Object.keys(r.data)))
    );

    const headers = ["Response ID", "Submitted At", ...allKeys];
    const rows = responses.map((r) => [
      r.id,
      new Date(r.submittedAt).toISOString(),
      ...allKeys.map((k) => {
        const val = r.data[k];
        if (val === undefined || val === null) return "";
        if (typeof val === "object") return JSON.stringify(val).replace(/"/g, '""');
        return String(val).replace(/"/g, '""');
      }),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => `"${row.join('","')}"`)].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${formTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D6] dark:border-[#1F2937]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/forms"
              className="inline-flex items-center gap-1 text-xs text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Forms</span>
            </Link>
            <span className="text-xs text-[#D6D3D1] dark:text-[#374151]">/</span>
            <span className="text-xs font-medium text-[#78716C] dark:text-[#94A3B8]">
              Responses
            </span>
          </div>

          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
            {formTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/forms/${formId}/edit`}>
            <Button variant="outline" size="sm">
              Edit in Builder
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            disabled={responses.length === 0}
            iconLeft={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-[#FAF8F5] dark:bg-[#111827] rounded-xl border border-[#EAE3D6] dark:border-[#1F2937]">
          <button
            type="button"
            onClick={() => setActiveTab("responses")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "responses"
                ? "bg-[#FF5A36] text-white shadow-xs shadow-[#FF5A36]/20"
                : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-white/60 dark:hover:bg-[#1E293B]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Responses ({responses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "analytics"
                ? "bg-[#FF5A36] text-white shadow-xs shadow-[#FF5A36]/20"
                : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-white/60 dark:hover:bg-[#1E293B]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics Summary</span>
          </button>
        </div>

        {activeTab === "responses" && (
          <div className="relative w-64 hidden sm:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C] dark:text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search responses..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] rounded-xl text-[#1C1917] dark:text-[#F8FAFC] placeholder-[#A8A29E] dark:placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-12 text-center card-shadow animate-pulse space-y-3">
          <div className="h-6 w-32 bg-[#FAF8F5] dark:bg-[#1F2937] rounded mx-auto" />
          <div className="h-4 w-48 bg-[#FAF8F5] dark:bg-[#1F2937] rounded mx-auto" />
        </div>
      ) : activeTab === "responses" ? (
        /* Submissions Table */
        responses.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-12 sm:p-16 text-center card-shadow flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] dark:text-[#FF6B4A] flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="font-serif-editorial text-2xl font-normal text-[#1C1917] dark:text-[#F8FAFC]">
              No responses yet
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] max-w-sm mt-1.5 mb-6">
              Share your public form URL to begin collecting responses.
            </p>
            <a
              href={`/f/${formSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A36] text-white text-xs font-semibold shadow-md shadow-[#FF5A36]/20 hover:bg-[#E04826] transition-colors"
            >
              <span>Open Public Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE3D6] dark:border-[#1F2937] bg-[#FAF8F5] dark:bg-[#0D131F] text-[11px] font-semibold text-[#78716C] dark:text-[#94A3B8] uppercase tracking-wider">
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-4">Answers Preview</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D6] dark:divide-[#1F2937] text-xs text-[#1C1917] dark:text-[#F8FAFC]">
                  {responses.map((resp, idx) => {
                    const previewText = Object.values(resp.data)
                      .filter((v) => typeof v === "string" || typeof v === "number")
                      .slice(0, 3)
                      .join(" • ");

                    return (
                      <tr
                        key={resp.id}
                        onClick={() => handleOpenDetail(resp.id)}
                        className="hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B]/70 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#A8A29E] dark:text-[#64748B]">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-[#78716C] dark:text-[#94A3B8]">
                          {formatRelativeTime(resp.submittedAt)}
                        </td>
                        <td className="py-3.5 px-4 max-w-md truncate font-medium">
                          {previewText || "Submitted answer"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF5A36] dark:text-[#FF6B4A] group-hover:translate-x-0.5 transition-transform">
                            View detail <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Analytics Summary */
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 card-shadow">
              <div className="flex items-center justify-between text-[#78716C] dark:text-[#94A3B8]">
                <span className="text-xs font-semibold">Total Responses</span>
                <MessageSquare className="w-4 h-4 text-[#FF5A36]" />
              </div>
              <div className="text-2xl font-bold text-[#1C1917] dark:text-[#F8FAFC] mt-2">
                {analytics?.totalResponses || 0}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 card-shadow">
              <div className="flex items-center justify-between text-[#78716C] dark:text-[#94A3B8]">
                <span className="text-xs font-semibold">Completion Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-[#1C1917] dark:text-[#F8FAFC] mt-2">
                {analytics?.totalResponses ? "100%" : "0%"}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 card-shadow">
              <div className="flex items-center justify-between text-[#78716C] dark:text-[#94A3B8]">
                <span className="text-xs font-semibold">Questions Tracked</span>
                <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div className="text-2xl font-bold text-[#1C1917] dark:text-[#F8FAFC] mt-2">
                {analytics?.questions.length || 0}
              </div>
            </div>
          </div>

          {/* Question-by-Question Breakdown Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics?.questions.map((q) => (
              <div
                key={q.fieldId}
                className="rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 card-shadow space-y-4"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF8F5] dark:bg-[#161F30] text-[#57534E] dark:text-[#94A3B8] border border-[#EAE3D6] dark:border-[#293548]">
                    {q.type.replace("_", " ")}
                  </span>
                  <h3 className="font-semibold text-sm text-[#1C1917] dark:text-[#F8FAFC] mt-2">
                    {q.label}
                  </h3>
                  <p className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                    {q.totalAnswered} answered
                  </p>
                </div>

                {/* Rating Distribution */}
                {q.type === "rating" && (
                  <div className="space-y-2 pt-2 border-t border-[#EAE3D6] dark:border-[#1F2937]">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="text-xl font-bold text-[#1C1917] dark:text-[#F8FAFC]">
                        {q.averageRating || 0}
                      </span>
                      <span className="text-xs text-[#78716C] dark:text-[#94A3B8]">/ 5 average</span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = q.ratingDistribution?.[stars] || 0;
                        const pct =
                          q.totalAnswered > 0
                            ? Math.round((count / q.totalAnswered) * 100)
                            : 0;
                        return (
                          <div key={stars} className="flex items-center gap-2 text-xs">
                            <span className="w-10 text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                              {stars} ★
                            </span>
                            <div className="flex-1 h-2 bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-10 text-right text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Choice Breakdown */}
                {q.choiceDistribution && q.choiceDistribution.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-[#EAE3D6] dark:border-[#1F2937]">
                    {q.choiceDistribution.map((choice) => (
                      <div key={choice.option} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-[#1C1917] dark:text-[#F8FAFC]">{choice.option}</span>
                          <span className="text-[#78716C] dark:text-[#94A3B8]">
                            {choice.count} ({choice.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF5A36] rounded-full"
                            style={{ width: `${choice.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Detail Slide-Over Modal */}
      {selectedResponseId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedResponseId(null)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] h-full shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-[#EAE3D6] dark:border-[#1F2937]">
            {/* Header */}
            <div className="p-6 border-b border-[#EAE3D6] dark:border-[#1F2937] flex items-center justify-between bg-white dark:bg-[#111827]">
              <div>
                <h3 className="font-serif-editorial text-xl font-medium text-[#1C1917] dark:text-[#F8FAFC]">
                  Response Detail
                </h3>
                {responseDetail && (
                  <p className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-0.5">
                    Submitted {formatRelativeTime(responseDetail.response.submittedAt)}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedResponseId(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#334155] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Answers List */}
            <div className="p-6 flex-1 overflow-y-auto space-y-5 bg-[#FAF8F5] dark:bg-[#0B0F17]">
              {isLoadingDetail ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] rounded-2xl" />
                  ))}
                </div>
              ) : responseDetail ? (
                responseDetail.fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] space-y-1.5 shadow-2xs"
                  >
                    <div className="text-xs font-semibold text-[#78716C] dark:text-[#94A3B8]">
                      {idx + 1}. {field.label}
                    </div>
                    <div className="text-sm font-medium text-[#1C1917] dark:text-[#F8FAFC] pt-0.5">
                      {field.answer !== null && field.answer !== undefined
                        ? Array.isArray(field.answer)
                          ? field.answer.join(", ")
                          : String(field.answer)
                        : "(No answer provided)"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">Failed to load details.</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#EAE3D6] dark:border-[#1F2937] bg-white dark:bg-[#111827] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedResponseId(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
