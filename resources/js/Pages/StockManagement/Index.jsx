import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import Header from './Components/Header';
import SearchFilters from './Components/SearchFilters';
import ProductsTable from './Components/ProductsTable';
import ProductDetails from './Components/ProductDetails';
import StockActionForm from './Components/StockActionForm';
import StockHistory from './Components/StockHistory';

export default function Index({
  products,
  categories,
  selectedProduct,
  stockHistory,
  filters,
}) {
  return (
    <AuthenticatedLayout>
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