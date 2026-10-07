<x-layouts.app title="Applications Catalog">
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold font-heading text-slate-900 tracking-tight">Paperglow Applications Catalog</h1>
                <p class="text-xs text-slate-500 mt-1">Manage subscribed software modules for <strong class="text-slate-800">{{ $currentOrg->name }}</strong>.</p>
            </div>
            <div class="text-xs text-slate-500">
                Billing Cycle: <span class="font-semibold text-slate-800">Monthly in KES</span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @foreach($apps as $app)
                @php
                    $isSubscribed = isset($subscriptions[$app->slug]) && in_array($subscriptions[$app->slug]->status, ['active', 'trial']);
                @endphp
                <div class="bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all {{ $isSubscribed ? 'border-slate-300 ring-1 ring-slate-200' : 'border-slate-200 opacity-90' }}">
                    <div>
                        <div class="flex items-start justify-between gap-3 mb-2">
                            <div>
                                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{{ $app->category }}</span>
                                <h3 class="text-base font-bold font-heading text-slate-900">{{ $app->name }}</h3>
                            </div>
                            @if($isSubscribed)
                                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">Subscribed</span>
                            @else
                                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">Available</span>
                            @endif
                        </div>
                        <p class="text-xs text-slate-500 mb-4 line-clamp-3 leading-relaxed">{{ $app->description }}</p>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <div class="text-[11px] text-slate-400">Monthly Plan</div>
                            <div class="text-sm font-bold text-slate-900 font-heading">KES {{ number_format($app->monthly_price_kes, 0) }}</div>
                        </div>

                        <div class="flex items-center gap-2">
                            @if($isSubscribed)
                                <a href="{{ url('/apps/' . $app->slug) }}" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold">
                                    Open
                                </a>
                            @endif
                            <form action="{{ route('catalog.toggle', $app->slug) }}" method="POST">
                                @csrf
                                <button type="submit" class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors {{ $isSubscribed ? 'border-slate-300 text-slate-600 hover:bg-slate-50' : 'bg-red-600 hover:bg-red-700 text-white border-red-600' }}">
                                    {{ $isSubscribed ? 'Disable' : 'Subscribe' }}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</x-layouts.app>
