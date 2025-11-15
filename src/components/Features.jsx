import featureBooking from "../assets/feature-booking.png";
import featureQuality from "../assets/feature-quality.png";
import featurePayment from "../assets/feature-payment.png";
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';


export default function Features() {
  const navigate = useNavigate();

  const goBook = () => navigate('/bookings');
  const features = [
    {
      icon: featureBooking,
      title: "Easy Online Booking",
      description:
        "Book your car wash service anytime, anywhere through our simple platform.",
    },
    {
      icon: featureQuality,
      title: "Professional Service",
      description:
        "Trained and certified professionals using premium eco-friendly products.",
    },
    {
      icon: featurePayment,
      title: "Secure Mobile Payments",
      description:
        "Pay conveniently via M-Pesa, card, or cash. Safe and secure transactions.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-blue-500 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Service Anywhere",
      description:
        "We come to your home, office, or any location in Nairobi, Mombasa, and Kisumu.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-blue-500 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Flexible Scheduling",
      description:
        "Choose your preferred time slot. We work around your busy schedule.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-blue-500 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Quality Guarantee",
      description:
        "100% satisfaction guaranteed. Not happy? We'll make it right, for free.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose SmartWash?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Experience the convenience of professional car care delivered to
            your doorstep
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="mb-4 flex justify-center">
                {typeof feature.icon === "string" ? (
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-16 h-16 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  feature.icon
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button type="button" onClick={goBook} variant="primary" size="md">Book Now</Button>
        </div>
        
      </div>
    </section>
  );
}

