import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Calendar,
  Building,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Download,
  Users,
  Eye,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  Property,
  Unit,
  Tenant,
  RentPayment,
  PropertyExpense,
  Lease,
} from '../../types/propertyManager';

interface PMReportsModuleProps {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  leases: Lease[];
  payments: RentPayment[];
  expenses: PropertyExpense[];
}

export const PMReportsModule: React.FC<PMReportsModuleProps> = ({
  properties,
  units,
  tenants,
  leases,
  payments,
  expenses,
}) => {
  const [dateRange, setDateRange] = useState<'this_month' | 'last_month' | 'quarter' | 'year'>('this_month');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [statementTenantId, setStatementTenantId] = useState<string>(tenants[0]?.id || '');
  const [isPreviewStatementOpen, setIsPreviewStatementOpen] = useState(false);

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  // Date Filtering Calculation
  const filteredPayments = payments.filter((p) => {
    if (selectedPropertyId !== 'all' && p.propertyId !== selectedPropertyId) return false;
    if (dateRange === 'this_month') return p.monthFor === 'October 2026';
    if (dateRange === 'last_month') return p.monthFor === 'September 2026';
    return true; // quarter and year include all demo records
  });

  const filteredExpenses = expenses.filter((e) => {
    if (selectedPropertyId !== 'all' && e.propertyId !== selectedPropertyId) return false;
    if (dateRange === 'this_month') return e.expenseDate.startsWith('2026-10');
    if (dateRange === 'last_month') return e.expenseDate.startsWith('2026-09');
    return true;
  });

  const totalGrossIncome = filteredPayments.reduce((sum, p) => sum + p.amountKes, 0);
  const totalOperatingExpenses = filteredExpenses.reduce((sum, e) => sum + e.amountKes, 0);
  const netOperatingIncome = totalGrossIncome - totalOperatingExpenses;
  const netMargin = totalGrossIncome > 0 ? Math.round((netOperatingIncome / totalGrossIncome) * 100) : 0;

  // Selected tenant for statement
  const statementTenant = tenants.find((t) => t.id === statementTenantId) || tenants[0];
  const tenantProperty = properties.find((p) => p.id === statementTenant?.propertyId);
  const tenantUnit = units.find((u) => u.id === statementTenant?.unitId);
  const tenantLease = leases.find((l) => l.tenantId === statementTenant?.id);
  const tenantPayments = payments.filter((p) => p.tenantId === statementTenant?.id);

  return (
    <div className="space-y-6">
      {/* Module Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Financial Statements &amp; Executive Analytics
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Gross rental collections, operational expense breakdown, net operating income (NOI), and official tenant statements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Property Filter */}
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="text-xs bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-neutral-800 dark:text-neutral-200"
          >
            <option value="all">Consolidated Portfolio</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Date Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setDateRange('this_month')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                dateRange === 'this_month'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRange('last_month')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                dateRange === 'last_month'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setDateRange('quarter')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                dateRange === 'quarter'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              Q3/Q4
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                dateRange === 'year'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              Year-to-Date
            </button>
          </div>
        </div>
      </div>

      {/* Financial Overview 3-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Gross Income */}
        <div className="p-5 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Gross Rent Collected</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums">
            {formatKes(totalGrossIncome)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            From {filteredPayments.length} verified transactions
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="p-5 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Operating Expenditures</span>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-2 tabular-nums">
            {formatKes(totalOperatingExpenses)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Across {filteredExpenses.length} maintenance &amp; utility vouchers
          </div>
        </div>

        {/* Net Operating Income */}
        <div className="p-5 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Net Operating Income (NOI)</span>
            <DollarSign className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2 tabular-nums">
            {formatKes(netOperatingIncome)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Operating Net Margin: <strong>{netMargin}%</strong>
          </div>
        </div>
      </div>

      {/* Occupancy and Building Performance Matrix */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
          Estate Occupancy &amp; Revenue Contribution
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
              <tr>
                <th className="py-2.5 px-3">Estate Property</th>
                <th className="py-2.5 px-3">Total Units</th>
                <th className="py-2.5 px-3">Occupied</th>
                <th className="py-2.5 px-3">Occupancy Rate</th>
                <th className="py-2.5 px-3">Gross Potential</th>
                <th className="py-2.5 px-3">Actual Collected</th>
                <th className="py-2.5 px-3 text-right">Collection Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {properties.map((prop) => {
                const propUnits = units.filter((u) => u.propertyId === prop.id);
                const propOccupied = propUnits.filter((u) => u.status === 'occupied').length;
                const occRate = propUnits.length > 0 ? Math.round((propOccupied / propUnits.length) * 100) : 0;
                const potential = propUnits.reduce((acc, u) => acc + u.monthlyRentKes, 0);
                const collected = payments
                  .filter((p) => p.propertyId === prop.id && p.monthFor === 'October 2026')
                  .reduce((acc, p) => acc + p.amountKes, 0);
                const collRate = potential > 0 ? Math.round((collected / potential) * 100) : 0;

                return (
                  <tr key={prop.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                      {prop.name}
                      <div className="text-[10px] text-neutral-400 font-normal">{prop.location}</div>
                    </td>
                    <td className="py-3 px-3 font-mono">{propUnits.length}</td>
                    <td className="py-3 px-3 font-mono text-emerald-600 font-semibold">{propOccupied}</td>
                    <td className="py-3 px-3 font-mono tabular-nums">{occRate}%</td>
                    <td className="py-3 px-3 font-mono tabular-nums">{formatKes(potential)}</td>
                    <td className="py-3 px-3 font-mono font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                      {formatKes(collected)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-emerald-600">
                      {collRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant Statement Generator Section */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Individual Tenant Account Statements
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Generate printable, verified debit/credit ledger statement for any tenant.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={statementTenantId}
              onChange={(e) => setStatementTenantId(e.target.value)}
              className="text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Unit {units.find((u) => u.id === t.unitId)?.unitNumber})
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsPreviewStatementOpen(true)}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Statement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Full Printable Tenant Statement */}
      {isPreviewStatementOpen && statementTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Printable Tenant Ledger Statement
              </span>
              <button
                onClick={() => setIsPreviewStatementOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* A4 Statement Preview Body */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 text-neutral-900 text-xs font-sans space-y-4">
              {/* Official Header */}
              <div className="flex justify-between items-start pb-4 border-b border-neutral-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-600 rounded-sm" />
                    <span className="font-bold text-base font-['Poppins'] tracking-tight">
                      Paperglow Premier Property Management Ltd
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Upper Hill Commercial Hub, P.O. Box 48912-00100 Nairobi, Kenya
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Tel: +254 722 000 111 · KRA PIN: P051982736Z
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase font-bold tracking-wider text-red-600">
                    TENANT STATEMENT
                  </span>
                  <div className="text-neutral-400 font-mono text-[10px] mt-0.5">
                    Date: {new Date().toLocaleDateString('en-KE')}
                  </div>
                </div>
              </div>

              {/* Statement Target Info */}
              <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    TENANT ACCOUNT
                  </span>
                  <div className="font-bold text-sm text-neutral-900 mt-0.5">
                    {statementTenant.name}
                  </div>
                  <div className="text-neutral-600">Phone: {statementTenant.phone}</div>
                  <div className="text-neutral-600">National ID: {statementTenant.nationalIdOrPassport}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    DEMISED PREMISES
                  </span>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    Unit {tenantUnit?.unitNumber} ({tenantUnit?.unitType})
                  </div>
                  <div className="text-neutral-600">{tenantProperty?.name}</div>
                  <div className="text-neutral-600">Monthly Rent: {formatKes(tenantUnit?.monthlyRentKes || 0)}</div>
                </div>
              </div>

              {/* Ledger Table */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  TRANSACTIONS &amp; BILLINGS LEDGER
                </span>
                <table className="w-full text-left text-xs border border-neutral-200">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Ref Code</th>
                      <th className="p-2 text-right">Debit (KES)</th>
                      <th className="p-2 text-right">Credit (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-mono text-[11px]">
                    <tr>
                      <td className="p-2">2026-09-01</td>
                      <td className="p-2 font-sans">September 2026 Rent Billing</td>
                      <td className="p-2">INV-SEP-09</td>
                      <td className="p-2 text-right tabular-nums">{formatKes(tenantUnit?.monthlyRentKes || 0)}</td>
                      <td className="p-2 text-right tabular-nums">-</td>
                    </tr>
                    <tr>
                      <td className="p-2">2026-09-02</td>
                      <td className="p-2 font-sans">September Rent Payment (M-Pesa)</td>
                      <td className="p-2 text-neutral-600">QJA119208X</td>
                      <td className="p-2 text-right tabular-nums">-</td>
                      <td className="p-2 text-right text-emerald-600 font-semibold tabular-nums">
                        {formatKes(tenantUnit?.monthlyRentKes || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2">2026-10-01</td>
                      <td className="p-2 font-sans">October 2026 Rent Billing</td>
                      <td className="p-2">INV-OCT-10</td>
                      <td className="p-2 text-right tabular-nums">{formatKes(tenantUnit?.monthlyRentKes || 0)}</td>
                      <td className="p-2 text-right tabular-nums">-</td>
                    </tr>
                    {tenantPayments
                      .filter((p) => p.monthFor === 'October 2026')
                      .map((pay) => (
                        <tr key={pay.id}>
                          <td className="p-2">{pay.paymentDate}</td>
                          <td className="p-2 font-sans">October Rent Payment ({pay.paymentMethod.toUpperCase()})</td>
                          <td className="p-2 text-neutral-600">{pay.transactionReference}</td>
                          <td className="p-2 text-right tabular-nums">-</td>
                          <td className="p-2 text-right text-emerald-600 font-semibold tabular-nums">
                            {formatKes(pay.amountKes)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Running Balance Summary Box */}
              <div className="flex justify-end pt-2">
                <div className="w-64 p-3 bg-neutral-50 rounded border border-neutral-200 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Security Deposit Held:</span>
                    <span className="font-mono font-medium">{formatKes(tenantUnit?.depositKes || 0)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-neutral-200">
                    <span className="font-bold text-neutral-900">Current Balance:</span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        statementTenant.balanceKes > 0 ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {formatKes(statementTenant.balanceKes)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 text-center text-[10px] text-neutral-400">
                This statement is an official accounting ledger generated by Paperglow Property Management platform.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Statement (A4)</span>
              </button>

              <button
                onClick={() => setIsPreviewStatementOpen(false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
