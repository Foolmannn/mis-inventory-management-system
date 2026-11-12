import { Head, router } from "@inertiajs/react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function Forbidden() {
  return (
    <>
      <Head title="403 - Forbidden" />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>

          <p className="mt-6 text-6xl font-bold tracking-tight text-gray-900">
            403
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-gray-900">
            Access Denied
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            You don't have permission to access this page.
            <br />
            If you believe this is a mistake, please contact an
            administrator.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            <button
              onClick={() => router.visit(route("dashboard"))}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Home size={18} />
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}