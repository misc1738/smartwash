import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Droplet, ArrowRight } from 'lucide-react';
import BlurText from './ui/BlurText';
import AnimatedText from './ui/AnimatedText';
import TextType from './ui/TextType';
import ThemeImage from './ThemeImage';

const About = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background transition-colors duration-500">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ThemeImage
          srcDark="/img/about-dark.png"
          srcLight="https://images.pexels.com/photos/6872609/pexels-photo-6872609.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Professional car wash"
          className="w-full h-full object-cover opacity-30 dark:opacity-50 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70"></div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-primary-light/10 rounded-full blur-3xl"
          style={{ animation: 'float 8s ease-in-out infinite' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center max-w-7xl mx-auto">

          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Add semi-transparent background for better text legibility */}
            <div className="bg-background/80 dark:bg-background/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-foreground/10">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-block">
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 border border-primary/20 text-primary font-serif font-bold uppercase tracking-widest text-xs backdrop-blur-sm">
                    About SmartWash
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight">
                  <BlurText
                    text="Nairobi's"
                    delay={40}
                    animateBy="words"
                    className="block text-foreground"
                  />
                  <BlurText
                    text="Finest Service"
                    delay={40}
                    animateBy="words"
                    className="block bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent"
                  />
                </h2>

                <div className="text-lg sm:text-xl text-foreground/90 max-w-xl">
                  <TextType
                    text="Premium mobile detailing that comes to you, wherever you are in Kenya's capital."
                    typingSpeed={30}
                    loop={false}
                    showCursor={false}
                    startOnVisible={true}
                    className="text-lg sm:text-xl text-foreground/90 font-light"
                  />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 max-w-xl">
                <TextType
                  text="SmartWash leads Kenya's automotive care industry with cutting-edge detailing solutions. From the bustling streets of Westlands to the serene suburbs of Karen, we bring professional-grade car care directly to your location."
                  typingSpeed={25}
                  initialDelay={3000}
                  loop={false}
                  showCursor={false}
                  startOnVisible={true}
                  className="text-base sm:text-lg text-foreground/90 leading-relaxed font-light"
                />

                <TextType
                  text="Our eco-friendly, waterless technology protects both your vehicle and Nairobi's environment. Every service—from ceramic coating to interior detailing—is performed by certified technicians using premium products trusted by Kenya's automotive enthusiasts."
                  typingSpeed={25}
                  initialDelay={8000}
                  loop={false}
                  showCursor={false}
                  startOnVisible={true}
                  className="text-lg text-foreground/90 leading-relaxed font-light"
                />

                <TextType
                  text="Whether it's a quick refresh or complete transformation, we deliver excellence without compromising convenience. Book now and experience the SmartWash difference."
                  typingSpeed={25}
                  initialDelay={15000}
                  loop={false}
                  showCursor={false}
                  startOnVisible={true}
                  className="text-lg text-foreground/90 leading-relaxed font-light"
                />
              </div>
            </div>
            {/* End of legibility background wrapper */}

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center backdrop-blur-sm group hover:bg-primary/20 transition-colors duration-500">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="text-foreground/90 font-serif font-medium text-xs sm:text-sm tracking-wide">Premium Quality</div>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm group hover:bg-primary/15 transition-colors duration-500">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary/80" />
                </div>
                <div className="text-foreground/90 font-serif font-medium text-xs sm:text-sm tracking-wide">Paint Protection</div>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm group hover:bg-primary/15 transition-colors duration-500">
                  <Droplet className="w-6 h-6 sm:w-8 sm:h-8 text-primary/80" />
                </div>
                <div className="text-foreground/90 font-serif font-medium text-xs sm:text-sm tracking-wide">Eco-Friendly</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-400 text-white font-bold transition-all duration-500 flex items-center justify-center gap-3 uppercase tracking-wider text-sm shadow-2xl shadow-primary/50 hover:shadow-primary/70 hover:scale-105"
              >
                <span>Book Your Service Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right - Image Grid */}
          <div className="relative lg:block hidden">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-500 group">
                  <img
                    src="https://images.pexels.com/photos/4870700/pexels-photo-4870700.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Interior detailing"
                    className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    loading="lazy"
                  />
                </div>
                <div className="overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-500 group">
                  <img
                    src="https://images.pexels.com/photos/4870727/pexels-photo-4870727.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Polish detailing"
                    className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-500 group">
                  <img
                    src="https://images.pexels.com/photos/4870705/pexels-photo-4870705.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Wheel cleaning"
                    className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    loading="lazy"
                  />
                </div>
                <div className="overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-500 group">
                  <img
                    src="https://images.pexels.com/photos/6873020/pexels-photo-6873020.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Exterior wash"
                    className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
      `}</style>
    </section>
  );
};

export default About;
