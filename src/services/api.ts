import { Booking, SalonSettings, CustomerReview, Service, TimeSlot, AdminStats } from '../types';

const ADMIN_TOKEN_KEY = 'siya_galaxy_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = getAdminToken();
  if (token && endpoint.startsWith('/api/admin/')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

// Public API
export async function fetchSalonInfo(): Promise<{ settings: SalonSettings; reviews: CustomerReview[] }> {
  return request<{ settings: SalonSettings; reviews: CustomerReview[] }>('/api/salon');
}

export async function fetchServices(): Promise<Service[]> {
  return request<Service[]>('/api/services');
}

export async function fetchSlots(date: string, serviceId?: string): Promise<{
  isOpen: boolean;
  reason?: string;
  dayName?: string;
  operatingHours?: string;
  slots: TimeSlot[];
}> {
  const params = new URLSearchParams({ date });
  if (serviceId) params.append('serviceId', serviceId);
  return request(`/api/slots?${params.toString()}`);
}

export async function createBooking(data: {
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  notes?: string;
}): Promise<{ message: string; booking: Booking }> {
  return request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function lookupBookings(query: { reference?: string; phone?: string }): Promise<Booking[]> {
  const params = new URLSearchParams();
  if (query.reference) params.append('reference', query.reference);
  if (query.phone) params.append('phone', query.phone);
  return request(`/api/bookings/lookup?${params.toString()}`);
}

export async function cancelBooking(reference: string, phone?: string): Promise<{ message: string; booking: Booking }> {
  return request(`/api/bookings/${encodeURIComponent(reference)}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function rescheduleBooking(
  reference: string,
  newDate: string,
  newTime: string,
  phone?: string
): Promise<{ message: string; booking: Booking }> {
  return request(`/api/bookings/${encodeURIComponent(reference)}/reschedule`, {
    method: 'POST',
    body: JSON.stringify({ newDate, newTime, phone }),
  });
}

// Admin API
export async function adminGetSetupStatus(): Promise<{ isRegistered: boolean; adminEmail?: string | null; adminName?: string | null }> {
  return request('/api/admin/setup-status');
}

export async function adminSetupAccount(data: { name: string; email: string; password: string }): Promise<{ token: string; user: any }> {
  const res = await request<{ token: string; user: any }>('/api/admin/setup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setAdminToken(res.token);
  return res;
}

export async function adminLogin(email: string, password: string): Promise<{ token: string; user: any }> {
  const res = await request<{ token: string; user: any }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAdminToken(res.token);
  return res;
}

export async function adminGetMe(): Promise<{ user: any }> {
  return request('/api/admin/me');
}

export async function adminGetStats(): Promise<AdminStats> {
  return request<AdminStats>('/api/admin/stats');
}

export async function adminGetBookings(filters?: { status?: string; search?: string; date?: string }): Promise<Booking[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.date) params.append('date', filters.date);
  return request<Booking[]>(`/api/admin/bookings?${params.toString()}`);
}

export async function adminUpdateBookingStatus(id: string, status: string): Promise<{ message: string; booking: Booking }> {
  return request(`/api/admin/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function adminRescheduleBooking(id: string, date: string, time: string): Promise<{ message: string; booking: Booking }> {
  return request(`/api/admin/bookings/${id}/reschedule`, {
    method: 'PATCH',
    body: JSON.stringify({ date, time }),
  });
}

export async function adminGetServices(): Promise<Service[]> {
  return request<Service[]>('/api/admin/services');
}

export async function adminCreateService(payload: Partial<Service>): Promise<Service> {
  return request<Service>('/api/admin/services', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function adminUpdateService(id: string, payload: Partial<Service>): Promise<Service> {
  return request<Service>(`/api/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteService(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/admin/services/${id}`, {
    method: 'DELETE',
  });
}

export async function adminGetSettings(): Promise<SalonSettings> {
  return request<SalonSettings>('/api/admin/settings');
}

export async function adminUpdateSettings(settings: Partial<SalonSettings>): Promise<SalonSettings> {
  return request<SalonSettings>('/api/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

export async function adminAddBlockedDate(date: string, reason: string): Promise<any> {
  return request('/api/admin/blocked-dates', {
    method: 'POST',
    body: JSON.stringify({ date, reason }),
  });
}

export async function adminDeleteBlockedDate(id: string): Promise<{ message: string }> {
  return request(`/api/admin/blocked-dates/${id}`, {
    method: 'DELETE',
  });
}
