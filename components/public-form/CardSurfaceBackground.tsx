import React from "react";
import { FormTheme } from "@/lib/form-theme";

interface CardSurfaceBackgroundProps {
  theme: FormTheme;
}

/**
 * Renders the Main Card Surface background image layer with adjustable blur
 * and overlay color without blurring any form inputs, labels, or content inside.
 */
export const CardSurfaceBackground: React.FC<CardSurfaceBackgroundProps> = ({ theme }) => {
  const container = theme.container;
  if (container.backgroundType !== "image" || !container.imageUrl) {
    return null;
  }

  const blurAmount = container.imageBlur ?? container.bgBlur ?? 0;
  const overlayOpacity = container.overlayOpacity ?? 0;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ borderRadius: "inherit" }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-[-20px] transition-all duration-200"
        style={{
          backgroundImage: `url("${container.imageUrl}")`,
          backgroundPosition: container.imagePosition || "center",
          backgroundSize: container.imageSize || "cover",
          backgroundRepeat: container.imageRepeat || "no-repeat",
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
          transform: blurAmount > 0 ? "scale(1.08)" : undefined,
        }}
      />
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 transition-all duration-200"
          style={{
            backgroundColor: container.overlayColor || "#000000",
            opacity: overlayOpacity / 100,
          }}
        />
      )}
    </div>
  );
};
