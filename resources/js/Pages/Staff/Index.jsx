import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";

import { MdAdd, MdEdit, MdDeleteOutline, MdMoreHoriz } from "react-icons/md";

export default function Index({ staffMembers }) {
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { flash } = usePage().props;

    // Laravel pagination data
    const staffList = staffMembers?.data ?? [];

    const openDeleteModal = (staff) => {
        setSelectedStaff(staff);
    };

    const closeDeleteModal = () => {
        if (deleting) return;
        setSelectedStaff(null);
    };

    const confirmDelete = () => {
        if (!selectedStaff) return;

        setDeleting(true);

        router.delete(route("staff.destroy", selectedStaff.id), {
            preserveScroll: true,
            onSuccess: () => setSelectedStaff(null),
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Staff Management" />

            <div className="space-y-6 p-6">
                {/* Page Heading */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Staff Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage employee access and accounts.
                    </p>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}

                {/* Staff Table Card */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Card Header */}
                    <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Staff Accounts
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {staffMembers?.total ?? staffList.length}{" "}
                                employee accounts
                            </p>
                        </div>

                        <Link
                            href={route("staff.create")}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <MdAdd size={20} />
                            Add Staff
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Staff Member
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Email Address
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Role
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">
                                {staffList.length > 0 ? (
                                    staffList.map((staff) => (
                                        <tr
                                            key={staff.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            {/* Staff Member */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                                                        {staff.name
                                                            ?.split(" ")
                                                            .map(
                                                                (part) =>
                                                                    part[0],
                                                            )
                                                            .slice(0, 2)
                                                            .join("")
                                                            .toUpperCase()}
                                                    </div>

                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {staff.name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {staff.email}
                                            </td>

                                            {/* Role */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="text-sm capitalize text-gray-600">
                                                    {staff.role}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={route(
                                                            "staff.edit",
                                                            staff.id,
                                                        )}
                                                        title="Edit staff"
                                                        className="rounded-md p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                                                    >
                                                        <MdEdit size={21} />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                staff,
                                                            )
                                                        }
                                                        title="Delete staff"
                                                        className="rounded-md p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <MdDeleteOutline
                                                            size={21}
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-12 text-center text-sm text-gray-500"
                                        >
                                            No staff members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {staffMembers?.links && staffMembers.last_page > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-6 py-4">
                            <p className="text-sm text-gray-500">
                                Showing {staffMembers.from ?? 0} to{" "}
                                {staffMembers.to ?? 0} of {staffMembers.total}{" "}
                                staff members
                            </p>

                            <div className="flex flex-wrap items-center gap-1">
                                {staffMembers.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        preserveScroll
                                        className={`rounded-md px-3 py-2 text-sm ${
                                            link.active
                                                ? "bg-indigo-600 text-white"
                                                : link.url
                                                  ? "text-gray-600 hover:bg-gray-100"
                                                  : "cursor-not-allowed text-gray-300"
                                        }`}
                                        onClick={(e) => {
                                            if (!link.url) e.preventDefault();
                                        }}
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
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={!!selectedStaff} onClose={closeDeleteModal}>
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <MdDeleteOutline size={24} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Delete Staff Member
                            </h2>

                            <p className="mt-2 text-sm text-gray-600">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-gray-900">
                                    {selectedStaff?.name}
                                </span>
                                ? This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            type="button"
                            onClick={closeDeleteModal}
                            disabled={deleting}
                        >
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            onClick={confirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete Staff"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
