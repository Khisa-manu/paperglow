import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { Ticket, TicketCategory, StaffMember } from '../../types/ticketing';

interface ReportsModuleProps {
  tickets: Ticket[];
  categories: TicketCategory[];
  staffMembers: StaffMember[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  tickets,
  categories,
  staffMembers,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'quarter'>('30days');

  // Multiplier or simulated slice based on time range
  const totalVolume = tickets.length * (timeRange === 'today' ? 1 : timeRange === '7days' ? 3 : timeRange === '30days' ? 8 : 24);
  const resolvedCount = Math.round(totalVolume * 0.78);
  const openCount = totalVolume - resolvedCount;
  const slaAdherence = 96.4;
  const avgResolutionHours = 2.7;
  const firstContactResolution = 74.2;

  const handleExportCSV = () => {
    alert(`Exporting Support SLA & Volume Report (${timeRange}) as CSV spreadsheet.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
            Support Performance & Analytics
          </h2>
          <p className="text-xs text-neutral-500">
            Resolution velocity, SLA adherence %, staff performance leaderboard, and ticket volume breakdown
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Time range selector */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-xs">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeRange === 'today'
                  ? 'bg-white dark:bg-[#12151b] font-bold text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeRange === '7days'
                  ? 'bg-white dark:bg-[#12151b] font-bold text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeRange === '30days'
                  ? 'bg-white dark:bg-[#12151b] font-bold text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeRange === 'quarter'
                  ? 'bg-white dark:bg-[#12151b] font-bold text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              This Quarter
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Total Ticket Inbound</span>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums mt-1">
            {totalVolume}
          </p>
          <span className="text-[11px] text-emerald-600 flex items-center space-x-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% vs previous period</span>
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Resolution Rate</span>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums mt-1">
            78.4%
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            {resolvedCount} resolved · {openCount} active
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">Average Resolution Velocity</span>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums mt-1">
            {avgResolutionHours}h
          </p>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            Target SLA: ≤ 4.0h (Outperforming)
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <span className="text-xs text-neutral-500 block">SLA Compliance Rate</span>
          <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
            {slaAdherence}%
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            FCR: {firstContactResolution}%
          </span>
        </div>
      </div>

      {/* Main Analysis: Open vs Resolved & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open vs Resolved Volume Trends */}
        <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Open vs. Resolved Trajectory
          </h3>
          <p className="text-xs text-neutral-500">Weekly ticket volume comparison</p>

          <div className="space-y-3 pt-2">
            {[
              { period: 'Week 1', open: 18, resolved: 42, total: 60 },
              { period: 'Week 2', open: 22, resolved: 54, total: 76 },
              { period: 'Week 3', open: 14, resolved: 68, total: 82 },
              { period: 'Week 4 (Current)', open: 12, resolved: 48, total: 60 },
            ].map((wk, i) => {
              const resPercent = Math.round((wk.resolved / wk.total) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {wk.period}
                    </span>
                    <span className="text-neutral-500 tabular-nums">
                      {wk.resolved} Resolved / {wk.open} Open ({resPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded flex overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full"
                      style={{ width: `${resPercent}%` }}
                    />
                    <div
                      className="bg-red-600 h-full"
                      style={{ width: `${100 - resPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-6 pt-3 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-emerald-600 rounded-xs" />
              <span>Resolved Tickets</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-red-600 rounded-xs" />
              <span>Open Backlog</span>
            </span>
          </div>
        </div>

        {/* Category Performance Matrix */}
        <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Category Breakdown & SLA Adherence
          </h3>
          <p className="text-xs text-neutral-500">Distribution and compliance across support channels</p>

          <div className="space-y-3 pt-2">
            {categories.map((cat) => {
              const count = tickets.filter((t) => t.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="p-2.5 bg-neutral-50 dark:bg-[#181c24] rounded flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">{cat.name}</p>
                    <p className="text-[11px] text-neutral-500">
                      Response Target: {cat.slaResponseHours}h · Resolution: {cat.slaResolutionHours}h
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-neutral-900 dark:text-white tabular-nums block">
                      {count} tickets
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold tabular-nums">
                      97.8% SLA Met
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Staff Leaderboard Table */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Support Staff Performance Leaderboard
            </h3>
            <p className="text-xs text-neutral-500">
              Agent productivity, resolution speeds, and customer satisfaction metrics
            </p>
          </div>
          <Award className="w-5 h-5 text-amber-500" />
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-[#181c24] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
            <tr>
              <th className="py-3 px-4">Support Agent</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3 text-center">Resolved Count</th>
              <th className="py-3 px-3 text-center">Avg Resolution Time</th>
              <th className="py-3 px-3 text-center">SLA Compliance</th>
              <th className="py-3 px-4 text-right">CSAT Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {staffMembers.map((staff, idx) => (
              <tr key={staff.id} className="hover:bg-neutral-50/80 dark:hover:bg-[#181c24]/80">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-neutral-400 font-bold tabular-nums w-4">
                      #{idx + 1}
                    </span>
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">{staff.name}</p>
                      <p className="text-[10px] text-neutral-500">{staff.email}</p>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                  {staff.role}
                </td>

                <td className="py-3 px-3 text-center font-bold text-neutral-900 dark:text-white tabular-nums">
                  {staff.resolvedCount}
                </td>

                <td className="py-3 px-3 text-center font-medium text-neutral-700 dark:text-neutral-300 tabular-nums">
                  {staff.avgResolutionHours}h
                </td>

                <td className="py-3 px-3 text-center font-semibold text-emerald-600 tabular-nums">
                  {98 - idx * 1.5}%
                </td>

                <td className="py-3 px-4 text-right font-bold text-amber-500 tabular-nums">
                  {(4.9 - idx * 0.1).toFixed(1)} / 5.0
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
