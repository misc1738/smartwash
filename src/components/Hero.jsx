import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoveRight, PhoneCall, Star, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Theme-aware hero image: switches between /img/hero.jpg (dark) and /img/hero2.jpg (light)
 * Smooth crossfade and preloads the incoming image.
 */
function ThemeHeroImage() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    } catch (e) {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
  });

  const pickSrc = (t) => (t === 'light' ? '/img/hero2.png' : '/img/hero.png');

  const [currentSrc, setCurrentSrc] = useState(() => pickSrc(theme));
  const [prevSrc, setPrevSrc] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      const t = e?.detail || (localStorage.getItem('theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
      if (!t) return;
      if (t === theme) return;
      const next = pickSrc(t);
      // preload
      const img = new Image();
      img.src = next;
      img.onload = () => {
        setPrevSrc(currentSrc);
        setCurrentSrc(next);
        setTransitioning(true);
        setTimeout(() => {
          setPrevSrc(null);
          setTransitioning(false);
        }, 500); // match CSS transition duration
      };
      setTheme(t);
    };

    window.addEventListener('theme-change', handler);
    return () => window.removeEventListener('theme-change', handler);
  }, [theme, currentSrc]);

  // Ensure initial preload of currentSrc
  useEffect(() => {
    const img = new Image(); img.src = currentSrc;
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      {prevSrc && (
        <img src={prevSrc} alt="hero previous" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`} aria-hidden />
      )}
      {currentSrc && (
        <img src={currentSrc} alt="Hero" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${transitioning ? 'opacity-100' : 'opacity-100'}`} />
      )}
    </div>
  );
}

const Hero = () => {
  const navigate = useNavigate();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Excellence", "Luxury", "Perfection", "Prestige"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 4000); // Slowed down from 2000ms to 4000ms
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-0 bg-background transition-colors duration-500">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <ThemeHeroImage />

        {/* Subtle Overlay to Reduce Image Strength - Makes Text Stand Out */}
        <div className="absolute inset-0 bg-background/15"></div>

        {/* Subtle Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/15 via-transparent to-background/40"></div>

        {/* Minimal Side Gradients for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/25 via-transparent to-background/25"></div>
      </div>

      {/* Subtle Animated Orbs - Moved Outside Image Container */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-10">
        <motion.div
          className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-primary-light/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Rotating Gradient Overlay - Adaptive */}
      <motion.div
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay z-[1]"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary)/0.3), transparent, hsl(var(--primary-light)/0.3), transparent)',
        }}
      />

      {/* Floating Gold Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0, 0.8, 0],
              scale: [Math.random() * 0.5 + 0.5, Math.random() * 1.2 + 0.5, Math.random() * 0.5 + 0.5]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex gap-6 sm:gap-8 py-16 sm:py-20 lg:py-40 items-center justify-center flex-col">

          {/* Main Title */}
          <div className="flex gap-4 flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-4"
            >
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-xs uppercase tracking-[0.2em] text-primary-light font-medium">Premium Auto Care</span>
              <Star className="w-3 h-3 text-primary fill-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold text-foreground leading-none tracking-tighter text-center max-w-6xl"
            >
              <span className="block mb-4">Nairobi's Premier</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center min-h-[1.2em]">
                {titles.map((title, index) => {
                  const isActive = titleNumber === index;
                  const isPast = titleNumber > index;

                  return (
                    <motion.span
                      key={index}
                      className="absolute text-gold-foil whitespace-nowrap"
                      initial={{
                        opacity: 0,
                        y: 80,
                        filter: "blur(30px)",
                        scale: 0.6,
                        rotateX: 90,
                        letterSpacing: "0.2em"
                      }}
                      animate={{
                        y: isActive ? 0 : (isPast ? -80 : 80),
                        opacity: isActive ? 1 : 0,
                        filter: isActive ? "blur(0px) drop-shadow(0 0 30px hsl(var(--primary) / 0.5))" : "blur(30px)",
                        scale: isActive ? 1 : 0.6,
                        rotateX: isActive ? 0 : (isPast ? -90 : 90),
                        letterSpacing: isActive ? "normal" : "0.2em"
                      }}
                      transition={{
                        duration: isActive ? 1.2 : 0.8,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      {title}
                    </motion.span>
                  );
                })}
              </span>
            </motion.h1>



            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide max-w-2xl text-center flex justify-center mt-6 px-4 text-foreground/80 font-light"
            >
              <p>
                Experience the pinnacle of automotive detailing. <br className="hidden sm:block" />
                Where precision meets passion.
              </p>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 mt-8"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="gap-4 relative overflow-hidden group bg-primary hover:bg-primary-light text-primary-foreground border-none px-8 py-6 text-lg shadow-lg hover:shadow-primary/50"
                onClick={() => navigate('/bookings')}
              >
                <span className="relative z-10 font-bold tracking-wide">Book Appointment</span>
                <MoveRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="gap-4 border-foreground/20 text-foreground hover:bg-foreground/5 hover:border-primary/50 px-8 py-6 text-lg backdrop-blur-sm"
                onClick={() => window.location.href = 'tel:+254700000000'}
              >
                <span className="font-medium tracking-wide">Contact Concierge</span>
                <PhoneCall className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-16 w-full px-4 border-t border-foreground/5 pt-8"
          >
            {[
              { text: 'Certified Craftsmen', icon: ShieldCheck },
              { text: 'Premium Products', icon: Sparkles },
              { text: 'Satisfaction Guaranteed', icon: Star }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-foreground/70">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm uppercase tracking-widest font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        onClick={scrollToServices}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 group cursor-pointer flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-medium">Discover</span>
        <motion.div
          className="w-[1px] h-16 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0"
          animate={{ height: [40, 80, 40], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.button>
    </section >
  );
};

export default Hero;