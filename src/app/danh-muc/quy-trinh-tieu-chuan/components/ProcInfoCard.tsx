"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Tag, T, card, inp, label } from "@/components/txng/ui";
import { ME_BO, famOf } from "@/lib/txng/catalog";
import { patch } from "@/lib/txng/cte";
import { type Proc, norm, procs } from "@/lib/txng/process";

/** Thông tin chung của quy trình — sửa ngay trong màn cấu hình; thu gọn khi đã đủ trường bắt buộc */
export default function ProcInfoCard({ p, editable, startOpen, onChange }: {
    p: Proc; editable: boolean; startOpen: boolean; onChange: () => void;
}) {
    const complete = !!p.name.trim();
    const [open, setOpen] = useState(startOpen || !complete);
    const f = famOf(p.fam);
    const dupName = procs.some((x) => x !== p && norm(x.name) === norm(p.name));
    const other = f.bo.filter((b) => b !== ME_BO);
    const set = (k: "name" | "law" | "desc", v: string) => { patch(p, { [k]: v }); onChange(); };

    return (
        <div className={`${card} mb-4`}>
            <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Thông tin quy trình</h2>
                    {complete ? <Tag cls={T.ok}><CheckCircle2 size={12} /> Đã đủ thông tin bắt buộc</Tag> : <Tag cls={T.warn}>Thiếu thông tin bắt buộc</Tag>}
                    {!open && (
                        <span className="truncate text-[13px] text-gray-500">
                            {f.name}{p.law ? ` · Căn cứ ${p.law}` : ""}{p.desc ? ` · ${p.desc}` : ""}
                        </span>
                    )}
                </div>
                {open ? <ChevronUp size={18} className="shrink-0 text-gray-400" /> : <ChevronDown size={18} className="shrink-0 text-gray-400" />}
            </button>
            {open && (
                <div className="grid grid-cols-1 gap-4 border-t border-gray-100 px-5 py-4 dark:border-gray-800 md:grid-cols-2">
                    <div>
                        <label className={label} htmlFor="pi-name">Tên quy trình <span className="text-red-500">*</span></label>
                        <input id="pi-name" className={inp} disabled={!editable} defaultValue={p.name} onChange={(e) => set("name", e.target.value)} placeholder="Ví dụ: Quy trình TXNG trái cây tươi" />
                        {!p.name.trim() && <p className="mt-1 text-[12.5px] text-red-600">Nhập tên quy trình.</p>}
                        {dupName && <p className="mt-1 text-[12.5px] text-red-600">Tên quy trình đã được sử dụng trong Bộ.</p>}
                    </div>
                    <div>
                        <span className={label}>Nhóm ngành hàng <span className="text-red-500">*</span></span>
                        <input className={inp} disabled value={f.name} />
                        {other.length > 0 && <p className="mt-1 text-[12px] text-gray-500">Đồng quản lý với {other.join(", ")}. Chỉ đưa vào các công đoạn thuộc thẩm quyền của Bộ.</p>}
                    </div>
                    <div>
                        <label className={label} htmlFor="pi-law">Căn cứ pháp lý</label>
                        <input id="pi-law" className={inp} disabled={!editable} defaultValue={p.law} onChange={(e) => set("law", e.target.value)} placeholder="Số hiệu văn bản" />
                    </div>
                    <div>
                        <label className={label} htmlFor="pi-desc">Mô tả</label>
                        <textarea id="pi-desc" rows={1} className={inp} disabled={!editable} defaultValue={p.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Phạm vi áp dụng của quy trình" />
                    </div>
                </div>
            )}
        </div>
    );
}
