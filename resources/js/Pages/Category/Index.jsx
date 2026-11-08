import { router } from '@inertiajs/react';

import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { MdDeleteOutline } from 'react-icons/md';
import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    MdCategory,
    MdSearch,
    MdAdd,
    MdEdit,
    MdInventory2,
} from 'react-icons/md';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Different icon colors for category rows.
const categoryColors = [
    'bg-blue-50 text-blue-600',
    'bg-orange-50 text-orange-600',
    'bg-purple-50 text-purple-600',
    'bg-cyan-50 text-cyan-600',
    'bg-rose-50 text-rose-600',
    'bg-emerald-50 text-emerald-600',
];

// Category table.
function CategoryTable({ categories, canManage , openDeleteModal}) {
    if (categories.length === 0) {
        return (
            <div className="px-6 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <MdCategory size={32} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-800">
                    No categories found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Try a different search or add a new category.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">

                {/* Table headings */}
                <thead className="bg-slate-50">
                    <tr className="border-y border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Products</th>

                        {canManage && (
                            <th className="px-6 py-4 text-right">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>

                {/* Table body */}
                <tbody className="divide-y divide-slate-100">
                    {categories.map((category, index) => (
                        <tr
                            key={category.id}
                            className="transition-colors hover:bg-slate-50/80"
                        >
                            {/* Category name */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                            categoryColors[
                                                index % categoryColors.length
                                            ]
                                        }`}
                                    >
                                        <MdCategory size={21} />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            {category.name}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-400">
                                            ID: {category.id}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Description */}
                            <td className="px-6 py-4">
                                <p
                                    className="max-w-md truncate text-sm text-slate-500"
                                    title={category.description || ''}
                                >
                                    {category.description || 'No description'}
                                </p>
                            </td>

                            {/* Product count */}
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                                    <MdInventory2
                                        size={16}
                                        className="text-slate-500"
                                    />

                                    {category.products_count ?? 0}

                                    {category.products_count === 1
                                        ? 'product'
                                        : 'products'}
                                </span>
                            </td>

                            {/* Actions */}
                            {canManage && (
                                <td className="px-6 py-4">
                                    <div className="flex justify-end">
                                        <Link
                                            href={route(
                                                'category.edit',
                                                category.id
                                            )}
                                            title="Edit category"
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <MdEdit size={21} />
                            
                                        </Link>

            {/* Delete button */}
                            <button
                                type="button"
                                title="Delete category"
                                onClick={() => openDeleteModal(category)}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                                <MdDeleteOutline size={21} />
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

// Main Categories page.
export default function Index({ categories, auth }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
const [deleting, setDeleting] = useState(false);

const openDeleteModal = (category) => {
    setSelectedCategory(category);
};

const closeDeleteModal = () => {
    if (deleting) return;

    setSelectedCategory(null);
};

const confirmDelete = () => {
    if (!selectedCategory) return;

    setDeleting(true);

    router.delete(
        route('category.destroy', selectedCategory.id),
        {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedCategory(null);
            },
            onFinish: () => {
                setDeleting(false);
            },
        }
    );
};
    // Support both Laravel paginator and a normal array.
    const categoryList = Array.isArray(categories)
        ? categories
        : categories?.data || [];

    const paginationLinks = Array.isArray(categories?.links)
        ? categories.links
        : [];

    // Check whether the logged-in user is an admin.
    const user = auth?.user;
    const canManage = user?.role === 'admin';

    // Search categories.
    const filteredCategories = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        if (!searchText) return categoryList;

        return categoryList.filter((category) => {
            return (
                String(category.id).includes(searchText) ||
                category.name?.toLowerCase().includes(searchText) ||
                category.description?.toLowerCase().includes(searchText)
            );
        });
    }, [categoryList, search]);

    const totalCategories =
        categories?.total ?? categoryList.length;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-slate-400">MyStore</span>
                    <span className="text-slate-300">›</span>
                    <span className="text-slate-700">Categories</span>
                </div>
            }
        >
            <Head title="Categories" />

            <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8">

                {/* Page heading */}
                <div className="mb-7">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Categories
                    </h1>

                    <p className="mt-2 text-base text-slate-500">
                        Organize products into easy-to-find categories.
                    </p>
                </div>

                {/* Main category card */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    {/* Card header */}
                    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Product categories
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {totalCategories} categories in your store
                            </p>
                        </div>

                        {/* Add category */}
                        {canManage && (
                            <Link
                                href={route('category.create')}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <MdAdd size={21} />
                                Add category
                            </Link>
                        )}
                    </div>

                    {/* Search */}
                    <div className="border-t border-slate-100 px-6 py-4">
                        <div className="relative max-w-md">
                            <MdSearch
                                size={21}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    {/* Categories table */}
                    <CategoryTable
                        categories={filteredCategories}
                        canManage={canManage}
                        openDeleteModal={openDeleteModal}
                    />

                    {/* Pagination */}
                    {paginationLinks.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4">

                            <p className="text-sm text-slate-500">
                                Page {categories.current_page} of{' '}
                                {categories.last_page}
                            </p>

                            <div className="flex flex-wrap items-center gap-1">
                                {paginationLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                    ? 'text-slate-600 hover:bg-slate-100'
                                                    : 'cursor-not-allowed text-slate-300'
                                        }`}
                                    >
                                        {link.label
                                            .replace(/&laquo;/g, '«')
                                            .replace(/&raquo;/g, '»')}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
{/* Delete confirmation modal */}
<Modal
    show={selectedCategory !== null}
    onClose={closeDeleteModal}
    maxWidth="md"
>
    <div className="p-6">

        {/* Warning icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <MdDeleteOutline size={27} />
        </div>

        {/* Modal heading */}
        <h2 className="text-lg font-bold text-slate-900">
            Delete Category?
        </h2>

        {/* Warning message */}
        <p className="mt-2 text-sm leading-6 text-slate-500">
            Are you sure you want to delete the category{' '}
            <span className="font-semibold text-slate-800">
                "{selectedCategory?.name}"
            </span>
            ?
        </p>

        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            This action cannot be undone. Please make sure this category
            is no longer needed before proceeding.
        </p>

        {/* Buttons */}
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
                {deleting ? 'Deleting...' : 'Delete Category'}
            </DangerButton>

        </div>
    </div>
</Modal>

        </AuthenticatedLayout>
    );
}
