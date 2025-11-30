import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Shield, Award, Users, Target, Heart, Droplet, CheckCircle2 } from 'lucide-react';
import ThemeImage from '../components/ThemeImage';
import { useRef } from 'react';

export default function AboutPage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const sphereY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const sphereScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

    return (
        <div className="min-h-screen bg-background transition-colors duration-500">
            {/* Hero Section with Image */}
            <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
                {/* Subtle Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 max-w-7xl">
                    {/* About Us Title & Description */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 backdrop-blur-sm"
                            >
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold">
                                    Our Story
                                </span>
                            </motion.div>

                            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold leading-none mb-4">
                                <span className="block text-foreground">About</span>
                                <span className="block bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                                    Us
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col justify-center gap-6"
                        >
                            <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-light">
                                SmartWash is Nairobi's premier mobile car detailing service, bringing professional-grade automotive care directly to your doorstep.
                            </p>
                            <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-light">
                                We combine cutting-edge eco-friendly technology with expert craftsmanship to deliver exceptional results. From the bustling streets of Westlands to the serene suburbs of Karen, we're committed to preserving your vehicle's beauty while protecting our environment.
                            </p>

                            {/* Key Points */}
                            <div className="space-y-3 mt-4">
                                {[
                                    "Premium mobile detailing service",
                                    "Eco-friendly waterless technology",
                                    "Certified professional technicians"
                                ].map((point, index) => (
                                    <motion.div
                                        key={point}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-sm md:text-base text-foreground/70 font-medium">
                                            {point}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image with Decorative Sphere */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Background Image */}
                        <ThemeImage
                            srcDark="/img/about-dark.png"
                            srcLight="https://images.pexels.com/photos/6872609/pexels-photo-6872609.jpeg?auto=compress&cs=tinysrgb&w=1920"
                            alt="Professional car detailing"
                            className="w-full h-full object-cover"
                        />

                        {/* Decorative Sphere Overlay with Parallax */}
                        <motion.div
                            style={{ y: sphereY, scale: sphereScale }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 1.2, delay: 0.8, type: "spring", bounce: 0.3 }}
                                className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full shadow-2xl"
                                style={{
                                    background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary-light)), hsl(var(--primary)))',
                                }}
                            >
                                {/* Inner glow */}
                                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

                                {/* Shine effect */}
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent"
                                />
                            </motion.div>
                        </motion.div>

                        {/* Gradient Overlay for better contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />

                        {/* Border glow */}
                        <div className="absolute inset-0 rounded-3xl ring-1 ring-primary/20" />
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="relative py-24 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-foreground mb-4">
                            Our Values
                        </h2>
                        <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    {/* Value Icons Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Sparkles,
                                title: "Excellence",
                                color: "from-yellow-400 to-yellow-500",
                                shadow: "shadow-yellow-500/50"
                            },
                            {
                                icon: Shield,
                                title: "Security",
                                color: "from-purple-400 to-purple-500",
                                shadow: "shadow-purple-500/50"
                            },
                            {
                                icon: Award,
                                title: "Quality",
                                color: "from-orange-400 to-orange-500",
                                shadow: "shadow-orange-500/50"
                            },
                            {
                                icon: Users,
                                title: "Community",
                                color: "from-blue-400 to-blue-500",
                                shadow: "shadow-blue-500/50"
                            },
                            {
                                icon: Droplet,
                                title: "Eco-Friendly",
                                color: "from-green-400 to-green-500",
                                shadow: "shadow-green-500/50"
                            },
                            {
                                icon: Heart,
                                title: "Passion",
                                color: "from-red-400 to-red-500",
                                shadow: "shadow-red-500/50"
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    type: "spring",
                                    bounce: 0.4
                                }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8, scale: 1.05 }}
                                className="flex flex-col items-center text-center group cursor-pointer"
                            >
                                {/* Circular Icon */}
                                <div className={`relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-xl ${value.shadow} transition-all duration-300 group-hover:shadow-2xl`}>
                                    <value.icon className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" strokeWidth={1.5} />

                                    {/* Shine effect */}
                                    <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Label */}
                                <p className="text-sm md:text-base font-semibold text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                                    {value.title}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                </div>

                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
                            <Target className="w-4 h-4 text-primary" />
                            <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold">
                                Our Mission
                            </span>
                        </div>

                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight">
                            Revolutionizing Automotive Care in{' '}
                            <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                                Kenya
                            </span>
                        </h3>

                        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-light max-w-3xl mx-auto">
                            We deliver premium, eco-friendly detailing services that exceed expectations. We're committed to preserving both your vehicle's beauty and our planet's future, one detail at a time.
                        </p>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="pt-4"
                        >
                            <a
                                href="/bookings"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <span>Experience SmartWash</span>
                                <Sparkles className="w-5 h-5" />
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
