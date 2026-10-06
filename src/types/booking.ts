export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'deposit_paid' | 'paid' | 'refunded';
export type PaymentMethod = 'mpesa' | 'cash' | 'card' | 'bank_transfer';

export type BookingModule =
  | 'dashboard'
  | 'calendar'
  | 'bookings'
  | 'services'
  | 'customers'
  | 'staff'
  | 'online_booking'
  | 'reminders'
  | 'payments'
  | 'reports'
  | 'settings';

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  priceKes: number;
  durationMinutes: number;
  description: string;
  assignedStaffIds: string[];
  isActive: boolean;
  bufferMinutes?: number;
}

export interface StaffWorkingHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  dayName: string;
  isOpen: boolean;
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
  providedServiceIds: string[];
  workingHours: StaffWorkingHours[];
  daysOff: string[]; // YYYY-MM-DD
  status: 'available' | 'busy' | 'on_break' | 'day_off';
  totalAppointmentsCount: number;
  rating: number;
}

export interface CustomerNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface BookingCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  notes: CustomerNote[];
  totalBookings: number;
  totalSpentKes: number;
  createdAt: string;
}

export interface BookingPaymentRecord {
  id: string;
  bookingId: string;
  customerName: string;
  amountKes: number;
  method: PaymentMethod;
  referenceCode: string; // e.g. M-Pesa Code "QKH8912P4L"
  status: 'completed' | 'pending';
  paidAt: string;
  notes?: string;
}

export interface BookingAppointment {
  id: string; // e.g. "BK-3041"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  priceKes: number;
  depositAmountKes: number;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "10:30"
  endTime: string;   // "11:30"
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  source: 'Online Booking Page' | 'In-person / Walk-in' | 'Phone Call' | 'WhatsApp';
  createdAt: string;
  updatedAt: string;
  reminderSent: boolean;
}

export interface BookingReminderRule {
  id: string;
  title: string;
  channel: 'sms' | 'whatsapp' | 'email';
  timingHoursBefore: number;
  template: string;
  isActive: boolean;
  integrationProvider: 'Safaricom SMS Gateway' | 'WhatsApp Cloud API' | 'Email SMTP';
  status: 'configured' | 'ready_for_credentials';
}

export interface BookingBusinessSettings {
  businessName: string;
  tagline: string;
  category: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  kraPin: string;
  currency: string;
  slotDurationMinutes: number;
  bufferTimeMinutes: number;
  advanceNoticeHours: number;
  maxAdvanceDays: number;
  cancellationFreeHours: number;
  depositPercentage: number;
  autoRemindersEnabled: boolean;
  mpesaPaybill: string;
  mpesaAccountNumber: string;
}
