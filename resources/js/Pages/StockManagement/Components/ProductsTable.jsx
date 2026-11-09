import ProductRow from './ProductRow';
import Pagination from '@/Components/Pagination';

export default function ProductsTable({
  products,
  selectedProduct,
  filters,
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Products
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-center">Stock</th>
              <th className="px-6 py-3 text-center">Min</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>

            {products.data.map(product => (

              <ProductRow
                key={product.id}
                product={product}
                selected={selectedProduct?.id === product.id}
                filters={filters}
              />

            ))}

          </tbody>

        </table>

        <Pagination links={products.links} />

      </div>

    </div>
  );
}