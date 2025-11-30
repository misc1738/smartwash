import { Check, ArrowRight, Sparkles, Play } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, createRef } from 'react';
import BookingWizard from './BookingWizard';
import ThemeImage from './ThemeImage';
import GlowingEffect from './ui/GlowingEffect';
import MagneticButton from './ui/MagneticButton';

const services = [
  {
    key: 'exterior-wash',
    title: "Exterior Wash",
    subtitle: "Essential Clean",
    price: "1,500",
    duration: "45 mins",
    description: "Hand wash and dry for a spotless exterior finish",
    image: "/img/pexels-kopriva.jpg",
    srcLight: "/img/pexels-karola-g-4870724.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80",
    video: "https://cdn.coverr.co/videos/coverr-car-wash-soap-5336/1080p.mp4",
    popular: false,
    features: [
      'Hand Wash & Dry',
      'Wheel Cleaning',
      'Tire Shine',
      'Window Cleaning'
    ],
  },
  {
    key: 'interior-detail',
    title: "Interior Detail",
    subtitle: "Deep Clean",
    price: "2,500",
    duration: "1.5 hours",
    description: "Complete interior cleaning and sanitization",
    image: "/img/pexels-mcraftpix-21011.jpg",
    srcLight: "/img/pexels-sarmad-mughal-94606-305070.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
    video: "https://cdn.coverr.co/videos/coverr-cleaning-car-interior-5339/1080p.mp4",
    popular: false,
    features: [
      'Vacuum All Surfaces',
      'Dashboard Clean',
      'Leather Conditioning',
      'Air Freshener'
    ],
  },
  {
    key: 'premium-package',
    title: "Premium Package",
    subtitle: "Most Popular",
    price: "4,500",
    duration: "2.5 hours",
    description: "Complete exterior and interior detailing with wax",
    image: "/img/pexels-sarmad-mughal-94606-305070.jpg",
    srcLight: "/img/pexels-mcraftpix-21011.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    video: "https://cdn.coverr.co/videos/coverr-polishing-a-car-5337/1080p.mp4",
    popular: true,
    features: [
      'Exterior + Interior Detail',
      'Premium Wax & Polish',
      'Engine Bay Clean',
      'Headlight Restoration'
    ],
  },
  {
    key: 'ultimate-detail',
    title: "Ultimate Detail",
    subtitle: "Luxury Treatment",
    price: "7,500",
    duration: "4 hours",
    description: "The ultimate car care experience with ceramic coating",
    image: "/img/pexels-karola-g-4870700.jpg",
    srcLight: "/img/pexels-karola-g-4870727.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
    video: "https://cdn.coverr.co/videos/coverr-washing-a-black-car-5338/1080p.mp4",
    popular: false,
    features: [
      'All Premium Services',
      'Ceramic Coating',
      'Paint Correction',
      '90-Day Guarantee'
    ],
  }
];

