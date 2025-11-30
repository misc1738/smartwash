import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import bookingsService from "../mocks/bookingsService";
import AnimatedText from "./ui/AnimatedText";
import BlurText from "./ui/BlurText";

function getNextDays(num) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < num; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0
    });
  }
  return days;
}

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const days = getNextDays(14);

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setSelectedTime("");
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!selectedDate) {
        setAvailability([]);
        return;
      }
      setLoading(true);
      const times = await bookingsService.getAvailability(selectedDate);
      if (active) {
        setAvailability(times);
        setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [selectedDate]);

  const handleBookNow = () => {
    navigate('/bookings', {
      state: {
        preselectedDate: selectedDate,
        preselectedTime: selectedTime
      }
    });
  };

  return (
    <section className="relative py-24 overflow-hidden bg-background transition-colors duration-500">
      {/* Background - White in light theme, dark in dark theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>

      {/* Animated Orbs - Subtle in light theme */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-primary-light/20 rounded-full blur-3xl"
          style={{ animation: 'float 8s ease-in-out infinite' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 text-primary font-bold uppercase tracking-widest text-xs backdrop-blur-sm mb-6">
            Quick Booking
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6">
            <BlurText
              text="Schedule Your"
              delay={40}
              animateBy="words"
              className="block text-foreground"
            />
            <BlurText
              text="Perfect Time"
              delay={40}
              animateBy="words"
              className="block bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent"
            />
          </h2>

          <div className="text-xl text-white/70 max-w-2xl mx-auto">
            <AnimatedText
              text="Choose your preferred date and time slot for a premium detailing experience"
              animationType="slideLeft"
              staggerDelay={20}
              duration={600}
            />
          </div>
        </motion.div>

        {/* Calendar Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Date Selection */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-card/50 backdrop-blur-xl border border-foreground/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/20 border border-primary/30 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Select Date</h3>
                </div>

                {/* Date Grid */}
                <div className="grid grid-cols-7 gap-3">
                  {days.map((dayInfo, index) => (
                    <motion.button
                      key={dayInfo.date}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDateSelect(dayInfo.date)}
                      className={`relative p-4 rounded-xl transition-all duration-300 ${selectedDate === dayInfo.date
                          ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/50'
                          : 'bg-background border border-foreground/10 text-foreground hover:bg-foreground/5 hover:border-primary/50'
                        }`}
                    >
                      <div className="text-xs font-medium opacity-70 mb-1">{dayInfo.dayName}</div>
                      <div className="text-2xl font-black">{dayInfo.day}</div>
                      <div className="text-xs opacity-70 mt-1">{dayInfo.month}</div>
                      {dayInfo.isToday && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.4 }}
                    className="mt-8"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary-light/20 border border-primary-light/30 rounded-lg">
                        <Clock className="w-6 h-6 text-primary-light" />
                      </div>
                      <h3 className="text-2xl font-black text-foreground">Available Times</h3>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    ) : availability.length === 0 ? (
                      <div className="text-center py-12 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 font-semibold">No available slots for this date</p>
                        <p className="text-white/50 text-sm mt-2">Please select another date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {availability.map((time, index) => (
                          <motion.button
                            key={time}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTime(time)}
                            className={`p-4 rounded-lg font-bold transition-all duration-300 ${selectedTime === time
                                ? 'bg-primary-light text-primary-foreground shadow-lg shadow-primary-light/50'
                                : 'bg-background border border-foreground/10 text-foreground hover:bg-foreground/5 hover:border-primary-light/50'
                              }`}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Right Column - Summary & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Booking Summary */}
              <div className="bg-gradient-to-br from-primary/20 to-primary-light/20 backdrop-blur-xl border border-primary/30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-black text-foreground">Your Selection</h3>
                </div>

                <div className="space-y-4">
                  {/* Selected Date */}
                  <div className="bg-background/50 rounded-lg p-4 border border-foreground/10">
                    <div className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Date</div>
                    <div className="text-foreground font-bold text-lg">
                      {selectedDate || <span className="text-foreground/40">Not selected</span>}
                    </div>
                  </div>

                  {/* Selected Time */}
                  <div className="bg-background/50 rounded-lg p-4 border border-foreground/10">
                    <div className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Time</div>
                    <div className="text-foreground font-bold text-lg">
                      {selectedTime || <span className="text-foreground/40">Not selected</span>}
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                {selectedDate && selectedTime && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookNow}
                    className="w-full mt-6 bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 text-primary-foreground font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider text-sm shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/70"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Continue Booking</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* Quick Info */}
              <div className="bg-card/50 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6">
                <h4 className="text-foreground font-bold mb-4 text-sm uppercase tracking-wider">Quick Tips</h4>
                <div className="space-y-3 text-sm text-foreground/70">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                    <span>Peak hours: 9AM-12PM, 2PM-5PM</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
                    <span>Service takes 1.5-3 hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2" />
                    <span>Free rescheduling anytime</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
      `}</style>
    </section>
  );
};

export default BookingCalendar;