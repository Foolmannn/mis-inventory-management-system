import { router } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    function visit(url) {
        if (!url) return;

        router.visit(url, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function getLabel(label) {
        return label
            .replace(/&laquo;/g, '←')
            .replace(/&raquo;/g, '→');
    }

    return (
        <nav
            className="flex items-center justify-end gap-2 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-[#0e172a]"
            aria-label="Pagination"
        >
            {links.map((link, index) => (
                <button
                    key={index}
                    type="button"
                    disabled={!link.url}
                    onClick={() => visit(link.url)}
                    className={`
                        rounded-lg px-3 py-2 text-sm font-medium transition

                        ${link.active
                            ? 'bg-indigo-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#080d18] dark:text-gray-200 dark:hover:bg-gray-800'
                        }

                        ${!link.url
                            ? 'cursor-not-allowed opacity-50'
                            : ''
                        }
                    `}
                >
                    {getLabel(link.label)}
                </button>
            ))}
        </nav>
    );
}