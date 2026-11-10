
import { Link, usePage } from '@inertiajs/react';
import { MdNotificationsNone, MdKeyboardArrowDown } from 'react-icons/md';
import Sidebar from '@/Components/Sidebar';

export default function AuthenticatedLayout({ header, children }) {
    const { props } = usePage();
    const user = props.auth?.user;

    const initials = user?.name
        ? user.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : 'U';

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main section */}
            <div className="ml-[240px] min-h-screen">

                {/* Topbar */}
                <header className="fixed left-[298px] right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

                    {/* Breadcrumb */}
                    <div className="text-sm">
                        {header}
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-6">

                        {/* Notifications */}
                        <button
                            type="button"
                            className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                            title="Notifications"
                        >
                            <MdNotificationsNone size={25} />

                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </button>

                        {/* User profile */}
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                                {initials}
                            </div>

                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.name || 'User'}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {user?.role === 'admin'
                                        ? 'Store Owner'
                                        : 'Staff Member'}
                                </p>
                            </div>

                            <MdKeyboardArrowDown
                                size={20}
                                className="text-slate-400"
                            />
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="min-h-screen pt-20">
                    {children}
                </main>
            </div>
        </div>
    );
}
