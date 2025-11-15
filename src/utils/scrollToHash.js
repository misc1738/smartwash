export default function navigateToHash(hash, navigate) {
  if (!hash) return;

  const tryScroll = () => {
    try {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Accessibility: focus the element or its first heading
        const heading = el.querySelector('h1, h2, h3');
        const target = heading || el;
        try {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        } catch (e) {
          // ignore
        }
        return true;
      }
    } catch (e) {
      // malformed selector or other DOM errors
      return false;
    }
    return false;
  };

  // If not on root, navigate then poll until the element exists or timeout
  if (window.location.pathname !== '/') {
    navigate('/');
    const start = performance.now();
    const tick = () => {
      if (!tryScroll() && performance.now() - start < 1500) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  } else {
    tryScroll();
  }
}
