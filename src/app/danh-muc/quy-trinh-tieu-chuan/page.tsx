"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Plus, Search } from "lucide-react";
import TableToolbar from "@/components/ui/TableToolbar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Dialog, Tag, T, btn, btnP, card, inp } from "@/components/txng/ui";
import { FAMILIES, ME_BO, famOf } from "@/lib/txng/catalog";
import {
    PROC_STATUS, createProc, fmtDT, myFamilies, norm, pActive, pMain, pOff, pPending, procWarnings, procs, type ProcStatus,
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
    const [open, setOpen] = useState(false);

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
                    <button className={`${btnP} mr-4 shrink-0`} onClick={() => setOpen(true)}><Plus size={14} /> Tạo quy trình</button>
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

            {open && <CreateDialog onClose={() => setOpen(false)} onOpen={(id, isNew) => router.push(`/danh-muc/quy-trinh-tieu-chuan/${id}${isNew ? "?new=1" : ""}`)} />}
        </DashboardLayout>
    );
}

function CreateDialog({ onClose, onOpen }: { onClose: () => void; onOpen: (id: string, isNew?: boolean) => void }) {
    const [q, setQ] = useState("");
    const [fam, setFam] = useState("");
    const rows = myFamilies()
        .filter((f) => !q || norm(f.name).includes(norm(q)))
        .map((f) => ({
            f,
            ex: procs.find((p) => p.fam === f.id && p.versions.some((v) => v.status !== "off" && v.status !== "super")),
            offp: procs.find((p) => p.fam === f.id && pOff(p) && !pActive(p)),
        }));
    const free = rows.filter((r) => !r.ex && !r.offp);
    const taken = rows.filter((r) => r.ex || r.offp);
    const create = () => {
        const f = famOf(fam);
        onOpen(createProc(fam, `Quy trình TXNG ${f.name.toLowerCase()}`, "", "").id, true);
    };

    return (
        <Dialog open onClose={onClose} title="Tạo quy trình" sub="Chọn nhóm ngành hàng. Thông tin chi tiết và công đoạn được cấu hình ở bước tiếp theo."
            footer={<><button className={btn} onClick={onClose}>Huỷ</button><button className={btnP} disabled={!fam} onClick={create}>Tiếp tục</button></>}>
            <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input autoFocus className={`${inp} pl-8`} placeholder="Tìm nhóm ngành hàng" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <h3 className="mb-1.5 text-[13px] font-semibold text-gray-600">Chưa có quy trình <span className="font-normal text-gray-400">({free.length})</span></h3>
            <div className="mb-4 flex max-h-[44vh] flex-col gap-1.5 overflow-auto pr-1">
                {free.length ? free.map(({ f }) => {
                    const other = f.bo.filter((b) => b !== ME_BO);
                    return (
                        <label key={f.id} className={`flex cursor-pointer gap-2.5 rounded-xl border px-3 py-2 ${fam === f.id ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"}`}>
                            <input type="radio" name="fam" className="mt-1 accent-brand-600" checked={fam === f.id} onChange={() => setFam(f.id)} />
                            <div>
                                <div className="font-medium">{f.name}</div>
                                {other.length > 0 && <div className="text-[12px] text-gray-500">Đồng quản lý với {other.join(", ")}. Chỉ đưa vào các công đoạn thuộc thẩm quyền của Bộ.</div>}
                            </div>
                        </label>
                    );
                }) : <p className="text-[13px] text-gray-400">Không có nhóm ngành phù hợp.</p>}
            </div>
            {taken.length > 0 && (
                <>
                    <h3 className="mb-1.5 text-[13px] font-semibold text-gray-600">Đã có quy trình <span className="font-normal text-gray-400">({taken.length})</span></h3>
                    <div className="flex flex-col gap-1.5">
                        {taken.map(({ f, ex, offp }) => (
                            <div key={f.id} className="flex items-center justify-between gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/50">
                                <span className="text-gray-500">{f.name}</span>
                                <button className="text-[12.5px] text-brand-700 underline" onClick={() => onOpen((ex ?? offp)!.id)}>{ex ? "Mở quy trình" : "Đã vô hiệu hoá — kích hoạt lại"}</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </Dialog>
    );
}
