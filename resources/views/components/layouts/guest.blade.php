<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Paperglow' }} — Business Applications & SaaS</title>
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
</head>
<body class="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-red-600 selection:text-white">
    <div class="w-full max-w-md">
        <!-- Brand Header -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 text-white font-heading font-bold text-2xl shadow-sm mb-3">
                P
            </div>
            <h1 class="text-2xl font-bold font-heading text-slate-900">Paperglow</h1>
            <p class="text-sm text-slate-500 mt-1">Unified Multi-Tenant SaaS Platform</p>
        </div>

        @if(session('success'))
            <div class="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm">
                {{ session('success') }}
            </div>
        @endif

        @if($errors->any())
            <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                <ul class="list-disc list-inside space-y-1">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        {{ $slot }}

        <div class="mt-8 text-center text-xs text-slate-400">
            &copy; {{ date('Y') }} Paperglow Ltd. All rights reserved. DirectAdmin MariaDB Engine.
        </div>
    </div>
</body>
</html>
