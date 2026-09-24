"use client";

import React from "react";
import { FileText, CheckCircle2, FileEdit, BarChart2 } from "lucide-react";
import { clsx } from "clsx";

interface MetricCardsProps {
  metrics: {
    totalForms: number;
    publishedForms: number;
    draftForms: number;
    totalResponses: number;
  };
  isLoading?: boolean;
}

export function MetricCards({ metrics, isLoading = false }: MetricCardsProps) {
  const cards = [
    {
      id: "total-forms",
      label: "Total Forms",
      value: metrics.totalForms,
      icon: FileText,
      iconColor: "text-[#FF5A36]",
      iconBg: "bg-[#FFF0EB] border-[#FFD8CC]",
    },
    {
      id: "published",
      label: "Published",
      value: metrics.publishedForms,
      icon: CheckCircle2,
      iconColor: "text-[#15803D]",
      iconBg: "bg-[#EBF9F1] border-[#DCFCE7]",
    },
    {
      id: "drafts",
      label: "Drafts",
      value: metrics.draftForms,
      icon: FileEdit,
      iconColor: "text-[#78716C]",
      iconBg: "bg-[#FAF8F5] border-[#E7E2D8]",
    },
    {
      id: "total-responses",
      label: "Total Responses",
      value: metrics.totalResponses,
      icon: BarChart2,
      iconColor: "text-[#3B82F6]",
      iconBg: "bg-[#EFF6FF] border-[#DBEAFE]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="rounded-3xl bg-white border border-[#E7E2D8] p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-[#D8D0C0] transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105",
                  card.iconBg,
                  card.iconColor
                )}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            {isLoading ? (
              <div className="h-8 w-16 bg-[#F4EFE6] rounded-lg animate-pulse" />
            ) : (
              <p className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
                {card.value}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
