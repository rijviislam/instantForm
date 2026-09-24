"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Inbox,
  Settings,
  Search,
  LogOut,
  Plus,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { clsx } from "clsx";

interface MobileDrawerProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onOpenCommandPalette: () => void;
}

export function MobileDrawer({ user, onOpenCommandPalette }: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

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

  return (
    <>
      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-[#E7E2D8] sticky top-0 z-30">
        <Logo />

        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] text-[#57534E] hover:text-[#1C1917] transition-colors focus:outline-hidden"
            aria-label="Open command palette"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* New Form CTA */}
          <button
            type="button"
            onClick={() => router.push("/forms/new")}
            className="p-2 rounded-xl bg-[#FF5A36] text-white hover:bg-[#E44825] transition-colors shadow-2xs"
            aria-label="Create new form"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] text-[#1C1917] hover:bg-[#ECE5D9] transition-colors focus:outline-hidden"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="fixed inset-0 z-50 bg-[#1C1917]/40 backdrop-blur-xs flex md:hidden animate-in fade-in duration-200"
        >
          <div className="w-4/5 max-w-sm bg-[#FAF8F5] h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#EAE3D6] mb-6">
                <Logo />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-white border border-[#E7E2D8] text-[#57534E]"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-1.5 mb-6" aria-label="Mobile navigation list">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-colors",
                        item.active
                          ? "bg-[#FFF0EB] text-[#FF5A36] font-semibold border border-[#FFD8CC]"
                          : "text-[#1C1917] hover:bg-white border border-transparent"
                      )}
                    >
                      <Icon className={clsx("w-5 h-5", item.active ? "text-[#FF5A36]" : "text-[#78716C]")} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Search shortcut row */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenCommandPalette();
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-[#E7E2D8] text-sm text-[#57534E] hover:text-[#1C1917] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#78716C]" />
                  <span>Command Palette</span>
                </span>
                <kbd className="px-2 py-0.5 text-[10px] font-semibold bg-[#F4EFE6] border border-[#E7E2D8] rounded-md">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Bottom Profile & Actions */}
            <div className="pt-6 border-t border-[#EAE3D6] flex flex-col gap-4">
              {/* Theme Switcher */}
              <div className="flex items-center justify-between p-1 bg-white rounded-xl border border-[#E7E2D8] text-xs text-[#78716C]">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={clsx(
                    "flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all",
                    theme === "light" ? "bg-[#FAF8F5] text-[#FF5A36] font-semibold shadow-2xs" : ""
                  )}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={clsx(
                    "flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all",
                    theme === "dark" ? "bg-[#FAF8F5] text-[#FF5A36] font-semibold shadow-2xs" : ""
                  )}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={clsx(
                    "flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all",
                    theme === "system" ? "bg-[#FAF8F5] text-[#FF5A36] font-semibold shadow-2xs" : ""
                  )}
                >
                  <Laptop className="w-3.5 h-3.5" /> Auto
                </button>
              </div>

              {/* User info & Sign out */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0EB] border border-[#FFD8CC] text-[#FF5A36] font-bold text-xs flex items-center justify-center shrink-0">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1C1917] truncate">{user?.name || "Creator"}</p>
                    <p className="text-[11px] text-[#78716C] truncate">{user?.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-[#E44825] hover:bg-[#FFF0EB] border border-transparent hover:border-[#FFD8CC] transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dismiss background area */}
          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
