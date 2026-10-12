"use client";

import { useState } from "react";
import { Tag, T, btn, btnSm, card, inp, IssueList } from "@/components/txng/ui";
import { ME_BO, famOf, fieldName } from "@/lib/txng/catalog";
import { cteById } from "@/lib/txng/cte";
import { OTHER_PROCS, PROC_STATUS, type Proc, type ProcVersion, fmtDT, pActive, visibleCount } from "@/lib/txng/process";

const MODE_VI = { keep: "tùy chọn", req: "bắt buộc", hide: "ẩn" } as const;

function compare(A: ProcVersion, B: ProcVersion) {
    const out: { level: "warn" | "error"; msg: string }[] = [];
    const w = (msg: string) => out.push({ level: "warn", msg });
    B.steps.forEach((s, i) => {
        const o = A.steps.find((x) => x.uid === s.uid);
        if (!o) return w(`Thêm công đoạn "${s.name}"`);
        if (o.name !== s.name) w(`Đổi tên "${o.name}" → "${s.name}"`);
        if (A.steps.indexOf(o) !== i) w(`"${s.name}" đổi vị trí ${A.steps.indexOf(o) + 1} → ${i + 1}`);
        if (o.req !== s.req) w(`"${s.name}" chuyển ${s.req ? "Bắt buộc" : "Tùy chọn"}`);
        if (o.cteVer !== s.cteVer) w(`"${s.name}" cập nhật sự kiện trọng yếu v${o.cteVer} → v${s.cteVer}`);
        s.rest.forEach((r) => {
            const x = o.rest.find((y) => y.src === r.src && y.code === r.code);
            if (r.src === "ext") {
                if (!x) w(`"${s.name}": thêm trường "${fieldName(r.code)}"${r.req ? " (bắt buộc)" : ""}`);
                else if (x.src === "ext" && x.req !== r.req) w(`"${s.name}": trường "${fieldName(r.code)}" chuyển ${r.req ? "bắt buộc" : "tùy chọn"}`);
            } else if (x && x.src === "inh" && x.mode !== r.mode) w(`"${s.name}": trường "${fieldName(r.code)}" ${MODE_VI[x.mode]} → ${MODE_VI[r.mode]}`);
        });
        o.rest.filter((r) => r.src === "ext" && !s.rest.some((y) => y.src === "ext" && y.code === r.code))
            .forEach((r) => out.push({ level: "error", msg: `"${s.name}": bỏ trường "${fieldName(r.code)}"` }));
    });
    A.steps.forEach((o) => { if (!B.steps.some((s) => s.uid === o.uid)) out.push({ level: "error", msg: `Bỏ công đoạn "${o.name}"` }); });
    return out;
}

