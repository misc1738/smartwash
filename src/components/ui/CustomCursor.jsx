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

  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    if (prefersReduced || isCoarse) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const loop = () => {
      // Main ring follows with delay
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15);
      cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;

      // Dot follows instantly (or very fast)
      dotPos.current.x = lerp(dotPos.current.x, target.current.x, 0.5);
      dotPos.current.y = lerp(dotPos.current.y, target.current.y, 0.5);
      dot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;

      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId.current = requestAnimationFrame(loop);

    const magnetics = Array.from(document.querySelectorAll('[data-magnetic], a, button, input, textarea'));

    const enter = () => {
      cursor.classList.add("scale-[2.5]", "bg-primary/10", "border-primary/50");
      cursor.classList.remove("border-primary");
      dot.classList.add("opacity-0");
    };

    const leave = () => {
      cursor.classList.remove("scale-[2.5]", "bg-primary/10", "border-primary/50");
      cursor.classList.add("border-primary");
      dot.classList.remove("opacity-0");
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
    <>
      {/* Main Ring */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-primary transition-all duration-300 ease-out"
      />
      {/* Center Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-primary transition-opacity duration-300"
      />
    </>
  );
}
