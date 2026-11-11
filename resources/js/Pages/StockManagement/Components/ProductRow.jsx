import { router } from '@inertiajs/react';
import StatusBadge from './StatusBadge';

export default function ProductRow({
  product,
  selected,
  filters,
}) {
  function selectProduct() {
    router.get(
      route('stock-management.index'),
      {
        ...filters,
        product: product.id,
      },
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      }
    );
  }

  return (
    <tr
      onClick={selectProduct}
      className={`cursor-pointer border-b border-gray-200 text-gray-900 transition dark:border-gray-800 dark:text-gray-100 ${
        selected ? 'bg-indigo-50 dark:bg-indigo-950/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <td className="px-6 py-4 font-medium">
        {product.name}
      </td>

      <td className="px-6 py-4">
        {product.category.name}
      </td>

      <td className="px-6 py-4 text-center">
        {product.quantity}
      </td>

      <td className="px-6 py-4 text-center">
        {product.minimum_stock}
      </td>

      <td className="px-6 py-4 text-center">
        <StatusBadge status={product.status} />
      </td>
    </tr>
  );
}