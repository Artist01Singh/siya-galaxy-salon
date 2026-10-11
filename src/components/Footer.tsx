import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, Shield, KeyRound, UserCheck } from 'lucide-react';
import { SalonSettings } from '../types';

interface FooterProps {
  settings: SalonSettings | null;
  onBookClick: () => void;
  onManageClick: () => void;
  onAdminClick: () => void;
  isAdminRegistered?: boolean;
  isAdminLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onBookClick,
  onManageClick,
  onAdminClick,
  isAdminRegistered,
  isAdminLoggedIn,
}) => {
  const phone = settings?.phone || '+91 72176 44360';
  const cleanPhone = phone.replace(/\D/g, '');
  const googleMapsUrl = settings?.googleMapsUrl || 'https://maps.app.goo.gl/L2Wpk8mx8ki1924a6';

  return (
    <footer className="bg-[#09080c] border-t border-[#1c1b22] text-[#8e8a93] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-widest text-[#f5f3ef] font-semibold">
                SIYA GALAXY
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#c5a85c] uppercase font-sans">
                Luxury Salon · Laxmi Nagar Delhi
              </span>
            </div>

            <p className="text-xs text-[#9d988f] leading-relaxed max-w-sm font-light">
              East Delhi&apos;s premier destination for bespoke hair transformations, certified Nanoplastia,
              collagen Botoplex, dermatological facials, and high-definition bridal artistry since April 2023.
            </p>

            <div className="pt-2 text-xs text-[#ded9ce] flex items-center gap-2">
              <span className="text-[#eab308]">★★★★★</span>
              <span>5.0 Star Rating (119+ Verified Client Reviews)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-semibold text-[#f5f3ef] uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-[#c5a85c] transition-colors">
                  Home Experience
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#c5a85c] transition-colors">
                  Signature Services &amp; Pricing
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#c5a85c] transition-colors">
                  Our Salon Heritage
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#c5a85c] transition-colors">
                  Client Reviews &amp; Testimonials
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#c5a85c] transition-colors">
                  Location &amp; Operating Hours
                </a>
              </li>
              <li>
                <button
                  onClick={onManageClick}
                  className="hover:text-[#c5a85c] transition-colors cursor-pointer text-left"
                >
                  Track / Reschedule Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Directions */}
          <div className="lg:col-span-4 space-y-3 text-left">
            <h4 className="text-xs font-semibold text-[#f5f3ef] uppercase tracking-wider">
              Salon Location &amp; Contact
            </h4>

            <div className="space-y-2.5 text-[#9e9a92]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c5a85c] shrink-0 mt-0.5" />
                <span>Near Metro Pillar No. 33, Vikas Marg, Laxmi Nagar, New Delhi 110092</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c5a85c] shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#c5a85c] shrink-0" />
                <span>Monday – Sunday: 10:00 AM – 9:00 PM</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#c5a85c] hover:underline"
              >
                <span>Google Maps Listing</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <span className="text-[#3a3942]" aria-hidden="true">·</span>

              <button
                onClick={onBookClick}
                className="text-xs text-[#f5f3ef] hover:text-[#c5a85c] font-medium cursor-pointer"
              >
                Book Online
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Admin Portal Link Bar in Footer */}
        <div className="mt-12 pt-6 border-t border-[#181720] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6b6772]">
          <div>
            © {new Date().getFullYear()} Siya Galaxy Salon. All verified business rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>Metro Pillar 33, Laxmi Nagar, Delhi</span>
            <span aria-hidden="true">·</span>

            {/* Exclusive Admin Signup / Login link */}
            <button
              onClick={onAdminClick}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                isAdminLoggedIn
                  ? 'bg-[#191822] border-[#c5a85c] text-[#d6c292]'
                  : !isAdminRegistered
                  ? 'bg-[#1f1a12] border-[#c5a85c]/80 text-[#e6cc87] hover:bg-[#2b2315] hover:border-[#c5a85c]'
                  : 'bg-[#14131a] border-[#292834] text-[#a39f97] hover:text-[#f5f3ef] hover:border-[#3d3b4b]'
              }`}
            >
              {isAdminLoggedIn ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[#4ade80]" />
                  <span>Admin Dashboard</span>
                </>
              ) : !isAdminRegistered ? (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-[#c5a85c] animate-pulse" />
                  <span>Admin Sign Up (1 Slot Open)</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-[#c5a85c]" />
                  <span>Admin Login</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
