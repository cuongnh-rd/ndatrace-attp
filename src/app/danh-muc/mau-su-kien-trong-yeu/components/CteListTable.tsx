"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Badge from "@/components/ui/Badge";
import TableToolbar from "@/components/ui/TableToolbar";
import { cteTemplates } from "../lib/mock-data";
import { CTE_STATUS_OPTIONS, FAMILY_OPTIONS, statusLabel, statusVariant } from "../lib/constants";
import type { CteTemplate } from "../lib/types";

const PER_PAGE = 10;

interface Props {
    onEditActive: (template: CteTemplate) => void;
}

export default function CteListTable({ onEditActive }: Props) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return cteTemplates.filter((t) => {
            if (q && !(t.vc_type_name.toLowerCase().includes(q) || t.vc_type.toLowerCase().includes(q))) return false;
            if (filters.family_name && t.family_name !== filters.family_name) return false;
            if (filters.status && t.status !== filters.status) return false;
            return true;
        });
    }, [search, filters]);

    const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const clampedPage = Math.min(page, pages);
    const slice = filtered.slice((clampedPage - 1) * PER_PAGE, clampedPage * PER_PAGE);

    const tableData = slice.map((t) => ({
        vc_type: t.vc_type,
        vc_type_name: t.vc_type_name,
        family_name: t.family_name,
        status: t.status,
    }));

    const handleEdit = (t: CteTemplate) => {
        if (t.status === "Hoạt động") {
            onEditActive(t);
        } else {
            router.push(`/danh-muc/mau-su-kien-trong-yeu/${t.id}/sua`);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <TableToolbar
                searchable
                searchQuery={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                filterableCols={[
                    { key: "family_name", label: "Tất cả nhóm ngành", options: FAMILY_OPTIONS },
                    { key: "status", label: "Tất cả trạng thái", options: CTE_STATUS_OPTIONS },
                ]}
                data={tableData}
                filters={filters}
                onFilterChange={(key, val) => { setFilters((p) => ({ ...p, [key]: val })); setPage(1); }}
                onClearFilters={() => { setFilters({}); setPage(1); }}
                total={filtered.length}
            />
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                            <Th>Mã mẫu</Th>
                            <Th>Tên mẫu sự kiện</Th>
                            <Th>Nhóm ngành</Th>
                            <Th>Số sự kiện</Th>
                            <Th>Phiên bản</Th>
                            <Th>Trạng thái</Th>
                            <Th>Cập nhật</Th>
                            <Th>Thao tác</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {slice.map((t) => (
                            <TemplateRow key={t.id} template={t} onEdit={handleEdit} />
                        ))}
                        {slice.length === 0 && (
                            <tr>
                                <td colSpan={8} className="py-16">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <SearchX size={28} className="text-gray-300" />
                                        <p className="text-[14px]">Không tìm thấy kết quả phù hợp</p>
                                    </div>
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
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={clampedPage === 1}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map((p) => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`min-w-[28px] h-7 rounded-lg text-[14px] font-medium transition-colors ${p === clampedPage ? "bg-brand-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                                {p}
                            </button>
                        ))}
                        <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={clampedPage === pages}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="text-left px-5 py-3">
            <span className="text-[14px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{children}</span>
        </th>
    );
}

function TemplateRow({ template: t, onEdit }: { template: CteTemplate; onEdit: (t: CteTemplate) => void }) {

    return (
        <tr className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
            <td className="px-5 py-3.5">
                <Link href={`/danh-muc/mau-su-kien-trong-yeu/${t.id}`}>
                    <code className="font-mono text-[13px] bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700 text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">
                        {t.vc_type}
                    </code>
                </Link>
            </td>
            <td className="px-5 py-3.5 text-gray-800 dark:text-gray-200 font-medium max-w-[220px]">
                <Link href={`/danh-muc/mau-su-kien-trong-yeu/${t.id}`} className="hover:text-brand-600 transition-colors">
                    {t.vc_type_name}
                </Link>
            </td>
            <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 text-[14px]">{t.family_name}</td>
            <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-medium">{t.events.length}</td>
            <td className="px-5 py-3.5 font-mono text-[13px] text-gray-600 dark:text-gray-400">v{t.version}</td>
            <td className="px-5 py-3.5">
                <Badge variant={statusVariant[t.status]}>{statusLabel[t.status]}</Badge>
            </td>
            <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-[14px]">{t.updated_at}</td>
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                    <Link href={`/danh-muc/mau-su-kien-trong-yeu/${t.id}`}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-600 transition-colors" title="Xem">
                        <Eye size={15} />
                    </Link>
                    <button onClick={() => onEdit(t)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-600 transition-colors" title="Chỉnh sửa">
                        <Pencil size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
