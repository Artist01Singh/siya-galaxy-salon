import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Calendar,
  Clock,
  DollarSign,
  Search,
  CheckCircle,
  XCircle,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Lock,
  LogOut,
  AlertCircle,
  Check,
  Settings,
  Scissors,
  KeyRound,
  UserPlus,
  ShieldCheck,
  Phone,
  Mail,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { Booking, Service, SalonSettings, AdminStats } from '../types';
import {
  adminGetSetupStatus,
  adminSetupAccount,
  adminLogin,
  adminGetStats,
  adminGetBookings,
  adminUpdateBookingStatus,
  adminRescheduleBooking,
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
  adminGetSettings,
  adminUpdateSettings,
  adminAddBlockedDate,
  adminDeleteBlockedDate,
  clearAdminToken,
} from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  onSetupStatusChanged?: (isRegistered: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  onSetupStatusChanged,
}) => {
  // Setup slot status
  const [isRegistered, setIsRegistered] = useState<boolean>(true);
  const [checkingSetup, setCheckingSetup] = useState<boolean>(true);

  // Setup form state (Single Slot)
  const [setupName, setSetupName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab: 'overview' | 'bookings' | 'services' | 'schedule'
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'services' | 'schedule'>('bookings');

  // Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [_loading, setLoading] = useState(false);

  // Filters
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [bookingDateFilter, setBookingDateFilter] = useState<string>('');

  // Service Edit / Create Modal State
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Reschedule Modal State
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // New Blocked Date State
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');

  // Selected Booking Details View Modal
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);

  // Feedback notifications
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Check setup status whenever modal opens
  useEffect(() => {
    if (isOpen) {
      checkSetupState();
      if (isAdminLoggedIn) {
        loadAllAdminData();
      }
    }
  }, [isOpen, isAdminLoggedIn]);

  const checkSetupState = async () => {
    setCheckingSetup(true);
    try {
      const status = await adminGetSetupStatus();
      setIsRegistered(status.isRegistered);
      if (onSetupStatusChanged) {
        onSetupStatusChanged(status.isRegistered);
      }
      if (status.adminEmail) {
        setLoginEmail(status.adminEmail);
      }
    } catch {
      // Fallback
    } finally {
      setCheckingSetup(false);
    }
  };

  if (!isOpen) return null;

  const showBanner = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(null), 4000);
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, bookingsData, servicesData, settingsData] = await Promise.all([
        adminGetStats(),
        adminGetBookings(),
        adminGetServices(),
        adminGetSettings(),
      ]);
      setStats(statsData);
      setBookings(bookingsData);
      setServices(servicesData);
      setSettings(settingsData);
    } catch (err: any) {
      if (err.message && err.message.includes('Unauthorized')) {
        handleLogout();
      } else {
        showBanner('Error loading data: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Single Slot Registration
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);

    if (!setupName.trim() || !setupEmail.trim() || !setupPassword) {
      setSetupError('Please fill in all fields.');
      return;
    }

    if (setupPassword.length < 6) {
      setSetupError('Password must be at least 6 characters long.');
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setSetupError('Passwords do not match.');
      return;
    }

    setSetupLoading(true);
    try {
      await adminSetupAccount({
        name: setupName.trim(),
        email: setupEmail.trim(),
        password: setupPassword,
      });

      setIsRegistered(true);
      if (onSetupStatusChanged) onSetupStatusChanged(true);
      setIsAdminLoggedIn(true);
      showBanner('Admin account created! The single registration slot is now locked.');
      loadAllAdminData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      setSetupError(err.message || 'Failed to create admin account.');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      await adminLogin(loginEmail, loginPassword);
      setIsAdminLoggedIn(true);
      loadAllAdminData();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator email or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setIsAdminLoggedIn(false);
  };

  // Status Actions
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminUpdateBookingStatus(id, status);
      showBanner(`Booking status marked as ${status}.`);
      loadAllAdminData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showBanner(err.message || 'Failed to update status');
    }
  };

  // Reschedule Action
  const handleAdminReschedule = async () => {
    if (!reschedulingBooking || !newDate || !newTime) return;
    try {
      await adminRescheduleBooking(reschedulingBooking.id, newDate, newTime);
      showBanner(`Appointment rescheduled to ${newDate} at ${newTime}.`);
      setReschedulingBooking(null);
      loadAllAdminData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showBanner(err.message || 'Failed to reschedule appointment');
    }
  };

  // Service Save (Create or Edit)
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.name || !editingService?.price) return;

    try {
      if (isNewService) {
        await adminCreateService(editingService);
        showBanner(`Created service "${editingService.name}".`);
      } else if (editingService.id) {
        await adminUpdateService(editingService.id, editingService);
        showBanner(`Updated service "${editingService.name}".`);
      }
      setEditingService(null);
      loadAllAdminData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showBanner(err.message || 'Failed to save service');
    }
  };

  // Service Delete
  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await adminDeleteService(id);
      showBanner('Service deleted.');
      loadAllAdminData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showBanner(err.message || 'Failed to delete service');
    }
  };

  // Toggle Service Active
  const handleToggleServiceActive = async (service: Service) => {
    try {
      await adminUpdateService(service.id, { isActive: !service.isActive });
      showBanner(`Service ${service.isActive ? 'deactivated' : 'activated'}.`);
      loadAllAdminData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showBanner(err.message || 'Failed to update status');
    }
  };

  // Schedule / Hours Update
  const handleDayScheduleChange = (dayIndex: number, field: string, value: any) => {
    if (!settings) return;
    const updated = [...settings.weeklySchedule];
    updated[dayIndex] = {
      ...updated[dayIndex],
      [field]: value,
    };
    setSettings({ ...settings, weeklySchedule: updated });
  };

  const handleSaveScheduleSettings = async () => {
    if (!settings) return;
    try {
      await adminUpdateSettings(settings);
      showBanner('Salon hours and capacity settings saved successfully.');
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showBanner(err.message || 'Failed to save settings');
    }
  };

  // Blocked Date
  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate) return;
    try {
      await adminAddBlockedDate(newBlockDate, newBlockReason);
      setNewBlockDate('');
      setNewBlockReason('');
      showBanner('Date blocked successfully.');
      loadAllAdminData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showBanner(err.message || 'Failed to add blocked date');
    }
  };

  const handleDeleteBlockedDate = async (id: string) => {
    try {
      await adminDeleteBlockedDate(id);
      showBanner('Blocked date removed.');
      loadAllAdminData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showBanner(err.message || 'Failed to remove date');
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const matchesDate = !bookingDateFilter || b.date === bookingDateFilter;
    const matchesSearch =
      bookingSearch === '' ||
      b.reference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerPhone.includes(bookingSearch) ||
      b.serviceName.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesDate && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0f0e14] border border-[#262531] rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#14131c] border-b border-[#21202b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1e1b15] border border-[#c5a85c] flex items-center justify-center text-[#c5a85c]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#f5f3ef] flex items-center gap-2">
                <span>Siya Galaxy Salon</span>
                <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-[#1e1b15] text-[#c5a85c] border border-[#c5a85c]/30">
                  Manager Portal
                </span>
              </h2>
              <span className="text-xs text-[#8c8893]">
                Laxmi Nagar, Delhi · Master Booking &amp; Operations Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-[#1a1922] hover:bg-[#23222e] text-xs text-[#b0aba0] hover:text-[#f87171] border border-[#2b2a36] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1a1922] hover:bg-[#23222e] text-[#9c978f] hover:text-white border border-[#2b2a36] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Banner */}
        {bannerMessage && (
          <div className="px-6 py-2.5 bg-[#17261a] border-b border-[#234b29] text-xs text-[#86efac] flex items-center justify-between">
            <span>{bannerMessage}</span>
            <button onClick={() => setBannerMessage(null)} className="text-[#86efac] hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* ================= AUTHENTICATION STATES ================= */}
        {!isAdminLoggedIn ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#0c0b0f] overflow-y-auto">
            {checkingSetup ? (
              <div className="text-center text-xs text-[#8e8a93] flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-[#c5a85c] border-t-transparent rounded-full animate-spin" />
                <span>Checking admin security status...</span>
              </div>
            ) : !isRegistered ? (
              /* === SINGLE SLOT REGISTRATION VIEW === */
              <div className="w-full max-w-md bg-[#131219] border border-[#c5a85c]/40 rounded-2xl p-7 sm:p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-[#1e1b15] border border-[#c5a85c] flex items-center justify-center mx-auto text-[#c5a85c] mb-2">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a2214] border border-[#c5a85c]/50 text-[#e6cc87] text-[11px] font-semibold">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Single Slot Available</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#f5f3ef]">Create Master Admin Account</h3>
                  <p className="text-xs text-[#9d988f] leading-relaxed">
                    Set up your primary administrative account. Once registered, this single slot is permanently locked
                    and no additional admin registrations will ever be permitted.
                  </p>
                </div>

                {setupError && (
                  <div className="p-3 bg-[#1e1418] border border-[#441f27] rounded-xl text-xs text-[#fca5a5] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                    <span>{setupError}</span>
                  </div>
                )}

                <form onSubmit={handleSetupSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4c0b6] mb-1">
                      Your Full Name <span className="text-[#c5a85c]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Admin / Salon Owner"
                      value={setupName}
                      onChange={(e) => setSetupName(e.target.value)}
                      className="w-full bg-[#181720] border border-[#2c2b3a] rounded-lg px-3 py-2 text-xs text-[#eae6dd] focus:outline-none focus:border-[#c5a85c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4c0b6] mb-1">
                      Admin Email Address <span className="text-[#c5a85c]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@siyagalaxysalon.com"
                      value={setupEmail}
                      onChange={(e) => setSetupEmail(e.target.value)}
                      className="w-full bg-[#181720] border border-[#2c2b3a] rounded-lg px-3 py-2 text-xs text-[#eae6dd] focus:outline-none focus:border-[#c5a85c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4c0b6] mb-1">
                      Create Password <span className="text-[#c5a85c]">* (Min. 6 chars)</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      className="w-full bg-[#181720] border border-[#2c2b3a] rounded-lg px-3 py-2 text-xs text-[#eae6dd] focus:outline-none focus:border-[#c5a85c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4c0b6] mb-1">
                      Confirm Password <span className="text-[#c5a85c]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={setupConfirmPassword}
                      onChange={(e) => setSetupConfirmPassword(e.target.value)}
                      className="w-full bg-[#181720] border border-[#2c2b3a] rounded-lg px-3 py-2 text-xs text-[#eae6dd] focus:outline-none focus:border-[#c5a85c]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={setupLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-[#b28f38] via-[#c5a85c] to-[#d8c388] text-[#0c0b09] font-bold text-xs rounded-lg shadow-md hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {setupLoading ? 'Creating Account & Locking Slot...' : 'Claim Single Slot & Create Account'}
                  </button>
                </form>

                <div className="pt-3 border-t border-[#1f1e29] text-center text-[11px] text-[#787580]">
                  <span>Security Guarantee: Encrypted with salted bcrypt hashing and JWT session tokens.</span>
                </div>
              </div>
            ) : (
              /* === LOCKED LOGIN VIEW (SLOT CLAIMED) === */
              <div className="w-full max-w-md bg-[#131219] border border-[#262533] rounded-2xl p-7 sm:p-8 shadow-xl space-y-6">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-[#1e1b15] border border-[#c5a85c] flex items-center justify-center mx-auto text-[#c5a85c] mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#17241a] border border-[#255030] text-[#86efac] text-[10px] font-semibold mb-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Single Admin Slot Claimed &amp; Locked</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#f5f3ef]">Administrator Login</h3>
                  <p className="text-xs text-[#9d988f]">
                    Sign in with your master credentials to view all customer bookings and manage the salon.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-[#1e1418] border border-[#441f27] rounded-xl text-xs text-[#fca5a5] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4c0b6] mb-1">Admin Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@siyagalaxysalon.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-[#181720] border border-[#2c2b3a] rounded-lg px-3 py-2 text-xs text-[#eae6dd] focus:outline-none focus:border-[#c5a85c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4c0b6] mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-[#181720] border border-[#2c2b3a] rounded-lg px-3 py-2 text-xs text-[#eae6dd] focus:outline-none focus:border-[#c5a85c]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-[#b28f38] via-[#c5a85c] to-[#d8c388] text-[#0c0b09] font-bold text-xs rounded-lg shadow-md hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loginLoading ? 'Verifying...' : 'Sign In to Dashboard'}
                  </button>
                </form>

                <div className="pt-3 border-t border-[#1f1e29] text-center text-[11px] text-[#6b6772]">
                  <span>Single-admin security active: Additional registration accounts are permanently disabled.</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= LOGGED IN DASHBOARD ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="px-6 bg-[#121118] border-b border-[#21202b] flex items-center justify-between overflow-x-auto shrink-0">
              <div className="flex items-center gap-2">
                {[
                  { id: 'bookings', label: `All Bookings (${bookings.length})`, icon: Calendar },
                  { id: 'overview', label: 'Statistics & Revenue', icon: DollarSign },
                  { id: 'services', label: `Service Menu (${services.length})`, icon: Scissors },
                  { id: 'schedule', label: 'Hours & Blocked Dates', icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-3.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'border-[#c5a85c] text-[#f5f3ef]'
                          : 'border-transparent text-[#8e8a93] hover:text-[#d4cfc4]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#c5a85c]' : 'text-[#726f7a]'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Indicator */}
              <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#4ade80]">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                <span>Real-time Live Sync</span>
              </div>
            </div>

            {/* Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0c0b0f]">
              {/* TAB 1: ALL BOOKINGS (MAIN HIGHLIGHT REQUESTED) */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {/* Top Stats Mini Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#131219] border border-[#242330] rounded-xl text-left">
                      <span className="text-[10px] text-[#84808d] uppercase font-semibold block">Total Registered</span>
                      <span className="text-xl font-bold text-[#f5f3ef]">{bookings.length}</span>
                    </div>
                    <div className="p-3 bg-[#131219] border border-[#242330] rounded-xl text-left">
                      <span className="text-[10px] text-[#84808d] uppercase font-semibold block">Active Confirmed</span>
                      <span className="text-xl font-bold text-emerald-400">
                        {bookings.filter((b) => b.status === 'confirmed').length}
                      </span>
                    </div>
                    <div className="p-3 bg-[#131219] border border-[#242330] rounded-xl text-left">
                      <span className="text-[10px] text-[#84808d] uppercase font-semibold block">Completed Visits</span>
                      <span className="text-xl font-bold text-blue-400">
                        {bookings.filter((b) => b.status === 'completed').length}
                      </span>
                    </div>
                    <div className="p-3 bg-[#131219] border border-[#242330] rounded-xl text-left">
                      <span className="text-[10px] text-[#84808d] uppercase font-semibold block">Cancelled</span>
                      <span className="text-xl font-bold text-rose-400">
                        {bookings.filter((b) => b.status === 'cancelled').length}
                      </span>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    {/* Status filters */}
                    <div className="flex items-center gap-1.5 p-1 bg-[#15141c] rounded-xl border border-[#23222e] w-full md:w-auto overflow-x-auto">
                      {['all', 'confirmed', 'completed', 'rescheduled', 'cancelled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setBookingStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                            bookingStatusFilter === st
                              ? 'bg-[#c5a85c] text-[#0c0b09]'
                              : 'text-[#9c978f] hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      {/* Date filter */}
                      <input
                        type="date"
                        value={bookingDateFilter}
                        onChange={(e) => setBookingDateFilter(e.target.value)}
                        className="bg-[#15141c] border border-[#252431] rounded-xl px-2.5 py-2 text-xs text-[#eae6dd] focus:outline-none focus:border-[#c5a85c]"
                        title="Filter by specific appointment date"
                      />
                      {bookingDateFilter && (
                        <button
                          onClick={() => setBookingDateFilter('')}
                          className="text-xs text-[#a39f97] hover:text-white px-1"
                        >
                          Clear
                        </button>
                      )}

                      {/* Search box */}
                      <div className="relative flex-1 md:w-64">
                        <Search className="w-3.5 h-3.5 text-[#736f7a] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={bookingSearch}
                          onChange={(e) => setBookingSearch(e.target.value)}
                          placeholder="Search customer, phone, ref..."
                          className="w-full bg-[#15141c] border border-[#252431] rounded-xl pl-9 pr-3 py-2 text-xs text-[#eae6dd] focus:outline-none focus:border-[#c5a85c]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Appointments Table */}
                  <div className="bg-[#131219] border border-[#23222e] rounded-xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#181722] text-[#8e8a93] uppercase text-[10px] tracking-wider border-b border-[#23222e]">
                          <tr>
                            <th className="py-3 px-4">Ref Code</th>
                            <th className="py-3 px-4">Customer Details</th>
                            <th className="py-3 px-4">Treatment</th>
                            <th className="py-3 px-4">Scheduled Slot</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1d28]">
                          {filteredBookings.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-[#736f7a]">
                                No customer bookings found matching the current filter.
                              </td>
                            </tr>
                          ) : (
                            filteredBookings.map((b) => (
                              <tr key={b.id} className="hover:bg-[#171621] transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-[#c5a85c]">
                                  {b.reference}
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-[#f5f3ef] flex items-center gap-1.5">
                                    <User className="w-3 h-3 text-[#c5a85c]" />
                                    <span>{b.customerName}</span>
                                  </div>
                                  <div className="text-[#a49f97] text-[11px] flex items-center gap-1.5 mt-0.5">
                                    <Phone className="w-3 h-3 text-[#797680]" />
                                    <a href={`tel:${b.customerPhone}`} className="hover:text-[#c5a85c]">
                                      {b.customerPhone}
                                    </a>
                                  </div>
                                  {b.customerEmail && (
                                    <div className="text-[#7c7884] text-[10px] flex items-center gap-1.5">
                                      <Mail className="w-3 h-3 text-[#64616c]" />
                                      <span>{b.customerEmail}</span>
                                    </div>
                                  )}
                                  {b.notes && (
                                    <span className="text-[10px] text-[#e0a96d] block truncate max-w-xs mt-0.5">
                                      Note: &ldquo;{b.notes}&rdquo;
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="font-medium text-[#ded9cf]">{b.serviceName}</div>
                                  <div className="text-[#716d78] text-[10px]">{b.durationMinutes} mins duration</div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-[#f5f3ef] flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#c5a85c]" />
                                    <span>{b.date}</span>
                                  </div>
                                  <div className="text-[#c5a85c] font-medium flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3 text-[#c5a85c]" />
                                    <span>{b.time}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 font-sans font-semibold text-[#eae6dd]">
                                  ₹{b.price.toLocaleString('en-IN')}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                      b.status === 'confirmed'
                                        ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                                        : b.status === 'completed'
                                        ? 'bg-blue-950/80 border border-blue-800 text-blue-300'
                                        : b.status === 'cancelled'
                                        ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
                                        : 'bg-amber-950/80 border border-amber-800 text-amber-300'
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setViewingBooking(b)}
                                      className="px-2 py-1 rounded bg-[#1c1b26] hover:bg-[#272533] text-[11px] text-[#c5a85c] border border-[#2b2a38] transition-colors cursor-pointer"
                                      title="View Customer Details"
                                    >
                                      Details
                                    </button>

                                    {b.status !== 'completed' && (
                                      <button
                                        onClick={() => handleUpdateStatus(b.id, 'completed')}
                                        title="Mark as Completed"
                                        className="p-1.5 rounded bg-[#1c1b26] hover:bg-blue-950 text-[#8e8a93] hover:text-blue-300 border border-[#2b2a38] transition-colors cursor-pointer"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    {b.status !== 'confirmed' && b.status !== 'cancelled' && (
                                      <button
                                        onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                        title="Confirm Appointment"
                                        className="p-1.5 rounded bg-[#1c1b26] hover:bg-emerald-950 text-[#8e8a93] hover:text-emerald-300 border border-[#2b2a38] transition-colors cursor-pointer"
                                      >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    <button
                                      onClick={() => {
                                        setReschedulingBooking(b);
                                        setNewDate(b.date);
                                        setNewTime(b.time);
                                      }}
                                      title="Reschedule Slot"
                                      className="p-1.5 rounded bg-[#1c1b26] hover:bg-amber-950 text-[#8e8a93] hover:text-amber-300 border border-[#2b2a38] transition-colors cursor-pointer"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                    </button>

                                    {b.status !== 'cancelled' && (
                                      <button
                                        onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                        title="Cancel Appointment"
                                        className="p-1.5 rounded bg-[#1c1b26] hover:bg-rose-950 text-[#8e8a93] hover:text-rose-300 border border-[#2b2a38] transition-colors cursor-pointer"
                                      >
                                        <XCircle className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW & STATS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-[#131219] border border-[#23222e]">
                      <span className="text-[11px] text-[#8e8a93] uppercase font-semibold block mb-1">
                        Total Appointments
                      </span>
                      <div className="text-2xl font-bold text-[#f5f3ef]">{stats?.totalBookings || 0}</div>
                      <span className="text-[10px] text-[#4ade80] mt-1 block">All-time bookings</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#131219] border border-[#23222e]">
                      <span className="text-[11px] text-[#8e8a93] uppercase font-semibold block mb-1">
                        Gross Bookings Value
                      </span>
                      <div className="text-2xl font-bold text-[#c5a85c] font-sans">
                        ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-[#8e8a93] mt-1 block">Active revenue</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#131219] border border-[#23222e]">
                      <span className="text-[11px] text-[#8e8a93] uppercase font-semibold block mb-1">
                        Upcoming Active
                      </span>
                      <div className="text-2xl font-bold text-[#f5f3ef]">
                        {stats?.upcomingBookingsCount || 0}
                      </div>
                      <span className="text-[10px] text-[#8e8a93] mt-1 block">Scheduled future slots</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#131219] border border-[#23222e]">
                      <span className="text-[11px] text-[#8e8a93] uppercase font-semibold block mb-1">
                        Appointments Today
                      </span>
                      <div className="text-2xl font-bold text-[#4ade80]">
                        {stats?.todayBookingsCount || 0}
                      </div>
                      <span className="text-[10px] text-[#8e8a93] mt-1 block">Scheduled for today</span>
                    </div>
                  </div>

                  <div className="bg-[#131219] border border-[#23222e] rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-[#f5f3ef] mb-3">Salon Information &amp; Address</h3>
                    <div className="text-xs text-[#a6a197] space-y-1.5 leading-relaxed">
                      <p><strong>Name:</strong> {settings?.salonName || 'Siya Galaxy Salon'}</p>
                      <p><strong>Address:</strong> {settings?.address || 'Near Metro Pillar No. 33, Vikas Marg, Laxmi Nagar, Delhi 110092'}</p>
                      <p><strong>Phone:</strong> {settings?.phone || '+91 72176 44360'}</p>
                      <p><strong>Google Maps Link:</strong> <a href={settings?.googleMapsUrl} target="_blank" rel="noreferrer" className="text-[#c5a85c] underline">{settings?.googleMapsUrl}</a></p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#f5f3ef]">Service Menu &amp; Visuals</h3>
                      <p className="text-xs text-[#8c8893]">
                        Every service features custom images, prices, durations, and status controls.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsNewService(true);
                        setEditingService({
                          name: '',
                          category: 'hair',
                          durationMinutes: 45,
                          price: 500,
                          description: '',
                          imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
                          popular: false,
                          isActive: true,
                        });
                      }}
                      className="px-4 py-2 bg-[#c5a85c] hover:bg-[#d8c388] text-[#0c0b09] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s) => (
                      <div
                        key={s.id}
                        className={`rounded-xl border overflow-hidden transition-all flex flex-col justify-between ${
                          s.isActive
                            ? 'bg-[#131219] border-[#252431]'
                            : 'bg-[#111015] border-[#1d1c24] opacity-60'
                        }`}
                      >
                        {/* Service Image */}
                        <div className="relative aspect-[16/9] w-full bg-[#181720]">
                          <img
                            src={s.imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
                            alt={s.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-semibold text-white">
                            ₹{s.price}
                          </div>
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-medium text-[#c5a85c] capitalize">
                            {s.category}
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-xs font-semibold text-[#f5f3ef] mb-1">{s.name}</h4>
                          <p className="text-[11px] text-[#938f9b] line-clamp-2 leading-relaxed">
                            {s.description}
                          </p>

                          <div className="pt-3 mt-3 border-t border-[#1d1c26] flex items-center justify-between text-xs">
                            <button
                              onClick={() => handleToggleServiceActive(s)}
                              className="text-[11px] text-[#8e8a93] hover:text-white cursor-pointer"
                            >
                              {s.isActive ? 'Deactivate' : 'Activate'}
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setIsNewService(false);
                                  setEditingService({ ...s });
                                }}
                                className="p-1 text-[#a39f96] hover:text-[#c5a85c] cursor-pointer"
                                title="Edit Service"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(s.id)}
                                className="p-1 text-[#a39f96] hover:text-[#f87171] cursor-pointer"
                                title="Delete Service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SCHEDULE & BLOCKED DATES */}
              {activeTab === 'schedule' && settings && (
                <div className="space-y-6">
                  <div className="bg-[#131219] border border-[#23222e] rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-[#f5f3ef]">
                      Capacity &amp; Booking Intervals
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[#a09c94] mb-1 font-medium">
                          Slot Interval (Minutes):
                        </label>
                        <select
                          value={settings.slotIntervalMinutes}
                          onChange={(e) =>
                            setSettings({ ...settings, slotIntervalMinutes: Number(e.target.value) })
                          }
                          className="w-full bg-[#181722] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-[#eae6dd]"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#a09c94] mb-1 font-medium">
                          Max Concurrent Clients (Chairs / Stylists):
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={settings.maxConcurrentBookings}
                          onChange={(e) =>
                            setSettings({ ...settings, maxConcurrentBookings: Number(e.target.value) })
                          }
                          className="w-full bg-[#181722] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-[#eae6dd]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#131219] border border-[#23222e] rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#f5f3ef]">
                        Weekly Operating Schedule
                      </h3>
                      <button
                        onClick={handleSaveScheduleSettings}
                        className="px-4 py-1.5 bg-[#c5a85c] hover:bg-[#d8c388] text-[#0c0b09] text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Save Schedule
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {settings.weeklySchedule.map((sch, idx) => (
                        <div
                          key={sch.day}
                          className="p-3 bg-[#181722] rounded-lg border border-[#252431] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 w-32">
                            <input
                              type="checkbox"
                              checked={sch.isOpen}
                              onChange={(e) => handleDayScheduleChange(idx, 'isOpen', e.target.checked)}
                              className="rounded text-[#c5a85c]"
                            />
                            <span className="capitalize font-semibold text-[#dedad1]">{sch.day}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#84808c]">Open:</span>
                              <input
                                type="time"
                                disabled={!sch.isOpen}
                                value={sch.openTime}
                                onChange={(e) => handleDayScheduleChange(idx, 'openTime', e.target.value)}
                                className="bg-[#1f1e29] border border-[#2f2e3d] rounded px-2 py-1 text-xs text-[#eae6dd] disabled:opacity-40"
                              />
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[#84808c]">Close:</span>
                              <input
                                type="time"
                                disabled={!sch.isOpen}
                                value={sch.closeTime}
                                onChange={(e) => handleDayScheduleChange(idx, 'closeTime', e.target.value)}
                                className="bg-[#1f1e29] border border-[#2f2e3d] rounded px-2 py-1 text-xs text-[#eae6dd] disabled:opacity-40"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#131219] border border-[#23222e] rounded-xl p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-[#f5f3ef]">
                      Blocked Dates &amp; Holidays
                    </h3>

                    <form onSubmit={handleAddBlockedDate} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="date"
                        required
                        value={newBlockDate}
                        onChange={(e) => setNewBlockDate(e.target.value)}
                        className="bg-[#181722] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-[#eae6dd]"
                      />
                      <input
                        type="text"
                        placeholder="Reason (e.g. Festival, Renovation)"
                        value={newBlockReason}
                        onChange={(e) => setNewBlockReason(e.target.value)}
                        className="flex-1 bg-[#181722] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-[#eae6dd]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1f1e29] hover:bg-[#2b2a38] text-xs font-semibold text-[#c5a85c] border border-[#3b3a4a] rounded-lg cursor-pointer"
                      >
                        Block Date
                      </button>
                    </form>

                    <div className="space-y-2 pt-2">
                      {settings.blockedDates.length === 0 ? (
                        <div className="text-xs text-[#716e78]">No blocked dates currently.</div>
                      ) : (
                        settings.blockedDates.map((b) => (
                          <div
                            key={b.id}
                            className="p-3 bg-[#181722] rounded-lg border border-[#2b2a39] flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-[#f5f3ef] mr-2">{b.date}</span>
                              <span className="text-[#a09c95]">({b.reason})</span>
                            </div>
                            <button
                              onClick={() => handleDeleteBlockedDate(b.id)}
                              className="text-rose-400 hover:text-rose-300 cursor-pointer"
                              title="Remove Block"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Customer Booking Details Modal */}
        {viewingBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-[#131219] border border-[#2e2c3b] rounded-2xl p-6 w-full max-w-lg space-y-4 text-left shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#242330]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8e8a93]">Full Booking Details</span>
                  <h3 className="text-base font-bold text-[#c5a85c] font-mono">{viewingBooking.reference}</h3>
                </div>
                <button
                  onClick={() => setViewingBooking(null)}
                  className="p-1 rounded bg-[#1c1b26] text-[#8e8a93] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#7e7a85] block">Customer Name:</span>
                  <span className="font-semibold text-[#f5f3ef]">{viewingBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-[#7e7a85] block">Phone Number:</span>
                  <a href={`tel:${viewingBooking.customerPhone}`} className="font-semibold text-[#c5a85c] hover:underline">
                    {viewingBooking.customerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-[#7e7a85] block">Email:</span>
                  <span className="text-[#eae6dd]">{viewingBooking.customerEmail || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[#7e7a85] block">Current Status:</span>
                  <span className="uppercase font-bold text-xs">{viewingBooking.status}</span>
                </div>
                <div>
                  <span className="text-[#7e7a85] block">Service:</span>
                  <span className="font-semibold text-[#f5f3ef]">{viewingBooking.serviceName}</span>
                </div>
                <div>
                  <span className="text-[#7e7a85] block">Amount to Collect:</span>
                  <span className="font-bold text-[#c5a85c]">₹{viewingBooking.price}</span>
                </div>
                <div>
                  <span className="text-[#7e7a85] block">Date &amp; Time:</span>
                  <span className="font-semibold text-[#f5f3ef]">{viewingBooking.date} at {viewingBooking.time}</span>
                </div>
                <div>
                  <span className="text-[#7e7a85] block">Duration:</span>
                  <span className="text-[#eae6dd]">{viewingBooking.durationMinutes} minutes</span>
                </div>
              </div>

              {viewingBooking.notes && (
                <div className="p-3 bg-[#181720] rounded-xl border border-[#272633] text-xs">
                  <span className="text-[#84808c] block mb-0.5 font-semibold">Special Customer Notes:</span>
                  <p className="text-[#e2ded5] italic">&ldquo;{viewingBooking.notes}&rdquo;</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingBooking(null)}
                  className="px-4 py-2 bg-[#1b1a23] hover:bg-[#23222e] text-xs text-[#eae6dd] rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {reschedulingBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75">
            <div className="bg-[#131219] border border-[#2e2c3b] rounded-2xl p-6 w-full max-w-md space-y-4">
              <h3 className="text-sm font-semibold text-[#f5f3ef]">
                Reschedule Booking {reschedulingBooking.reference}
              </h3>
              <div>
                <label className="block text-xs text-[#a09c94] mb-1">Select New Date:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#1a1923] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a09c94] mb-1">Select New Time:</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-[#1a1923] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setReschedulingBooking(null)}
                  className="px-3 py-1.5 text-xs text-[#9d988f] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminReschedule}
                  className="px-4 py-1.5 bg-[#c5a85c] text-[#0c0b09] font-bold text-xs rounded-lg"
                >
                  Update Slot
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Service Create/Edit Modal with Image URL */}
        {editingService && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75">
            <div className="bg-[#131219] border border-[#2e2c3b] rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto text-left">
              <h3 className="text-sm font-semibold text-[#f5f3ef]">
                {isNewService ? 'Create New Service' : 'Edit Service'}
              </h3>

              <form onSubmit={handleSaveService} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#a09c94] mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={editingService.name || ''}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full bg-[#1a1923] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a09c94] mb-1">Category *</label>
                    <select
                      value={editingService.category || 'hair'}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                      className="w-full bg-[#1a1923] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-white"
                    >
                      <option value="hair">Hair</option>
                      <option value="skin">Skin</option>
                      <option value="bridal">Bridal</option>
                      <option value="nails">Nails</option>
                      <option value="grooming">Grooming</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#a09c94] mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editingService.price || ''}
                      onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                      className="w-full bg-[#1a1923] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#a09c94] mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#c5a85c]" />
                    <span>Image URL (Unsplash or Direct Photo Link)</span>
                  </label>
                  <input
                    type="url"
                    value={editingService.imageUrl || ''}
                    onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#1a1923] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-white"
                  />
                  {editingService.imageUrl && (
                    <div className="mt-2 w-24 h-16 rounded overflow-hidden border border-[#2e2c3b]">
                      <img
                        src={editingService.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a09c94] mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      required
                      value={editingService.durationMinutes || 45}
                      onChange={(e) => setEditingService({ ...editingService, durationMinutes: Number(e.target.value) })}
                      className="w-full bg-[#1a1923] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingService.popular || false}
                        onChange={(e) => setEditingService({ ...editingService, popular: e.target.checked })}
                      />
                      <span>Guest Favorite</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingService.isActive !== false}
                        onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[#a09c94] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingService.description || ''}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    className="w-full bg-[#1a1923] border border-[#2b2a38] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#232230]">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-3 py-1.5 text-xs text-[#9d988f] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#c5a85c] hover:bg-[#d8c388] text-[#0c0b09] font-bold text-xs rounded-lg"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
