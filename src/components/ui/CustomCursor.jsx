import { useEffect, useRef, useState } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export default function CustomCursor() {
  const prefersReduced = usePrefersReducedMotion();
  const isCoarse = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

  const ref = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    if (prefersReduced || isCoarse) return;

    const el = ref.current;
    if (!el) return;

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const loop = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.2);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.2);
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId.current = requestAnimationFrame(loop);

    const magnetics = Array.from(document.querySelectorAll('[data-magnetic], a, button'));
    const enter = () => {
      el.classList.add("scale-150", "opacity-90");
    };
    const leave = () => {
      el.classList.remove("scale-150", "opacity-90");
    };
    magnetics.forEach((m) => {
      m.addEventListener("mouseenter", enter);
      m.addEventListener("mouseleave", leave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      magnetics.forEach((m) => {
        m.removeEventListener("mouseenter", enter);
        m.removeEventListener("mouseleave", leave);
      });
    };
  }, [prefersReduced, isCoarse]);

  if (prefersReduced || isCoarse) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[70] -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-white/70 bg-white/10 backdrop-blur-sm transition-transform duration-150 ease-out mix-blend-difference"
    />
  );
}
