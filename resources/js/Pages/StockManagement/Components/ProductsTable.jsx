import ProductRow from './ProductRow';
import Pagination from '@/Components/Pagination';

export default function ProductsTable({
  products,
  selectedProduct,
  filters,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e172a]">

      <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold dark:text-white">
          Products
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50 dark:bg-[#080d18]">
            <tr className='dark:text-white'>
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