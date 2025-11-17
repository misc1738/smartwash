import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ThemeImage from '../components/ThemeImage';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Check } from 'lucide-react';

export default function Signup() {
  const location = useLocation();
  const prefillEmail = location?.state?.email || '';
  const from = location?.state?.from;
  const [form, setForm] = useState({ firstName: '', lastName: '', email: prefillEmail, password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const change = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName || !form.email || !form.password) return setError('Please fill required fields');
    if (!agree) return setError('Please accept Terms & Condition');
    try {
      setLoading(true);
      await register(form);
      // Small delay before navigation to ensure state is updated
      setTimeout(() => {
        const dest = from?.pathname || '/';
        navigate(dest, { replace: true });
      }, 100);
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden relative">
      {/* Static Background */}
      <div className="absolute inset-0">
        {/* Theme-aware background image: expects pexels-kublackphotography-9197708.jpg and pexels-kublackphotography-9197708-light.jpg */}
        <div className="w-full h-full">
          <ThemeImage base="/img/pexels-kublackphotography-9197708.jpg" srcLight="/img/carwash-light.jpg" alt="Signup background" className="w-full h-full" fallback="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1920&q=80" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
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
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-primary p-3 rounded-lg shadow-xl shadow-primary/30">
              <Sparkles className="h-8 w-8 text-black" />
            </div>
            <span className="text-4xl font-black text-white drop-shadow-lg">
              Smart<span className="text-primary">Wash</span>
            </span>
          </div>

          <div>
            <h1 className="text-6xl font-black leading-tight drop-shadow-2xl mb-6">
              <div className="text-white mb-2">JOIN THE</div>
              <div className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                ELITE
              </div>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              Experience premium automotive care with exclusive member benefits and rewards.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-4">
            {[
              'Priority Booking Access',
              'Member-Only Discounts',
              'Free Service Upgrades',
              'Loyalty Rewards Program'
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-3 text-white/80"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="w-6 h-6 bg-primary/20 border border-primary rounded flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm uppercase tracking-wider">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="bg-primary p-2 rounded-lg shadow-xl shadow-primary/30">
                <Sparkles className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-black text-white">
                Smart<span className="text-primary">Wash</span>
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
              <p className="text-white/60 text-sm">
                Already a member?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
                  Log In
                </Link>
              </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {/* Name Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-2 uppercase tracking-wider">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={change}
                      className="w-full bg-black/50 border border-white/20 rounded-lg pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-2 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={change}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="group">
                <label className="block text-sm font-medium text-white/80 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={change}
                    className="w-full bg-black/50 border border-white/20 rounded-lg pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-sm font-medium text-white/80 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type={show ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={change}
                    className="w-full bg-black/50 border border-white/20 rounded-lg pl-12 pr-12 py-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 w-5 h-5 bg-black/50 border-white/20 rounded focus:ring-primary"
                />
                <label htmlFor="agree" className="text-sm text-white/70">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                data-magnetic
                className="group relative w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider text-sm shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
