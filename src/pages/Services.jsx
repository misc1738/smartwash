import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Shield, Droplet, Star, Play } from 'lucide-react';
import BlurText from '../components/ui/BlurText';
import AnimatedText from '../components/ui/AnimatedText';
import BookingDrawer from '../components/BookingDrawer';

const services = [
  {
    key: 'express',
    title: 'Express Wash',
    price: 'KSh 1,500',
    duration: '30 minutes',
    description: 'Quick and efficient wash for busy schedules',
    icon: Sparkles,
    features: [
      'Exterior hand wash',
      'Wheel cleaning',
      'Window cleaning',
      'Tire shine',
      'Quick dry',
    ],
    popular: false,
    video: '/videos/express.mp4' // Placeholder
  },
  {
    key: 'premium',
    title: 'Premium Detail',
    price: 'KSh 3,500',
    duration: '1.5 hours',
    description: 'Comprehensive detailing for the discerning owner',
    icon: Star,
    features: [
      'Everything in Express',
      'Clay bar treatment',
      'Paint sealant application',
      'Interior vacuum & wipe',
      'Dashboard conditioning',
      'Air freshener',
    ],
    popular: true,
    video: '/videos/premium.mp4' // Placeholder
  },
  {
    key: 'ultimate',
    title: 'Ultimate Protection',
    price: 'KSh 6,000',
    duration: '3 hours',
    description: 'Complete transformation with ceramic coating',
    icon: Shield,
    features: [
      'Everything in Premium',
      'Ceramic coating application',
      'Paint correction',
      'Deep interior detailing',
      'Leather conditioning',
      'Engine bay cleaning',
      'Headlight restoration',
    ],
    popular: false,
    video: '/videos/ultimate.mp4' // Placeholder
  },
  {
    key: 'interior',
    title: 'Interior Deep Clean',
    price: 'KSh 2,500',
    duration: '1 hour',
    description: 'Thorough interior refresh and sanitization',
    icon: Droplet,
    features: [
      'Deep vacuum all surfaces',
      'Seat shampooing',
      'Carpet extraction',
      'Dashboard & console detail',
      'Door panel cleaning',
      'Odor elimination',
    ],
    popular: false,
    video: '/videos/interior.mp4' // Placeholder
  },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleBookNow = (service) => {
    setSelectedService(service);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen relative bg-background transition-colors duration-500 pt-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary-light/10 rounded-full blur-[100px]"
          style={{ animation: 'float 8s ease-in-out infinite' }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-widest text-xs backdrop-blur-sm mb-6 rounded-full">
            Our Services
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6">
            <BlurText
              text="Choose Your"
              delay={40}
              animateBy="words"
              className="block text-foreground"
            />
            <BlurText
              text="Perfect Service"
              delay={40}
              animateBy="words"
              className="block bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent"
            />
          </h1>
          <div className="text-xl text-foreground/70 max-w-2xl mx-auto flex justify-center font-light">
            <AnimatedText
              text="Professional mobile detailing tailored to your vehicle's needs"
              animationType="wave"
              delay={400}
              staggerDelay={50}
              loopDelay={1000}
              letterSpacing="0.01em"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.key}
                className={`group relative glass-luxury rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${service.popular
                    ? 'border-primary/50 shadow-lg shadow-primary/10'
                    : 'hover:border-primary/30'
                  }`}
                style={{
                  animation: `fade-in-up 0.8s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Video Preview Overlay (Placeholder) */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0" />

                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-primary-light text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-b-lg z-20 shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-8 flex flex-col h-full relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-full transition-colors duration-300 ${service.popular
                        ? 'bg-primary/20 border border-primary/30'
                        : 'bg-foreground/5 border border-foreground/10 group-hover:bg-primary/10 group-hover:border-primary/20'
                      }`}>
                      <Icon className={`w-8 h-8 ${service.popular ? 'text-primary' : 'text-foreground/70 group-hover:text-primary'}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{service.title}</h3>
                    <p className="text-foreground/60 text-sm mb-6">{service.description}</p>

                    {/* Pricing */}
                    <div className="mb-6 pb-6 border-b border-foreground/10">
                      <div className="text-4xl font-bold text-primary mb-1">{service.price}</div>
                      <div className="text-foreground/50 text-sm">{service.duration}</div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleBookNow(service)}
                    className={`group/btn w-full py-4 font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 rounded-xl ${service.popular
                        ? 'bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-foreground/5 border border-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary'
                      }`}
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="glass-luxury rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-foreground/60">Satisfaction Guaranteed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-foreground/60">Customer Support</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">Free</div>
                <div className="text-foreground/60">Rescheduling</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Drawer */}
      <BookingDrawer
        open={drawerOpen}
        onClose={(booking) => {
          setDrawerOpen(false);
          if (booking) {
            navigate('/booking-confirmation', { state: { booking } });
          }
        }}
        initial={selectedService}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
