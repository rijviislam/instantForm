"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Search,
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Inbox,
  Settings,
  Plus,
  LogOut,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { registerGSAP, prefersReducedMotion, gsap } from "@/lib/animations/gsapUtils";
import { getFormsApi, FormItem } from "@/lib/api-client";
import { clsx } from "clsx";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  category: "Navigation" | "Actions" | "Account" | "Your Forms";
  keywords: string[];
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userForms, setUserForms] = useState<FormItem[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isKeyboardNavRef = useRef(false);

  // Prevent background scrolling when search modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Fetch recent user forms when modal opens to make command search rich & scrollable
  useEffect(() => {
    if (isOpen) {
      getFormsApi({ limit: 30 }).then((res) => {
        if (res.success && res.data) {
          setUserForms(res.data);
        }
      });
    }
  }, [isOpen]);

  const baseCommands: CommandItem[] = [
    {
      id: "new-form",
      label: "Create a new form",
      category: "Actions",
      keywords: ["new", "create", "form", "builder", "add"],
      icon: Plus,
      shortcut: "N",
      action: () => router.push("/forms/new"),
    },
    {
      id: "dashboard",
      label: "Dashboard",
      category: "Navigation",
      keywords: ["dashboard", "home", "overview", "metrics", "stats"],
      icon: LayoutDashboard,
      shortcut: "D",
      action: () => router.push("/dashboard"),
    },
    {
      id: "forms",
      label: "Forms Management",
      category: "Navigation",
      keywords: ["forms", "my forms", "manage", "list", "surveys"],
      icon: FileText,
      shortcut: "F",
      action: () => router.push("/forms"),
    },
    {
      id: "templates",
      label: "Template Gallery",
      category: "Navigation",
      keywords: ["templates", "library", "examples", "gallery"],
      icon: LayoutTemplate,
      shortcut: "T",
      action: () => router.push("/templates"),
    },
    {
      id: "responses",
      label: "Responses & Submissions",
      category: "Navigation",
      keywords: ["responses", "submissions", "analytics", "data", "results"],
      icon: Inbox,
      shortcut: "R",
      action: () => router.push("/responses"),
    },
    {
      id: "settings",
      label: "Settings",
      category: "Navigation",
      keywords: ["settings", "preferences", "account", "profile"],
      icon: Settings,
      shortcut: "S",
      action: () => router.push("/settings"),
    },
    {
      id: "profile",
      label: "Profile & Account",
      category: "Account",
      keywords: ["profile", "account", "user", "avatar"],
      icon: User,
      action: () => router.push("/settings"),
    },
    {
      id: "logout",
      label: "Sign out",
      category: "Account",
      keywords: ["logout", "sign out", "exit", "leave"],
      icon: LogOut,
      action: () => signOut({ callbackUrl: "/login" }),
    },
  ];

  // Map user forms to searchable items
  const formCommands: CommandItem[] = userForms.map((form) => ({
    id: `form-${form.id}`,
    label: form.title || "Untitled Form",
    category: "Your Forms",
    keywords: ["form", form.title, form.description || "", form.style || ""],
    icon: Sparkles,
    action: () => router.push(`/forms/${form.id}/edit`),
  }));

  const allCommands = [...baseCommands, ...formCommands];

  // Filter commands by search query
  const filteredCommands = allCommands.filter((cmd) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query) ||
      cmd.keywords.some((k) => k.toLowerCase().includes(query))
    );
  });

  // Focus input and trigger entrance animation when opened
  useEffect(() => {
    registerGSAP();

    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      isKeyboardNavRef.current = false;
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      if (!prefersReducedMotion() && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.96, y: -8 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.out",
            clearProps: "transform",
          }
        );
      }

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keep selected item scrolled into view ONLY when keyboard navigation was used
  useEffect(() => {
    if (isKeyboardNavRef.current && listRef.current) {
      const selectedEl = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement | null;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  // Global Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="InstantForm Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 pb-12 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === containerRef.current) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl border border-[#EAE3D6] dark:border-[#1F2937] card-shadow shadow-2xl overflow-hidden flex flex-col font-sans-modern my-auto sm:my-0 shrink-0"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EAE3D6] dark:border-[#1F2937] bg-white dark:bg-[#111827] shrink-0">
          <Search className="w-5 h-5 text-[#FF5A36] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
              isKeyboardNavRef.current = false;
            }}
            placeholder="Type a command or search forms..."
            className="w-full bg-transparent text-base text-[#1C1917] dark:text-[#F8FAFC] placeholder:text-[#A8A29E] dark:placeholder:text-[#64748B] focus:outline-none font-medium"
            aria-autocomplete="list"
            aria-controls="command-list"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-semibold text-[#78716C] dark:text-[#94A3B8] bg-[#FAF8F5] dark:bg-[#1F2937] border border-[#EAE3D6] dark:border-[#374151] rounded-md shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List with smooth, robust scrolling */}
        <div
          ref={listRef}
          id="command-list"
          role="listbox"
          tabIndex={0}
          className="max-h-[60vh] sm:max-h-[380px] overflow-y-auto p-2 space-y-1 overscroll-contain focus:outline-none"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#78716C] dark:text-[#94A3B8]">
              No results found for &ldquo;<span className="text-[#1C1917] dark:text-[#F8FAFC] font-semibold">{search}</span>&rdquo;
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={item.id}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onMouseMove={() => {
                    isKeyboardNavRef.current = false;
                    if (selectedIndex !== index) {
                      setSelectedIndex(index);
                    }
                  }}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className={clsx(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer select-none",
                    isSelected
                      ? "bg-[#FFF0EB] dark:bg-[#FF5A36]/15 text-[#FF5A36] dark:text-[#FF6B4A] font-semibold"
                      : "text-[#1C1917] dark:text-[#F8FAFC] hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B]/70"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={clsx(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        isSelected
                          ? "bg-[#FF5A36] text-white"
                          : "bg-[#FAF8F5] dark:bg-[#1F2937] text-[#78716C] dark:text-[#94A3B8] border border-[#EAE3D6] dark:border-[#374151]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8] font-normal uppercase tracking-wider">
                      {item.category}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-[#FF5A36] dark:text-[#FF6B4A]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-5 py-2.5 bg-[#FAF8F5] dark:bg-[#0D131F] border-t border-[#EAE3D6] dark:border-[#1F2937] flex items-center justify-between text-xs text-[#78716C] dark:text-[#94A3B8] shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-[#1F2937] border border-[#EAE3D6] dark:border-[#374151] rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-[#1F2937] border border-[#EAE3D6] dark:border-[#374151] rounded">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-[#1F2937] border border-[#EAE3D6] dark:border-[#374151] rounded">↵</kbd>
              <span>Select</span>
            </span>
          </div>
          <span className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">InstantForm Search</span>
        </div>
      </div>
    </div>
  );
}


