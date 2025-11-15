import { useEffect, useRef } from 'react';
import { animate, stagger, splitText } from 'animejs';

/**
 * Advanced AnimatedHeading Component
 * Demonstrates the full power of animejs v4 with splitText and complex keyframes
 */
const AnimatedHeading = ({ 
  text = 'Welcome to SmartWash',
  className = '',
  splitBy = 'chars', // 'chars', 'words', or 'lines'
  animationType = 'bounce',
  autoplay = true
}) => {
  const headingRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!headingRef.current || !autoplay) return;

    // Split text into animatable characters
    const { chars } = splitText(headingRef.current, { 
      words: splitBy === 'words', 
      chars: splitBy === 'chars',
      lines: splitBy === 'lines'
    });

    // Different animation presets
    const animations = {
      bounce: {
        y: [
          { to: '-2.75rem', ease: 'outExpo', duration: 600 },
          { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
        ],
        rotate: {
          from: '-1turn',
          delay: 0
        },
        delay: stagger(50),
        ease: 'inOutCirc',
        loopDelay: 1000,
        loop: true
      },
      
      wave: {
        y: [
          { to: -20, ease: 'outSine', duration: 400 },
          { to: 0, ease: 'inSine', duration: 400 }
        ],
        delay: stagger(40),
        loop: true,
        loopDelay: 800
      },
      
      elastic: {
        scale: [
          { to: 1.5, ease: 'outElastic(1, 0.6)', duration: 1000 },
          { to: 1, ease: 'inOutQuad', duration: 400 }
        ],
        opacity: [
          { to: 1, from: 0, ease: 'outQuad', duration: 400 }
        ],
        delay: stagger(60),
        loop: true,
        loopDelay: 2000
      },
      
      rainbow: {
        color: [
          { to: '#ff6b6b', ease: 'linear', duration: 500 },
          { to: '#4ecdc4', ease: 'linear', duration: 500 },
          { to: '#45b7d1', ease: 'linear', duration: 500 },
          { to: '#96ceb4', ease: 'linear', duration: 500 },
          { to: '#ffeaa7', ease: 'linear', duration: 500 },
          { to: '#fd79a8', ease: 'linear', duration: 500 }
        ],
        delay: stagger(100),
        loop: true,
        loopDelay: 500
      },
      
      glitch: {
        x: [
          { to: -5, ease: 'steps(1)', duration: 50 },
          { to: 5, ease: 'steps(1)', duration: 50 },
          { to: -3, ease: 'steps(1)', duration: 50 },
          { to: 3, ease: 'steps(1)', duration: 50 },
          { to: 0, ease: 'steps(1)', duration: 50 }
        ],
        opacity: [
          { to: 0.8, ease: 'steps(1)', duration: 50 },
          { to: 1, ease: 'steps(1)', duration: 50 }
        ],
        delay: stagger(30),
        loop: true,
        loopDelay: 2000
      }
    };

    // Animate the split text
    const config = animations[animationType] || animations.bounce;
    animationRef.current = animate(chars, config);

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [text, splitBy, animationType, autoplay]);

  return (
    <h2 
      ref={headingRef} 
      className={`animated-heading ${className}`}
      style={{ 
        display: 'inline-block',
        whiteSpace: splitBy === 'lines' ? 'normal' : 'nowrap'
      }}
    >
      {text}
    </h2>
  );
};

export default AnimatedHeading;
