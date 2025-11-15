import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({ children, y = 24, duration = 0.8, delay = 0, stagger = 0.08, once = true, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.opacity = 1;
      el.style.transform = 'none';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y });
      const tl = gsap.timeline({ paused: true });
      const targets = el.children?.length ? el.children : el;
      tl.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        stagger,
        delay,
        clearProps: 'transform,opacity'
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        once,
      });
    }, ref);

    return () => ctx.revert();
  }, [y, duration, delay, stagger, once]);

  return (
    <div ref={ref} className={className} aria-live="polite">
      {children}
    </div>
  );
}