export default function Services() {
  const navigate = useNavigate();
  const [openWizard, setOpenWizard] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardRefs, setCardRefs] = useState([]);
  const sectionRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    setCardRefs((refs) => Array(services.length).fill(null).map((_, i) => refs[i] || createRef()));
    videoRefs.current = videoRefs.current.slice(0, services.length);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e, index) => {
    if (!cardRefs[index]?.current) return;
    const rect = cardRefs[index].current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    // Play video on hover
    if (videoRefs.current[index]) {
      videoRefs.current[index].currentTime = 0;
      videoRefs.current[index].play().catch(e => console.log("Video play failed", e));
    }
  };

  const handleMouseLeaveCard = (index) => {
    setHoveredIndex(null);
    handleMouseLeave();
    // Pause video
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
    }
  };

  const handleSelect = (serviceKey) => {
    const svc = services.find((s) => s.key === serviceKey);
    setSelected(svc);
    setOpenWizard(true);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-32 bg-background overflow-hidden transition-colors duration-500"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8 backdrop-blur-sm"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm uppercase tracking-[0.2em] text-primary font-bold">
              Premium Services
            </span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>

          {/* Main Title */}
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-6 leading-none tracking-tighter"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
            }}
          >
            <span className="block">Luxury Detailing</span>
            <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent drop-shadow-lg">
              Packages
            </span>
          </h2>

          {/* Description */}
          <p
            className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed font-light mb-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
            }}
          >
            Choose from our curated selection of professional detailing packages,
            each designed to deliver exceptional results
          </p>

          {/* Pricing Note */}
          <p
            className="text-sm text-foreground/50 font-medium"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
            }}
          >
            All prices in KES • Mobile service available across Nairobi
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {services.map((service, index) => (
            <div
              key={service.key}
              ref={(el) => {
                if (cardRefs[index]) cardRefs[index].current = el;
              }}
              className="group relative overflow-hidden cursor-pointer perspective-1000 rounded-2xl card-metallic-gold card-3d shimmer holographic-border"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeaveCard(index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: hoveredIndex === index
                  ? `translateY(0) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale(1.02)`
                  : isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: hoveredIndex === index
                  ? 'transform 0.1s ease-out, opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  : `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.1}s`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Glowing Border Effect */}
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={80}
                borderWidth={2}
                movementDuration={1.5}
              />

              {/* Image/Video Container */}
              <div className="relative h-96 overflow-hidden will-change-transform bg-black">
                {/* Background Video */}
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={service.video}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700"
                  style={{ opacity: hoveredIndex === index ? 0.6 : 0 }}
                  muted
                  loop
                  playsInline
                />

                {/* Static Image (Visible when video not playing) */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${hoveredIndex === index ? 'opacity-0' : 'opacity-100'}`}>
                  <ThemeImage
                    base={service.image}
                    srcLight={service.srcLight}
                    alt={`${service.title} - SmartWash Nairobi`}
                    className="w-full h-full"
                    imgStyle={{
                      transform: 'scale(1.04)',
                      filter: 'brightness(0.75)',
                    }}
                    fallback={service.fallbackImage}
                  />
                </div>

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500"
                  style={{
                    opacity: hoveredIndex === index ? 0.8 : 0.6
                  }}
                />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500"
                  style={{
                    transform: hoveredIndex === index ? 'translateY(-10px)' : 'translateY(0)'
                  }}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute -top-3 right-6 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/50">
                      Most Popular
                    </div>
                  )}

                  <div className="text-xs uppercase tracking-[0.25em] mb-2 text-primary/90 transition-all duration-300">
                    {service.subtitle}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-wide mb-2 drop-shadow-lg">
                    {service.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-white/60 font-medium">KES</span>
                    <span className="text-4xl font-black text-white drop-shadow-lg">{service.price}</span>
                  </div>
                  {service.duration && (
                    <div className="text-xs text-white/50 mt-1">
                      {service.duration}
                    </div>
                  )}
                </div>

                {/* Hover Border Animation */}
                <div
                  className="absolute inset-0 border-2 border-primary/80 transition-all duration-500 shadow-lg shadow-primary/30"
                  style={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    transform: hoveredIndex === index ? 'scale(1)' : 'scale(0.95)'
                  }}
                />
              </div>

              {/* Content Overlay - Slides up on hover */}
              <div
                className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col justify-between p-8 transition-all duration-500 ease-out border border-primary/20"
                style={{
                  transform: hoveredIndex === index ? 'translateY(0)' : 'translateY(100%)',
                  opacity: hoveredIndex === index ? 1 : 0
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-primary" />
                    <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold">
                      {service.subtitle}
                    </div>
                    <div className="h-px flex-1 bg-primary" />
                  </div>

                  <h3 className="text-2xl font-black uppercase tracking-wide mb-4 text-foreground">
                    {service.title}
                  </h3>

                  <p className="text-foreground/70 mb-6 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm text-foreground/80"
                        style={{
                          opacity: hoveredIndex === index ? 1 : 0,
                          transform: hoveredIndex === index ? 'translateX(0)' : 'translateX(-10px)',
                          transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.05}s`
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 shadow-lg shadow-primary/50" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and CTA */}
                <div>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-black text-primary drop-shadow-lg">{service.price}</span>
                    <span className="text-sm text-foreground/50">/service</span>
                  </div>

                  <MagneticButton>
                    <button
                      onClick={() => handleSelect(service.key)}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 transition-all duration-300 flex items-center justify-between group/btn uppercase tracking-[0.15em] text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 rounded-lg"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s'
          }}
        >
          <div className="inline-flex flex-col items-center gap-6">
            <p className="text-foreground/50 text-sm uppercase tracking-[0.3em]">
              Discover What's Inside
            </p>
            <button
              onClick={() => navigate('/bookings')}
              data-magnetic
              className="group px-12 py-5 bg-transparent border-2 border-foreground hover:bg-foreground text-foreground hover:text-background font-bold transition-all duration-500 uppercase tracking-[0.2em] text-sm hover:scale-105 hover:shadow-xl hover:shadow-foreground/20 rounded-full"
            >
              Browse All Services
            </button>
          </div>
        </div>

        {openWizard && (
          <BookingWizard
            onClose={() => setOpenWizard(false)}
            initialService={selected}
          />
        )}
      </div>
    </section>
  );
}

