import React from 'react';
import {
  Building2,
  Key,
  Banknote,
  AlertCircle,
  Clock,
  Wrench,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  Property,
  Unit,
  Tenant,
  Lease,
  RentPayment,
  MaintenanceTicket,
  PMModule,
} from '../../types/propertyManager';

interface PMDashboardModuleProps {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  leases: Lease[];
  payments: RentPayment[];
  tickets: MaintenanceTicket[];
  onNavigateModule: (module: PMModule) => void;
  onRecordRentClick: () => void;
  onNewTicketClick: () => void;
  onAddPropertyClick: () => void;
}

export const PMDashboardModule: React.FC<PMDashboardModuleProps> = ({
  properties,
  units,
  tenants,
  leases,
  payments,
  tickets,
  onNavigateModule,
  onRecordRentClick,
  onNewTicketClick,
  onAddPropertyClick,
}) => {
  // Calculations
  const totalProperties = properties.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.status === 'occupied').length;
  const vacantUnits = units.filter((u) => u.status === 'vacant').length;
  const maintenanceUnits = units.filter((u) => u.status === 'under_maintenance').length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Rent Calculations for current month (October 2026)
  const currentMonth = 'October 2026';
  const currentMonthPayments = payments.filter((p) => p.monthFor === currentMonth);
  const rentCollectedKes = currentMonthPayments.reduce((sum, p) => sum + p.amountKes, 0);

  // Total potential monthly rent from occupied units
  const totalExpectedRentKes = units
    .filter((u) => u.status === 'occupied')
    .reduce((sum, u) => sum + u.monthlyRentKes, 0);

  // Total outstanding balance across all active tenants
  const totalOutstandingKes = tenants.reduce((sum, t) => sum + Math.max(0, t.balanceKes), 0);

  // Collection progress percentage
  const collectionPercentage =
    totalExpectedRentKes > 0
      ? Math.min(100, Math.round((rentCollectedKes / totalExpectedRentKes) * 100))
      : 0;

  // Upcoming leases expiring soon
  const upcomingLeases = leases.filter(
    (l) => l.status === 'expiring_soon' || new Date(l.endDate) <= new Date('2026-11-30')
  );

  // Open maintenance requests
  const openTickets = tickets.filter((t) => t.status !== 'resolved');
  const urgentTickets = openTickets.filter((t) => t.priority === 'urgent');

  // Format currency
  const formatKes = (amount: number) => {
    return `KES ${amount.toLocaleString('en-KE')}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Overview Kicker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#11141a] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Nairobi Property Management Hub</span>
            <span aria-hidden="true">·</span>
            <span>Billing Cycle: {currentMonth}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1 font-['Poppins']">
            Portfolio Health &amp; Rental Operations
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Managing {totalProperties} estate locations with {occupiedUnits} occupied residential &amp; commercial suites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRecordRentClick}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            Record Rent Payment
          </button>
          <button
            onClick={onNewTicketClick}
            className="px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Log Maintenance
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Properties */}
        <div
          onClick={() => onNavigateModule('properties')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Total Properties</span>
            <Building2 className="w-4 h-4 text-neutral-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 font-mono tabular-nums">
            {totalProperties}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center space-x-1">
            <span>Across Nairobi County</span>
          </div>
        </div>

        {/* Occupied vs Vacant */}
        <div
          onClick={() => onNavigateModule('properties')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Occupancy Rate</span>
            <Key className="w-4 h-4 text-neutral-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 font-mono tabular-nums flex items-baseline space-x-1.5">
            <span>{occupancyRate}%</span>
            <span className="text-xs font-normal text-neutral-500">
              ({occupiedUnits}/{totalUnits})
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            {vacantUnits} vacant · {maintenanceUnits} under repair
          </div>
        </div>

        {/* Rent Collected This Month */}
        <div
          onClick={() => onNavigateModule('rent')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Collected ({currentMonth.split(' ')[0]})</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 font-mono tabular-nums truncate">
            {formatKes(rentCollectedKes)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            {collectionPercentage}% of expected rent
          </div>
        </div>

        {/* Outstanding Rent */}
        <div
          onClick={() => onNavigateModule('rent')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Outstanding Balance</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-bold tracking-tight text-red-600 dark:text-red-400 mt-2 font-mono tabular-nums truncate">
            {formatKes(totalOutstandingKes)}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            Across 2 overdue tenant accounts
          </div>
        </div>

        {/* Upcoming Leases */}
        <div
          onClick={() => onNavigateModule('leases')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Leases Expiring Soon</span>
            <Clock className="w-4 h-4 text-neutral-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 font-mono tabular-nums">
            {upcomingLeases.length}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
            Action required within 60 days
          </div>
        </div>

        {/* Open Maintenance */}
        <div
          onClick={() => onNavigateModule('maintenance')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Open Maintenance</span>
            <Wrench className="w-4 h-4 text-neutral-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 font-mono tabular-nums">
            {openTickets.length}
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            {urgentTickets.length > 0 ? (
              <span className="text-red-600 font-semibold">{urgentTickets.length} urgent task pending</span>
            ) : (
              'All standard priority'
            )}
          </div>
        </div>
      </div>

      {/* Rent Collection Health Bar */}
      <div className="bg-white dark:bg-[#11141a] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {currentMonth} Rent Collection Progress
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Total Expected: {formatKes(totalExpectedRentKes)} · Collected to Date: {formatKes(rentCollectedKes)}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {collectionPercentage}%
            </span>
          </div>
        </div>

        {/* Clean Progress Meter */}
        <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-500"
            style={{ width: `${collectionPercentage}%` }}
          />
        </div>
      </div>

      {/* Split Section: Recent Rent Payments & Urgent Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rent Payments */}
        <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Recent Rent Receipts
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Direct M-Pesa &amp; Bank EFT confirmations
              </p>
            </div>
            <button
              onClick={() => onNavigateModule('rent')}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {payments.slice(0, 5).map((pay) => {
              const tenant = tenants.find((t) => t.id === pay.tenantId);
              const prop = properties.find((p) => p.id === pay.propertyId);
              const unit = units.find((u) => u.id === pay.unitId);
              return (
                <div
                  key={pay.id}
                  className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <div className="space-y-0.5 max-w-[60%] truncate">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {tenant?.name || 'Tenant'}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {prop?.name} · {unit?.unitNumber} · {pay.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Bank EFT'}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      Ref: {pay.transactionReference} · {pay.paymentDate}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {formatKes(pay.amountKes)}
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Confirmed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Maintenance Attention Queue */}
        <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Maintenance Attention Queue
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Active tenant repair and service tickets
              </p>
            </div>
            <button
              onClick={() => onNavigateModule('maintenance')}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {tickets.slice(0, 4).map((ticket) => {
              const prop = properties.find((p) => p.id === ticket.propertyId);
              const unit = units.find((u) => u.id === ticket.unitId);
              return (
                <div
                  key={ticket.id}
                  className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <div className="space-y-0.5 max-w-[65%]">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-semibold text-neutral-500">
                        {ticket.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          ticket.priority === 'urgent'
                            ? 'text-red-600 dark:text-red-400'
                            : ticket.priority === 'high'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-neutral-500'
                        }`}
                      >
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {ticket.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {prop?.name} ({unit?.unitNumber}) · Assigned: {ticket.assignedTo}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        ticket.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : ticket.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {ticket.status === 'in_progress' ? 'In Progress' : ticket.status === 'resolved' ? 'Resolved' : 'Reported'}
                    </span>
                    <div className="text-[10px] text-neutral-400 mt-1">
                      {ticket.reportedDate}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
