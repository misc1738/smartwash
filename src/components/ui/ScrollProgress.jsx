import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      const p = total > 0 ? scrollTop / total : 0;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[60] h-[3px] w-full pointer-events-none">
      <div
        className="h-full origin-left bg-gradient-to-r from-[#2C9BEF] via-[#F5BA2E] to-[#2C9BEF] shadow-[0_0_16px_rgba(44,155,239,0.45)] transition-transform duration-75"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
