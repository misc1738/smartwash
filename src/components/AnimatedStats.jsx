import React, { useEffect, useState, useRef } from "react";

const stats = [
  { label: "Serving", value: 15, suffix: "+ Nairobi Areas" },
  { label: "Across", value: 8, suffix: " Neighborhoods" },
  { label: "Operating from", value: 3, suffix: " Locations" },
  { label: "Employing", value: 50, suffix: "+ People" },
];

const StatCard = ({ stat, idx }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = stat.value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, stat.value]);

  return (
    <div
      ref={ref}
      className="group bg-black/40 backdrop-blur-sm border border-white/10 p-10 transition-all duration-500 hover:border-primary/50 hover:bg-primary hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2"
      style={{
        animation: `fade-in-up 0.8s ease-out ${idx * 0.1}s both`
      }}
    >
      <div className="text-center">
        <div className="text-5xl md:text-6xl font-black mb-4 transition-colors duration-500 group-hover:text-white drop-shadow-lg" style={{
          background: 'linear-gradient(135deg, #2C9BEF 0%, #60D5FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {count}{stat.suffix}
        </div>
        <div className="text-sm uppercase tracking-[0.2em] text-white/60 group-hover:text-white/90 font-medium transition-colors duration-500">
          {stat.label}
        </div>
      </div>
    </div>
  );
};

const AnimatedStats = () => (
  <section className="relative py-32 bg-black overflow-hidden">
    {/* Background Image with Dark Overlay */}
    <div className="absolute inset-0 opacity-20">
      <img 
        src="/img/pexels-karola-g-4870724.jpg"
        alt="Stats background"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
    </div>

    {/* Accent Glows */}
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl" />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl"
        >
          Nairobi's<br/>
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Finest Service
          </span>
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          SmartWash leads Kenya's automotive care industry with cutting-edge detailing solutions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={stat.label} stat={stat} idx={idx} />
        ))}
      </div>
    </div>
  </section>
);

export default AnimatedStats;