"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Plus } from "lucide-react";
import TableToolbar from "@/components/ui/TableToolbar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tag, T, btnP, card } from "@/components/txng/ui";
import { FAMILIES, ME_BO, famOf } from "@/lib/txng/catalog";
import {
    PROC_STATUS, createProc, fmtDT, norm, pActive, pMain, pPending, procWarnings, procs, type ProcStatus,
} from "@/lib/txng/process";

const FILTER_COLS = [
    { key: "fam", label: "Nhóm ngành", options: FAMILIES.map((f) => f.name) },
    { key: "status", label: "Trạng thái", options: (["draft", "sched", "active", "off"] as ProcStatus[]).map((x) => PROC_STATUS[x].label) },
];

export default function Page() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});
    const fFam = FAMILIES.find((f) => f.name === filters.fam)?.id ?? "";
    const fStatus = (Object.keys(PROC_STATUS) as ProcStatus[]).find((k) => PROC_STATUS[k].label === filters.status) ?? "";

    const rows = procs.filter((p) => {
        const st = pMain(p).status;
        if (q && !(norm(p.name).includes(norm(q)) || p.code.toLowerCase().includes(q.toLowerCase()))) return false;
        if (fFam && p.fam !== fFam) return false;
        if (fStatus && st !== fStatus && !(fStatus === "sched" && p.versions.some((v) => v.status === "sched"))) return false;
        return true;
    });

    return (
        <DashboardLayout>
            <div className={`${card} overflow-hidden`}>
                <div className="flex items-center border-b border-gray-100 dark:border-gray-800 [&>div:first-child]:border-0 [&>div:first-child]:flex-1">
                    <TableToolbar searchable searchQuery={q} onSearchChange={setQ} data={[]} total={rows.length}
                        filterableCols={FILTER_COLS} filters={filters}
                        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))} onClearFilters={() => setFilters({})} />
                    <button className={`${btnP} mr-4 shrink-0`} onClick={() => router.push(`/danh-muc/quy-trinh-tieu-chuan/${createProc().id}?new=1`)}><Plus size={14} /> Tạo quy trình</button>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-[13.5px]">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-[12.5px] font-semibold text-gray-500 dark:border-gray-800">
                            <th className="px-4 py-2.5">Mã</th><th className="px-4 py-2.5">Tên quy trình</th><th className="px-4 py-2.5">Nhóm ngành</th>
                            <th className="px-4 py-2.5">Trạng thái</th><th className="px-4 py-2.5">Công đoạn</th><th className="px-4 py-2.5">Cảnh báo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length ? rows.map((p) => {
                            const a = pActive(p), pe = pPending(p), main = pMain(p), w = procWarnings(p);
                            const other = famOf(p.fam).bo.filter((b) => b !== ME_BO);
                            return (
                                <tr key={p.id} tabIndex={0} onClick={() => router.push(`/danh-muc/quy-trinh-tieu-chuan/${p.id}`)}
                                    onKeyDown={(e) => e.key === "Enter" && router.push(`/danh-muc/quy-trinh-tieu-chuan/${p.id}`)}
                                    className="cursor-pointer border-b border-gray-50 align-top last:border-0 hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-800/40">
                                    <td className="px-4 py-3 font-mono text-[12.5px] text-gray-500">{p.code}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-gray-900 dark:text-white">{p.name}</div>
                                        {other.length > 0 && <div className="text-[12px] text-gray-400">Nhóm ngành đồng quản lý với {other.join(", ")}</div>}
                                    </td>
                                    <td className="px-4 py-3">{famOf(p.fam).name}</td>
                                    <td className="px-4 py-3">
                                        <Tag cls={PROC_STATUS[main.status].cls}>{PROC_STATUS[main.status].label} (v{main.v})</Tag>
                                        {a && pe && <div className="mt-1 text-[12px] text-gray-400">{pe.status === "sched" ? `v${pe.v} áp dụng lúc ${fmtDT(pe.from)}` : `Đang soạn v${pe.v}`}</div>}
                                    </td>
                                    <td className="px-4 py-3">{main.steps.length}</td>
                                    <td className="px-4 py-3">{w.length ? <Tag cls={T.warn} title={w.join("; ")}><AlertTriangle size={12} /> {w.length}</Tag> : <span className="text-gray-300">—</span>}</td>
                                </tr>
                            );
                        }) : <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Không có quy trình phù hợp bộ lọc.</td></tr>}
                    </tbody>
                </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
