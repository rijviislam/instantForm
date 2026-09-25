import SmoothScroll from "@/components/SmoothScroll";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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
      suppressHydrationWarning
      className={`${newsreader.variable} ${jakarta.variable} font-sans-modern antialiased selection:bg-[#FFE5DE] selection:text-[#E44825]`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('instantform_theme');
                  var isDark = stored === 'dark' || (!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0F17] text-[#1C1917] dark:text-[#F8FAFC] flex flex-col overflow-x-hidden selection:bg-[#FFE5DE] selection:text-[#E44825] transition-colors duration-200">
        <ThemeProvider>
          <SmoothScroll />
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

