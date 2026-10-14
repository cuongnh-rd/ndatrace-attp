"use client";

import { useMemo, useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Copy } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tag, T, btn, btnP, btnSm, inp, card } from "@/components/txng/ui";
import { EVENT_TYPES, BIZ_STEPS, bizLabel, etLabel } from "@/lib/txng/catalog";
import {
    ctes, session, vMain, vActive, STATUS_META, fmtDate, cloneCte,
    type Cte, type CteStatus, type C2Level,
} from "@/lib/txng/cte";
import { norm } from "@/lib/txng/process";
import StatusCell from "./components/StatusCell";
import TableToolbar from "@/components/ui/TableToolbar";

const STATUS_FILTER: CteStatus[] = ["active", "scheduled", "draft", "superseded"];
const FILTER_COLS = [
    { key: "et", label: "Loại sự kiện", options: EVENT_TYPES.map((e) => etLabel(e.code)) },
    { key: "step", label: "Công đoạn nghiệp vụ", options: BIZ_STEPS.map((b) => bizLabel(b.code)) },
    { key: "status", label: "Trạng thái", options: STATUS_FILTER.map((x) => STATUS_META[x].label) },
    { key: "level", label: "Cấp quản lý", options: ["Cấp Bộ", "Cấp Sở"] },
];

export default function Page() {
    const router = useRouter();
    const [, bump] = useReducer((x: number) => x + 1, 0);
    const [q, setQ] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});
    const { et: fEt = "", step: fStep = "", status: fStatus = "", level: fLevel = "" } = filters;

    const filtered = useMemo(
        () =>
            ctes
                .filter((c) => {
                    const cfg = vMain(c).config;
                    if (q && !(norm(c.name).includes(norm(q)) || c.code.toLowerCase().includes(q.toLowerCase()))) return false;
                    if (fEt && etLabel(c.et) !== fEt) return false;
                    if (fStep && bizLabel(cfg.bizStep) !== fStep) return false;
                    if (fStatus && !c.versions.some((v) => STATUS_META[v.status].label === fStatus)) return false;
                    if (fLevel && `Cấp ${c.level}` !== fLevel) return false;
                    return true;
                })
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [q, fEt, fStep, fStatus, fLevel, session.level, ctes.length],
    );
    const mine = filtered.filter((c) => c.level === session.level);
    const boForSo = session.level === "Sở" ? filtered.filter((c) => c.level === "Bộ" && vActive(c)) : [];

    const doClone = (c: Cte) => {
        const n = cloneCte(c);
        router.push(`/danh-muc/su-kien-trong-yeu/${n.id}/sua`);
    };

    const table = (rows: Cte[], readonly: boolean) => (
        <div className={`${card} overflow-hidden`}>
            {!readonly && (
                <TableToolbar searchable searchQuery={q} onSearchChange={setQ} data={[]} total={rows.length}
                    filterableCols={FILTER_COLS} filters={filters}
                    onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))} onClearFilters={() => setFilters({})} />
            )}
            <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-[12.5px] font-semibold text-gray-500 dark:border-gray-800 dark:bg-gray-800/40">
                        <th className="px-4 py-2.5">Mã sự kiện</th>
                        <th className="px-4 py-2.5">Tên sự kiện</th>
                        <th className="px-4 py-2.5">Cơ quan quản lý</th>
                        <th className="px-4 py-2.5">Loại sự kiện</th>
                        <th className="px-4 py-2.5">Công đoạn nghiệp vụ</th>
                        <th className="px-4 py-2.5">Trạng thái</th>
                        <th className="px-4 py-2.5">Phiên bản</th>
                        <th className="px-4 py-2.5">Ngày tạo</th>
                        {readonly && <th className="px-4 py-2.5" />}
                    </tr>
                </thead>
                <tbody>
                    {rows.length ? rows.map((c) => {
                        const m = vMain(c), cfg = m.config;
                        return (
                            <tr key={c.id} onClick={() => router.push(`/danh-muc/su-kien-trong-yeu/${c.id}`)}
                                className="cursor-pointer border-b border-gray-50 align-top last:border-0 hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-800/40">
                                <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] text-gray-500">{c.code}</td>
                                <td className="px-4 py-3">
                                    <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                                </td>
                                <td className="min-w-[180px] px-4 py-3 text-gray-600 dark:text-gray-300">{c.org}</td>
                                <td className="px-4 py-3">{etLabel(c.et)}</td>
                                <td className="px-4 py-3">{cfg.bizStep ? bizLabel(cfg.bizStep) : "—"}</td>
                                <td className="px-4 py-3"><StatusCell c={c} /></td>
                                <td className="px-4 py-3">v{m.v}</td>
                                <td className="px-4 py-3 text-gray-500">{fmtDate(c.createdAt)}</td>
                                {readonly && (
                                    <td className="px-4 py-3">
                                        <button className={`${btn} ${btnSm}`} onClick={(e) => { e.stopPropagation(); doClone(c); }}>
                                            <Copy size={13} /> Clone
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    }) : (
                        <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">Không có sự kiện trọng yếu phù hợp bộ lọc.</td></tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="mb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sự kiện trọng yếu</h1>
                    <div className="flex items-center gap-2">
                        <select id="role" aria-label="Vai trò mô phỏng" title="Mô phỏng vai trò người dùng" className={`${inp} !w-auto !py-1.5 text-[13px]`} value={session.level}
                            onChange={(e) => { session.level = e.target.value as C2Level; bump(); }}>
                            <option value="Bộ">Mô phỏng: Cấp Bộ — Bộ NN&MT</option>
                            <option value="Sở">Mô phỏng: Cấp Sở — Sở KHCN Hà Nội</option>
                        </select>
                        <Link href="/danh-muc/su-kien-trong-yeu/tao-moi" className={btnP}>
                            <Plus size={14} /> Tạo sự kiện mới
                        </Link>
                    </div>
                </div>
                <p className="mt-1 text-[13px] text-gray-500">Xây dựng sự kiện truy xuất theo chuẩn EPCIS 2.0. Quy trình tiêu chuẩn TXNG chỉ dùng được CTE Đang áp dụng.</p>
            </div>

            {session.level === "Sở" && <h2 className="mb-2 text-[15px] font-semibold text-gray-800 dark:text-gray-200">CTE của Sở</h2>}
            {table(mine, false)}

            {session.level === "Sở" && (
                <>
                    <div className="mb-2 mt-6 flex items-center gap-2">
                        <h2 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">CTE cấp Bộ</h2>
                        <Tag cls={T.info}>Chỉ xem — Clone để kế thừa</Tag>
                    </div>
                    {table(boForSo, true)}
                </>
            )}
        </DashboardLayout>
    );
}
