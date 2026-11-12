export default function StatusBadge({ status }) {
  const badges = {
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

  const badge = badges[status];

  if (!badge) return null;

  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}