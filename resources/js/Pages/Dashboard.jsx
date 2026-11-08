// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';

// export default function Dashboard({ total_products, total_categories, total_stock, low_stock_count, inventory_value }) {
//     console.log('Dashboard props:', { total_products, total_categories, total_stock, low_stock_count, inventory_value });
//     return (
//         <AuthenticatedLayout
//             header={
//                 <h2 className="text-xl font-semibold leading-tight text-gray-800">
//                     Dashboard
//                 </h2>
//             }
//         >
//             <Head title="Dashboard" />

//             <div className="py-12">
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
//                         <div className="p-6 text-gray-900">
//                             <h2 className='font-bold text-3xl text-red-300'>Hello world hi </h2>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Temporary chart data.
// We will replace this with data from the Laravel controller.
const demoCategoryData = [
    { name: 'Beverages', stock: 75, color: 'bg-indigo-500' },
    { name: 'Groceries', stock: 82, color: 'bg-indigo-400' },
    { name: 'Snacks', stock: 42, color: 'bg-blue-400' },
    { name: 'Dairy', stock: 28, color: 'bg-cyan-400' },
    { name: 'Instant', stock: 18, color: 'bg-amber-400' },
];

// Format currency in Nepalese Rupees.
const formatNPR = (amount) => {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
};

// Reusable icon component.
function Icon({ name, className = 'h-6 w-6' }) {
    const icons = {
        products: (
            <>
                <path d="M3 10h18l-2 10H5L3 10Z" />
                <path d="M3 10 8 4m13 6-5-6M9 14v3m6-3v3" />
            </>
        ),
        categories: (
            <>
                <path d="m12 2 9 5-9 5-9-5 9-5Z" />
                <path d="m3 7 9 5 9-5M3 7v10l9 5 9-5V7" />
                <path d="M12 12v10" />
            </>
        ),
        stock: (
            <>
                <rect x="3" y="5" width="18" height="15" rx="2" />
                <path d="M3 9h18M9 13h6" />
            </>
        ),
        warning: (
            <>
                <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4m0 4h.01" />
            </>
        ),
        money: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M16 8H9.5a2 2 0 0 0 0 4h5a2 2 0 0 1 0 4H8m4-10v12" />
            </>
        ),
        add: (
            <>
                <path d="M12 5v14m-7-7h14" />
                <path d="m3 7 9-5 9 5-9 5-9-5Z" />
            </>
        ),
        update: (
            <>
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 3V2h6v1m-6 6h6m-6 4h6m-6 4h4" />
            </>
        ),
        reports: (
            <>
                <path d="M3 3v18h18" />
                <path d="M8 16V9m5 7V5m5 11v-4" />
            </>
        ),
        arrow: (
            <path d="m9 18 6-6-6-6" />
        ),
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {icons[name]}
        </svg>
    );
}

// Reusable summary card.
function StatCard({
    title,
    value,
    subtitle,
    icon,
    iconColor,
    iconBackground,
    warning = false,
}) {
    return (
        <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            {warning && (
                <span className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-amber-400" />
            )}

            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}>
                <Icon name={icon} className="h-6 w-6" />
            </div>

            <p className="mt-5 text-base font-medium text-slate-500">
                {title}
            </p>

            <h3 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                {value}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
                {subtitle}
            </p>
        </div>
    );
}

// Inventory chart.
function InventoryOverview({ categories }) {
    const [period, setPeriod] = useState('30');

    const maxStock = Math.max(
        ...categories.map((item) => Number(item.stock) || 0),
        1
    );

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Inventory overview
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Stock quantities by category
                    </p>
                </div>

                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="rounded-lg border-0 bg-transparent text-sm font-semibold text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                </select>
            </div>

            <div className="mt-8 flex h-64 items-end gap-4 border-b border-l border-slate-200 px-4 sm:gap-8">
                {categories.map((category, index) => (
                    <div
                        key={category.id ?? category.name}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    >
                        <div className="flex w-full flex-1 items-end justify-center">
                            <div
                                title={`${category.name}: ${category.stock} units`}
                                className={`w-full max-w-16 rounded-t-lg ${category.color || demoCategoryData[index % demoCategoryData.length].color} transition-all duration-300 hover:opacity-80`}
                                style={{
                                    height: `${(Number(category.stock) / maxStock) * 100}%`,
                                    minHeight: '4px',
                                }}
                            />
                        </div>

                        <span className="mt-3 w-full truncate text-center text-xs text-slate-500 sm:text-sm">
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Quick action card.
function QuickAction({ icon, title, description }) {
    return (
        <div className="group flex min-h-28 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm">
            <div className="text-indigo-600 transition group-hover:scale-105">
                <Icon name={icon} />
            </div>

            <div>
                <h4 className="font-semibold text-slate-800">
                    {title}
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function Dashboard({
    total_products = 0,
    total_categories = 0,
    total_stock = 0,
    low_stock_count = 0,
    inventory_value = 0,
    stock_by_category = [],
}) {
    // Use temporary data until the controller provides category stock.
    const categories = stock_by_category.length > 0
        ? stock_by_category
        : demoCategoryData;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-slate-400">MyStore</span>
                    <Icon name="arrow" className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">Dashboard</span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

                {/* Page heading */}
                <div className="mb-7">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-base text-slate-500">
                        Here's what's happening with your store today.
                    </p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

                    <StatCard
                        title="Total Products"
                        value={total_products}
                        subtitle="+2 this month"
                        icon="products"
                        iconColor="text-indigo-600"
                        iconBackground="bg-indigo-50"
                    />

                    <StatCard
                        title="Total Categories"
                        value={total_categories}
                        subtitle="Across all products"
                        icon="categories"
                        iconColor="text-blue-600"
                        iconBackground="bg-blue-50"
                    />

                    <StatCard
                        title="Total Stock"
                        value={total_stock}
                        subtitle="Units available"
                        icon="stock"
                        iconColor="text-cyan-600"
                        iconBackground="bg-cyan-50"
                    />

                    <StatCard
                        title="Low Stock"
                        value={low_stock_count}
                        subtitle="Needs attention"
                        icon="warning"
                        iconColor="text-amber-600"
                        iconBackground="bg-amber-50"
                        warning={Number(low_stock_count) > 0}
                    />

                    <StatCard
                        title="Inventory Value"
                        value={formatNPR(inventory_value)}
                        subtitle="At purchase price"
                        icon="money"
                        iconColor="text-emerald-600"
                        iconBackground="bg-emerald-50"
                    />

                </div>

                {/* Charts and quick actions */}
                <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-5">

                    {/* Inventory chart */}
                    <div className="xl:col-span-3">
                        <InventoryOverview categories={categories} />
                    </div>

                    {/* Quick actions */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

                        <h3 className="text-lg font-semibold text-slate-900">
                            Quick actions
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Common inventory tasks
                        </p>

                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <QuickAction
                                icon="add"
                                title="Add product"
                                description="Register a new product"
                            />

                            <QuickAction
                                icon="update"
                                title="Update stock"
                                description="Manage stock quantities"
                            />

                            <QuickAction
                                icon="products"
                                title="View products"
                                description="Browse your inventory"
                            />

                            <QuickAction
                                icon="reports"
                                title="Open reports"
                                description="View inventory analytics"
                            />

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
