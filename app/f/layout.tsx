"use client";

import React, { useEffect } from "react";

export default function PublicFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Force light mode on public links
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.style.colorScheme = "light";
    }
  }, []);

  return (
    <div className="w-full min-h-screen light bg-[#FAF8F5] text-[#1C1917] selection:bg-[#FF5A36]/20 selection:text-[#FF5A36] [color-scheme:light]">
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              document.documentElement.classList.remove('dark');
              document.documentElement.setAttribute('data-theme', 'light');
              document.documentElement.style.colorScheme = 'light';
            } catch (e) {}
          `,
        }}
      />
      {children}
    </div>
  );
}

