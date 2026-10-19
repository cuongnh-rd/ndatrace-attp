"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Copy, Eye, GripVertical, Plus, Trash2 } from "lucide-react";
import { Banner, NoteSlot, Seg, Tag, T, btn, btnSm, card, inp } from "@/components/txng/ui";
import { fieldName, libOf } from "@/lib/txng/catalog";
import { cteById, patch } from "@/lib/txng/cte";
import {
    type Proc, type ProcStep, type ProcVersion, cteCfg, cteInactive, coreOf, isOutdated, norm, overlapBo,
    uid, visibleCount,
} from "@/lib/txng/process";

interface Props {
    p: Proc;
    v: ProcVersion;
    prev: ProcVersion | null;
    editable: boolean;
    sel: string | null;
    errSteps: Set<string>;
    onSel: (uid: string | null) => void;
    bump: () => void;
    toast: (m: string, undo?: () => void) => void;
    onAddStep: () => void;
    onAddKde: (s: ProcStep) => void;
    onPreview: (uid: string) => void;
    onDiff: (s: ProcStep) => void;
    onConfirm: (title: string, msg: string, btn: string, fn: () => void) => void;
}

export default function Builder(props: Props) {
    const { p, v, prev, editable: ed, sel, errSteps, onSel, bump } = props;
    const dragFrom = useRef<number | null>(null);
    const [over, setOver] = useState<number | null>(null);
    const reqN = v.steps.filter((s) => s.req).length;

    const diffTag = (s: ProcStep) => {
        if (v.status !== "draft" || v.v === 1 || !prev) return null;
        const o = prev.steps.find((x) => x.uid === s.uid);
        if (!o) return <Tag cls={T.new}>Mới</Tag>;
        return JSON.stringify(o) !== JSON.stringify(s) ? <Tag cls={T.mod}>Đã sửa</Tag> : null;
    };

    return (
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(300px,380px)_1fr]">
            <section className={card} aria-label="Danh sách công đoạn">
                <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                    <h2 className="text-[15px] font-semibold">Công đoạn</h2>
                    <p className="text-[12.5px] text-gray-500">{v.steps.length} công đoạn · {reqN} bắt buộc</p>
                </div>
                {v.steps.length ? (
                    <ol className="flex flex-col gap-1.5 p-2.5">
                        {v.steps.map((s, i) => {
                            const c = cteById(s.cteId)!;
                            const dup = v.steps.some((x) => x !== s && norm(x.name) === norm(s.name));
                            const ov = overlapBo(p.fam, s.cteId);
                            const bad = errSteps.has(s.uid) || dup || cteInactive(s);
                            return (
                                <li key={s.uid} tabIndex={0} draggable={ed}
                                    onClick={() => onSel(s.uid)} onKeyDown={(e) => e.key === "Enter" && onSel(s.uid)}
                                    onDragStart={() => { dragFrom.current = i; }}
                                    onDragOver={(e) => { e.preventDefault(); setOver(i); }}
                                    onDragLeave={() => setOver(null)}
                                    onDrop={(e) => {
                                        e.preventDefault(); setOver(null);
                                        const f = dragFrom.current; dragFrom.current = null;
                                        if (f === null || f === i) return;
                                        const [m] = v.steps.splice(f, 1); v.steps.splice(i, 0, m); bump();
                                    }}
                                    className={`grid cursor-pointer grid-cols-[16px_24px_1fr_auto] items-center gap-2 rounded-xl border px-2 py-2.5 ${sel === s.uid ? "border-brand-500 ring-2 ring-brand-100" : bad ? "border-red-300" : "border-gray-200 hover:border-gray-300 dark:border-gray-700"} ${over === i ? "border-t-4 border-t-brand-500" : ""}`}>
                                    <span className="text-gray-300">{ed && <GripVertical size={14} />}</span>
                                    <span className={`grid h-6 w-6 place-items-center rounded-full border text-[12px] font-semibold ${sel === s.uid ? "border-brand-600 bg-brand-600 text-white" : "border-gray-200 bg-gray-50 text-gray-500"}`}>{i + 1}</span>
                                    <div className="min-w-0">
                                        <div className="text-[13.5px] font-semibold leading-tight">{s.name}</div>
                                        {norm(s.name) !== norm(c.name) && <div className="text-[12px] text-gray-400">Sự kiện trọng yếu: {c.name}</div>}
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {!s.req && <Tag cls={T.mute}>Tùy chọn</Tag>}
                                            {diffTag(s)}
                                            {isOutdated(s) && <Tag cls={T.warn}>Có phiên bản mới</Tag>}
                                            {cteInactive(s) && <Tag cls={T.err}>Sự kiện trọng yếu không còn áp dụng</Tag>}
                                            {dup && <Tag cls={T.err}>Trùng tên</Tag>}
                                            {ov.length > 0 && <Tag cls={T.warn} title={`Công đoạn này cũng có trong quy trình của ${ov.join(", ")} cho cùng nhóm ngành`}>Trùng với {ov.join(", ")}</Tag>}
                                        </div>
                                    </div>
                                    <span className="whitespace-nowrap text-[12px] text-gray-500">{visibleCount(s)} trường</span>
                                </li>
                            );
                        })}
                    </ol>
                ) : (
                    <div className="px-5 py-8 text-center text-[13.5px] text-gray-500">Quy trình chưa có công đoạn nào.<br />Thêm sự kiện trọng yếu để bắt đầu.</div>
                )}
                {ed && (
                    <div className="px-2.5 pb-3">
                        <button className={`${btn} w-full justify-center border-dashed text-brand-700`} onClick={props.onAddStep}><Plus size={14} /> Thêm công đoạn</button>
                    </div>
                )}
            </section>
            <section className={card} aria-label="Cấu hình công đoạn">
                <Panel {...props} />
            </section>
        </div>
    );
}

