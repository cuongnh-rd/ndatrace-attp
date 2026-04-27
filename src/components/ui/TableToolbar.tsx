"use client";

import { ChevronDown, Search, X } from "lucide-react";

interface FilterableCol {
    key: string;
    label: string;
}

interface TableToolbarProps {
    searchable?: boolean;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filterableCols?: FilterableCol[];
    data: Record<string, unknown>[];
    filters: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
    onClearFilters: () => void;
    total?: number;
}

export default function TableToolbar({
    searchable = false,
    searchQuery,
    onSearchChange,
    filterableCols = [],
    data,
    filters,
    onFilterChange,
    onClearFilters,
    total,
}: TableToolbarProps) {
    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 flex-wrap">
            {searchable && (
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="pl-8 pr-3 py-2 text-[14px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-brand-400 transition-colors w-52"
                    />
                </div>
            )}

            {filterableCols.length > 0 && filterableCols.map((col) => {
                const key = col.key;
                const options = Array.from(new Set(data.map((row) => String(row[key] ?? "")))).sort((a, b) =>
                    a.localeCompare(b, "vi", { sensitivity: "base" })
                );
                const active = filters[key] ?? "";

                return (
                    <div key={key} className="relative">
                        <select
                            value={active}
                            onChange={(e) => onFilterChange(key, e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 text-[14px] rounded-xl border outline-none transition-colors cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 focus:border-brand-400 max-w-[172px]"
                        >
                            <option value="">{col.label}</option>
                            {options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                );
            })}

            {activeFilterCount > 0 && (
                <button
                    onClick={onClearFilters}
                    className="flex items-center gap-1 text-[14px] text-red-500 hover:text-red-600 transition-colors"
                >
                    <X size={13} /> Xóa bộ lọc
                </button>
            )}

            {total !== undefined && (
                <p className="ml-auto text-[14px] text-gray-400">{total} bản ghi</p>
            )}
        </div>
    );
}
