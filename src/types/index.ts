export interface Service {
  id: string;
  name: string;
  category: 'hair' | 'skin' | 'bridal' | 'nails' | 'grooming';
  durationMinutes: number;
  price: number;
  description: string;
  imageUrl?: string;
  popular?: boolean;
  isActive: boolean;
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

export interface Booking {
  id: string;
  reference: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  price: number;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime: string; // HH:MM
  closeTime: string; // HH:MM
}

export interface BlockedDate {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
}

export interface SalonSettings {
  salonName: string;
  tagline: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  googleMapsUrl: string;
  established: string;
  rating: number;
  reviewCount: number;
  slotIntervalMinutes: number;
  maxConcurrentBookings: number;
  weeklySchedule: DaySchedule[];
  blockedDates: BlockedDate[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
  remainingCapacity: number;
  reason?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  source: 'Google' | 'Justdial';
  comment: string;
  serviceMentioned?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface AdminSetupStatus {
  isRegistered: boolean;
  adminEmail?: string;
  adminName?: string;
}

export interface AdminStats {
  totalBookings: number;
  totalRevenue: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  todayBookingsCount: number;
  upcomingBookingsCount: number;
}
