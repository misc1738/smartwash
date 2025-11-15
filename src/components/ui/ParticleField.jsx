import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ParticleField() {
  const containerRef = useRef(null);

  // Respect user preferences and low-power devices
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData;
  const deviceMemory = typeof navigator !== 'undefined' ? navigator.deviceMemory || 4 : 4;

  useEffect(() => {
    if (prefersReduced || saveData || deviceMemory < 1) return undefined;

    let cancelled = false;
    const run = () => {
      try {
        if (cancelled) return;
        if (!containerRef.current) return;

        const particles = [];
        // Scale particle count to device memory to avoid overloading
        const baseCount = 30;
        const particleCount = Math.max(8, Math.floor(baseCount * Math.min(1, deviceMemory / 4)));

        // Create particles
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: radial-gradient(circle, rgba(44, 155, 239, 0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            will-change: transform, opacity;
          `;

          containerRef.current.appendChild(particle);
          particles.push(particle);

          // Random starting position
          try {
            gsap.set(particle, {
              x: Math.random() * (window?.innerWidth || 800),
              y: Math.random() * (window?.innerHeight || 600),
              opacity: Math.random() * 0.5 + 0.3,
            });
          } catch (e) {
            // ignore positioning errors
          }

          // Animate particle
          try {
            gsap.to(particle, {
              x: `+=${Math.random() * 200 - 100}`,
              y: `+=${Math.random() * 200 - 100}`,
              opacity: Math.random() * 0.8,
              duration: Math.random() * 10 + 10,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            });
          } catch (e) {
            // Ignore animation errors
          }
        }

        // Cleanup
        return () => particles.forEach((p) => p.remove());
      } catch (err) {
        // Prevent uncaught errors from crashing the app
        // eslint-disable-next-line no-console
        console.warn('[ParticleField] failed to initialize:', err);
      }
    };

    // Initialize during idle if possible to avoid blocking
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 2000 });
      return () => {
        cancelled = true;
        try { window.cancelIdleCallback(id); } catch (e) { /* ignore */ }
      };
    }

    const to = setTimeout(run, 500);
    return () => {
      cancelled = true;
      clearTimeout(to);
    };
  }, [deviceMemory, prefersReduced, saveData]);

  if (prefersReduced || saveData || deviceMemory < 1) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
}
