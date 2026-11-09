import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import HistoryTable from './Components/HistoryTable';
import { Head } from '@inertiajs/react';

export default function Index({ history }) {
  return (
    <AuthenticatedLayout>
      <Head title="Stock History" />

      <div className="space-y-6 m-6">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Stock History
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View all inventory changes in chronological order.
          </p>
        </div>


        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <HistoryTable history={history} />

        </div>

      </div>
    </AuthenticatedLayout>
  );
}