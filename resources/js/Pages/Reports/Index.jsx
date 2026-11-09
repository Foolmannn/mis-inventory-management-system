
import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatNumber = (value) =>
    Number(value || 0).toLocaleString('en-IN');

function SummaryCard({ title, value, subtitle, icon, color }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-800">
                        {value}
                    </h3>
                        <div className="mt-1 text-xs text-slate-400">
                        {subtitle}
                    </div>
                </div>

                <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colors[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

// function StockByCategory({ categories }) {
//     const maxStock = Math.max(
//         ...categories.map((category) => Number(category.stock)),
//         1
//     );

//     const barColors = [
//         'bg-indigo-500',
//         'bg-blue-500',
//         'bg-cyan-500',
//         'bg-violet-500',
//         'bg-emerald-500',
//         'bg-amber-500',
//     ];

//     return (
//         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="mb-6">
//                 <h3 className="text-base font-semibold text-slate-800">
//                     Stock by Category
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                     Total available stock in each category
//                 </p>
//             </div>

//             {categories.length > 0 ? (
//                 <div className="space-y-5">
//                     {categories.map((category, index) => (
//                         <div key={category.id}>
//                             <div className="mb-2 flex items-center justify-between gap-3">
//                                 <span className="truncate text-sm font-medium text-slate-700">
//                                     {category.name}
//                                 </span>

//                                 <span className="text-sm font-semibold text-slate-700">
//                                     {formatNumber(category.stock)}
//                                 </span>
//                             </div>

//                             <div className="h-3 overflow-hidden rounded-full bg-slate-100">
//                                 <div
//                                     className={`h-full rounded-full transition-all duration-500 ${barColors[index % barColors.length]}`}
//                                     style={{
//                                         width: `${(Number(category.stock) / maxStock) * 100}%`,
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p className="py-10 text-center text-sm text-slate-400">
//                     No category data available.
//                 </p>
//             )}
//         </div>
//     );
// }

function StockStatusChart({ stockStatus }) {
    const total = stockStatus.reduce(
        (sum, item) => sum + Number(item.value),
        0
    );

    const colors = {
        'In Stock': '#10b981',
        'Low Stock': '#f59e0b',
        'Out of Stock': '#f43f5e',
    };

    let currentPercentage = 0;

    const gradient = stockStatus.map((item) => {
        const percentage = total > 0
            ? (Number(item.value) / total) * 100
            : 0;

        const start = currentPercentage;
        currentPercentage += percentage;

        return `${colors[item.name] || '#94a3b8'} ${start}% ${currentPercentage}%`;
    });

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6">
                <h3 className="text-base font-semibold text-slate-800">
                    Stock Status
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Distribution of product availability
                </p>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
                <div
                    className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
                    style={{
                        background: total > 0
                            ? `conic-gradient(${gradient.join(', ')})`
                            : '#e2e8f0',
                    }}
                >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-2xl font-bold text-slate-800">
                            {formatNumber(total)}
                        </span>
                        <span className="text-xs text-slate-400">
                            Products
                        </span>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    {stockStatus.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between gap-3"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                        backgroundColor:
                                            colors[item.name] || '#94a3b8',
                                    }}
                                />

                                <span className="text-sm text-slate-600">
                                    {item.name}
                                </span>
                            </div>

                            <span className="text-sm font-semibold text-slate-800">
                                {formatNumber(item.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const DONUT_COLORS = [
    '#6366f1',
    '#10b981',
    '#f59e0b',
    '#06b6d4',
    '#f43f5e',
    '#8b5cf6',
    '#14b8a6',
    '#f97316',
    '#94a3b8',
];

function DonutChart({
    title,
    description,
    data,
    total_quantity,
    subtitle,
    valueKey,
    formatter,
    renderDetails,
}) {
    console.log(data)
    const total = data.reduce(
        (sum, item) => sum + Number(item[valueKey] || 0),
        0
    );

    let currentPercentage = 0;

    const gradient = data
        .filter((item) => Number(item[valueKey]) > 0)
        .map((item, index) => {
            const percentage = (Number(item[valueKey]) / total) * 100;

            const start = currentPercentage;
            currentPercentage += percentage;

            return `${DONUT_COLORS[index % DONUT_COLORS.length]} ${start}% ${currentPercentage}%`;
        });

    const chartData = data.filter(
        (item) => Number(item[valueKey]) > 0
    );
    // const total_categories = data.stats.categories.length
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6">
                <h3 className="text-base font-semibold text-slate-800">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>
            </div>

            {chartData.length > 0 ? (
                <div className="flex flex-col items-center gap-7 lg:flex-row lg:items-center">

                    {/* Donut */}
                    <div
                        className="relative flex h-60 w-60 shrink-0 items-center justify-center rounded-full"
                        style={{
                            background: `conic-gradient(${gradient.join(', ')})`,
                        }}
                    >
                        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                            <span className="text-xl font-bold text-slate-800">
                                {total_quantity}
                            </span>

                            <span className="mt-1 text-xs text-slate-400">
                                {subtitle}
                            </span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="max-h-64 w-full space-y-4 overflow-y-auto">
                        {chartData.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-3"
                            >
                                <span
                                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor:
                                            DONUT_COLORS[index % DONUT_COLORS.length],
                                    }}
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="truncate text-sm font-medium text-slate-700">
                                            {item.name}
                                        </span>

                                        <span className="shrink-0 text-sm font-semibold text-slate-800">
                                            {formatter(item[valueKey])}
                                        </span>
                                    </div>

                                    {renderDetails && (
                                        <div className="mt-1">
                                            {renderDetails(item)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="py-12 text-center text-sm text-slate-400">
                    No inventory data available.
                </p>
            )}
        </div>
    );
}
export default function Index({
    stats = {},
    stock_by_category = [],
    stock_status = [],
    value_by_category = [],
    products,
    categories = [],
    filters = {},
    product_value_chart = [],
}) {
    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(
        filters.category_id || ''
    );
    const [stockFilter, setStockFilter] = useState(
        filters.stock_status || ''
    );
    const [sort, setSort] = useState(filters.sort || 'name');
    const [direction, setDirection] = useState(
        filters.direction || 'asc'
    );

    // Avoid unnecessary initial request
    const lastAppliedFilters = useRef(
        JSON.stringify({
            search: filters.search || '',
            categoryFilter: filters.category_id || '',
            stockFilter: filters.stock_status || '',
            sort: filters.sort || 'name',
            direction: filters.direction || 'asc',
        })
    );

    // Server-side filtering with debounce
    useEffect(() => {
        const currentFilters = JSON.stringify({
            search,
            categoryFilter,
            stockFilter,
            sort,
            direction,
        });

        if (lastAppliedFilters.current === currentFilters) {
            return;
        }

        const timeout = setTimeout(() => {
            lastAppliedFilters.current = currentFilters;

            router.get(
                route('reports.index'),
                {
                    search,
                    category_id: categoryFilter,
                    stock_status: stockFilter,
                    sort,
                    direction,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, categoryFilter, stockFilter, sort, direction]);

    const productList = Array.isArray(products)
        ? products
        : products?.data || [];

    const paginationLinks = products?.links || [];

    const toggleSort = (field) => {
        if (sort === field) {
            setDirection(direction === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(field);
            setDirection('asc');
        }
    };
    const total_category = categories.length
//     console.log({
//     stats,
//     stock_by_category,
//     stock_status,
//     value_by_category,
//     products,
//     categories,
//     filters ,
//     product_value_chart ,
// })
    return (
        <AuthenticatedLayout>
            <Head title="Inventory Reports" />

            <div className="min-h-screen bg-slate-50 px-6 py-6">

                {/* Header */}
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Inventory Reports
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Analyze your inventory, stock levels and valuation.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        <span>🖨️</span>
                        Print Report
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                    <SummaryCard
                        title="Total Products"
                        value={formatNumber(stats.total_products)}
                        subtitle="Registered products"
                        icon="📦"
                        color="indigo"
                    />

                    <SummaryCard
                        title="Total Stock"
                        value={formatNumber(stats.total_stock)}
                        subtitle="Total available units"
                        icon="🏷️"
                        color="emerald"
                    />


                    <SummaryCard
                        title="Low Stock Items"
                        value={formatNumber(stats.low_stock_count)}
                        subtitle={`${formatNumber(stats.out_of_stock_count)} out of stock`}
                        icon="⚠️"
                        color="rose"
                    />
                    <SummaryCard
                        title="Inventory Value"
                        value={formatCurrency(stats.inventory_value)}
                        subtitle="Based on purchase price"
                        icon="💰"
                        color="amber"
                    />
                    <SummaryCard
                        title="Potential Selling Value"
                        value={formatCurrency(stats.potential_selling_value)}
                        subtitle={
                            <span className="font-semibold text-emerald-800">
                                Potential Profit: <p className='font-bold text-lg text-emerald-600'>
                                    {formatCurrency(stats.potential_profit)}
                                    </p> 
                            </span>
                        }
                        icon="💹"
                        color="emerald"
                    />
                </div>

{/* Inventory Analytics */}
<div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-2">

    {/* Category-wise Inventory */}
    <DonutChart
        title="Category-wise Inventory"
        description="Stock quantity and inventory value by category"
        data={stock_by_category}
        total_quantity={total_category}
        subtitle={"Categories"}
        valueKey="inventory_value"
        formatter={formatCurrency}
        renderDetails={(category) => (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>
                    Stock: <strong className="text-slate-700">
                        {formatNumber(category.stock)}
                    </strong>
                </span>

                <span>
                    Products: <strong className="text-slate-700">
                        {formatNumber(category.total_products)}
                    </strong>
                </span>
            </div>
        )}
    />

    {/* Product-wise Inventory */}
    <DonutChart
        title="Product-wise Inventory"
        description="Inventory value of individual products"
        data={product_value_chart}
        total_quantity={stats.total_products}
        subtitle={"Products"}
        valueKey="total_value"
        formatter={formatCurrency}
    />

    {/* Stock Status */}
    <StockStatusChart
        stockStatus={stock_status}
    />

</div>

                {/* Product Stock Report */}
                <div className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-5">
                        <h3 className="text-base font-semibold text-slate-800">
                            Product Stock Report
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Search and analyze individual product stock levels.
                        </p>

                        {/* Filters */}
                        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
                            >
                                <option value="">All Categories</option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
                            >
                                <option value="">All Stock Status</option>
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Low Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>

                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="quantity">Sort by Quantity</option>
                                <option value="purchase_price">Sort by Purchase Price</option>
                                <option value="selling_price">Sort by Selling Price</option>
                                <option value="created_at">Sort by Date</option>
                            </select>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setDirection(
                                    direction === 'asc' ? 'desc' : 'asc'
                                )}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                {direction === 'asc'
                                    ? '↑ Ascending'
                                    : '↓ Descending'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setCategoryFilter('');
                                    setStockFilter('');
                                    setSort('name');
                                    setDirection('asc');
                                }}
                                className="text-xs font-medium text-slate-500 hover:text-indigo-600"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Product</th>
                                    <th className="px-5 py-4">Category</th>
                                    <th className="px-5 py-4">Quantity</th>
                                    <th className="px-5 py-4">Minimum Stock</th>
                                    <th className="px-5 py-4">Purchase Price</th>
                                    <th className="px-5 py-4">Selling Price</th>
                                    <th className="px-5 py-4">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {productList.length > 0 ? (
                                    productList.map((product) => {
                                        const status =
                                            Number(product.quantity) === 0
                                                ? 'out_of_stock'
                                                : Number(product.quantity) <= Number(product.minimum_stock)
                                                    ? 'low_stock'
                                                    : 'in_stock';

                                        const statusStyles = {
                                            in_stock: 'bg-emerald-50 text-emerald-700',
                                            low_stock: 'bg-amber-50 text-amber-700',
                                            out_of_stock: 'bg-rose-50 text-rose-700',
                                        };

                                        const statusLabels = {
                                            in_stock: 'In Stock',
                                            low_stock: 'Low Stock',
                                            out_of_stock: 'Out of Stock',
                                        };

                                        return (
                                            <tr
                                                key={product.id}
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-5 py-4 font-medium text-slate-800">
                                                    {product.name}
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {product.category?.name || 'Uncategorized'}
                                                </td>

                                                <td className="px-5 py-4 font-semibold text-slate-700">
                                                    {formatNumber(product.quantity)}
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {formatNumber(product.minimum_stock)}
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {formatCurrency(product.purchase_price)}
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {formatCurrency(product.selling_price)}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                                                        {statusLabels[status]}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-5 py-12 text-center text-slate-400"
                                        >
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products?.links && (
                        <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-500">
                                Showing {products.from || 0} to {products.to || 0} of {products.total || 0} products
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {paginationLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        preserveState
                                        onClick={(e) => {
                                            if (!link.url) e.preventDefault();
                                        }}
                                        className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                    ? 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    : 'cursor-not-allowed text-slate-300'
                                        }`}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Valuation Summary */}
                <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="font-semibold text-indigo-900">
                                Potential Selling Value
                            </h3>

                            <p className="mt-1 text-sm text-indigo-700">
                                Estimated value if all current stock is sold at its listed selling price.
                            </p>
                        </div>

                        <p className="text-xl font-bold text-indigo-900">
                            {formatCurrency(stats.potential_selling_value)}
                        </p>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
