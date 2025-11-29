import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Calendar, Check, ChevronRight, ChevronLeft, Star, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const vehicleTypes = [
    { id: 'sedan', label: 'Sedan / Coupe', icon: Car, priceMod: 1 },
    { id: 'suv', label: 'SUV / Crossover', icon: Shield, priceMod: 1.2 },
    { id: 'luxury', label: 'Luxury / Exotic', icon: Star, priceMod: 1.5 },
];

const packages = [
    { id: 'express', title: 'Express Wash', price: 1500, features: ['Exterior Wash', 'Vacuum', 'Tire Shine'] },
    { id: 'premium', title: 'Premium Detail', price: 3500, features: ['Clay Bar', 'Wax', 'Deep Interior'] },
    { id: 'ultimate', title: 'Ultimate Protection', price: 6000, features: ['Ceramic Coating', 'Paint Correction', 'Engine Bay'] },
];

export default function BookingWizard({ onClose }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [booking, setBooking] = useState({
        vehicle: null,
        package: null,
        date: '',
        time: '',
        details: { name: '', phone: '', location: '' }
    });

    const total = booking.package ? booking.package.price * (booking.vehicle?.priceMod || 1) : 0;

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleBook = () => {
        // In a real app, submit to backend here
        console.log('Booking submitted:', booking);
        navigate('/booking-confirmation', { state: { booking } });
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-background/90 backdrop-blur-xl border border-primary/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px]"
            >
                {/* Sidebar / Summary */}
                <div className="w-full md:w-1/3 bg-primary/5 border-r border-primary/10 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Concierge</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Your Booking</h2>
                        <p className="text-foreground/60 text-sm">Customize your premium experience.</p>
                    </div>

                    <div className="space-y-6">
                        {booking.vehicle && (
                            <div className="flex items-center gap-3 text-foreground/80">
                                <Car className="w-4 h-4 text-primary" />
                                <span>{booking.vehicle.label}</span>
                            </div>
                        )}
                        {booking.package && (
                            <div className="flex items-center gap-3 text-foreground/80">
                                <Star className="w-4 h-4 text-primary" />
                                <span>{booking.package.title}</span>
                            </div>
                        )}
                        {booking.date && (
                            <div className="flex items-center gap-3 text-foreground/80">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{booking.date} at {booking.time}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-primary/10">
                        <div className="text-sm text-foreground/50 uppercase tracking-wider mb-1">Estimated Total</div>
                        <div className="text-4xl font-bold text-primary">KSh {total.toLocaleString()}</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 md:p-12 relative overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-foreground/40 hover:text-foreground transition-colors"
                    >
                        Close
                    </button>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/40 mb-2">
                            <span className={step >= 1 ? 'text-primary' : ''}>01 Vehicle</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 2 ? 'text-primary' : ''}>02 Service</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 3 ? 'text-primary' : ''}>03 Schedule</span>
                        </div>
                        <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-2xl font-serif font-bold text-foreground">Select Your Vehicle</h3>
                                <div className="grid gap-4">
                                    {vehicleTypes.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setBooking({ ...booking, vehicle: v })}
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${booking.vehicle?.id === v.id
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-foreground/10 hover:border-primary/50'
                                                }`}
                                        >
                                            <div className={`p-3 rounded-full ${booking.vehicle?.id === v.id ? 'bg-primary text-white' : 'bg-foreground/5 text-foreground'}`}>
                                                <v.icon className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">{v.label}</div>
                                                <div className="text-xs opacity-60">Base Price x{v.priceMod}</div>
                                            </div>
                                            {booking.vehicle?.id === v.id && <Check className="w-5 h-5 ml-auto" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-8">
                                    <button
                                        onClick={nextStep}
                                        disabled={!booking.vehicle}
                                        className="px-8 py-3 bg-primary text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
                                    >
                                        Next Step
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-2xl font-serif font-bold text-foreground">Select Package</h3>
                                <div className="grid gap-4">
                                    {packages.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setBooking({ ...booking, package: p })}
                                            className={`text-left p-6 rounded-xl border transition-all ${booking.package?.id === p.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-foreground/10 hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-bold text-lg">{p.title}</div>
                                                <div className="font-bold text-primary">KSh {p.price.toLocaleString()}</div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {p.features.map(f => (
                                                    <span key={f} className="text-xs px-2 py-1 rounded-full bg-foreground/5 text-foreground/70">{f}</span>
                                                ))}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-8">
                                    <button onClick={prevStep} className="text-foreground/60 hover:text-foreground">Back</button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!booking.package}
                                        className="px-8 py-3 bg-primary text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
                                    >
                                        Next Step
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h3 className="text-2xl font-serif font-bold text-foreground">Final Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-1">Date</label>
                                            <input
                                                type="date"
                                                className="w-full p-3 bg-foreground/5 border border-foreground/10 rounded-lg focus:border-primary outline-none"
                                                onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-1">Time</label>
                                            <input
                                                type="time"
                                                className="w-full p-3 bg-foreground/5 border border-foreground/10 rounded-lg focus:border-primary outline-none"
                                                onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-1">Location</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your address"
                                            className="w-full p-3 bg-foreground/5 border border-foreground/10 rounded-lg focus:border-primary outline-none"
                                            onChange={(e) => setBooking({ ...booking, details: { ...booking.details, location: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-8">
                                    <button onClick={prevStep} className="text-foreground/60 hover:text-foreground">Back</button>
                                    <button
                                        onClick={handleBook}
                                        disabled={!booking.date || !booking.time}
                                        className="px-8 py-3 bg-primary text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition-colors shadow-lg shadow-primary/30"
                                    >
                                        Confirm Booking
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
