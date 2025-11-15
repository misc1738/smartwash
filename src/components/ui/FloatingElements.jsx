import { motion } from 'framer-motion';
import { Droplet, Sparkles, Zap, Star } from 'lucide-react';

export default function FloatingElements() {
  // Avoid heavy motion on low-power devices or when reduced-motion is enabled
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData;
  const deviceMemory = typeof navigator !== 'undefined' ? navigator.deviceMemory || 4 : 4;

  if (prefersReduced || saveData || deviceMemory < 1) return null;

  const elements = [
    { Icon: Droplet, color: 'text-blue-400', delay: 0, duration: 15 },
    { Icon: Sparkles, color: 'text-primary', delay: 2, duration: 18 },
    { Icon: Zap, color: 'text-cyan-400', delay: 4, duration: 20 },
    { Icon: Star, color: 'text-blue-300', delay: 1, duration: 16 },
    { Icon: Droplet, color: 'text-primary', delay: 3, duration: 17 },
    { Icon: Sparkles, color: 'text-cyan-300', delay: 5, duration: 19 },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {elements.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.color} opacity-20`}
          style={{
            left: `${10 + (index * 15)}%`,
            top: `${20 + (index * 10)}%`,
          }}
          animate={{
            y: [-20, -120, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.Icon size={32} />
        </motion.div>
      ))}
    </div>
  );
}
