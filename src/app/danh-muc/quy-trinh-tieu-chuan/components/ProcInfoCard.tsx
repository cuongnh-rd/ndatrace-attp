"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Tag, T, card, inp, label } from "@/components/txng/ui";
import { ME_BO, famOf } from "@/lib/txng/catalog";
import { patch } from "@/lib/txng/cte";
import { type Proc, type ProcVersion, fmtDT, myFamilies, norm, procCode, procOfFam, procs } from "@/lib/txng/process";

/** Toàn bộ thông tin chung của quy trình — sửa ngay trong màn cấu hình; thu gọn khi đã đủ trường bắt buộc */
export default function ProcInfoCard({ p, v, editable, startOpen, onChange }: {
    p: Proc; v: ProcVersion; editable: boolean; startOpen: boolean; onChange: () => void;
}) {
    const complete = !!p.name.trim() && !!p.fam;
    const [open, setOpen] = useState(startOpen || !complete);
    const f = famOf(p.fam);
    const dupName = !!p.name.trim() && procs.some((x) => x !== p && norm(x.name) === norm(p.name));
    const other = f.bo.filter((b) => b !== ME_BO);
    // Nhóm ngành chỉ chọn được khi quy trình chưa từng công bố
    const famEditable = editable && p.versions.length === 1;
    const set = (k: "name" | "law" | "desc", val: string) => { patch(p, { [k]: val }); onChange(); };
    const pickFam = (id: string) => {
        const wasAuto = !p.name.trim() || p.name === `Quy trình TXNG ${famOf(p.fam).name.toLowerCase()}`;
        patch(p, { fam: id, code: procCode(id), ...(wasAuto ? { name: `Quy trình TXNG ${famOf(id).name.toLowerCase()}` } : {}) });
        onChange();
    };

    return (
        <div className={`${card} mb-4`}>
            <button type="button" onClick={() => complete && setOpen(!open)} className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Thông tin quy trình</h2>
                    {complete ? <Tag cls={T.ok}><CheckCircle2 size={12} /> Đã đủ thông tin bắt buộc</Tag> : <Tag cls={T.warn}>Thiếu thông tin bắt buộc</Tag>}
                    {!open && (
                        <span className="truncate text-[13px] text-gray-500">
                            {p.code} · {f.name}{v.from ? ` · Hiệu lực ${fmtDT(v.from)}${v.to ? ` → ${fmtDT(v.to)}` : ""}` : ""}
                        </span>
                    )}
                </div>
                {complete && (open ? <ChevronUp size={18} className="shrink-0 text-gray-400" /> : <ChevronDown size={18} className="shrink-0 text-gray-400" />)}
            </button>
            {open && (
                <div className="grid grid-cols-1 gap-4 border-t border-gray-100 px-5 py-4 dark:border-gray-800 md:grid-cols-2">
                    <div>
                        <span className={label}>Nhóm ngành hàng <span className="text-red-500">*</span></span>
                        {famEditable ? <FamilyPicker value={p.fam} self={p} onPick={pickFam} /> : <input className={inp} disabled value={f.name} />}
                        {other.length > 0 && <p className="mt-1 text-[12px] text-gray-500">Đồng quản lý với {other.join(", ")}. Chỉ đưa vào các công đoạn thuộc thẩm quyền của Bộ.</p>}
                    </div>
                    <div>
                        <label className={label} htmlFor="pi-name">Tên quy trình <span className="text-red-500">*</span></label>
                        <input id="pi-name" key={p.fam} className={inp} disabled={!editable} defaultValue={p.name} onChange={(e) => set("name", e.target.value)} placeholder="Ví dụ: Quy trình TXNG trái cây tươi" />
                        {!p.name.trim() && <p className="mt-1 text-[12.5px] text-red-600">Nhập tên quy trình.</p>}
                        {dupName && <p className="mt-1 text-[12.5px] text-red-600">Tên quy trình đã được sử dụng trong Bộ.</p>}
                    </div>
                    <div>
                        <label className={label} htmlFor="pi-law">Căn cứ pháp lý</label>
                        <input id="pi-law" className={inp} disabled={!editable} defaultValue={p.law} onChange={(e) => set("law", e.target.value)} placeholder="Số hiệu văn bản" />
                    </div>
                    <div>
                        <label className={label} htmlFor="pi-desc">Mô tả</label>
                        <textarea id="pi-desc" rows={1} className={inp} disabled={!editable} defaultValue={p.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Phạm vi áp dụng của quy trình" />
                    </div>
                    <div className="col-span-full flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-gray-500">
                        <span>Mã quy trình <b className="font-mono text-gray-800 dark:text-gray-200">{p.code || "Tự sinh khi chọn nhóm ngành"}</b></span>
                        <span>Cơ quan ban hành <b className="text-gray-800 dark:text-gray-200">{ME_BO}</b></span>
                        <span>Hiệu lực <b className="text-gray-800 dark:text-gray-200">{v.from ? fmtDT(v.from) : "—"}{v.to ? ` → ${fmtDT(v.to)}` : ""}</b></span>
                    </div>
                </div>
            )}
        </div>
    );
}

/** Ô chọn nhóm ngành có tìm kiếm — ưu tiên nhóm chưa có quy trình */
function FamilyPicker({ value, self, onPick }: { value: string; self: Proc; onPick: (id: string) => void }) {
    const [open, setOpen] = useState(!value);
    const [q, setQ] = useState("");
    const box = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const h = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    const rows = myFamilies().filter((f) => !q || norm(f.name).includes(norm(q))).map((f) => ({ f, used: procOfFam(f.id, self) }));
    const free = rows.filter((r) => !r.used), taken = rows.filter((r) => r.used);

    return (
        <div ref={box} className="relative">
            <button type="button" onClick={() => setOpen(!open)} className={`${inp} flex items-center justify-between text-left`}>
                <span className={value ? "" : "text-gray-400"}>{value ? famOf(value).name : "Chọn nhóm ngành hàng"}</span>
                <ChevronDown size={14} className="text-gray-400" />
            </button>
            {open && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <div className="relative mb-2">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input autoFocus className={`${inp} !py-1.5 pl-8`} placeholder="Tìm nhóm ngành hàng" value={q} onChange={(e) => setQ(e.target.value)} />
                    </div>
                    <div className="max-h-72 overflow-auto">
                        <p className="px-2 py-1 text-[12px] font-semibold text-gray-500">Chưa có quy trình ({free.length})</p>
                        {free.map(({ f }) => (
                            <button key={f.id} type="button" onClick={() => { onPick(f.id); setOpen(false); }}
                                className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-[13.5px] hover:bg-gray-50 dark:hover:bg-gray-800 ${value === f.id ? "bg-brand-50 font-semibold text-brand-700" : ""}`}>
                                {f.name}
                            </button>
                        ))}
                        {!free.length && <p className="px-2.5 py-1.5 text-[13px] text-gray-400">Không có nhóm ngành phù hợp.</p>}
                        {taken.length > 0 && (
                            <>
                                <p className="mt-1 px-2 py-1 text-[12px] font-semibold text-gray-500">Đã có quy trình ({taken.length})</p>
                                {taken.map(({ f, used }) => (
                                    <div key={f.id} className="flex items-center justify-between px-2.5 py-1.5 text-[13.5px] text-gray-400">
                                        {f.name}
                                        <a className="text-[12px] text-brand-700 underline" href={`/danh-muc/quy-trinh-tieu-chuan/${used!.id}`}>{used!.versions.some((x) => x.status === "off") && !used!.versions.some((x) => x.status === "active") ? "Đã vô hiệu hoá — kích hoạt lại" : "Mở quy trình"}</a>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
