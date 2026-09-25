import React from "react";
import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "coral" | "neutral" | "subtle" | "dark";
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "coral",
  className,
  icon,
}: BadgeProps) {
  const variantStyles = {
    coral:
      "bg-[#FFF0EB] dark:bg-[#FF5A36]/10 text-[#FF5A36] border-[#FFD8CC] dark:border-[#FF5A36]/20 shadow-xs",
    neutral:
      "bg-[#F4EFE6] dark:bg-[#1E293B] text-[#57534E] dark:text-[#94A3B8] border-[#E7E2D8] dark:border-[#334155]",
    subtle:
      "bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xs text-[#292524] dark:text-[#F8FAFC] border-[#E7E2D8] dark:border-[#1F2937] shadow-xs",
    dark:
      "bg-[#1C1917] dark:bg-[#0B0F17] text-[#FAF8F5] border-[#292524] dark:border-[#1F2937]",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border transition-all duration-200",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>}
      {children}
    </span>
  );
}
