import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function TextReveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = typeof children === 'string' ? children.split(' ') : [];

  if (typeof children !== 'string') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={isInView ? { 
            opacity: 1, 
            y: 0,
            filter: 'blur(0px)'
          } : { 
            opacity: 0, 
            y: 20,
            filter: 'blur(8px)'
          }}
          transition={{
            duration: 0.6,
            delay: delay + (index * 0.08),
            ease: [0.16, 1, 0.3, 1]
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
