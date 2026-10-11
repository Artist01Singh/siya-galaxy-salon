import React from 'react';
import { Sparkles, Scissors, ShieldCheck, HeartHandshake, ArrowRight, Star } from 'lucide-react';

interface HomeHighlightsProps {
  onBookClick: () => void;
  onExploreServices: () => void;
}

export const HomeHighlights: React.FC<HomeHighlightsProps> = ({ onBookClick, onExploreServices }) => {
  const craftPortfolio = [
    {
      title: 'Nanoplastia & Glass Hair',
      category: 'Organic Smoothing',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      description: 'Formaldehyde-free intensive restructuring delivering silky mirror gloss and zero-frizz manageability.',
    },
    {
      title: 'Artisanal Balayage & Ombre',
      category: 'Color Chemistry',
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
      description: 'Custom hand-painted dimensions crafted with bond-protecting plex, tailored to Indian skin undertones.',
    },
    {
      title: 'Precision Cuts & Styling',
      category: 'Haute Coiffure',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
      description: 'Face-sculpting textured cuts, layered bobs, and volume blowouts designed by certified master cutters.',
    },
    {
      title: 'HD & Airbrush Bridal Glamour',
      category: 'Bridal Artistry',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      description: 'Flawless 18-hour waterproof camera-ready complexion, jewelry setting, and customized hair ornamentation.',
    },
  ];

  const experiencePillars = [
    {
      icon: Scissors,
      title: 'Master Haircraft & Cuts',
      desc: 'Personalized face-contour analysis before every cut and chemical service.',
    },
    {
      icon: ShieldCheck,
      title: 'Clinical Sterilization',
      desc: 'Single-use sealed salon kits, medical-grade sanitization, and spotless work stations.',
    },
    {
      icon: Sparkles,
      title: '100% Genuine Brands',
      desc: 'We strictly apply authentic O3+ dermatological products, Italian Rica wax, and keratin.',
    },
    {
      icon: HeartHandshake,
      title: 'Honest, Transparent Rates',
      desc: 'Zero surprise add-ons. High-end salon experience praised for unmatched value in 119+ reviews.',
    },
  ];

  return (
    <section className="py-20 bg-[#09080c] border-b border-[#1c1b22] relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(197,168,92,0.08)_0%,_rgba(9,8,12,0)_70%)] blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Lead */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#c5a85c] font-semibold mb-2">
            <span>The Siya Galaxy Experience</span>
            <span aria-hidden="true">·</span>
            <span>Laxmi Nagar, Delhi</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f5f3ef] font-normal leading-tight">
            Where Modern Hair Artistry <br className="hidden sm:inline" />
            Meets Timeless Luxury.
          </h2>
          <p className="text-sm sm:text-base text-[#9e9a91] mt-3 font-light leading-relaxed">
            From everyday precision haircuts and detoxifying scalp rituals to bridal makeovers and organic
            hair smoothing, discover why Siya Galaxy Salon holds an authentic 5.0-star rating across East Delhi.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {experiencePillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-[#121117] border border-[#23222e] hover:border-[#3d3a4c] transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1e1b15] border border-[#c5a85c]/40 flex items-center justify-center text-[#c5a85c] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#f5f3ef] mb-2">{p.title}</h3>
                  <p className="text-xs text-[#918d99] leading-relaxed font-light">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Signature Craft Showcase Grid */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-left">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c5a85c] font-semibold block mb-1">
                Portfolio Showcase
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f5f3ef] font-normal">
                Signature Transformations
              </h3>
            </div>
            <button
              onClick={onExploreServices}
              className="text-xs font-semibold text-[#c5a85c] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All 22 Treatments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {craftPortfolio.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl bg-[#121117] border border-[#23222e] hover:border-[#423f53] overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181720]">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121117] via-transparent to-transparent opacity-85" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#0b0a0f]/85 backdrop-blur-md text-[10px] uppercase tracking-wider font-semibold text-[#d6c292] border border-[#2b2a37]">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 text-left">
                  <h4 className="font-serif text-base font-semibold text-[#f5f3ef] group-hover:text-[#c5a85c] transition-colors mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#938f9b] leading-relaxed line-clamp-2 font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reservation Callout Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#171622] via-[#1b1926] to-[#171622] border border-[#333144] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs text-[#c5a85c] font-semibold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-[#c5a85c]" />
              <span>Real-Time Seat Booking Available</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#f5f3ef] font-normal leading-tight">
              Ready for Your Transformation?
            </h3>
            <p className="text-xs sm:text-sm text-[#a8a39a] font-light leading-relaxed">
              Skip waiting in line. Choose your preferred stylist and date, and reserve your chair in seconds.
              Open 7 days a week from 10:00 AM to 9:00 PM at Metro Pillar 33, Laxmi Nagar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onBookClick}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#b28f38] via-[#c5a85c] to-[#d8c388] text-[#0c0b09] font-bold text-xs sm:text-sm rounded-lg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Appointment Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
