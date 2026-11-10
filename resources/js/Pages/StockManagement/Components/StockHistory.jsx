import Pagination from '@/Components/Pagination';

export default function StockHistory({ history }) {
  if (!history || !history.data || history.data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Stock History
        </h2>

        <div className="py-10 text-center text-sm text-gray-500">
          No stock movements yet.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm mb-4">

      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Stock History
        </h2>
      </div>

      <table className="min-w-full">

        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Action
            </th>

            <th className="px-4 py-3 text-center text-xs font-semibold uppercase">
              Qty
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              User
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Reason
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase">
              Date
            </th>
          </tr>
        </thead>

        <tbody>

          {history.data.map((movement) => (

            <tr
              key={movement.id}
              className="border-b"
            >

              <td className="px-4 py-3">

                {movement.action === 'add' ? (
                  <span className="font-medium text-green-600">
                    + Add
                  </span>
                ) : (
                  <span className="font-medium text-red-600">
                    − Remove
                  </span>
                )}

              </td>

              <td className="px-4 py-3 text-center font-medium">
                {movement.quantity}
              </td>

              <td className="px-4 py-3">
                {movement.user.name}
              </td>

              <td className="px-4 py-3">
                {movement.reason || '-'}
              </td>

              <td className="px-4 py-3 text-right text-sm text-gray-500">
                {new Date(movement.created_at).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <Pagination links={history.links} />

    </div>
  );
}