import React, { useEffect, useState } from 'react';

/**
 * ThemeImage
 * Props:
 * - base: string (e.g. '/img/service-1.jpg') base (dark) image; light variant is derived by inserting '-light' before extension
 * - srcDark, srcLight: explicit paths
 * - alt, className, loading, decorative
 */
export default function ThemeImage({ base, srcDark, srcLight, alt = '', className = '', loading = 'lazy', decorative = false, fallback, imgStyle = {} }) {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getInitialTheme = () => {
    try {
      if (document.documentElement.classList.contains('light')) return 'light';
      if (document.documentElement.classList.contains('dark')) return 'dark';
    } catch (e) {}
    return 'dark';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const makeLightFromBase = (b) => {
    if (!b) return null;
    return b.replace(/(\.[a-zA-Z0-9]+)$/, '-light$1');
  };

  const darkSrc = srcDark || base;
  const lightSrc = srcLight || makeLightFromBase(base);

  const pick = (t) => (t === 'light' ? (lightSrc || darkSrc) : (darkSrc || lightSrc));

  const [currentSrc, setCurrentSrc] = useState(() => pick(getInitialTheme()));
  const [prevSrc, setPrevSrc] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const checkExists = async (url) => {
      if (!url) return false;
      try {
        const key = `imgexists:${url}`;
        const cached = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key);
        if (cached !== null) return cached === '1';
        // try HEAD request to avoid downloading the whole image
        const res = await fetch(url, { method: 'HEAD', cache: 'force-cache' });
        const ok = res && res.ok;
        try { if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, ok ? '1' : '0'); } catch (e) {}
        return ok;
      } catch (e) {
        return false;
      }
    };

    const onTheme = async (e) => {
      const t = e?.detail || (document.documentElement.classList.contains('light') ? 'light' : 'dark');
      if (!t) return;
      const candidate = pick(t);
      if (candidate === currentSrc) return;

      // Prefer candidate if it exists; otherwise try the alternate or fallback
      const exists = await checkExists(candidate);
      const next = exists ? candidate : ((candidate === darkSrc ? lightSrc : darkSrc) || fallback);
      if (!next || next === currentSrc) return;

      // preload next (full load) then swap
      const img = new Image();
      img.src = next;
      img.onload = () => {
        setPrevSrc(currentSrc);
        setCurrentSrc(next);
        if (!prefersReduced) setTransitioning(true);
        setTimeout(() => {
          setPrevSrc(null);
          setTransitioning(false);
        }, prefersReduced ? 0 : 500);
      };
      img.onerror = () => {
        // on error, try fallback if provided
        if (fallback && fallback !== currentSrc) {
          setPrevSrc(currentSrc);
          setCurrentSrc(fallback);
          if (!prefersReduced) setTransitioning(true);
          setTimeout(() => {
            setPrevSrc(null);
            setTransitioning(false);
          }, prefersReduced ? 0 : 500);
        }
      };
    };

    window.addEventListener('theme-change', onTheme);
    return () => window.removeEventListener('theme-change', onTheme);
  }, [currentSrc]);

  // preload alternate on mount
  useEffect(() => {
    try {
      const alt = theme === 'light' ? darkSrc : lightSrc;
      if (alt) {
        const p = new Image(); p.src = alt;
      }
    } catch (e) {}
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden={decorative}>
      {prevSrc && (
        <img
          src={prevSrc}
          alt={alt}
          loading={loading}
          style={imgStyle}
          onError={(e) => {
            if (fallback && e?.target?.src !== fallback) e.target.src = fallback;
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          style={imgStyle}
          onError={(e) => {
            if (fallback && e?.target?.src !== fallback) e.target.src = fallback;
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${transitioning ? 'opacity-100' : 'opacity-100'}`}
        />
      )}
    </div>
  );
}
