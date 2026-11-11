import { router } from "@inertiajs/react";

import Modal from "@/Components/Modal";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    MdCategory,
    MdSearch,
    MdAdd,
    MdEdit,
    MdInventory2,
    MdArrowUpward,
    MdArrowDownward,
} from "react-icons/md";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// Different icon colors for category rows.
const categoryColors = [
    "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
    "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
    "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300",
    "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300",
    "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
];

// Category table.
function CategoryTable({ categories, canManage, openDeleteModal }) {
    if (categories.length === 0) {
        return (
            <div className="px-6 py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <MdCategory size={32} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">
                    No categories found
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try a different search or add a new category.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
                {/* Table headings */}
                <thead className="bg-slate-50 dark:bg-[#080d18]">
                    <tr className="border-y border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Products</th>

                        {canManage && (
                            <th className="px-6 py-4 text-right">Actions</th>
                        )}
                    </tr>
                </thead>

                {/* Table body */}
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categories.map((category, index) => (
                        <tr
                            key={category.id}
                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
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
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                                            {category.name}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                            ID: {category.id}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Description */}
                            <td className="px-6 py-4">
                                <p
                                    className="max-w-md truncate text-sm text-slate-500 dark:text-slate-400"
                                    title={category.description || ""}
                                >
                                    {category.description || "No description"}
                                </p>
                            </td>

                            {/* Product count */}
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    <MdInventory2
                                        size={16}
                                        className="text-slate-500 dark:text-slate-400"
                                    />

                                    {category.products_count ?? 0}

                                    {category.products_count === 1
                                        ? "product"
                                        : "products"}
                                </span>
                            </td>

                            {/* Actions */}
                            {canManage && (
                                <td className="px-6 py-4">
                                    <div className="flex justify-end">
                                        <Link
                                            href={route(
                                                "category.edit",
                                                category.id,
                                            )}
                                            title="Edit category"
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-950/50"
                                        >
                                            <MdEdit size={21} />
                                        </Link>

                                        {/* Delete button */}
                                        <button
                                            type="button"
                                            title="Delete category"
                                            onClick={() =>
                                                openDeleteModal(category)
                                            }
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/50"
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
export default function Index({ categories, auth, filters = {} }) {
    // const [search, setSearch] = useState('');
    const [search, setSearch] = useState(filters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Sorting state
    const [sort, setSort] = useState(filters.sort || "name");
    const [direction, setDirection] = useState(filters.direction || "asc");

    // Send search and sorting parameters to Laravel
    const applyFilters = (newSort, newDirection) => {
        router.get(
            route("category.index"),
            {
                search: search,
                sort: newSort,
                direction: newDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // dropdown handler

    const handleSortChange = (e) => {
        const newSort = e.target.value;

        setSort(newSort);

        applyFilters(newSort, direction);
    };

    const toggleSortDirection = () => {
        const newDirection = direction === "asc" ? "desc" : "asc";

        setDirection(newDirection);

        applyFilters(sort, newDirection);
    };

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

        router.delete(route("category.destroy", selectedCategory.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedCategory(null);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
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
    const canManage = user?.role === "admin";

    const totalCategories = categories?.total ?? categoryList.length;

    // Server-side search with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route("category.index"),
                {
                    search: search,
                    sort: sort,
                    direction: direction,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-slate-400 dark:text-slate-500">MyStore</span>
                    <span className="text-slate-300 dark:text-slate-600">›</span>
                    <span className="text-slate-700 dark:text-slate-200">Categories</span>
                </div>
            }
        >
            <Head title="Categories" />

            <div className="min-h-screen bg-slate-50 px-5 py-8 dark:bg-[#080d18] sm:px-8">
                {/* Page heading */}
                <div className="mb-7">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Categories
                    </h1>

                    <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                        Organize products into easy-to-find categories.
                    </p>
                </div>

                {/* Main category card */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e172a]">
                    {/* Card header */}
                    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                Product categories
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {totalCategories} categories in your store
                            </p>
                        </div>

                        {/* Add category */}
                        {canManage && (
                            <Link
                                href={route("category.create")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <MdAdd size={21} />
                                Add category
                            </Link>
                        )}
                    </div>

                    {/* Search and Sorting */}
                    <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* Search */}
                            <div className="relative w-full sm:max-w-md">
                                <MdSearch
                                    size={21}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search categories..."
                                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-[#080d18] dark:text-slate-100 dark:placeholder:text-slate-500"
                                />
                            </div>

                            {/* Sorting */}
                            <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Sort by:
                                </span>

                                {/* Sort dropdown */}
                                <select
                                    value={sort}
                                    onChange={handleSortChange}
                                    className="rounded-lg border border-slate-200 bg-white px-7 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-[#080d18] dark:text-slate-100"
                                >
                                    <option value="name">Category Name </option>
                                    <option value="products_count">
                                        Product Count
                                    </option>
                                </select>

                                {/* Sort direction button */}
                                <button
                                    type="button"
                                    onClick={toggleSortDirection}
                                    title={
                                        direction === "asc"
                                            ? "Ascending order"
                                            : "Descending order"
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-indigo-950/50"
                                >
                                    {direction === "asc" ? (
                                        <MdArrowUpward size={20} />
                                    ) : (
                                        <MdArrowDownward size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories table */}
                    <CategoryTable
                        categories={categoryList}
                        canManage={canManage}
                        openDeleteModal={openDeleteModal}
                    />

                    {/* Pagination */}
                    {paginationLinks.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Page {categories.current_page} of{" "}
                                {categories.last_page}
                            </p>

                            <div className="flex flex-wrap items-center gap-1">
                                {paginationLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        preserveScroll
                                        preserveState
                                        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                            link.active
                                                ? "bg-indigo-600 text-white"
                                                : link.url
                                                  ? "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                                  : "cursor-not-allowed text-slate-300 dark:text-slate-600"
                                        }`}
                                    >
                                        {link.label
                                            .replace(/&laquo;/g, "«")
                                            .replace(/&raquo;/g, "»")}
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
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
                        <MdDeleteOutline size={27} />
                    </div>

                    {/* Modal heading */}
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Delete Category?
                    </h2>

                    {/* Warning message */}
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Are you sure you want to delete the category{" "}
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                            "{selectedCategory?.name}"
                        </span>
                        ?
                    </p>

                    <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                        This action cannot be undone. Please make sure this
                        category is no longer needed before proceeding.
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
                            {deleting ? "Deleting..." : "Delete Category"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
