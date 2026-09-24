"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function useLenis() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable smooth window scrolling on editor / form builder routes
    if (pathname?.includes("/edit") || pathname?.includes("/builder")) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      prevent: (node) => {
        return Boolean(
          node.hasAttribute?.("data-lenis-prevent") ||
          node.closest?.("[data-lenis-prevent]") ||
          node.closest?.(".overflow-y-auto") ||
          node.closest?.(".overflow-auto") ||
          node.closest?.("aside") ||
          node.closest?.("main")
        );
      },
    });

    let rafId;
    const onAnimationFrame = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(onAnimationFrame);
    };

    rafId = requestAnimationFrame(onAnimationFrame);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);
}
