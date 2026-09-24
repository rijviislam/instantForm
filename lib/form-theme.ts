import React from "react";
import { FormStyle } from "./api-client";

export interface FormThemeBackground {
  type: "solid" | "gradient" | "image";
  color: string;
  gradientType: "linear" | "radial";
  gradientDirection: string; // "to bottom", "to right", "135deg", "to bottom right"
  gradientFrom: string;
  gradientTo: string;
  gradientVia?: string;
  imageUrl?: string;
  imagePosition: "center" | "top" | "bottom" | "left" | "right";
  imageSize: "cover" | "contain" | "auto";
  imageRepeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  overlayColor: string;
  overlayOpacity: number; // 0 - 100
  blur: number; // 0 - 24px
}

export interface FormThemeTypography {
  fontFamily: string;
  headingFont?: string;
  bodyFont?: string;
  customFontName?: string;
  customFontUrl?: string; // .woff, .woff2, .ttf, .otf
  fontSize: "sm" | "base" | "lg" | "xl";
  headingSize: "base" | "lg" | "xl" | "2xl" | "3xl";
  fontWeight: "normal" | "medium" | "semibold" | "bold";
  lineHeight: "tight" | "normal" | "relaxed" | "loose";
  letterSpacing: "tighter" | "normal" | "wide" | "widest";
  headingColor?: string;
  descriptionColor?: string;
}

export interface FormThemeContainer {
  // Background
  backgroundType?: "solid" | "gradient" | "image";
  backgroundColor: string;
  backgroundOpacity: number; // 0 - 100
  gradientType?: "linear" | "radial";
  gradientDirection?: string; // e.g. "135deg", "to bottom", "to right"
  gradientFrom?: string;
  gradientTo?: string;
  gradientVia?: string;
  imageUrl?: string;
  imagePosition?: "center" | "top" | "bottom" | "left" | "right";
  imageSize?: "cover" | "contain" | "auto";
  imageRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  overlayColor?: string;
  overlayOpacity?: number; // 0 - 100
  bgBlur?: number; // 0 - 24px
  imageBlur?: number; // 0 - 40px

  // Sizing
  maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "custom";
  customMaxWidth?: number; // in px
  minHeight?: number | "none"; // in px

  // Border Radius
  borderRadius: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "custom";
  customBorderRadius?: number; // in px
  individualRadius?: boolean;
  radiusTopLeft?: number;
  radiusTopRight?: number;
  radiusBottomLeft?: number;
  radiusBottomRight?: number;

  // Border
  borderWidth: "none" | "thin" | "medium" | "thick" | "custom";
  customBorderWidth?: number; // in px
  borderStyle: "solid" | "dashed" | "dotted" | "double" | "none";
  borderColor: string;
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;

  // Shadow
  boxShadow: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "soft" | "glow" | "inner" | "custom";
  customShadowX?: number;
  customShadowY?: number;
  customShadowBlur?: number;
  customShadowSpread?: number;
  customShadowColor?: string;
  customShadowOpacity?: number;
  customShadowInset?: boolean;

  // Padding & Spacing
  padding: "sm" | "md" | "lg" | "xl" | "custom";
  customPadding?: number; // in px
  individualPadding?: boolean;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;

  // Effects
  glassBlur: number; // 0 - 30px
  opacity?: number; // 0 - 100
}

export type FieldCardStylePreset =
  | "default"
  | "solid"
  | "glassmorphism"
  | "outline"
  | "soft"
  | "minimal"
  | "neumorphism"
  | "gradient"
  | "transparent"
  | "custom";

export interface FormThemeFieldCard {
  // Preset
  preset?: FieldCardStylePreset;

  // Background
  backgroundType?: "solid" | "gradient" | "transparent" | "glass" | "image";
  backgroundColor: string;
  backgroundOpacity?: number; // 0 - 100
  gradientType?: "linear" | "radial";
  gradientDirection?: string; // "135deg", "to bottom", "to right", etc.
  gradientFrom?: string;
  gradientTo?: string;
  gradientVia?: string;
  imageUrl?: string;
  imagePosition?: "center" | "top" | "bottom" | "left" | "right";
  imageSize?: "cover" | "contain" | "auto";
  imageRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  overlayColor?: string;
  overlayOpacity?: number; // 0 - 100

  // Glassmorphism effect
  glassEnabled?: boolean;
  glassBlur?: number; // 0 - 30px (e.g. 12px)
  glassOpacity?: number; // 0 - 100
  glassHighlight?: boolean;
  glassHighlightOpacity?: number; // 0 - 100

  // Border
  borderEnabled?: boolean;
  borderColor: string;
  borderWidth: "none" | "thin" | "medium" | "thick" | "custom";
  customBorderWidth?: number; // in px
  borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";
  borderOpacity?: number; // 0 - 100
  individualBorders?: boolean;
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;

  // Border Radius
  borderRadius: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "custom";
  customBorderRadius?: number; // in px
  individualRadius?: boolean;
  radiusTopLeft?: number;
  radiusTopRight?: number;
  radiusBottomLeft?: number;
  radiusBottomRight?: number;

  // Shadow
  shadowEnabled?: boolean;
  shadow?: "none" | "sm" | "md" | "lg" | "soft" | "glow" | "neumorphism" | "inner" | "custom";
  customShadowX?: number;
  customShadowY?: number;
  customShadowBlur?: number;
  customShadowSpread?: number;
  customShadowColor?: string;
  customShadowOpacity?: number;
  customShadowInset?: boolean;
  neumorphismRaised?: boolean;

  // Spacing & Padding
  padding: "compact" | "normal" | "spacious" | "custom";
  customPadding?: number; // in px
  individualPadding?: boolean;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  headerContentSpacing?: number; // in px
  descriptionSpacing?: number; // in px

  // Hover State
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  hoverShadow?: "none" | "sm" | "md" | "lg" | "soft" | "glow" | "custom";
  transitionDuration?: number; // in ms

  // Selected State
  selectedBackgroundColor?: string;
  selectedBorderColor?: string;
  selectedBorderWidth?: "none" | "thin" | "medium" | "thick" | "custom";
  selectedCustomBorderWidth?: number;
  selectedRingEnabled?: boolean;
  selectedRingColor?: string;
  selectedRingWidth?: number; // in px
  selectedRingOpacity?: number; // 0 - 100
  selectedShadow?: "none" | "sm" | "md" | "lg" | "soft" | "glow" | "custom";
}

export type InputStylePreset =
  | "classic"
  | "glassmorphism"
  | "solid"
  | "outline"
  | "soft"
  | "minimal"
  | "neumorphism"
  | "filled"
  | "custom";

export interface FormThemeInputs {
  // Preset
  preset?: InputStylePreset;

  // Background
  backgroundType?: "solid" | "gradient" | "transparent" | "glass";
  backgroundColor: string;
  backgroundOpacity?: number; // 0 - 100
  gradientType?: "linear" | "radial";
  gradientDirection?: string; // "135deg", "to bottom", "to right", etc.
  gradientFrom?: string;
  gradientTo?: string;

  // Glassmorphism effect
  glassEnabled?: boolean;
  glassBlur?: number; // 0 - 30px (e.g. 12px)
  glassOpacity?: number; // 0 - 100
  glassHighlight?: boolean;
  glassHighlightOpacity?: number; // 0 - 100

  // Border
  borderEnabled?: boolean;
  borderColor: string;
  borderWidth: "none" | "thin" | "medium" | "thick" | "custom";
  customBorderWidth?: number; // in px
  borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";
  borderOpacity?: number; // 0 - 100
  individualBorders?: boolean;
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  bottomBorderOnly?: boolean;

  // Border Radius
  borderRadius: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "custom";
  customBorderRadius?: number; // in px
  individualRadius?: boolean;
  radiusTopLeft?: number;
  radiusTopRight?: number;
  radiusBottomLeft?: number;
  radiusBottomRight?: number;

  // Shadow
  shadowEnabled?: boolean;
  shadow?: "none" | "sm" | "md" | "lg" | "soft" | "glow" | "neumorphism" | "inner" | "custom";
  customShadowX?: number;
  customShadowY?: number;
  customShadowBlur?: number;
  customShadowSpread?: number;
  customShadowColor?: string;
  customShadowOpacity?: number;
  customShadowInset?: boolean;
  neumorphismRaised?: boolean;

  // Text & Typography
  textColor: string;
  fontSize: "xs" | "sm" | "base" | "lg" | "custom";
  customFontSize?: number; // in px
  fontWeight: "normal" | "medium" | "semibold" | "bold";
  letterSpacing?: "tighter" | "normal" | "wide" | "widest";
  lineHeight?: "tight" | "normal" | "relaxed";

  // Placeholder
  placeholderColor: string;
  placeholderOpacity?: number; // 0 - 100
  placeholderFontSize?: "xs" | "sm" | "base";

  // Label
  labelColor: string;
  labelFontSize?: "xs" | "sm" | "base" | "lg" | "custom";
  customLabelFontSize?: number;
  labelFontWeight?: "normal" | "medium" | "semibold" | "bold";
  labelLetterSpacing?: "tighter" | "normal" | "wide" | "widest";
  labelSpacing?: number; // margin below label in px
  requiredColor?: string;
  requiredIndicator?: "asterisk" | "badge" | "dot" | "none";

  // Focus State
  focusBorderColor: string;
  focusRingEnabled?: boolean;
  focusRingColor: string;
  focusRingOpacity?: number; // 0 - 100
  focusRingWidth?: number; // in px
  focusBackgroundColor?: string;
  focusShadow?: string;

  // Hover State
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  hoverShadow?: string;

  // Error State
  errorBorderColor?: string;
  errorBackgroundColor?: string;
  errorTextColor?: string;

  // Disabled State
  disabledBackgroundColor?: string;
  disabledTextColor?: string;
  disabledOpacity?: number; // 0 - 100

  // Sizing & Spacing
  height: "compact" | "normal" | "spacious" | "custom";
  customHeight?: number; // in px
  paddingHorizontal?: number; // in px
  paddingVertical?: number; // in px
  fieldSpacing?: "compact" | "normal" | "relaxed" | "loose" | "custom";
  customFieldSpacing?: number; // in px
  helpTextSpacing?: number; // in px

