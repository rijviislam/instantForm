"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Share2,
  Code2,
  QrCode,
  Sparkles,
  BarChart3,
  Mail,
  MessageCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { getPublicFormUrl } from "@/lib/api-client";

interface ShareFormModalProps {
  isOpen: boolean;
  slug: string;
  formId: string;
  formTitle: string;
  isInitialPublish?: boolean;
  onClose: () => void;
}

export function ShareFormModal({
  isOpen,
  slug,
  formId,
  formTitle,
  isInitialPublish = false,
  onClose,
}: ShareFormModalProps) {
  const [activeTab, setActiveTab] = useState<"link" | "embed" | "qr">("link");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const publicUrl = getPublicFormUrl(slug);

  const embedSnippet = `<iframe\n  src="${publicUrl}"\n  width="100%"\n  height="700px"\n  frameborder="0"\n  style="border: none; border-radius: 16px; max-width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.08);"\n  title="${formTitle || "InstantForm"}"\n></iframe>`;

  // Trigger confetti when opened initially on publish
  useEffect(() => {
    if (isOpen && isInitialPublish) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF5A36", "#FF7A59", "#10B981", "#3B82F6", "#F59E0B"],
        });
      } catch {
        // Safe fallback if canvas-confetti fails
      }
    }
  }, [isOpen, isInitialPublish]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    } catch (err) {
      console.error("Failed to copy embed code", err);
    }
  };

  // Social Share URLs
  const encodedUrl = encodeURIComponent(publicUrl);
  const encodedTitle = encodeURIComponent(`Fill out "${formTitle || "Form"}" on InstantForm:`);

  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const shareLinkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const shareWhatsapp = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const shareEmail = `mailto:?subject=${encodeURIComponent(formTitle || "Form")}&body=${encodedTitle}%20${encodedUrl}`;

  // QR Code generator using standard public QR API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(publicUrl)}&color=1C1917&bgcolor=FFFFFF`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-dialog-title"
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#111827] border border-[#EAE3D6] dark:border-[#1F2937] p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 fade-in duration-200 flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF5F2] dark:bg-[#FF5A36]/10 border border-[#FFE2DB] dark:border-[#FF5A36]/20 flex items-center justify-center text-[#FF5A36] shrink-0">
            {isInitialPublish ? (
              <Sparkles className="w-5 h-5 animate-spin-slow text-[#FF5A36]" />
            ) : (
              <Globe className="w-5 h-5 text-[#FF5A36]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                id="share-dialog-title"
                className="text-lg font-bold text-[#1C1917] dark:text-[#F8FAFC] font-serif-editorial"
              >
                {isInitialPublish ? "Your Form is Live!" : "Share Published Form"}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-0.5 line-clamp-1">
              {formTitle || "Untitled Form"}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] dark:bg-[#1E293B] rounded-2xl border border-[#EAE3D6] dark:border-[#334155] mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === "link"
                ? "bg-white dark:bg-[#0F172A] text-[#1C1917] dark:text-[#F8FAFC] shadow-xs"
                : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Public Link</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("embed")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === "embed"
                ? "bg-white dark:bg-[#0F172A] text-[#1C1917] dark:text-[#F8FAFC] shadow-xs"
                : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Embed HTML</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === "qr"
                ? "bg-white dark:bg-[#0F172A] text-[#1C1917] dark:text-[#F8FAFC] shadow-xs"
                : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>QR Code</span>
          </button>
        </div>

        {/* Tab 1: Share Link */}
        {activeTab === "link" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#57534E] dark:text-[#94A3B8] mb-1.5">
                Shareable Form URL
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-xs sm:text-sm font-mono text-[#1C1917] dark:text-[#F8FAFC] truncate select-all">
                  {publicUrl}
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer ${
                    copiedLink
                      ? "bg-emerald-600 text-white"
                      : "bg-[#FF5A36] text-white hover:bg-[#E04826]"
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Actions: Open Form in New Tab */}
            <div className="flex items-center justify-between pt-1">
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF5A36] hover:text-[#E04826] hover:underline"
              >
                <span>Open Live Form in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {formId && (
                <Link
                  href={`/forms/${formId}/responses`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>View Responses</span>
                </Link>
              )}
            </div>

            {/* Social Share Buttons */}
            <div className="pt-3 border-t border-[#EAE3D6] dark:border-[#1F2937]">
              <span className="block text-[11px] font-semibold text-[#78716C] dark:text-[#94A3B8] mb-2 uppercase tracking-wider">
                Quick Share
              </span>
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={shareTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#EAE3D6] dark:border-[#293548] hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors text-[11px] font-medium gap-1 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-[#1DA1F2]" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X / Twitter</span>
                </a>
                <a
                  href={shareLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#EAE3D6] dark:border-[#293548] hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors text-[11px] font-medium gap-1 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a
                  href={shareWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#EAE3D6] dark:border-[#293548] hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors text-[11px] font-medium gap-1"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={shareEmail}
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#EAE3D6] dark:border-[#293548] hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B] text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors text-[11px] font-medium gap-1"
                >
                  <Mail className="w-4 h-4 text-[#EA4335]" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Embed Code */}
        {activeTab === "embed" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#57534E] dark:text-[#94A3B8]">
                  Iframe Embed Code
                </label>
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF5A36] hover:text-[#E04826] cursor-pointer"
                >
                  {copiedEmbed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied Snippet!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy HTML</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={embedSnippet}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                className="w-full p-3 bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] rounded-xl text-xs font-mono text-[#1C1917] dark:text-[#F8FAFC] resize-none focus:outline-none focus:border-[#FF5A36] select-all"
              />
            </div>
            <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
              Paste this snippet into any website (WordPress, Webflow, Notion, Shopify, custom HTML) to embed your form directly on your page.
            </p>
          </div>
        )}

        {/* Tab 3: QR Code */}
        {activeTab === "qr" && (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-white rounded-2xl border border-[#EAE3D6] dark:border-[#293548] max-w-[200px] mx-auto shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt={`QR code for ${formTitle}`}
                width={180}
                height={180}
                className="w-44 h-44 rounded-lg object-contain"
              />
            </div>
            <p className="text-xs text-[#78716C] dark:text-[#94A3B8] max-w-xs mx-auto">
              Scan with any mobile camera to open and fill out this form immediately.
            </p>
            <div>
              <a
                href={qrCodeUrl}
                download={`${slug}-qr-code.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1C1917] dark:text-[#F8FAFC] bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#EAE3D6] dark:border-[#334155] rounded-xl hover:border-[#FF5A36] transition-colors"
              >
                <span>Open Full QR Image</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[#EAE3D6] dark:border-[#1F2937]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
