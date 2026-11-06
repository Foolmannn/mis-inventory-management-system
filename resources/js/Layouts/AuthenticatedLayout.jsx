import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigation, setShowingNavigation] = useState(false);
    const isDashboard = route().current('dashboard');
    const isWelcome = route().current('welcome');
    const isProfile = route().current('profile.*');
    const initials = user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {showingNavigation && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
                    onClick={() => setShowingNavigation(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${showingNavigation ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
                    <Link
                        href={route('dashboard')}
                        className="flex items-center gap-3"
                        onClick={() => setShowingNavigation(false)}
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-950/40">
                            <ApplicationLogo className="h-6 w-6 fill-current text-white" />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold tracking-wide text-white">
                                MIS Inventory
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                                Management suite
                            </span>
                        </span>
                    </Link>
                </div>

                <nav aria-label="Main navigation" className="flex-1 px-4 py-7">
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Workspace
                    </p>

                    {/* Dashboard Page Link */}
                    <Link
                        href={route('dashboard')}
                        aria-current={isDashboard ? 'page' : undefined}
                        onClick={() => setShowingNavigation(false)}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 text-sm font-medium transition ${isDashboard
                                ? 'bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <svg
                            aria-hidden="true"
                            className={`h-5 w-5 ${isDashboard
                                    ? 'text-indigo-300'
                                    : 'text-slate-500 group-hover:text-slate-300'
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 10.5 12 3.75l8.25 6.75M5.25 9.75v9a1.5 1.5 0 0 0 1.5 1.5h3.75v-6h3v6h3.75a1.5 1.5 0 0 0 1.5-1.5v-9"
                            />
                        </svg>
                        Dashboard
                        {isDashboard && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300" />
                        )}
                    </Link>


                    {/* Welcome Page Link */}
                    <Link
                        href={route('welcome')}
                        aria-current={isWelcome ? 'page' : undefined}
                        onClick={() => setShowingNavigation(false)}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 text-sm font-medium transition ${isWelcome
                                ? 'bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <svg
                            aria-hidden="true"
                            className={`h-5 w-5 ${isWelcome
                                    ? 'text-indigo-300'
                                    : 'text-slate-500 group-hover:text-slate-300'
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 10.5 12 3.75l8.25 6.75M5.25 9.75v9a1.5 1.5 0 0 0 1.5 1.5h3.75v-6h3v6h3.75a1.5 1.5 0 0 0 1.5-1.5v-9"
                            />
                        </svg>
                        Welcome
                        {isDashboard && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300" />
                        )}
                    </Link>

                    {/* put more links here */}


                </nav>

                <div className="border-t border-white/10 p-4">
                    <Link
                        href={route('profile.edit')}
                        aria-current={isProfile ? 'page' : undefined}
                        onClick={() => setShowingNavigation(false)}
                        className={`mb-3 flex items-center gap-3 rounded-xl p-2 transition ${isProfile
                                ? 'bg-white/10'
                                : 'hover:bg-white/5'
                            }`}
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200 ring-1 ring-white/10">
                            {initials}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-white">
                                {user.name}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-slate-500">
                                {user.email}
                            </span>
                        </span>
                        <svg
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9 18 6-6-6-6"
                            />
                        </svg>
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 8.25V5.625A1.875 1.875 0 0 0 13.875 3.75h-7.5A1.875 1.875 0 0 0 4.5 5.625v12.75a1.875 1.875 0 0 0 1.875 1.875h7.5a1.875 1.875 0 0 0 1.875-1.875V15.75m-3.75-3.75h9m0 0-3.75-3.75M21 12l-3.75 3.75"
                            />
                        </svg>
                        Sign out
                    </Link>
                </div>
            </aside>

            <div className="min-h-screen lg:pl-72">
                <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
                    <div className="flex min-h-20 items-center gap-4 px-4 sm:px-8 lg:px-10">
                        <button
                            type="button"
                            aria-label="Open navigation menu"
                            aria-expanded={showingNavigation}
                            onClick={() =>
                                setShowingNavigation((isOpen) => !isOpen)
                            }
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:hidden"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                {showingNavigation ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m6 6 12 12M18 6 6 18"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                        <div className="min-w-0 flex-1">
                            {header && (
                                <div className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                                    {header}
                                </div>
                            )}
                        </div>
                        <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Workspace active
                        </div>
                    </div>
                </header>

                <main>{children}</main>
            </div>
        </div>
    );
}
