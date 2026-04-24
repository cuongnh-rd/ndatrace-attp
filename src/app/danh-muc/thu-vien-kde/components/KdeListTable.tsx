"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Badge from "@/components/ui/Badge";
import TableToolbar from "@/components/ui/TableToolbar";
import { kdeLibrary } from "../lib/mock-data";
import { statusLabel, statusVariant } from "../lib/constants";
import type { Kde } from "../lib/types";

const PER_PAGE = 10;

export default function KdeListTable() {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return kdeLibrary.filter((k) => {
            if (q && !(k.name.toLowerCase().includes(q) || k.code.toLowerCase().includes(q))) return false;
            const current = k.versions.find((v) => v.is_current) ?? k.versions[0];

            if (filters.data_type && current.data_type !== filters.data_type) return false;
            if (filters.status && k.status !== filters.status) return false;

            return true;
        });
    }, [search, filters]);

    const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const clampedPage = Math.min(page, pages);
    const slice = filtered.slice((clampedPage - 1) * PER_PAGE, clampedPage * PER_PAGE);

    const tableData = slice.map((k) => ({
        code: k.code,
        name: k.name,
        data_type: k.versions.find((v) => v.is_current)?.data_type ?? k.versions[0].data_type,
        version: k.current_version,
        status: k.status,
        import_date: k.versions.find((v) => v.is_current)?.import_date ?? k.versions[0].import_date,
        kde: k,
    }));

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <TableToolbar
                searchable
                searchQuery={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                filterableCols={[
                    { key: "data_type", label: "Tất cả kiểu dữ liệu" },
                    { key: "status", label: "Tất cả trạng thái" },
                ]}
                data={tableData}
                filters={filters}
                onFilterChange={(key, val) => { setFilters((prev) => ({ ...prev, [key]: val })); setPage(1); }}
                onClearFilters={() => { setFilters({}); setPage(1); }}
                total={filtered.length}
            />
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                            <HeaderCell>Mã dữ liệu</HeaderCell>
                            <HeaderCell>Tên dữ liệu</HeaderCell>
                            <HeaderCell>Kiểu dữ liệu</HeaderCell>
                            <HeaderCell>Phiên bản</HeaderCell>
                            <HeaderCell>Trạng thái</HeaderCell>
                            <HeaderCell>Ngày tạo</HeaderCell>
                            <HeaderCell>Thao tác</HeaderCell>
                        </tr>
                    </thead>
                    <tbody>
                        {slice.map((k) => (
                            <Row key={k.code} kde={k} />
                        ))}
                        {slice.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400 text-[14px]">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {pages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[14px] text-gray-500">
                        {(clampedPage - 1) * PER_PAGE + 1}–{Math.min(clampedPage * PER_PAGE, filtered.length)} / {filtered.length} bản ghi
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={clampedPage === 1}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`min-w-[28px] h-7 rounded-lg text-[14px] font-medium transition-colors ${p === clampedPage ? "bg-brand-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(pages, p + 1))}
                            disabled={clampedPage === pages}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
    return (
        <th className="text-left px-5 py-3">
            <span className="text-[14px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{children}</span>
        </th>
    );
}

function Row({ kde }: { kde: Kde }) {
    const current = kde.versions.find((v) => v.is_current) ?? kde.versions[0];
    return (
        <tr className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
            <td className="px-5 py-3.5">
                <code className="font-mono text-[13px] bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">
                    {kde.code}
                </code>
            </td>
            <td className="px-5 py-3.5 text-gray-800 dark:text-gray-200 font-medium">{kde.name}</td>
            <td className="px-5 py-3.5 text-gray-800 dark:text-gray-200">{current.data_type}</td>
            <td className="px-5 py-3.5 font-mono text-[13px] text-gray-600 dark:text-gray-400">{kde.current_version}</td>
            <td className="px-5 py-3.5">
                <Badge variant={statusVariant[kde.status]}>{statusLabel[kde.status]}</Badge>
            </td>
            <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-[14px]">{current.import_date}</td>
            <td className="px-5 py-3.5">
                <Link
                    href={`/danh-muc/thu-vien-kde/${kde.code}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-700 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                >
                    <Eye size={12} /> Xem
                </Link>
            </td>
        </tr>
    );
}
