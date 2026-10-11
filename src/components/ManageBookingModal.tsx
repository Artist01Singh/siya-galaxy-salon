import React, { useState, useEffect, useId } from 'react';
import { X, Search, Calendar, Clock, AlertCircle, CheckCircle2, RotateCcw, Ban, Phone } from 'lucide-react';
import { Booking, TimeSlot } from '../types';
import { lookupBookings, cancelBooking, rescheduleBooking, fetchSlots } from '../services/api';

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReference?: string;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  isOpen,
  onClose,
  initialReference = '',
}) => {
  const searchInputId = useId();
  const phoneVerifyId = useId();

  const [query, setQuery] = useState<string>(initialReference);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('');
  const [rescheduleSlots, setRescheduleSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [rescheduleSuccess, setRescheduleSuccess] = useState<string | null>(null);

  // Cancel state
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);
  const [cancelPhoneVerify, setCancelPhoneVerify] = useState<string>('');
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialReference) {
      setQuery(initialReference);
      handleSearch(initialReference);
    }
  }, [initialReference]);

  if (!isOpen) return null;

  const handleSearch = async (searchVal = query) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedBooking(null);
    setIsRescheduling(false);
    setShowCancelConfirm(false);
    setRescheduleSuccess(null);
    setCancelSuccess(null);

    try {
      const isRef = searchVal.trim().toUpperCase().startsWith('SGS');
      const results = await lookupBookings(
        isRef ? { reference: searchVal.trim() } : { phone: searchVal.trim() }
      );
      setBookings(results);
      if (results.length === 1) {
        setSelectedBooking(results[0]);
      }
    } catch (err: any) {
      setError(err.message || 'No appointment found with the provided details.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReschedule = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsRescheduling(true);
    setShowCancelConfirm(false);
    setRescheduleDate(booking.date);
    setRescheduleSlot('');
    loadSlotsForDate(booking.date, booking.serviceId);
  };

  const loadSlotsForDate = async (date: string, serviceId: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetchSlots(date, serviceId);
      if (res.isOpen) {
        setRescheduleSlots(res.slots || []);
      } else {
        setRescheduleSlots([]);
      }
    } catch {
      setRescheduleSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (newDate: string) => {
    setRescheduleDate(newDate);
    setRescheduleSlot('');
    if (selectedBooking) {
      loadSlotsForDate(newDate, selectedBooking.serviceId);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedBooking || !rescheduleDate || !rescheduleSlot) return;
    setActionLoading(true);
    setError(null);

    try {
      const res = await rescheduleBooking(
        selectedBooking.reference,
        rescheduleDate,
        rescheduleSlot,
        selectedBooking.customerPhone
      );
      setSelectedBooking(res.booking);
      setIsRescheduling(false);
      setRescheduleSuccess(`Appointment successfully moved to ${rescheduleDate} at ${rescheduleSlot}.`);
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule appointment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    setError(null);

    try {
      const res = await cancelBooking(selectedBooking.reference, cancelPhoneVerify || selectedBooking.customerPhone);
      setSelectedBooking(res.booking);
      setShowCancelConfirm(false);
      setCancelSuccess('Your appointment has been cancelled.');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121117] border border-[#2b2a36] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-left shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-[#191821] text-[#9c978f] hover:text-white border border-[#262530] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-widest text-[#c5a85c] font-semibold">
            Customer Self-Service
          </span>
          <h3 className="font-serif text-2xl text-[#f5f3ef] font-semibold mt-0.5">
            Track or Manage Appointment
          </h3>
          <p className="text-xs text-[#9d988f] mt-1">
            Enter your Booking Reference (e.g. SGS-2026-9481) or registered phone number.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="relative flex-1">
            <label htmlFor={searchInputId} className="sr-only">Booking Reference or Phone</label>
            <Search className="w-4 h-4 text-[#75717c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id={searchInputId}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. SGS-2026-9481 or 9810123456"
              className="w-full bg-[#181720] border border-[#2e2d3b] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#eae6dd] placeholder-[#6b6772] focus:outline-none focus:border-[#c5a85c]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#c5a85c] hover:bg-[#d8c388] text-[#0c0b09] text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find'}
          </button>
        </form>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-[#1d1417] border border-[#4a1f26] rounded-xl text-xs text-[#fca5a5] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
            <span>{error}</span>
          </div>
        )}

        {rescheduleSuccess && (
          <div className="mb-4 p-3 bg-[#142319] border border-[#1e4a2d] rounded-xl text-xs text-[#86efac] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#4ade80]" />
            <span>{rescheduleSuccess}</span>
          </div>
        )}

        {cancelSuccess && (
          <div className="mb-4 p-3 bg-[#1f1618] border border-[#442329] rounded-xl text-xs text-[#fca5a5] flex items-center gap-2">
            <Ban className="w-4 h-4 shrink-0 text-[#f87171]" />
            <span>{cancelSuccess}</span>
          </div>
        )}

        {/* Multiple Bookings Picker */}
        {bookings.length > 1 && !selectedBooking && (
          <div className="space-y-3 mb-6">
            <span className="text-xs text-[#9d988f] block">Select appointment to manage:</span>
            {bookings.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className="p-3.5 bg-[#17161f] hover:bg-[#1e1c28] border border-[#2a2936] rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-[#f5f3ef] block">{b.serviceName}</span>
                  <span className="text-[#8e8a95]">
                    {b.date} at {b.time} · Ref: {b.reference}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    b.status === 'confirmed'
                      ? 'bg-emerald-950 text-emerald-300'
                      : b.status === 'rescheduled'
                      ? 'bg-amber-950 text-amber-300'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Selected Booking Details Card */}
        {selectedBooking && !isRescheduling && !showCancelConfirm && (
          <div className="bg-[#17161f] border border-[#2b2a38] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232230]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8e8a95] block">
                  Booking Reference
                </span>
                <span className="font-mono text-sm font-bold text-[#c5a85c]">
                  {selectedBooking.reference}
                </span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
                  selectedBooking.status === 'confirmed'
                    ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                    : selectedBooking.status === 'rescheduled'
                    ? 'bg-amber-950/80 border border-amber-800 text-amber-300'
                    : selectedBooking.status === 'cancelled'
                    ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
                }`}
              >
                {selectedBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#84808c] block">Treatment:</span>
                <span className="font-semibold text-[#f5f3ef]">{selectedBooking.serviceName}</span>
              </div>
              <div>
                <span className="text-[#84808c] block">Price:</span>
                <span className="font-semibold text-[#c5a85c] font-sans">
                  ₹{selectedBooking.price.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[#84808c] block">Scheduled Date:</span>
                <span className="font-semibold text-[#f5f3ef]">{selectedBooking.date}</span>
              </div>
              <div>
                <span className="text-[#84808c] block">Time Slot:</span>
                <span className="font-semibold text-[#f5f3ef]">{selectedBooking.time}</span>
              </div>
              <div>
                <span className="text-[#84808c] block">Customer:</span>
                <span className="text-[#e2ded5]">{selectedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-[#84808c] block">Phone:</span>
                <span className="text-[#e2ded5]">{selectedBooking.customerPhone}</span>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="pt-2 border-t border-[#232230] text-xs">
                <span className="text-[#84808c] block">Booking Notes:</span>
                <span className="text-[#dcd8cd] italic">&ldquo;{selectedBooking.notes}&rdquo;</span>
              </div>
            )}

            {/* Action Buttons for Active Bookings */}
            {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
              <div className="pt-4 border-t border-[#232230] flex flex-wrap gap-2">
                <button
                  onClick={() => handleStartReschedule(selectedBooking)}
                  className="flex-1 py-2 px-3 bg-[#1e1c26] hover:bg-[#282634] border border-[#343242] text-xs font-semibold text-[#eae6dd] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#c5a85c]" />
                  <span>Reschedule Slot</span>
                </button>

                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="py-2 px-3 bg-[#1a1417] hover:bg-[#24171c] border border-[#3f1f26] text-xs font-semibold text-[#fca5a5] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5 text-[#f87171]" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reschedule Flow */}
        {isRescheduling && selectedBooking && (
          <div className="bg-[#17161f] border border-[#2b2a38] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232230]">
              <span className="text-xs font-semibold text-[#f5f3ef]">
                Choose New Date &amp; Slot
              </span>
              <button
                onClick={() => setIsRescheduling(false)}
                className="text-xs text-[#9d988f] hover:text-white"
              >
                Back
              </button>
            </div>

            <div>
              <label className="block text-xs text-[#a09c94] mb-1">Select New Date:</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={rescheduleDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full bg-[#1e1c27] border border-[#2f2d3d] rounded-lg px-3 py-2 text-xs text-[#f5f3ef] focus:outline-none focus:border-[#c5a85c]"
              />
            </div>

            <div>
              <span className="block text-xs text-[#a09c94] mb-1.5">
                Available Slots for {rescheduleDate}:
              </span>

              {loadingSlots ? (
                <div className="py-6 text-center text-xs text-[#8e8a95]">
                  Checking chair availability...
                </div>
              ) : rescheduleSlots.filter((s) => s.available).length === 0 ? (
                <div className="py-4 text-center text-xs text-[#fca5a5]">
                  No available slots on this date. Please pick another date.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                  {rescheduleSlots
                    .filter((s) => s.available)
                    .map((s) => (
                      <button
                        key={s.time}
                        onClick={() => setRescheduleSlot(s.time)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          rescheduleSlot === s.time
                            ? 'bg-[#c5a85c] text-[#0c0b09] border-[#c5a85c] font-semibold'
                            : 'bg-[#1e1c27] border-[#2b2938] text-[#ded9cf] hover:border-[#c5a85c]'
                        }`}
                      >
                        {s.time}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#232230] flex items-center justify-between">
              <button
                onClick={() => setIsRescheduling(false)}
                className="text-xs text-[#9d988f] hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={!rescheduleSlot || actionLoading}
                onClick={handleConfirmReschedule}
                className="px-5 py-2 bg-[#c5a85c] hover:bg-[#d8c388] text-[#0c0b09] text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Updating...' : `Confirm New Slot (${rescheduleSlot || 'Select'})`}
              </button>
            </div>
          </div>
        )}

        {/* Cancellation Confirmation View */}
        {showCancelConfirm && selectedBooking && (
          <div className="bg-[#1c1417] border border-[#3f1f26] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-[#f87171]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-semibold text-[#fca5a5]">Cancel this appointment?</h4>
            </div>

            <p className="text-xs text-[#dcd7cb] leading-relaxed">
              Are you sure you want to cancel appointment <strong className="text-white">{selectedBooking.reference}</strong> for {selectedBooking.serviceName} on {selectedBooking.date} at {selectedBooking.time}?
            </p>

            <div>
              <label htmlFor={phoneVerifyId} className="block text-xs text-[#a09c94] mb-1">
                Confirm phone digits (last 4 or full):
              </label>
              <input
                id={phoneVerifyId}
                type="text"
                placeholder={selectedBooking.customerPhone.slice(-4)}
                value={cancelPhoneVerify}
                onChange={(e) => setCancelPhoneVerify(e.target.value)}
                className="w-full bg-[#24171c] border border-[#4a222a] rounded-lg px-3 py-2 text-xs text-[#f5f3ef] focus:outline-none focus:border-[#f87171]"
              />
            </div>

            <div className="pt-3 border-t border-[#31191f] flex items-center justify-between">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="text-xs text-[#9d988f] hover:text-white"
              >
                Keep Appointment
              </button>
              <button
                disabled={actionLoading}
                onClick={handleConfirmCancel}
                className="px-5 py-2 bg-[#dc2626] hover:bg-[#ef4444] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {actionLoading ? 'Cancelling...' : 'Yes, Cancel Appointment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
