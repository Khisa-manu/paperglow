import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Users,
  Award,
} from 'lucide-react';
import {
  BookingAppointment,
  StaffMember,
  ServiceItem,
} from '../../types/booking';

interface ReportsModuleProps {
  appointments: BookingAppointment[];
  staff: StaffMember[];
  services: ServiceItem[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  appointments,
  staff,
  services,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'all'>('30days');

  // Revenue & counts
  const totalVolume = appointments.length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;
  const noShowCount = appointments.filter((a) => a.status === 'no_show').length;

  const totalGrossKes = appointments
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.priceKes, 0);

  const completedRevenueKes = appointments
    .filter((a) => a.status === 'completed' || a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.priceKes, 0);

  const cancellationRate = totalVolume > 0 ? Math.round(((cancelledCount + noShowCount) / totalVolume) * 100) : 0;
  const fulfillmentRate = totalVolume > 0 ? Math.round((completedCount / totalVolume) * 100) : 0;

  // Service popularity breakdown
  const serviceStats = services.map((srv) => {
    const matching = appointments.filter((a) => a.serviceId === srv.id);
    const revenue = matching
      .filter((a) => a.status !== 'cancelled')
      .reduce((sum, a) => sum + a.priceKes, 0);
    return {
      service: srv,
      count: matching.length,
      revenueKes: revenue,
    };
  }).sort((a, b) => b.count - a.count);

  // Staff performance
  const staffStats = staff.map((st) => {
    const matching = appointments.filter((a) => a.staffId === st.id);
    const completed = matching.filter((a) => a.status === 'completed').length;
    const revenue = matching
      .filter((a) => a.status !== 'cancelled')
      .reduce((sum, a) => sum + a.priceKes, 0);
    return {
      staff: st,
      total: matching.length,
      completed,
      revenueKes: revenue,
    };
  }).sort((a, b) => b.revenueKes - a.revenueKes);

  const handleExportCSV = () => {
    alert(`Exporting Booking & Revenue Analytics Report (${timeRange}) as CSV spreadsheet.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Operations &amp; Revenue Analytics
          </h2>
          <p className="text-xs text-neutral-500">
            Booking fulfillment velocities, popular service margins, staff specialist revenues, and cancellation rates.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Time range selector */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-semibold">
            {(['today', '7days', '30days', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer capitalize ${
                  timeRange === range
                    ? 'bg-white dark:bg-[#12151b] text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : range}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Gross Bookings Value</div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">
            KES {totalGrossKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Across {totalVolume} total reservations
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Settled Revenue (KES)</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            KES {completedRevenueKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            {completedCount} fulfilled appointments
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Fulfillment Rate</div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">
            {fulfillmentRate}%
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
            {confirmedCount} upcoming confirmed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Cancellation / No-Show Rate</div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {cancellationRate}%
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {cancelledCount} cancelled · {noShowCount} no-show
          </div>
        </div>
      </div>

      {/* Split Grid: Popular Services & Staff Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services Table */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Service Volume &amp; Revenue Ranking
            </h3>
            <span className="text-xs text-neutral-500">Top Offerings</span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {serviceStats.map((item, idx) => (
              <div key={item.service.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-400 text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">
                      {item.service.name}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {item.service.categoryName} · {item.service.durationMinutes} mins
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-neutral-900 dark:text-white">
                    KES {item.revenueKes.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {item.count} bookings
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Specialist Performance Leaderboard */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Specialist Performance &amp; Revenue Share
            </h3>
            <span className="text-xs text-neutral-500">Staff Leaderboard</span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {staffStats.map((item, idx) => (
              <div key={item.staff.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.staff.avatar}
                    alt={item.staff.name}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                  />
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">
                      {item.staff.name}
                    </div>
                    <div className="text-[11px] text-neutral-500">{item.staff.title}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-neutral-900 dark:text-white">
                    KES {item.revenueKes.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    {item.total} appointments (★ {item.staff.rating})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
