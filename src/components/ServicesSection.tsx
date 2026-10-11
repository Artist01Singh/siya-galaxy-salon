import React, { useState } from 'react';
import { Clock, Scissors, Sparkles, Heart, Flame, Shield, ArrowUpRight } from 'lucide-react';
import { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Complete Menu', icon: Scissors },
    { id: 'hair', label: 'Hair Care & Smoothing', icon: Flame },
    { id: 'skin', label: 'Facial & Glow Rituals', icon: Sparkles },
    { id: 'bridal', label: 'Bridal & Party Makeovers', icon: Heart },
    { id: 'nails', label: 'Nails & Pedicures', icon: Sparkles },
    { id: 'grooming', label: 'Threading & Grooming', icon: Shield },
  ];

  const filteredServices = services.filter((s) => {
    if (!s.isActive) return false;
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <section id="services" className="py-20 bg-[#0a0a0d] border-b border-[#1c1b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-widest text-[#c5a85c] font-semibold mb-2">
            Signature Salon Menu
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f5f3ef] font-normal">
            Refined Treatments &amp; Rituals
          </h2>
          <p className="text-sm text-[#9e9a91] mt-3">
            Every service at Siya Galaxy Salon is carried out with hospital-grade sanitization, genuine international products, and master stylists.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#c5a85c] text-[#0c0b09] shadow-md font-semibold'
                    : 'bg-[#14131a] text-[#a8a49c] border border-[#23222d] hover:bg-[#1b1a23] hover:text-[#f5f3ef]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0c0b09]' : 'text-[#c5a85c]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Services Grid with Visual Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const fallbackImg = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
            const imgUrl = service.imageUrl || fallbackImg;

            return (
              <div
                key={service.id}
                className="group rounded-2xl bg-[#121117] border border-[#23222d] hover:border-[#423f50] overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/50"
              >
                <div>
                  {/* Service Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181720]">
                    <img
                      src={imgUrl}
                      alt={service.name}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== fallbackImg) {
                          target.src = fallbackImg;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121117] via-transparent to-transparent opacity-90" />

                    {/* Category & Tag Overlays */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-[#0e0d14]/85 backdrop-blur-md text-[10px] uppercase tracking-wider font-semibold text-[#d4cfc3] border border-[#2b2a36]">
                        {service.category}
                      </span>
                      {service.popular && (
                        <span className="px-2.5 py-1 rounded-md bg-[#c5a85c] text-[#0c0b09] text-[10px] uppercase tracking-wider font-bold shadow-sm">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-[#0e0d14]/85 backdrop-blur-md border border-[#2b2a36] text-[11px] text-[#dedad2] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#c5a85c]" />
                      <span>{service.durationMinutes} mins</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    {/* Header: Name and Price */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-serif text-lg font-semibold text-[#f5f3ef] group-hover:text-[#c5a85c] transition-colors leading-snug">
                        {service.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-sans text-base font-bold text-[#c5a85c]">
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#9d988f] leading-relaxed line-clamp-3 mt-2">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-[#1d1c25] flex items-center justify-between">
                    <span className="text-[11px] text-[#716e78]">Pay at salon</span>
                    <button
                      onClick={() => onSelectService(service.id)}
                      className="px-4 py-2 bg-[#1b1a23] group-hover:bg-[#c5a85c] group-hover:text-[#0c0b09] border border-[#2c2b37] group-hover:border-[#c5a85c] text-xs font-semibold text-[#d8d4ca] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Book Treatment</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
