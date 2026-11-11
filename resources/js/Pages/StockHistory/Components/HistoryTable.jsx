import Pagination from '@/Components/Pagination';

export default function HistoryTable({ history }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e172a]">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50 text-gray-600 dark:bg-[#080d18] dark:text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Product
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Action
              </th>

              <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Quantity
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                User
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Reason
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Date
              </th>
            </tr>
          </thead>


          <tbody>

            {history.data.map((movement) => (
              <tr
                key={movement.id}
                className="border-b border-gray-200 text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-800/50"
              >

                <td className="px-6 py-4 font-medium">
                  {movement.product.name}
                </td>


                <td className="px-6 py-4">

                  {movement.action === 'add' ? (
                    <span className="font-medium text-green-600 dark:text-green-400">
                      + Add
                    </span>
                  ) : (
                    <span className="font-medium text-red-600 dark:text-red-400">
                      - Remove
                    </span>
                  )}

                </td>


                <td className="px-6 py-4 text-center">
                  {movement.quantity}
                </td>


                <td className="px-6 py-4">
                  {movement.user.name}
                </td>


                <td className="px-6 py-4">
                  {movement.reason || '-'}
                </td>


                <td className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                  {new Date(
                    movement.created_at
                  ).toLocaleString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>


      <Pagination links={history.links} />

    </div>
  );
}