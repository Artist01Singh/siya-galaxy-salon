import React from 'react';
import { Sparkles, Award, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#0c0b0f] border-b border-[#1c1b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#2b2a36] bg-[#14131a] p-2">
              <img
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80"
                alt="Siya Galaxy Salon Hair Styling Stations"
                className="rounded-xl w-full aspect-[4/5] object-cover brightness-95"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0f] via-transparent to-transparent opacity-70" />

              {/* Verified badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#111016]/90 backdrop-blur-md border border-[#2d2c38]">
                <div className="flex items-center gap-2 text-[#c5a85c] text-xs font-semibold uppercase tracking-wider mb-1">
                  <Award className="w-4 h-4" />
                  Established April 2023
                </div>
                <div className="text-sm font-serif text-[#f5f3ef]">
                  Over 119+ Five-Star Client Testimonials in Laxmi Nagar
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Principles */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#c5a85c] font-semibold">
              The Siya Galaxy Standard
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f5f3ef] font-normal leading-tight">
              A Sanctuary of Beauty &amp; Precision in East Delhi.
            </h2>

            <p className="text-sm sm:text-base text-[#9e9a91] leading-relaxed font-light">
              Founded in April 2023 near Metro Pillar No. 33 in Laxmi Nagar, Siya Galaxy Salon was created with
              a single purpose: to offer world-class hair treatments, bridal transformations, and restorative skincare
              rituals in an immaculate, spacious setting at honest and transparent pricing.
            </p>

            <p className="text-sm sm:text-base text-[#9e9a91] leading-relaxed font-light">
              Whether you are preparing for your wedding day with high-definition bridal artistry, restoring damaged tresses
              with Brazilian Nanoplastia and collagen Botoplex, or indulging in an ultrasonic Hydra facial, our certified
              team takes the time to listen, analyze, and craft a bespoke result tailored to you.
            </p>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#131219] border border-[#23222e]">
                <div className="flex items-center gap-2 mb-2 text-[#c5a85c]">
                  <ShieldCheck className="w-4 h-4" />
                  <h3 className="text-sm font-semibold text-[#f5f3ef]">Uncompromising Hygiene</h3>
                </div>
                <p className="text-xs text-[#8e8a93] leading-relaxed">
                  Individual sanitized disposable kits, autoclaved instruments, and spotless salon stations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#131219] border border-[#23222e]">
                <div className="flex items-center gap-2 mb-2 text-[#c5a85c]">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-sm font-semibold text-[#f5f3ef]">Genuine Products Only</h3>
                </div>
                <p className="text-xs text-[#8e8a93] leading-relaxed">
                  We use certified O3+ dermatological formulas, Italian Rica liposoluble wax, and organic keratin.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#131219] border border-[#23222e]">
                <div className="flex items-center gap-2 mb-2 text-[#c5a85c]">
                  <HeartHandshake className="w-4 h-4" />
                  <h3 className="text-sm font-semibold text-[#f5f3ef]">Attentive &amp; Polite Staff</h3>
                </div>
                <p className="text-xs text-[#8e8a93] leading-relaxed">
                  Our team never rushes appointments and provides thorough consultations before starting any treatment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#131219] border border-[#23222e]">
                <div className="flex items-center gap-2 mb-2 text-[#c5a85c]">
                  <CheckCircle className="w-4 h-4" />
                  <h3 className="text-sm font-semibold text-[#f5f3ef]">Transparent Value</h3>
                </div>
                <p className="text-xs text-[#8e8a93] leading-relaxed">
                  Zero hidden consultation fees. Luxury salon care priced fairly for everyday indulgence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
