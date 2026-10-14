"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Plus } from "lucide-react";
import TableToolbar from "@/components/ui/TableToolbar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Dialog, Tag, T, btn, btnP, card, inp, label } from "@/components/txng/ui";
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

            {open && <CreateDialog onClose={() => setOpen(false)} onOpen={(id) => router.push(`/danh-muc/quy-trinh-tieu-chuan/${id}`)} />}
        </DashboardLayout>
    );
}

function CreateDialog({ onClose, onOpen }: { onClose: () => void; onOpen: (id: string) => void }) {
    const [name, setName] = useState("");
    const [fam, setFam] = useState("");
    const [law, setLaw] = useState("");
    const [desc, setDesc] = useState("");
    const [eName, setEName] = useState("");
    const [eFam, setEFam] = useState("");

    const submit = () => {
        const en = !name.trim() ? "Nhập tên quy trình." : procs.some((p) => norm(p.name) === norm(name)) ? "Tên quy trình đã được sử dụng trong Bộ." : "";
        setEName(en);
        setEFam(fam ? "" : "Chọn nhóm ngành hàng.");
        if (en || !fam) return;
        onOpen(createProc(fam, name.trim(), law, desc).id);
    };

    return (
        <Dialog open onClose={onClose} title="Tạo quy trình" sub="Quy trình được tạo ở trạng thái Nháp, phiên bản 1"
            footer={<><button className={btn} onClick={onClose}>Huỷ</button><button className={btnP} onClick={submit}>Tạo quy trình</button></>}>
            <div className="flex flex-col gap-4">
                <div>
                    <label className={label} htmlFor="pn">Tên quy trình <span className="text-red-500">*</span></label>
                    <input id="pn" autoFocus className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Quy trình TXNG trái cây tươi" />
                    {eName && <p className="mt-1 text-[12.5px] text-red-600">{eName}</p>}
                </div>
                <div>
                    <span className={label}>Nhóm ngành hàng <span className="text-red-500">*</span></span>
                    <div className="flex flex-col gap-1.5">
                        {myFamilies().map((f) => {
                            const ex = procs.find((p) => p.fam === f.id && p.versions.some((v) => v.status !== "off" && v.status !== "super"));
                            const offp = procs.find((p) => p.fam === f.id && pOff(p) && !pActive(p));
                            const other = f.bo.filter((b) => b !== ME_BO);
                            if (ex)
                                return (
                                    <div key={f.id} className="flex gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800/50">
                                        <input type="radio" disabled className="mt-1" />
                                        <div>
                                            <div className="text-gray-400">{f.name}</div>
                                            <div className="text-[12px] text-amber-700">Bộ đã có quy trình cho nhóm ngành này. <button className="text-brand-700 underline" onClick={() => onOpen(ex.id)}>Mở quy trình</button></div>
                                        </div>
                                    </div>
                                );
                            return (
                                <label key={f.id} className={`flex cursor-pointer gap-2.5 rounded-xl border px-3 py-2.5 ${fam === f.id ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"}`}>
                                    <input type="radio" name="fam" className="mt-1 accent-brand-600" checked={fam === f.id} onChange={() => setFam(f.id)} />
                                    <div>
                                        <div className="font-medium">{f.name}</div>
                                        {offp && <div className="text-[12px] text-amber-700">Bộ có quy trình đã vô hiệu hoá cho nhóm ngành này. <button className="text-brand-700 underline" onClick={(e) => { e.preventDefault(); onOpen(offp.id); }}>Kích hoạt lại thay vì tạo mới</button></div>}
                                        {other.length > 0 && <div className="text-[12px] text-gray-500">Đồng quản lý với {other.join(", ")}. Chỉ đưa vào các công đoạn thuộc thẩm quyền của Bộ.</div>}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                    {eFam && <p className="mt-1 text-[12.5px] text-red-600">{eFam}</p>}
                </div>
                <div><label className={label} htmlFor="pl">Căn cứ pháp lý</label><input id="pl" className={inp} value={law} onChange={(e) => setLaw(e.target.value)} placeholder="Số hiệu văn bản" /></div>
                <div><label className={label} htmlFor="pd">Mô tả</label><textarea id="pd" rows={2} className={inp} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
            </div>
        </Dialog>
    );
}
