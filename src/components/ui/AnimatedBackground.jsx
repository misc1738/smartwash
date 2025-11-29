import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  // Lightweight early-exit for users who opted out
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData;
  const deviceMemory = typeof navigator !== 'undefined' ? navigator.deviceMemory || 4 : 4;

  if (prefersReduced || saveData || deviceMemory < 1) return null;

  try {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background transition-colors duration-500">
        {/* Animated gradient orbs - Adapts to Theme (Gold or Red) */}
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-48 w-96 h-96 bg-primary-light/10 rounded-full blur-[100px]"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-foreground/5 rounded-full blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
            scale: [1, 1.4, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />

        {/* Subtle Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />

        {/* Scanning line effect - Subtle Primary Color */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    );
  } catch (err) {
    // Prevent background animation errors from crashing the app
    // eslint-disable-next-line no-console
    console.warn('[AnimatedBackground] render error:', err);
    return null;
  }
}
