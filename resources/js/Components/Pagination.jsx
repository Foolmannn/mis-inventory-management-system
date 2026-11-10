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
            className="flex items-center justify-end gap-2 border-t bg-white px-6 py-4"
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
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
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