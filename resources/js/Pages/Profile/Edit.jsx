import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
// import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ mustVerifyEmail, status ,auth }) {
    const user = auth?.user;
    const canManage = user?.role === "admin";
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />
{canManage ? (
    <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
            <div className="bg-white p-4 shadow dark:bg-[#0e172a] sm:rounded-lg sm:p-8">
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    className="max-w-xl"
                />
            </div>

            <div className="bg-white p-4 shadow dark:bg-[#0e172a] sm:rounded-lg sm:p-8">
                <UpdatePasswordForm className="max-w-xl" />
            </div>

            <div className="bg-white p-4 shadow dark:bg-[#0e172a] sm:rounded-lg sm:p-8">
                {/* <DeleteUserForm className="max-w-xl" /> */}
            </div>
        </div>
    </div>
) : (
    <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow dark:border-amber-700 dark:bg-amber-950/40 sm:rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        {/* Warning/Info Icon */}
                        <svg className="h-5 w-5 text-amber-500 dark:text-amber-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-lg text-amber-800 font-medium dark:text-amber-200">
                            Access Restricted: Only administrators can update profile information and security settings.
                            <br/>
                            Contact Admin or Owner if you want to edit your profile
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}


        </AuthenticatedLayout>
    );
}
