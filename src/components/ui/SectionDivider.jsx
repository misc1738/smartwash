import { motion } from 'framer-motion';

const SectionDivider = () => {
  return (
    <div className="relative w-full h-32 overflow-hidden">
      {/* Animated gradient line */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Central gradient bar */}
        <div className="relative w-full h-[2px] max-w-6xl mx-auto">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 100%',
            }}
          />
          
          {/* Glowing orb that travels along the line */}
          <motion.div
            className="absolute top-1/2 left-0 w-4 h-4 -mt-2 rounded-full bg-primary shadow-lg shadow-primary/50"
            animate={{
              x: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>

      {/* Decorative side elements */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-20">
        <motion.div
          className="w-2 h-2 bg-primary/30 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="w-2 h-2 bg-primary/30 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Background accent glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-96 h-32 bg-primary/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default SectionDivider;
