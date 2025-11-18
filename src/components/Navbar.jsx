import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import navigateToHash from '../utils/scrollToHash';
import Button from './ui/Button';
import ThemeToggle from './ThemeToggle';
import AnimatedBrandButton from './ui/AnimatedBrandButton';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleScroll = (id) => {
    navigateToHash(id, navigate);
    setMobileMenuOpen(false);
  };

  // Navbar items
  const navItems = [
    { id: "/", label: "Home" },
    { id: "/services", label: "Services" },
    { id: "#how-it-works", label: "About us" },
    { id: "#contact", label: "Contact" },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${'bg-transparent border-b border-transparent backdrop-blur-0 shadow-none'}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className={`transition-all duration-500 ${scrolled ? 'my-2 bg-transparent rounded-2xl p-2 shadow-none' : 'my-0 bg-transparent p-2'}`}>
                    <div className="flex items-center justify-between px-4 py-3">
            {/* Logo with Animated Button */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <AnimatedBrandButton text="SMARTWASH" />
            </div>

            {/* Desktop Navigation - Transparent at top; subtle glass when scrolled */}
            <div className={`hidden md:flex items-center gap-2 p-1.5 rounded-full border ${'bg-transparent border-transparent backdrop-blur-0'}`}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.id.startsWith('#') ? handleScroll(item.id) : navigate(item.id)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 group overflow-hidden ${
                    location.pathname === item.id || (item.id === '/' && location.pathname === '/')
                      ? 'bg-gradient-to-r from-primary to-cyan-400 text-black shadow-lg shadow-primary/50'
                      : 'text-white hover:text-white hover:bg-white/10'
                  }`}
                  style={
                    !(location.pathname === item.id || (item.id === '/' && location.pathname === '/'))
                      ? { textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.7)' }
                      : {}
                  }
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Animated underline */}
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-primary via-cyan-400 to-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  {/* Glow effect on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                </button>
              ))}
            </div>

            {/* Right Side Actions - Enhanced */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/bookings')}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white hover:text-primary transition-all duration-300 border border-white/30 rounded-full hover:border-primary/70 hover:bg-white/10 backdrop-blur-sm group"
                style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.7)' }}
              >
                <span>Book Now</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)' }}>Hi, {user.firstName}</span>
                    <button 
                      onClick={() => { logout(); navigate('/'); }} 
                      className="px-4 py-2 text-sm font-medium text-white hover:text-primary hover:bg-white/10 rounded-full transition-all duration-300"
                      style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)' }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate('/login')} 
                      className="hidden sm:inline-block px-5 py-2.5 text-sm font-medium text-white hover:text-primary transition-colors duration-300"
                      style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)' }}
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => navigate('/signup')} 
                      className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-cyan-400 hover:from-primary hover:to-primary text-black font-bold rounded-full shadow-2xl shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
                    >
                      <span>Get Started</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="h-6 w-6 text-foreground dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden mx-4 mb-2 py-4 space-y-2 bg-black/80 backdrop-blur-md shadow-lg rounded-xl animate-slide-down" role="menu" aria-label="Mobile Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.id.startsWith('#') ? handleScroll(item.id) : navigate(item.id)}
              className="block w-full text-left px-6 py-3 text-foreground dark:text-white font-medium hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <div className="px-6 py-3 space-y-2">
              <span className="block text-sm text-muted-foreground">Hi, {user.firstName}</span>
              <button 
                onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }} 
                className="text-sm text-primary hover:text-primary-light"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="px-4 space-y-2">
              <button 
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} 
                className="block w-full text-left px-6 py-3 text-foreground dark:text-white font-medium hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
              >
                Login
              </button>
              <button 
                onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} 
                className="block w-full text-left px-6 py-3 bg-primary text-black font-semibold hover:bg-primary-light transition-all rounded-lg"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
