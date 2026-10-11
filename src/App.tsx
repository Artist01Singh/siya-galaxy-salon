import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HomeHighlights } from './components/HomeHighlights';
import { BookingEngine } from './components/BookingEngine';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactLocationSection } from './components/ContactLocationSection';
import { Footer } from './components/Footer';
import { ManageBookingModal } from './components/ManageBookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { fetchSalonInfo, fetchServices, getAdminToken, adminGetSetupStatus } from './services/api';
import { SalonSettings, CustomerReview, Service } from './types';

export default function App() {
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [manageModalOpen, setManageModalOpen] = useState<boolean>(false);
  const [manageRef, setManageRef] = useState<string>('');
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(Boolean(getAdminToken()));
  const [isAdminRegistered, setIsAdminRegistered] = useState<boolean>(false);

  // Pre-selected service for BookingEngine
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [salonRes, servicesRes, setupStatus] = await Promise.all([
        fetchSalonInfo(),
        fetchServices(),
        adminGetSetupStatus().catch(() => ({ isRegistered: false })),
      ]);
      setSettings(salonRes.settings);
      setReviews(salonRes.reviews);
      setServices(servicesRes);
      setIsAdminRegistered(setupStatus.isRegistered);
    } catch (err) {
      console.error('Failed to load salon data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollToBooking = () => {
    const el = document.getElementById('book-appointment');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectServiceFromCatalog = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollToBooking();
  };

  const handleOpenManageModal = (reference?: string) => {
    if (reference) {
      setManageRef(reference);
    }
    setManageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#ece8e1] flex flex-col font-sans selection:bg-[#c5a85c]/30 selection:text-white">
      {/* Top Navbar - Clean customer experience without admin links per user instructions */}
      <Navbar
        settings={settings}
        onBookClick={scrollToBooking}
        onManageClick={() => handleOpenManageModal()}
      />

      <main className="flex-1">
        {/* Hero Section with Premium Haircutting Background */}
        <Hero
          settings={settings}
          onBookClick={scrollToBooking}
          onExploreServices={() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Home Experience Highlights, Salon Pillars & Craft Portfolio */}
        <HomeHighlights
          onBookClick={scrollToBooking}
          onExploreServices={() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Real-time Interactive Booking Engine */}
        <BookingEngine
          services={services}
          initialSelectedServiceId={selectedServiceId}
          onOpenManageBooking={handleOpenManageModal}
        />

        {/* Comprehensive Services Catalog with Visual Images */}
        <ServicesSection
          services={services}
          onSelectService={handleSelectServiceFromCatalog}
        />

        {/* Authentic Salon Story & Hygiene Standards */}
        <AboutSection />

        {/* Verified Customer Reviews */}
        <ReviewsSection reviews={reviews} />

        {/* Location & Operating Hours */}
        <ContactLocationSection
          settings={settings}
          onBookClick={scrollToBooking}
        />
      </main>

      {/* Footer with Exclusive Admin Sign-Up / Login Link */}
      <Footer
        settings={settings}
        onBookClick={scrollToBooking}
        onManageClick={() => handleOpenManageModal()}
        onAdminClick={() => setAdminModalOpen(true)}
        isAdminRegistered={isAdminRegistered}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Customer Manage / Reschedule Modal */}
      <ManageBookingModal
        isOpen={manageModalOpen}
        onClose={() => setManageModalOpen(false)}
        initialReference={manageRef}
      />

      {/* Secure Admin Dashboard Modal (with Single Slot Registration Lock) */}
      <AdminDashboard
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onDataChanged={loadData}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        onSetupStatusChanged={(reg) => setIsAdminRegistered(reg)}
      />
    </div>
  );
}
