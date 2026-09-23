"use client";
import Lenis from "lenis";
import { useEffect } from "react";

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const onAnimationFrame = (time) => {
      lenis.raf(time);
      requestAnimationFrame(onAnimationFrame);
    };

    requestAnimationFrame(onAnimationFrame);

    return () => {
      lenis.destroy();
    };
  }, []);
}