function Panel({ v, editable: ed, sel, onSel, bump, toast, onAddKde, onDiff, onConfirm, onPreview }: Props) {
    const s = v.steps.find((x) => x.uid === sel);
    const [nameErr, setNameErr] = useState("");
    const kdrag = useRef<number | null>(null);
    if (!s) return <div className="px-5 py-16 text-center text-[13.5px] text-gray-500">{v.steps.length ? "Chọn một công đoạn để cấu hình trường thông tin." : "Chưa có công đoạn để cấu hình."}</div>;

    const c = cteById(s.cteId)!;
    const cfg = cteCfg(s)!;
    const core = coreOf(cfg);
    const i = v.steps.indexOf(s);
    const move = (d: number) => { v.steps.splice(i, 1); v.steps.splice(i + d, 0, s); bump(); };
    const dup = () => {
        const cp: ProcStep = { ...JSON.parse(JSON.stringify(s)), uid: uid(), name: s.name + " (bản sao)" };
        v.steps.splice(i + 1, 0, cp); onSel(cp.uid);
    };
    const del = () => {
        const doDel = () => {
            v.steps.splice(i, 1);
            onSel(v.steps[Math.min(i, v.steps.length - 1)]?.uid ?? null);
            toast(`Đã xoá công đoạn "${s.name}"`, () => { v.steps.splice(i, 0, s); onSel(s.uid); });
        };
        const n = s.rest.filter((r) => r.src === "ext" || r.mode === "req" || r.note).length;
        if (!n && !s.note && !Object.values(s.coreNotes).some(Boolean)) return doDel();
        onConfirm("Xoá công đoạn", `Công đoạn "${s.name}" đã được cấu hình: ${n} trường bổ sung đã điều chỉnh. Cấu hình này sẽ mất.`, "Xoá công đoạn", doDel);
    };
    const rename = (val: string) => {
        if (!val.trim()) { setNameErr("Tên công đoạn không được để trống."); return; }
        setNameErr(v.steps.some((x) => x !== s && norm(x.name) === norm(val)) ? "Tên công đoạn đã tồn tại trong quy trình." : "");
        patch(s, { name: val.trim() }); bump();
    };

    const kdeRow = (idx: number) => {
        const r = s.rest[idx];
        const isReq = r.src === "inh" ? r.mode === "req" : r.req;
        const lib = r.src === "ext" ? libOf(r.code) : undefined;
        return (
            <div key={r.code + idx} draggable={ed}
                onDragStart={() => { kdrag.current = idx; }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const f = kdrag.current; kdrag.current = null;
                    if (f === null || f === idx) return;
                    if (s.rest[f].src !== r.src) { toast("Kéo thả trong cùng nhóm trường"); return; }
                    const [m] = s.rest.splice(f, 1); s.rest.splice(idx, 0, m); bump();
                }}
                className={`grid grid-cols-[16px_1fr_auto] items-center gap-2.5 rounded-xl border px-2.5 py-2 border-gray-200 dark:border-gray-700`}>
                <span className="text-gray-300">{ed && <GripVertical size={13} />}</span>
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-[13.5px] font-medium">
                        <span>{fieldName(r.code)} <span className="font-normal text-gray-400">({r.code})</span></span>
                        {lib?.ilmd && <Tag cls={T.mute}>Thông tin lô/mẻ</Tag>}
                    </div>
                </div>
                <NoteSlot key={s.uid + r.code} value={r.note} editable={ed} onChange={(v) => patch(r, { note: v })} actions={(
                    <>
                        <Seg xs disabled={!ed} value={isReq ? "1" : "0"} options={[["0", "Tùy chọn"], ["1", "Bắt buộc"]]}
                            onChange={(m) => { if (r.src === "inh") patch(r, { mode: m === "1" ? "req" : "keep" }); else patch(r, { req: m === "1" }); bump(); }} />
                        {ed && (
                            <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600" title="Xoá trường" onClick={() => {
                                s.rest.splice(idx, 1); bump();
                                toast(`Đã xoá trường "${fieldName(r.code)}"`, () => { s.rest.splice(idx, 0, r); bump(); });
                            }}><Trash2 size={14} /></button>
                        )}
                    </>
                )} />
            </div>
        );
    };

    return (
        <>
            <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="mt-0.5 text-[16px] font-semibold">{s.name}</h2>
                        <div className="text-[12.5px] text-gray-500">
                            Sự kiện trọng yếu <Link className="font-semibold text-brand-700 hover:underline" href={`/danh-muc/su-kien-trong-yeu/${c.id}`}>{c.name}</Link>
                            {isOutdated(s) && <> <Tag cls={T.warn}>Có phiên bản mới</Tag></>}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className={`${btn} ${btnSm}`} onClick={() => onPreview(s.uid)}><Eye size={13} /> Xem trước</button>
                        {isOutdated(s) && <button className={`${btn} ${btnSm}`} onClick={() => onDiff(s)}>Xem phiên bản mới</button>}
                        {ed && (
                            <>
                                <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30" title="Lên" disabled={i === 0} onClick={() => move(-1)}><ArrowUp size={15} /></button>
                                <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30" title="Xuống" disabled={i === v.steps.length - 1} onClick={() => move(1)}><ArrowDown size={15} /></button>
                                <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100" title="Nhân bản" onClick={dup}><Copy size={15} /></button>
                                <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600" title="Xoá công đoạn" onClick={del}><Trash2 size={15} /></button>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
                    <div>
                        <label className="mb-1 block text-[12.5px] font-medium text-gray-500" htmlFor="sName">Tên hiển thị với doanh nghiệp</label>
                        <input key={s.uid} id="sName" className={inp} defaultValue={s.name} disabled={!ed} onBlur={(e) => rename(e.target.value)} />
                        {nameErr && <p className="mt-1 text-[12.5px] text-red-600">{nameErr}</p>}
                    </div>
                    <div>
                        <span className="mb-1 block text-[12.5px] font-medium text-gray-500">Công đoạn</span>
                        <Seg disabled={!ed} value={s.req ? "1" : "0"} options={[["1", "Bắt buộc"], ["0", "Tùy chọn"]]} onChange={(x) => { patch(s, { req: x === "1" }); bump(); }} />
                    </div>
                </div>
                {!s.req && <p className="mt-1.5 text-[12.5px] text-gray-500">Doanh nghiệp có thể bỏ qua công đoạn này.</p>}
                <StepNote key={s.uid} value={s.note} editable={ed} onChange={(v) => patch(s, { note: v })} />
            </div>

            <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2"><h3 className="text-[14px] font-semibold">Trường dữ liệu bắt buộc</h3></div>
                    <span className="text-[12.5px] text-gray-400">Kế thừa từ sự kiện trọng yếu</span>
                </div>
                <div className="flex flex-col gap-1.5">
                    {core.map((k) => (
                        <div key={k} className="grid grid-cols-[0px_1fr_auto] items-center gap-x-0 gap-y-2 rounded-xl border border-yellow-200 bg-yellow-50/60 px-3 py-2">
                            <span />
                            <div className="min-w-0 text-[13.5px] font-medium">{fieldName(k)} <span className="font-normal text-gray-400">({k})</span></div>
                            <NoteSlot key={s.uid + k} value={s.coreNotes[k] ?? cfg.kdes.find((x) => x.code === k)?.note ?? ""} editable={ed}
                                onChange={(v) => patch(s.coreNotes, { [k]: v })} actions={<Tag cls={T.gs1}>Bắt buộc</Tag>} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-5 py-4">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2"><h3 className="text-[14px] font-semibold">Trường dữ liệu bổ sung</h3>
                        <span className="text-[12.5px] text-gray-500">{s.rest.length} trường · {s.rest.filter((r) => (r.src === "inh" ? r.mode === "req" : r.req)).length} bắt buộc</span></div>
                    <span className="text-[12.5px] text-gray-400">Thêm trường dữ liệu phù hợp với nhóm ngành hàng</span>
                </div>
                {s.rest.length ? <div className="flex flex-col gap-1.5">{s.rest.map((_, idx) => kdeRow(idx))}</div> : <p className="text-[13px] text-gray-400">Chưa có trường bổ sung.</p>}
                {ed && <button className={`${btn} mt-2 w-full justify-center border-dashed text-brand-700`} onClick={() => onAddKde(s)}><Plus size={14} /> Thêm trường dữ liệu</button>}
                {visibleCount(s) > 15 && <Banner kind="warn">Công đoạn có {visibleCount(s)} trường hiển thị. Form dài làm tăng tỷ lệ doanh nghiệp khai thiếu; cân nhắc xoá trường tùy chọn không cần thiết.</Banner>}
            </div>
        </>
    );
}

/** Hướng dẫn cho doanh nghiệp (tuỳ chọn) — chỉ mở ô nhập khi bấm "+ Thêm ghi chú" */
function StepNote({ value, editable, onChange }: { value: string; editable: boolean; onChange: (v: string) => void }) {
    const [open, setOpen] = useState(!!value);
    if (!open) return editable ? (
        <button type="button" onClick={() => setOpen(true)} className="mt-2 rounded-md px-1.5 py-0.5 text-[12.5px] text-gray-400 hover:bg-gray-100 hover:text-brand-700 dark:hover:bg-gray-800">
            + Thêm ghi chú
        </button>
    ) : null;
    return (
        <div className="mt-3">
            <label className="mb-1 block text-[12.5px] font-medium text-gray-500" htmlFor="sNote">Hướng dẫn cho doanh nghiệp</label>
            <input id="sNote" autoFocus={!value} className={inp} defaultValue={value} disabled={!editable} placeholder="Ví dụ: Áp dụng với cơ sở có kho lạnh"
                onChange={(e) => onChange(e.target.value)} onBlur={(e) => { if (!e.target.value.trim()) setOpen(false); }} />
        </div>
    );
}
