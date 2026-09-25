import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  iconRight,
  iconLeft,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs font-medium rounded-full gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold rounded-full gap-2",
    lg: "px-7 py-3.5 text-base font-semibold rounded-full gap-2.5 shadow-sm",
  };

  const variantStyles = {
    primary:
      "bg-[#FF5A36] text-white hover:bg-[#E44825] active:scale-[0.98] border border-[#FF5A36] shadow-sm hover:shadow-md hover:shadow-[#FF5A36]/20 transition-all duration-200 cursor-pointer",
    secondary:
      "bg-[#F4EFE6] dark:bg-[#1E293B] text-[#1C1917] dark:text-[#F8FAFC] hover:bg-[#ECE5D9] dark:hover:bg-[#2A374D] active:scale-[0.98] border border-[#E7E2D8] dark:border-[#334155] hover:border-[#D8D0C0] dark:hover:border-[#475569] transition-all duration-200 cursor-pointer",
    outline:
      "bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xs text-[#1C1917] dark:text-[#F8FAFC] hover:bg-white dark:hover:bg-[#1E293B] hover:border-[#D0C8B8] dark:hover:border-[#334155] active:scale-[0.98] border border-[#E7E2D8] dark:border-[#1F2937] transition-all duration-200 cursor-pointer",
    ghost:
      "bg-transparent text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] hover:bg-[#F4EFE6]/60 dark:hover:bg-[#1E293B]/60 transition-all duration-200 cursor-pointer",
    dark:
      "bg-[#1C1917] dark:bg-[#0B0F17] text-white hover:bg-[#292524] dark:hover:bg-[#161F30] active:scale-[0.98] border border-[#292524] dark:border-[#1F2937] shadow-sm transition-all duration-200 cursor-pointer",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center select-none font-sans-modern focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF5A36] focus-visible:ring-offset-2",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {iconLeft && <span className="inline-flex shrink-0">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="inline-flex shrink-0">{iconRight}</span>}
    </button>
  );
}
