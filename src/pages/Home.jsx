import { Calendar, MapPin, Sparkles } from "lucide-react";
import Hero from "../components/Hero";
import HeroScrollSection from "../components/HeroScrollSection";
import ServiceShowcase from "../components/ServiceShowcase";
import ImageHeroSection from "../components/ImageHeroSection";
import About from "../components/About";
import Services from "../components/Services";
import BookingCalendar from "../components/BookingCalendar";
import Marquee from "../components/Marquee";
import SectionDivider from "../components/ui/SectionDivider";

export default function Home() {
  return (
    <>
      <Hero />
      
      <SectionDivider />
      <BookingCalendar />
      
      {/* Image Hero Section 3 - Mobile Convenience with Typing Effect */}
      <ImageHeroSection
        image="/img/pexels-sarmad-mughal-94606-305070.jpg"
        imageLight="/img/pexels-mcraftpix-21011.jpg"
        subtitle="Ultimate Convenience"
        title={`We Come To You.\nAnywhere in Nairobi.`}
        description="No need to leave your home or office. Our mobile detailing service brings premium car care directly to your doorstep across all Nairobi neighborhoods."
        features={[
          "Home Service",
          "Office Detailing",
          "Same-Day Booking",
          "Flexible Scheduling"
        ]}
        align="right"
        overlayOpacity="0.8"
        useTypingEffect={true}
        typingTexts={[
          "Westlands",
          "Karen",
          "Kilimani",
          "Parklands",
          "Lavington",
          "Runda",
          "Kileleshwa",
          "South C",
          "Anywhere in Nairobi"
        ]}
      />
      
      {/* Image Hero Section 1 - Premium Service */}
      <ImageHeroSection
        image="/img/pexels-karola-g-4870724.jpg"
        imageLight="/img/pexels-karola-g-4870727.jpg"
        subtitle="Premium Detailing"
        title="Where Excellence Meets Perfection"
        description="Experience the pinnacle of automotive care with our signature detailing services. Every detail matters, every surface shines."
        features={[
          "Ceramic Coating",
          "Paint Correction",
          "Interior Detailing",
          "Engine Bay Clean"
        ]}
        align="center"
      />
      
      <HeroScrollSection />
      
      {/* Image Hero Section 2 - Eco-Friendly */}
      <ImageHeroSection
        image="/img/pexels-kopriva.jpg"
        imageLight="/img/pexels-karola-g-4870724.jpg"
        subtitle="Sustainable Solutions"
        title="Eco-Friendly. Waterless. Exceptional."
        description="Our innovative waterless technology protects the environment while delivering stunning results. Sustainable car care that makes a difference."
        features={[
          "Zero Water Waste",
          "Biodegradable Products",
          "Carbon Neutral Service"
        ]}
        align="left"
        overlayOpacity="0.75"
      />
      
      <SectionDivider />
      <About />
      <SectionDivider />
      <Marquee />
      
  <SectionDivider />
  <Services />
  <SectionDivider />
      <ServiceShowcase />
      <ImageHeroSection
        image="/img/pexels-karola-g-4870700.jpg"
        imageLight="/img/pexels-karola-g-4870727.jpg"
        subtitle="Expert Craftsmen"
        title="Trained Professionals. Guaranteed Results."
        description="Our certified detailing specialists use professional-grade products and techniques to ensure your vehicle receives the best care possible."
        features={[
          "Certified Technicians",
          "Premium Products",
          "Quality Guarantee"
        ]}
        align="center"
        overlayOpacity="0.7"
      />
      
  {/* LoyaltyRewards and PricingCalculator sections removed per request */}
    </>
  );
}