export function HistoryTab({ p, onOpen }: { p: Proc; onOpen: (i: number) => void }) {
    const [at, setAt] = useState("");
    const [a, setA] = useState(Math.max(0, p.versions.length - 2));
    const [b, setB] = useState(p.versions.length - 1);
    const [cmp, setCmp] = useState<ReturnType<typeof compare> | null>(null);
    const t = at.replace("T", " ");
    const hit = at ? p.versions.find((x) => x.from && x.from <= t && (!x.to || t < x.to) && x.status !== "sched") : undefined;
    return (
        <div className={`${card} p-5`}>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div><h2 className="text-[15px] font-semibold">Lịch sử phiên bản</h2><p className="text-[12.5px] text-gray-500">Sự kiện doanh nghiệp khai được đối soát theo phiên bản có hiệu lực tại thời điểm khai</p></div>
                <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-gray-500">
                    <label htmlFor="atT">Phiên bản hiệu lực tại</label>
                    <input id="atT" type="datetime-local" className={`${inp} !w-auto !py-1`} value={at} onChange={(e) => setAt(e.target.value)} />
                    {at && (hit ? <Tag cls={PROC_STATUS[hit.status].cls}>v{hit.v}</Tag> : <span>Không có phiên bản hiệu lực</span>)}
                </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="w-full text-[13.5px]">
                    <thead><tr className="border-b border-gray-100 bg-gray-50/60 text-left text-[12.5px] font-semibold text-gray-500"><th className="px-3 py-2">Phiên bản</th><th className="px-3 py-2">Trạng thái</th><th className="px-3 py-2">Hiệu lực từ</th><th className="px-3 py-2">Hiệu lực đến</th><th className="px-3 py-2">Người publish</th><th className="px-3 py-2">Ghi chú thay đổi</th><th /></tr></thead>
                    <tbody>
                        {[...p.versions].reverse().map((v) => (
                            <tr key={v.v} className="border-b border-gray-50 last:border-0">
                                <td className="px-3 py-2.5 font-semibold">v{v.v}</td>
                                <td className="px-3 py-2.5"><Tag cls={PROC_STATUS[v.status].cls}>{PROC_STATUS[v.status].label}</Tag></td>
                                <td className="px-3 py-2.5">{fmtDT(v.from)}</td><td className="px-3 py-2.5">{fmtDT(v.to)}</td>
                                <td className="px-3 py-2.5">{v.by || "—"}</td><td className="px-3 py-2.5 text-gray-500">{v.note || v.offReason || "—"}</td>
                                <td className="px-3 py-2.5"><button className={`${btn} ${btnSm}`} onClick={() => onOpen(p.versions.indexOf(v))}>Xem</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {p.versions.length > 1 && (
                <>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px]">
                        <span className="text-gray-500">So sánh</span>
                        <select className={`${inp} !w-auto !py-1`} value={a} onChange={(e) => setA(+e.target.value)}>{p.versions.map((v, i) => <option key={v.v} value={i}>v{v.v}</option>)}</select>
                        <span className="text-gray-500">với</span>
                        <select className={`${inp} !w-auto !py-1`} value={b} onChange={(e) => setB(+e.target.value)}>{p.versions.map((v, i) => <option key={v.v} value={i}>v{v.v}</option>)}</select>
                        <button className={btn} onClick={() => setCmp(compare(p.versions[a], p.versions[b]))}>So sánh</button>
                    </div>
                    {cmp && <div className="mt-3">{cmp.length ? <IssueList items={cmp} /> : <p className="text-[13px] text-gray-400">Hai phiên bản giống nhau</p>}</div>}
                </>
            )}
        </div>
    );
}

export function OverviewTab({ p, fallback }: { p: Proc; fallback: ProcVersion }) {
    const f = famOf(p.fam), mine = pActive(p) ?? fallback;
    const cols = [
        { bo: `${ME_BO} (Bộ của bạn)`, name: p.name, v: mine.v, steps: mine.steps.map((s) => [s.cteId, s.name, visibleCount(s)] as [string, string, number]) },
        ...OTHER_PROCS.filter((o) => o.fam === p.fam),
    ];
    const cnt: Record<string, number> = {};
    cols.forEach((c) => new Set(c.steps.map((s) => s[0])).forEach((k) => { cnt[k] = (cnt[k] || 0) + 1; }));
    return (
        <div className={`${card} p-5`}>
            <h2 className="text-[15px] font-semibold">Toàn cảnh nhóm ngành {f.name}</h2>
            <p className="text-[12.5px] text-gray-500">{f.bo.length > 1 ? `Doanh nghiệp phải khai đủ công đoạn của ${f.bo.length} Bộ. Chỉ hiển thị phiên bản đang áp dụng của Bộ khác.` : "Nhóm ngành chỉ do Bộ quản lý."}</p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cols.map((c) => (
                    <div key={c.bo}>
                        <h3 className="text-[14px] font-semibold">{c.bo}</h3>
                        <div className="text-[12.5px] text-gray-500">{c.name} · v{c.v}</div>
                        {c.steps.map((s, i) => {
                            const cn = cteById(s[0])?.name ?? s[0];
                            return (
                                <div key={i} className={`mt-1.5 flex justify-between gap-2 rounded-xl border px-3 py-2 text-[13px] ${cnt[s[0]] > 1 ? "border-amber-300 bg-amber-50" : "border-gray-200 dark:border-gray-700"}`}>
                                    <span>{i + 1}. {s[1]}{s[1] !== cn && <span className="text-gray-400"> ({cn})</span>}</span>
                                    <span className="whitespace-nowrap text-gray-400">{s[2]} trường</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {Object.values(cnt).some((n) => n > 1) && <p className="mt-3 text-[12.5px] text-gray-500"><Tag cls={T.warn}>Màu cam</Tag> Sự kiện trọng yếu xuất hiện trong quy trình của nhiều Bộ — nguy cơ doanh nghiệp khai trùng công đoạn</p>}
        </div>
    );
}
