// src/components/HowItWorks.jsx
import { Calendar, MapPin, Sparkles, CreditCard } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

export default function HowItWorks() {
  const navigate = useNavigate();

  const goBook = () => navigate('/bookings');
  const steps = [
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Book Online",
      description: "Select your service, date, and location.",
    },
    {
      icon: <MapPin className="h-10 w-10" />,
      title: "We Come to You",
      description: "Our team arrives fully equipped.",
    },
    {
      icon: <Sparkles className="h-10 w-10" />,
      title: "Expert Service",
      description: "Relax while we clean your car.",
    },
    {
      icon: <CreditCard className="h-10 w-10" />,
      title: "Pay Securely",
      description: "Pay via M-Pesa, card, or cash.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16">
          Get your car professionally cleaned in four simple steps.
        </p>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="mx-auto mb-4 flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {step.icon}
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-bold mb-2">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button type="button" onClick={goBook} variant="primary">Book Now</Button>
        </div>
      </div>
    </section>
  );
}
