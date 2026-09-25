import React from "react";
import Link from "next/link";
import { clsx } from "clsx";

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export function Logo({ className, isDark = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={clsx(
        "inline-flex items-center gap-2.5 font-sans-modern group focus:outline-hidden",
        className
      )}
      aria-label="InstantForm Home"
    >
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5A36] to-[#FFA07A] text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
        {/* Abstract stylized form shape icon */}
        <svg
          className="w-4.5 h-4.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="3"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <path
            d="M8 8H16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M8 12H13"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="15.5" cy="15.5" r="2.5" fill="white" />
        </svg>
      </div>

      <div className="flex items-baseline gap-0.5">
        <span
          className={clsx(
            "text-xl font-bold tracking-tight",
            isDark ? "text-white" : "text-[#1C1917] dark:text-[#F8FAFC]"
          )}
        >
          Instant<span className="text-[#FF5A36]">Form</span>
        </span>
      </div>
    </Link>
  );
}
