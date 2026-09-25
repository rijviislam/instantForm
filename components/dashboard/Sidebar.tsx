"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Inbox,
  Settings,
  Search,
  LogOut,
  User,
  Sun,
  Moon,
  Laptop,
  Plus,
} from "lucide-react";
import { clsx } from "clsx";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onOpenCommandPalette: () => void;
}

export function Sidebar({ user, onOpenCommandPalette }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Forms",
      href: "/forms",
      icon: FileText,
      active: pathname.startsWith("/forms"),
    },
    {
      label: "Templates",
      href: "/templates",
      icon: LayoutTemplate,
      active: pathname.startsWith("/templates"),
    },
    {
      label: "Responses",
      href: "/responses",
      icon: Inbox,
      active: pathname.startsWith("/responses"),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowProfileMenu(false);
      }}
      className={clsx(
        "hidden md:flex flex-col justify-between fixed top-0 left-0 bottom-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-r border-[#E7E2D8] dark:border-[#1F2937] transition-all duration-300 ease-out shadow-xs select-none",
        isHovered ? "w-60 shadow-xl shadow-[#1C1917]/5 dark:shadow-black/20" : "w-18"
      )}
      aria-label="Desktop Sidebar Navigation"
    >
      {/* Top Brand & Navigation */}
      <div className="flex flex-col p-3">
        {/* Logo / Brand Header */}
        <div className="flex items-center h-12 px-2.5 mb-4 overflow-hidden">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 focus:outline-hidden group"
            aria-label="InstantForm Dashboard"
          >
            <div className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-tr from-[#FF5A36] to-[#FFA07A] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="2.2" />
                <path d="M8 8H16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M8 12H13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="15.5" cy="15.5" r="2.5" fill="white" />
              </svg>
            </div>
            <div
              className={clsx(
                "flex items-baseline whitespace-nowrap transition-opacity duration-200 font-sans-modern",
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <span className="text-base font-bold text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
                Instant<span className="text-[#FF5A36]">Form</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Quick New Form Button */}
        <div className="mb-4 px-1">
          <button
            type="button"
            onClick={() => router.push("/forms/new")}
            className={clsx(
              "w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#FF5A36] hover:bg-[#E44825] active:scale-[0.98] text-white font-semibold text-xs shadow-xs hover:shadow-md hover:shadow-[#FF5A36]/20 transition-all cursor-pointer overflow-hidden",
              isHovered ? "px-3" : "px-0"
            )}
            title="Create New Form"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span
              className={clsx(
                "whitespace-nowrap transition-opacity duration-200",
                isHovered ? "opacity-100" : "opacity-0 w-0 hidden"
              )}
            >
              New Form
            </span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5" aria-label="Sidebar main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group overflow-hidden",
                  item.active
                    ? "bg-[#FFF0EB] dark:bg-[#FF5A36]/15 text-[#FF5A36] font-semibold"
                    : "text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-[#F4EFE6]/70 dark:hover:bg-[#1F2937]/70"
                )}
                title={!isHovered ? item.label : undefined}
                aria-current={item.active ? "page" : undefined}
              >
                {/* Active route accent bar */}
                {item.active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#FF5A36] rounded-r-full" />
                )}

                <Icon className={clsx("w-5 h-5 shrink-0 transition-colors", item.active ? "text-[#FF5A36]" : "text-[#78716C] dark:text-[#64748B] group-hover:text-[#1C1917] dark:group-hover:text-[#F8FAFC]")} />

                <span
                  className={clsx(
                    "whitespace-nowrap transition-opacity duration-200",
                    isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls (Command Palette, Theme, Profile) */}
      <div className="flex flex-col p-3 border-t border-[#E7E2D8] dark:border-[#1F2937] gap-2">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-[#F4EFE6]/70 dark:hover:bg-[#1F2937]/70 transition-colors cursor-pointer w-full overflow-hidden",
            isHovered ? "justify-between" : "justify-center"
          )}
          title="Search / Command Palette (Cmd + K)"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 shrink-0 text-[#78716C] dark:text-[#64748B]" />
            <span
              className={clsx(
                "whitespace-nowrap transition-opacity duration-200",
                isHovered ? "opacity-100" : "opacity-0 hidden"
              )}
            >
              Search
            </span>
          </div>
          {isHovered && (
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-[#78716C] dark:text-[#94A3B8] bg-[#F4EFE6] dark:bg-[#1F2937] border border-[#E7E2D8] dark:border-[#374151] rounded-md">
              {isMac ? "⌘K" : "Ctrl+K"}
            </kbd>
          )}
        </button>

        {/* Theme Switcher in Expanded State */}
        {isHovered && (
          <div className="flex items-center justify-between p-1 bg-[#FAF8F5] dark:bg-[#0D131F] rounded-xl border border-[#E7E2D8] dark:border-[#1F2937] text-[11px] text-[#78716C] dark:text-[#94A3B8] animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={clsx(
                "flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer",
                theme === "light"
                  ? "bg-white dark:bg-[#1E293B] text-[#FF5A36] font-semibold shadow-2xs"
                  : "hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
              )}
              title="Light theme"
            >
              <Sun className="w-3 h-3" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={clsx(
                "flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer",
                theme === "dark"
                  ? "bg-white dark:bg-[#1E293B] text-[#FF5A36] font-semibold shadow-2xs"
                  : "hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
              )}
              title="Dark theme"
            >
              <Moon className="w-3 h-3" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={clsx(
                "flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer",
                theme === "system"
                  ? "bg-white dark:bg-[#1E293B] text-[#FF5A36] font-semibold shadow-2xs"
                  : "hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
              )}
              title="System theme"
            >
              <Laptop className="w-3 h-3" />
              <span>Auto</span>
            </button>
          </div>
        )}

        {/* Profile Card & Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={clsx(
              "w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F4EFE6]/70 dark:hover:bg-[#1F2937]/70 transition-colors cursor-pointer text-left focus:outline-hidden",
              isHovered ? "justify-start" : "justify-center"
            )}
            title={user?.name || user?.email || "Account"}
            aria-expanded={showProfileMenu}
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User avatar"}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E7E2D8] dark:border-[#374151]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#FFF0EB] dark:bg-[#FF5A36]/20 border border-[#FFD8CC] dark:border-[#FF5A36]/30 text-[#FF5A36] font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>
            )}

            {isHovered && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs font-bold text-[#1C1917] dark:text-[#F8FAFC] truncate leading-tight">
                  {user?.name || "Creator"}
                </p>
                <p className="text-[11px] text-[#78716C] dark:text-[#94A3B8] truncate leading-tight mt-0.5">
                  {user?.email || "InstantForm"}
                </p>
              </div>
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute bottom-14 left-0 w-52 bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E7E2D8] dark:border-[#334155] p-1.5 shadow-lg shadow-[#1C1917]/10 dark:shadow-black/40 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-[#F4EFE6] dark:border-[#334155] mb-1">
                <p className="text-xs font-bold text-[#1C1917] dark:text-[#F8FAFC] truncate">{user?.name || "Creator"}</p>
                <p className="text-[11px] text-[#78716C] dark:text-[#94A3B8] truncate">{user?.email}</p>
              </div>

              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-[#FAF8F5] dark:hover:bg-[#0F172A] transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#78716C] dark:text-[#94A3B8]" />
                <span>Settings</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-[#E44825] dark:text-[#FF6B4A] hover:bg-[#FFF0EB] dark:hover:bg-[#FF5A36]/15 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#E44825] dark:text-[#FF6B4A]" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
