import { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }) {
  const getSystem = () => {
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) { return 'light'; }
  };

  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      return getSystem();
    } catch (e) {
      return getSystem();
    }
  });

  // track if user explicitly set a theme so we don't override when system changes
  const [userSet, setUserSet] = useState(() => {
    try { return !!localStorage.getItem('theme-user-set'); } catch (e) { return false; }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.remove('light');
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.add('light');

    // Smooth transitions: add a temporary class that enables transitions
    try {
      root.classList.add('theme-transition');
      window.setTimeout(() => root.classList.remove('theme-transition'), 550);
    } catch (e) {}

    try { localStorage.setItem('theme', theme); } catch (e) {}
    try {
      if (userSet) {
        localStorage.setItem('theme-user-set', '1');
      } else {
        localStorage.removeItem('theme-user-set');
      }
    } catch (e) {}

    try {
      window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }));
    } catch (e) {}
  }, [theme, userSet]);

  useEffect(() => {
    // listen to system preference changes if user hasn't explicitly set a theme
    let mq;
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = (e) => {
        if (!userSet) setTheme(e.matches ? 'dark' : 'light');
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
      return () => {
        try { if (mq.removeEventListener) mq.removeEventListener('change', onChange); else if (mq.removeListener) mq.removeListener(onChange); } catch (e) {}
      };
    } catch (e) {}
  }, [userSet]);

  const toggle = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      // announce for screen readers
      try {
        const announcer = document.getElementById('theme-announcer');
        if (announcer) announcer.textContent = `${next === 'dark' ? 'Dark' : 'Light'} theme activated`;
      } catch (e) {}
      // preload a couple of likely images for faster swap
      try {
        const list = ['/img/hero.jpg', '/img/hero2.jpg', '/img/pexels-karola-g-4870724.jpg', '/img/pexels-karola-g-4870727.jpg'];
        list.forEach((p) => { const i = new Image(); i.src = next === 'dark' ? p : p; });
      } catch (e) {}
      return next;
    });
    setUserSet(true);
  };

  return (
    <button
      aria-label="Toggle theme"
      title="Toggle light / dark"
      className={`inline-flex items-center justify-center p-2 rounded ${className}`}
      onClick={toggle}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

// Preload both hero images on module load (best-effort, non-blocking)
try {
  if (typeof window !== 'undefined') {
    ['/img/hero.jpg', '/img/hero2.jpg'].forEach((s) => { const p = new Image(); p.src = s; });
  }
} catch (e) {}
