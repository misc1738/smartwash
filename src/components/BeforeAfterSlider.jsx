import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BeforeAfterSlider = ({ before, after, beforeLabel = "Before", afterLabel = "After" }) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX) - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(newPosition);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (isDragging) handleMove(e);
  };

  return (
    <section className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            See The <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">Difference</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Slide to compare the transformation. Our detailing speaks for itself.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative w-full max-w-5xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl border border-white/10"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleMove}
          >
            {/* After Image (Full Width) */}
            <img
              src={after}
              alt={afterLabel}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${position}%` }}
            >
              <img
                src={before}
                alt={beforeLabel}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: `${containerRef.current ? containerRef.current.offsetWidth : 100}px` }}
              />
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-primary cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                <ChevronLeft className="w-6 h-6 text-primary absolute left-1" />
                <ChevronRight className="w-6 h-6 text-primary absolute right-1" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span className="text-white font-bold text-sm uppercase tracking-wider">{beforeLabel}</span>
              </div>
              <div className="absolute top-6 right-6 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span className="text-white font-bold text-sm uppercase tracking-wider">{afterLabel}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isDragging ? 0 : 1 }}
            className="text-center text-white/50 text-sm mt-6"
          >
            ← Drag the slider to compare →
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;