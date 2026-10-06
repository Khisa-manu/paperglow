import React, { useState, useEffect } from 'react';
import {
  BookingModule,
  BookingAppointment,
  BookingCustomer,
  StaffMember,
  ServiceItem,
  ServiceCategory,
  BookingPaymentRecord,
  BookingReminderRule,
  BookingBusinessSettings,
  BookingStatus,
} from '../types/booking';

import {
  DEFAULT_BOOKING_SETTINGS,
  DEFAULT_SERVICE_CATEGORIES,
  DEFAULT_SERVICES,
  DEFAULT_STAFF,
  DEFAULT_CUSTOMERS,
  DEFAULT_APPOINTMENTS,
  DEFAULT_PAYMENTS,
  DEFAULT_REMINDER_RULES,
} from '../data/defaultBookingData';

import { BookingHeader } from '../components/booking/BookingHeader';
import { BookingSidebar } from '../components/booking/BookingSidebar';
import { DashboardModule } from '../components/booking/DashboardModule';
import { CalendarModule } from '../components/booking/CalendarModule';
import { BookingsListModule } from '../components/booking/BookingsListModule';
import { ServicesModule } from '../components/booking/ServicesModule';
import { CustomersModule } from '../components/booking/CustomersModule';
import { StaffModule } from '../components/booking/StaffModule';
import { OnlineBookingModule } from '../components/booking/OnlineBookingModule';
import { RemindersModule } from '../components/booking/RemindersModule';
import { PaymentsModule } from '../components/booking/PaymentsModule';
import { ReportsModule } from '../components/booking/ReportsModule';
import { SettingsModule } from '../components/booking/SettingsModule';
import { CreateBookingModal } from '../components/booking/CreateBookingModal';
import { BookingDetailModal } from '../components/booking/BookingDetailModal';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface BookingPageProps {
  onBackToPaperglow: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onBackToPaperglow }) => {
  const [currentModule, setCurrentModule] = useState<BookingModule>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialDate, setCreateModalInitialDate] = useState<string | undefined>();
  const [createModalInitialTime, setCreateModalInitialTime] = useState<string | undefined>();
  const [createModalInitialStaffId, setCreateModalInitialStaffId] = useState<string | undefined>();
  const [activeAppointment, setActiveAppointment] = useState<BookingAppointment | null>(null);

  // In-app toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // LocalStorage-backed state
  const [appointments, setAppointments] = useState<BookingAppointment[]>(() => {
    const saved = localStorage.getItem('paperglow_booking_appointments');
    return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENTS;
  });

  const [customers, setCustomers] = useState<BookingCustomer[]>(() => {
    const saved = localStorage.getItem('paperglow_booking_customers');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('paperglow_booking_services');
    return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem('paperglow_booking_categories');
    return saved ? JSON.parse(saved) : DEFAULT_SERVICE_CATEGORIES;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('paperglow_booking_staff');
    return saved ? JSON.parse(saved) : DEFAULT_STAFF;
  });

  const [payments, setPayments] = useState<BookingPaymentRecord[]>(() => {
    const saved = localStorage.getItem('paperglow_booking_payments');
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENTS;
  });

  const [reminderRules, setReminderRules] = useState<BookingReminderRule[]>(() => {
    const saved = localStorage.getItem('paperglow_booking_reminders');
    return saved ? JSON.parse(saved) : DEFAULT_REMINDER_RULES;
  });

  const [settings, setSettings] = useState<BookingBusinessSettings>(() => {
    const saved = localStorage.getItem('paperglow_booking_settings');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKING_SETTINGS;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('paperglow_booking_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('paperglow_booking_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('paperglow_booking_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('paperglow_booking_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('paperglow_booking_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('paperglow_booking_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('paperglow_booking_reminders', JSON.stringify(reminderRules));
  }, [reminderRules]);

  useEffect(() => {
    localStorage.setItem('paperglow_booking_settings', JSON.stringify(settings));
  }, [settings]);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Metrics counts
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter((a) => a.date === todayStr).length;
  const upcomingCount = appointments.filter(
    (a) => a.date >= todayStr && a.status !== 'cancelled' && a.status !== 'completed'
  ).length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  // Handlers
  const handleOpenCreateBooking = (date?: string, time?: string, staffId?: string) => {
    setCreateModalInitialDate(date);
    setCreateModalInitialTime(time);
    setCreateModalInitialStaffId(staffId);
    setIsCreateModalOpen(true);
  };

  const handleCreateBooking = (newBooking: BookingAppointment) => {
    setAppointments((prev) => [newBooking, ...prev]);

    // Update customer stats if customer exists
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === newBooking.customerId || c.phone === newBooking.customerPhone) {
          return {
            ...c,
            totalBookings: c.totalBookings + 1,
            totalSpentKes:
              newBooking.paymentStatus === 'paid'
                ? c.totalSpentKes + newBooking.priceKes
                : newBooking.paymentStatus === 'deposit_paid'
                ? c.totalSpentKes + newBooking.depositAmountKes
                : c.totalSpentKes,
          };
        }
        return c;
      })
    );

    setIsCreateModalOpen(false);
    showToast(`Appointment ${newBooking.id} created for ${newBooking.customerName}!`);
  };

  const handleUpdateStatus = (id: string, status: BookingStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a))
    );
    if (activeAppointment && activeAppointment.id === id) {
      setActiveAppointment((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Appointment ${id} status updated to ${status.toUpperCase().replace('_', ' ')}.`);
  };

  const handleReschedule = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            date: newDate,
            startTime: newTime,
            status: 'confirmed',
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
    showToast(`Appointment ${id} rescheduled to ${newDate} at ${newTime}.`);
  };

  // Services handlers
  const handleAddService = (newService: Omit<ServiceItem, 'id'>) => {
    const id = `srv-${Date.now().toString().slice(-4)}`;
    setServices((prev) => [...prev, { ...newService, id }]);
    showToast(`Service "${newService.name}" added to catalog.`);
  };

  const handleUpdateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    showToast('Service details updated.');
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('Service removed from catalog.');
  };

  // Staff handlers
  const handleAddStaff = (newStaff: Omit<StaffMember, 'id' | 'totalAppointmentsCount' | 'rating'>) => {
    const id = `staff-${Date.now().toString().slice(-4)}`;
    setStaff((prev) => [
      ...prev,
      { ...newStaff, id, totalAppointmentsCount: 0, rating: 5.0 },
    ]);
    showToast(`Specialist "${newStaff.name}" added to team roster.`);
  };

  const handleUpdateStaffStatus = (staffId: string, status: StaffMember['status']) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, status } : s)));
    showToast(`Staff member status updated to ${status.replace('_', ' ')}.`);
  };

  const handleUpdateStaffSchedule = (staffId: string, hours: StaffMember['workingHours']) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, workingHours: hours } : s)));
    showToast('Staff working schedule updated.');
  };

  // Customers handlers
  const handleAddCustomer = (
    newCust: Omit<BookingCustomer, 'id' | 'totalBookings' | 'totalSpentKes' | 'createdAt' | 'notes'>
  ) => {
    const id = `cust-${Date.now().toString().slice(-4)}`;
    const custRecord: BookingCustomer = {
      ...newCust,
      id,
      notes: [],
      totalBookings: 0,
      totalSpentKes: 0,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [custRecord, ...prev]);
    showToast(`Customer "${newCust.name}" profile created.`);
  };

  const handleAddCustomerNote = (customerId: string, noteText: string, authorName: string) => {
    const note = {
      id: `n-${Date.now()}`,
      authorName,
      content: noteText,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, notes: [note, ...c.notes] } : c))
    );
    showToast('Note added to client dossier.');
  };

  // Payments handlers
  const handleRecordPayment = (paymentData: Omit<BookingPaymentRecord, 'id' | 'paidAt'>) => {
    const newId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: BookingPaymentRecord = {
      ...paymentData,
      id: newId,
      paidAt: new Date().toISOString(),
    };
    setPayments((prev) => [newRecord, ...prev]);

    // Update appointment payment status
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === paymentData.bookingId) {
          return {
            ...a,
            paymentStatus: paymentData.amountKes >= a.priceKes ? 'paid' : 'deposit_paid',
            depositAmountKes: Math.max(a.depositAmountKes, paymentData.amountKes),
          };
        }
        return a;
      })
    );

    showToast(`Payment of KES ${paymentData.amountKes.toLocaleString()} recorded (${paymentData.referenceCode}).`);
  };

  // Reminders handlers
  const handleToggleReminderRule = (ruleId: string) => {
    setReminderRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleUpdateReminderTemplate = (ruleId: string, template: string) => {
    setReminderRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, template } : r))
    );
    showToast('Reminder template updated.');
  };

  // Settings handlers
  const handleUpdateSettings = (updated: BookingBusinessSettings) => {
    setSettings(updated);
    showToast('Business profile & booking policies updated.');
  };

  // Reset to default demo data
  const handleResetDemoData = () => {
    setAppointments(DEFAULT_APPOINTMENTS);
    setCustomers(DEFAULT_CUSTOMERS);
    setServices(DEFAULT_SERVICES);
    setCategories(DEFAULT_SERVICE_CATEGORIES);
    setStaff(DEFAULT_STAFF);
    setPayments(DEFAULT_PAYMENTS);
    setReminderRules(DEFAULT_REMINDER_RULES);
    setSettings(DEFAULT_BOOKING_SETTINGS);
    localStorage.removeItem('paperglow_booking_appointments');
    localStorage.removeItem('paperglow_booking_customers');
    localStorage.removeItem('paperglow_booking_services');
    localStorage.removeItem('paperglow_booking_categories');
    localStorage.removeItem('paperglow_booking_staff');
    localStorage.removeItem('paperglow_booking_payments');
    localStorage.removeItem('paperglow_booking_reminders');
    localStorage.removeItem('paperglow_booking_settings');
    showToast('Reset to default Paperglow Booking demo data.');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0c0e12] text-neutral-900 dark:text-neutral-100 flex flex-col font-['DM_Sans']">
      {/* Top Header */}
      <BookingHeader
        currentModule={currentModule}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateBooking={() => handleOpenCreateBooking()}
        onNavigateOnlineBooking={() => setCurrentModule('online_booking')}
        onBackToPaperglow={onBackToPaperglow}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        todayCount={todayCount}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <BookingSidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
          todayCount={todayCount}
          upcomingCount={upcomingCount}
          pendingCount={pendingCount}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenCreateBooking={() => handleOpenCreateBooking()}
        />

        {/* Content View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between text-xs text-red-800 dark:text-red-300 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer ml-3"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Module 1: Dashboard */}
          {currentModule === 'dashboard' && (
            <DashboardModule
              appointments={appointments}
              staff={staff}
              services={services}
              onNavigateModule={(mod) => setCurrentModule(mod)}
              onOpenCreateBooking={() => handleOpenCreateBooking()}
              onUpdateStatus={handleUpdateStatus}
              onSelectAppointment={(apt) => setActiveAppointment(apt)}
            />
          )}

          {/* Module 2: Calendar */}
          {currentModule === 'calendar' && (
            <CalendarModule
              appointments={appointments}
              staff={staff}
              services={services}
              onOpenCreateBooking={(date, time, staffId) =>
                handleOpenCreateBooking(date, time, staffId)
              }
              onSelectAppointment={(apt) => setActiveAppointment(apt)}
              onUpdateStatus={handleUpdateStatus}
              onReschedule={handleReschedule}
            />
          )}

          {/* Module 3: Bookings Registry */}
          {currentModule === 'bookings' && (
            <BookingsListModule
              appointments={appointments}
              staff={staff}
              services={services}
              onOpenCreateBooking={() => handleOpenCreateBooking()}
              onSelectAppointment={(apt) => setActiveAppointment(apt)}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {/* Module 4: Services */}
          {currentModule === 'services' && (
            <ServicesModule
              services={services}
              categories={categories}
              staff={staff}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
            />
          )}

          {/* Module 5: Customers */}
          {currentModule === 'customers' && (
            <CustomersModule
              customers={customers}
              appointments={appointments}
              onAddCustomer={handleAddCustomer}
              onAddCustomerNote={handleAddCustomerNote}
              onSelectAppointment={(apt) => setActiveAppointment(apt)}
              onOpenCreateBookingForCustomer={(customerId) => {
                const cust = customers.find((c) => c.id === customerId);
                handleOpenCreateBooking();
              }}
            />
          )}

          {/* Module 6: Staff */}
          {currentModule === 'staff' && (
            <StaffModule
              staff={staff}
              services={services}
              appointments={appointments}
              onAddStaff={handleAddStaff}
              onUpdateStaffStatus={handleUpdateStaffStatus}
              onUpdateStaffSchedule={handleUpdateStaffSchedule}
            />
          )}

          {/* Module 7: Online Booking Customer Page */}
          {currentModule === 'online_booking' && (
            <OnlineBookingModule
              services={services}
              staff={staff}
              settings={settings}
              onCompleteBooking={(newBooking) => handleCreateBooking(newBooking)}
            />
          )}

          {/* Module 8: Reminders */}
          {currentModule === 'reminders' && (
            <RemindersModule
              reminderRules={reminderRules}
              appointments={appointments}
              onToggleRule={handleToggleReminderRule}
              onUpdateTemplate={handleUpdateReminderTemplate}
            />
          )}

          {/* Module 9: Payments */}
          {currentModule === 'payments' && (
            <PaymentsModule
              payments={payments}
              appointments={appointments}
              onRecordPayment={handleRecordPayment}
            />
          )}

          {/* Module 10: Reports */}
          {currentModule === 'reports' && (
            <ReportsModule
              appointments={appointments}
              staff={staff}
              services={services}
            />
          )}

          {/* Module 11: Settings */}
          {currentModule === 'settings' && (
            <div className="space-y-6">
              <SettingsModule
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
              />

              {/* Reset Demo Data Action */}
              <div className="max-w-4xl p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-['Poppins']">
                    Demo State Management
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Reset appointments, calendar slots, client files, and payments back to original Paperglow Studio defaults.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Demo State</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Booking */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        customers={customers}
        services={services}
        staff={staff}
        initialDate={createModalInitialDate}
        initialTime={createModalInitialTime}
        initialStaffId={createModalInitialStaffId}
        onCreateBooking={handleCreateBooking}
      />

      {/* Modal: Booking Detail Dossier */}
      <BookingDetailModal
        appointment={activeAppointment}
        onClose={() => setActiveAppointment(null)}
        onUpdateStatus={handleUpdateStatus}
        onOpenRecordPayment={(apt) => {
          setActiveAppointment(null);
          setCurrentModule('payments');
        }}
      />
    </div>
  );
};
