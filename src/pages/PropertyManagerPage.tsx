import React, { useState, useEffect } from 'react';
import {
  PMModule,
  Property,
  Unit,
  Tenant,
  Lease,
  RentPayment,
  MaintenanceTicket,
  PropertyExpense,
  PropertyNotification,
  PropertyManagerSettings,
  UnitStatus,
  MaintenanceStatus,
} from '../types/propertyManager';
import {
  DEFAULT_PROPERTIES,
  DEFAULT_UNITS,
  DEFAULT_TENANTS,
  DEFAULT_LEASES,
  DEFAULT_RENT_PAYMENTS,
  DEFAULT_MAINTENANCE_TICKETS,
  DEFAULT_EXPENSES,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_PM_SETTINGS,
} from '../data/defaultPropertyManagerData';

import { PMSidebar } from '../components/propertyManager/PMSidebar';
import { PMHeader } from '../components/propertyManager/PMHeader';
import { PMDashboardModule } from '../components/propertyManager/PMDashboardModule';
import { PMPropertiesModule } from '../components/propertyManager/PMPropertiesModule';
import { PMTenantsModule } from '../components/propertyManager/PMTenantsModule';
import { PMRentManagementModule } from '../components/propertyManager/PMRentManagementModule';
import { PMLeasesModule } from '../components/propertyManager/PMLeasesModule';
import { PMMaintenanceModule } from '../components/propertyManager/PMMaintenanceModule';
import { PMExpensesModule } from '../components/propertyManager/PMExpensesModule';
import { PMReportsModule } from '../components/propertyManager/PMReportsModule';
import { PMNotificationsModule } from '../components/propertyManager/PMNotificationsModule';

interface PropertyManagerPageProps {
  onBackToDirectory?: () => void;
  onNavigateHome: () => void;
  onOpenAccount?: (tab?: 'overview' | 'subscribed' | 'available' | 'merch' | 'orders' | 'profile') => void;
}

