import { router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { RiResetLeftFill } from 'react-icons/ri';

export default function SearchFilters({
  categories,
  filters,
}) {
  const { data, setData } = useForm({
    search: filters.search ?? '',
    category_id: filters.category_id ?? '',
    stock_status: filters.stock_status ?? '',
    sort: filters.sort ?? 'name',
    direction: filters.direction ?? 'asc',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.get(
        route('stock-management.index'),
        data,
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
        }
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [data]);

  function resetFilters() {
    router.get(route('stock-management.index'));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0e172a]">

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={data.search}
          onChange={(e) =>
            setData('search', e.target.value)
          }
          className="rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-[#080d18] dark:text-gray-100 dark:placeholder:text-gray-500"
        />

        {/* Category */}
        <select
          value={data.category_id}
          onChange={(e) =>
            setData('category_id', e.target.value)
          }
          className="rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-[#080d18] dark:text-gray-100"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        {/* Stock Status */}
        <select
          value={data.stock_status}
          onChange={(e) =>
            setData('stock_status', e.target.value)
          }
          className="rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-[#080d18] dark:text-gray-100"
        >
          <option value="">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>

        {/* Sort */}
        <select
          value={data.sort}
          onChange={(e) =>
            setData('sort', e.target.value)
          }
          className="rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-[#080d18] dark:text-gray-100"
        >
          <option value="name">
            Product Name
          </option>

          <option value="quantity">
            Current Stock
          </option>
        </select>

        {/* Reset */}
                  <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <RiResetLeftFill size={20}/>
                            Reset
                        </button>

      </div>

    </div>
  );
}