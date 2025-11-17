import React from "react";
import ThemeImage from './ThemeImage';
import { ContainerScroll } from "./ui/ContainerScrollAnimation";
import { Sparkles, Check } from "lucide-react";

export default function ServiceShowcase() {
  return (
    <div className="flex flex-col overflow-hidden bg-black py-20">
      <ContainerScroll
        titleComponent={
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-12 bg-primary" />
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.25em] text-white/60 font-medium">
                Professional Excellence
              </span>
              <Sparkles className="w-4 h-4 text-primary" />
              <div className="h-px w-12 bg-primary" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
              Unmatched Quality
              <br />
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mt-2 leading-none bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent drop-shadow-lg">
                Meets Precision
              </span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-8 mt-8 text-white/80">
              {[
                "Eco-Friendly Products",
                "Expert Technicians",
                "Premium Equipment",
                "100% Satisfaction"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm uppercase tracking-wider">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <ThemeImage
          base="/img/pexels-mcraftpix-21011.jpg"
          srcLight="/img/pexels-sarmad-mughal-94606-305070.jpg"
          alt="Professional car detailing - SmartWash Nairobi"
          className="mx-auto rounded-2xl object-cover h-full w-full"
          decorative={false}
          fallback="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1400&q=80"
        />
      </ContainerScroll>
    </div>
  );
}
