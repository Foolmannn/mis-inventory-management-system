import { useEffect, useRef, useState } from 'react';
import {
    MdCheckCircleOutline,
    MdClose,
    MdErrorOutline,
} from 'react-icons/md';

const toastStyles = {
    success: {
        icon: MdCheckCircleOutline,
        className:
            'border-emerald-200 bg-white text-emerald-800 dark:border-emerald-900 dark:bg-[#0e172a] dark:text-emerald-300',
    },
    error: {
        icon: MdErrorOutline,
        className:
            'border-red-200 bg-white text-red-800 dark:border-red-900 dark:bg-[#0e172a] dark:text-red-300',
    },
};

export default function Toast({ flash }) {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(0);

    useEffect(() => {
        const newToasts = Object.entries(toastStyles)
            .filter(([type]) => typeof flash?.[type] === 'string' && flash[type].trim())
            .map(([type]) => ({
                id: nextId.current++,
                type,
                message: flash[type],
            }));

        if (newToasts.length > 0) {
            setToasts((currentToasts) => [...currentToasts, ...newToasts]);
        }
    }, [flash]);

    useEffect(() => {
        if (toasts.length === 0) return undefined;

        const timers = toasts.map(({ id }) =>
            window.setTimeout(() => {
                setToasts((currentToasts) =>
                    currentToasts.filter((toast) => toast.id !== id),
                );
            }, 5000),
        );

        return () => timers.forEach(window.clearTimeout);
    }, [toasts]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed right-4 top-20 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-24">
            {toasts.map((toast) => {
                const { icon: Icon, className } = toastStyles[toast.type];

                return (
                    <div
                        key={toast.id}
                        role={toast.type === 'error' ? 'alert' : 'status'}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${className}`}
                    >
                        <Icon className="mt-0.5 shrink-0" size={20} />
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            type="button"
                            aria-label="Dismiss notification"
                            onClick={() =>
                                setToasts((currentToasts) =>
                                    currentToasts.filter((item) => item.id !== toast.id),
                                )
                            }
                            className="shrink-0 rounded p-0.5 opacity-70 transition hover:opacity-100"
                        >
                            <MdClose size={18} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
