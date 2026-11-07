import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Product({  }) {
    console.log('Product props:', {  });
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Product
                </h2>
            }
        >
            <Head title="Product" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className='font-bold text-3xl text-red-300'>Hello world product page </h2>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
