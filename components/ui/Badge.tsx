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
      "bg-[#FFF0EB] text-[#FF5A36] border-[#FFD8CC] shadow-xs",
    neutral:
      "bg-[#F4EFE6] text-[#57534E] border-[#E7E2D8]",
    subtle:
      "bg-white/80 backdrop-blur-xs text-[#292524] border-[#E7E2D8] shadow-xs",
    dark:
      "bg-[#1C1917] text-[#FAF8F5] border-[#292524]",
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
