import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Edit({ staffMember }) {
    const { data, setData, put, processing, errors } = useForm({
        name: staffMember.name ?? "",
        email: staffMember.email ?? "",
        password: "",
        password_confirmation: "",
        role: staffMember.role ?? "staff",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("staff.update", staffMember.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Edit Staff
                </h2>
            }
        >
            <Head title="Edit Staff" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm">
                        <Link
                            href={route("staff.index")}
                            className="text-gray-500 hover:text-indigo-600 dark:text-gray-400"
                        >
                            Staff Management
                        </Link>

                        <span className="text-gray-400 dark:text-gray-600">/</span>

                        <span className="font-medium text-gray-800 dark:text-gray-200">
                            Edit Staff
                        </span>
                    </div>

                    {/* Form Card */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#0e172a]">
                        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Edit Staff Information
                            </h3>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Update the account details for{" "}
                                {staffMember.name}.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-6">
                            {/* Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Full Name" />

                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    autoComplete="name"
                                    required
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email Address"
                                />

                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    autoComplete="email"
                                    required
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <InputLabel
                                    htmlFor="role"
                                    value="Account Role"
                                />

                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-[#080d18] dark:text-white"
                                    required
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <InputError
                                    message={errors.role}
                                    className="mt-2"
                                />
                            </div>

                            {/* Password Section */}
                            <div className="border-t border-gray-200 pt-5 dark:border-gray-800">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    Change Password
                                </h4>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Leave these fields empty if you don't want
                                    to change the existing password.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="New Password"
                                    />

                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Enter new password"
                                        autoComplete="new-password"
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirm New Password"
                                    />

                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Confirm new password"
                                        autoComplete="new-password"
                                    />

                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
                                <Link href={route("staff.index")}>
                                    <SecondaryButton type="button">
                                        Cancel
                                    </SecondaryButton>
                                </Link>

                                <PrimaryButton disabled={processing}>
                                    {processing
                                        ? "Updating..."
                                        : "Update Account"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
