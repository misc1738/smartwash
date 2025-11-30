import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import ThemeImage from '../components/ThemeImage';
import ThemeToggle from '../components/ThemeToggle';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Star, Shield, Zap } from 'lucide-react';

const TESTIMONIALS = [
  {
    text: "The attention to detail is simply unmatched. My car looks better than the day I bought it.",
    author: "James Sterling",
    role: "Elite Member"
  },
  {
    text: "SmartWash isn't just a service, it's an experience. The concierge team is phenomenal.",
    author: "Sarah Jenkins",
    role: "Platinum Member"
  },
  {
    text: "Finally, a premium auto care service that respects my time and my vehicle.",
    author: "Michael Chang",
    role: "Gold Member"
  }
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [5, -5]);
  const rotateY = useTransform(x, [-300, 300], [-5, 5]);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const change = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) return setError('Please fill in all fields');
    try {
      setLoading(true);
      await login(form.email, form.password);
      // Restore booking data if it exists
      const state = location.state?.bookingData ? { bookingData: location.state.bookingData } : {};
      navigate(from, { replace: true, state });
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden relative transition-colors duration-500"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle className="text-gray-900 dark:text-white hover:text-primary transition-colors" />
      </div>

      {/* Static Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full">
          <ThemeImage base="/img/pexels-kublackphotography-9197708.jpg" srcLight="/img/carwash-light.jpg" alt="Login background" className="w-full h-full object-cover opacity-20 dark:opacity-60 transition-opacity duration-500" fallback="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1920&q=80" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/90 dark:from-black/90 dark:via-black/70 dark:to-black/90 transition-colors duration-500"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-primary-light/5 rounded-full blur-[120px]"
            style={{ animation: 'float 12s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Content Container */}
      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left Side - Branding */}
        <motion.div
          className="hidden lg:block space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary-light to-primary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img src="/img/logo-luxury.png" alt="SmartWash Luxury Logo" className="relative w-24 h-24 object-contain drop-shadow-2xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-5xl font-serif font-bold text-gray-900 dark:text-white tracking-tighter transition-colors duration-500">
                Smart<span className="text-primary dark:text-gold-foil">Wash</span>
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-primary/80 dark:text-primary-light/80 ml-1">Premium Auto Care</span>
            </div>
          </div>

          <div>
            <h1 className="text-7xl font-serif font-bold leading-none drop-shadow-2xl mb-6">
              <span className="block text-gray-900 dark:text-white/90 mb-2 text-4xl font-sans font-light tracking-wide transition-colors duration-500">Welcome</span>
              <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                Back
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-white/60 leading-relaxed mb-8 font-light max-w-md transition-colors duration-500">
              Access your premium dashboard to manage bookings, view service history, and unlock exclusive member benefits.
            </p>
          </div>

          {/* Rotating Testimonials */}
          <div className="relative h-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-lg text-gray-700 dark:text-white/80 italic font-serif mb-3 transition-colors duration-500">"{TESTIMONIALS[testimonialIndex].text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-primary"></div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest transition-colors duration-500">{TESTIMONIALS[testimonialIndex].author}</span>
                  <span className="text-xs text-primary/80 uppercase tracking-wider">{TESTIMONIALS[testimonialIndex].role}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Side - Form (3D Tilt Card) */}
        <motion.div
          style={{
            rotateX: rotateXSpring,
            rotateY: rotateYSpring,
            perspective: 1000
          }}
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group transform-style-3d transition-colors duration-500">
            {/* Holographic Border Effect */}
            <div className="absolute inset-0 rounded-3xl border border-white/20 dark:border-white/5 pointer-events-none"></div>
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/40 to-transparent dark:from-white/10 dark:to-transparent opacity-50 pointer-events-none"></div>

            {/* Spotlight Effect */}
            <motion.div
              className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent rotate-45 pointer-events-none"
              style={{ x: useTransform(x, [-300, 300], [-100, 100]), opacity: useTransform(y, [-300, 300], [0.3, 0.6]) }}
            />

            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center mb-10">
              <img src="/img/logo-luxury.png" alt="SmartWash Logo" className="w-20 h-20 object-contain mb-4 drop-shadow-xl" />
              <span className="text-3xl font-serif font-bold text-gray-900 dark:text-white transition-colors duration-500">
                Smart<span className="text-primary">Wash</span>
              </span>
            </div>

            <div className="mb-10 text-center lg:text-left relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-500">Member Login</h2>
              <p className="text-gray-500 dark:text-white/50 text-sm tracking-wide uppercase transition-colors duration-500">
                New to SmartWash?{' '}
                <Link to="/signup" className="text-primary hover:text-primary-dark dark:hover:text-primary-light font-bold transition-colors ml-1">
                  Join the Elite
                </Link>
              </p>
            </div>

            <form onSubmit={submit} className="space-y-6 relative z-10">
              {/* Email Input */}
              <div className="group/input relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-white/30 group-focus-within/input:text-primary transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  className="peer block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:ring-0 focus:border-primary/50 focus:bg-white dark:focus:bg-white/10 transition-all duration-300"
                  placeholder="Email Address"
                  required
                />
                <label className="absolute left-12 top-4 text-gray-400 dark:text-white/40 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-white/40 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white dark:peer-focus:bg-black/50 peer-focus:px-1 peer-focus:rounded pointer-events-none">
                  Email Address
                </label>
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-500 peer-focus:w-full" />
              </div>

              {/* Password Input */}
              <div className="group/input relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-white/30 group-focus-within/input:text-primary transition-colors duration-300" />
                </div>
                <input
                  type={show ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={change}
                  className="peer block w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:ring-0 focus:border-primary/50 focus:bg-white dark:focus:bg-white/10 transition-all duration-300"
                  placeholder="Password"
                  required
                />
                <label className="absolute left-12 top-4 text-gray-400 dark:text-white/40 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-white/40 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white dark:peer-focus:bg-black/50 peer-focus:px-1 peer-focus:rounded pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-white/30 hover:text-gray-900 dark:hover:text-white transition-colors z-10"
                >
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-500 peer-focus:w-full" />
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-gray-500 dark:text-white/40 hover:text-primary transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <p className="text-red-600 dark:text-red-200 text-sm leading-relaxed">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white dark:text-black font-bold py-4 px-6 rounded-xl transition-all duration-500 flex items-center justify-center gap-3 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
              >
                <span className="relative z-10">{loading ? 'Authenticating...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />}

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
              </button>

              {/* Social Login Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-white/30 text-xs uppercase tracking-widest">Or continue with</span>
                <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
              </div>

              {/* Social Buttons */}
              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-500 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" /></svg>
                  <span className="text-sm font-medium text-gray-600 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-500 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.7.79 3.44 1.92-3.04 1.8-2.5 5.27.64 6.64-.67 1.72-1.6 3.41-2.67 4.47zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                  <span className="text-sm font-medium text-gray-600 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Apple</span>
                </button>
              </div>

              {/* Guest Link */}
              <div className="mt-8 text-center">
                <Link to="/services" className="text-gray-400 dark:text-white/30 hover:text-gray-900 dark:hover:text-white/60 text-xs transition-colors uppercase tracking-widest">
                  Browse as Guest
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
