import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

// Reusable icon component.
function Icon({ name, className = "h-6 w-6" }) {
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
        arrow: <path d="m9 18 6-6-6-6" />,
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
        <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e172a] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            {warning && (
                <span className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-amber-400 dark:bg-amber-600" />
            )}

            <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}
            >
                <Icon name={icon} className="h-6 w-6" />
            </div>

            <p className="mt-5 text-base font-medium text-slate-500 dark:text-slate-400">{title}</p>

            <h3 className="mt-1 pr-10 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                {value}
            </h3>

            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">{subtitle}</p>
        </div>
    );
}

// Inventory chart.

function InventoryOverview({ categories = [], isAdmin }) {
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 5;

    const validCategories = Array.isArray(categories) ? categories : [];

    const totalPages = Math.ceil(validCategories.length / ITEMS_PER_PAGE);

    // Keep page valid if categories change
    const safePage = Math.min(currentPage, Math.max(totalPages, 1));

    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;

    const currentCategories = validCategories.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    );

    // Use the maximum stock across ALL categories
    // so bar heights remain consistent between pages.
    const maxStock = Math.max(
        ...validCategories.map((item) => Number(item.stock) || 0),
        1,
    );

    const colors = [
        "bg-indigo-500",
        "bg-indigo-400",
        "bg-blue-400",
        "bg-cyan-400",
        "bg-amber-400",
    ];

    return (
        <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e172a] p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Inventory overview
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Stock quantities by category
                    </p>
                </div>

                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {validCategories.length} Categories
                </span>
            </div>

            {/* Original Vertical Bar Chart */}
            {currentCategories.length > 0 ? (
                <>
                    <div className="mt-8 overflow-visible">
                        <div className="flex h-64 items-end gap-4 border-b border-l border-slate-200 dark:border-slate-800 px-4 sm:gap-8">
                            {currentCategories.map((category, index) => {
                                const stock = Number(category.stock) || 0;

                                const percentage = (stock / maxStock) * 100;

                                return (
                                    <div
                                        key={category.id ?? category.name}
                                        className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                    >
                                        {/* Bar area */}
                                        <div className="relative flex w-full flex-1 items-end justify-center">
                                            {/* Hover tooltip */}
                                            <div
                                                className="
            pointer-events-none
            absolute
            bottom-full
            left-1/2
            z-50
            mb-2
            -translate-x-1/2
            whitespace-nowrap
            rounded-lg
            bg-slate-900 dark:bg-slate-100
            px-3
            py-2
            text-xs
            text-white dark:text-black
            shadow-xl
            opacity-0
            invisible
            transition-all
            duration-200
            group-hover:opacity-100
            group-hover:visible
        "
                                            >
                                                <p className="font-semibold">
                                                    {category.name}
                                                </p>

                                                {/* <p className="mt-1 text-slate-300">
                                                    Category ID: {category.id}
                                                </p> */}

                                                <p className="mt-1 font-medium text-emerald-400">
                                                    Stock: {stock} units
                                                </p>

                                                {/* Tooltip arrow */}
                                                <div
                                                    className="
            absolute
            left-1/2
            top-full
            -translate-x-1/2
            border-4
            border-transparent
            border-t-slate-900 dark:border-t-slate-100
        "
                                                />
                                            </div>

                                            {/* Vertical bar */}
                                            <div
                                                className={`w-full max-w-16 rounded-t-lg ${colors[
                                                    index % colors.length
                                                    ]
                                                    } transition-all duration-300 hover:opacity-80`}
                                                style={{
                                                    height:
                                                        stock > 0
                                                            ? `${Math.max(percentage, 1.5)}%`
                                                            : "0%",
                                                }}
                                            />
                                        </div>

                                        {/* Category name */}
                                        <span
                                            title={category.name}
                                            className="mt-3 w-full truncate text-center text-xs text-slate-500 sm:text-sm"
                                        >
                                            {category.name}
                                        </span>

                                        {/* Category ID */}
                                        {/* <span className="mt-1 text-[10px] text-slate-400">
                                            ID: {category.id}
                                        </span> */}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {startIndex + 1}–
                                {Math.min(
                                    startIndex + ITEMS_PER_PAGE,
                                    validCategories.length,
                                )}
                            </span>{" "}
                            of {validCategories.length} categories
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.max(1, page - 1),
                                    )
                                }
                                disabled={safePage === 1}
                                className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="px-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                Page {safePage} of {Math.max(totalPages, 1)}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.min(totalPages, page + 1),
                                    )
                                }
                                disabled={
                                    safePage === totalPages || totalPages === 0
                                }
                                className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-sm text-slate-500">
                        No category stock data available.
                    </p>
                </div>
            )}
        </div>
    );
}

