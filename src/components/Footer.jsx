import { Sparkles, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import navigateToHash from '../utils/scrollToHash';
import AnimatedBrandButton from './ui/AnimatedBrandButton';

export default function Footer() {
  const navigate = useNavigate();

  const to = (hash) => navigateToHash(hash, navigate);

  return (
    <footer id="contact" className="relative mt-auto bg-black text-white overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img 
          src="/img/pexels-karola-g-4870727.jpg"
          alt="Footer background"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/80"></div>
      </div>

      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-lg shadow-primary/50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div>
            <div className="mb-6">
              <AnimatedBrandButton text="SMARTWASH" onClick={() => navigate('/')} />
            </div>
            <p className="text-white/60 leading-relaxed mb-6">
              Kenya's premier mobile car wash and detailing service. Professional care, delivered to your doorstep.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Linkedin, href: '#' }
              ].map(({ Icon, href }, idx) => (
                <a 
                  key={idx}
                  href={href}
                  data-magnetic
                  className="bg-white/10 hover:bg-primary p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group border border-white/10 hover:border-primary"
                >
                  <Icon className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Services', hash: '#services' },
                { label: 'How It Works', hash: '#how-it-works' },
                { label: 'Pricing', hash: '#pricing' },
                { label: 'Contact', hash: '#contact' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => to(link.hash)} 
                    className="text-gray-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300"
                  >
                    → {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Service Areas</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Nairobi CBD
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Westlands
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Karen
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Kilimani
              </li>
              <li className="text-primary font-semibold">More areas coming soon...</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Call us</p>
                  <a href="tel:+254700000000" className="text-white hover:text-primary transition-colors">
                    +254 700 000 000
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary transition-colors">
                  <Mail className="h-4 w-4 text-primary group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email us</p>
                  <a href="mailto:hello@smartwash.co.ke" className="text-white hover:text-primary transition-colors">
                    hello@smartwash.co.ke
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary transition-colors">
                  <MapPin className="h-4 w-4 text-primary group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-white">Nairobi, Kenya</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} SmartWash Kenya. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button onClick={() => navigate('/terms')} className="text-gray-500 hover:text-primary transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => navigate('/terms')} className="text-gray-500 hover:text-primary transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
    </footer>
  );
}
