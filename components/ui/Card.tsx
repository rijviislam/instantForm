import React from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "cream" | "glass" | "dark" | "accent";
  hoverEffect?: boolean;
}

export function Card({
  children,
  variant = "default",
  hoverEffect = false,
  className,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white dark:bg-[#111827] border-[#EAE3D6] dark:border-[#1F2937] text-[#1C1917] dark:text-[#F8FAFC]",
    cream: "bg-[#F7F2EA] dark:bg-[#161F30] border-[#E5DEC7] dark:border-[#293548] text-[#1C1917] dark:text-[#F8FAFC]",
    glass: "bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-[#EAE3D6]/90 dark:border-[#1F2937]/90 text-[#1C1917] dark:text-[#F8FAFC]",
    dark: "bg-[#1C1917] dark:bg-[#0B0F17] border-[#2E2A27] dark:border-[#1F2937] text-[#FAF8F5]",
    accent: "bg-[#FFF6F3] dark:bg-[#FF5A36]/10 border-[#FFD8CC] dark:border-[#FF5A36]/20 text-[#1C1917] dark:text-[#F8FAFC]",
  };

  return (
    <div
      className={clsx(
        "rounded-2xl border p-6 card-shadow transition-all duration-300",
        variantStyles[variant],
        hoverEffect && "hover:-translate-y-1 hover:card-shadow-hover hover:border-[#D9CFBE] dark:hover:border-[#374151]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
