<x-layouts.guest title="Register Organization">
    <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h2 class="text-xl font-bold font-heading text-slate-900 mb-2">Create Paperglow Workspace</h2>
        <p class="text-sm text-slate-500 mb-6">Start with a 14-day free trial on all applications.</p>
        
        <form action="{{ route('register') }}" method="POST" class="space-y-4">
            @csrf
            <div>
                <label for="organization_name" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Company / Organization Name</label>
                <input type="text" name="organization_name" id="organization_name" value="{{ old('organization_name') }}" required placeholder="e.g. Acme Africa Ltd"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
                <label for="name" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Your Full Name</label>
                <input type="text" name="name" id="name" value="{{ old('name') }}" required placeholder="e.g. Wanjiku Kamau"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
                <label for="email" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Work Email</label>
                <input type="email" name="email" id="email" value="{{ old('email') }}" required placeholder="you@company.co.ke"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
                <label for="password" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <input type="password" name="password" id="password" required
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
                <label for="password_confirmation" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Confirm Password</label>
                <input type="password" name="password_confirmation" id="password_confirmation" required
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
            </div>

            <button type="submit"
                class="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm">
                Provision Organization
            </button>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            Already have an account?
            <a href="{{ route('login') }}" class="font-semibold text-red-600 hover:text-red-700 ml-1">Sign in</a>
        </div>
    </div>
</x-layouts.guest>
