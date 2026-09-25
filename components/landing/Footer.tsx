"use client";

import React, { useState } from "react";
import { Logo } from "../ui/Logo";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  Sun,
  Moon,
  Laptop,
  Globe,
} from "lucide-react";

export function Footer() {
  const { theme: selectedTheme, setTheme: setSelectedTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "bn">("en");

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Templates", href: "#templates" },
      { name: "How it works", href: "#how-it-works" },
      { name: "Form Styles", href: "#form-styles" },
      { name: "Responses & Analytics", href: "#analytics" },
    ],
    resources: [
      { name: "Help Center", href: "#faq" },
      { name: "Documentation", href: "#faq" },
      { name: "Guides & Tutorials", href: "#faq" },
      { name: "FAQ", href: "#faq" },
      { name: "API Reference", href: "#faq" },
    ],
    company: [
      { name: "About InstantForm", href: "#" },
      { name: "Customer Stories", href: "#" },
      { name: "Design Philosophy", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact Team", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Security & GDPR", href: "#" },
      { name: "Cookie Settings", href: "#" },
    ],
  };

  return (
    <footer className="bg-white dark:bg-[#0B0F17] border-t border-[#EAE3D6] dark:border-[#1F2937] pt-16 pb-12 text-[#57534E] dark:text-[#94A3B8] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-14 border-b border-[#EAE3D6] dark:border-[#1F2937]">
          {/* Brand info (4 cols) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Logo />
            <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8] max-w-sm leading-relaxed">
              InstantForm is the design-first form builder for creators who care about visual craft and respondent joy.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#78716C] dark:text-[#94A3B8]">
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8] flex items-center justify-center hover:text-[#FF5A36] dark:hover:text-[#FF5A36] hover:border-[#FFD8CC] dark:hover:border-[#FF5A36]/40 transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8] flex items-center justify-center hover:text-[#FF5A36] dark:hover:text-[#FF5A36] hover:border-[#FFD8CC] dark:hover:border-[#FF5A36]/40 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#FAF8F5] dark:bg-[#161F30] border border-[#EAE3D6] dark:border-[#293548] text-[#78716C] dark:text-[#94A3B8] flex items-center justify-center hover:text-[#FF5A36] dark:hover:text-[#FF5A36] hover:border-[#FFD8CC] dark:hover:border-[#FF5A36]/40 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72-.77-1.72-1.72s.77-1.72 1.72-1.72 1.72.77 1.72 1.72-.77 1.72-1.72 1.72m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#1C1917] dark:text-[#F8FAFC] uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#1C1917] dark:text-[#F8FAFC] uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#1C1917] dark:text-[#F8FAFC] uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#1C1917] dark:text-[#F8FAFC] uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Controls & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C] dark:text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <span>© 2026 InstantForm. All rights reserved. Crafted with care.</span>
          </div>

          {/* Controls: Theme & Language */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Language dropdown / toggle */}
            <div className="flex items-center bg-[#FAF8F5] dark:bg-[#161F30] p-1 rounded-full border border-[#EAE3D6] dark:border-[#293548]">
              <span className="px-2 text-[11px] text-[#78716C] dark:text-[#94A3B8] flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#FF5A36]" />
              </span>
              <button
                type="button"
                onClick={() => setSelectedLanguage("en")}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                  selectedLanguage === "en"
                    ? "bg-white dark:bg-[#1E293B] text-[#1C1917] dark:text-[#F8FAFC] shadow-xs"
                    : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage("bn")}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                  selectedLanguage === "bn"
                    ? "bg-white dark:bg-[#1E293B] text-[#1C1917] dark:text-[#F8FAFC] shadow-xs"
                    : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                }`}
              >
                বাংলা (Bangla)
              </button>
            </div>

            {/* Theme visual switcher */}
            <div className="flex items-center bg-[#FAF8F5] dark:bg-[#161F30] p-1 rounded-full border border-[#EAE3D6] dark:border-[#293548]">
              <button
                type="button"
                onClick={() => setSelectedTheme("light")}
                className={`p-1 rounded-full transition-all cursor-pointer ${
                  selectedTheme === "light"
                    ? "bg-white dark:bg-[#1E293B] text-[#FF5A36] shadow-xs"
                    : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                }`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedTheme("dark")}
                className={`p-1 rounded-full transition-all cursor-pointer ${
                  selectedTheme === "dark"
                    ? "bg-white dark:bg-[#1E293B] text-[#FF5A36] shadow-xs"
                    : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                }`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedTheme("system")}
                className={`p-1 rounded-full transition-all cursor-pointer ${
                  selectedTheme === "system"
                    ? "bg-white dark:bg-[#1E293B] text-[#FF5A36] shadow-xs"
                    : "text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC]"
                }`}
                title="System Theme"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
