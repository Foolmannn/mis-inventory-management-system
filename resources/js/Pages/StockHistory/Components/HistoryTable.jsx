import Pagination from '@/Components/Pagination';

export default function HistoryTable({ history }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Product
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Action
              </th>

              <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                Quantity
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                User
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Reason
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                Date
              </th>
            </tr>
          </thead>


          <tbody>

            {history.data.map((movement) => (
              <tr
                key={movement.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="px-6 py-4 font-medium">
                  {movement.product.name}
                </td>


                <td className="px-6 py-4">

                  {movement.action === 'add' ? (
                    <span className="font-medium text-green-600">
                      + Add
                    </span>
                  ) : (
                    <span className="font-medium text-red-600">
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


                <td className="px-6 py-4 text-right text-sm text-gray-500">
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