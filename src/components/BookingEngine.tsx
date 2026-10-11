import React, { useState, useEffect, useId } from 'react';
import { Calendar, Clock, Check, ChevronRight, ChevronLeft, MapPin, AlertCircle, Sparkles, User, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Service, TimeSlot } from '../types';
import { fetchSlots, createBooking } from '../services/api';

interface BookingEngineProps {
  services: Service[];
  initialSelectedServiceId?: string | null;
  onBookingSuccess?: (reference: string) => void;
  onOpenManageBooking?: (reference?: string) => void;
}

export const BookingEngine: React.FC<BookingEngineProps> = ({
  services,
  initialSelectedServiceId,
  onBookingSuccess,
  onOpenManageBooking,
}) => {
  const serviceSearchId = useId();
  const customerNameId = useId();
  const customerPhoneId = useId();
  const customerEmailId = useId();
  const customerNotesId = useId();

  // Booking step: 1 = Service, 2 = Date & Slot, 3 = Customer Info, 4 = Confirmed
  const [step, setStep] = useState<number>(1);

  // Selected state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Date selection (default today in local date format YYYY-MM-DD)
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Slots state
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [dayClosedReason, setDayClosedReason] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  // Customer state
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Handle external pre-selection (e.g. from service cards)
  useEffect(() => {
    if (initialSelectedServiceId && services.length > 0) {
      const match = services.find((s) => s.id === initialSelectedServiceId);
      if (match) {
        setSelectedService(match);
        setStep(2);
      }
    }
  }, [initialSelectedServiceId, services]);

  // Fetch slots whenever selectedDate or selectedService changes
  useEffect(() => {
    if (!selectedDate || !selectedService) return;

    let isMounted = true;
    setSlotsLoading(true);
    setSlotsError(null);
    setDayClosedReason(null);
    setSelectedSlot(null);

    fetchSlots(selectedDate, selectedService.id)
      .then((res) => {
        if (!isMounted) return;
        if (!res.isOpen) {
          setDayClosedReason(res.reason || 'Salon is closed on this date.');
          setSlots([]);
        } else {
          setSlots(res.slots || []);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setSlotsError(err.message || 'Failed to check available time slots');
      })
      .finally(() => {
        if (isMounted) setSlotsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedService]);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'hair', label: 'Hair Care & Treatments' },
    { id: 'skin', label: 'Skin & Facial Rituals' },
    { id: 'bridal', label: 'Bridal & Makeovers' },
    { id: 'nails', label: 'Nails & Aesthetics' },
    { id: 'grooming', label: 'Grooming & Waxing' },
  ];

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Generate next 14 calendar dates
  const availableDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    return { dateStr, dayName, dayNumber, monthName, isToday: i === 0 };
  });

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
  };

  const handleProceedToDetails = () => {
    if (!selectedSlot) return;
    setStep(3);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedSlot) return;

    if (!customerName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setSubmitError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await createBooking({
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedSlot,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerPhone: customerPhone.trim(),
        notes: customerNotes.trim() || undefined,
      });

      setConfirmedBooking(res.booking);
      setStep(4);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a85c', '#d8c388', '#ffffff', '#eab308'],
      });

      if (onBookingSuccess) {
        onBookingSuccess(res.booking.reference);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to reserve appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetBookingForm = () => {
    setSelectedService(null);
    setSelectedSlot(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerNotes('');
    setConfirmedBooking(null);
    setStep(1);
  };

  // Group slots by time of day
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 17;
  });

  return (
    <section id="book-appointment" className="py-16 sm:py-24 bg-[#0d0c11] border-b border-[#1c1b22]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-widest text-[#c5a85c] font-semibold mb-2">
            Real-Time Slot Reservation
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f5f3ef] font-normal">
            Book Your Appointment
          </h2>
          <p className="text-sm text-[#9e9a91] mt-2">
            Select your preferred treatment, date, and time. Slots update automatically with real-time salon capacity.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto px-2">
            {[
              { num: 1, title: 'Service' },
              { num: 2, title: 'Date & Time' },
              { num: 3, title: 'Your Details' },
              { num: 4, title: 'Confirmed' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    step === s.num
                      ? 'bg-[#c5a85c] text-[#0c0b09]'
                      : step > s.num
                      ? 'bg-[#25232d] text-[#c5a85c] border border-[#3e3b4a]'
                      : 'bg-[#15141a] text-[#5e5a66] border border-[#23222a]'
                  }`}
                >
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span
                  className={`text-xs hidden sm:inline ${
                    step >= s.num ? 'text-[#e0dcd3] font-medium' : 'text-[#5e5a66]'
                  }`}
                >
                  {s.title}
                </span>
                {s.num < 4 && <div className="hidden sm:block w-8 sm:w-12 h-[1px] bg-[#22212a] mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Booking Container */}
        <div className="bg-[#121117] border border-[#23222c] rounded-2xl p-4 sm:p-8 shadow-xl">
          {/* ================= STEP 1: SELECT SERVICE ================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f1e28]">
                <div>
                  <h3 className="text-lg font-serif text-[#f5f3ef]">1. Select Your Salon Service</h3>
                  <p className="text-xs text-[#9c978f] mt-0.5">
                    Choose from authentic treatments. Pricing &amp; duration are clearly stated.
                  </p>
                </div>

                {/* Search input */}
                <div className="relative w-full sm:w-64">
                  <label htmlFor={serviceSearchId} className="sr-only">Search services</label>
                  <input
                    id={serviceSearchId}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search treatment or hair care..."
                    className="w-full bg-[#18171f] border border-[#2b2a36] rounded-lg px-3 py-2 text-xs text-[#eae6dd] placeholder-[#6d6a74] focus:outline-none focus:border-[#c5a85c]"
                  />
                </div>
              </div>

              {/* Category Segmented Tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-[#17161e] rounded-xl border border-[#24232e]">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#c5a85c] text-[#0c0b09] shadow-sm font-semibold'
                        : 'text-[#9c978f] hover:text-[#f5f3ef] hover:bg-[#1f1e29]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredServices.length === 0 ? (
                  <div className="col-span-2 py-12 text-center text-sm text-[#7a7682]">
                    No services found matching your search.
                  </div>
                ) : (
                  filteredServices.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    const imgUrl = service.imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80';

                    return (
                      <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex gap-3.5 ${
                          isSelected
                            ? 'bg-[#1e1b15] border-[#c5a85c] shadow-md'
                            : 'bg-[#15141b] border-[#25242f] hover:border-[#3d3b49] hover:bg-[#191822]'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#1e1c25]">
                          <img
                            src={imgUrl}
                            alt={service.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-xs sm:text-sm font-semibold text-[#f5f3ef] leading-snug truncate">
                                {service.name}
                              </h4>
                              <span className="text-xs sm:text-sm font-semibold text-[#c5a85c] shrink-0 font-sans">
                                ₹{service.price.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#9c978f] line-clamp-2 leading-relaxed">
                              {service.description}
                            </p>
                          </div>

                          <div className="mt-2 pt-2 border-t border-[#1f1e28] flex items-center justify-between text-[11px] text-[#7d7986]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#c5a85c]" />
                              {service.durationMinutes} mins
                            </span>
                            <span className="text-[#c5a85c] font-medium flex items-center gap-0.5">
                              Select
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 2: DATE & TIME SELECTION ================= */}
          {step === 2 && selectedService && (
            <div className="space-y-6">
              {/* Top summary of chosen service */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1f1e28]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="p-1.5 rounded-lg bg-[#18171f] hover:bg-[#201f2a] border border-[#292834] text-[#a39f97] hover:text-white transition-colors cursor-pointer"
                    title="Change Service"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#f5f3ef]">
                      {selectedService.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#9c978f]">
                      <span>{selectedService.durationMinutes} minutes</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#c5a85c] font-semibold">₹{selectedService.price}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#c5a85c] hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Date Selection Strip */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#9c978f] font-semibold">
                    Select Appointment Date
                  </label>
                  <span className="text-xs text-[#6e6a76]">Open 7 Days a week</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        onClick={() => setSelectedDate(item.dateStr)}
                        className={`flex flex-col items-center justify-center min-w-[70px] py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#c5a85c] text-[#0c0b09] border-[#c5a85c] font-semibold shadow-md'
                            : 'bg-[#15141b] border-[#25242f] text-[#c4c0b6] hover:bg-[#1a1922] hover:border-[#383644]'
                        }`}
                      >
                        <span className={`text-[10px] uppercase ${isSelected ? 'text-[#2b2513]' : 'text-[#7e7a85]'}`}>
                          {item.dayName}
                        </span>
                        <span className="text-lg font-bold my-0.5">{item.dayNumber}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-[#2b2513]' : 'text-[#7e7a85]'}`}>
                          {item.monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot Availability Grid */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#9c978f] font-semibold">
                    Available Time Slots ({selectedDate})
                  </span>
                  {selectedSlot && (
                    <span className="text-xs text-[#c5a85c] font-medium">
                      Selected: {selectedSlot}
                    </span>
                  )}
                </div>

                {slotsLoading ? (
                  <div className="py-12 text-center text-sm text-[#9c978f] flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#c5a85c] border-t-transparent rounded-full animate-spin" />
                    <span>Checking live chair availability...</span>
                  </div>
                ) : dayClosedReason ? (
                  <div className="p-6 bg-[#1a1518] border border-[#3f2129] rounded-xl text-center space-y-2">
                    <AlertCircle className="w-6 h-6 text-[#f87171] mx-auto" />
                    <p className="text-sm text-[#fca5a5] font-medium">{dayClosedReason}</p>
                    <p className="text-xs text-[#9c978f]">
                      Please choose another date from the calendar above.
                    </p>
                  </div>
                ) : slotsError ? (
                  <div className="p-4 bg-[#1a1518] border border-[#3f2129] rounded-xl text-center text-xs text-[#fca5a5]">
                    {slotsError}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#7e7a85]">
                    No available time slots remaining for this date.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Morning Slots */}
                    {morningSlots.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold tracking-wider text-[#7e7a85] uppercase mb-2">
                          Morning (10:00 AM – 12:00 PM)
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {morningSlots.map((slot) => (
                            <button
                              key={slot.time}
                              disabled={!slot.available}
                              onClick={() => handleSlotSelect(slot.time)}
                              className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                                !slot.available
                                  ? 'bg-[#131217] border-[#1d1c23] text-[#47444f] cursor-not-allowed line-through'
                                  : selectedSlot === slot.time
                                  ? 'bg-[#c5a85c] text-[#0c0b09] border-[#c5a85c] font-semibold shadow-sm'
                                  : 'bg-[#17161e] border-[#292834] text-[#dcd8ce] hover:border-[#c5a85c] hover:bg-[#1f1e29] cursor-pointer'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Afternoon Slots */}
                    {afternoonSlots.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold tracking-wider text-[#7e7a85] uppercase mb-2">
                          Afternoon (12:00 PM – 5:00 PM)
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {afternoonSlots.map((slot) => (
                            <button
                              key={slot.time}
                              disabled={!slot.available}
                              onClick={() => handleSlotSelect(slot.time)}
                              className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                                !slot.available
                                  ? 'bg-[#131217] border-[#1d1c23] text-[#47444f] cursor-not-allowed line-through'
                                  : selectedSlot === slot.time
                                  ? 'bg-[#c5a85c] text-[#0c0b09] border-[#c5a85c] font-semibold shadow-sm'
                                  : 'bg-[#17161e] border-[#292834] text-[#dcd8ce] hover:border-[#c5a85c] hover:bg-[#1f1e29] cursor-pointer'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evening Slots */}
                    {eveningSlots.length > 0 && (
                      <div>
                        <div className="text-[11px] font-semibold tracking-wider text-[#7e7a85] uppercase mb-2">
                          Evening (5:00 PM – 9:00 PM)
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {eveningSlots.map((slot) => (
                            <button
                              key={slot.time}
                              disabled={!slot.available}
                              onClick={() => handleSlotSelect(slot.time)}
                              className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                                !slot.available
                                  ? 'bg-[#131217] border-[#1d1c23] text-[#47444f] cursor-not-allowed line-through'
                                  : selectedSlot === slot.time
                                  ? 'bg-[#c5a85c] text-[#0c0b09] border-[#c5a85c] font-semibold shadow-sm'
                                  : 'bg-[#17161e] border-[#292834] text-[#dcd8ce] hover:border-[#c5a85c] hover:bg-[#1f1e29] cursor-pointer'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Nav */}
              <div className="pt-4 border-t border-[#1f1e28] flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-[#9c978f] hover:text-white cursor-pointer"
                >
                  ← Back to Services
                </button>

                <button
                  disabled={!selectedSlot}
                  onClick={handleProceedToDetails}
                  className={`px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                    selectedSlot
                      ? 'bg-gradient-to-r from-[#b28f38] via-[#c5a85c] to-[#d8c388] text-[#0c0b09] shadow-md cursor-pointer hover:brightness-105'
                      : 'bg-[#1b1a22] text-[#55525d] border border-[#23222a] cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Customer Info</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CUSTOMER INFORMATION & REVIEW ================= */}
          {step === 3 && selectedService && selectedSlot && (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1f1e28]">
                <div>
                  <h3 className="text-base font-semibold text-[#f5f3ef]">
                    3. Customer Contact &amp; Booking Details
                  </h3>
                  <p className="text-xs text-[#9c978f]">
                    We will send appointment updates and reminders to your phone number.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#c5a85c] hover:underline cursor-pointer"
                >
                  Change Slot
                </button>
              </div>

              {/* Booking Summary Card */}
              <div className="p-4 rounded-xl bg-[#17161f] border border-[#272633] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#7e7a85] block">Treatment:</span>
                  <span className="font-semibold text-[#f5f3ef]">{selectedService.name}</span>
                </div>
                <div>
                  <span className="text-[#7e7a85] block">Appointment:</span>
                  <span className="font-semibold text-[#c5a85c]">
                    {selectedDate} at {selectedSlot} ({selectedService.durationMinutes} mins)
                  </span>
                </div>
                <div>
                  <span className="text-[#7e7a85] block">Pay at Salon:</span>
                  <span className="font-semibold text-[#f5f3ef] font-sans">
                    ₹{selectedService.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={customerNameId} className="block text-xs font-medium text-[#c4c0b6] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#c5a85c]" />
                    Full Name <span className="text-[#c5a85c]">*</span>
                  </label>
                  <input
                    id={customerNameId}
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Pooja Sharma"
                    className="w-full bg-[#18171f] border border-[#2b2a36] rounded-lg px-3 py-2.5 text-xs text-[#eae6dd] placeholder-[#6d6a74] focus:outline-none focus:border-[#c5a85c]"
                  />
                </div>

                <div>
                  <label htmlFor={customerPhoneId} className="block text-xs font-medium text-[#c4c0b6] mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#c5a85c]" />
                    Mobile Number (WhatsApp) <span className="text-[#c5a85c]">*</span>
                  </label>
                  <input
                    id={customerPhoneId}
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9810123456"
                    className="w-full bg-[#18171f] border border-[#2b2a36] rounded-lg px-3 py-2.5 text-xs text-[#eae6dd] placeholder-[#6d6a74] focus:outline-none focus:border-[#c5a85c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={customerEmailId} className="block text-xs font-medium text-[#c4c0b6] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#c5a85c]" />
                    Email Address (Optional)
                  </label>
                  <input
                    id={customerEmailId}
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. pooja@example.com"
                    className="w-full bg-[#18171f] border border-[#2b2a36] rounded-lg px-3 py-2.5 text-xs text-[#eae6dd] placeholder-[#6d6a74] focus:outline-none focus:border-[#c5a85c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={customerNotesId} className="block text-xs font-medium text-[#c4c0b6] mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#c5a85c]" />
                    Special Requests / Hair or Skin Notes (Optional)
                  </label>
                  <textarea
                    id={customerNotesId}
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Sensitive scalp, preferred stylist, or bridal event date..."
                    className="w-full bg-[#18171f] border border-[#2b2a36] rounded-lg px-3 py-2 text-xs text-[#eae6dd] placeholder-[#6d6a74] focus:outline-none focus:border-[#c5a85c]"
                  />
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-[#1d1417] border border-[#4a1f26] rounded-lg text-xs text-[#fca5a5] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Terms and Submit button */}
              <div className="pt-4 border-t border-[#1f1e28] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-medium text-[#9c978f] hover:text-white cursor-pointer order-2 sm:order-1"
                >
                  ← Back to Time Slot
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="order-1 sm:order-2 px-8 py-3 bg-gradient-to-r from-[#b28f38] via-[#c5a85c] to-[#d8c388] text-[#0c0b09] font-bold text-xs sm:text-sm rounded-lg shadow-lg shadow-[#b28f38]/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0c0b09] border-t-transparent rounded-full animate-spin" />
                      <span>Securing Appointment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 4: CONFIRMATION RECEIPT ================= */}
          {step === 4 && confirmedBooking && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#1e1a14] border border-[#c5a85c] flex items-center justify-center mx-auto text-[#c5a85c]">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a85c]">
                  Appointment Confirmed
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#f5f3ef] font-normal mt-1">
                  Thank You, {confirmedBooking.customerName}!
                </h3>
                <p className="text-xs sm:text-sm text-[#9c978f] max-w-md mx-auto mt-1">
                  Your appointment at Siya Galaxy Salon has been successfully reserved. Please arrive 5 minutes early.
                </p>
              </div>

              {/* High-end Receipt Card */}
              <div className="max-w-md mx-auto bg-[#17161f] border border-[#2c2a38] rounded-2xl p-5 text-left space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#242330]">
                  <span className="text-xs text-[#8d8995]">Booking Reference:</span>
                  <span className="text-sm font-mono font-bold text-[#c5a85c] tracking-wider">
                    {confirmedBooking.reference}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8d8995] block">Treatment:</span>
                    <span className="font-medium text-[#f5f3ef]">{confirmedBooking.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-[#8d8995] block">Amount to Pay:</span>
                    <span className="font-medium text-[#f5f3ef] font-sans">
                      ₹{confirmedBooking.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8d8995] block">Date:</span>
                    <span className="font-medium text-[#f5f3ef]">{confirmedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-[#8d8995] block">Time Slot:</span>
                    <span className="font-medium text-[#f5f3ef]">{confirmedBooking.time}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#242330] text-xs text-[#9e9a92] space-y-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a85c] shrink-0 mt-0.5" />
                    <span>Near Metro Pillar No. 33, Vikas Marg, Laxmi Nagar, Delhi 110092</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#c5a85c] shrink-0" />
                    <span>Contact: +91 72176 44360</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="https://maps.app.goo.gl/L2Wpk8mx8ki1924a6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1b1a23] hover:bg-[#23222e] border border-[#2f2e3c] text-xs text-[#eae6dd] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#c5a85c]" />
                  Google Maps Directions
                </a>

                {onOpenManageBooking && (
                  <button
                    onClick={() => onOpenManageBooking(confirmedBooking.reference)}
                    className="px-4 py-2 bg-[#1b1a23] hover:bg-[#23222e] border border-[#2f2e3c] text-xs text-[#eae6dd] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Manage / Reschedule</span>
                  </button>
                )}

                <button
                  onClick={resetBookingForm}
                  className="px-5 py-2 bg-[#c5a85c] hover:bg-[#d8c388] text-[#0c0b09] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Book Another Service
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
