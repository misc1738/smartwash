import { useEffect, useRef, useState } from 'react';

export default function LazyImage({ src, alt = '', className = '', onError, ...props }) {
  const imgRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: '200px 0px' }
      );
      observer.observe(el);
    } else {
      setInView(true);
    }
    return () => observer && observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={inView ? src : undefined}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} will-change-[opacity]`}
      onLoad={() => setLoaded(true)}
      onError={onError}
      {...props}
    />
  );
}
