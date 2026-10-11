import React, { useState } from 'react';
import { Phone, Calendar, Clock, MapPin, Menu, X, Search } from 'lucide-react';
import { SalonSettings } from '../types';

interface NavbarProps {
  settings: SalonSettings | null;
  onBookClick: () => void;
  onManageClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onBookClick,
  onManageClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = settings?.phone || '+91 72176 44360';

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Location & Hours', href: '#location' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0b0ed9] backdrop-blur-md border-b border-[#222126]">
      {/* Top micro banner */}
      <div className="bg-[#141318] border-b border-[#1f1e24] px-4 py-1.5 text-xs text-[#a39f97] hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c5a85c]" />
              Near Metro Pillar 33, Vikas Marg, Laxmi Nagar, Delhi
            </span>
            <span aria-hidden="true" className="text-[#36343b]">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c5a85c]" />
              Open 7 Days: 10:00 AM – 9:00 PM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-[#d6c292] hover:text-[#f4efe6] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#c5a85c]" />
              {phone}
            </a>
            <span aria-hidden="true" className="text-[#36343b]">·</span>
            <button
              onClick={onManageClick}
              className="text-[#b8b3a8] hover:text-[#f4efe6] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-3 h-3 text-[#c5a85c]" />
              Track Booking
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="#" className="flex flex-col group">
            <span className="font-serif text-2xl sm:text-3xl tracking-widest text-[#f5f3ef] group-hover:text-[#c5a85c] transition-colors font-semibold">
              SIYA GALAXY
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#a39f97] uppercase font-sans">
              Salon · Hair · Beauty · Bridal
            </span>
          </a>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#c8c4bb] hover:text-[#f5f3ef] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c5a85c] after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onManageClick}
              className="text-sm font-medium text-[#c8c4bb] hover:text-[#f5f3ef] transition-colors cursor-pointer"
            >
              My Booking
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onBookClick}
              className="px-5 py-2.5 bg-gradient-to-r from-[#b28f38] via-[#c5a85c] to-[#d8c388] text-[#0c0b09] text-sm font-semibold rounded-lg shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#0c0b09]" />
              Book Appointment
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onBookClick}
              className="px-3.5 py-2 bg-gradient-to-r from-[#b28f38] to-[#c5a85c] text-[#0c0b09] text-xs font-semibold rounded-lg shadow-sm"
            >
              Book Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#c8c4bb] hover:text-[#f5f3ef] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111016] border-b border-[#25242c] px-4 pt-2 pb-6 space-y-3">
          <div className="pt-2 pb-1 border-b border-[#201f26] text-xs text-[#a39f97] flex flex-col gap-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c5a85c]" />
              Near Metro Pillar 33, Laxmi Nagar
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c5a85c]" />
              Open Daily: 10:00 AM – 9:00 PM
            </span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-[#dcd8cf] hover:text-[#c5a85c] rounded-md hover:bg-[#1a1921] transition-colors"
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onManageClick();
            }}
            className="w-full text-left px-3 py-2 text-base font-medium text-[#dcd8cf] hover:text-[#c5a85c] rounded-md hover:bg-[#1a1921] transition-colors flex items-center justify-between"
          >
            <span>Track or Reschedule Booking</span>
            <Search className="w-4 h-4 text-[#c5a85c]" />
          </button>

          <div className="pt-3 border-t border-[#201f26]">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="w-full py-2.5 px-3 bg-[#191820] border border-[#2b2a34] text-xs text-[#d6c292] rounded-lg text-center flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#c5a85c]" />
              Call Salon (+91 72176 44360)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
