<x-layouts.app title="Notifications">
    <div class="space-y-6 max-w-4xl">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold font-heading text-slate-900 tracking-tight">System & App Notifications</h1>
                <p class="text-xs text-slate-500 mt-1">Real-time alerts across your Paperglow modules.</p>
            </div>
            <form action="{{ route('notifications.read-all') }}" method="POST">
                @csrf
                <button type="submit" class="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold">
                    Mark All as Read
                </button>
            </form>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl shadow-xs divide-y divide-slate-100">
            @forelse($notifications as $notif)
                <div class="p-4 flex items-start justify-between gap-4 {{ $notif->read_at ? 'opacity-70 bg-slate-50/50' : 'bg-white' }}">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider {{ $notif->category === 'finance' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700' }}">
                                {{ $notif->category }}
                            </span>
                            <span class="text-xs font-bold text-slate-900">{{ $notif->title }}</span>
                        </div>
                        <p class="text-xs text-slate-600 mb-1 leading-relaxed">{{ $notif->message }}</p>
                        <span class="text-[10px] text-slate-400">{{ $notif->created_at->diffForHumans() }}</span>
                    </div>

                    @if(!$notif->read_at)
                        <form action="{{ route('notifications.read', $notif) }}" method="POST">
                            @csrf
                            <button type="submit" class="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-md shrink-0">
                                Dismiss
                            </button>
                        </form>
                    @endif
                </div>
            @empty
                <div class="p-8 text-center text-slate-400 text-sm">
                    No notifications yet.
                </div>
            @endforelse
        </div>

        <div>
            {{ $notifications->links() }}
        </div>
    </div>
</x-layouts.app>
