import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, Navigation, CheckCircle } from 'lucide-react';
import { SalonSettings } from '../types';

interface ContactLocationSectionProps {
  settings: SalonSettings | null;
  onBookClick: () => void;
}

export const ContactLocationSection: React.FC<ContactLocationSectionProps> = ({ settings, onBookClick }) => {
  const phone = settings?.phone || '+91 72176 44360';
  const cleanPhone = phone.replace(/\D/g, '');
  const googleMapsUrl = settings?.googleMapsUrl || 'https://maps.app.goo.gl/L2Wpk8mx8ki1924a6';

  const daysSchedule = [
    { day: 'Monday', hours: '10:00 AM – 9:00 PM' },
    { day: 'Tuesday', hours: '10:00 AM – 9:00 PM' },
    { day: 'Wednesday', hours: '10:00 AM – 9:00 PM' },
    { day: 'Thursday', hours: '10:00 AM – 9:00 PM' },
    { day: 'Friday', hours: '10:00 AM – 9:00 PM' },
    { day: 'Saturday', hours: '10:00 AM – 9:00 PM' },
    { day: 'Sunday', hours: '10:00 AM – 9:00 PM' },
  ];

  return (
    <section id="location" className="py-20 bg-[#0d0c11] border-b border-[#1c1b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-[#c5a85c] font-semibold mb-2">
            Visit Our Salon
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f5f3ef] font-normal">
            Location &amp; Operating Hours
          </h2>
          <p className="text-sm text-[#9e9a91] mt-3">
            Conveniently situated right along Vikas Marg, steps from Laxmi Nagar Metro Station at Pillar No. 33.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & Opening Hours Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-[#131219] border border-[#23222e] text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#1e1b15] border border-[#c5a85c]/40 flex items-center justify-center text-[#c5a85c]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#f5f3ef]">Salon Address</h3>
                  <span className="text-xs text-[#c5a85c]">Metro Pillar No. 33</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#cac5bb] leading-relaxed">
                Near Metro Pillar No. 33, Vikas Marg, Laxmi Nagar, New Delhi, Delhi 110092
              </p>
              <p className="text-xs text-[#7e7a85] mt-1">
                Landmark: Right next to Laxmi Nagar Metro Station (Blue Line)
              </p>

              <div className="mt-4 pt-4 border-t border-[#1f1e29] flex flex-wrap gap-3">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#c5a85c] hover:bg-[#d8c388] text-[#0c0b09] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Driving Directions</span>
                </a>

                <a
                  href={`tel:${cleanPhone}`}
                  className="px-4 py-2 bg-[#1b1a23] hover:bg-[#252431] border border-[#2b2a36] text-xs text-[#dcd7cd] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c5a85c]" />
                  <span>{phone}</span>
                </a>
              </div>
            </div>

            {/* Hours Card */}
            <div className="p-6 rounded-2xl bg-[#131219] border border-[#23222e] text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#1e1b15] border border-[#c5a85c]/40 flex items-center justify-center text-[#c5a85c]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#f5f3ef]">Business Hours</h3>
                  <span className="text-xs text-[#8c8893]">Open 7 Days a Week</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {daysSchedule.map((item) => (
                  <div key={item.day} className="flex items-center justify-between py-1 border-b border-[#1c1b25] last:border-0">
                    <span className="text-[#a49f96] font-medium">{item.day}</span>
                    <span className="text-[#f5f3ef] font-semibold">{item.hours}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#1f1e29] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#4ade80]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Open today 10:00 AM – 9:00 PM</span>
                </div>
                <button
                  onClick={onBookClick}
                  className="text-xs font-semibold text-[#c5a85c] hover:underline cursor-pointer"
                >
                  Book Slot Now →
                </button>
              </div>
            </div>
          </div>

          {/* Right: Map Showcase Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#131219] border border-[#23222e] overflow-hidden p-3 shadow-xl">
              {/* Visual Map Container */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#181720]">
                {/* Simulated Google Maps View with Dark Luxury Skin */}
                <div className="absolute inset-0 bg-[#16151e] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#1e1b15] border-2 border-[#c5a85c] flex items-center justify-center text-[#c5a85c] shadow-xl mb-4 animate-bounce">
                    <MapPin className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a85c]">
                    Siya Galaxy Salon
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#f5f3ef] font-semibold mt-1">
                    Vikas Marg, Laxmi Nagar
                  </h3>
                  <p className="text-xs text-[#9d988f] max-w-sm mt-1 mb-4">
                    Directly opposite Metro Pillar 33. Easy parking and convenient metro transit access.
                  </p>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-[#c5a85c] hover:bg-[#d8c388] text-[#0c0b09] text-xs font-bold rounded-lg shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Open in Google Maps App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Metro landmark chip */}
                <div className="absolute top-4 left-4 bg-[#0e0d13]/90 backdrop-blur-md border border-[#2b2a36] px-3 py-1.5 rounded-lg text-[11px] text-[#eae6dd] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Delhi Metro Blue Line: Laxmi Nagar Station</span>
                </div>
              </div>

              {/* Bottom Quick Help Info */}
              <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#8c8893]">
                <div>
                  <span className="text-[#e2ded5] font-medium block">Need immediate salon directions or assistance?</span>
                  <span>Our reception team is ready to assist you by phone or WhatsApp.</span>
                </div>

                <a
                  href={`https://wa.me/91${cleanPhone}?text=Hello%20Siya%20Galaxy%20Salon,%20I%20need%20directions%20to%20your%20salon`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-semibold rounded-lg transition-colors shrink-0"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
