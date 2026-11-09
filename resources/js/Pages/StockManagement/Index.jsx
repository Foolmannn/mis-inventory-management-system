import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import Header from './Components/Header';
import SearchFilters from './Components/SearchFilters';
import ProductsTable from './Components/ProductsTable';
import ProductDetails from './Components/ProductDetails';
import StockActionForm from './Components/StockActionForm';
import StockHistory from './Components/StockHistory';

function Icon({ name, className = "h-6 w-6" }) {
    const icons = {
        arrow: <path d="m9 18 6-6-6-6" />,
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

export default function Index({
  products,
  categories,
  selectedProduct,
  stockHistory,
  filters,
}) {
  return (
    <AuthenticatedLayout             
      header={
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-slate-400">MyStore</span>
                    <Icon name="arrow" className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-700">Stock Management</span>
                </div>
            }>
      <Head title="Stock Management" />

      <div className="space-y-6 m-6">

        <Header />

        <SearchFilters
          categories={categories}
          filters={filters}
        />

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <ProductsTable
              products={products}
              selectedProduct={selectedProduct}
              filters={filters}
            />
          </div>

          <div className="space-y-6">

            <ProductDetails
              product={selectedProduct}
            />

            <StockActionForm
              product={selectedProduct}
            />

            <StockHistory
              history={stockHistory}
            />

          </div>

        </div>

      </div>
    </AuthenticatedLayout>
  );
}