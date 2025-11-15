import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SimpleSplitText
 * - Dependency-free alternative to GSAP's SplitText plugin
 * - Splits text into characters and animates them with GSAP
 */
export default function SimpleSplitText({
  text,
  tag = 'h1',
  className = '',
  delay = 0.06, // seconds between chars
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  duration = 0.6,
  ease = 'power3.out',
  triggerOnce = true,
  start = 'top 90%'
}) {
  const ref = useRef(null);
  const chars = useMemo(() => {
    if (!text) return [];
    return [...text];
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll('[data-char]');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay,
          scrollTrigger: {
            trigger: el,
            start,
            once: triggerOnce,
          },
          willChange: 'transform, opacity',
          force3D: true,
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, from, to, duration, ease, triggerOnce, start]);

  const common = `inline-block ${className}`;

  const renderChar = (c, i) => {
    if (c === ' ') {
      return (
        <span key={`sp-${i}`} data-char className="inline-block" style={{ whiteSpace: 'pre' }}>
          {' '}
        </span>
      );
    }
    return (
      <span key={`c-${i}`} data-char className="inline-block">
        {c}
      </span>
    );
  };

  switch (tag) {
    case 'h1':
      return (
        <h1 ref={ref} className={common}>
          {chars.map(renderChar)}
        </h1>
      );
    case 'h2':
      return (
        <h2 ref={ref} className={common}>
          {chars.map(renderChar)}
        </h2>
      );
    case 'h3':
      return (
        <h3 ref={ref} className={common}>
          {chars.map(renderChar)}
        </h3>
      );
    default:
      return (
        <p ref={ref} className={common}>
          {chars.map(renderChar)}
        </p>
      );
  }
}
