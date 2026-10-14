"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Dialog, IssueList, Tag, T, btn, btnD, btnP, inp, label } from "@/components/txng/ui";
import { LIB_KDES, bizLabel, etLabel, fieldName } from "@/lib/txng/catalog";
import { cteById, patch, vActive } from "@/lib/txng/cte";
import {
    type Proc, type ProcStep, type ProcVersion, type RestField, NOW, applyVersion, coreOf, countReq, cteCfg, fmtDT, kdeBlock, latestVer, mkStep,
    norm, optOf, overlapBo, pActive, pPending, procs, updateStepCte, usableCtes, validateProc,
} from "@/lib/txng/process";

const after1h = (t: string) => new Date(t).getTime() - new Date(NOW.replace(" ", "T")).getTime() >= 3600e3;

/* ---------- Thêm công đoạn: chỉ chọn sự kiện trọng yếu Đang áp dụng ---------- */
export function AddStepDialog({ p, v, onClose, onAdded }: { p: Proc; v: ProcVersion; onClose: () => void; onAdded: (s: ProcStep, renamed: boolean) => void }) {
    const [q, setQ] = useState("");
    const [picked, setPicked] = useState<string[]>([]);
    const list = usableCtes().filter((c) => !q || norm(c.name).includes(norm(q)) || c.code.toLowerCase().includes(q.toLowerCase()));
    const add = () => {
        let last: ProcStep | undefined, renamed = false;
        picked.forEach((id) => {
            const c = cteById(id)!;
            let n = c.name, k = 1;
            while (v.steps.some((s) => norm(s.name) === norm(n))) { k++; n = `${c.name} (${k})`; renamed = true; }
            last = mkStep(id, undefined, n);
            v.steps.push(last);
        });
        if (last) onAdded(last, renamed);
    };
    return (
        <Dialog open wide onClose={onClose} title="Thêm công đoạn" sub="Chọn sự kiện trọng yếu đang áp dụng. Có thể chọn nhiều."
            footer={<><span className="mr-auto text-[13px] text-gray-500">{picked.length ? `Đã chọn ${picked.length}` : "Chưa chọn"}</span><button className={btn} onClick={onClose}>Huỷ</button><button className={btnP} disabled={!picked.length} onClick={add}>Thêm</button></>}>
            <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input autoFocus className={`${inp} pl-8`} placeholder="Tìm sự kiện trọng yếu theo tên hoặc mã" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
                {list.length ? list.map((c) => {
                    const a = vActive(c)!, cfg = a.config;
                    const used = v.steps.filter((s) => s.cteId === c.id).length;
                    const ov = overlapBo(p.fam, c.id);
                    const on = picked.includes(c.id);
                    return (
                        <label key={c.id} className={`grid cursor-pointer grid-cols-[20px_1fr] gap-2.5 rounded-xl border px-3 py-2.5 ${on ? "border-brand-500 bg-brand-50/50" : "border-gray-200 hover:border-gray-300 dark:border-gray-700"}`}>
                            <input type="checkbox" className="mt-1 accent-brand-600" checked={on} onChange={() => setPicked(on ? picked.filter((x) => x !== c.id) : [...picked, c.id])} />
                            <div>
                                <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{c.name}</span><span className="font-mono text-[12px] text-gray-400">{c.code}</span><Tag cls={T.ok}>v{a.v} Đang áp dụng</Tag></div>
                                <div className="text-[12.5px] text-gray-500">{etLabel(c.et)} · {bizLabel(cfg.bizStep)} · {coreOf(cfg).length} trường bắt buộc · {optOf(cfg).length} tùy chọn</div>
                                {used > 0 && <div className="text-[12px] text-gray-500">Đã có {used} công đoạn dùng sự kiện này. Công đoạn mới cần tên khác.</div>}
                                {ov.length > 0 && <div className="text-[12px] text-amber-700">Cũng có trong quy trình của {ov.join(", ")} cho cùng nhóm ngành.</div>}
                            </div>
                        </label>
                    );
                }) : <p className="py-6 text-center text-[13px] text-gray-400">Không tìm thấy sự kiện trọng yếu Đang áp dụng.</p>}
            </div>
            <p className="mt-3 text-[12.5px] text-gray-500">Không thấy sự kiện cần dùng? Sự kiện ở trạng thái Nháp / Chờ áp dụng không chọn được. <Link className="font-medium text-brand-700 underline" href="/danh-muc/su-kien-trong-yeu">Mở Sự kiện trọng yếu</Link></p>
        </Dialog>
    );
}

