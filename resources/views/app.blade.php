<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script>
        (() => {
            const savedTheme = document.cookie.match(/(?:^|; )theme=(dark|light)(?:;|$)/)?.[1];
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle(
                'dark',
                savedTheme ? savedTheme === 'dark' : prefersDark
            );
        })();
    </script>

    <title inertia>{{ config('app.name', 'My Store Inventory') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    {{-- <link rel="icon" type="image/svg+xml" href="/favicon.ico"> --}}
    <link rel="icon" href="/favicon.ico" sizes="any">
    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
