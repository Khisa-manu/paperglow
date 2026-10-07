<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Paperglow' }} — Multi-Tenant Business SaaS</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Poppins:ital,wght@0,500;0,600;0,700;0,800;1,500&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#dc2626',
                        'primary-hover': '#b91c1c',
                        'primary-light': '#fef2f2',
                    },
                    fontFamily: {
                        sans: ['"DM Sans"', 'sans-serif'],
                        heading: ['Poppins', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
    @livewireStyles
</head>
<body class="bg-slate-50 text-slate-800 font-sans min-h-screen flex antialiased selection:bg-red-600 selection:text-white" x-data="{ sidebarOpen: false, newOrgModal: false }">

    <!-- Mobile Sidebar Backdrop -->
    <div x-show="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden" style="display: none;"></div>

    <!-- Left Navigation Sidebar -->
    <aside :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'" class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto shrink-0 border-r border-slate-800">
        <!-- Brand & Workspace Switcher -->
        <div class="p-4 border-b border-slate-800">
            <div class="flex items-center justify-between mb-4">
                <a href="{{ route('dashboard') }}" class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-lg bg-red-600 text-white font-heading font-bold text-lg flex items-center justify-center shadow-xs">
                        P
                    </span>
                    <span class="font-heading font-bold text-lg text-white tracking-tight">Paperglow</span>
                </a>
                <span class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/60">
                    SaaS
                </span>
            </div>

            <!-- Workspace Switcher Dropdown (Alpine) -->
            <div class="relative" x-data="{ open: false }">
                <button @click="open = !open" type="button" class="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/60 text-xs transition-colors">
                    <div class="truncate mr-2">
                        <div class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Workspace</div>
                        <div class="font-medium text-white truncate">{{ $currentOrg->name ?? 'Default Workspace' }}</div>
                    </div>
                    <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                <!-- Switcher Menu -->
                <div x-show="open" @click.away="open = false" class="absolute left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-1 text-xs" style="display: none;">
                    <div class="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-700">
                        Switch Organization
                    </div>
                    @if(isset($userOrgs))
                        @foreach($userOrgs as $org)
                            <form action="{{ route('organizations.switch', $org) }}" method="POST">
                                @csrf
                                <button type="submit" class="w-full text-left px-3 py-2 hover:bg-slate-700/80 flex items-center justify-between {{ ($currentOrg->id ?? null) === $org->id ? 'text-red-400 font-bold bg-slate-700/30' : 'text-slate-200' }}">
                                    <span class="truncate">{{ $org->name }}</span>
                                    @if(($currentOrg->id ?? null) === $org->id)
                                        <span class="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                    @endif
                                </button>
                            </form>
                        @endforeach
                    @endif
                    <div class="border-t border-slate-700 mt-1 pt-1">
                        <button @click="open = false; newOrgModal = true" class="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-700 flex items-center gap-1.5 font-medium">
                            <span>+</span> Create New Workspace
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar Navigation Menu -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
            <!-- Core -->
            <div>
                <div class="px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Platform</div>
                <div class="space-y-0.5">
                    <a href="{{ route('dashboard') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('dashboard') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span>Workspace Overview</span>
                    </a>
                    <a href="{{ route('catalog.index') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('catalog.*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        <span>Applications Catalog</span>
                    </a>
                </div>
            </div>

            <!-- Business & Operations -->
            <div>
                <div class="px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Operations & ERP</div>
                <div class="space-y-0.5">
                    <a href="{{ route('apps.business-manager') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.business-manager*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-red-500"></span>
                        <span>Business Manager</span>
                    </a>
                    <a href="{{ route('apps.stock-inventory') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.stock-inventory*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Stock & Inventory</span>
                    </a>
                    <a href="{{ route('apps.property-manager') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.property-manager*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Property Manager</span>
                    </a>
                </div>
            </div>

            <!-- Industry Modules -->
            <div>
                <div class="px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Industry Solutions</div>
                <div class="space-y-0.5">
                    <a href="{{ route('apps.pharmacy-manager') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.pharmacy-manager*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-teal-500"></span>
                        <span>Pharmacy Manager</span>
                    </a>
                    <a href="{{ route('apps.clinic-manager') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.clinic-manager*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>Clinic & OPD Manager</span>
                    </a>
                    <a href="{{ route('apps.chama-manager') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.chama-manager*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span>Chama & Sacco Manager</span>
                    </a>
                    <a href="{{ route('apps.legal-practice') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.legal-practice*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span>Legal Practice</span>
                    </a>
                    <a href="{{ route('apps.school-manager') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.school-manager*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span>School Manager</span>
                    </a>
                    <a href="{{ route('apps.booking') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.booking*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-pink-500"></span>
                        <span>Booking & Appointments</span>
                    </a>
                    <a href="{{ route('apps.ticketing') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('apps.ticketing*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
                        <span>Ticketing / Helpdesk</span>
                    </a>
                </div>
            </div>

            <!-- Workspace Settings -->
            <div>
                <div class="px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Administration</div>
                <div class="space-y-0.5">
                    <a href="{{ route('organizations.members') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('organizations.members*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <span>Members & Roles</span>
                    </a>
                    <a href="{{ route('notifications.index') }}" class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('notifications.*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <div class="flex items-center gap-2.5">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            <span>Notifications</span>
                        </div>
                        @if(($unreadCount ?? 0) > 0)
                            <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">{{ $unreadCount }}</span>
                        @endif
                    </a>
                    <a href="{{ route('audit-logs.index') }}" class="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors {{ request()->routeIs('audit-logs.*') ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white' }}">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span>Audit Trails</span>
                    </a>
                </div>
            </div>
        </nav>

        <!-- Sidebar DirectAdmin Status -->
        <div class="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40">
            <div class="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>MariaDB Production Storage</span>
            </div>
            <div class="text-[10px] text-slate-400 truncate">Shujaa Host DirectAdmin &bull; PHP 8.3</div>
        </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <!-- Top Navbar -->
        <header class="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
            <div class="flex items-center gap-3">
                <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <div class="text-sm font-semibold text-slate-800 truncate">
                    {{ $currentOrg->name ?? 'Paperglow SaaS' }}
                </div>
            </div>

            <!-- Top Actions -->
            <div class="flex items-center gap-3">
                <!-- Notifications Link -->
                <a href="{{ route('notifications.index') }}" class="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Notifications">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    @if(($unreadCount ?? 0) > 0)
                        <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600"></span>
                    @endif
                </a>

                <!-- User Profile & Logout -->
                <div class="flex items-center gap-3 pl-3 border-l border-slate-200 text-sm">
                    <div class="text-right hidden sm:block">
                        <div class="font-semibold text-slate-800 leading-tight">{{ Auth::user()->name ?? 'User' }}</div>
                        <div class="text-xs text-slate-400">{{ Auth::user()->email ?? '' }}</div>
                    </div>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors" title="Sign Out">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </header>

        <!-- Flash Messages -->
        <div class="p-4 sm:p-6 pb-0">
            @if(session('success'))
                <div class="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>{{ session('success') }}</span>
                    </div>
                    <button type="button" @click="$el.parentElement.remove()" class="text-emerald-600 hover:text-emerald-900 text-xs font-bold">&times;</button>
                </div>
            @endif

            @if(session('error') || $errors->any())
                <div class="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm">
                    <div class="font-semibold mb-1">Please correct the following:</div>
                    <ul class="list-disc list-inside space-y-0.5 text-xs">
                        @if(session('error')) <li>{{ session('error') }}</li> @endif
                        @foreach($errors->all() as $err) <li>{{ $err }}</li> @endforeach
                    </ul>
                </div>
            @endif
        </div>

        <!-- Main Body Content -->
        <main class="flex-1 p-4 sm:p-6">
            {{ $slot }}
        </main>
    </div>

    <!-- Create Organization Modal (Alpine) -->
    <div x-show="newOrgModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs" style="display: none;">
        <div @click.away="newOrgModal = false" class="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold font-heading text-slate-900">Create New Workspace</h3>
                <button @click="newOrgModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form action="{{ route('organizations.store') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Organization Name</label>
                    <input type="text" name="name" required placeholder="e.g. Mombasa Logistics Ltd" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">City / County</label>
                    <input type="text" name="city" placeholder="Nairobi" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">KRA PIN / Tax ID (Optional)</label>
                    <input type="text" name="tax_id" placeholder="P051000000X" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none">
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" @click="newOrgModal = false" class="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold">Create Workspace</button>
                </div>
            </form>
        </div>
    </div>

    @livewireScripts
</body>
</html>
