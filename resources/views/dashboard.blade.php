<x-layouts.app title="Workspace Dashboard">
    <div class="space-y-6">
        <!-- Top Workspace Greeting & Context -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mb-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    <span>Live Multi-Tenant MariaDB Production</span>
                </div>
                <h1 class="text-2xl font-bold font-heading text-slate-900 tracking-tight">{{ $org->name }}</h1>
                <p class="text-xs text-slate-500 mt-1">
                    {{ $org->city }}, Kenya &bull; Currency: <strong class="text-slate-700 font-semibold">KES</strong> &bull; Tax ID: <strong class="text-slate-700">{{ $org->tax_id ?? 'KRA PIN on file' }}</strong>
                </p>
            </div>
            <div class="flex items-center gap-2">
                <a href="{{ route('catalog.index') }}" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    <span>Manage Applications</span>
                </a>
                <a href="{{ route('organizations.members') }}" class="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
                    <span>Manage Team</span>
                </a>
            </div>
        </div>

        <!-- 4 Major KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Revenue -->
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Paid Invoiced Revenue</div>
                <div class="text-2xl font-bold font-heading text-slate-900">KES {{ number_format($totalRevenueKes, 0) }}</div>
                <div class="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <span>&bull;</span> {{ $totalInvoicesCount }} sales documents issued
                </div>
            </div>

            <!-- Customers -->
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Customers</div>
                <div class="text-2xl font-bold font-heading text-slate-900">{{ number_format($totalCustomers) }}</div>
                <div class="text-xs text-slate-500 font-medium mt-1">
                    <a href="{{ route('apps.business-manager', ['tab' => 'customers']) }}" class="text-red-600 hover:underline">View customer directory &rarr;</a>
                </div>
            </div>

            <!-- Real Estate -->
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Properties & Tenants</div>
                <div class="text-2xl font-bold font-heading text-slate-900">{{ $totalTenants }} <span class="text-sm font-normal text-slate-500">Tenants</span></div>
                <div class="text-xs text-slate-500 font-medium mt-1">
                    Across {{ $totalProperties }} managed estates
                </div>
            </div>

            <!-- Community & Support -->
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Support & Appointments</div>
                <div class="text-2xl font-bold font-heading text-slate-900">{{ $openTicketsCount }} <span class="text-sm font-normal text-slate-500">Tickets</span></div>
                <div class="text-xs text-slate-500 font-medium mt-1">
                    {{ $upcomingBookingsCount }} scheduled bookings
                </div>
            </div>
        </div>

        <!-- Subscribed Applications Launchpad -->
        <div>
            <div class="flex items-center justify-between mb-3">
                <h2 class="text-base font-bold font-heading text-slate-900">Your Active SaaS Applications</h2>
                <a href="{{ route('catalog.index') }}" class="text-xs font-semibold text-red-600 hover:text-red-700">Browse Full Catalog &rarr;</a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                @forelse($availableApps as $app)
                    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                        <div>
                            <div class="flex items-start justify-between gap-3 mb-2">
                                <h3 class="font-bold text-slate-900 text-sm font-heading">{{ $app->name }}</h3>
                                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                            </div>
                            <p class="text-xs text-slate-500 mb-4 line-clamp-2">{{ $app->description }}</p>
                        </div>
                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span class="text-[11px] font-medium text-slate-400">{{ $app->category }}</span>
                            <a href="{{ url('/apps/' . $app->slug) }}" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors">
                                Open App &rarr;
                            </a>
                        </div>
                    </div>
                @empty
                    <div class="col-span-full p-8 text-center bg-white border border-slate-200 rounded-xl">
                        <p class="text-sm text-slate-500">No applications subscribed yet.</p>
                        <a href="{{ route('catalog.index') }}" class="mt-3 inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold">Enable Applications</a>
                    </div>
                @endforelse
            </div>
        </div>

        <!-- 2 Column Section: Recent Invoices & Audit Trail -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Sales Invoices -->
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold font-heading text-slate-900 text-sm">Recent Sales Documents</h3>
                    <a href="{{ route('apps.business-manager') }}" class="text-xs font-semibold text-red-600 hover:text-red-700">View All</a>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-left">
                        <thead class="text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px]">
                            <tr>
                                <th class="pb-2">Doc #</th>
                                <th class="pb-2">Customer</th>
                                <th class="pb-2 text-right">Amount (KES)</th>
                                <th class="pb-2 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-slate-700">
                            @forelse($recentInvoices as $inv)
                                <tr class="hover:bg-slate-50">
                                    <td class="py-2.5 font-semibold text-slate-900">{{ $inv->document_number }}</td>
                                    <td class="py-2.5 truncate max-w-[120px]">{{ $inv->customer_name }}</td>
                                    <td class="py-2.5 text-right font-medium">{{ number_format($inv->grand_total, 2) }}</td>
                                    <td class="py-2.5 text-right">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold {{ $inv->status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' }}">
                                            {{ ucfirst($inv->status) }}
                                        </span>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="py-4 text-center text-slate-400">No documents issued yet.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Audit Trail -->
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold font-heading text-slate-900 text-sm">Workspace Audit Trail</h3>
                    <a href="{{ route('audit-logs.index') }}" class="text-xs font-semibold text-red-600 hover:text-red-700">Full Log</a>
                </div>
                <div class="space-y-3">
                    @forelse($recentAudits as $log)
                        <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-3">
                            <div>
                                <div class="font-semibold text-slate-900">{{ str_replace('_', ' ', $log->action) }}</div>
                                <div class="text-[11px] text-slate-500 mt-0.5">{{ $log->details }}</div>
                            </div>
                            <span class="text-[10px] text-slate-400 shrink-0">{{ $log->created_at->diffForHumans() }}</span>
                        </div>
                    @empty
                        <div class="p-4 text-center text-slate-400 text-xs">No activity logged yet.</div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</x-layouts.app>