/* ---------- Thêm trường từ Thư viện KDE ---------- */
export function AddKdeDialog({ s, onClose, onDone }: { s: ProcStep; onClose: () => void; onDone: (msg: string) => void }) {
    const [q, setQ] = useState("");
    const [picked, setPicked] = useState<string[]>([]);
    const match = (name: string, code: string) => !q || norm(name).includes(norm(q)) || code.toLowerCase().includes(q.toLowerCase());
    // Trường gợi ý của sự kiện trọng yếu chưa có trong công đoạn (đã bị xoá trước đó)
    const suggested = optOf(cteCfg(s)!).filter((code) => !s.rest.some((r) => r.code === code) && match(fieldName(code), code));
    const list = LIB_KDES.filter((k) => match(k.name, k.code));
    const toggle = (code: string) => setPicked(picked.includes(code) ? picked.filter((x) => x !== code) : [...picked, code]);
    const add = () => {
        patch(s, { rest: [...s.rest, ...picked.map((code): RestField => (suggested.includes(code) ? { src: "inh", code, mode: "keep", note: "" } : { src: "ext", code, req: false, note: "" }))] });
        onDone(`Đã thêm ${picked.length} trường`);
    };
    const item = (code: string, name: string, extra: string, why?: string) => {
        const on = picked.includes(code);
        return (
            <label key={code} className={`grid grid-cols-[20px_1fr] gap-2.5 rounded-xl border px-3 py-2.5 ${why ? "cursor-not-allowed bg-gray-50 dark:bg-gray-800/40" : on ? "cursor-pointer border-brand-500 bg-brand-50/50" : "cursor-pointer border-gray-200 dark:border-gray-700"}`}>
                <input type="checkbox" className="mt-1 accent-brand-600" disabled={!!why} checked={on} onChange={() => toggle(code)} />
                <div>
                    <div className={`font-medium ${why ? "text-gray-400" : ""}`}>{name} <span className="font-normal text-gray-400">({code})</span>{extra && <span className="ml-1.5 text-[12px] font-normal text-gray-400">· {extra}</span>}</div>
                    {why && <div className="text-[12px] text-amber-700">{why}</div>}
                </div>
            </label>
        );
    };
    return (
        <Dialog open wide onClose={onClose} title="Thêm trường bổ sung" sub={`Công đoạn "${s.name}" · ${cteById(s.cteId)?.name}`}
            footer={<><span className="mr-auto text-[13px] text-gray-500">{picked.length ? `Đã chọn ${picked.length}` : "Chưa chọn"}</span><button className={btn} onClick={onClose}>Huỷ</button>
                <button className={btnP} disabled={!picked.length} onClick={add}>Thêm</button></>}>
            <input autoFocus className={`${inp} mb-3`} placeholder="Tìm theo tên hoặc mã trường" value={q} onChange={(e) => setQ(e.target.value)} />
            {suggested.length > 0 && (
                <div className="mb-4">
                    <h3 className="mb-1.5 text-[13px] font-semibold text-gray-600">Gợi ý theo sự kiện trọng yếu</h3>
                    <div className="flex flex-col gap-1.5">{suggested.map((code) => item(code, fieldName(code), ""))}</div>
                </div>
            )}
            <h3 className="mb-1.5 text-[13px] font-semibold text-gray-600">Thư viện KDE</h3>
            <div className="flex flex-col gap-1.5">
                {list.map((k) => item(k.code, k.name, k.ilmd ? "thông tin lô/mẻ" : k.gdsn ? "thông tin sản phẩm" : "", kdeBlock(s, k.code)?.why))}
            </div>
        </Dialog>
    );
}

