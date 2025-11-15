import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import BlurText from './ui/BlurText';
import TextType from './ui/TextType';

const ImageHeroSection = ({ 
  image, 
  title, 
  subtitle, 
  description, 
  features = [],
  align = "center",
  overlayOpacity = "0.7",
  useTypingEffect = false,
  typingTexts = []
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Multi-layered Gradients */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.95) 100%)'
        }} />
      </div>

      {/* Animated Glow Orbs */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-primary/40 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
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
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Rotating Gradient Overlay */}
      <motion.div
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay z-[1]"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(44, 155, 239, 0.3), transparent, rgba(96, 213, 255, 0.3), transparent)',
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`max-w-5xl ${align === 'center' ? 'mx-auto text-center' : align === 'left' ? 'mr-auto text-left' : 'ml-auto text-right'}`}
        >
          {/* Subtitle with sparkles */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`inline-flex items-center gap-2 mb-6 ${align === 'center' ? 'justify-center' : ''}`}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.25em] text-white/70 font-medium drop-shadow-lg">
                {subtitle}
              </span>
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
          )}

          {/* Main Title with BlurText Animation or Typing Effect */}
          {useTypingEffect ? (
            <div 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter mb-6"
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)'
              }}
            >
              {title.split('\n').map((line, index) => (
                <div key={index} className="mb-2">
                  {index === 1 && typingTexts.length > 0 ? (
                    <TextType
                      text={typingTexts}
                      as="span"
                      typingSpeed={80}
                      deletingSpeed={40}
                      pauseDuration={1500}
                      loop={true}
                      showCursor={true}
                      cursorCharacter="|"
                      cursorClassName="text-primary text-5xl"
                      startOnVisible={true}
                      textColors={['#2C9BEF', '#60D5FF', '#2C9BEF']}
                      className="font-black bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent"
                    />
                  ) : (
                    <span className="text-white drop-shadow-2xl">{line}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <BlurText
              text={title}
              delay={50}
              animateBy="words"
              direction="top"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter mb-6"
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)'
              }}
            />
          )}

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed mb-8"
              style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)'
              }}
            >
              {description}
            </motion.p>
          )}

          {/* Features List */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`flex flex-wrap gap-6 mt-8 ${align === 'center' ? 'justify-center' : align === 'left' ? 'justify-start' : 'justify-end'}`}
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/15 hover:border-primary/50 transition-all duration-300"
                >
                  <Check className="w-5 h-5 text-primary drop-shadow-lg" />
                  <span className="text-white font-medium drop-shadow-lg">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-[1]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                           linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
      </div>
    </section>
  );
};

export default ImageHeroSection;
