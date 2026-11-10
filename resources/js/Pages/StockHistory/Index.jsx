import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import HistoryTable from './Components/HistoryTable';
import { Head } from '@inertiajs/react';

function Icon({ name, className = "h-6 w-6" }) {
    const icons = {
        arrow: <path d="m9 18 6-6-6-6" />,
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {icons[name]}
        </svg>
    );
}
export default function Index({ history }) {
  return (
          <AuthenticatedLayout
              header={
                  <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-slate-400">MyStore</span>
                      <Icon name="arrow" className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-700">Stock History</span>
                  </div>
              }
          >
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