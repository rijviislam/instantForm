import React from "react";
import Link from "next/link";

export default function PublicFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FF5A36]/20 selection:text-[#FF5A36]">
      {/* Main Respondent Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full min-h-screen">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[11px] text-[#A8A29E] relative z-20">
        Powered by{" "}
        <Link
          href="/"
          target="_blank"
          className="font-medium text-[#78716C] hover:text-[#FF5A36] underline underline-offset-2 transition-colors"
        >
          InstantForm
        </Link>
      </footer>
    </div>
  );
}