/* ---------- Xem thay đổi CTE & cập nhật ---------- */
export function CteDiffDialog({ s, editable, onClose, onDone }: { s: ProcStep; editable: boolean; onClose: () => void; onDone: (msg: string) => void }) {
    const c = cteById(s.cteId)!;
    const nv = latestVer(s.cteId);
    const a = cteCfg(s)!, b = c.versions.find((x) => x.v === nv)!.config;
    const diff = (x: string[], y: string[]) => ({ add: y.filter((k) => !x.includes(k)), rm: x.filter((k) => !y.includes(k)) });
    const dc = diff(coreOf(a), coreOf(b)), dopt = diff(optOf(a), optOf(b));
    const items = (d: { add: string[]; rm: string[] }) => [
        ...d.add.map((k) => ({ level: "warn" as const, msg: <><Tag cls={T.new}>Thêm</Tag> {fieldName(k)}</> })),
        ...d.rm.map((k) => ({ level: "error" as const, msg: <><Tag cls={T.err}>Bỏ</Tag> {fieldName(k)}</> })),
    ];
    const merge = s.rest.filter((r) => r.src === "ext" && LIB_KDES.find((l) => l.code === r.code)?.map && coreOf(b).includes(LIB_KDES.find((l) => l.code === r.code)!.map!));
    const lost = s.rest.filter((r) => r.src === "inh" && dopt.rm.includes(r.code) && r.mode !== "keep");
    return (
        <Dialog open onClose={onClose} title={`${c.name}: v${s.cteVer} → v${nv}`} sub="Thay đổi của sự kiện trọng yếu"
            footer={<><button className={btn} onClick={onClose}>Đóng</button>{editable && <button className={btnP} onClick={() => { const m = updateStepCte(s); onDone(`Đã cập nhật "${s.name}" lên v${nv}${m.length ? `. Đã gộp: ${m.join(", ")}` : ""}`); }}>Cập nhật lên v{nv}</button>}</>}>
            <div className="flex flex-col gap-4">
                <div><h3 className="mb-1.5 text-[14px] font-semibold">Trường bắt buộc</h3>{items(dc).length ? <IssueList items={items(dc)} /> : <p className="text-[13px] text-gray-400">Không thay đổi</p>}</div>
                <div><h3 className="mb-1.5 text-[14px] font-semibold">Trường tùy chọn</h3>{items(dopt).length ? <IssueList items={items(dopt)} /> : <p className="text-[13px] text-gray-400">Không thay đổi</p>}</div>
                {(merge.length > 0 || lost.length > 0) && (
                    <div><h3 className="mb-1.5 text-[14px] font-semibold">Ảnh hưởng tới cấu hình của Bộ</h3>
                        <IssueList items={[
                            ...merge.map((r) => ({ level: "warn" as const, msg: `Trường bổ sung "${fieldName(r.code)}" sẽ được gộp vào trường bắt buộc tương ứng; ghi chú được giữ lại.` })),
                            ...lost.map((r) => ({ level: "error" as const, msg: `Trường "${fieldName(r.code)}" (đã ${r.src === "inh" && r.mode === "req" ? "nâng bắt buộc" : "ẩn"}) bị bỏ khỏi sự kiện trọng yếu; cấu hình này sẽ mất.` })),
                        ]} /></div>
                )}
                <p className="text-[12.5px] text-gray-500">Tên hiển thị, trạng thái bắt buộc của công đoạn, ghi chú và các trường bổ sung khác được giữ nguyên.</p>
                {!editable && <p className="text-[12.5px] text-gray-500">Phiên bản này đã khoá. Tạo phiên bản mới của quy trình để cập nhật.</p>}
            </div>
        </Dialog>
    );
}

