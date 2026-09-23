"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormStatus, FormStyle } from "@/lib/api-client";

export type SaveState = "saved" | "saving" | "unsaved" | "error";
export type ViewportMode = "desktop" | "mobile";

interface BuilderTopBarProps {
  formId: string;
  slug: string;
  title: string;
  status: FormStatus;
  saveState: SaveState;
  viewport: ViewportMode;
  isPreview: boolean;
  onTitleChange: (newTitle: string) => void;
  onViewportChange: (viewport: ViewportMode) => void;
  onTogglePreview: () => void;
  onPublishToggle: () => void;
  onManualSave: () => void;
  isPublishing: boolean;
}

export function BuilderTopBar({
  formId,
  slug,
  title,
  status,
  saveState,
  viewport,
  isPreview,
  onTitleChange,
  onViewportChange,
  onTogglePreview,
  onPublishToggle,
  onManualSave,
  isPublishing,
}: BuilderTopBarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const isPublished = status === "PUBLISHED";
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/f/${slug}` : `/f/${slug}`;

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim() && tempTitle !== title) {
      onTitleChange(tempTitle.trim());
    } else {
      setTempTitle(title);
    }
  };

  const handleCopyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL", err);
    }
  };

  return (
    <header className="h-16 border-b border-[#E7E2D8] dark:border-[#2E2824] bg-white dark:bg-[#1C1917] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 select-none">
      {/* Left: Back Link & Form Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/forms"
          className="w-9 h-9 rounded-xl border border-[#E7E2D8] dark:border-[#2E2824] flex items-center justify-center text-[#78716C] hover:text-[#1C1917] dark:text-[#A8A29E] dark:hover:text-[#FBF9F5] hover:bg-[#FAF8F5] dark:hover:bg-[#24201D] transition-colors flex-shrink-0"
          title="Back to My Forms"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              autoFocus
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSubmit();
                if (e.key === "Escape") {
                  setTempTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              className="text-sm sm:text-base font-semibold text-[#1C1917] dark:text-[#FBF9F5] bg-[#FAF8F5] dark:bg-[#24201D] px-2.5 py-1 rounded-lg border border-[#FF5A36] focus:outline-none max-w-xs sm:max-w-md"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setTempTitle(title);
                setIsEditingTitle(true);
              }}
              title="Click to rename form"
              className="text-sm sm:text-base font-semibold text-[#1C1917] dark:text-[#FBF9F5] hover:text-[#FF5A36] dark:hover:text-[#FF5A36] truncate max-w-[140px] sm:max-w-xs md:max-w-md text-left px-1.5 py-0.5 rounded-md hover:bg-[#FAF8F5] dark:hover:bg-[#24201D] transition-colors"
            >
              {title || "Untitled Form"}
            </button>
          )}

          {/* Status Badge */}
          {isPublished ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Published
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Center: Save Status & Viewport Toggle */}
      <div className="flex items-center gap-3">
        {/* Autosave Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#78716C] dark:text-[#A8A29E]">
          {saveState === "saving" && (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF5A36]" />
              <span>Saving...</span>
            </>
          )}
          {saveState === "saved" && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Saved</span>
            </>
          )}
          {saveState === "unsaved" && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Unsaved changes</span>
            </>
          )}
          {saveState === "error" && (
            <button
              type="button"
              onClick={onManualSave}
              className="flex items-center gap-1 text-red-500 hover:underline"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Save failed (Retry)</span>
            </button>
          )}
        </div>

        {/* Desktop / Mobile Viewport Switcher */}
        {!isPreview && (
          <div className="hidden sm:inline-flex items-center p-0.5 bg-[#F5F2EB] dark:bg-[#24201D] rounded-xl border border-[#E7E2D8] dark:border-[#2E2824]">
            <button
              type="button"
              onClick={() => onViewportChange("desktop")}
              aria-label="Desktop viewport preview"
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewport === "desktop"
                  ? "bg-white dark:bg-[#1C1917] text-[#1C1917] dark:text-[#FBF9F5] shadow-2xs"
                  : "text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917]"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewportChange("mobile")}
              aria-label="Mobile viewport preview"
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewport === "mobile"
                  ? "bg-white dark:bg-[#1C1917] text-[#1C1917] dark:text-[#FBF9F5] shadow-2xs"
                  : "text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917]"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Right: Preview, Public Link & Publish Action */}
      <div className="flex items-center gap-2">
        {/* Public Form Link (when published) */}
        {isPublished && (
          <div className="hidden lg:flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopyPublicUrl}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#FBF9F5] bg-[#FAF8F5] dark:bg-[#24201D] border border-[#E7E2D8] dark:border-[#2E2824] rounded-xl transition-colors"
              title="Copy public form link"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={`/f/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] dark:text-[#A8A29E] dark:hover:text-[#FBF9F5] rounded-lg transition-colors"
              title="Open public form in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Preview Button Toggle */}
        <Button
          variant={isPreview ? "secondary" : "outline"}
          size="sm"
          onClick={onTogglePreview}
          iconLeft={<Eye className="w-3.5 h-3.5" />}
          className="dark:border-[#2E2824] dark:text-[#E7E2D8]"
        >
          <span className="hidden xs:inline">{isPreview ? "Exit Preview" : "Preview"}</span>
        </Button>

        {/* Publish / Unpublish Button */}
        <Button
          variant={isPublished ? "secondary" : "primary"}
          size="sm"
          onClick={onPublishToggle}
          disabled={isPublishing}
          iconLeft={
            isPublishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )
          }
          className={!isPublished ? "shadow-md shadow-[#FF5A36]/20" : "dark:border-[#2E2824] dark:text-[#E7E2D8]"}
        >
          {isPublishing ? "Updating..." : isPublished ? "Unpublish" : "Publish"}
        </Button>
      </div>
    </header>
  );
}
