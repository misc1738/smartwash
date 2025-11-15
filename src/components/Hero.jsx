import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoveRight, PhoneCall, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
// Removed AnimatedText for hero tagline; using shiny-text effect instead

const Hero = () => {
  const navigate = useNavigate();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["premium", "convenient", "eco-friendly", "professional", "smart"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-0 bg-black">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/img/hero.jpg"
          alt="Premium car detailing"
          className="w-full h-full object-cover"
        />
        {/* Mesmerizing Multi-layered Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        {/* Cinematic Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.95) 100%)'
        }}></div>
        {/* Animated Glow Overlay */}
        <div className="absolute inset-0 opacity-30">
          <motion.div 
            className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-primary/40 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-cyan-400/30 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>

      {/* Rotating Gradient Overlay for Mesmerizing Effect */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay z-[1]"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(44, 155, 239, 0.4), transparent, rgba(96, 213, 255, 0.4), transparent)',
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [0, 1, 0],
              scale: [Math.random() * 0.5 + 0.5, Math.random() * 1.5 + 0.5, Math.random() * 0.5 + 0.5]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex gap-6 sm:gap-8 py-16 sm:py-20 lg:py-40 items-center justify-center flex-col">
          
          {/* Premium Badge with shimmer effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(44, 155, 239, 0.3)",
                  "0 0 40px rgba(44, 155, 239, 0.6)",
                  "0 0 20px rgba(44, 155, 239, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Button variant="secondary" size="sm" className="gap-4 relative overflow-hidden group">
                <span className="relative z-10">Book Your First Wash Free</span>
                <MoveRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 2,
                  }}
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Main Title with Animated Words */}
          <div className="flex gap-4 flex-col">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl max-w-4xl tracking-tight text-center font-black leading-tight px-4"
              style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif" }}
            >
              <motion.span 
                className="text-white/90 drop-shadow-2xl block"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255, 255, 255, 0.1)",
                    "0 0 40px rgba(255, 255, 255, 0.2)",
                    "0 0 20px rgba(255, 255, 255, 0.1)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Experience
              </motion.span>
              <span className="relative flex w-full justify-center overflow-visible text-center min-h-[1.3em] my-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent whitespace-nowrap px-2"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                    style={{
                      filter: titleNumber === index ? "drop-shadow(0 0 30px rgba(44, 155, 239, 0.8))" : "none",
                    }}
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <motion.span 
                className="text-white/90 drop-shadow-2xl block"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255, 255, 255, 0.1)",
                    "0 0 40px rgba(255, 255, 255, 0.2)",
                    "0 0 20px rgba(255, 255, 255, 0.1)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                car detailing
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide max-w-2xl text-center flex justify-center mt-4 sm:mt-6 px-4"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              <p className="shiny-text-original">
                Detailing, Delivered.
              </p>
            </motion.div>
          </div>

          {/* CTA Buttons with enhanced effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="gap-4 shadow-2xl shadow-primary/50" 
                variant="outline"
                onClick={() => window.location.href = 'tel:+254700000000'}
              >
                Call Us Now <PhoneCall className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 10px 40px rgba(44, 155, 239, 0.4)",
                  "0 10px 60px rgba(44, 155, 239, 0.6)",
                  "0 10px 40px rgba(44, 155, 239, 0.4)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Button 
                size="lg" 
                className="gap-4 relative overflow-hidden group"
                onClick={() => navigate('/bookings')}
              >
                <span className="relative z-10">Book Online</span>
                <MoveRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-primary"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ opacity: 0.3 }}
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators with pulsing effects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-white/80 mt-6 sm:mt-8 w-full px-4"
          >
            {[
              { color: 'green-400', text: 'Eco-Friendly Products', delay: 0, icon: '🌿' },
              { color: 'primary', text: 'Professional Team', delay: 0.3, icon: '⭐' },
              { color: 'orange-400', text: '100% Satisfaction', delay: 0.6, icon: '✨' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-full sm:w-auto justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <motion.div 
                  className={`w-2.5 h-2.5 bg-${item.color} rounded-full shadow-lg shadow-${item.color}/50`}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  delay: item.delay
                }}
                />
                <span className="text-base sm:text-xl">{item.icon}</span>
                <span className="uppercase tracking-wider font-medium drop-shadow-lg text-xs sm:text-sm">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        onClick={scrollToServices}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 group cursor-pointer flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-medium drop-shadow-lg">Scroll</span>
        <motion.div 
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2 group-hover:border-primary transition-colors backdrop-blur-sm bg-black/20"
          animate={{
            boxShadow: [
              "0 0 0px rgba(44, 155, 239, 0.3)",
              "0 0 20px rgba(44, 155, 239, 0.6)",
              "0 0 0px rgba(44, 155, 239, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="w-1 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <ChevronDown className="w-4 h-4 text-white/50 animate-bounce drop-shadow-lg" style={{ animationDelay: '0.2s' }} />
      </motion.button>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-[1]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                           linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* Animated Scanline Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(44, 155, 239, 0.1) 50%, transparent 100%)',
          height: '200px',
        }}
        animate={{
          y: ['-200px', 'calc(100vh + 200px)'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </section>
  );
};

export default Hero;