/* ---------- Publish ---------- */
export function PublishDialog({ p, v, onClose, onGoStep, onDone }: { p: Proc; v: ProcVersion; onClose: () => void; onGoStep: (uid: string) => void; onDone: (msg: string) => void }) {
    const a = pActive(p);
    const { E, W } = validateProc(p, v);
    const [when, setWhen] = useState<"now" | "sch">("now");
    const [dt, setDt] = useState("2027-01-01T00:00");
    const [note, setNote] = useState(v.note);
    const [eDt, setEDt] = useState("");
    const [eNote, setENote] = useState("");

    if (E.length)
        return (
            <Dialog open onClose={onClose} title="Chưa thể publish" sub={`Sửa ${E.length} lỗi dưới đây rồi publish lại`} footer={<button className={btnP} onClick={onClose}>Đã hiểu</button>}>
                <IssueList items={E.map((e) => ({ level: "error", msg: e.m, action: e.uid && <button className="whitespace-nowrap text-[12.5px] underline" onClick={() => onGoStep(e.uid!)}>Đến công đoạn</button> }))} />
                {W.length > 0 && <><h3 className="mb-1.5 mt-4 text-[14px] font-semibold">Cảnh báo</h3><IssueList items={W.map((w) => ({ level: "warn", msg: w.m }))} /></>}
            </Dialog>
        );

    const reqNew = a ? countReq(v) - countReq(a) : 0;
    const submit = () => {
        if (v.v > 1 && !note.trim()) return setENote("Nhập ghi chú thay đổi để phục vụ tra cứu, giải trình.");
        patch(v, { note: note.trim(), by: "Nguyễn Hà Cương" });
        if (when === "sch") {
            if (!dt || !after1h(dt)) return setEDt("Thời điểm áp dụng phải sau thời điểm hiện tại ít nhất 1 giờ.");
            patch(v, { status: "sched", from: dt.replace("T", " ") });
            onDone(`Đã đặt lịch áp dụng phiên bản ${v.v} lúc ${fmtDT(v.from)}`);
        } else {
            applyVersion(p, v, NOW);
            onDone(`Đã publish. Phiên bản ${v.v} đang áp dụng.`);
        }
    };
    return (
        <Dialog open onClose={onClose} title={`Publish phiên bản ${v.v}`} sub={p.name}
            footer={<><button className={btn} onClick={onClose}>Huỷ</button><button className={btnP} onClick={submit}>{when === "sch" ? `Đặt lịch ${dt ? fmtDT(dt.replace("T", " ")) : ""}` : "Áp dụng ngay"}</button></>}>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2">
                    {[[v.steps.length, "công đoạn"], [countReq(v), "trường bắt buộc"], [a ? `${reqNew >= 0 ? "+" : ""}${reqNew}` : "—", `trường bắt buộc so với v${a?.v ?? ""}`]].map(([n, l]) => (
                        <div key={String(l)} className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800"><b className="block text-[18px]">{n}</b><span className="text-[12px] text-gray-500">{l}</span></div>
                    ))}
                </div>
                {W.length > 0 && <div><h3 className="mb-1.5 text-[14px] font-semibold">Cảnh báo</h3><IssueList items={W.map((w) => ({ level: "warn", msg: w.m }))} /></div>}
                <div className="flex flex-col gap-2">
                    <label className={`flex cursor-pointer gap-2.5 rounded-xl border px-3 py-2.5 ${when === "now" ? "border-brand-500 bg-brand-50/50" : "border-gray-200"}`}>
                        <input type="radio" className="mt-1 accent-brand-600" checked={when === "now"} onChange={() => setWhen("now")} />
                        <div><b>Áp dụng ngay</b><div className="text-[12.5px] text-gray-500">{a ? `Phiên bản ${a.v} sẽ chuyển sang Đã thay thế.` : "Doanh nghiệp khai báo theo quy trình này từ bây giờ."}</div></div>
                    </label>
                    <label className={`flex cursor-pointer gap-2.5 rounded-xl border px-3 py-2.5 ${when === "sch" ? "border-brand-500 bg-brand-50/50" : "border-gray-200"}`}>
                        <input type="radio" className="mt-1 accent-brand-600" checked={when === "sch"} onChange={() => setWhen("sch")} />
                        <div className="flex-1"><b>Đặt lịch áp dụng</b><div className="text-[12.5px] text-gray-500">Doanh nghiệp có thời gian chuẩn bị. {a && `Phiên bản ${a.v} vẫn áp dụng tới thời điểm này.`}</div>
                            <input type="datetime-local" className={`${inp} mt-2 !w-64`} value={dt} onChange={(e) => { setDt(e.target.value); setWhen("sch"); setEDt(""); }} />
                            {eDt && <p className="mt-1 text-[12.5px] text-red-600">{eDt}</p>}
                        </div>
                    </label>
                </div>
                <div>
                    <label className={label} htmlFor="pNote">Ghi chú thay đổi {v.v > 1 && <span className="text-red-500">*</span>}</label>
                    <textarea id="pNote" rows={2} className={inp} value={note} onChange={(e) => { setNote(e.target.value); setENote(""); }} placeholder="Ví dụ: Bổ sung công đoạn đóng gói theo Thông tư hướng dẫn" />
                    {eNote && <p className="mt-1 text-[12.5px] text-red-600">{eNote}</p>}
                </div>
            </div>
        </Dialog>
    );
}

