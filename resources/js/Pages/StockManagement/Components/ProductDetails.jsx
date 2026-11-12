export default function ProductDetails({ product }) {
  if (!product) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0e172a]">
        <h2 className="text-lg font-semibold dark:text-slate-100">
          Product Details
        </h2>

        <div className="flex h-64 items-center justify-center text-center">
          <div>
            <div className="text-5xl">📦</div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Select a product from the list
              <br />
              to manage its stock.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const status = {
    in_stock: {
      label: 'In Stock',
      className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    },
    low_stock: {
      label: 'Low Stock',
      className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    },
    out_of_stock: {
      label: 'Out of Stock',
      className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    },
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0e172a]">

      <h2 className="mb-6 text-lg font-semibold dark:text-slate-100">
        Product Details
      </h2>

      <div className="mb-6">

        <h3 className="text-xl font-semibold dark:text-white">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {product.category.name}
        </p>

      </div>

      <div className="grid grid-cols-3 gap-3">

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-[#080d18]">

          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Stock
          </p>

          <p className="mt-2 text-3xl font-bold dark:text-white">
            {product.quantity}
          </p>

        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-[#080d18]">

          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Minimum
          </p>

          <p className="mt-2 text-3xl font-bold dark:text-white">
            {product.minimum_stock}
          </p>

        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-[#080d18]">

          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Status
          </p>

          <div className="mt-3">

            <span
              className={`rounded-full px-3 py-1 whitespace-nowrap text-xs font-medium ${status[product.status].className}`}
            >
              {status[product.status].label}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}