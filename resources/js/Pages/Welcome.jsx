import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export default function Welcome() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const matchDarkMode = () => {
            const savedTheme = document.cookie
                .split('; ')
                .find((row) => row.startsWith('theme='));
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const nextIsDarkMode = savedTheme ? savedTheme.split('=')[1] === 'dark' : prefersDark;

            document.documentElement.classList.toggle('dark', nextIsDarkMode);
            setIsDarkMode(nextIsDarkMode);
        };

        matchDarkMode();
    }, []);

    const toggleTheme = () => {
        const nextIsDarkMode = !document.documentElement.classList.contains('dark');
        const theme = nextIsDarkMode ? 'dark' : 'light';
        const secureCookie = window.location.protocol === 'https:' ? '; Secure' : '';

        document.documentElement.classList.toggle('dark', nextIsDarkMode);
        document.cookie = `theme=${theme}; Max-Age=31536000; Path=/; SameSite=Lax${secureCookie}`;
        setIsDarkMode(nextIsDarkMode);
    };

    return (
        <>
            <Head title="Welcome" />
{/* #080d18 */}
{/* #0e172a */}
            <div className="min-h-screen bg-slate-50 dark:bg-[#080d18]">

                {/* Navbar */}
                <nav className="border-b border-slate-200 dark:border-0 bg-white dark:bg-[#0e172a]">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

                        {/* Logo / App Name */}
                        <Link
                            href="/"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                <span className="text-xl font-bold">M</span>
                            </div>

                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                                MIS Inventory
                            </span>
                        </Link>

                        {/* Authentication Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                                aria-pressed={isDarkMode}
                                title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-[#1a2c52] dark:hover:text-indigo-400"
                            >
                                {isDarkMode ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
                            </button>

                            <Link
                                href={route('login')}
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Login
                            </Link>

                            {/* <Link
                                href={route('register')}
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Register
                            </Link> */}

                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12 sm:px-6">

                    <div className="max-w-2xl text-center">

                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-[#121e37]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-indigo-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                            Inventory Management System
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-500">
                            Manage your products, monitor stock levels,
                            organize categories, and keep your inventory
                            organized in one place.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">

                            <Link
                                href={route('login')}
                                className="rounded-lg bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
                            >
                                Login to Dashboard
                            </Link>



                        </div>

                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center dark:border-0 dark:bg-[#0e172a] sm:px-6">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} MIS Inventory Management System.
                        All rights reserved.
                    </p>
                </footer>

            </div>
        </>
    );
}