/* ---------- Đổi lịch ---------- */
export function ScheduleDialog({ v, onClose, onDone }: { v: ProcVersion; onClose: () => void; onDone: (m: string) => void }) {
    const [dt, setDt] = useState(v.from.replace(" ", "T"));
    const [e, setE] = useState("");
    return (
        <Dialog open onClose={onClose} title="Đổi lịch áp dụng"
            footer={<><button className={btn} onClick={onClose}>Huỷ</button><button className={btnP} onClick={() => {
                if (!dt || !after1h(dt)) return setE("Thời điểm áp dụng phải sau thời điểm hiện tại ít nhất 1 giờ.");
                patch(v, { from: dt.replace("T", " ") }); onDone(`Đã đổi lịch sang ${fmtDT(v.from)}`);
            }}>Lưu lịch</button></>}>
            <label className={label} htmlFor="dt2">Thời điểm áp dụng (GMT+7)</label>
            <input id="dt2" type="datetime-local" className={`${inp} !w-64`} value={dt} onChange={(x) => { setDt(x.target.value); setE(""); }} />
            {e && <p className="mt-1 text-[12.5px] text-red-600">{e}</p>}
        </Dialog>
    );
}

/* ---------- Vô hiệu hoá ---------- */
export function DeactivateDialog({ p, v, onClose, onDone }: { p: Proc; v: ProcVersion; onClose: () => void; onDone: (m: string) => void }) {
    const pe = pPending(p);
    const [r, setR] = useState("");
    const [e, setE] = useState("");
    return (
        <Dialog open onClose={onClose} title="Vô hiệu hoá quy trình" sub={`${p.name} · phiên bản ${v.v}`}
            footer={<><button className={btn} onClick={onClose}>Huỷ</button><button className={btnD} onClick={() => {
                if (!r.trim()) return setE("Nhập lý do vô hiệu hoá.");
                patch(v, { status: "off", to: NOW, offReason: r.trim() });
                if (pe?.status === "sched") patch(pe, { status: "draft", from: "" });
                onDone("Đã vô hiệu hoá quy trình");
            }}>Vô hiệu hoá</button></>}>
            <IssueList items={[
                { level: "warn", msg: "Có hiệu lực ngay. Doanh nghiệp không khai báo sự kiện mới theo quy trình này." },
                { level: "warn", msg: "Dữ liệu doanh nghiệp đã khai giữ nguyên, vẫn đối soát theo phiên bản tại thời điểm khai." },
                ...(pe?.status === "sched" ? [{ level: "error" as const, msg: `Lịch áp dụng phiên bản ${pe.v} lúc ${fmtDT(pe.from)} sẽ bị huỷ; phiên bản đó về Nháp.` }] : []),
                ...(pe?.status === "draft" ? [{ level: "warn" as const, msg: `Bản nháp phiên bản ${pe.v} được giữ, nhưng không publish được khi quy trình đang vô hiệu hoá.` }] : []),
                { level: "warn", msg: "Có thể kích hoạt lại sau." },
            ]} />
            <div className="mt-3">
                <label className={label} htmlFor="rs">Lý do <span className="text-red-500">*</span></label>
                <textarea id="rs" autoFocus rows={2} className={inp} value={r} onChange={(x) => { setR(x.target.value); setE(""); }} />
                {e && <p className="mt-1 text-[12.5px] text-red-600">{e}</p>}
            </div>
        </Dialog>
    );
}

