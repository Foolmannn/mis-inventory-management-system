import Pagination from '@/Components/Pagination';

export default function StockHistory({ history }) {
  if (!history || !history.data || history.data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0e172a]">
        <h2 className="text-lg font-semibold dark:text-slate-100">
          Stock History
        </h2>

        <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          No stock movements yet.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e172a] mb-4">

      <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold dark:text-slate-100">
          Stock History
        </h2>
      </div>

      <table className="min-w-full">

        <thead className="bg-gray-50 dark:bg-[#080d18] dark:text-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase dark:text-white ">
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
              className="border-b border-gray-200 text-gray-900 dark:border-gray-800 dark:text-gray-100"
            >

              <td className="px-4 py-3">

                {movement.action === 'add' ? (
                  <span className="font-medium whitespace-nowrap text-green-600 dark:text-green-400">
                    + Add
                  </span>
                ) : (
                  <span className="font-medium whitespace-nowrap text-red-600 dark:text-red-400">
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

              <td className="px-4 py-3 text-right text-sm text-gray-500 dark:text-gray-400">
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