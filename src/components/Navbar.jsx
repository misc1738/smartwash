import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import navigateToHash from '../utils/scrollToHash';
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
    { id: "/about", label: "About" },
    { id: "/services", label: "Services" },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="transition-all duration-500">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
              <span className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light tracking-wider group-hover:to-foreground transition-all duration-500">
                SMARTWASH
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.id.startsWith('#') ? handleScroll(item.id) : navigate(item.id)}
                  className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 ${location.pathname === item.id || (item.id === '/' && location.pathname === '/')
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-primary-light'
                    }`}
                >
                  <span className="relative z-10 tracking-wide">{item.label}</span>
                  {/* Active Indicator */}
                  {(location.pathname === item.id || (item.id === '/' && location.pathname === '/')) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                  )}
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/bookings')}
                className="hidden sm:inline-flex items-center gap-2 px-6 py-2 text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Book Now</span>
              </button>

              <div className="flex items-center gap-3 border-l border-foreground/10 pl-4">
                <ThemeToggle />
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-serif italic text-primary">Hi, {user.firstName}</span>
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="hidden sm:inline-block text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mx-4 mt-2 p-4 bg-background/95 backdrop-blur-xl rounded-xl animate-slide-down border border-primary/20 shadow-2xl">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.id.startsWith('#') ? handleScroll(item.id) : navigate(item.id)}
                className="text-left px-4 py-3 text-foreground/90 hover:text-primary hover:bg-foreground/5 rounded-lg transition-all font-serif"
              >
                {item.label}
              </button>
            ))}
            {!user && (
              <div className="pt-4 mt-2 border-t border-foreground/10 flex flex-col gap-3">
                <button
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  className="w-full py-3 text-center text-foreground/80 hover:text-foreground"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/bookings'); setMobileMenuOpen(false); }}
                  className="w-full py-3 text-center bg-primary text-primary-foreground font-bold rounded-lg"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
