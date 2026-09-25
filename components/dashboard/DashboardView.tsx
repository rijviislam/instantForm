"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MetricCards } from "./MetricCards";
import { ResponsesChart } from "./ResponsesChart";
import { RecentFormsList } from "./RecentFormsList";
import { RecentActivityList } from "./RecentActivityList";
import { Button } from "@/components/ui/Button";
import { Plus, ArrowRight, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { getDashboardOverviewApi } from "@/lib/api-client";

interface DashboardViewProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  apiToken?: string;
}

export function DashboardView({ user, apiToken }: DashboardViewProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    metrics: {
      totalForms: number;
      publishedForms: number;
      draftForms: number;
      totalResponses: number;
    };
    responsesOverTime: Array<{ date: string; count: number }>;
    recentForms: Array<{
      id: string;
      title: string;
      description: string | null;
      isPublished: boolean;
      style: string | null;
      responsesCount: number;
      createdAt: string;
      updatedAt: string;
    }>;
    recentActivity: Array<{
      id: string;
      formId: string;
      formTitle: string;
      createdAt: string;
    }>;
  }>({
    metrics: {
      totalForms: 0,
      publishedForms: 0,
      draftForms: 0,
      totalResponses: 0,
    },
    responsesOverTime: [],
    recentForms: [],
    recentActivity: [],
  });
  const [reloadKey, setReloadKey] = useState(0);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await getDashboardOverviewApi(apiToken);
        if (isMounted) {
          if (res.success && res.data) {
            setData(res.data);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load dashboard overview:", err);
          setError("We couldn't load your live dashboard data. You can try again.");
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [apiToken, reloadKey]);

  // Compute time-aware personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Welcome back";
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 18) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    if (user.name) {
      return `${timeGreeting}, ${user.name.split(" ")[0]}`;
    }
    return "Welcome back";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Non-blocking Error Banner if API has temporary issue */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#E44825] dark:text-[#FF6B4A] text-xs sm:text-sm flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#1E293B] text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC] border border-[#E7E2D8] dark:border-[#334155] hover:bg-[#FAF8F5] dark:hover:bg-[#0F172A] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 1. Header Banner & Call-to-Actions */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#E7E2D8] dark:border-[#1F2937] p-6 sm:p-10 shadow-2xs relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF5A36]/10 via-[#FFA07A]/5 to-transparent dark:from-[#FF5A36]/15 dark:via-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#FF5A36]/15 text-[#FF5A36] dark:text-[#FF6B4A] text-xs font-semibold uppercase tracking-wider border border-[#FFD8CC] dark:border-[#FF5A36]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreeting()}</span>
            </div>

            <h1 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight leading-[1.1]">
              Create a form in{" "}
              <span className="italic font-medium text-[#FF5A36] dark:text-[#FF6B4A]">seconds</span>.
            </h1>

            <p className="text-sm sm:text-base text-[#57534E] dark:text-[#94A3B8] leading-relaxed pt-1">
              Start from scratch or choose a template to create your next form.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              iconLeft={<Plus className="w-4 h-4" />}
              onClick={() => router.push("/forms/new")}
              className="w-full sm:w-auto shadow-md shadow-[#FF5A36]/20 group"
            >
              New Form
            </Button>

            <Button
              variant="secondary"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              onClick={() => router.push("/forms")}
              className="w-full sm:w-auto group"
            >
              Browse all forms
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Metric Cards Grid */}
      <MetricCards metrics={data.metrics} isLoading={isLoading} />

      {/* 3. Responses Over Time Chart */}
      <ResponsesChart data={data.responsesOverTime} isLoading={isLoading} />

      {/* 4. Two-Column Grid: Recent Forms & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentFormsList forms={data.recentForms} isLoading={isLoading} />
        <RecentActivityList activity={data.recentActivity} isLoading={isLoading} />
      </div>
    </div>
  );
}
