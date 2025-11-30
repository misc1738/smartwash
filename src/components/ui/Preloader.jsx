import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_TEXTS = [
    "Polishing the rims...",
    "Applying ceramic coating...",
    "Vacuuming the interior...",
    "Checking tire pressure...",
    "Buffing the hood...",
    "Final inspection...",
    "Preparing your luxury experience..."
];

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [textIndex, setTextIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Text rotation logic
        const textInterval = setInterval(() => {
            setTextIndex(prev => (prev + 1) % LOADING_TEXTS.length);
        }, 800);

        // Progress simulation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                // Random increment for realistic feel
                return Math.min(prev + Math.random() * 5, 100);
            });
        }, 150);

        // Completion logic
        const totalTime = setTimeout(() => {
            setIsLoading(false);
            clearInterval(textInterval);
            clearInterval(progressInterval);
        }, 3500); // Slightly longer to show off the texts

        return () => {
            clearTimeout(totalTime);
            clearInterval(textInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                    </div>

                    <div className="relative flex flex-col items-center z-10 max-w-md w-full px-4">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="mb-12 relative"
                        >
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                            <img
                                src="/img/logo-luxury.png"
                                alt="SmartWash"
                                className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl"
                            />
                        </motion.div>

                        {/* Progress Bar Container */}
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary via-primary-light to-primary"
                                style={{ width: `${progress}%` }}
                                layoutId="progress"
                            />
                            {/* Shimmer effect on bar */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1s_infinite]" />
                        </div>

                        {/* Percentage & Text */}
                        <div className="flex flex-col items-center gap-2 h-16">
                            <span className="text-4xl font-serif font-bold text-white/20 tabular-nums">
                                {Math.round(progress)}%
                            </span>

                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={textIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-primary/80 text-sm uppercase tracking-[0.2em] font-medium text-center"
                                >
                                    {LOADING_TEXTS[textIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
