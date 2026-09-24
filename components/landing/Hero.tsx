"use client";

import { gsap, prefersReducedMotion, registerGSAP } from "@/lib/animations/gsapUtils";
import { ArrowRight, LayoutTemplate, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();

    if (prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial page load timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("#hero-eyebrow", {
        opacity: 0,
        y: -15,
        duration: 0.6,
      })
        .from(
          "#hero-headline",
          {
            opacity: 0,
            y: 25,
            duration: 0.8,
          },
          "-=0.3"
        )
        .from(
          "#hero-desc",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          "#hero-ctas",
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          "#hero-form-card",
          {
            opacity: 0,
            y: 40,
            scale: 0.95,
            duration: 0.9,
            ease: "back.out(1.4)",
          },
          "-=0.5"
        )
        .from(
          ["#hero-floating-1", "#hero-floating-2", "#hero-floating-3"],
          {
            opacity: 0,
            scale: 0.8,
            y: 20,
            stagger: 0.15,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );

      // Idle floating animation for badges
      gsap.to("#hero-floating-1", {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to("#hero-floating-2", {
        y: 8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // 2. Signature Scroll Transformation
      if (scrollSectionRef.current) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollSectionRef.current,
            start: "top top",
            end: "+=600",
            scrub: 1.2,
            pin: false,
          },
        });

        scrollTl
          .to("#hero-form-card", {
            scale: 1.04,
            rotation: 0.8,
            y: 30,
            boxShadow: "0 30px 60px -15px rgba(28, 25, 23, 0.14)",
            ease: "none",
          })
          .to(
            "#hero-floating-1",
            {
              y: -35,
              x: 15,
              opacity: 0.85,
              ease: "none",
            },
            0
          )
          .to(
            "#hero-floating-2",
            {
              y: 30,
              x: -15,
              opacity: 0.85,
              ease: "none",
            },
            0
          )
          .to(
            "#hero-floating-3",
            {
              x: 20,
              ease: "none",
            },
            0
          );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero-preview"
      className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden warm-mesh-bg"
    >
      {/* Decorative ambient radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#FF5A36]/10 via-[#FFA07A]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div
        ref={scrollSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center"
      >
        {/* Eyebrow Badge */}
        <div id="hero-eyebrow" className="mb-6">
          <Badge
            variant="coral"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            className="shadow-sm"
          >
            The Modern Form Builder
          </Badge>
        </div>

        {/* Editorial Serif Main Headline */}
        <h1
          id="hero-headline"
          ref={headlineRef}
          className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal tracking-tight text-[#1C1917] max-w-4xl leading-[1.08] sm:leading-[1.06]"
        >
          Build forms that feel{" "}
          <span className="italic font-medium text-[#FF5A36] relative inline-block">
            anything but ordinary
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-2.5 text-[#FF5A36]/30 -z-10"
              viewBox="0 0 200 8"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M1 5.5C40 2 160 2 199 5.5"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          .
        </h1>

        {/* Supporting text */}
        <p
          id="hero-desc"
          className="mt-6 text-base sm:text-lg md:text-xl text-[#57534E] max-w-2xl font-normal leading-relaxed"
        >
          Create, publish, share, and understand responses—without wrestling with
          a boring form builder. Fast, beautiful, and delightfully simple.
        </p>

        {/* CTAs */}
        <div
          id="hero-ctas"
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto group"
            iconRight={
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            }
            onClick={() => {
              router.push("/register");
            }}
          >
            Start building
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            iconLeft={<LayoutTemplate className="w-4 h-4 text-[#57534E]" />}
            onClick={() => {
              const el = document.getElementById("templates");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore templates
          </Button>
        </div>

        {/* Hero trust micro-badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#78716C] ">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#FF5A36]" /> Ready in 60 seconds
          </span>
          <span className="hidden sm:inline text-[#D6CEC1]">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A36]" /> 100% No-code required
          </span>
          <span className="hidden sm:inline text-[#D6CEC1]">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" /> Free template library
          </span>
        </div>

        {/* Hero Interactive Canvas Visual */}
        {/* <div className="mt-12 sm:mt-16 w-full">
          <HeroVisual />
        </div> */}
      </div>
    </section>
  );
}
