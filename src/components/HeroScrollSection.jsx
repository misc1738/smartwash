import React from "react";
import { ContainerScroll } from "./ui/ContainerScrollAnimation";
import { Sparkles } from "lucide-react";
import ThemeImage from './ThemeImage';

export default function HeroScrollSection() {
  return (
    <div className="flex flex-col overflow-hidden bg-black">
      <ContainerScroll
        titleComponent={
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-12 bg-primary" />
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.25em] text-white/60 font-medium">
                Experience Excellence
              </span>
              <Sparkles className="w-4 h-4 text-primary" />
              <div className="h-px w-12 bg-primary" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
              Discover The Power of
              <br />
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mt-2 leading-none bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent drop-shadow-lg">
                Premium Detailing
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Professional automotive care that transforms your vehicle inside and out
            </p>
          </div>
        }
      >
          <ThemeImage
            base="/img/pexels-tima-miroshnichenko-6872146.jpg"
            srcLight="/img/pexels-tima-miroshnichenko-6872150.jpg"
            alt="Premium car wash and detailing service - SmartWash Nairobi"
            className="mx-auto rounded-2xl object-cover h-full object-center w-full"
            decorative={false}
            fallback="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1400&q=80"
          />
      </ContainerScroll>
    </div>
  );
}
