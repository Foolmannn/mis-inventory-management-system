
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { MdClose, MdDarkMode, MdLightMode, MdMenu, MdNotificationsNone } from 'react-icons/md';
import Sidebar from '@/Components/Sidebar';
import Toast from '@/Components/Toast';

export default function AuthenticatedLayout({ header, children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { flash } = usePage().props;

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    useEffect(() => {
        if (!isMobileMenuOpen) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsMobileMenuOpen(false);
        };

        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [isMobileMenuOpen]);

    const toggleTheme = () => {
        const nextIsDarkMode = !document.documentElement.classList.contains('dark');
        const theme = nextIsDarkMode ? 'dark' : 'light';
        const secureCookie = window.location.protocol === 'https:' ? '; Secure' : '';

        document.documentElement.classList.toggle('dark', nextIsDarkMode);
        document.cookie = `theme=${theme}; Max-Age=31536000; Path=/; SameSite=Lax${secureCookie}`;
        setIsDarkMode(nextIsDarkMode);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#080d18]">
            <Sidebar
                mobileOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
            {isMobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 z-20 bg-slate-950/50 lg:hidden"
                />
            )}

            {/* Main section */}
            <div className="min-h-screen min-w-0 lg:ml-[250px]">

                {/* Topbar */}
                <header className="fixed left-0 right-0 top-0 z-30 flex h-16 min-w-0 items-center justify-between border-b border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-[#0e172a] sm:px-6 lg:left-[250px] lg:h-20 lg:px-8">

                    {/* Breadcrumb */}
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
                            aria-label={`${isMobileMenuOpen ? 'Close' : 'Open'} navigation menu`}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="app-sidebar"
                            className="shrink-0 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-[#1a2c52] dark:hover:text-indigo-400 lg:hidden"
                        >
                            {isMobileMenuOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
                        </button>
                        <div className="min-w-0 truncate text-sm">
                        {header}
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="ml-2 flex shrink-0 items-center gap-1 sm:gap-3">

                        {/* Notifications */}
                        <button
                            type="button"
                            className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-[#1a2c52] hover:text-indigo-600"
                            title="Notifications"
                        >
                            <MdNotificationsNone size={25} />

                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-300" />
                        </button>

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
                    </div>
                </header>

                {/* Page content */}
                <main className="min-h-screen min-w-0 pt-16 lg:pt-20">
                    {children}
                </main>
            </div>
            <Toast flash={flash} />
        </div>
    );
}
