"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Edit3,
  Eye,
  Copy,
  Globe,
  Archive,
  Trash2,
  Clock,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { FormItem } from "@/lib/api-client";
import { formatRelativeTime } from "@/lib/date-utils";

interface FormCardProps {
  form: FormItem;
  onDuplicate: (form: FormItem) => void;
  onTogglePublish: (form: FormItem) => void;
  onDeleteRequest: (form: FormItem) => void;
}

export function FormCard({
  form,
  onDuplicate,
  onTogglePublish,
  onDeleteRequest,
}: FormCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const isPublished = form.status === "PUBLISHED" || form.isPublished;
  const isArchived = form.status === "ARCHIVED";
  const isDraft = !isPublished && !isArchived;

  const styleDisplay = form.style
    ? form.style.charAt(0).toUpperCase() + form.style.slice(1)
    : "Classic";

  return (
    <div className="group relative rounded-3xl bg-white border border-[#EAE3D6] p-6 sm:p-7 card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top bar: Style tag & Status Badge & Action Menu */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Badge */}
            {isPublished && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Published
              </span>
            )}
            {isDraft && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                Draft
              </span>
            )}
            {isArchived && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF8F5] text-[#78716C] border border-[#EAE3D6]">
                <Archive className="w-3 h-3" />
                Archived
              </span>
            )}

            {/* Style Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-[#57534E] border border-[#EAE3D6]">
              <Sparkles className="w-3 h-3 text-[#FF5A36]" />
              {styleDisplay}
            </span>
          </div>

          {/* Action Menu (Ellipsis) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Form actions"
              aria-expanded={menuOpen}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9 w-48 rounded-2xl bg-white border border-[#EAE3D6] p-1.5 shadow-xl z-20 animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href={`/forms/${form.id}/edit`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] rounded-xl transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>Edit Form</span>
                </Link>

                <Link
                  href={`/forms/${form.id}/preview`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] rounded-xl transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>Preview</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(form);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] rounded-xl transition-colors text-left cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>Duplicate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onTogglePublish(form);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] rounded-xl transition-colors text-left cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>{isPublished ? "Unpublish" : "Publish"}</span>
                </button>

                <div className="my-1 border-t border-[#EAE3D6]" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteRequest(form);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <Link href={`/forms/${form.id}/edit`} className="block group-hover:text-[#FF5A36] transition-colors">
          <h3 className="font-serif-editorial text-xl font-medium text-[#1C1917] line-clamp-1">
            {form.title || "Untitled Form"}
          </h3>
        </Link>

        {/* Description or excerpt */}
        <p className="text-xs sm:text-sm text-[#57534E] mt-1.5 line-clamp-2 min-h-[36px] leading-relaxed">
          {form.description || "No description provided."}
        </p>
      </div>

      {/* Footer Metrics & Timestamps */}
      <div className="mt-6 pt-4 border-t border-[#EAE3D6] flex items-center justify-between text-xs text-[#78716C]">
        <div className="flex items-center gap-1.5 font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-[#FF5A36]" />
          <span>
            {form.responsesCount} {form.responsesCount === 1 ? "response" : "responses"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#A8A29E]">
          <Clock className="w-3 h-3" />
          <span>Updated {formatRelativeTime(form.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

