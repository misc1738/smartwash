import { Star, Quote, BadgeCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';
import GlowingEffect from './ui/GlowingEffect';

// Utility to wrap a number between a min and max range
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    role: "Mercedes-Benz Owner",
    text: "The attention to detail is unmatched. My C-Class looks better than the day I bought it. The ceramic coating is a game changer for Nairobi weather.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    verified: true
  },
  {
    id: 2,
    name: "David M.",
    role: "Range Rover Sport",
    text: "Convenience without compromise. Having them come to my office in Westlands saved me so much time. Professional, punctual, and perfect results.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    verified: true
  },
  {
    id: 3,
    name: "Michelle W.",
    role: "Porsche Cayenne",
    text: "I was hesitant about mobile detailing for my Porsche, but SmartWash exceeded all expectations. The team is incredibly knowledgeable and careful.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    verified: true
  },
  {
    id: 4,
    name: "James O.",
    role: "BMW X5",
    text: "The interior detailing brought my leather seats back to life. It smells brand new again. Highly recommend their premium package.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    verified: true
  }
];

function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(scrollY, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(scrollVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div className="flex flex-nowrap gap-8" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div style={{ y }} className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 mb-20 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
        >
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Wall of Love</span>
          <Star className="w-3 h-3 text-primary fill-primary" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6"
        >
          Trusted by Nairobi's <br />
          <span className="text-primary">Finest Drivers</span>
        </motion.h2>
      </div>

      {/* Scrolling Container with Parallax Velocity */}
      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <ParallaxText baseVelocity={-2}>
          {testimonials.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="w-[450px] flex-shrink-0 group relative mx-4"
            >
              <div className="h-full p-10 rounded-3xl bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={80} borderWidth={2} />

                <Quote className="absolute top-8 right-8 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" />

                <div className="flex items-center gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'text-primary fill-primary' : 'text-gray-300'}`} />
                  ))}
                </div>

                <p className="text-foreground/80 text-xl leading-relaxed mb-10 font-serif italic">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-5 mt-auto">
                  <div className="relative">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
                    />
                    {t.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                        <BadgeCheck className="w-5 h-5 text-primary fill-primary/10" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-foreground text-xl">{t.name}</div>
                    <div className="text-xs uppercase tracking-wider text-primary/80 font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ParallaxText>
      </div>
    </section>
  );
}