  // Controls specific
  accentColor?: string;
  checkIconColor?: string;
  checkboxRadius?: "none" | "sm" | "md" | "full";
  ratingActiveColor?: string;
  ratingInactiveColor?: string;
  ratingSize?: number;
  dropzoneBgColor?: string;
  dropzoneBorderColor?: string;
  dropzoneTextColor?: string;
  dropzoneIconColor?: string;
}

export interface FormThemeButtons {
  backgroundColor: string;
  textColor: string;
  hoverBackgroundColor: string;
  hoverTextColor: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  borderWidth: "none" | "thin" | "medium";
  borderColor: string;
  size: "sm" | "md" | "lg";
  fontWeight: "normal" | "medium" | "semibold" | "bold";
  fullWidth: boolean;
  shadow: "none" | "sm" | "md" | "lg" | "glow";
}

export interface FormThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  mutedText: string;
  border: string;
  surface: string;
  error: string;
  success: string;
}

export interface FormThemeBranding {
  logoUrl?: string;
  logoPosition: "left" | "center" | "right";
  logoSize: "sm" | "md" | "lg";
  headerImageUrl?: string;
  headerImageHeight: "sm" | "md" | "lg";
  headerImageFit: "cover" | "contain";
  showInstantFormBadge: boolean;
}

export interface FormThemeLayout {
  fieldSpacing: "compact" | "normal" | "relaxed" | "loose";
  labelAlignment: "left" | "center" | "right";
  contentAlignment: "left" | "center" | "right";
}

export interface FormTheme {
  background: FormThemeBackground;
  typography: FormThemeTypography;
  container: FormThemeContainer;
  fieldCard: FormThemeFieldCard;
  inputs: FormThemeInputs;
  buttons: FormThemeButtons;
  colors: FormThemeColors;
  branding: FormThemeBranding;
  layout: FormThemeLayout;
}

