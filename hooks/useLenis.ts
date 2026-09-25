"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { registerGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/animations/gsapUtils";

export default function useLenis() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (prefersReducedMotion()) {
      return;
    }

    // Disable smooth scrolling on form builder/editor routes to avoid canvas drag interference
    const isEditorRoute =
      pathname?.includes("/edit") ||
      pathname?.includes("/builder") ||
      pathname === "/forms/new";

    if (isEditorRoute) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        if (typeof window !== "undefined") {
          (window as unknown as Record<string, unknown>).__lenisInstance = undefined;
        }
      }
      return;
    }

    // Initialize Lenis with smooth momentum settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      prevent: (node: HTMLElement) => {
        return Boolean(
          node.hasAttribute?.("data-lenis-prevent") ||
          node.closest?.("[data-lenis-prevent]") ||
          node.closest?.(".modal-scroll") ||
          node.closest?.(".drawer-scroll")
        );
      },
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__lenisInstance = lenis;
    }

    // Connect with GSAP ScrollTrigger if active
    registerGSAP();
    if (ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    // Smooth RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    // Global smooth anchor click handler for in-page # links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -80,
            duration: 1.2,
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== "undefined") {
        (window as unknown as Record<string, unknown>).__lenisInstance = undefined;
      }
    };
  }, [pathname]);

  return lenisRef;
}
