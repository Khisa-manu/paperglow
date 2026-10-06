import React, { useState } from 'react';
import { AppScreenshot } from '../types';
import { CheckCircle2, Clock, DollarSign, FileText, Filter, MoreHorizontal, Plus, Search, Shield, User } from 'lucide-react';

interface AppScreenshotsViewerProps {
  screenshots: AppScreenshot[];
  appName: string;
}

export const AppScreenshotsViewer: React.FC<AppScreenshotsViewerProps> = ({
  screenshots,
  appName,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const current = screenshots[activeTab] || screenshots[0];

  if (!current) return null;

  return (
    <div className="space-y-4">
      {/* Screenshot Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        {screenshots.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(idx)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === idx
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <span>{s.badge}</span>
            <span className="text-[10px] opacity-75">({s.title})</span>
          </button>
        ))}
      </div>

      {/* Screen Frame with Window Controls */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121419] overflow-hidden shadow-xs">
        {/* macOS / Application Title Bar */}
        <div className="px-4 py-2.5 bg-neutral-100 dark:bg-[#181c24] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              workspace.paperglow.io / {appName.toLowerCase().replace(/\s+/g, '-')}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500">
            {current.title}
          </span>
        </div>

        {/* Viewport UI Mockup depending on previewType */}
        <div className="p-4 sm:p-6 min-h-[320px] bg-neutral-50/50 dark:bg-[#101216]">
          {current.previewType === 'invoice' && (
            <div className="space-y-4 max-w-xl mx-auto bg-white dark:bg-[#161a22] p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div>
                  <div className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                    INVOICE #PG-2026-084
                  </div>
                  <div className="text-neutral-500 mt-0.5">Issued: Oct 5, 2026 • Due in 14 days</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold uppercase text-[10px]">
                  Pending Payment
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <div className="font-semibold text-neutral-500 uppercase text-[10px]">Billed To:</div>
                  <div className="font-bold text-neutral-800 dark:text-neutral-200">Apex Holdings Corp</div>
                  <div className="text-neutral-500">billing@apexcorp.com</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-neutral-500 uppercase text-[10px]">Payable Via:</div>
                  <div className="font-medium text-neutral-700 dark:text-neutral-300">Direct ACH / Stripe Credit Card</div>
                  <div className="text-red-600 font-semibold">1-Click Client Pay Link Active</div>
                </div>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] uppercase">
                    <tr>
                      <th className="p-2">Description</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Rate</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-mono text-[11px]">
                    <tr>
                      <td className="p-2 font-sans font-medium text-neutral-800 dark:text-neutral-200">
                        Monthly Retainer - Platform Operations
                      </td>
                      <td className="p-2 text-right">1</td>
                      <td className="p-2 text-right">$4,500.00</td>
                      <td className="p-2 text-right font-bold">$4,500.00</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-neutral-800 dark:text-neutral-200">
                        Custom Team Uniform Design Asset Kit
                      </td>
                      <td className="p-2 text-right">1</td>
                      <td className="p-2 text-right">$850.00</td>
                      <td className="p-2 text-right font-bold">$850.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2 border-t border-neutral-200 dark:border-neutral-800 text-right">
                <div className="space-y-1">
                  <div className="text-neutral-500">Subtotal: $5,350.00</div>
                  <div className="text-neutral-500">Tax (0.0%): $0.00</div>
                  <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    Total Due: $5,350.00 USD
                  </div>
                </div>
              </div>
            </div>
          )}

          {current.previewType === 'crm' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Column 1: Qualified Leads */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between font-bold text-neutral-800 dark:text-neutral-200 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span>Qualified (3)</span>
                  <span className="font-mono text-neutral-500 text-[11px]">$24,500</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">Nexus Industrial</div>
                  <div className="text-[11px] text-neutral-500 font-mono">$12,000 • Inbound Demo</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Active touch 2h ago</div>
                </div>
                <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">Sylvan Architecture</div>
                  <div className="text-[11px] text-neutral-500 font-mono">$7,500 • Retainer Renewal</div>
                </div>
              </div>

              {/* Column 2: Proposal Sent */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between font-bold text-neutral-800 dark:text-neutral-200 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span>Proposal (2)</span>
                  <span className="font-mono text-neutral-500 text-[11px]">$42,000</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-red-200 dark:border-red-900/40 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">Solaria Logistics</div>
                  <div className="text-[11px] text-neutral-500 font-mono">$28,000 • Full Enterprise</div>
                  <div className="text-[10px] text-red-600 font-semibold">Awaiting contract signature</div>
                </div>
              </div>

              {/* Column 3: Won & Closed */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between font-bold text-neutral-800 dark:text-neutral-200 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span>Won This Month (4)</span>
                  <span className="font-mono text-emerald-600 text-[11px]">$88,400</span>
                </div>
                <div className="p-2.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">Kinetix Fitness Systems</div>
                  <div className="text-[11px] text-neutral-500 font-mono">$36,000 • Closed by Marcus</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    ✓ Transferred to Paperglow Invoice
                  </div>
                </div>
              </div>
            </div>
          )}

          {current.previewType === 'kanban' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Sprint 14: Q4 Commercial Deliverables
                  </span>
                  <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-semibold">
                    84% Complete
                  </span>
                </div>
                <span className="text-neutral-500 font-mono text-[11px]">Due in 5 days</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded bg-white dark:bg-[#161a22] border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-neutral-500">In Progress (2)</div>
                  <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                      Finalize Vinyl Event Banners Proof
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">Assigned: Sarah K. • Due Today</div>
                  </div>
                </div>

                <div className="p-3 rounded bg-white dark:bg-[#161a22] border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-neutral-500">Client Review (1)</div>
                  <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                      Brand Styleguide Deliverable v1.2
                    </div>
                    <div className="text-[10px] text-red-600 mt-1">Guest Link shared with Client CEO</div>
                  </div>
                </div>

                <div className="p-3 rounded bg-white dark:bg-[#161a22] border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-neutral-500">Completed (5)</div>
                  <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 line-through text-neutral-400">
                    <div>Apparel Screenprint Color Separation</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {current.previewType === 'team' && (
            <div className="space-y-3 text-xs bg-white dark:bg-[#161a22] p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                  Active Team Members &amp; Application Permissions
                </span>
                <span className="text-neutral-500 text-[11px]">18 of 25 seats utilized</span>
              </div>

              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">David Reynolds (You)</div>
                    <div className="text-neutral-500 text-[11px]">Managing Director • david@apexcorp.com</div>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold uppercase">
                      Super Admin
                    </span>
                    <span className="text-neutral-500">All 4 Apps Accessible</span>
                  </div>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">Elena Rostova</div>
                    <div className="text-neutral-500 text-[11px]">Head of Accounts • elena@apexcorp.com</div>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                      Finance &amp; CRM Access
                    </span>
                    <span className="text-emerald-600 font-bold">2FA Active</span>
                  </div>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">Tariq Mansour</div>
                    <div className="text-neutral-500 text-[11px]">Senior Designer • tariq@apexcorp.com</div>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                      Hub &amp; Swag Approvals
                    </span>
                    <span className="text-emerald-600 font-bold">2FA Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {current.previewType === 'contracts' && (
            <div className="space-y-4 max-w-xl mx-auto bg-white dark:bg-[#161a22] p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Commercial Master Services Agreement.pdf
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase">
                  Fully Executed
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                "In witness whereof, the parties hereto have caused this Agreement to be executed by their duly authorized representatives."
              </p>
              <div className="grid grid-cols-2 gap-3 p-3 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px]">
                <div>
                  <div className="text-neutral-500">Signer 1 (Customer):</div>
                  <div className="font-bold text-neutral-800 dark:text-neutral-200">Julian Hayes, VP Ops</div>
                  <div className="text-emerald-600 font-mono text-[10px]">Signed Oct 3, 2026 • 14:22 UTC</div>
                </div>
                <div>
                  <div className="text-neutral-500">Signer 2 (Provider):</div>
                  <div className="font-bold text-neutral-800 dark:text-neutral-200">David Reynolds, Director</div>
                  <div className="text-emerald-600 font-mono text-[10px]">Signed Oct 3, 2026 • 15:10 UTC</div>
                </div>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                <span>SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                <span className="text-red-600 font-semibold cursor-pointer">Download Certificate</span>
              </div>
            </div>
          )}

          {current.previewType === 'desk' && (
            <div className="space-y-3 text-xs bg-white dark:bg-[#161a22] p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Shared Support Inbox (3 Unassigned)
                </span>
                <span className="text-neutral-500 text-[11px]">Avg First Response: 14 mins</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      Need custom sizing guide for company hoodies
                    </div>
                    <div className="text-neutral-500 text-[11px]">From: sam@veritasbio.com • 12 mins ago</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                    Urgent
                  </span>
                </div>
                <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      Question on VAT setup for German clients
                    </div>
                    <div className="text-neutral-500 text-[11px]">From: accounts@nordiclab.de • 45 mins ago</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-medium">
                    General
                  </span>
                </div>
              </div>
            </div>
          )}

          {current.previewType === 'booking' && (
            <div className="space-y-3 text-xs bg-white dark:bg-[#161a22] p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Today's Schedule &amp; Client Appointments
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    Live Calendar
                  </span>
                </div>
                <span className="text-neutral-500 text-[11px]">KES 28,500 Gross • 6 Bookings</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      Brian Omondi
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 text-[10px] font-bold">
                      Confirmed
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500">Executive Cut &amp; Hot Towel Treatment</div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                    <span className="font-mono text-neutral-600 dark:text-neutral-400">10:30 – 11:15 • Daniel K.</span>
                    <span className="font-bold text-red-600">KES 2,500</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      Sarah Muthoni
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-[10px] font-bold">
                      Paid Deposit
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500">Deep Tissue &amp; Hot Stone Therapy</div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                    <span className="font-mono text-neutral-600 dark:text-neutral-400">14:00 – 15:00 • Mercy A.</span>
                    <span className="font-bold text-red-600">KES 5,500</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {current.previewType === 'inventory' && (
            <div className="space-y-3 text-xs bg-white dark:bg-[#161a22] p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Warehouse Inventory &amp; Stock Ledger
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    KES 465,000 Total Valuation
                  </span>
                </div>
                <span className="text-amber-600 font-bold text-[11px]">2 Items Low Stock</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      Industrial LED High-Bay Floodlight 150W (IP66)
                    </div>
                    <div className="text-neutral-500 font-mono text-[11px]">SKU: PG-INV-1001 • Barcode: 6161100348123 • Bay A</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-600 text-sm">28 Pcs In Stock</div>
                    <div className="text-neutral-400 text-[10px]">Cost: KES 4,500 | Sell: KES 6,800</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      Brushless Cordless Impact Drill 18V Kit
                    </div>
                    <div className="text-neutral-500 font-mono text-[11px]">SKU: PG-INV-1004 • Barcode: 6161100348185 • Lockable Cage</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                      Out of Stock (0 Sets)
                    </span>
                    <div className="text-neutral-400 text-[10px]">PO-8811 Pending (10 Sets)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {current.previewType === 'legal' && (
            <div className="space-y-3 text-xs bg-white dark:bg-[#161a22] p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Milimani Commercial Court Docket
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-[10px]">
                    HCCOMM/E412/2026
                  </span>
                </div>
                <span className="text-neutral-500 font-mono text-[11px]">Formal Hearing: 09:30 AM</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      Safariland Logistics Kenya vs. BlueWave Fuel Importers
                    </div>
                    <div className="text-neutral-500 text-[11px]">Courtroom 4 • Hon. Lady Justice J. W. Kamau • Claim: KES 48.5M</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Witness Trial
                    </span>
                    <div className="text-neutral-400 text-[10px] mt-0.5">David Kamau, SC</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      Filing Deadline: Trial Witness Statements Exchange
                    </div>
                    <div className="text-neutral-500 text-[11px]">Statutory e-filing deadline before trial resumption</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                      2 Days Left
                    </span>
                    <div className="text-neutral-400 text-[10px] mt-0.5">Brian Omondi Awori</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {current.previewType === 'school' && (
            <div className="space-y-3 text-xs bg-white dark:bg-[#161a22] p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Nairobi Hillview Academy • Form 4 Candidates Roll
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-[10px]">
                    NEMIS 11048821
                  </span>
                </div>
                <span className="text-emerald-600 font-mono font-bold text-[11px]">Daily Roll Call: 96% Present</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      Amani Brian Mwangi (Adm: NHA-2023-0142)
                    </div>
                    <div className="text-neutral-500 text-[11px]">Form 4 East • Pure Sciences Stream • Boarder</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                      Mean Grade: A (83.5%)
                    </span>
                    <div className="text-neutral-400 text-[10px] mt-0.5">Fees: Cleared (KES 0)</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      Faith Muthoni Wanjiku (Adm: NHA-2023-0148)
                    </div>
                    <div className="text-neutral-500 text-[11px]">Form 4 East • Pure Sciences Stream • Boarder</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Mean Grade: A (81.9%)
                    </span>
                    <div className="text-amber-600 font-mono text-[10px] mt-0.5 font-bold">Arrears: KES 12,500</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="p-3 bg-neutral-100 dark:bg-[#181c24] border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
          <span>{current.caption}</span>
          <span className="text-neutral-400 font-mono text-[10px]">Real UI View</span>
        </div>
      </div>
    </div>
  );
};
