import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

// Normalize backend stock status.
function normalizeStatus(status) {
    return String(status || '')
        .toLowerCase()
        .replaceAll(' ', '_');
}

// Stock status badge.
function ProductStatus({ status }) {
    const normalized = normalizeStatus(status);

    const styles = {
        in_stock: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        low_stock: 'bg-amber-50 text-amber-700 ring-amber-200',
        out_of_stock: 'bg-red-50 text-red-700 ring-red-200',
    };

    const labels = {
        in_stock: 'In Stock',
        low_stock: 'Low Stock',
        out_of_stock: 'Out of Stock',
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                styles[normalized] ||
                'bg-slate-100 text-slate-600 ring-slate-200'
            }`}
        >
            {labels[normalized] || status || 'Unknown'}
        </span>
    );
}

// Reusable icon.
function Icon({ name, className = 'h-5 w-5' }) {
    const icons = {
        search: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
            </>
        ),
        plus: <path d="M12 5v14m-7-7h14" />,
        box: (
            <>
                <path d="m12 2 9 5-9 5-9-5 9-5Z" />
                <path d="m3 7 9 5 9-5M3 7v10l9 5 9-5V7M12 12v10" />
            </>
        ),
        eye: (
            <>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
        edit: (
            <>
                <path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15v5Z" />
            </>
        ),
        delete: (
            <>
                <path d="M3 6h18m-2 0-1 14H6L5 6m4 0V4h6v2m-5 4v6m4-6v6" />
            </>
        ),
        filter: (
            <path d="M4 5h16l-6.5 8v5l-3 1v-6L4 5Z" />
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

// Currency formatting.
function formatPrice(price) {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(Number(price) || 0);
}

// Product table.
function ProductTable({ products, openDeleteModal ,canManage }) {


    if (products.length === 0) {
        return (
            <div className="px-6 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Icon name="box" className="h-8 w-8" />
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                    No products found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left">
                <thead className="bg-slate-50">
                    <tr className="border-y border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-5 py-4">Product</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Purchase</th>
                        <th className="px-5 py-4">Selling</th>
                        <th className="px-5 py-4">Quantity</th>
                        <th className="px-5 py-4">Min. Stock</th>
                        <th className="px-5 py-4">Status</th>
                
                        {canManage && (
                            <th className="px-6 py-4 text-right">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className="transition hover:bg-slate-50/80"
                        >
                            {/* Product */}
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                        <Icon name="box" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-800">
                                            {product.name}
                                        </p>

                                        <p
                                            className="mt-0.5 max-w-48 truncate text-xs text-slate-400"
                                            title={product.description}
                                        >
                                            {product.description || 'No description'}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-400">
                                            ID: {product.id}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Category */}
                            <td className="px-5 py-4 text-sm text-slate-600">
                                {product.category?.name || 'Uncategorized'}
                            </td>

                            {/* Purchase price */}
                            <td className="px-5 py-4 text-sm text-slate-600">
                                {formatPrice(product.purchase_price)}
                            </td>

                            {/* Selling price */}
                            <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                {formatPrice(product.selling_price)}
                            </td>

                            {/* Quantity */}
                            <td className="px-5 py-4 text-sm text-slate-600">
                                {product.quantity}
                            </td>

                            {/* Minimum stock */}
                            <td className="px-5 py-4 text-sm text-slate-600">
                                {product.minimum_stock}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                                <ProductStatus status={product.status} />
                            </td>

                            {/* Actions */}
                            {canManage && (<td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-1">


                                    <Link
                                        href={route('product.edit', product.id)}
                                        title="Edit product"
                                        className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        <Icon name="edit" />
                                    </Link>

{/* Delete Button  */}
                                    <button
                                            type="button"
                                            title="Delete product"
                                            onClick={() => openDeleteModal(product)}
                                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Icon name="delete" />
                                        </button>
                                </div>
                            </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Main page.
export default function Index({ auth,products, categories = [] }) {
    // Check whether the logged-in user is an admin.

    const user = auth?.user;
    const canManage = user?.role === 'admin';

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
    };

    const closeDeleteModal = () => {
        if (deleting) return;
        setSelectedProduct(null);
    };

    const confirmDelete = () => {
        if (!selectedProduct) return;

        setDeleting(true);

        router.delete(
            route('product.destroy', selectedProduct.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedProduct(null);
                },
                onFinish: () => {
                    setDeleting(false);
                },
            }
        );
    };
    // Laravel paginator returns records inside products.data.
    const productList = Array.isArray(products)
        ? products
        : products?.data || [];

    // For now, filtering applies to the currently loaded page.
    // We will move these filters to Laravel for full-dataset searching.
    const filteredProducts = useMemo(() => {
        return productList.filter((product) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                String(product.id).includes(searchText) ||
                product.name?.toLowerCase().includes(searchText) ||
                product.description?.toLowerCase().includes(searchText);

            const matchesCategory =
                categoryFilter === 'all' ||
                String(product.category?.id) === categoryFilter;

            const matchesStock =
                stockFilter === 'all' ||
                normalizeStatus(product.status) === stockFilter;

            return matchesSearch && matchesCategory && matchesStock;
        });
    }, [productList, search, categoryFilter, stockFilter]);

    const paginationLinks = Array.isArray(products?.links)
        ? products.links
        : [];

    const categoryOptions = categories.length
        ? categories
        : productList.reduce((result, product) => {
            if (
                product.category &&
                !result.some((item) => item.id === product.category.id)
            ) {
                result.push(product.category);
            }
            return result;
        }, []);

    const resetFilters = () => {
        setSearch('');
        setCategoryFilter('all');
        setStockFilter('all');
        setShowFilters(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-slate-400">MyStore</span>
                    <span className="text-slate-300">›</span>
                    <span className="text-slate-700">Products</span>
                </div>
            }
        >
            <Head title="Products" />

            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="mb-7">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Products
                    </h1>

                    <p className="mt-2 text-base text-slate-500">
                        View and manage all products in your inventory.
                    </p>
                </div>

                {/* Product container */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    {/* Toolbar */}
                    <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center">

                        {/* Search */}
                        <div className="relative min-w-0 flex-1">
                            <Icon
                                name="search"
                                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Category */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:ring-indigo-100"
                        >
                            <option value="all">All categories</option>

                            {categoryOptions.map((category) => (
                                <option
                                    key={category.id}
                                    value={String(category.id)}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Stock status */}
                        <select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:ring-indigo-100"
                        >
                            <option value="all">All stock</option>
                            <option value="in_stock">In Stock</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>

                        {/* Advanced filters */}
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <Icon name="filter" />
                            Filters
                        </button>

                        {/* Add product */}
                        {canManage && (<Link
                            href={route('product.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Icon name="plus" />
                            Add product
                        </Link>
                        )}
                    </div>

                    {/* Advanced filters */}
                    {showFilters && (
                        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
                            <p className="text-sm font-medium text-slate-600">
                                Active filters:
                            </p>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Results summary */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-semibold text-slate-800">
                                {filteredProducts.length}
                            </span> products on this page
                        </p>

                        <p className="text-xs text-slate-400">
                            {products?.total ?? productList.length} total products
                        </p>
                    </div>

                    {/* Table */}
                    <ProductTable products={filteredProducts} openDeleteModal={openDeleteModal} canManage={canManage} />

                    {/* Pagination */}
                    {paginationLinks.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-5 py-4">

                            <p className="text-sm text-slate-500">
                                Page {products.current_page} of {products.last_page}
                            </p>

                            <div className="flex flex-wrap items-center gap-1">
                                {paginationLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        onClick={(e) => {
                                            if (!link.url) e.preventDefault();
                                        }}
                                        className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                    ? 'text-slate-600 hover:bg-slate-100'
                                                    : 'cursor-not-allowed text-slate-300'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                    show={selectedProduct !== null}
                    onClose={closeDeleteModal}
                    maxWidth="md"
                >
                    <div className="p-6">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <Icon name="delete" className="h-6 w-6" />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Delete Product?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-slate-800">
                                "{selectedProduct?.name}"
                            </span>
                            ?
                        </p>

                        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton
                                onClick={closeDeleteModal}
                                disabled={deleting}
                            >
                                Cancel
                            </SecondaryButton>

                            <DangerButton
                                onClick={confirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete Product'}
                            </DangerButton>
                        </div>
                    </div>
                </Modal>
        </AuthenticatedLayout>
    );
}
