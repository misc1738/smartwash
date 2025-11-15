import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Shield, Droplet, Star } from 'lucide-react';
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
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        <img 
          src="https://images.pexels.com/photos/4870663/pexels-photo-4870663.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Services background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Animated Orbs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl" 
             style={{ animation: 'float 8s ease-in-out infinite' }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 text-primary font-bold uppercase tracking-widest text-xs backdrop-blur-sm mb-6">
            Our Services
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
            <BlurText 
              text="Choose Your"
              delay={40}
              animateBy="words"
              className="block text-white"
            />
            <BlurText 
              text="Perfect Service"
              delay={40}
              animateBy="words"
              className="block bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent"
            />
          </h1>
          <div className="text-xl text-white/70 max-w-2xl mx-auto flex justify-center">
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
                className={`group relative bg-black/40 border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  service.popular 
                    ? 'border-primary/50 shadow-xl shadow-primary/20' 
                    : 'border-white/10 hover:border-primary/30 hover:shadow-primary/10'
                }`}
                style={{
                  animation: `fade-in-up 0.8s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-cyan-500 text-white text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-full ${
                      service.popular 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <Icon className={`w-8 h-8 ${service.popular ? 'text-primary' : 'text-cyan-400'}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-white mb-2">{service.title}</h3>
                    <p className="text-white/60 text-sm mb-6">{service.description}</p>

                    {/* Pricing */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <div className="text-4xl font-black text-primary mb-1">{service.price}</div>
                      <div className="text-white/50 text-sm">{service.duration}</div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleBookNow(service)}
                    className={`group/btn w-full py-4 font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      service.popular
                        ? 'bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-400 text-white shadow-lg shadow-primary/30'
                        : 'bg-white/5 border border-white/10 text-white hover:border-primary/50 hover:bg-primary/10'
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
          <div className="bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/30 backdrop-blur-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-white mb-2">100%</div>
                <div className="text-white/60">Satisfaction Guaranteed</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">24/7</div>
                <div className="text-white/60">Customer Support</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">Free</div>
                <div className="text-white/60">Rescheduling</div>
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