/* ---------- Kích hoạt lại ---------- */
export function ReactivateDialog({ p, v, onClose, onDone, onNewVersion }: { p: Proc; v: ProcVersion; onClose: () => void; onDone: (m: string) => void; onNewVersion: () => void }) {
    const other = procs.find((x) => x !== p && x.fam === p.fam && x.versions.some((y) => ["active", "sched", "draft"].includes(y.status)));
    const E = validateProc(p, v).E.filter((e) => !e.m.startsWith("Bộ đã có"));
    return (
        <Dialog open onClose={onClose} title="Kích hoạt lại quy trình" sub={p.name}
            footer={<><button className={btn} onClick={onClose}>Huỷ</button>{!other && (E.length
                ? <button className={btnP} onClick={onNewVersion}>Tạo phiên bản mới</button>
                : <button className={btnP} onClick={() => { patch(v, { status: "active", from: NOW, to: "", offReason: undefined }); onDone(`Đã kích hoạt lại phiên bản ${v.v}`); }}>Kích hoạt lại</button>)}</>}>
            {other ? <IssueList items={[{ level: "error", msg: `Bộ đã có quy trình "${other.name}" cho nhóm ngành này. Vô hiệu hoá quy trình đó trước.` }]} />
                : E.length ? <><IssueList items={E.map((e) => ({ level: "error", msg: e.m }))} /><p className="mt-2 text-[12.5px] text-gray-500">Tạo phiên bản mới để thay thế các thành phần không còn hợp lệ.</p></>
                    : <p>Phiên bản {v.v} có thêm một khoảng hiệu lực mới; khoảng hiệu lực cũ giữ trong lịch sử.</p>}
        </Dialog>
    );
}

/* ---------- Xem trước form doanh nghiệp ---------- */
export function PreviewDialog({ v, start, onClose }: { v: ProcVersion; start: string | null; onClose: () => void }) {
    const [uid, setUid] = useState(start ?? v.steps[0]?.uid);
    const s = v.steps.find((x) => x.uid === uid) ?? v.steps[0];
    if (!s) return null;
    const cfg = cteCfg(s)!;
    const fields = [
        ...coreOf(cfg).map((k) => ({ k, req: true, note: s.coreNotes[k] || cfg.kdes.find((x) => x.code === k)?.note || "" })),
        ...s.rest.filter((r) => !(r.src === "inh" && r.mode === "hide")).map((r) => ({ k: r.code, req: r.src === "inh" ? r.mode === "req" : r.req, note: r.note })),
    ];
    return (
        <Dialog open wide onClose={onClose} title={s.name} sub={<>Xem trước — doanh nghiệp sẽ thấy{s.note && <> · {s.note}</>}{!s.req && <> · <Tag cls={T.mute}>Có thể bỏ qua</Tag></>}</>}
            footer={<><span className="mr-auto text-[13px] text-gray-500">{fields.length} trường · {fields.filter((f) => f.req).length} bắt buộc</span>
                <select className={`${inp} !w-auto`} value={s.uid} onChange={(e) => setUid(e.target.value)}>{v.steps.map((x) => <option key={x.uid} value={x.uid}>{x.name}</option>)}</select>
                <button className={btnP} onClick={onClose}>Đóng</button></>}>
            <div className="flex flex-col gap-3">
                {fields.map((f) => (
                    <div key={f.k}>
                        <label className={label}>{fieldName(f.k)}{f.req && <span className="text-red-500"> *</span>}</label>
                        <input className={inp} disabled placeholder={f.k} />
                        {f.note && <span className="text-[12px] text-gray-400">{f.note}</span>}
                    </div>
                ))}
            </div>
        </Dialog>
    );
}

export function ConfirmDialog({ title, msg, btnLabel, danger, onClose, onOk }: { title: string; msg: string; btnLabel: string; danger?: boolean; onClose: () => void; onOk: () => void }) {
    return (
        <Dialog open onClose={onClose} title={title} footer={<><button className={btn} onClick={onClose}>Quay lại</button><button className={danger ? btnD : btnP} onClick={() => { onClose(); onOk(); }}>{btnLabel}</button></>}>
            {msg}
        </Dialog>
    );
}

