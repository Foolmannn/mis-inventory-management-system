import { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';

export default function StockActionForm({ product }) {
  const { auth } = usePage().props;

  const isAdmin = auth.user.role === 'admin';

  const { data, setData, post, processing, errors, reset } = useForm({
    product_id: product?.id ?? '',
    action: isAdmin ? 'add' : 'remove',
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    setData((current) => ({
      ...current,
      product_id: product?.id ?? '',
      quantity: '',
      reason: '',
      action: isAdmin ? 'add' : 'remove',
    }));
  }, [product?.id]);

  if (!product) {
    return null;
  }

  function submit(e) {
    e.preventDefault();

    const routeName =
      data.action === 'add'
        ? 'stock-management.add'
        : 'stock-management.remove';

    post(route(routeName), {
      preserveScroll: true,
      onSuccess: () => {
        reset('quantity', 'reason');
      },
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0e172a]">
      <h2 className="mb-6 text-lg font-semibold dark:text-slate-100">
        Stock Adjustment
      </h2>

      <form
        onSubmit={submit}
        className="space-y-5"
      >
        {/* Action */}
        {isAdmin ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Action
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 dark:text-white">
                <input
                  type="radio"
                  name="action"
                  value="add"
                  checked={data.action === 'add'}
                  onChange={(e) =>
                    setData('action', e.target.value)
                  }
                />

                <span>Add Stock</span>
              </label>

              <label className="flex items-center gap-2 dark:text-white">
                <input
                  type="radio"
                  name="action"
                  value="remove"
                  checked={data.action === 'remove'}
                  onChange={(e) =>
                    setData('action', e.target.value)
                  }
                />

                <span>Remove Stock</span>
              </label>
            </div>
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Action
            </label>

            <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium dark:bg-[#080d18]">
              Remove Stock
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Quantity
          </label>

          <input
            id="quantity"
            type="number"
            min="1"
            value={data.quantity}
            onChange={(e) =>
              setData('quantity', e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-[#080d18] dark:text-white"
          />

          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.quantity}
            </p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label
            htmlFor="reason"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Reason
          </label>

          <textarea
            id="reason"
            rows={3}
            value={data.reason}
            onChange={(e) =>
              setData('reason', e.target.value)
            }
            placeholder="Enter the reason for this stock adjustment"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-[#080d18] dark:text-white"
          />

          {errors.reason && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.reason}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={processing}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing
              ? 'Saving...'
              : data.action === 'add'
                ? 'Add Stock'
                : 'Remove Stock'}
          </button>
        </div>
      </form>
    </div>
  );
}