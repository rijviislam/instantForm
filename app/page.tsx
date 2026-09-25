import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Metrics } from "@/components/landing/Metrics";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { FormStyles } from "@/components/landing/FormStyles";
import { Comparison } from "@/components/landing/Comparison";
import { Templates } from "@/components/landing/Templates";
import { AnalyticsPreview } from "@/components/landing/AnalyticsPreview";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0B0F17] text-[#1C1917] dark:text-[#F8FAFC] selection:bg-[#FFE5DE] dark:selection:bg-[#FF5A36]/30 selection:text-[#E44825] dark:selection:text-[#FF6B4A] transition-colors duration-200">
      {/* 1. Sticky / Floating Navigation */}
      <Navbar />

      {/* Main Landing Page Content */}
      <main className="flex-1 w-full overflow-hidden">
        {/* 2. Hero Section + Interactive Canvas */}
        <Hero />

        {/* 3. Social Proof & Animated Metrics */}
        <Metrics />

        {/* 4. How It Works: 3-Step Interactive Timeline */}
        <HowItWorks />

        {/* 5. Features Grid with Interactive Mockups */}
        <Features />

        {/* 6. Beautiful by Default: 5 Personality Styles */}
        <FormStyles />

        {/* 7. Why InstantForm: Direct Comparison */}
        <Comparison />

        {/* 8. Templates Library with Category Filters & Modal Preview */}
        <Templates />

        {/* 9. Response Analytics Dashboard */}
        <AnalyticsPreview />

        {/* 10. Frequently Asked Questions Accordion */}
        <FAQ />

        {/* 11. Final Conversion CTA with Ambient Glow */}
        <FinalCTA />
      </main>

      {/* 12. Complete Footer with Theme & Language Selectors */}
      <Footer />
    </div>
  );
}
