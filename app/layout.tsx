import SmoothScroll from "@/components/SmoothScroll";
import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "InstantForm — Build forms that feel anything but ordinary",
  description:
    "InstantForm is a modern, design-first form builder that allows users to create beautiful, responsive forms quickly without code. Fast, beautiful, and simple.",
  keywords: [
    "form builder",
    "no-code form builder",
    "beautiful forms",
    "responsive forms",
    "survey creator",
    "instantform",
  ],
  authors: [{ name: "InstantForm Team" }],
  openGraph: {
    title: "InstantForm — Build forms that feel anything but ordinary",
    description:
      "Create, publish, share, and understand responses—without wrestling with a boring form builder.",
    type: "website",
    locale: "en_US",
    siteName: "InstantForm",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantForm — Build forms that feel anything but ordinary",
    description:
      "Create, publish, share, and understand responses—without wrestling with a boring form builder.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${jakarta.variable} font-sans-modern antialiased selection:bg-[#FFE5DE] selection:text-[#E44825]`}
    >
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col overflow-x-hidden selection:bg-[#FFE5DE] selection:text-[#E44825]">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
