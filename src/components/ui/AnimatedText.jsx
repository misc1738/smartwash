import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';

const AnimatedText = ({
  text = '',
  className = '',
  delay = 50,
  duration = 1000,
  animationType = 'fadeUp',
  staggerDelay = 50,
  easing = 'outExpo',
  startOnVisible = true,
  threshold = 0.1,
  onComplete,
  loop = false,
  loopDelay = 0,
  letterSpacing = '0.05em'
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const animationRef = useRef(null);

  // Animation presets using animejs v4 keyframe syntax
  const getAnimationConfig = () => {
    switch (animationType) {
      case 'fadeUp':
        return {
          y: [
            { to: 0, from: 40, ease: easing, duration }
          ],
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      case 'fadeDown':
        return {
          y: [
            { to: 0, from: -40, ease: easing, duration }
          ],
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      case 'scale':
        return {
          scale: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      case 'rotate':
        return {
          rotate: [
            { to: 0, from: '180deg', ease: easing, duration }
          ],
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      case 'slideLeft':
        return {
          x: [
            { to: 0, from: 100, ease: easing, duration }
          ],
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      case 'slideRight':
        return {
          x: [
            { to: 0, from: -100, ease: easing, duration }
          ],
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      case 'blur':
        return {
          filter: [
            { to: 'blur(0px)', from: 'blur(10px)', ease: easing, duration }
          ],
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      case 'wave':
        return {
          y: [
            { to: '-2.75rem', ease: 'outExpo', duration: 600 },
            { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
          ],
          rotate: {
            from: '-1turn',
            delay: 0
          },
          delay: stagger(staggerDelay, delay),
          ease: 'inOutCirc',
          loop,
          loopDelay
        };
      
      case 'bounce':
        return {
          y: [
            { to: -30, from: 0, ease: 'outCubic', duration: duration * 0.4 },
            { to: 5, ease: 'linear', duration: duration * 0.2 },
            { to: 0, ease: 'outBounce', duration: duration * 0.4 }
          ],
          opacity: [
            { to: 1, from: 0, ease: 'outCubic', duration: duration * 0.3 }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      case 'flip':
        return {
          rotateY: [
            { to: 0, from: 90, ease: easing, duration }
          ],
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      case 'elastic':
        return {
          y: [
            { to: 0, from: -50, ease: 'outElastic(1, 0.5)', duration }
          ],
          scale: [
            { to: 1, from: 0.5, ease: 'outElastic(1, 0.5)', duration }
          ],
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
      
      default:
        return {
          opacity: [
            { to: 1, from: 0, ease: easing, duration }
          ],
          delay: stagger(staggerDelay, delay),
          loop,
          loopDelay
        };
    }
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible, threshold]);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const letters = containerRef.current.querySelectorAll('.anime-letter');
    if (letters.length === 0) return;

    // Animate letters with proper animejs v4 syntax
    const config = getAnimationConfig();
    animationRef.current = animate(letters, {
      ...config,
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [isVisible, text, animationType, duration, delay, staggerDelay, easing, loop, loopDelay]);

  // Split text into individual letters
  const renderLetters = () => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="anime-letter inline-block"
        style={{
          letterSpacing: char === ' ' ? '0' : letterSpacing,
          whiteSpace: char === ' ' ? 'pre' : 'normal'
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      className={`anime-text-container ${className}`}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        overflow: 'hidden'
      }}
    >
      {renderLetters()}
    </div>
  );
};

export default AnimatedText;
