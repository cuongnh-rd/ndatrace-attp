"use client";

import { useMemo, useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Copy } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tag, T, btn, btnP, btnSm, inp, card } from "@/components/txng/ui";
import { EVENT_TYPES, BIZ_STEPS, etOf } from "@/lib/txng/catalog";
import {
    ctes, session, vMain, vActive, STATUS_META, fmtDate, cloneCte,
    type Cte, type CteStatus, type C2Level,
} from "@/lib/txng/cte";
import { norm } from "@/lib/txng/process";
import StatusCell from "./components/StatusCell";

const STATUS_FILTER: CteStatus[] = ["active", "scheduled", "draft", "superseded"];

export default function Page() {
    const router = useRouter();
    const [, bump] = useReducer((x: number) => x + 1, 0);
    const [q, setQ] = useState("");
    const [fEt, setEt] = useState("");
    const [fStep, setStep] = useState("");
    const [fStatus, setStatus] = useState("");
    const [fLevel, setLevel] = useState("");

    const filtered = useMemo(
        () =>
            ctes
                .filter((c) => {
                    const cfg = vMain(c).config;
                    if (q && !(norm(c.name).includes(norm(q)) || c.code.toLowerCase().includes(q.toLowerCase()))) return false;
                    if (fEt && c.et !== fEt) return false;
                    if (fStep && cfg.bizStep !== fStep) return false;
                    if (fStatus && !c.versions.some((v) => v.status === fStatus)) return false;
                    if (fLevel && c.level !== fLevel) return false;
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
        <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-[13.5px]">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-[12.5px] font-semibold text-gray-500 dark:border-gray-800 dark:bg-gray-800/40">
                        <th className="px-4 py-2.5">Mã</th>
                        <th className="px-4 py-2.5">Tên sự kiện</th>
                        <th className="px-4 py-2.5">Event Type</th>
                        <th className="px-4 py-2.5">bizStep</th>
                        <th className="px-4 py-2.5">action</th>
                        <th className="px-4 py-2.5">disposition</th>
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
                                    <div className="text-[12px] text-gray-400">
                                        {c.org}
                                        {c.source !== "NEW" && " · Clone"}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div>{c.et}</div>
                                    <div className="text-[12px] text-gray-400">{etOf(c.et).epcis}</div>
                                </td>
                                <td className="px-4 py-3 font-mono text-[12.5px]">{cfg.bizStep || "—"}</td>
                                <td className="px-4 py-3 font-mono text-[12.5px]">{c.et === "ET-03" ? <span className="text-gray-400">không có</span> : cfg.action ?? "—"}</td>
                                <td className="px-4 py-3 font-mono text-[12.5px]">{cfg.disposition || "—"}</td>
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
                        <tr><td colSpan={10} className="px-4 py-10 text-center text-gray-400">Không có sự kiện trọng yếu phù hợp bộ lọc.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sự kiện trọng yếu</h1>
                    <p className="text-[13px] text-gray-500">CTE Builder — xây dựng sự kiện truy xuất theo chuẩn EPCIS 2.0 qua 7 lớp cấu hình. Quy trình tiêu chuẩn TXNG chỉ dùng được CTE Đang áp dụng.</p>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-[12.5px] text-gray-500" htmlFor="role">Vai trò (mô phỏng)</label>
                    <select id="role" className={`${inp} !w-auto !py-1.5 text-[13px]`} value={session.level}
                        onChange={(e) => { session.level = e.target.value as C2Level; bump(); }}>
                        <option value="Bộ">C2 cấp Bộ — Bộ NN&MT</option>
                        <option value="Sở">C2 cấp Sở — Sở KHCN Hà Nội</option>
                    </select>
                    <Link href="/danh-muc/su-kien-trong-yeu/tao-moi" className={btnP}>
                        <Plus size={14} /> Tạo CTE mới
                    </Link>
                </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2.5">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className={`${inp} !w-72 pl-8`} placeholder="Tìm theo tên hoặc mã CTE" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <select className={`${inp} !w-auto`} value={fEt} onChange={(e) => setEt(e.target.value)}>
                    <option value="">Tất cả Event Type</option>
                    {EVENT_TYPES.map((e) => <option key={e.code} value={e.code}>{e.code} · {e.epcis}</option>)}
                </select>
                <select className={`${inp} !w-auto`} value={fStep} onChange={(e) => setStep(e.target.value)}>
                    <option value="">Tất cả bizStep</option>
                    {BIZ_STEPS.map((b) => <option key={b.code} value={b.code}>{b.code}</option>)}
                </select>
                <select className={`${inp} !w-auto`} value={fStatus} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    {STATUS_FILTER.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                </select>
                <select className={`${inp} !w-auto`} value={fLevel} onChange={(e) => setLevel(e.target.value)}>
                    <option value="">Mọi cấp C2</option>
                    <option value="Bộ">Cấp Bộ</option>
                    <option value="Sở">Cấp Sở</option>
                </select>
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
