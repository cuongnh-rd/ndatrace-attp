"use client";

import { useState } from "react";
import { Eye, Lock, Plus } from "lucide-react";
import { Banner, Dialog, Tag, T, btn, btnP, inp, label } from "@/components/txng/ui";
import { DISPOSITIONS, PERSIST_GROUPS, type EtCode, dispOf, groupCodes, persistGroups, suggestDisp } from "@/lib/txng/catalog";
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
    const toggle = (code: string) =>
        up({ dispNormal: cfg.dispNormal.includes(code) ? cfg.dispNormal.filter((x) => x !== code) : [...cfg.dispNormal, code] });

    return (
        <div className="flex flex-col gap-5">
            <p className="text-[12.5px] text-gray-500">
                CTE quy định danh sách trạng thái doanh nghiệp được chọn. Mỗi sự kiện thực tế chỉ ghi đúng 1 disposition (EPCIS 2.0). Chỉ dùng giá trị CBV 2.0 chuẩn. (BR-M5-15, BR-M5-19)
            </p>

            <section>
                <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold">Persistent</h3>
                    <Tag cls={T.gs1}><Lock size={11} /> Theo chuẩn GS1 — khoá</Tag>
                </div>
                {groups.length ? (
                    <div className="flex flex-col gap-2">
                        {groups.map((g) => (
                            <div key={g} className="rounded-xl border border-yellow-200 bg-yellow-50/60 px-3.5 py-2.5"
                                title="Bắt buộc theo chuẩn — doanh nghiệp phải chọn 1 giá trị khi ghi nhận; trạng thái đi theo lô ở các sự kiện sau.">
                                <div className="mb-1.5 flex items-center gap-2 text-[13.5px] font-medium">
                                    <Lock size={13} className="text-yellow-700" /> Nhóm “{PERSIST_GROUPS[g]}”
                                    {!required.includes(g) && <Tag cls={T.warn}>Không còn yêu cầu theo bizStep hiện tại</Tag>}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {groupCodes(g).map((c) => (
                                        <label key={c} className="flex cursor-not-allowed items-center gap-1.5 text-[13px]" title="Không thể bỏ disposition persistent (BR-M5-16).">
                                            <input type="checkbox" checked disabled className="accent-brand-600" />
                                            <span className="font-mono">{c}</span> <span className="text-gray-500">— {dispOf(c)?.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="mt-1.5 text-[12px] text-gray-500">Các giá trị trong nhóm loại trừ nhau: ghi giá trị này sẽ gỡ giá trị đối lập. Tái kiểm định = sự kiện mới cùng nhóm, ghi đè trạng thái cũ. (BR-M5-17)</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[13px] text-gray-400">bizStep này không có disposition persistent bắt buộc.</p>
                )}
            </section>

            <section>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-semibold">Thường</h3>
                        <span className="text-[12.5px] text-gray-500">{cfg.dispNormal.length} giá trị được phép · doanh nghiệp chọn tuỳ chọn 1 giá trị</span>
                    </div>
                    <button type="button" className={btn} onClick={() => setPreview(true)}><Eye size={14} /> Xem trước khi khai báo</button>
                </div>
                {et === "ET-03" && <p className="mb-2 text-[12.5px] text-gray-500">Disposition áp dụng cho output products.</p>}
                {parent && <p className="mb-2 text-[12.5px] text-gray-500">Cấp Sở chỉ được bỏ bớt giá trị trong danh sách của CTE cấp Bộ, không thêm mới. (AD-06)</p>}
                <div className="flex flex-col gap-1.5">
                    {shown.map((c) => {
                        const on = cfg.dispNormal.includes(c);
                        return (
                            <label key={c} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 ${on ? "border-brand-200" : "border-gray-200 opacity-70 dark:border-gray-700"}`}>
                                <input type="checkbox" className="accent-brand-600" checked={on} onChange={() => toggle(c)} />
                                <span className="flex-1"><span className="font-mono text-[13px]">{c}</span> <span className="text-[12.5px] text-gray-500">— {dispOf(c)?.name}</span></span>
                                {sug[0] === c ? <Tag cls={T.info}>🔵 Mặc định</Tag> : sug.includes(c) ? <Tag cls={T.mute}>⚪ Gợi ý</Tag> : <Tag cls={T.warn}>Ngoài gợi ý</Tag>}
                            </label>
                        );
                    })}
                </div>
                {!parent && (
                    <div className="mt-2 flex items-center gap-2">
                        <select className={`${inp} !w-80`} value={adding} onChange={(e) => setAdding(e.target.value)} aria-label="Chọn disposition CBV 2.0">
                            <option value="">— Chọn disposition từ danh mục CBV 2.0 —</option>
                            {addable.map((d) => <option key={d.code} value={d.code}>{d.code} — {d.name}</option>)}
                        </select>
                        <button type="button" className={btn} disabled={!adding} onClick={() => { up({ dispNormal: [...cfg.dispNormal, adding] }); setAdding(""); }}>
                            <Plus size={14} /> Thêm disposition
                        </button>
                    </div>
                )}
                {!cfg.dispNormal.length && !groups.length && (
                    <Banner kind="warn">CTE không có disposition — doanh nghiệp sẽ không khai báo trạng thái ở sự kiện này. (QĐ-03)</Banner>
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
                            <select className={inp}><option>— Chọn 1 trạng thái —</option>{cfg.dispNormal.map((c) => <option key={c}>{dispOf(c)?.name} ({c})</option>)}</select>
                        </div>
                    )}
                    {!groups.length && !cfg.dispNormal.length && <p className="text-gray-400">Sự kiện này không yêu cầu khai báo trạng thái.</p>}
                </div>
            </Dialog>
        </div>
    );
}
