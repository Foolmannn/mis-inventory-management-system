import { router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

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
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={data.search}
          onChange={(e) =>
            setData('search', e.target.value)
          }
          className="rounded-lg border"
        />

        {/* Category */}
        <select
          value={data.category_id}
          onChange={(e) =>
            setData('category_id', e.target.value)
          }
          className="rounded-lg border"
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
          className="rounded-lg border"
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
          className="rounded-lg border"
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
          onClick={resetFilters}
          className="rounded-lg border px-4 py-2"
        >
          Reset
        </button>

      </div>

    </div>
  );
}