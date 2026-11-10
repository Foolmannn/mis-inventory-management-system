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
      className={`
                cursor-pointer border-b transition

                ${selected
          ? 'bg-indigo-50'
          : 'hover:bg-gray-50'}
            `}
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