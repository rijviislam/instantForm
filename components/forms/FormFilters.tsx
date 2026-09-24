"use client";

import React from "react";
import { Search, X } from "lucide-react";

export type FilterStatus = "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface FormFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  counts?: {
    all?: number;
    draft?: number;
    published?: number;
    archived?: number;
  };
}

export function FormFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: FormFiltersProps) {
  const tabs: { key: FilterStatus; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "DRAFT", label: "Draft" },
    { key: "PUBLISHED", label: "Published" },
    { key: "ARCHIVED", label: "Archived" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Status Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onStatusFilterChange(tab.key)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-xs shadow-[#FF5A36]/20"
                  : "bg-white text-[#57534E] border border-[#EAE3D6] hover:bg-[#FAF8F5] hover:text-[#1C1917]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C]">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search forms by title..."
          className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-[#EAE3D6] rounded-xl text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#78716C] hover:text-[#1C1917] cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

