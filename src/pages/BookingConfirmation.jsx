import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Phone, User, ArrowRight, Download, Share2, CreditCard } from 'lucide-react';
import SimpleSplitText from '../components/ui/SimpleSplitText';
import { ShaderAnimation } from '../components/ui/ShaderAnimation';
import bookingsService from '../mocks/bookingsService';
import { generateBookingReceipt } from '../services/pdfService';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingState = location.state?.booking;
  const [booking, setBooking] = useState(bookingState || null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const idFromState = bookingState?.id;

  // Ensure the animation is fully visible by scrolling to top on mount
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (_) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const id = idFromState || new URLSearchParams(location.search).get('id');
        if (!id && !bookingState) {
          navigate('/bookings');
          return;
        }
        if (!bookingState && id) {
          const fresh = await bookingsService.getById(id);
          if (active) setBooking(fresh);
        }
      } catch (_) {
        navigate('/bookings');
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const services = {
    express: { name: 'Express Wash', price: 'KSh 1,500' },
    premium: { name: 'Premium Detail', price: 'KSh 3,500' },
    ultimate: { name: 'Ultimate Protection', price: 'KSh 6,000' },
    interior: { name: 'Interior Deep Clean', price: 'KSh 2,500' },
  };

  if (!booking) return null;

  const selectedService = services[booking.service] || services.express;

  const doPay = async () => {
    const updated = await bookingsService.pay(booking.id, 'mpesa');
    setBooking(updated);
  };

  const handleDownloadReceipt = async () => {
    if (!booking) return;
    setDownloadingPdf(true);
    try {
      await generateBookingReceipt(booking);
      // Success handled by the service (auto-download)
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      alert('Failed to generate receipt. Please try again later.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Shader Animation Background */}
      <div className="absolute inset-0">
        <ShaderAnimation />
      </div>
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon (centered) */}
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center mb-8">
            <div className="inline-flex p-6 bg-green-500/20 border border-green-500/30 rounded-full mb-6 animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-green-400" />
            </div>
            <div className="whitespace-nowrap mb-2 md:mb-3">
              <SimpleSplitText
                text="Booking Confirmed!"
                tag="h1"
                className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"
                delay={0.05}
                duration={0.6}
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
              />
            </div>
            
            <p className="text-xl text-white/70 max-w-xl mx-auto mt-2 md:mt-3">
              We've received your booking and will contact you shortly to confirm the details.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-black/40 border border-white/10 backdrop-blur-xl overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-cyan-500/20 border-b border-primary/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Booking Details</h2>
                  <p className="text-white/60 text-sm">Booking ID: #{booking.id}</p>
                </div>
                <div className={`px-4 py-2 text-sm font-bold uppercase border ${booking.status === 'confirmed' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'}`}>
                  {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 border border-primary/30 rounded-full">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Customer Name</div>
                    <div className="text-white font-semibold text-lg">{booking.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/20 border border-cyan-400/30 rounded-full">
                    <Phone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Phone Number</div>
                    <div className="text-white font-semibold text-lg">{booking.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/20 border border-green-400/30 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Service</div>
                    <div className="text-white font-semibold text-lg">{selectedService.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/20 border border-purple-400/30 rounded-full">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Date & Time</div>
                    <div className="text-white font-semibold text-lg">
                      {booking.date} at {booking.time}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                <div className="p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-full">
                  <MapPin className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Service Location</div>
                  <div className="text-white font-semibold text-lg">{booking.location}</div>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-lg">Total Amount</span>
                  <span className="text-4xl font-black text-primary">{booking.totalPrice ? `KSh ${Number(booking.totalPrice).toLocaleString()}` : selectedService.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {booking.paymentStatus !== 'paid' && (
              <button onClick={doPay} className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-400 text-white transition-all font-bold uppercase tracking-wide">
                <CreditCard className="w-5 h-5" />
                <span>Pay with M-Pesa (Mock)</span>
              </button>
            )}
            <button 
              onClick={handleDownloadReceipt}
              disabled={downloadingPdf}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white hover:border-primary/50 hover:bg-primary/10 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className={`w-5 h-5 ${downloadingPdf ? 'animate-bounce' : ''}`} />
              <span>{downloadingPdf ? 'Generating...' : 'Download Receipt'}</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white hover:border-primary/50 hover:bg-primary/10 transition-all font-semibold">
              <Share2 className="w-5 h-5" />
              <span>Share Booking</span>
            </button>
            <Link 
              to="/bookings"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-400 text-white transition-all font-bold uppercase tracking-wide"
            >
              <span>View All Bookings</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 backdrop-blur-xl p-8">
            <h3 className="text-2xl font-black text-white mb-6">What Happens Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 font-black text-white">
                  1
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Confirmation Call</div>
                  <div className="text-white/70 text-sm">We'll call you within 30 minutes to confirm your booking details.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center flex-shrink-0 font-black text-white">
                  2
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Technician Assigned</div>
                  <div className="text-white/70 text-sm">A professional detailer will be assigned to your booking.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 font-black text-white">
                  3
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Service Delivery</div>
                  <div className="text-white/70 text-sm">Our team arrives at your location on the scheduled date and time.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
