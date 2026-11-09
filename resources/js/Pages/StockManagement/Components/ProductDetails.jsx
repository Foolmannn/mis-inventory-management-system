export default function ProductDetails({ product }) {
  if (!product) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Product Details
        </h2>

        <div className="flex h-64 items-center justify-center text-center">
          <div>
            <div className="text-5xl">📦</div>

            <p className="mt-4 text-sm text-gray-500">
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
      className: 'bg-green-100 text-green-700',
    },
    low_stock: {
      label: 'Low Stock',
      className: 'bg-yellow-100 text-yellow-700',
    },
    out_of_stock: {
      label: 'Out of Stock',
      className: 'bg-red-100 text-red-700',
    },
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-lg font-semibold">
        Product Details
      </h2>

      <div className="mb-6">

        <h3 className="text-xl font-semibold">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {product.category.name}
        </p>

      </div>

      <div className="grid grid-cols-3 gap-3">

        <div className="rounded-lg border bg-gray-50 p-4 text-center">

          <p className="text-xs uppercase tracking-wide text-gray-500">
            Stock
          </p>

          <p className="mt-2 text-3xl font-bold">
            {product.quantity}
          </p>

        </div>

        <div className="rounded-lg border bg-gray-50 p-4 text-center">

          <p className="text-xs uppercase tracking-wide text-gray-500">
            Minimum
          </p>

          <p className="mt-2 text-3xl font-bold">
            {product.minimum_stock}
          </p>

        </div>

        <div className="rounded-lg border bg-gray-50 p-4 text-center">

          <p className="text-xs uppercase tracking-wide text-gray-500">
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