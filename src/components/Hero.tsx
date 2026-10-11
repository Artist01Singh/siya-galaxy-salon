import React from 'react';
import { Star, ShieldCheck, Clock, MapPin, Sparkles, ArrowRight, Scissors } from 'lucide-react';
import { SalonSettings } from '../types';

interface HeroProps {
  settings: SalonSettings | null;
  onBookClick: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onBookClick, onExploreServices }) => {
  const rating = settings?.rating || 5.0;
  const reviewCount = settings?.reviewCount || 119;

  return (
    <section id="home" className="relative overflow-hidden pt-14 pb-20 lg:pt-24 lg:pb-32 border-b border-[#22202b]">
      {/* Background: Cinematic Premium Haircutting Imagery with Luxury Dark Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury haircutting and styling craftsmanship background"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
        />
        {/* Multi-layered luxury gradients for flawless contrast and warmth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090c] via-[#0a0a0ee8] to-[#0c0b11c0]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-transparent to-[#09090c]/80" />
        <div
          aria-hidden="true"
          className="absolute -top-32 right-1/4 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(197,168,92,0.18)_0%,_rgba(11,11,14,0)_70%)] blur-3xl pointer-events-none"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location & Authenticity kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#b8b3a7] font-medium tracking-wide">
              <span className="text-[#c5a85c] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#c5a85c]" />
                Siya Galaxy Salon
              </span>
              <span aria-hidden="true" className="text-[#524f5a]">·</span>
              <span className="flex items-center gap-1 text-[#ded9ce]">
                <MapPin className="w-3.5 h-3.5 text-[#c5a85c]" />
                Metro Pillar 33, Laxmi Nagar
              </span>
              <span aria-hidden="true" className="text-[#524f5a]">·</span>
              <span className="text-[#a39f97]">Est. April 2023</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#fbf9f5] font-normal leading-[1.12] tracking-tight">
              Artisanal Haircutting, <br className="hidden sm:inline" />
              Restorative Skincare &amp; <br className="hidden sm:inline" />
              <span className="italic font-light text-[#c5a85c]">Bespoke Makeovers.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#b5b0a6] max-w-2xl font-light leading-relaxed">
              Step into East Delhi&apos;s premier salon destination. Experience bespoke haircutting tailored to your
              features, organic Brazilian Nanoplastia, collagen Botoplex, clinical Hydra facials, and high-definition
              bridal transformations.
            </p>

            {/* Verified Rating Social Proof */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-[#eab308]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#eab308] text-[#eab308]" />
                ))}
              </div>
              <div className="text-sm text-[#dedad2] font-medium flex items-center gap-2">
                <span className="font-bold text-white text-base">{rating.toFixed(1)} Rating</span>
                <span className="text-[#59565f]" aria-hidden="true">·</span>
                <span className="text-[#b3aea3]">{reviewCount}+ Verified Reviews on Justdial &amp; Google</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onBookClick}
                className="px-7 py-3.5 bg-gradient-to-r from-[#b28f38] via-[#c5a85c] to-[#d8c388] text-[#0c0b09] font-bold text-sm sm:text-base rounded-lg shadow-xl shadow-[#b28f38]/25 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Your Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 bg-[#171620]/80 hover:bg-[#1f1e29] border border-[#323142] hover:border-[#4d4a5e] text-[#f0ebe1] text-sm sm:text-base font-medium rounded-lg backdrop-blur-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Service Menu</span>
              </button>
            </div>

            {/* Verified feature badges */}
            <div className="pt-6 border-t border-[#262432] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-[#a6a197]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c5a85c] shrink-0" />
                <span>Certified Master Stylists</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a85c] shrink-0" />
                <span>O3+ Dermatological Care</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#c5a85c] shrink-0" />
                <span>Open 7 Days: 10 AM – 9 PM</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer luxury border card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#333140] bg-[#121118]/85 backdrop-blur-md p-2.5 shadow-2xl">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#181720]">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                    alt="Siya Galaxy Salon Hair Styling Stations and Haircutting Craft"
                    className="w-full h-full object-cover brightness-95 contrast-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b11] via-transparent to-transparent opacity-85" />

                  {/* Floating Salon Info Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0f0e15]/95 backdrop-blur-md border border-[#2e2c3b] text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs uppercase tracking-wider text-[#c5a85c] font-semibold">
                        Laxmi Nagar, Delhi
                      </span>
                      <span className="text-[11px] text-[#938e85]">Metro Pillar 33</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#f5f3ef]">Siya Galaxy Unisex Salon</h3>
                    <p className="text-xs text-[#a6a197] mt-1 leading-relaxed">
                      Immaculate, spacious air-conditioned salon with private styling chairs, specialized hair wash stations, and bridal green room.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating review highlight */}
              <div className="hidden sm:block absolute -top-4 -left-6 bg-[#16151e]/95 backdrop-blur-md border border-[#353344] p-3.5 rounded-xl shadow-xl max-w-xs text-left">
                <div className="flex items-center gap-1 text-[#eab308] mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#eab308] text-[#eab308]" />
                  ))}
                  <span className="text-xs text-[#dedad2] font-semibold ml-1">5.0 Star</span>
                </div>
                <p className="text-xs text-[#aba59b] italic">
                  &ldquo;Spotless, polite staff, and best value for hair straightening, haircuts &amp; facials in Laxmi Nagar.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
