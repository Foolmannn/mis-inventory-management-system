
import { Link, usePage } from '@inertiajs/react';
import {
    MdDashboard,
    MdShoppingBasket,
    MdCategory,
    MdInventory,
    MdAssessment,
    MdPeople,
    MdSettings,
    MdLogout,
    MdInventory2,
} from 'react-icons/md';

const navigation = [
    {
        title: 'Dashboard',
        routeName: 'dashboard',
        icon: MdDashboard,
    },
    {
        title: 'Products',
        routeName: 'product.index',
        icon: MdShoppingBasket,
    },
    {
        title: 'Categories',
        routeName: 'category.index',
        icon: MdCategory,
    },
    {
        title: 'Stock Management',
        routeName: 'stock-management.index',
        icon: MdInventory,
    },
    {
        title: 'Reports',
        routeName: null,
        icon: MdAssessment,
    },
    {
        title: 'Staff Management',
        routeName: 'staff.index',
        icon: MdPeople,
        adminOnly: true,
    },
    {
        title: 'Settings',
        routeName: null,
        icon: MdSettings,
    },
];

export default function Sidebar() {
    const { url, props } = usePage();

    const user = props.auth?.user;
    const isAdmin = user?.role === 'admin';

    const visibleNavigation = navigation.filter((item) => {
        if (item.adminOnly && !isAdmin) return false;
        return true;
    });

    const isActive = (routeName) => {
        if (!routeName) return false;

        const currentPath = url.split('?')[0];

        const routePaths = {
            dashboard: '/dashboard',
            'product.index': '/product',
            'category.index': '/category',
            'staff.index': '/staff',
        };

        const path = routePaths[routeName];

        if (!path) return false;

        return currentPath === path ||
            currentPath.startsWith(path + '/');
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-40 flex w-[298px] flex-col border-r border-slate-200 bg-white">

            {/* Brand */}
            <div className="flex h-32 shrink-0 items-center gap-3 border-b border-slate-100 px-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                    <MdInventory2 size={26} />
                </div>

                <div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-900">
                        MyStore
                    </h1>

                    <p className="text-xs font-medium tracking-[0.18em] text-slate-400">
                        INVENTORY
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-2 py-6">

                <p className="mb-4 px-4 text-xs font-bold tracking-[0.16em] text-slate-400">
                    WORKSPACE
                </p>

                <div className="space-y-1">
                    {visibleNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.routeName);

                        if (!item.routeName) {
                            return (
                                <div
                                    key={item.title}
                                    title="Coming soon"
                                    className="flex cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-[15px] text-slate-400 opacity-70"
                                >
                                    <Icon size={21} />
                                    <span>{item.title}</span>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.title}
                                href={route(item.routeName)}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                }`}
                            >
                                <Icon size={21} />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User section */}
            <div className="shrink-0 border-t border-slate-100 p-2">

                {/* Profile */}
                <Link
                    href={route('profile.edit')}
                    className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 transition hover:bg-slate-100"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {user?.name || 'User'}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                </Link>

                {/* Logout */}
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                    <MdLogout size={21} />
                    Sign out
                </Link>
            </div>
        </aside>
    );
}
