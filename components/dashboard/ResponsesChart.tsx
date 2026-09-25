"use client";

import React, { useState } from "react";
import { TrendingUp, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface ResponsesChartProps {
  data: Array<{ date: string; count: number }>;
  isLoading?: boolean;
}

export function ResponsesChart({ data, isLoading = false }: ResponsesChartProps) {
  const router = useRouter();
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const totalResponses = data.reduce((acc, d) => acc + d.count, 0);

  // SVG Chart Dimensions
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };

  const maxCount = Math.max(...data.map((d) => d.count), 5);
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, index) => {
    const x = padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.count / maxCount) * chartHeight;
    return { ...d, x, y };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : "";

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-[#E7E2D8] dark:border-[#1F2937] p-6 sm:p-8 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-editorial text-xl sm:text-2xl font-normal text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
            Responses over time
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8] mt-0.5">
            Submissions tracked across your published forms
          </p>
        </div>

        {totalResponses > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF9F1] dark:bg-emerald-950/40 text-[#15803D] dark:text-emerald-400 text-xs font-semibold border border-[#DCFCE7] dark:border-emerald-800/40">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Tracking</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="h-48 w-full bg-[#FAF8F5] dark:bg-[#1F2937] rounded-2xl animate-pulse flex items-center justify-center">
          <div className="h-6 w-32 bg-[#F4EFE6] dark:bg-[#374151] rounded-md" />
        </div>
      ) : totalResponses === 0 ? (
        /* Empty State */
        <div className="py-12 px-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#161F30] border border-dashed border-[#E7E2D8] dark:border-[#293548] flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] dark:bg-[#FF5A36]/15 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] dark:text-[#FF6B4A] flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F8FAFC]">No response data yet</h3>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8] max-w-sm mt-1 mb-5 leading-relaxed">
            Publish your first form and share the link to start collecting submissions and viewing insights.
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
        /* Responsive SVG Chart */
        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56">
            <defs>
              <linearGradient id="coralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5A36" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#FF5A36" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.5, 1].map((ratio) => {
              const y = padding.top + chartHeight * ratio;
              return (
                <line
                  key={ratio}
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  className="stroke-[#F4EFE6] dark:stroke-[#1F2937]"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill="url(#coralGradient)" />

            {/* Line Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke="#FF5A36"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  className="fill-white dark:fill-[#111827] stroke-[#FF5A36] cursor-pointer transition-transform hover:scale-150"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="10"
                  className="fill-[#78716C] dark:fill-[#94A3B8]"
                >
                  {p.date}
                </text>
              </g>
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none bg-[#1C1917] dark:bg-[#F8FAFC] text-white dark:text-[#1C1917] text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg -translate-x-1/2 -translate-y-10 transition-all z-10"
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100}%`,
              }}
            >
              {hoveredPoint.count} response{hoveredPoint.count !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
