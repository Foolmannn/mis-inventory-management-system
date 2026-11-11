import { Head, Link, useForm } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("category.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400 dark:text-slate-500">MyStore</span>
                    <span className="text-slate-300 dark:text-slate-600">›</span>
                    <Link
                        href={route("category.index")}
                        className="text-slate-500 hover:text-indigo-600 dark:text-slate-400"
                    >
                        Categories
                    </Link>
                    <span className="text-slate-300 dark:text-slate-600">›</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                        Add Category
                    </span>
                </div>
            }
        >
            <Head title="Add Category" />

            <div className="min-h-screen bg-slate-50 px-5 py-8 dark:bg-[#080d18] sm:px-8">
                {/* Page heading */}
                <div className="mb-7">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                        Add Category
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Create a new category to organize your inventory
                        products.
                    </p>
                </div>

                {/* Form card */}
                <div className="max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e172a]">
                    <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            Category Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Enter the basic details of your new category.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <div className="space-y-6 p-6">
                            {/* Category name */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Category Name"
                                />

                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-2 block w-full"
                                    placeholder="e.g. Electronics, Groceries"
                                    isFocused
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                />

                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={5}
                                    placeholder="Describe what types of products belong in this category..."
                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-[#080d18] dark:text-white"
                                />

                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />

                                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                                    Provide a short description to help identify
                                    this category.
                                </p>
                            </div>
                        </div>

                        {/* Form actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-[#080d18]">
                            <Link href={route("category.index")}>
                                <SecondaryButton type="button">
                                    Cancel
                                </SecondaryButton>
                            </Link>

                            <PrimaryButton disabled={processing}>
                                {processing ? "Creating..." : "Create Category"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
