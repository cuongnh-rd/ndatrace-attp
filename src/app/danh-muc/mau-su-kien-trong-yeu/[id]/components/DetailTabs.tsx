"use client";

interface Tab {
    id: string;
    label: string;
    badge?: number;
}

interface Props {
    tabs: Tab[];
    active: string;
    onChange: (id: string) => void;
}

export default function DetailTabs({ tabs, active, onChange }: Props) {
    return (
        <div className="flex items-center gap-0 border-b border-gray-100 dark:border-gray-800 mb-6">
            {tabs.map((tab) => {
                const isActive = tab.id === active;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`relative flex items-center gap-2 px-4 py-3 text-[14px] transition-colors ${isActive
                            ? "text-brand-600 dark:text-brand-400 font-semibold"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                    >
                        {tab.label}
                        {typeof tab.badge === "number" && (
                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-900/40">
                                {tab.badge}
                            </span>
                        )}
                        {isActive && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-600 rounded-t" />}
                    </button>
                );
            })}
        </div>
    );
}
