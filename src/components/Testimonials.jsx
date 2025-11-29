import { Star, Quote, BadgeCheck } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import GlowingEffect from './ui/GlowingEffect';

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

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let scrollAmount = 0;
    const speed = 0.5;

    const step = () => {
      if (!isPaused) {
        scrollAmount += speed;
        if (scrollAmount >= el.scrollWidth / 2) {
          scrollAmount = 0;
        }
        el.scrollLeft = scrollAmount;
      }
      requestAnimationFrame(step);
    };

    const anim = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim);
  }, [isPaused]);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 mb-16 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Wall of Love</span>
          <Star className="w-3 h-3 text-primary fill-primary" />
        </div>
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
          Trusted by Nairobi's <br />
          <span className="text-primary">Finest Drivers</span>
        </h2>
      </div>

      {/* Scrolling Container */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden py-8 px-4"
          style={{ width: 'max-content' }}
        >
          {/* Double the list for infinite scroll effect */}
          {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="w-[400px] flex-shrink-0 group relative"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={80} borderWidth={2} />

                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-primary fill-primary' : 'text-gray-300'}`} />
                  ))}
                </div>

                <p className="text-foreground/80 text-lg leading-relaxed mb-8 font-light italic">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                    {t.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                        <BadgeCheck className="w-4 h-4 text-primary fill-primary/10" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-foreground text-lg">{t.name}</div>
                    <div className="text-xs uppercase tracking-wider text-primary/80 font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}