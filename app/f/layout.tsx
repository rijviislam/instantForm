import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function PublicFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#141210] text-[#1C1917] dark:text-[#FBF9F5] flex flex-col justify-between selection:bg-[#FF5A36]/20 selection:text-[#FF5A36]">
      {/* Minimal Top Brand Badge */}
      <header className="py-4 px-6 flex items-center justify-between">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] dark:text-[#A8A29E] dark:hover:text-[#FBF9F5] transition-colors"
        >
          <div className="w-5 h-5 rounded-md bg-[#FF5A36] text-white flex items-center justify-center font-bold text-[10px]">
            iF
          </div>
          <span>InstantForm</span>
        </Link>
      </header>

      {/* Main Respondent Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[11px] text-[#A8A29E] dark:text-[#78716C]">
        Powered by{" "}
        <Link
          href="/"
          target="_blank"
          className="font-medium text-[#78716C] dark:text-[#A8A29E] hover:text-[#FF5A36] underline underline-offset-2 transition-colors"
        >
          InstantForm
        </Link>
      </footer>
    </div>
  );
}
