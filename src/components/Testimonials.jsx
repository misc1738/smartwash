import { useEffect, useRef, useState } from 'react';
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Owner",
    text: "The attention to detail is incredible! My car looks better than when I first bought it. The team is professional and truly cares about quality.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Car Enthusiast",
    text: "I've tried many car wash services, but SmartWash is by far the best. Their ceramic coating package is worth every penny.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Happy Customer",
    text: "Exceptional service from start to finish. They took their time and didn't rush through the job. My SUV has never looked this clean!",
    rating: 5
  }
];

const Testimonials = () => {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused]);

  // Keyboard controls
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % testimonials.length);
    if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  return (
  <section className="relative py-32 bg-black overflow-hidden content-visibility-auto" onKeyDown={onKeyDown}>
    {/* Background with subtle image */}
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="/img/pexels-tima-miroshnichenko-6872150.jpg"
          alt="Testimonials background"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
      </div>    {/* Accent Glows */}
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl"
          style={{ letterSpacing: '0.05em' }}
        >
          C L I E N T<br/>
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            T E S T I M O N I A L S
          </span>
        </h2>
        <p className="text-xl text-white/60 uppercase tracking-widest text-sm">
          What Our Customers Say
        </p>
      </div>

      {/* Testimonials Carousel (scroll-snap on mobile) */}
      <div 
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region" aria-roledescription="carousel" aria-label="Testimonials" aria-live="polite"
      >
        {testimonials.map((testimonial, idx) => (
          <div 
            key={idx} 
            className="relative bg-black/40 backdrop-blur-sm border border-white/10 p-10 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 group snap-center"
            style={{
              animation: `fade-in-up 0.8s ease-out ${idx * 0.15}s both`
            }}
            tabIndex={0}
            aria-label={`Testimonial ${idx + 1} of ${testimonials.length}`}
            aria-selected={index === idx}
            data-active={index === idx}
          >
            {/* Floating Quote Mark - Top Left */}
            <div 
              className="absolute -top-4 -left-4 text-primary/20 transition-all duration-700 group-hover:text-primary/40 group-hover:scale-110"
              style={{
                animation: `float 3s ease-in-out infinite ${idx * 0.5}s`
              }}
            >
              <Quote className="w-16 h-16 fill-current" />
            </div>

            {/* Floating Quote Mark - Bottom Right */}
            <div 
              className="absolute -bottom-4 -right-4 text-primary/20 transition-all duration-700 group-hover:text-primary/40 group-hover:scale-110 rotate-180"
              style={{
                animation: `float 3s ease-in-out infinite ${idx * 0.5 + 1.5}s`
              }}
            >
              <Quote className="w-16 h-16 fill-current" />
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1 mb-6 relative z-10">
              {Array.from({length: testimonial.rating}).map((_, i) => (
                <Star 
                  key={i} 
                  className="w-5 h-5 fill-primary text-primary drop-shadow-lg transition-all duration-300"
                  style={{
                    animation: `pulse 2s ease-in-out infinite ${i * 0.2}s`
                  }}
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-white/80 mb-8 leading-relaxed text-lg relative z-10">
              "{testimonial.text}"
            </p>

            {/* Author Info */}
            <div className="border-t border-white/20 pt-6">
              <div className="font-black text-white uppercase tracking-wide">
                {testimonial.name}
              </div>
              <div className="text-sm text-white/50 uppercase tracking-widest mt-1">
                {testimonial.role}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4" aria-hidden="false" role="group" aria-label="Carousel Controls">
        <button onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-sm" aria-label="Previous testimonial">Prev</button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to testimonial ${i + 1}`} className={`w-2.5 h-2.5 rounded-full ${index === i ? 'bg-primary' : 'bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
        <button onClick={() => setIndex((i) => (i + 1) % testimonials.length)} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-sm" aria-label="Next testimonial">Next</button>
      </div>

      {/* Bottom Banner */}
      <div className="text-center mt-20">
        <div className="inline-block bg-primary px-10 py-6 shadow-xl shadow-primary/30">
          <p className="text-white font-black text-2xl uppercase tracking-wider drop-shadow-lg">
            Join The Ride
          </p>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Testimonials;