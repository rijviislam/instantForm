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
    default: "bg-white border-[#EAE3D6] text-[#1C1917]",
    cream: "bg-[#F7F2EA] border-[#E5DEC7] text-[#1C1917]",
    glass: "bg-white/80 backdrop-blur-md border-[#EAE3D6]/90 text-[#1C1917]",
    dark: "bg-[#1C1917] border-[#2E2A27] text-[#FAF8F5]",
    accent: "bg-[#FFF6F3] border-[#FFD8CC] text-[#1C1917]",
  };

  return (
    <div
      className={clsx(
        "rounded-2xl border p-6 card-shadow transition-all duration-300",
        variantStyles[variant],
        hoverEffect && "hover:-translate-y-1 hover:card-shadow-hover hover:border-[#D9CFBE]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
