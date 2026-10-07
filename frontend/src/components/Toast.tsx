import React from "react";
import { useToastStore, type ToastType } from "../shared/stores/toast.store";
import { cn } from "../shared/utils/cn";
import { Text } from "./Text";

const toastStyles: Record<ToastType, string> = {
    success: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
    error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
    info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
};

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 md:px-0 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "pointer-events-auto flex w-full items-start justify-between rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5",
                        toastStyles[toast.type]
                    )}
                >
                    <div className="flex flex-col gap-1">
                        <Text as="p" variant="sm" className="font-semibold text-inherit">
                            {toast.message}
                        </Text>
                        {toast.description && (
                            <Text as="p" variant="xs" className="opacity-80 text-inherit">
                                {toast.description}
                            </Text>
                        )}
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-inherit opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
};