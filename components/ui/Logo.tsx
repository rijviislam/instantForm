import React from "react";
import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";

interface LogoProps {
  className?: string;
  isDark?: boolean;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  className,
  isDark = false,
  iconOnly = false,
  size = "md",
}: LogoProps) {
  const heightClass = {
    sm: "h-7",
    md: "h-8 sm:h-8.5",
    lg: "h-9 sm:h-10",
  }[size];

  return (
    <Link
      href="/"
      className={clsx(
        "inline-flex items-center focus:outline-hidden group select-none shrink-0",
        className
      )}
      aria-label="InstantForm Home"
    >
      {iconOnly ? (
        <Image
          src="/logo-icon.png"
          alt="InstantForm Icon"
          width={40}
          height={32}
          priority
          className={clsx(
            heightClass,
            "w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          )}
        />
      ) : (
        <Image
          src="/logo.png"
          alt="InstantForm Logo"
          width={180}
          height={36}
          priority
          className={clsx(
            heightClass,
            "w-auto object-contain transition-transform duration-200 group-hover:scale-105",
            isDark && "brightness-125 contrast-125"
          )}
        />
      )}
    </Link>
  );
}

