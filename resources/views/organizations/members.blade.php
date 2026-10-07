<x-layouts.app title="Workspace Members & Roles">
    <div class="space-y-6 max-w-5xl">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold font-heading text-slate-900 tracking-tight">Organization Members & Roles</h1>
                <p class="text-xs text-slate-500 mt-1">Manage team access and permissions for <strong class="text-slate-800">{{ $org->name }}</strong>.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Members List -->
            <div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h2 class="text-sm font-bold font-heading text-slate-900 mb-4">Current Organization Members ({{ $org->users->count() }})</h2>
                <div class="divide-y divide-slate-100">
                    @foreach($org->users as $u)
                        <div class="py-3 flex items-center justify-between text-xs">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                                    {{ strtoupper(substr($u->name, 0, 1)) }}
                                </div>
                                <div>
                                    <div class="font-semibold text-slate-900">{{ $u->name }}</div>
                                    <div class="text-slate-400">{{ $u->email }}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider {{ $u->pivot->role_name === 'owner' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700' }}">
                                    {{ $u->pivot->role_name ?? 'Member' }}
                                </span>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Add Member Form -->
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit">
                <h2 class="text-sm font-bold font-heading text-slate-900 mb-3">Add Team Member</h2>
                <p class="text-xs text-slate-500 mb-4">Grant access to this workspace and its subscribed apps.</p>

                <form action="{{ route('organizations.members.add') }}" method="POST" class="space-y-3.5">
                    @csrf
                    <div>
                        <label class="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                        <input type="text" name="name" required placeholder="e.g. Dennis Mutua" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                        <input type="email" name="email" required placeholder="dennis@example.com" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Assigned Role</label>
                        <select name="role_name" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none bg-white">
                            @foreach($roles as $role)
                                <option value="{{ $role->name }}">{{ $role->display_name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label class="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Job Title</label>
                        <input type="text" name="title" placeholder="e.g. Operations Assistant" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none">
                    </div>

                    <button type="submit" class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors">
                        Add to Workspace
                    </button>
                </form>
            </div>
        </div>
    </div>
</x-layouts.app>
