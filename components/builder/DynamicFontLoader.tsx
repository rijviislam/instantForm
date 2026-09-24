"use client";

import React, { useEffect } from "react";
import { FormTheme, GOOGLE_FONTS_LIST } from "@/lib/form-theme";

interface DynamicFontLoaderProps {
  theme?: FormTheme;
}

export function DynamicFontLoader({ theme }: DynamicFontLoaderProps) {
  useEffect(() => {
    if (!theme) return;

    const fontsToLoad = new Set<string>();

    if (theme.typography?.fontFamily) {
      const f = GOOGLE_FONTS_LIST.find((item) => item.name === theme.typography.fontFamily);
      if (f?.google) fontsToLoad.add(f.google);
    }

    if (theme.typography?.headingFont) {
      const f = GOOGLE_FONTS_LIST.find((item) => item.name === theme.typography.headingFont);
      if (f?.google) fontsToLoad.add(f.google);
    }

    // Inject Google Font link tags if not already loaded
    fontsToLoad.forEach((googleParam) => {
      const id = `google-font-${googleParam.replace(/[^a-zA-Z0-9]/g, "-")}`;
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${googleParam}&display=swap`;
        document.head.appendChild(link);
      }
    });

    // Custom Font file support (@font-face)
    if (theme.typography?.customFontUrl) {
      const customFontId = "custom-user-font-face";
      let styleTag = document.getElementById(customFontId) as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = customFontId;
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = `
        @font-face {
          font-family: 'CustomFormFont';
          src: url('${theme.typography.customFontUrl}');
          font-display: swap;
        }
      `;
    }
  }, [theme?.typography?.fontFamily, theme?.typography?.headingFont, theme?.typography?.customFontUrl]);

  return null;
}