export const GOOGLE_FONTS_LIST = [
  { name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif", google: "Plus+Jakarta+Sans:wght@400;500;600;700" },
  { name: "Inter", family: "'Inter', sans-serif", google: "Inter:wght@400;500;600;700" },
  { name: "Newsreader", family: "'Newsreader', serif", google: "Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400" },
  { name: "Playfair Display", family: "'Playfair Display', serif", google: "Playfair+Display:wght@400;600;700" },
  { name: "Poppins", family: "'Poppins', sans-serif", google: "Poppins:wght@400;500;600;700" },
  { name: "Roboto", family: "'Roboto', sans-serif", google: "Roboto:wght@400;500;700" },
  { name: "Outfit", family: "'Outfit', sans-serif", google: "Outfit:wght@400;500;600;700" },
  { name: "Montserrat", family: "'Montserrat', sans-serif", google: "Montserrat:wght@400;500;600;700" },
  { name: "Space Grotesk", family: "'Space Grotesk', sans-serif", google: "Space+Grotesk:wght@400;500;600;700" },
  { name: "Lora", family: "'Lora', serif", google: "Lora:ital,wght@0,400;0,600;1,400" },
  { name: "DM Sans", family: "'DM Sans', sans-serif", google: "DM+Sans:wght@400;500;700" },
  { name: "Syne", family: "'Syne', sans-serif", google: "Syne:wght@500;700;800" },
  { name: "System Sans", family: "system-ui, -apple-system, sans-serif" },
  { name: "Georgia", family: "Georgia, Cambria, serif" },
  { name: "Courier Monospace", family: "'Courier New', Courier, monospace" },
  { name: "Custom Uploaded", family: "'CustomFormFont', sans-serif" },
];

export const DEFAULT_FORM_THEME: FormTheme = {
  background: {
    type: "solid",
    color: "#FAF8F5",
    gradientType: "linear",
    gradientDirection: "135deg",
    gradientFrom: "#FAF8F5",
    gradientTo: "#FFF0EB",
    imageUrl: "",
    imagePosition: "center",
    imageSize: "cover",
    imageRepeat: "no-repeat",
    overlayColor: "#000000",
    overlayOpacity: 0,
    blur: 0,
  },
  typography: {
    fontFamily: "Plus Jakarta Sans",
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Plus Jakarta Sans",
    fontSize: "base",
    headingSize: "2xl",
    fontWeight: "semibold",
    lineHeight: "normal",
    letterSpacing: "normal",
    headingColor: "#1C1917",
    descriptionColor: "#78716C",
  },
  container: {
    backgroundType: "solid",
    backgroundColor: "#FFFFFF",
    backgroundOpacity: 100,
    gradientType: "linear",
    gradientDirection: "135deg",
    gradientFrom: "#FFFFFF",
    gradientTo: "#FAF8F5",
    imageUrl: "",
    imagePosition: "center",
    imageSize: "cover",
    imageRepeat: "no-repeat",
    overlayColor: "#000000",
    overlayOpacity: 0,
    bgBlur: 0,
    imageBlur: 0,
    maxWidth: "2xl",
    customMaxWidth: 672,
    minHeight: "none",
    borderRadius: "2xl",
    customBorderRadius: 24,
    individualRadius: false,
    radiusTopLeft: 24,
    radiusTopRight: 24,
    radiusBottomLeft: 24,
    radiusBottomRight: 24,
    borderWidth: "thin",
    customBorderWidth: 1,
    borderStyle: "solid",
    borderColor: "#EAE3D6",
    borderTop: true,
    borderRight: true,
    borderBottom: true,
    borderLeft: true,
    boxShadow: "soft",
    customShadowX: 0,
    customShadowY: 4,
    customShadowBlur: 20,
    customShadowSpread: 0,
    customShadowColor: "rgba(28, 25, 23, 0.06)",
    customShadowOpacity: 10,
    customShadowInset: false,
    padding: "lg",
    customPadding: 32,
    individualPadding: false,
    paddingTop: 32,
    paddingRight: 32,
    paddingBottom: 32,
    paddingLeft: 32,
    glassBlur: 0,
    opacity: 100,
  },
  fieldCard: {
    preset: "default",
    backgroundType: "solid",
    backgroundColor: "#FAF8F5",
    backgroundOpacity: 80,
    gradientType: "linear",
    gradientDirection: "135deg",
    gradientFrom: "#FAF8F5",
    gradientTo: "#FFFFFF",
    glassEnabled: false,
    glassBlur: 12,
    glassOpacity: 70,
    glassHighlight: false,
    glassHighlightOpacity: 20,
    borderEnabled: true,
    borderColor: "#EAE3D6",
    borderWidth: "thin",
    customBorderWidth: 1,
    borderStyle: "solid",
    borderOpacity: 100,
    individualBorders: false,
    borderTop: true,
    borderRight: true,
    borderBottom: true,
    borderLeft: true,
    borderRadius: "2xl",
    customBorderRadius: 16,
    individualRadius: false,
    radiusTopLeft: 16,
    radiusTopRight: 16,
    radiusBottomLeft: 16,
    radiusBottomRight: 16,
    shadowEnabled: false,
    shadow: "none",
    customShadowX: 0,
    customShadowY: 2,
    customShadowBlur: 8,
    customShadowSpread: 0,
    customShadowColor: "rgba(0,0,0,0.05)",
    customShadowOpacity: 10,
    customShadowInset: false,
    padding: "normal",
    customPadding: 20,
    individualPadding: false,
    paddingTop: 16,
    paddingRight: 20,
    paddingBottom: 16,
    paddingLeft: 20,
    headerContentSpacing: 12,
    descriptionSpacing: 6,
    hoverBackgroundColor: undefined,
    hoverBorderColor: undefined,
    hoverShadow: "none",
    selectedBackgroundColor: undefined,
    selectedBorderColor: undefined,
    selectedBorderWidth: undefined,
    selectedRingEnabled: true,
    selectedRingColor: "#FF5A36",
    selectedRingWidth: 2,
    selectedRingOpacity: 100,
    selectedShadow: "md",
  },
  inputs: {
    preset: "classic",
    backgroundType: "solid",
    backgroundColor: "#FAF8F5",
    backgroundOpacity: 100,
    gradientType: "linear",
    gradientDirection: "135deg",
    gradientFrom: "#FAF8F5",
    gradientTo: "#FFF0EB",
    glassEnabled: false,
    glassBlur: 12,
    glassOpacity: 70,
    glassHighlight: false,
    glassHighlightOpacity: 20,
    borderEnabled: true,
    borderColor: "#EAE3D6",
    borderWidth: "thin",
    customBorderWidth: 1,
    borderStyle: "solid",
    borderOpacity: 100,
    individualBorders: false,
    borderTop: true,
    borderRight: true,
    borderBottom: true,
    borderLeft: true,
    bottomBorderOnly: false,
    borderRadius: "xl",
    customBorderRadius: 12,
    individualRadius: false,
    radiusTopLeft: 12,
    radiusTopRight: 12,
    radiusBottomLeft: 12,
    radiusBottomRight: 12,
    shadowEnabled: false,
    shadow: "none",
    customShadowX: 0,
    customShadowY: 2,
    customShadowBlur: 8,
    customShadowSpread: 0,
    customShadowColor: "rgba(0,0,0,0.06)",
    customShadowOpacity: 10,
    customShadowInset: false,
    textColor: "#1C1917",
    fontSize: "sm",
    fontWeight: "normal",
    letterSpacing: "normal",
    lineHeight: "normal",
    placeholderColor: "#A8A29E",
    placeholderOpacity: 80,
    labelColor: "#1C1917",
    labelFontSize: "sm",
    labelFontWeight: "semibold",
    labelLetterSpacing: "normal",
    labelSpacing: 6,
    requiredColor: "#FF5A36",
    requiredIndicator: "asterisk",
    focusBorderColor: "#FF5A36",
    focusRingEnabled: true,
    focusRingColor: "rgba(255, 90, 54, 0.2)",
    focusRingOpacity: 20,
    focusRingWidth: 2,
    focusBackgroundColor: "#FFFFFF",
    height: "normal",
    customHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fieldSpacing: "normal",
    customFieldSpacing: 16,
    accentColor: "#FF5A36",
    checkIconColor: "#FFFFFF",
    checkboxRadius: "sm",
    ratingActiveColor: "#F59E0B",
    ratingInactiveColor: "#EAE3D6",
    ratingSize: 20,
    dropzoneBgColor: "rgba(250, 248, 245, 0.6)",
    dropzoneBorderColor: "#EAE3D6",
    dropzoneTextColor: "#1C1917",
    dropzoneIconColor: "#FF5A36",
  },
  buttons: {
    backgroundColor: "#1C1917",
    textColor: "#FFFFFF",
    hoverBackgroundColor: "#292524",
    hoverTextColor: "#FFFFFF",
    borderRadius: "xl",
    borderWidth: "none",
    borderColor: "transparent",
    size: "md",
    fontWeight: "semibold",
    fullWidth: false,
    shadow: "sm",
  },
  colors: {
    primary: "#FF5A36",
    secondary: "#1C1917",
    accent: "#FFF0EB",
    text: "#1C1917",
    mutedText: "#78716C",
    border: "#EAE3D6",
    surface: "#FFFFFF",
    error: "#EF4444",
    success: "#10B981",
  },
  branding: {
    logoUrl: "",
    logoPosition: "center",
    logoSize: "md",
    headerImageUrl: "",
    headerImageHeight: "md",
    headerImageFit: "cover",
    showInstantFormBadge: true,
  },
  layout: {
    fieldSpacing: "normal",
    labelAlignment: "left",
    contentAlignment: "left",
  },
};

export const FIELD_CARD_STYLE_PRESETS: Array<{
  id: FieldCardStylePreset;
  name: string;
  description: string;
  style: Partial<FormThemeFieldCard>;
}> = [
  {
    id: "default",
    name: "Default Card",
    description: "Classic rounded card with subtle off-white background and light border",
    style: {
      preset: "default",
      backgroundType: "solid",
      backgroundColor: "#FAF8F5",
      backgroundOpacity: 80,
      borderEnabled: true,
      borderColor: "#EAE3D6",
      borderWidth: "thin",
      borderStyle: "solid",
      borderRadius: "2xl",
      shadowEnabled: false,
      shadow: "none",
      padding: "normal",
      hoverBackgroundColor: undefined,
      hoverBorderColor: undefined,
      selectedBackgroundColor: undefined,
      selectedBorderColor: undefined,
      selectedRingEnabled: true,
      selectedRingColor: "#FF5A36",
      selectedRingWidth: 2,
    },
  },
  {
    id: "solid",
    name: "Solid White",
    description: "Pure white surface with crisp borders and soft shadow",
    style: {
      preset: "solid",
      backgroundType: "solid",
      backgroundColor: "#FFFFFF",
      backgroundOpacity: 100,
      borderEnabled: true,
      borderColor: "#EAE3D6",
      borderWidth: "thin",
      borderStyle: "solid",
      borderRadius: "2xl",
      shadowEnabled: true,
      shadow: "soft",
      padding: "normal",
      hoverBackgroundColor: undefined,
      hoverBorderColor: undefined,
      selectedBackgroundColor: undefined,
      selectedRingEnabled: true,
      selectedRingColor: "#FF5A36",
      selectedRingWidth: 2,
    },
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted translucent surface with backdrop blur and glass border",
    style: {
      preset: "glassmorphism",
      backgroundType: "glass",
      backgroundColor: "#FFFFFF",
      glassEnabled: true,
      glassBlur: 16,
      glassOpacity: 65,
      glassHighlight: true,
      borderEnabled: true,
      borderColor: "rgba(255, 255, 255, 0.4)",
      borderWidth: "thin",
      borderStyle: "solid",
      borderRadius: "2xl",
      shadowEnabled: true,
      shadow: "soft",
      padding: "normal",
      hoverBackgroundColor: undefined,
      selectedBackgroundColor: undefined,
      selectedRingEnabled: true,
      selectedRingColor: "#FF5A36",
      selectedRingWidth: 2,
    },
  },
  {
    id: "outline",
    name: "Outline",
    description: "Transparent card with distinct colored border and clear boundaries",
    style: {
      preset: "outline",
      backgroundType: "transparent",
      backgroundColor: "transparent",
      borderEnabled: true,
      borderColor: "#D9CFBE",
      borderWidth: "medium",
      borderStyle: "solid",
      borderRadius: "2xl",
      shadowEnabled: false,
      shadow: "none",
      padding: "normal",
      hoverBackgroundColor: undefined,
      hoverBorderColor: undefined,
      selectedBackgroundColor: undefined,
      selectedBorderColor: undefined,
      selectedRingEnabled: true,
      selectedRingColor: "#FF5A36",
      selectedRingWidth: 2,
    },
  },
  {
    id: "soft",
    name: "Soft Pastel",
    description: "Soft warm off-white background with subtle rounded geometry",
    style: {
      preset: "soft",
      backgroundType: "solid",
      backgroundColor: "#F7F5F0",
      backgroundOpacity: 100,
      borderEnabled: true,
      borderColor: "#EDE7DC",
      borderWidth: "thin",
      borderStyle: "solid",
      borderRadius: "3xl",
      shadowEnabled: true,
      shadow: "soft",
      padding: "normal",
      hoverBackgroundColor: undefined,
      selectedBackgroundColor: undefined,
      selectedRingEnabled: true,
      selectedRingColor: "#FF5A36",
      selectedRingWidth: 2,
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Border-free seamless card with natural spacing",
    style: {
      preset: "minimal",
      backgroundType: "transparent",
      backgroundColor: "transparent",
      borderEnabled: false,
      borderRadius: "xl",
      shadowEnabled: false,
      shadow: "none",
      padding: "normal",
      hoverBackgroundColor: undefined,
      selectedBackgroundColor: undefined,
      selectedRingEnabled: true,
      selectedRingColor: "#FF5A36",
      selectedRingWidth: 2,
    },
  },
  {
    id: "neumorphism",
    name: "Neumorphism",
    description: "Soft embossed surface with dual outer and soft shadows",
    style: {
      preset: "neumorphism",
      backgroundType: "solid",
      backgroundColor: "#FAF8F5",
      borderEnabled: false,
      borderRadius: "2xl",
      shadowEnabled: true,
      shadow: "neumorphism",
      padding: "normal",
      hoverBackgroundColor: undefined,
      selectedBackgroundColor: undefined,
      selectedRingEnabled: true,
      selectedRingColor: "#FF5A36",
      selectedRingWidth: 2,
    },
  },
  {
    id: "gradient",
    name: "Gradient Surface",
    description: "Subtle linear gradient with delicate corner accents",
    style: {
      preset: "gradient",
      backgroundType: "gradient",
      gradientType: "linear",
      gradientDirection: "135deg",
      gradientFrom: "#FFFFFF",
      gradientTo: "#FAF4EE",
      borderEnabled: true,
      borderColor: "#EAE3D6",
      borderWidth: "thin",
      borderStyle: "solid",
      borderRadius: "2xl",
      shadowEnabled: true,
      shadow: "soft",
      padding: "normal",
      hoverBackgroundColor: undefined,
      selectedBackgroundColor: undefined,
      selectedRingEnabled: true,
      selectedRingColor: "#FF5A36",
      selectedRingWidth: 2,
    },
  },
  {
    id: "transparent",
    name: "Transparent",
    description: "Pure transparent background blend with main card",
    style: {
      preset: "transparent",
      backgroundType: "transparent",
      backgroundColor: "transparent",
      borderEnabled: true,
      borderColor: "#EAE3D6",
      borderWidth: "thin",
      borderStyle: "solid",
      borderRadius: "2xl",
      shadowEnabled: false,
      shadow: "none",
      padding: "normal",
      hoverBackgroundColor: undefined,
      selectedBackgroundColor: undefined,
      selectedRingEnabled: true,
      selectedRingColor: "#FF5A36",
      selectedRingWidth: 2,
    },
  },
  {
    id: "custom",
    name: "Custom",
    description: "Completely customizable field card styling",
    style: {
      preset: "custom",
    },
  },
];

export const THEME_PRESETS: Array<{
  id: string;
  name: string;
  description: string;
  previewColor: string;
  previewBg: string;
  theme: Partial<FormTheme>;
}> = [
  {
    id: "classic-warm",
    name: "Classic Warm",
    description: "Signature warm cream and coral styling",
    previewColor: "#FF5A36",
    previewBg: "#FAF8F5",
    theme: {
      background: {
        type: "solid",
        color: "#FAF8F5",
        gradientType: "linear",
        gradientDirection: "135deg",
        gradientFrom: "#FAF8F5",
        gradientTo: "#FFF0EB",
        overlayColor: "#000000",
        overlayOpacity: 0,
        blur: 0,
        imagePosition: "center",
        imageSize: "cover",
        imageRepeat: "no-repeat",
      },
      typography: {
        fontFamily: "Plus Jakarta Sans",
        fontSize: "base",
        headingSize: "2xl",
        fontWeight: "semibold",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
      container: {
        maxWidth: "2xl",
        backgroundColor: "#FFFFFF",
        backgroundOpacity: 100,
        borderRadius: "2xl",
        borderWidth: "thin",
        borderStyle: "solid",
        borderColor: "#EAE3D6",
        boxShadow: "soft",
        padding: "lg",
        glassBlur: 0,
      },
      inputs: {
        backgroundColor: "#FAF8F5",
        textColor: "#1C1917",
        placeholderColor: "#A8A29E",
        labelColor: "#1C1917",
        borderColor: "#EAE3D6",
        focusBorderColor: "#FF5A36",
        focusRingColor: "rgba(255, 90, 54, 0.2)",
        borderWidth: "thin",
        borderRadius: "xl",
        height: "normal",
        fontSize: "sm",
        fontWeight: "normal",
      },
      buttons: {
        backgroundColor: "#1C1917",
        textColor: "#FFFFFF",
        hoverBackgroundColor: "#292524",
        hoverTextColor: "#FFFFFF",
        borderRadius: "xl",
        borderWidth: "none",
        borderColor: "transparent",
        size: "md",
        fontWeight: "semibold",
        fullWidth: false,
        shadow: "sm",
      },
      colors: {
        primary: "#FF5A36",
        secondary: "#1C1917",
        accent: "#FFF0EB",
        text: "#1C1917",
        mutedText: "#78716C",
        border: "#EAE3D6",
        surface: "#FFFFFF",
        error: "#EF4444",
        success: "#10B981",
      },
    },
  },
  {
    id: "editorial-serif",
    name: "Editorial Serif",
    description: "Refined literary typography with elegant ivory borders",
    previewColor: "#8B5CF6",
    previewBg: "#FCFAF6",
    theme: {
      background: {
        type: "gradient",
        color: "#FCFAF6",
        gradientType: "linear",
        gradientDirection: "to bottom",
        gradientFrom: "#FAF7F2",
        gradientTo: "#EFE9DE",
        overlayColor: "#000000",
        overlayOpacity: 0,
        blur: 0,
        imagePosition: "center",
        imageSize: "cover",
        imageRepeat: "no-repeat",
      },
      typography: {
        fontFamily: "Newsreader",
        headingFont: "Newsreader",
        bodyFont: "Inter",
        fontSize: "base",
        headingSize: "3xl",
        fontWeight: "medium",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
      container: {
        maxWidth: "2xl",
        backgroundColor: "#FFFFFF",
        backgroundOpacity: 98,
        borderRadius: "xl",
        borderWidth: "thin",
        borderStyle: "solid",
        borderColor: "#E7E2D8",
        boxShadow: "soft",
        padding: "xl",
        glassBlur: 0,
      },
      inputs: {
        backgroundColor: "#FAFAF9",
        textColor: "#1C1917",
        placeholderColor: "#A8A29E",
        labelColor: "#1C1917",
        borderColor: "#E7E2D8",
        focusBorderColor: "#7C3AED",
        focusRingColor: "rgba(124, 58, 237, 0.15)",
        borderWidth: "thin",
        borderRadius: "lg",
        height: "spacious",
        fontSize: "sm",
        fontWeight: "normal",
      },
      buttons: {
        backgroundColor: "#1C1917",
        textColor: "#FFFFFF",
        hoverBackgroundColor: "#332F2C",
        hoverTextColor: "#FFFFFF",
        borderRadius: "lg",
        borderWidth: "none",
        borderColor: "transparent",
        size: "lg",
        fontWeight: "medium",
        fullWidth: false,
        shadow: "sm",
      },
      colors: {
        primary: "#7C3AED",
        secondary: "#1C1917",
        accent: "#F5F3FF",
        text: "#1C1917",
        mutedText: "#6B7280",
        border: "#E7E2D8",
        surface: "#FFFFFF",
        error: "#DC2626",
        success: "#059669",
      },
    },
  },
  {
    id: "modern-saas",
    name: "Modern SaaS",
    description: "Sleek indigo vibrancy with crisp high-contrast layout",
    previewColor: "#4F46E5",
    previewBg: "#F8FAFC",
    theme: {
      background: {
        type: "gradient",
        color: "#F8FAFC",
        gradientType: "linear",
        gradientDirection: "135deg",
        gradientFrom: "#EEF2FF",
        gradientTo: "#E0E7FF",
        overlayColor: "#000000",
        overlayOpacity: 0,
        blur: 0,
        imagePosition: "center",
        imageSize: "cover",
        imageRepeat: "no-repeat",
      },
      typography: {
        fontFamily: "Inter",
        fontSize: "base",
        headingSize: "2xl",
        fontWeight: "semibold",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
      container: {
        maxWidth: "2xl",
        backgroundColor: "#FFFFFF",
        backgroundOpacity: 100,
        borderRadius: "2xl",
        borderWidth: "thin",
        borderStyle: "solid",
        borderColor: "#E2E8F0",
        boxShadow: "lg",
        padding: "lg",
        glassBlur: 0,
      },
      inputs: {
        backgroundColor: "#F8FAFC",
        textColor: "#0F172A",
        placeholderColor: "#94A3B8",
        labelColor: "#0F172A",
        borderColor: "#CBD5E1",
        focusBorderColor: "#4F46E5",
        focusRingColor: "rgba(79, 70, 229, 0.2)",
        borderWidth: "thin",
        borderRadius: "xl",
        height: "normal",
        fontSize: "sm",
        fontWeight: "medium",
      },
      buttons: {
        backgroundColor: "#4F46E5",
        textColor: "#FFFFFF",
        hoverBackgroundColor: "#4338CA",
        hoverTextColor: "#FFFFFF",
        borderRadius: "xl",
        borderWidth: "none",
        borderColor: "transparent",
        size: "md",
        fontWeight: "semibold",
        fullWidth: false,
        shadow: "md",
      },
      colors: {
        primary: "#4F46E5",
        secondary: "#0F172A",
        accent: "#EEF2FF",
        text: "#0F172A",
        mutedText: "#64748B",
        border: "#E2E8F0",
        surface: "#FFFFFF",
        error: "#EF4444",
        success: "#10B981",
      },
    },
  },
  {
    id: "emerald-nature",
    name: "Emerald Nature",
    description: "Organic botanical palette with soothing mint accents",
    previewColor: "#059669",
    previewBg: "#F0FDF4",
    theme: {
      background: {
        type: "gradient",
        color: "#F0FDF4",
        gradientType: "linear",
        gradientDirection: "135deg",
        gradientFrom: "#ECFDF5",
        gradientTo: "#D1FAE5",
        overlayColor: "#000000",
        overlayOpacity: 0,
        blur: 0,
        imagePosition: "center",
        imageSize: "cover",
        imageRepeat: "no-repeat",
      },
      typography: {
        fontFamily: "Outfit",
        fontSize: "base",
        headingSize: "2xl",
        fontWeight: "semibold",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
      container: {
        maxWidth: "2xl",
        backgroundColor: "#FFFFFF",
        backgroundOpacity: 98,
        borderRadius: "3xl",
        borderWidth: "thin",
        borderStyle: "solid",
        borderColor: "#A7F3D0",
        boxShadow: "md",
        padding: "lg",
        glassBlur: 0,
      },
      inputs: {
        backgroundColor: "#F0FDF4",
        textColor: "#064E3B",
        placeholderColor: "#6EE7B7",
        labelColor: "#064E3B",
        borderColor: "#A7F3D0",
        focusBorderColor: "#059669",
        focusRingColor: "rgba(5, 150, 105, 0.2)",
        borderWidth: "thin",
        borderRadius: "2xl",
        height: "normal",
        fontSize: "sm",
        fontWeight: "normal",
      },
      buttons: {
        backgroundColor: "#059669",
        textColor: "#FFFFFF",
        hoverBackgroundColor: "#047857",
        hoverTextColor: "#FFFFFF",
        borderRadius: "2xl",
        borderWidth: "none",
        borderColor: "transparent",
        size: "md",
        fontWeight: "semibold",
        fullWidth: false,
        shadow: "sm",
      },
      colors: {
        primary: "#059669",
        secondary: "#064E3B",
        accent: "#D1FAE5",
        text: "#064E3B",
        mutedText: "#047857",
        border: "#A7F3D0",
        surface: "#FFFFFF",
        error: "#EF4444",
        success: "#10B981",
      },
    },
  },
  {
    id: "glassmorphism",
    name: "Frosted Glass",
    description: "Translucent backdrop blur with subtle glowing borders",
    previewColor: "#38BDF8",
    previewBg: "#E0F2FE",
    theme: {
      background: {
        type: "gradient",
        color: "#F0F9FF",
        gradientType: "linear",
        gradientDirection: "135deg",
        gradientFrom: "#E0F2FE",
        gradientTo: "#BAE6FD",
        gradientVia: "#E0E7FF",
        overlayColor: "#000000",
        overlayOpacity: 0,
        blur: 0,
        imagePosition: "center",
        imageSize: "cover",
        imageRepeat: "no-repeat",
      },
      typography: {
        fontFamily: "Plus Jakarta Sans",
        fontSize: "base",
        headingSize: "2xl",
        fontWeight: "semibold",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
      container: {
        maxWidth: "2xl",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        backgroundOpacity: 75,
        borderRadius: "3xl",
        borderWidth: "thin",
        borderStyle: "solid",
        borderColor: "rgba(255, 255, 255, 0.8)",
        boxShadow: "glow",
        padding: "xl",
        glassBlur: 16,
      },
      inputs: {
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        textColor: "#0C4A6E",
        placeholderColor: "#7DD3FC",
        labelColor: "#0C4A6E",
        borderColor: "rgba(255, 255, 255, 0.7)",
        focusBorderColor: "#0284C7",
        focusRingColor: "rgba(2, 132, 199, 0.2)",
        borderWidth: "thin",
        borderRadius: "2xl",
        height: "normal",
        fontSize: "sm",
        fontWeight: "medium",
      },
      buttons: {
        backgroundColor: "#0284C7",
        textColor: "#FFFFFF",
        hoverBackgroundColor: "#0369A1",
        hoverTextColor: "#FFFFFF",
        borderRadius: "2xl",
        borderWidth: "none",
        borderColor: "transparent",
        size: "md",
        fontWeight: "semibold",
        fullWidth: false,
        shadow: "glow",
      },
      colors: {
        primary: "#0284C7",
        secondary: "#0C4A6E",
        accent: "#E0F2FE",
        text: "#0C4A6E",
        mutedText: "#0369A1",
        border: "rgba(255, 255, 255, 0.8)",
        surface: "rgba(255, 255, 255, 0.75)",
        error: "#EF4444",
        success: "#10B981",
      },
    },
  },
];

export const INPUT_STYLE_PRESETS: Array<{
  id: InputStylePreset;
  name: string;
  description: string;
  inputs: Partial<FormThemeInputs>;
}> = [
  {
    id: "classic",
    name: "Classic Warm",
    description: "Signature warm cream and neutral subtle borders",
    inputs: {
      preset: "classic",
      backgroundType: "solid",
      backgroundColor: "#FAF8F5",
      backgroundOpacity: 100,
      glassEnabled: false,
      borderEnabled: true,
      borderColor: "#EAE3D6",
      borderWidth: "thin",
      borderStyle: "solid",
      bottomBorderOnly: false,
      borderRadius: "xl",
      shadow: "none",
      textColor: "#1C1917",
      placeholderColor: "#A8A29E",
      labelColor: "#1C1917",
      focusBorderColor: "#FF5A36",
      focusRingColor: "rgba(255, 90, 54, 0.2)",
      focusRingEnabled: true,
      focusRingWidth: 2,
    },
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Translucent frosted glass with backdrop blur and soft highlight",
    inputs: {
      preset: "glassmorphism",
      backgroundType: "glass",
      backgroundColor: "rgba(255, 255, 255, 0.65)",
      backgroundOpacity: 65,
      glassEnabled: true,
      glassBlur: 14,
      glassOpacity: 65,
      glassHighlight: true,
      glassHighlightOpacity: 25,
      borderEnabled: true,
      borderColor: "rgba(255, 255, 255, 0.5)",
      borderWidth: "thin",
      borderStyle: "solid",
      bottomBorderOnly: false,
      borderRadius: "2xl",
      shadow: "soft",
      textColor: "#1C1917",
      placeholderColor: "#78716C",
      labelColor: "#1C1917",
      focusBorderColor: "#FF5A36",
      focusRingColor: "rgba(255, 90, 54, 0.25)",
      focusRingEnabled: true,
      focusRingWidth: 3,
    },
  },
  {
    id: "solid",
    name: "Solid Clean",
    description: "Crisp opaque white background with subtle border and crisp corners",
    inputs: {
      preset: "solid",
      backgroundType: "solid",
      backgroundColor: "#FFFFFF",
      backgroundOpacity: 100,
      glassEnabled: false,
      borderEnabled: true,
      borderColor: "#E5E7EB",
      borderWidth: "thin",
      borderStyle: "solid",
      bottomBorderOnly: false,
      borderRadius: "lg",
      shadow: "sm",
      textColor: "#111827",
      placeholderColor: "#9CA3AF",
      labelColor: "#111827",
      focusBorderColor: "#2563EB",
      focusRingColor: "rgba(37, 99, 235, 0.2)",
      focusRingEnabled: true,
      focusRingWidth: 2,
    },
  },
  {
    id: "outline",
    name: "Outline",
    description: "Transparent background with defined, prominent border outlines",
    inputs: {
      preset: "outline",
      backgroundType: "transparent",
      backgroundColor: "transparent",
      backgroundOpacity: 0,
      glassEnabled: false,
      borderEnabled: true,
      borderColor: "#D1D5DB",
      borderWidth: "medium",
      borderStyle: "solid",
      bottomBorderOnly: false,
      borderRadius: "lg",
      shadow: "none",
      textColor: "#111827",
      placeholderColor: "#9CA3AF",
      labelColor: "#111827",
      focusBorderColor: "#111827",
      focusRingColor: "rgba(17, 24, 39, 0.15)",
      focusRingEnabled: true,
      focusRingWidth: 2,
    },
  },
  {
    id: "soft",
    name: "Soft Pastel",
    description: "Smooth muted background, borderless feel, and rounded corners",
    inputs: {
      preset: "soft",
      backgroundType: "solid",
      backgroundColor: "#F3F4F6",
      backgroundOpacity: 100,
      glassEnabled: false,
      borderEnabled: false,
      borderColor: "transparent",
      borderWidth: "none",
      borderStyle: "solid",
      bottomBorderOnly: false,
      borderRadius: "2xl",
      shadow: "none",
      textColor: "#1F2937",
      placeholderColor: "#9CA3AF",
      labelColor: "#1F2937",
      focusBorderColor: "#8B5CF6",
      focusRingColor: "rgba(139, 92, 246, 0.25)",
      focusRingEnabled: true,
      focusRingWidth: 2,
      focusBackgroundColor: "#FFFFFF",
    },
  },
  {
    id: "minimal",
    name: "Minimal Underline",
    description: "Distraction-free underline border with transparent background",
    inputs: {
      preset: "minimal",
      backgroundType: "transparent",
      backgroundColor: "transparent",
      backgroundOpacity: 0,
      glassEnabled: false,
      borderEnabled: true,
      borderColor: "#D1D5DB",
      borderWidth: "thin",
      borderStyle: "solid",
      bottomBorderOnly: true,
      borderRadius: "none",
      shadow: "none",
      textColor: "#111827",
      placeholderColor: "#9CA3AF",
      labelColor: "#111827",
      focusBorderColor: "#111827",
      focusRingColor: "transparent",
      focusRingEnabled: false,
      focusRingWidth: 0,
    },
  },
  {
    id: "neumorphism",
    name: "Neumorphism",
    description: "Soft embossed shadows with tactile pressed depth",
    inputs: {
      preset: "neumorphism",
      backgroundType: "solid",
      backgroundColor: "#E5E7EB",
      backgroundOpacity: 100,
      glassEnabled: false,
      borderEnabled: false,
      borderColor: "transparent",
      borderWidth: "none",
      borderStyle: "solid",
      bottomBorderOnly: false,
      borderRadius: "xl",
      shadow: "neumorphism",
      customShadowInset: true,
      neumorphismRaised: false,
      textColor: "#1F2937",
      placeholderColor: "#9CA3AF",
      labelColor: "#1F2937",
      focusBorderColor: "#6366F1",
      focusRingColor: "rgba(99, 102, 241, 0.2)",
      focusRingEnabled: true,
      focusRingWidth: 2,
    },
  },
  {
    id: "filled",
    name: "Filled Slate",
    description: "Substantial dark tint with distinct active state transitions",
    inputs: {
      preset: "filled",
      backgroundType: "solid",
      backgroundColor: "#E2E8F0",
      backgroundOpacity: 100,
      glassEnabled: false,
      borderEnabled: true,
      borderColor: "#CBD5E1",
      borderWidth: "thin",
      borderStyle: "solid",
      bottomBorderOnly: false,
      borderRadius: "xl",
      shadow: "sm",
      textColor: "#0F172A",
      placeholderColor: "#64748B",
      labelColor: "#0F172A",
      focusBorderColor: "#0F172A",
      focusRingColor: "rgba(15, 23, 42, 0.15)",
      focusRingEnabled: true,
      focusRingWidth: 2,
      focusBackgroundColor: "#FFFFFF",
    },
  },
];

/**
 * Merge saved or incoming theme with complete defaults
 */
export function resolveFormTheme(savedTheme?: any, style?: FormStyle): FormTheme {
  if (!savedTheme && style) {
    // If no custom theme saved yet, match default preset to the legacy style option
    const preset = THEME_PRESETS.find((p) => p.id === style) || THEME_PRESETS[0];
    return {
      ...DEFAULT_FORM_THEME,
      ...preset.theme,
      background: { ...DEFAULT_FORM_THEME.background, ...(preset.theme.background || {}) },
      typography: { ...DEFAULT_FORM_THEME.typography, ...(preset.theme.typography || {}) },
      container: { ...DEFAULT_FORM_THEME.container, ...(preset.theme.container || {}) },
      fieldCard: { ...DEFAULT_FORM_THEME.fieldCard, ...(preset.theme.fieldCard || {}) },
      inputs: { ...DEFAULT_FORM_THEME.inputs, ...(preset.theme.inputs || {}) },
      buttons: { ...DEFAULT_FORM_THEME.buttons, ...(preset.theme.buttons || {}) },
      colors: { ...DEFAULT_FORM_THEME.colors, ...(preset.theme.colors || {}) },
      branding: { ...DEFAULT_FORM_THEME.branding, ...(preset.theme.branding || {}) },
      layout: { ...DEFAULT_FORM_THEME.layout, ...(preset.theme.layout || {}) },
    };
  }

  const raw = savedTheme || {};
  return {
    background: {
      ...DEFAULT_FORM_THEME.background,
      ...(raw.background || {}),
    },
    typography: {
      ...DEFAULT_FORM_THEME.typography,
      ...(raw.typography || {}),
    },
    container: {
      ...DEFAULT_FORM_THEME.container,
      ...(raw.container || {}),
    },
    fieldCard: {
      ...DEFAULT_FORM_THEME.fieldCard,
      ...(raw.fieldCard || {}),
      selectedBackgroundColor:
        raw.fieldCard?.selectedBackgroundColor === "#FFFFFF" || raw.fieldCard?.selectedBackgroundColor === "#ffffff"
          ? undefined
          : raw.fieldCard?.selectedBackgroundColor,
      selectedBorderColor:
        raw.fieldCard?.selectedBorderColor === "transparent"
          ? undefined
          : raw.fieldCard?.selectedBorderColor,
    },
    inputs: {
      ...DEFAULT_FORM_THEME.inputs,
      ...(raw.inputs || {}),
    },
    buttons: {
      ...DEFAULT_FORM_THEME.buttons,
      ...(raw.buttons || {}),
    },
    colors: {
      ...DEFAULT_FORM_THEME.colors,
      ...(raw.colors || {}),
    },
    branding: {
      ...DEFAULT_FORM_THEME.branding,
      ...(raw.branding || {}),
    },
    layout: {
      ...DEFAULT_FORM_THEME.layout,
      ...(raw.layout || {}),
    },
  };
}

/**
 * Computes exact CSS properties for any input styling configuration
 */
export function computeFieldCustomStyles(
  inp: FormThemeInputs,
  fontFamilyCss: string,
  themeColors?: FormThemeColors
) {
  const borderRadiusMap: Record<string, string> = {
    none: "0px",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    full: "9999px",
  };

  const borderWidthMap: Record<string, string> = {
    none: "0px",
    thin: "1px",
    medium: "2px",
    thick: "4px",
  };

  const boxShadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    soft: "0 4px 16px -2px rgba(28, 25, 23, 0.06)",
    glow: `0 0 16px ${inp.focusBorderColor || "#FF5A36"}33`,
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    neumorphism: inp.neumorphismRaised
      ? "4px 4px 8px rgba(0,0,0,0.08), -4px -4px 8px rgba(255,255,255,0.8)"
      : "inset 2px 2px 5px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.7)",
  };

  const inputHeightMap: Record<string, string> = {
    compact: "2.25rem",
    normal: "2.75rem",
    spacious: "3.25rem",
  };

  // 1. Background
  let bgCss: string | undefined = inp.backgroundColor || "#FAF8F5";
  if (inp.backgroundType === "transparent") {
    bgCss = "transparent";
  } else if (inp.backgroundType === "glass" || inp.glassEnabled) {
    if (inp.glassHighlight) {
      const op = (inp.glassOpacity ?? 65) / 100;
      const hop = (inp.glassHighlightOpacity ?? 20) / 100;
      bgCss = `linear-gradient(135deg, rgba(255,255,255,${Math.min(1, op + hop)}) 0%, rgba(255,255,255,${op}) 100%)`;
    } else {
      bgCss = inp.backgroundColor.startsWith("#")
        ? inp.backgroundColor
        : inp.backgroundColor || "rgba(255, 255, 255, 0.65)";
    }
  } else if (inp.backgroundType === "gradient") {
    if (inp.gradientType === "radial") {
      bgCss = `radial-gradient(circle, ${inp.gradientFrom || "#FAF8F5"} 0%, ${inp.gradientTo || "#FFF0EB"} 100%)`;
    } else {
      bgCss = `linear-gradient(${inp.gradientDirection || "135deg"}, ${inp.gradientFrom || "#FAF8F5"} 0%, ${inp.gradientTo || "#FFF0EB"} 100%)`;
    }
  }

  // 2. Border Radius
  let computedBorderRadius: string;
  if (inp.individualRadius) {
    computedBorderRadius = `${inp.radiusTopLeft ?? 12}px ${inp.radiusTopRight ?? 12}px ${inp.radiusBottomRight ?? 12}px ${inp.radiusBottomLeft ?? 12}px`;
  } else if (inp.borderRadius === "custom" && inp.customBorderRadius !== undefined) {
    computedBorderRadius = `${inp.customBorderRadius}px`;
  } else {
    computedBorderRadius = borderRadiusMap[inp.borderRadius] || "0.75rem";
  }

  // 3. Border
  const defaultBorderWidth =
    inp.borderWidth === "custom" && inp.customBorderWidth !== undefined
      ? `${inp.customBorderWidth}px`
      : borderWidthMap[inp.borderWidth] || "1px";

  // 4. Shadow
  let computedShadow: string;
  if (inp.shadow === "custom") {
    const inset = inp.customShadowInset ? "inset " : "";
    const x = inp.customShadowX ?? 0;
    const y = inp.customShadowY ?? 2;
    const blur = inp.customShadowBlur ?? 8;
    const spread = inp.customShadowSpread ?? 0;
    const color = inp.customShadowColor || "rgba(0,0,0,0.06)";
    computedShadow = `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
  } else if (inp.shadowEnabled === false) {
    computedShadow = "none";
  } else {
    computedShadow = boxShadowMap[inp.shadow || "none"] || "none";
  }

  // 5. Height & Padding
  const computedHeight =
    inp.height === "custom" && inp.customHeight !== undefined
      ? `${inp.customHeight}px`
      : inputHeightMap[inp.height] || "2.75rem";

  const paddingLeft = inp.paddingHorizontal !== undefined ? `${inp.paddingHorizontal}px` : "0.875rem";
  const paddingRight = inp.paddingHorizontal !== undefined ? `${inp.paddingHorizontal}px` : "0.875rem";
  const paddingTop = inp.paddingVertical !== undefined ? `${inp.paddingVertical}px` : "0.625rem";
  const paddingBottom = inp.paddingVertical !== undefined ? `${inp.paddingVertical}px` : "0.625rem";

  const fontSize =
    inp.fontSize === "custom" && inp.customFontSize !== undefined
      ? `${inp.customFontSize}px`
      : inp.fontSize === "xs"
      ? "0.75rem"
      : inp.fontSize === "base"
      ? "1rem"
      : inp.fontSize === "lg"
      ? "1.125rem"
      : "0.875rem";

  const isBorderDisabled = inp.borderEnabled === false;
  const isBottomOnly = inp.bottomBorderOnly === true;

  const inputStyle: React.CSSProperties = {
    background: bgCss,
    color: inp.textColor || "#1C1917",
    borderRadius: isBottomOnly ? "0px" : computedBorderRadius,
    borderStyle: isBorderDisabled ? "none" : inp.borderStyle || "solid",
    borderColor: inp.borderColor || "#EAE3D6",
    borderWidth: isBorderDisabled ? "0px" : isBottomOnly ? "0px" : defaultBorderWidth,
    borderBottomWidth: isBorderDisabled ? "0px" : defaultBorderWidth,
    borderTopWidth: isBorderDisabled || isBottomOnly || inp.borderTop === false ? "0px" : defaultBorderWidth,
    borderRightWidth: isBorderDisabled || isBottomOnly || inp.borderRight === false ? "0px" : defaultBorderWidth,
    borderLeftWidth: isBorderDisabled || isBottomOnly || inp.borderLeft === false ? "0px" : defaultBorderWidth,
    boxShadow: computedShadow,
    height: computedHeight,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    fontSize,
    fontWeight:
      inp.fontWeight === "bold"
        ? 700
        : inp.fontWeight === "semibold"
        ? 600
        : inp.fontWeight === "medium"
        ? 500
        : 400,
    letterSpacing:
      inp.letterSpacing === "tighter"
        ? "-0.03em"
        : inp.letterSpacing === "wide"
        ? "0.03em"
        : inp.letterSpacing === "widest"
        ? "0.08em"
        : "normal",
    backdropFilter:
      inp.glassEnabled || inp.backgroundType === "glass"
        ? `blur(${inp.glassBlur ?? 12}px)`
        : undefined,
    WebkitBackdropFilter:
      inp.glassEnabled || inp.backgroundType === "glass"
        ? `blur(${inp.glassBlur ?? 12}px)`
        : undefined,
    fontFamily: fontFamilyCss,
  };

  const inputLabelStyle: React.CSSProperties = {
    color: inp.labelColor || themeColors?.text || "#1C1917",
    fontSize:
      inp.labelFontSize === "xs"
        ? "0.75rem"
        : inp.labelFontSize === "base"
        ? "1rem"
        : inp.labelFontSize === "lg"
        ? "1.125rem"
        : inp.customLabelFontSize
        ? `${inp.customLabelFontSize}px`
        : "0.875rem",
    fontWeight:
      inp.labelFontWeight === "bold"
        ? 700
        : inp.labelFontWeight === "semibold"
        ? 600
        : inp.labelFontWeight === "medium"
        ? 500
        : 600,
    letterSpacing:
      inp.labelLetterSpacing === "tighter"
        ? "-0.03em"
        : inp.labelLetterSpacing === "wide"
        ? "0.03em"
        : inp.labelLetterSpacing === "widest"
        ? "0.08em"
        : "normal",
    marginBottom: `${inp.labelSpacing ?? 6}px`,
    fontFamily: fontFamilyCss,
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    height: "auto",
    minHeight: "5rem",
  };

  const dropzoneStyle: React.CSSProperties = {
    background: inp.dropzoneBgColor || "rgba(250, 248, 245, 0.6)",
    borderColor: inp.dropzoneBorderColor || inp.borderColor || "#EAE3D6",
    color: inp.dropzoneTextColor || inp.textColor || "#1C1917",
    borderRadius: computedBorderRadius,
    borderWidth: "2px",
    borderStyle: "dashed",
    backdropFilter:
      inp.glassEnabled || inp.backgroundType === "glass"
        ? `blur(${inp.glassBlur ?? 12}px)`
        : undefined,
  };

  const ratingStyle: React.CSSProperties = {
    color: inp.ratingActiveColor || "#F59E0B",
  };

  const checkboxRadiusMap = {
    none: "0px",
    sm: "0.25rem",
    md: "0.375rem",
    full: "9999px",
  };

  const checkboxStyle: React.CSSProperties = {
    borderRadius: checkboxRadiusMap[inp.checkboxRadius || "sm"] || "0.25rem",
    borderColor: inp.borderColor || "#EAE3D6",
    background: inp.backgroundType === "transparent" ? "transparent" : inp.backgroundColor || "#FFFFFF",
    color: inp.checkIconColor || "#FFFFFF",
  };

  const radioStyle: React.CSSProperties = {
    borderColor: inp.borderColor || "#EAE3D6",
    background: inp.backgroundType === "transparent" ? "transparent" : inp.backgroundColor || "#FFFFFF",
  };

  return {
    inputStyle,
    inputLabelStyle,
    textareaStyle,
    dropzoneStyle,
    ratingStyle,
    ratingActiveColor: inp.ratingActiveColor || "#F59E0B",
    ratingInactiveColor: inp.ratingInactiveColor || "#EAE3D6",
    ratingSize: inp.ratingSize || 20,
    checkboxStyle,
    radioStyle,
    computedBorderRadius,
    computedShadow,
    focusBorderColor: inp.focusBorderColor || "#FF5A36",
    focusRingColor: inp.focusRingColor || "rgba(255, 90, 54, 0.2)",
    accentColor: inp.accentColor || themeColors?.primary || "#FF5A36",
    placeholderColor: inp.placeholderColor || "#A8A29E",
    requiredColor: inp.requiredColor || "#FF5A36",
    requiredIndicator: inp.requiredIndicator || "asterisk",
  };
}

/**
 * Computes exact CSS properties for any outer Field / Question Card container
 */
export function computeFieldCardStyles(
  fc: FormThemeFieldCard,
  isSelected: boolean = false
) {
  const borderRadiusMap: Record<string, string> = {
    none: "0px",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  };

  const borderWidthMap: Record<string, string> = {
    none: "0px",
    thin: "1px",
    medium: "2px",
    thick: "4px",
  };

  const boxShadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    soft: "0 4px 20px -2px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03)",
    glow: "0 0 25px rgba(255, 90, 54, 0.2), 0 10px 30px rgba(0,0,0,0.08)",
    neumorphism: "5px 5px 12px rgba(0, 0, 0, 0.06), -5px -5px 12px rgba(255, 255, 255, 0.8)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  };

  const paddingMap: Record<string, string> = {
    compact: "0.75rem 1rem",
    normal: "1rem 1.25rem", // ~16px 20px
    spacious: "1.5rem 1.75rem",
  };

  // 1. Radius
  let computedBorderRadius: string;
  if (fc.individualRadius) {
    computedBorderRadius = `${fc.radiusTopLeft ?? 16}px ${fc.radiusTopRight ?? 16}px ${fc.radiusBottomRight ?? 16}px ${fc.radiusBottomLeft ?? 16}px`;
  } else if (fc.borderRadius === "custom" && fc.customBorderRadius !== undefined) {
    computedBorderRadius = `${fc.customBorderRadius}px`;
  } else {
    computedBorderRadius = borderRadiusMap[fc.borderRadius] || "1rem";
  }

  // 2. Border
  let computedBorderWidth = "0px";
  if (fc.borderEnabled !== false) {
    computedBorderWidth =
      fc.borderWidth === "custom" && fc.customBorderWidth !== undefined
        ? `${fc.customBorderWidth}px`
        : borderWidthMap[fc.borderWidth] || "1px";
  }

  // 3. Shadow
  let computedShadow = "none";
  if (fc.shadowEnabled !== false) {
    if (fc.shadow === "custom") {
      const inset = fc.customShadowInset ? "inset " : "";
      const x = fc.customShadowX ?? 0;
      const y = fc.customShadowY ?? 2;
      const blur = fc.customShadowBlur ?? 8;
      const spread = fc.customShadowSpread ?? 0;
      const color = fc.customShadowColor || "rgba(0,0,0,0.06)";
      computedShadow = `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
    } else if (fc.shadow) {
      computedShadow = boxShadowMap[fc.shadow] || "none";
    }
  }

  // 4. Background
  let computedBackground: string | undefined = undefined;
  if (fc.backgroundType === "transparent") {
    computedBackground = "transparent";
  } else if (fc.backgroundType === "gradient") {
    if (fc.gradientType === "radial") {
      computedBackground = `radial-gradient(circle, ${fc.gradientFrom || "#FAF8F5"} 0%, ${fc.gradientVia ? fc.gradientVia + " 50%," : ""} ${fc.gradientTo || "#FFFFFF"} 100%)`;
    } else {
      computedBackground = `linear-gradient(${fc.gradientDirection || "135deg"}, ${fc.gradientFrom || "#FAF8F5"} 0%, ${fc.gradientVia ? fc.gradientVia + " 50%," : ""} ${fc.gradientTo || "#FFFFFF"} 100%)`;
    }
  } else if (fc.backgroundType === "glass" || fc.glassEnabled) {
    const opacity = (fc.glassOpacity ?? 70) / 100;
    computedBackground = `rgba(255, 255, 255, ${opacity})`;
  } else if (fc.backgroundType === "image" && fc.imageUrl) {
    computedBackground = `url("${fc.imageUrl}")`;
  } else {
    // solid
    if (fc.backgroundOpacity !== undefined && fc.backgroundOpacity < 100) {
      const hex = fc.backgroundColor || "#FAF8F5";
      const alpha = Math.round((fc.backgroundOpacity / 100) * 255).toString(16).padStart(2, "0");
      computedBackground = hex.startsWith("#") && hex.length === 7 ? `${hex}${alpha}` : hex;
    } else {
      computedBackground = fc.backgroundColor || "#FAF8F5";
    }
  }

  // 5. Padding
  let computedPadding: string;
  if (fc.individualPadding) {
    computedPadding = `${fc.paddingTop ?? 16}px ${fc.paddingRight ?? 20}px ${fc.paddingBottom ?? 16}px ${fc.paddingLeft ?? 20}px`;
  } else if (fc.padding === "custom" && fc.customPadding !== undefined) {
    computedPadding = `${fc.customPadding}px`;
  } else {
    computedPadding = paddingMap[fc.padding] || "1rem 1.25rem";
  }

  // Base normal card style
  const cardStyle: React.CSSProperties = {
    background: computedBackground,
    borderRadius: computedBorderRadius,
    borderWidth: fc.individualBorders ? undefined : (fc.borderEnabled === false ? "0px" : computedBorderWidth),
    borderTopWidth: fc.individualBorders ? (fc.borderTop === false || fc.borderEnabled === false ? "0px" : computedBorderWidth) : undefined,
    borderRightWidth: fc.individualBorders ? (fc.borderRight === false || fc.borderEnabled === false ? "0px" : computedBorderWidth) : undefined,
    borderBottomWidth: fc.individualBorders ? (fc.borderBottom === false || fc.borderEnabled === false ? "0px" : computedBorderWidth) : undefined,
    borderLeftWidth: fc.individualBorders ? (fc.borderLeft === false || fc.borderEnabled === false ? "0px" : computedBorderWidth) : undefined,
    borderColor: fc.borderColor || "#EAE3D6",
    borderStyle: fc.borderStyle || "solid",
    boxShadow: computedShadow,
    padding: computedPadding,
    backdropFilter: fc.glassEnabled || fc.backgroundType === "glass" ? `blur(${fc.glassBlur ?? 12}px)` : undefined,
    WebkitBackdropFilter: fc.glassEnabled || fc.backgroundType === "glass" ? `blur(${fc.glassBlur ?? 12}px)` : undefined,
    transition: `all ${fc.transitionDuration ?? 200}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  };

  // Selected card style
  const ringWidth = fc.selectedRingWidth ?? 2;
  const ringColor = fc.selectedRingColor || "#FF5A36";
  const ringOpacity = (fc.selectedRingOpacity ?? 100) / 100;
  const ringCss = fc.selectedRingEnabled !== false
    ? `0 0 0 ${ringWidth}px ${ringColor}${ringOpacity < 1 ? Math.round(ringOpacity * 255).toString(16).padStart(2, "0") : ""}`
    : "";

  let selectedShadow = fc.selectedShadow && boxShadowMap[fc.selectedShadow] ? boxShadowMap[fc.selectedShadow] : "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
  const combinedSelectedShadow = ringCss
    ? `${ringCss}${selectedShadow && selectedShadow !== "none" ? `, ${selectedShadow}` : ""}`
    : selectedShadow;

  const selectedCardStyle: React.CSSProperties = {
    ...cardStyle,
    background:
      fc.selectedBackgroundColor &&
      fc.selectedBackgroundColor !== "#FFFFFF" &&
      fc.selectedBackgroundColor !== "#ffffff"
        ? fc.selectedBackgroundColor
        : cardStyle.background,
    borderColor:
      fc.selectedBorderColor && fc.selectedBorderColor !== "transparent"
        ? fc.selectedBorderColor
        : cardStyle.borderColor,
    borderWidth:
      fc.selectedBorderWidth !== undefined
        ? fc.selectedBorderWidth === "none"
          ? "0px"
          : borderWidthMap[fc.selectedBorderWidth] || cardStyle.borderWidth
        : cardStyle.borderWidth,
    boxShadow: combinedSelectedShadow,
  };

  return {
    fieldCardStyle: cardStyle,
    fieldCardSelectedStyle: selectedCardStyle,
    fieldCardHeaderSpacing: fc.headerContentSpacing ?? 12,
    fieldCardDescriptionSpacing: fc.descriptionSpacing ?? 6,
    fieldCardBorderRadius: computedBorderRadius,
    fieldCardShadow: computedShadow,
  };
}

/**
 * Resolves styles for a specific field, merging global theme with optional per-field overrides
 */
export function getComputedFieldStyles(
  field:
    | {
        customStyle?: Partial<FormThemeInputs>;
        customFieldCardStyle?: Partial<FormThemeFieldCard>;
        useGlobalStyle?: boolean;
        useGlobalFieldCardStyle?: boolean;
      }
    | undefined,
  theme: FormTheme
) {
  const selectedFont = GOOGLE_FONTS_LIST.find((f) => f.name === theme.typography.fontFamily);
  const fontFamilyCss = selectedFont ? selectedFont.family : theme.typography.fontFamily || "'Plus Jakarta Sans', sans-serif";

  const effectiveInputs: FormThemeInputs =
    field && field.customStyle && field.useGlobalStyle === false
      ? { ...theme.inputs, ...field.customStyle }
      : theme.inputs;

  const effectiveFieldCard: FormThemeFieldCard =
    field && field.customFieldCardStyle && field.useGlobalFieldCardStyle === false
      ? { ...theme.fieldCard, ...field.customFieldCardStyle }
      : theme.fieldCard;

  const inputStyles = computeFieldCustomStyles(effectiveInputs, fontFamilyCss, theme.colors);
  const cardStyles = computeFieldCardStyles(effectiveFieldCard);

  return {
    ...inputStyles,
    ...cardStyles,
  };
}

/**
 * Converts theme options into CSS styles for canvas, preview, and public forms
 */
export function getThemeComputedStyles(theme: FormTheme) {
  // 1. Background Style
  const bg = theme.background;
  let backgroundCss = bg.color || "#FAF8F5";

  if (bg.type === "gradient") {
    if (bg.gradientType === "radial") {
      backgroundCss = `radial-gradient(circle, ${bg.gradientFrom || "#FAF8F5"} 0%, ${bg.gradientVia ? bg.gradientVia + " 50%," : ""} ${bg.gradientTo || "#FFF0EB"} 100%)`;
    } else {
      backgroundCss = `linear-gradient(${bg.gradientDirection || "135deg"}, ${bg.gradientFrom || "#FAF8F5"} 0%, ${bg.gradientVia ? bg.gradientVia + " 50%," : ""} ${bg.gradientTo || "#FFF0EB"} 100%)`;
    }
  } else if (bg.type === "image" && bg.imageUrl) {
    backgroundCss = `url("${bg.imageUrl}")`;
  }

  const backgroundStyle: React.CSSProperties = {
    background: bg.type === "image" && bg.imageUrl ? undefined : backgroundCss,
    backgroundImage: bg.type === "image" && bg.imageUrl ? `url("${bg.imageUrl}")` : undefined,
    backgroundColor: bg.type === "image" ? bg.color || "#FAF8F5" : undefined,
    backgroundPosition: bg.imagePosition || "center",
    backgroundSize: bg.imageSize || "cover",
    backgroundRepeat: bg.imageRepeat || "no-repeat",
    backgroundAttachment: "fixed",
    filter: bg.blur > 0 ? `blur(${bg.blur}px)` : undefined,
  };

  // 2. Font Family
  const selectedFont = GOOGLE_FONTS_LIST.find((f) => f.name === theme.typography.fontFamily);
  const selectedHeadingFont = GOOGLE_FONTS_LIST.find((f) => f.name === (theme.typography.headingFont || theme.typography.fontFamily));
  const fontFamilyCss = selectedFont ? selectedFont.family : theme.typography.fontFamily || "'Plus Jakarta Sans', sans-serif";
  const headingFontFamilyCss = selectedHeadingFont ? selectedHeadingFont.family : fontFamilyCss;

  // 3. Container Card Style
  const c = theme.container;
  const borderRadiusMap: Record<string, string> = {
    none: "0px",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    full: "9999px",
  };

  const borderWidthMap: Record<string, string> = {
    none: "0px",
    thin: "1px",
    medium: "2px",
    thick: "4px",
  };

  const boxShadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    soft: "0 4px 20px -2px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03)",
    glow: `0 0 25px ${theme.colors.primary}33, 0 10px 30px rgba(0,0,0,0.08)`,
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  };

  const paddingMap: Record<string, string> = {
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  };

  const maxWidthMap: Record<string, string> = {
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    full: "100%",
  };

  // Compute Card Background
  let cardBgCss: string | undefined = c.backgroundColor || "#FFFFFF";
  let cardBgImage: string | undefined = undefined;

  if (c.backgroundType === "gradient") {
    if (c.gradientType === "radial") {
      cardBgCss = `radial-gradient(circle, ${c.gradientFrom || "#FFFFFF"} 0%, ${c.gradientVia ? c.gradientVia + " 50%," : ""} ${c.gradientTo || "#FAF8F5"} 100%)`;
    } else {
      cardBgCss = `linear-gradient(${c.gradientDirection || "135deg"}, ${c.gradientFrom || "#FFFFFF"} 0%, ${c.gradientVia ? c.gradientVia + " 50%," : ""} ${c.gradientTo || "#FAF8F5"} 100%)`;
    }
  } else if (c.backgroundType === "image" && c.imageUrl) {
    // When backgroundType is "image", the card renders an inner background div
    // layer to allow blur & overlay filters without blurring form inputs and typography
    cardBgImage = undefined;
    cardBgCss = undefined;
  }

  // Compute Card Border Radius
  let computedBorderRadius: string;
  if (c.individualRadius) {
    computedBorderRadius = `${c.radiusTopLeft ?? 24}px ${c.radiusTopRight ?? 24}px ${c.radiusBottomRight ?? 24}px ${c.radiusBottomLeft ?? 24}px`;
  } else if (c.borderRadius === "custom" && c.customBorderRadius !== undefined) {
    computedBorderRadius = `${c.customBorderRadius}px`;
  } else {
    computedBorderRadius = borderRadiusMap[c.borderRadius] || "1.5rem";
  }

  // Compute Card Border Width
  const defaultBorderWidth =
    c.borderWidth === "custom" && c.customBorderWidth !== undefined
      ? `${c.customBorderWidth}px`
      : borderWidthMap[c.borderWidth] || "1px";

  // Compute Card Box Shadow
  let computedBoxShadow: string;
  if (c.boxShadow === "custom") {
    const inset = c.customShadowInset ? "inset " : "";
    const x = c.customShadowX ?? 0;
    const y = c.customShadowY ?? 4;
    const blur = c.customShadowBlur ?? 20;
    const spread = c.customShadowSpread ?? 0;
    const color = c.customShadowColor || "rgba(28, 25, 23, 0.06)";
    computedBoxShadow = `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
  } else {
    computedBoxShadow = boxShadowMap[c.boxShadow] || boxShadowMap.soft;
  }

  // Compute Card Padding
  let computedPadding: string;
  if (c.individualPadding) {
    computedPadding = `${c.paddingTop ?? 32}px ${c.paddingRight ?? 32}px ${c.paddingBottom ?? 32}px ${c.paddingLeft ?? 32}px`;
  } else if (c.padding === "custom" && c.customPadding !== undefined) {
    computedPadding = `${c.customPadding}px`;
  } else {
    computedPadding = paddingMap[c.padding] || "2rem";
  }

  // Compute Max Width
  const computedMaxWidth =
    c.maxWidth === "custom" && c.customMaxWidth !== undefined
      ? `${c.customMaxWidth}px`
      : maxWidthMap[c.maxWidth] || "42rem";

  const containerStyle: React.CSSProperties = {
    background: cardBgCss,
    backgroundImage: cardBgImage,
    backgroundColor: c.backgroundType === "image" ? c.backgroundColor || "#FFFFFF" : undefined,
    backgroundPosition: c.imagePosition || "center",
    backgroundSize: c.imageSize || "cover",
    backgroundRepeat: c.imageRepeat || "no-repeat",
    borderRadius: computedBorderRadius,
    position: "relative",
    overflow: "hidden",
    borderWidth: (c.borderTop === false || c.borderRight === false || c.borderBottom === false || c.borderLeft === false) ? undefined : defaultBorderWidth,
    borderTopWidth: (c.borderTop === false || c.borderRight === false || c.borderBottom === false || c.borderLeft === false) ? (c.borderTop === false ? "0px" : defaultBorderWidth) : undefined,
    borderRightWidth: (c.borderTop === false || c.borderRight === false || c.borderBottom === false || c.borderLeft === false) ? (c.borderRight === false ? "0px" : defaultBorderWidth) : undefined,
    borderBottomWidth: (c.borderTop === false || c.borderRight === false || c.borderBottom === false || c.borderLeft === false) ? (c.borderBottom === false ? "0px" : defaultBorderWidth) : undefined,
    borderLeftWidth: (c.borderTop === false || c.borderRight === false || c.borderBottom === false || c.borderLeft === false) ? (c.borderLeft === false ? "0px" : defaultBorderWidth) : undefined,
    borderStyle: c.borderStyle || "solid",
    borderColor: c.borderColor || "#EAE3D6",
    boxShadow: computedBoxShadow,
    padding: computedPadding,
    maxWidth: computedMaxWidth,
    minHeight: c.minHeight && c.minHeight !== "none" ? `${c.minHeight}px` : undefined,
    opacity: c.opacity !== undefined && c.opacity < 100 ? c.opacity / 100 : undefined,
    backdropFilter: c.glassBlur > 0 ? `blur(${c.glassBlur}px)` : undefined,
    WebkitBackdropFilter: c.glassBlur > 0 ? `blur(${c.glassBlur}px)` : undefined,
    fontFamily: fontFamilyCss,
    color: theme.colors.text || "#1C1917",
  };

  // 4. Input Fields Style
  const fieldCustomStyles = computeFieldCustomStyles(theme.inputs, fontFamilyCss, theme.colors);

  // 4.5 Field / Question Card Style
  const cardCustomStyles = computeFieldCardStyles(theme.fieldCard);

  // 5. Buttons Style
  const btn = theme.buttons;
  const btnSizeMap = {
    sm: { height: "2.25rem", padding: "0 1rem", fontSize: "0.75rem" },
    md: { height: "2.75rem", padding: "0 1.5rem", fontSize: "0.875rem" },
    lg: { height: "3.25rem", padding: "0 2rem", fontSize: "1rem" },
  };
  const curBtnSize = btnSizeMap[btn.size] || btnSizeMap.md;

  const buttonStyle: React.CSSProperties = {
    backgroundColor: btn.backgroundColor || theme.colors.primary || "#FF5A36",
    color: btn.textColor || "#FFFFFF",
    borderRadius: borderRadiusMap[btn.borderRadius] || "0.75rem",
    borderWidth: borderWidthMap[btn.borderWidth] || "0px",
    borderColor: btn.borderColor || "transparent",
    height: curBtnSize.height,
    padding: curBtnSize.padding,
    fontSize: curBtnSize.fontSize,
    fontWeight: btn.fontWeight === "bold" ? 700 : btn.fontWeight === "semibold" ? 600 : btn.fontWeight === "medium" ? 500 : 400,
    boxShadow: btn.shadow === "glow" ? `0 0 15px ${btn.backgroundColor}40` : boxShadowMap[btn.shadow] || "none",
    width: btn.fullWidth ? "100%" : "auto",
    fontFamily: fontFamilyCss,
  };

  // 6. Heading & Description Style
  const headingSizeMap = {
    base: "1.125rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.875rem",
    "3xl": "2.25rem",
  };

  const headingColor = theme.typography.headingColor || theme.colors.text || "#1C1917";
  const descriptionColor = theme.typography.descriptionColor || theme.colors.mutedText || "#78716C";

  const headingStyle: React.CSSProperties = {
    fontFamily: headingFontFamilyCss,
    fontSize: headingSizeMap[theme.typography.headingSize] || "1.875rem",
    fontWeight: theme.typography.fontWeight === "bold" ? 700 : theme.typography.fontWeight === "medium" ? 500 : 600,
    color: headingColor,
    letterSpacing: theme.typography.letterSpacing === "tighter" ? "-0.05em" : theme.typography.letterSpacing === "wide" ? "0.05em" : theme.typography.letterSpacing === "widest" ? "0.1em" : "normal",
  };

  const descriptionStyle: React.CSSProperties = {
    color: descriptionColor,
  };

  return {
    backgroundStyle,
    containerStyle,
    fieldCardStyle: cardCustomStyles.fieldCardStyle,
    fieldCardSelectedStyle: cardCustomStyles.fieldCardSelectedStyle,
    fieldCardHeaderSpacing: cardCustomStyles.fieldCardHeaderSpacing,
    fieldCardDescriptionSpacing: cardCustomStyles.fieldCardDescriptionSpacing,
    fieldCardBorderRadius: cardCustomStyles.fieldCardBorderRadius,
    fieldCardShadow: cardCustomStyles.fieldCardShadow,
    inputStyle: fieldCustomStyles.inputStyle,
    inputLabelStyle: fieldCustomStyles.inputLabelStyle,
    textareaStyle: fieldCustomStyles.textareaStyle,
    dropzoneStyle: fieldCustomStyles.dropzoneStyle,
    ratingStyle: fieldCustomStyles.ratingStyle,
    checkboxStyle: fieldCustomStyles.checkboxStyle,
    radioStyle: fieldCustomStyles.radioStyle,
    focusBorderColor: fieldCustomStyles.focusBorderColor,
    focusRingColor: fieldCustomStyles.focusRingColor,
    accentColor: fieldCustomStyles.accentColor,
    placeholderColor: fieldCustomStyles.placeholderColor,
    requiredColor: fieldCustomStyles.requiredColor,
    requiredIndicator: fieldCustomStyles.requiredIndicator,
    buttonStyle,
    headingStyle,
    descriptionStyle,
    headingColor,
    descriptionColor,
    fontFamilyCss,
    headingFontFamilyCss,
  };
}
