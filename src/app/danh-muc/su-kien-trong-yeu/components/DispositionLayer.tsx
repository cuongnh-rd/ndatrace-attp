"use client";

import { useState } from "react";
import { Eye, Lock, Plus } from "lucide-react";
import { Banner, Dialog, Tag, T, btn, btnP, inp, label } from "@/components/txng/ui";
import { DISPOSITIONS, PERSIST_GROUPS, type EtCode, dispLabel, dispOf, groupCodes, persistGroups, suggestDisp } from "@/lib/txng/catalog";
import type { CteConfig } from "@/lib/txng/cte";

/** Lớp 4 — danh sách disposition: vùng Persistent (khoá theo chuẩn) + vùng Thường (preselect, bỏ bớt / thêm CBV) */
export default function DispositionLayer({ et, cfg, up, parent }: {
    et: EtCode; cfg: CteConfig; up: (p: Partial<CteConfig>) => void; parent?: CteConfig;
}) {
    const [adding, setAdding] = useState("");
    const [preview, setPreview] = useState(false);
    const sug = suggestDisp(et, cfg.bizStep);
    const required = persistGroups(et, cfg.bizStep);
    const groups = [...new Set([...required, ...cfg.dispPersist])];
    // Các giá trị hiển thị ở vùng Thường: gợi ý + đã chọn (+ của CTE cấp Bộ khi Sở kế thừa)
    const shown = [...new Set([...(parent ? parent.dispNormal : sug), ...cfg.dispNormal])];
    const addable = DISPOSITIONS.filter((d) => !d.group && !shown.includes(d.code));
    const persistCodes = groups.flatMap(groupCodes);
    const toggle = (code: string) =>
        up({ dispNormal: cfg.dispNormal.includes(code) ? cfg.dispNormal.filter((x) => x !== code) : [...cfg.dispNormal, code] });

    return (
        <div className="flex flex-col gap-5">

            <section>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[12.5px] text-gray-500">{persistCodes.length + cfg.dispNormal.length} trạng thái được phép · doanh nghiệp chọn 1 trạng thái khi khai báo</span>
                    <button type="button" className={btn} onClick={() => setPreview(true)}><Eye size={14} /> Xem trước khi khai báo</button>
                </div>
                <div className="flex flex-col gap-1.5">
                    {persistCodes.map((c) => (
                        <div key={c} className="flex items-center gap-2.5 rounded-xl border border-brand-200 px-3 py-2">
                            <input type="checkbox" checked disabled className="accent-brand-600" aria-label={dispLabel(c)} />
                            <span className="flex-1 text-[13.5px]">{dispLabel(c)}</span>
                            <span className="group relative inline-flex">
                                <Lock size={14} className="cursor-help text-gray-500" aria-label="Không thể bỏ" />
                                <span role="tooltip" className="pointer-events-none absolute right-full top-1/2 z-10 mr-2 w-64 -translate-y-1/2 rounded-lg bg-gray-900 px-2.5 py-1.5 text-[12px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                    Trạng thái bắt buộc theo chuẩn của công đoạn này, không thể bỏ chọn. Trạng thái được giữ theo lô ở các sự kiện sau.
                                </span>
                            </span>
                        </div>
                    ))}
                    {shown.map((c) => {
                        const on = cfg.dispNormal.includes(c);
                        return (
                            <label key={c} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 ${on ? "border-brand-200" : "border-gray-200 dark:border-gray-700"}`}>
                                <input type="checkbox" className="accent-brand-600" checked={on} onChange={() => toggle(c)} />
                                <span className="flex-1 text-[13.5px]">{dispLabel(c)}</span>
                                {!sug.includes(c) && <Tag cls={T.mute}>Ngoài gợi ý</Tag>}
                            </label>
                        );
                    })}
                </div>
                {!parent && (
                    <div className="mt-2 flex items-center gap-2">
                        <select className={`${inp} !w-80`} value={adding} onChange={(e) => setAdding(e.target.value)} aria-label="Chọn trạng thái sản phẩm">
                            <option value="">— Chọn trạng thái sản phẩm khác —</option>
                            {addable.map((d) => <option key={d.code} value={d.code}>{dispLabel(d.code)}</option>)}
                        </select>
                        <button type="button" className={btn} disabled={!adding} onClick={() => { up({ dispNormal: [...cfg.dispNormal, adding] }); setAdding(""); }}>
                            <Plus size={14} /> Thêm trạng thái
                        </button>
                    </div>
                )}
                {!cfg.dispNormal.length && !groups.length && (
                    <Banner kind="warn">Sự kiện chưa có trạng thái sản phẩm — doanh nghiệp sẽ không khai báo trạng thái ở sự kiện này.</Banner>
                )}
            </section>

            <Dialog open={preview} onClose={() => setPreview(false)} title="Xem trước khi khai báo" sub="Màn ghi nhận sự kiện của doanh nghiệp — phần trạng thái"
                footer={<button className={btnP} onClick={() => setPreview(false)}>Đóng</button>}>
                <div className="flex flex-col gap-4">
                    {groups.map((g) => (
                        <div key={g}>
                            <span className={label}>{PERSIST_GROUPS[g]} <span className="text-red-500">*</span></span>
                            <div className="flex flex-wrap gap-4">
                                {groupCodes(g).map((c) => <label key={c} className="flex items-center gap-1.5 text-[13.5px]"><input type="radio" name={`pv-${g}`} /> {dispOf(c)?.name}</label>)}
                            </div>
                            <p className="mt-1 text-[12px] text-gray-500">{PERSIST_GROUPS[g]} được mang theo lô ở các sự kiện sau. Chỉ thay đổi khi có sự kiện {g === "inspection" ? "kiểm định" : "kiểm tra"} mới.</p>
                        </div>
                    ))}
                    {cfg.dispNormal.length > 0 && (
                        <div>
                            <span className={label}>{groups.length ? "Trạng thái khác" : "Trạng thái"} <span className="font-normal text-gray-400">(tuỳ chọn)</span></span>
                            <select className={inp}><option>— Chọn 1 trạng thái —</option>{cfg.dispNormal.map((c) => <option key={c}>{dispLabel(c)}</option>)}</select>
                        </div>
                    )}
                    {!groups.length && !cfg.dispNormal.length && <p className="text-gray-400">Sự kiện này không yêu cầu khai báo trạng thái.</p>}
                </div>
            </Dialog>
        </div>
    );
}