// Quick action card.
function QuickAction({ icon, title, description }) {
    return (
        <div className="group flex min-h-28 flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e172a] p-5 transition hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 hover:shadow-sm">
            <div className="text-indigo-600 dark:text-indigo-400 transition group-hover:scale-105">
                <Icon name={icon} />
            </div>

            <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
                <p className="mt-1 text-xs text-slate-400">{description}</p>
            </div>
        </div>
    );
}

export default function Dashboard({
    auth,
    total_products = 0,
    total_categories = 0,
    total_stock = 0,
    in_stock_count = 0,
    low_stock_count = 0,
    out_of_stock_count = 0,
    inventory_value = "0.00",
    stock_by_category = [],
    recent_products = [],
    low_stock_products = [],
}) {
    const user = auth?.user;
    const isAdmin = user?.role === "admin";
    const categories = stock_by_category;
    console.table(stock_by_category);

    console.log("Is array:", Array.isArray(stock_by_category));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-slate-400 dark:text-slate-300">MyStore</span>
                    <Icon name="arrow" className="h-4 w-4 text-slate-400 dark:text-slate-300" />
                    <span className="text-slate-700 dark:text-slate-400">Dashboard</span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
                {/* Page heading */}
                <div className="mb-7">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                        Here's what's happening with your store today.
                    </p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
                    <StatCard
                        title="Total Products"
                        value={total_products}
                        subtitle="Active catalog"
                        icon="products"
                        iconColor="text-indigo-600 dark:text-indigo-400"
                        iconBackground="bg-indigo-50 dark:bg-indigo-950"
                    />

                    <StatCard
                        title="Total Categories"
                        value={total_categories}
                        subtitle="Across all products"
                        icon="categories"
                        iconColor="text-blue-600 dark:text-blue-400"
                        iconBackground="bg-blue-50 dark:bg-blue-950"
                    />

                    <StatCard
                        title="Total Stock"
                        value={total_stock}
                        subtitle="Units available"
                        icon="stock"
                        iconColor="text-cyan-600 dark:text-cyan-400"
                        iconBackground="bg-cyan-50 dark:bg-cyan-950"
                    />

                    <StatCard
                        title="Low Stock"
                        value={low_stock_count}
                        subtitle="Needs attention"
                        icon="warning"
                        iconColor="text-amber-600 dark:text-amber-400"
                        iconBackground="bg-amber-50 dark:bg-amber-950"
                        warning={Number(low_stock_count) > 0}
                    />
                    <StatCard
                        title="In Stock"
                        value={in_stock_count}
                        subtitle="Above minimum stock"
                        icon="stock"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        iconBackground="bg-emerald-50 dark:bg-emerald-950"
                    />

                    <StatCard
                        title="Out of Stock"
                        value={out_of_stock_count}
                        subtitle="Products unavailable"
                        icon="warning"
                        iconColor="text-red-600 dark:text-red-400"
                        iconBackground="bg-red-50 dark:bg-red-950"
                        warning={Number(out_of_stock_count) > 0}
                    />
                    <StatCard
                        title="Inventory Value"
                        value={`Rs.${inventory_value}`}
                        subtitle="At purchase price"
                        icon="money"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        iconBackground="bg-emerald-50 dark:bg-emerald-950"
                    />
                </div>

                {/* Charts and quick actions */}
                <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-5">
                    {/* Inventory Chart */}
                    <div
                        className={isAdmin ? "xl:col-span-3" : "xl:col-span-5"}
                    >
                        <InventoryOverview categories={categories} />
                    </div>

                    {/* Quick actions */}
                    {isAdmin && (
                        <div className="xl:col-span-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                Quick actions
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Common inventory tasks
                            </p>

                            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Link href={route("product.create")}>
                                    <QuickAction
                                        icon="add"
                                        title="Add product"
                                        description="Register a new product"
                                    />
                                </Link>
                                {/* to update */}
                                <Link href={route("stock-management.index")}>
                                    <QuickAction
                                        icon="update"
                                        title="Update stock"
                                        description="Manage stock quantities"
                                    />
                                </Link>
                                <Link href={route("product.index")}>
                                    <QuickAction
                                        icon="products"
                                        title="View products"
                                        description="Browse your inventory"
                                    />
                                </Link>
                                {/* to update */}
                                <Link href={route("reports.index")}>
                                    <QuickAction
                                        icon="reports"
                                        title="Open reports"
                                        description="View inventory analytics"
                                    />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