export const PropertyManagerPage: React.FC<PropertyManagerPageProps> = ({
  onBackToDirectory,
  onNavigateHome,
}) => {
  // Current active navigation module
  const [currentModule, setCurrentModule] = useState<PMModule>('dashboard');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Primary State collections with LocalStorage persistence
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('paperglow_pm_properties');
    return saved ? JSON.parse(saved) : DEFAULT_PROPERTIES;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('paperglow_pm_units');
    return saved ? JSON.parse(saved) : DEFAULT_UNITS;
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('paperglow_pm_tenants');
    return saved ? JSON.parse(saved) : DEFAULT_TENANTS;
  });

  const [leases, setLeases] = useState<Lease[]>(() => {
    const saved = localStorage.getItem('paperglow_pm_leases');
    return saved ? JSON.parse(saved) : DEFAULT_LEASES;
  });

  const [payments, setPayments] = useState<RentPayment[]>(() => {
    const saved = localStorage.getItem('paperglow_pm_payments');
    return saved ? JSON.parse(saved) : DEFAULT_RENT_PAYMENTS;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('paperglow_pm_tickets');
    return saved ? JSON.parse(saved) : DEFAULT_MAINTENANCE_TICKETS;
  });

  const [expenses, setExpenses] = useState<PropertyExpense[]>(() => {
    const saved = localStorage.getItem('paperglow_pm_expenses');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
  });

  const [notifications, setNotifications] = useState<PropertyNotification[]>(() => {
    const saved = localStorage.getItem('paperglow_pm_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('paperglow_pm_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('paperglow_pm_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('paperglow_pm_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('paperglow_pm_leases', JSON.stringify(leases));
  }, [leases]);

  useEffect(() => {
    localStorage.setItem('paperglow_pm_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('paperglow_pm_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('paperglow_pm_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('paperglow_pm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Dark mode handler
  const handleToggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('paperglow_theme_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('paperglow_theme_dark', 'false');
    }
  };

  // CRUD Handlers
  const handleAddProperty = (newProp: Omit<Property, 'id'>) => {
    const id = `prop-${Date.now()}`;
    const property: Property = { ...newProp, id };
    setProperties([property, ...properties]);
    showToast(`Property "${newProp.name}" added to estate portfolio!`);
  };

  const handleAddUnit = (newUnit: Omit<Unit, 'id'>) => {
    const id = `unit-${Date.now()}`;
    const unit: Unit = { ...newUnit, id };
    setUnits([unit, ...units]);
    showToast(`Unit ${newUnit.unitNumber} added to building inventory.`);
  };

  const handleUpdateUnitStatus = (unitId: string, status: UnitStatus) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, status } : u))
    );
    showToast(`Unit status updated to ${status}.`);
  };

  const handleAddTenant = (newTenant: Omit<Tenant, 'id'>) => {
    const id = `ten-${Date.now()}`;
    const tenant: Tenant = { ...newTenant, id };
    setTenants([tenant, ...tenants]);

    // Mark unit as occupied
    setUnits((prev) =>
      prev.map((u) =>
        u.id === newTenant.unitId
          ? { ...u, status: 'occupied', currentTenantId: id }
          : u
      )
    );

    // Create corresponding lease
    const prop = properties.find((p) => p.id === newTenant.propertyId);
    const unit = units.find((u) => u.id === newTenant.unitId);
    const newLease: Lease = {
      id: `lease-${Date.now()}`,
      propertyId: newTenant.propertyId,
      unitId: newTenant.unitId,
      tenantId: id,
      startDate: newTenant.moveInDate,
      endDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      monthlyRentKes: unit?.monthlyRentKes || 65000,
      depositKes: unit?.depositKes || 65000,
      status: 'active',
      paymentDayOfMonth: 5,
      leaseDocumentTitle: `Tenancy Agreement (${prop?.name.split(' ')[0]} #${unit?.unitNumber})`,
      termsText:
        'Standard residential tenancy agreement. Rent payable strictly on or before 5th of each month.',
    };
    setLeases([newLease, ...leases]);

    showToast(`Tenant "${newTenant.name}" registered and assigned to unit.`);
  };

  const handleRecordPayment = (
    payment: Omit<RentPayment, 'id' | 'receiptNumber'>
  ) => {
    const receiptNumber = `RCT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPay: RentPayment = {
      ...payment,
      id: `pay-${Date.now()}`,
      receiptNumber,
    };
    setPayments([newPay, ...payments]);

    // Update tenant balance
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === payment.tenantId) {
          const nextBal = Math.max(0, t.balanceKes - payment.amountKes);
          return { ...t, balanceKes: nextBal };
        }
        return t;
      })
    );

    showToast(
      `Rent payment of KES ${payment.amountKes.toLocaleString()} recorded. Receipt: ${receiptNumber}`
    );
  };

  const handleAddTicket = (
    newTicket: Omit<MaintenanceTicket, 'id' | 'ticketNumber'>
  ) => {
    const ticketNumber = `MNT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const ticket: MaintenanceTicket = {
      ...newTicket,
      id: `mnt-${Date.now()}`,
      ticketNumber,
    };
    setTickets([ticket, ...tickets]);

    // Add alert notification
    const notif: PropertyNotification = {
      id: `notif-${Date.now()}`,
      title: `Maintenance Logged: ${ticket.title}`,
      message: `Assigned to ${ticket.assignedTo}. Ticket: ${ticketNumber}`,
      type: 'maintenance_update',
      date: new Date().toISOString().split('T')[0],
      read: false,
      propertyId: ticket.propertyId,
    };
    setNotifications([notif, ...notifications]);

    showToast(`Maintenance ticket ${ticketNumber} logged and assigned.`);
  };

  const handleUpdateTicketStatus = (
    ticketId: string,
    status: MaintenanceStatus,
    actualCost?: number
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status,
            actualCostKes: actualCost !== undefined ? actualCost : t.actualCostKes,
            resolvedDate: status === 'resolved' ? new Date().toISOString().split('T')[0] : t.resolvedDate,
          };
        }
        return t;
      })
    );
    showToast(`Maintenance ticket status updated to ${status}.`);
  };

  const handleAddExpense = (
    expense: Omit<PropertyExpense, 'id' | 'voucherNumber'>
  ) => {
    const voucherNumber = `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newExp: PropertyExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
      voucherNumber,
    };
    setExpenses([newExp, ...expenses]);
    showToast(`Expense voucher ${voucherNumber} recorded.`);
  };

  const handleAddLease = (newLease: Omit<Lease, 'id'>) => {
    const lease: Lease = { ...newLease, id: `lease-${Date.now()}` };
    setLeases([lease, ...leases]);
    showToast(`Lease agreement "${lease.leaseDocumentTitle}" generated.`);
  };

  const handleSendReminder = (tenant: Tenant) => {
    showToast(
      `SMS & WhatsApp Rent Reminder dispatched to ${tenant.name} (${tenant.phone}).`
    );
  };

  const handleSendRenewalNotice = (lease: Lease) => {
    const tenant = tenants.find((t) => t.id === lease.tenantId);
    showToast(
      `Tenancy renewal notice dispatched to ${tenant?.name || 'Tenant'} (${tenant?.phone}).`
    );
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All alerts marked as read.');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleBroadcastRentReminders = () => {
    // Generate notification entries
    const overdueTenants = tenants.filter((t) => t.balanceKes > 0);
    const newNotifs: PropertyNotification[] = overdueTenants.map((t) => ({
      id: `notif-${Date.now()}-${t.id}`,
      title: `Reminder Sent: ${t.name}`,
      message: `Rent reminder demand dispatched for KES ${t.balanceKes.toLocaleString()} to ${t.phone}`,
      type: 'rent_reminder',
      date: new Date().toISOString().split('T')[0],
      read: false,
      tenantId: t.id,
      propertyId: t.propertyId,
    }));
    setNotifications([...newNotifs, ...notifications]);
  };

  // Quick Action navigation shortcuts
  const handleQuickRecordRent = () => {
    setCurrentModule('rent');
  };

  const handleQuickAddProperty = () => {
    setCurrentModule('properties');
  };

  const handleQuickAddTicket = () => {
    setCurrentModule('maintenance');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const openMaintenanceCount = tickets.filter((t) => t.status !== 'resolved').length;
  const overdueRentCount = tenants.filter((t) => t.balanceKes > 0).length;

  return (
    <div className="min-h-screen bg-neutral-50/60 dark:bg-[#0b0d11] text-neutral-900 dark:text-neutral-100 flex transition-colors duration-150">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <PMSidebar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
        unreadNotificationsCount={unreadCount}
        openMaintenanceCount={openMaintenanceCount}
        overdueRentCount={overdueRentCount}
        onBackToDirectory={onBackToDirectory}
        onNavigateHome={onNavigateHome}
      />

      {/* Main Viewport */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <PMHeader
          currentModule={currentModule}
          onOpenMobileMenu={() => setIsSidebarMobileOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadCount={unreadCount}
          onOpenNotifications={() => setCurrentModule('notifications')}
          onQuickRecordRent={handleQuickRecordRent}
          onQuickAddProperty={handleQuickAddProperty}
          onQuickAddTicket={handleQuickAddTicket}
          isDark={isDark}
          onToggleDarkMode={handleToggleDarkMode}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentModule === 'dashboard' && (
            <PMDashboardModule
              properties={properties}
              units={units}
              tenants={tenants}
              leases={leases}
              payments={payments}
              tickets={tickets}
              onNavigateModule={setCurrentModule}
              onRecordRentClick={handleQuickRecordRent}
              onNewTicketClick={handleQuickAddTicket}
              onAddPropertyClick={handleQuickAddProperty}
            />
          )}

          {currentModule === 'properties' && (
            <PMPropertiesModule
              properties={properties}
              units={units}
              tenants={tenants}
              onAddProperty={handleAddProperty}
              onAddUnit={handleAddUnit}
              onUpdateUnitStatus={handleUpdateUnitStatus}
            />
          )}

          {currentModule === 'tenants' && (
            <PMTenantsModule
              tenants={tenants}
              properties={properties}
              units={units}
              leases={leases}
              payments={payments}
              onAddTenant={handleAddTenant}
              onSendReminder={handleSendReminder}
              onRecordRentForTenant={(t) => {
                setCurrentModule('rent');
              }}
            />
          )}

          {currentModule === 'rent' && (
            <PMRentManagementModule
              payments={payments}
              tenants={tenants}
              properties={properties}
              units={units}
              onRecordPayment={handleRecordPayment}
              onSendReminder={handleSendReminder}
            />
          )}

          {currentModule === 'leases' && (
            <PMLeasesModule
              leases={leases}
              tenants={tenants}
              properties={properties}
              units={units}
              onAddLease={handleAddLease}
              onRenewLease={(leaseId, newEndDate) => {
                setLeases((prev) =>
                  prev.map((l) =>
                    l.id === leaseId ? { ...l, endDate: newEndDate, status: 'active' } : l
                  )
                );
                showToast('Lease renewed successfully.');
              }}
              onSendRenewalNotice={handleSendRenewalNotice}
            />
          )}

          {currentModule === 'maintenance' && (
            <PMMaintenanceModule
              tickets={tickets}
              properties={properties}
              units={units}
              tenants={tenants}
              onAddTicket={handleAddTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
            />
          )}

          {currentModule === 'expenses' && (
            <PMExpensesModule
              expenses={expenses}
              properties={properties}
              onAddExpense={handleAddExpense}
            />
          )}

          {currentModule === 'reports' && (
            <PMReportsModule
              properties={properties}
              units={units}
              tenants={tenants}
              leases={leases}
              payments={payments}
              expenses={expenses}
            />
          )}

          {currentModule === 'notifications' && (
            <PMNotificationsModule
              notifications={notifications}
              tenants={tenants}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDeleteNotification={handleDeleteNotification}
              onBroadcastRentReminders={handleBroadcastRentReminders}
            />
          )}
        </main>
      </div>
    </div>
  );
};
