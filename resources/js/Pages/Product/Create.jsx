import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Create({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        purchase_price: "",
        selling_price: "",
        category_id: "",
        quantity: 0,
        minimum_stock: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("product.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add Product
                </h2>
            }
        >
            <Head title="Add Product" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm">
                        <Link
                            href={route("product.index")}
                            className="text-gray-500 hover:text-indigo-600"
                        >
                            Products
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="font-medium text-gray-800">
                            Add Product
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                        <div className="border-b border-gray-200 px-6 py-5">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Product Information
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Enter the details of the new product.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-6">
                            {/* Product Name */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Product Name"
                                />

                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Enter product name"
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
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Enter product description"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />

                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <InputLabel
                                    htmlFor="category_id"
                                    value="Category"
                                />

                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData("category_id", e.target.value)
                                    }
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select a category</option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                <InputError
                                    message={errors.category_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Prices */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel
                                        htmlFor="purchase_price"
                                        value="Purchase Price"
                                    />

                                    <TextInput
                                        id="purchase_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="mt-1 block w-full"
                                        value={data.purchase_price}
                                        onChange={(e) =>
                                            setData(
                                                "purchase_price",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        required
                                    />

                                    <InputError
                                        message={errors.purchase_price}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="selling_price"
                                        value="Selling Price"
                                    />

                                    <TextInput
                                        id="selling_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="mt-1 block w-full"
                                        value={data.selling_price}
                                        onChange={(e) =>
                                            setData(
                                                "selling_price",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        required
                                    />

                                    <InputError
                                        message={errors.selling_price}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel
                                        htmlFor="quantity"
                                        value="Initial Quantity"
                                    />

                                    <TextInput
                                        id="quantity"
                                        type="number"
                                        min="0"
                                        className="mt-1 block w-full"
                                        value={data.quantity}
                                        onChange={(e) =>
                                            setData("quantity", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.quantity}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="minimum_stock"
                                        value="Minimum Stock Level"
                                    />

                                    <TextInput
                                        id="minimum_stock"
                                        type="number"
                                        min="0"
                                        className="mt-1 block w-full"
                                        value={data.minimum_stock}
                                        onChange={(e) =>
                                            setData(
                                                "minimum_stock",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.minimum_stock}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
                                <Link href={route("product.index")}>
                                    <SecondaryButton type="button">
                                        Cancel
                                    </SecondaryButton>
                                </Link>

                                <PrimaryButton disabled={processing}>
                                    {processing
                                        ? "Creating..."
                                        : "Create Product"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
