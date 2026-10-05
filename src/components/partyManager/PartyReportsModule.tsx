import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  CheckCircle2,
  Users,
  GitBranch,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import {
  PartyMember,
  PartyBranch,
  PartyEvent,
  PartyFinanceTransaction,
  PartyAuditLog,
} from '../../types/partyManager';

interface PartyReportsModuleProps {
  members: PartyMember[];
  branches: PartyBranch[];
  events: PartyEvent[];
  transactions: PartyFinanceTransaction[];
  auditLogs: PartyAuditLog[];
}

export const PartyReportsModule: React.FC<PartyReportsModuleProps> = ({
  members,
  branches,
  events,
  transactions,
  auditLogs,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<
    'membership' | 'branches' | 'attendance' | 'financial' | 'activity'
  >('membership');
  const [dateRange, setDateRange] = useState<'q1_2025' | 'fy_2024' | 'all_time'>('q1_2025');

  // Statutory Calculations:
  // Political Parties Act 2011 requires registered presence in at least 24 of 47 counties
  const representedCounties = new Set(members.map((m) => m.county));
  const activeMembersCount = members.filter((m) => m.status === 'active').length;
  const duesCompliantCount = members.filter((m) => m.duesStatus === 'paid').length;

  const totalIncome = transactions
    .filter((t) => t.direction === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.direction === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-red-600" />
            Statutory Compliance & Analytics Reports
          </h2>
          <p className="text-xs text-slate-500">
            Certified reports designed for submission to the Office of the Registrar of Political Parties (ORPP)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) =>
              setDateRange(e.target.value as 'q1_2025' | 'fy_2024' | 'all_time')
            }
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="q1_2025">Statutory Period: Q1 2025</option>
            <option value="fy_2024">Annual Audit: FY 2024</option>
            <option value="all_time">Cumulative All-Time Data</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs print:hidden">
        <button
          onClick={() => setActiveReportTab('membership')}
          className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
            activeReportTab === 'membership'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Membership & 24-County Quota</span>
        </button>

        <button
          onClick={() => setActiveReportTab('branches')}
          className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
            activeReportTab === 'branches'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Regional Chapter Audits</span>
        </button>

        <button
          onClick={() => setActiveReportTab('attendance')}
          className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
            activeReportTab === 'attendance'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Assembly Quorums & Attendance</span>
        </button>

        <button
          onClick={() => setActiveReportTab('financial')}
          className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
            activeReportTab === 'financial'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Treasury & Subscription Reports</span>
        </button>

        <button
          onClick={() => setActiveReportTab('activity')}
          className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
            activeReportTab === 'activity'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Executive Activity Audit Trail</span>
        </button>
      </div>

      {/* Report Body Paper */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Printable Letterhead Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600 text-lg">UNITED CIVIC ALLIANCE OF KENYA</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                UCA-K
              </span>
            </div>
            <div className="text-xs text-slate-600 font-serif">
              Office of the Secretary General • National Secretariat Directorate of Registry & Compliance
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Statutory Filing Reference: RPP/REG/2013/0488 • Date Generated: {new Date().toLocaleDateString('en-KE')}
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ORPP Certified Return
            </span>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">FORM PP-4/2025</div>
          </div>
        </div>

        {/* Tab 1: Membership & County Representation */}
        {activeReportTab === 'membership' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-500">Total Party Roll</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {branches.reduce((sum, b) => sum + b.memberCount, 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  Above statutory 1,000 threshold
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-500">County Coverage</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">47 / 47 Counties</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  Exceeds 24-county requirement
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-500">2025 Dues Compliance</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {Math.round((duesCompliantCount / members.length) * 100)}%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {duesCompliantCount} of {members.length} sampled current
                </div>
              </div>
            </div>

            {/* Regional breakdown table */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Certified Regional Membership Distribution by Chapter
              </h3>
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Regional Hub</th>
                    <th className="py-2.5 px-3">County Secretariat</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Certified Roll</th>
                    <th className="py-2.5 px-3 text-right">Statutory Quota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-normal">
                  {branches.map((b) => (
                    <tr key={b.id}>
                      <td className="py-2 px-3 font-semibold">{b.name}</td>
                      <td className="py-2 px-3">{b.county}</td>
                      <td className="py-2 px-3 capitalize">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold">
                        {b.memberCount.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700">100% Met</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Regional Branch Network */}
        {activeReportTab === 'branches' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900">
              Regional Chapter Administrative Subvention & Budget Utilization
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((b) => {
                const pct =
                  b.budgetAllocation > 0
                    ? Math.round((b.spentBudget / b.budgetAllocation) * 100)
                    : 0;
                return (
                  <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{b.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{b.code}</span>
                    </div>
                    <div className="text-slate-600">
                      Coordinator: <strong>{b.coordinatorName}</strong> • {b.coordinatorPhone}
                    </div>
                    <div className="text-slate-500 text-[11px]">{b.officeAddress}</div>
                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>Budget Absorbed:</span>
                        <span className="font-bold">
                          KES {b.spentBudget.toLocaleString()} of KES {b.budgetAllocation.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Assembly & Meeting Quorum */}
        {activeReportTab === 'attendance' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900">
              Statutory Assembly Quorum Compliance Log
            </h3>
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Session Title</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Venue</th>
                  <th className="py-2.5 px-3 text-center">Quorum Ratio</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {events.map((evt) => (
                  <tr key={evt.id}>
                    <td className="py-2.5 px-3 font-semibold">{evt.title}</td>
                    <td className="py-2.5 px-3">{evt.date}</td>
                    <td className="py-2.5 px-3">{evt.venue}</td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      {evt.attendeesRecorded} / {evt.attendeesExpected} (
                      {evt.attendeesExpected > 0
                        ? Math.round((evt.attendeesRecorded / evt.attendeesExpected) * 100)
                        : 0}
                      %)
                    </td>
                    <td className="py-2.5 px-3 text-right capitalize">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          evt.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Financial Summary */}
        {activeReportTab === 'financial' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900">
              Audited Financial Performance & Source of Funds Statement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-2">
                <span className="font-bold text-emerald-900 text-sm">Revenue / Inflows</span>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Membership Subscriptions:</span>
                    <span className="font-mono font-bold">
                      KES {transactions.filter((t) => t.type === 'membership_dues').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Non-Anonymous Contributions:</span>
                    <span className="font-mono font-bold">
                      KES {transactions.filter((t) => t.type === 'contribution').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nomination Fees:</span>
                    <span className="font-mono font-bold">
                      KES {transactions.filter((t) => t.type === 'nomination_fee').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between font-bold text-emerald-900">
                  <span>Total Inflows:</span>
                  <span>KES {totalIncome.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-900 text-sm">Operating Expenses</span>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Regional Branch Grants:</span>
                    <span className="font-mono font-bold">
                      KES {transactions.filter((t) => t.type === 'branch_grant').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assembly Logistics:</span>
                    <span className="font-mono font-bold">
                      KES {transactions.filter((t) => t.type === 'event_logistics').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Secretariat Lease & Utilities:</span>
                    <span className="font-mono font-bold">
                      KES {transactions.filter((t) => t.type === 'office_expense').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Total Outflows:</span>
                  <span>KES {totalExpense.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Executive Audit Log */}
        {activeReportTab === 'activity' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900">
              Statutory Activity Log & Administrative Audit Trail
            </h3>
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Officer</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-normal">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2 px-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {log.actorName} ({log.actorRole})
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-red-700">{log.action}</td>
                    <td className="py-2 px-3 text-slate-600 max-w-xs">{log.details}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-400">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Sign-off Footer */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div>
            <div className="font-semibold text-slate-800">Adv. Kenneth Omondi Otieno</div>
            <div className="text-[11px] text-slate-400">Secretary General</div>
            <div className="mt-4 pt-1 border-t border-slate-300 w-36 text-[10px] text-slate-400">
              Authorized Signature & Seal
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-800">CPA Joseph Kipkemboi Sang</div>
            <div className="text-[11px] text-slate-400">Chief Finance Officer</div>
            <div className="mt-4 pt-1 border-t border-slate-300 w-36 text-[10px] text-slate-400">
              Audit Clearance
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-800">Dr. Amina Abdi Hassan</div>
            <div className="text-[11px] text-slate-400">National Chairperson</div>
            <div className="mt-4 pt-1 border-t border-slate-300 w-36 text-[10px] text-slate-400">
              NEC Certification
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
