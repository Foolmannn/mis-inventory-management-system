
import { Head, Link, useForm } from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('category.update', category.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">MyStore</span>
                    <span className="text-slate-300">›</span>
                    <Link
                        href={route('category.index')}
                        className="text-slate-500 hover:text-indigo-600"
                    >
                        Categories
                    </Link>
                    <span className="text-slate-300">›</span>
                    <span className="font-medium text-slate-700">
                        Edit Category
                    </span>
                </div>
            }
        >
            <Head title={`Edit ${category.name}`} />

            <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8">

                {/* Heading */}
                <div className="mb-7">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Edit Category
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Update the information of your existing category.
                    </p>
                </div>

                {/* Form card */}
                <div className="max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-6 py-5">
                        <h2 className="text-lg font-bold text-slate-900">
                            Category Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Category ID: #{category.id}
                        </p>
                    </div>

                    <form onSubmit={submit}>

                        <div className="space-y-6 p-6">

                            {/* Name */}
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
                                    onChange={(e) =>
                                        setData('name', e.target.value)
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
                                        setData('description', e.target.value)
                                    }
                                    rows={5}
                                    placeholder="Describe this category..."
                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />

                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">

                            <Link href={route('category.index')}>
                                <SecondaryButton type="button">
                                    Cancel
                                </SecondaryButton>
                            </Link>

                            <PrimaryButton disabled={processing}>
                                {processing ? 'Updating...' : 'Update Category'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
