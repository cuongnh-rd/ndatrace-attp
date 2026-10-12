"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Lock, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Banner, IssueList, Seg, Tag, T, btn, btnP, card, inp, label } from "@/components/txng/ui";
import {
    ACTIONS, BIZ_STEPS, BIZ_TX_TYPES, CERT_TYPES, DISPOSITIONS, EVENT_KDES, EVENT_TYPES, ILMD_FIELDS, SENSOR_TYPES,
    type Action, type EtCode, etOf, ilmdAllowed, suggestDisp,
} from "@/lib/txng/catalog";
import {
    type Cte, type CteConfig, type KdeCfg, autoKdes, clone, ctes, emptyConfig, ME_USER, myOrg, nextCteCode, nextCteId,
    patch, session, TODAY, validateCte, vDraft,
} from "@/lib/txng/cte";

const LAYERS = ["Event Type", "action mặc định", "bizStep", "disposition", "bizTransactionType", "KDE + ilmd", "Cấu hình bổ sung"];

export default function CteWizard({ cte }: { cte?: Cte }) {
    const router = useRouter();
    const draft = cte ? vDraft(cte) : undefined;
    const editing = !!cte;
    const parent = cte?.parentConfig;

    const [name, setName] = useState(cte?.name ?? "");
    const [code] = useState(cte?.code ?? nextCteCode());
    const [et, setEt] = useState<EtCode | null>(cte?.et ?? null);
    const [cfg, setCfg] = useState<CteConfig>(() => (draft ? clone(draft.config) : emptyConfig()));
    const [step, setStep] = useState(editing ? 3 : 1);
    const [reached, setReached] = useState(editing ? 7 : 1);
    const [err, setErr] = useState("");
    const [saveIssues, setSaveIssues] = useState<string[]>([]);
    const [warnStep, setWarnStep] = useState("");

    const etLocked = editing || reached > 1;
    const skipL2 = et === "ET-03";
    const up = (p: Partial<CteConfig>) => setCfg((c) => ({ ...c, ...p }));
    const auto = et ? autoKdes(et) : [];

    /** Kiểm tra lớp hiện tại trước khi sang lớp sau */
    const layerError = (n: number): string => {
        if (n === 1 && !et) return "Chọn Event Type.";
        if (n === 2 && !skipL2 && !cfg.action) return "Chọn action mặc định.";
        if (n === 3 && !cfg.bizStep) return "Chọn bizStep.";
        if (n === 4 && !cfg.disposition) return "Chọn disposition.";
        if (n === 5 && et === "ET-04" && !cfg.bizTxTypes.length) return "TransactionEvent yêu cầu chọn ≥1 loại giao dịch.";
        if (n === 6 && !cfg.kdes.some((x) => !auto.includes(x.code))) return "Cần chọn ít nhất 1 KDE ngoài các trường tự động bắt buộc.";
        return "";
    };

    const goNext = () => {
        const e = layerError(step);
        if (e) return setErr(e);
        setErr("");
        if (step === 1 && et) {
            // khởi tạo KDE tự động bắt buộc theo ET
            setCfg((c) => ({
                ...c,
                action: et === "ET-03" ? null : c.action,
                kdes: [...autoKdes(et).map((code) => ({ code, required: true, note: "" })), ...c.kdes.filter((x) => !autoKdes(et).includes(x.code))],
            }));
        }
        let n = step + 1;
        if (n === 2 && skipL2) n = 3;
        setStep(n);
        setReached((r) => Math.max(r, n));
    };
    const goBack = () => {
        setErr("");
        let n = step - 1;
        if (n === 2 && skipL2) n = 1;
        setStep(Math.max(1, n));
    };

    const pickBizStep = (b: string) => {
        if (!et) return;
        const fit = BIZ_STEPS.find((x) => x.code === b)?.fit[et];
        setWarnStep(fit === "warn" ? `bizStep '${b}' ít dùng với ${etOf(et).epcis}. Bạn có chắc?` : "");
        const sug = suggestDisp(et, b);
        up({ bizStep: b, disposition: sug[0] ?? cfg.disposition });
    };

    const save = () => {
        for (let i = 1; i <= 6; i++) {
            const e = layerError(i);
            if (e) {
                setSaveIssues([`Lớp ${i} — ${e}`]);
                setStep(i);
                return;
            }
        }
        if (!name.trim()) return setSaveIssues(["Nhập tên sự kiện trọng yếu."]);
        const issues = parent ? validateCte({ et: et!, parentConfig: parent }, cfg).filter((x) => x.level === "error" && x.msg.includes("AD-06")) : [];
        if (issues.length) return setSaveIssues(issues.map((x) => x.msg));
        if (editing && draft) {
            patch(cte!, { name: name.trim() });
            patch(draft, { config: cfg });
            router.push(`/danh-muc/su-kien-trong-yeu/${cte!.id}`);
        } else {
            const id = nextCteId();
            ctes.unshift({
                id, code, name: name.trim(), et: et!, level: session.level, org: myOrg(), source: "NEW", createdAt: TODAY,
                versions: [{ v: 1, status: "draft", effectiveFrom: "", effectiveTo: "", config: cfg, createdAt: TODAY, createdBy: ME_USER }],
            });
            router.push(`/danh-muc/su-kien-trong-yeu/${id}`);
        }
    };

    const layerState = (n: number) => {
        if (n === 2 && skipL2 && reached > 1) return "skip";
        if (n === step) return "cur";
        if (n < reached || (n <= reached && n !== step)) return layerError(n) ? "todo" : "done";
        return "lock";
    };

    return (
        <DashboardLayout>
            <div className="mb-5 flex items-center gap-3">
                <Link href={editing ? `/danh-muc/su-kien-trong-yeu/${cte!.id}` : "/danh-muc/su-kien-trong-yeu"}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <ArrowLeft size={16} className="text-gray-600" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{editing ? `Sửa ${cte!.name} — v${draft?.v} (Nháp)` : "Tạo sự kiện trọng yếu mới"}</h1>
                    <p className="text-[13px] text-gray-500">Cấu hình tuần tự 7 lớp. Lớp sau chỉ mở khi lớp trước hoàn thành.</p>
                </div>
                <Link href={editing ? `/danh-muc/su-kien-trong-yeu/${cte!.id}` : "/danh-muc/su-kien-trong-yeu"} className={btn}>Huỷ</Link>
                <button className={btnP} onClick={save}>Lưu nháp</button>
            </div>

            {parent && (
                <Banner kind="info">
                    CTE kế thừa từ cấp Bộ (AD-06): không đổi được ET, action, bizStep; không hạ KDE bắt buộc thành tuỳ chọn. Cấp Sở chỉ được thêm yêu cầu chặt hơn (KDE bắt buộc, ngưỡng cảm biến, chứng nhận).
                </Banner>
            )}
            {saveIssues.length > 0 && <div className="mt-3"><IssueList items={saveIssues.map((m) => ({ level: "error", msg: m }))} /></div>}

            <div className={`${card} mt-4 grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-[1fr_200px]`}>
                <div>
                    <label className={label} htmlFor="cteName">Tên sự kiện (tiếng Việt) <span className="text-red-500">*</span></label>
                    <input id="cteName" className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Xuất kho thủy sản tươi" />
                </div>
                <div>
                    <label className={label}>Mã CTE</label>
                    <input className={`${inp} font-mono`} value={code} disabled />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[260px_1fr]">
                <ol className={`${card} flex flex-col gap-1 p-2`}>
                    {LAYERS.map((l, i) => {
                        const n = i + 1, s = layerState(n);
                        const clickable = s !== "lock" && s !== "skip";
                        return (
                            <li key={l}>
                                <button disabled={!clickable} onClick={() => { setErr(""); setStep(n); }}
                                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13.5px] ${s === "cur" ? "bg-brand-50 font-semibold text-brand-700" : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"} disabled:cursor-not-allowed disabled:opacity-50`}>
                                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[12px] ${s === "done" ? "border-brand-600 bg-brand-600 text-white" : s === "cur" ? "border-brand-600 text-brand-700" : "border-gray-300 text-gray-400"}`}>
                                        {s === "done" ? <Check size={13} /> : s === "lock" ? <Lock size={11} /> : n}
                                    </span>
                                    <span className="flex-1">
                                        Lớp {n} · {l}
                                        {s === "skip" && <span className="block text-[11.5px] font-normal text-gray-400">Bỏ qua — ET-03 không có action</span>}
                                        {s === "todo" && <span className="block text-[11.5px] font-normal text-red-500">Chưa hoàn thành</span>}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>

                <section className={`${card} p-5`}>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-[16px] font-semibold text-gray-900 dark:text-white">Lớp {step} · {LAYERS[step - 1]}</h2>
                        {et && step > 1 && <Tag cls={T.info}>{et} · {etOf(et).epcis}</Tag>}
                    </div>

                    {step === 1 && (
                        <div className="flex flex-col gap-2">
                            {etLocked && <Banner kind="warn">Event Type không thể thay đổi. Tạo CTE mới nếu cần ET khác. (BR-D-06)</Banner>}
                            {EVENT_TYPES.filter((e) => e.active).map((e) => (
                                <label key={e.code} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 ${et === e.code ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"} ${etLocked ? "cursor-not-allowed opacity-70" : ""}`}>
                                    <input type="radio" name="et" className="mt-1 accent-brand-600" checked={et === e.code} disabled={etLocked} onChange={() => setEt(e.code)} />
                                    <div>
                                        <div className="font-semibold">{e.code} · {e.epcis} <span className="font-normal text-gray-500">— {e.name}</span></div>
                                        <div className="text-[12.5px] text-gray-500">{e.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-2">
                            {ACTIONS.map((a) => (
                                <label key={a.code} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 ${cfg.action === a.code ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"}`}>
                                    <input type="radio" name="act" className="mt-1 accent-brand-600" checked={cfg.action === a.code} disabled={!!parent}
                                        onChange={() => up({ action: a.code as Action, ilmd: ilmdAllowed(et!, a.code) ? cfg.ilmd : [] })} />
                                    <div><div className="font-mono font-semibold">{a.code}</div><div className="text-[12.5px] text-gray-500">{a.desc}</div></div>
                                </label>
                            ))}
                            {et === "ET-01" && cfg.action && cfg.action !== "ADD" && <Banner kind="info">ilmd (thông tin cấp lô) chỉ dùng khi action = ADD. Action hiện tại: {cfg.action}.</Banner>}
                        </div>
                    )}

                    {step === 3 && et && (
                        <div>
                            <p className="mb-2 text-[13px] text-gray-500">Danh sách lọc theo {et}: ✅ khuyến nghị, ⚠️ ít dùng (vẫn cho chọn). bizStep không tương thích đã ẩn.</p>
                            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                                {BIZ_STEPS.filter((b) => b.fit[et]).sort((a, b) => (a.fit[et] === "ok" ? 0 : 1) - (b.fit[et] === "ok" ? 0 : 1)).map((b) => (
                                    <label key={b.code} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 ${cfg.bizStep === b.code ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"} ${parent ? "cursor-not-allowed opacity-70" : ""}`}>
                                        <input type="radio" name="bs" className="accent-brand-600" checked={cfg.bizStep === b.code} disabled={!!parent} onChange={() => pickBizStep(b.code)} />
                                        <span className="flex-1"><span className="font-mono text-[13px]">{b.code}</span> <span className="text-[12.5px] text-gray-500">— {b.name}</span></span>
                                        {b.fit[et] === "warn" ? <Tag cls={T.warn}><AlertTriangle size={11} /> ít dùng</Tag> : <Tag cls={T.ok}>✓</Tag>}
                                    </label>
                                ))}
                            </div>
                            {warnStep && <Banner kind="warn">{warnStep}</Banner>}
                        </div>
                    )}

                    {step === 4 && et && (() => {
                        const sug = suggestDisp(et, cfg.bizStep);
                        return (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className={label}>disposition <span className="text-red-500">*</span></label>
                                    <p className="mb-2 text-[12.5px] text-gray-500">Gợi ý theo {et} + {cfg.bizStep} — chỉ là gợi ý, có thể chọn giá trị khác (BR-D-09).{et === "ET-03" && " Disposition áp dụng cho output products."}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[...DISPOSITIONS].sort((a, b) => (sug.includes(b.code) ? 1 : 0) - (sug.includes(a.code) ? 1 : 0)).map((d) => (
                                            <button key={d.code} type="button" onClick={() => up({ disposition: d.code })}
                                                className={`rounded-full border px-3 py-1 text-[12.5px] ${cfg.disposition === d.code ? "border-brand-600 bg-brand-600 text-white" : sug[0] === d.code ? "border-blue-300 bg-blue-50 text-blue-700" : sug.includes(d.code) ? "border-gray-300 bg-gray-50" : "border-gray-200 text-gray-500"}`}>
                                                {sug[0] === d.code && "🔵 "}{sug.includes(d.code) && sug[0] !== d.code && "⚪ "}{d.code}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={label}>persistentDisposition (tuỳ chọn)</label>
                                    <p className="mb-2 text-[12.5px] text-gray-500">Trạng thái giữ nguyên cho các sự kiện sau. Chỉ hiện giá trị hỗ trợ persistent.</p>
                                    <select className={`${inp} !w-72`} value={cfg.persistentDisposition} onChange={(e) => up({ persistentDisposition: e.target.value })}>
                                        <option value="">— Không đặt —</option>
                                        {DISPOSITIONS.filter((d) => d.persistent).map((d) => <option key={d.code} value={d.code}>Set persistent: {d.code}</option>)}
                                    </select>
                                </div>
                            </div>
                        );
                    })()}

                    {step === 5 && (
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                {et === "ET-04" ? <Tag cls={T.err}>Bắt buộc</Tag> : <Tag cls={T.mute}>Tuỳ chọn</Tag>}
                                <span className="text-[12.5px] text-gray-500">{et === "ET-04" ? "TransactionEvent yêu cầu chọn ≥1 loại giao dịch." : "Có thể bỏ qua, hoặc chọn nếu muốn bắt buộc gắn chứng từ."}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                                {BIZ_TX_TYPES.map((b) => {
                                    const on = cfg.bizTxTypes.includes(b.code);
                                    return (
                                        <label key={b.code} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 ${on ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"}`}>
                                            <input type="checkbox" className="accent-brand-600" checked={on}
                                                onChange={() => up({ bizTxTypes: on ? cfg.bizTxTypes.filter((x) => x !== b.code) : [...cfg.bizTxTypes, b.code] })} />
                                            <span><span className="font-mono text-[13px]">{b.code}</span> <span className="text-[12.5px] text-gray-500">— {b.name}</span></span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {step === 6 && et && <KdeLayer et={et} cfg={cfg} up={up} parent={parent} />}

                    {step === 7 && <ExtraLayer cfg={cfg} up={up} />}

                    {err && <p className="mt-3 flex items-center gap-1.5 text-[13px] text-red-600"><AlertTriangle size={14} /> {err}</p>}

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                        <button className={btn} onClick={goBack} disabled={step === 1}>Quay lại</button>
                        {step < 7 ? <button className={btnP} onClick={goNext}>Tiếp tục</button> : <button className={btnP} onClick={save}>Lưu nháp</button>}
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

/* ---------- Lớp 6: KDE + ilmd ---------- */
function KdeLayer({ et, cfg, up, parent }: { et: EtCode; cfg: CteConfig; up: (p: Partial<CteConfig>) => void; parent?: CteConfig }) {
    const auto = autoKdes(et);
    const allowed = useMemo(() => EVENT_KDES.filter((k) => k.allow.includes(et)), [et]);
    const forbidden = EVENT_KDES.filter((k) => !k.allow.includes(et)).map((k) => k.code);
    const parentReq = (code: string) => !!parent?.kdes.find((x) => x.code === code && x.required);
    const ilmdOk = ilmdAllowed(et, cfg.action);

    const toggle = (list: "kdes" | "ilmd", code: string) => {
        const arr = cfg[list];
        up({ [list]: arr.some((x) => x.code === code) ? arr.filter((x) => x.code !== code) : [...arr, { code, required: false, note: "" }] });
    };
    const patch = (list: "kdes" | "ilmd", code: string, p: Partial<KdeCfg>) =>
        up({ [list]: cfg[list].map((x) => (x.code === code ? { ...x, ...p } : x)) });

    const row = (list: "kdes" | "ilmd", code: string, name: string) => {
        const sel = cfg[list].find((x) => x.code === code);
        const isAuto = list === "kdes" && auto.includes(code);
        const lockedReq = isAuto || parentReq(code);
        return (
            <div key={code} className={`rounded-xl border px-3 py-2 ${isAuto ? "border-yellow-200 bg-yellow-50/60" : sel ? "border-brand-200" : "border-gray-200 dark:border-gray-700"}`}>
                <div className="flex flex-wrap items-center gap-2.5">
                    <input type="checkbox" className="accent-brand-600" checked={!!sel} disabled={lockedReq} onChange={() => toggle(list, code)} />
                    <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-medium">{name}</div>
                        <div className="font-mono text-[12px] text-gray-400">{code}</div>
                    </div>
                    {isAuto && <Tag cls={T.gs1}><Lock size={11} /> Auto-required</Tag>}
                    {!isAuto && parentReq(code) && <Tag cls={T.info}>Required theo CTE cấp Bộ</Tag>}
                    {sel && !lockedReq && (
                        <Seg xs value={sel.required ? "r" : "o"} options={[["o", "Tuỳ chọn"], ["r", "Bắt buộc"]]} onChange={(v) => patch(list, code, { required: v === "r" })} />
                    )}
                </div>
                {sel && (
                    <input className="mt-1.5 w-full rounded-md border border-dashed border-transparent bg-transparent px-1.5 py-0.5 text-[12.5px] text-gray-600 hover:border-gray-200 focus:border-brand-400 focus:bg-white focus:outline-none"
                        placeholder="+ Ghi chú hướng dẫn cho doanh nghiệp (hiển thị tooltip ở C3)" value={sel.note} onChange={(e) => patch(list, code, { note: e.target.value })} />
                )}
            </div>
        );
    };

    const ordered = [...allowed].sort((a, b) => (auto.includes(b.code) ? 1 : 0) - (auto.includes(a.code) ? 1 : 0));
    return (
        <div className="flex flex-col gap-5">
            <div>
                <h3 className="mb-1 text-[14px] font-semibold">KDE của sự kiện</h3>
                <p className="mb-2 text-[12.5px] text-gray-500">Danh sách lọc theo {et}. Không hiển thị KDE không tương thích: <span className="font-mono">{forbidden.join(", ") || "—"}</span>.</p>
                <div className="flex flex-col gap-1.5">{ordered.map((k) => row("kdes", k.code, k.name))}</div>
            </div>
            <div>
                <h3 className="mb-1 text-[14px] font-semibold">ilmd — thông tin cấp lô</h3>
                {ilmdOk ? (
                    <>
                        <p className="mb-2 text-[12.5px] text-gray-500">{et === "ET-03" ? "ilmd cho output products." : "Áp dụng vì ObjectEvent + action ADD."}</p>
                        <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">{ILMD_FIELDS.map((f) => row("ilmd", f.code, f.name))}</div>
                    </>
                ) : (
                    <Banner kind="info">ilmd chỉ dùng khi ET-01 với action = ADD, hoặc ET-03.{cfg.action ? ` Action hiện tại: ${cfg.action}.` : ""}</Banner>
                )}
            </div>
        </div>
    );
}

/* ---------- Lớp 7: sensor, certification, trigger ---------- */
function ExtraLayer({ cfg, up }: { cfg: CteConfig; up: (p: Partial<CteConfig>) => void }) {
    const hasSensor = cfg.kdes.some((k) => k.code === "sensorElementList");
    const hasCert = cfg.kdes.some((k) => k.code === "certificationInfo");
    const s = cfg.sensor ?? { type: "temperature", min: "", max: "", uom: "CEL" };
    return (
        <div className="flex flex-col gap-5">
            <p className="text-[12.5px] text-gray-500">Lớp tuỳ chọn — có thể để trống và lưu nháp.</p>
            <div>
                <h3 className="mb-2 text-[14px] font-semibold">Ngưỡng cảm biến</h3>
                {hasSensor ? (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <div><label className={label}>Loại</label>
                            <select className={inp} value={s.type} onChange={(e) => up({ sensor: { ...s, type: e.target.value, uom: SENSOR_TYPES.find((x) => x.code === e.target.value)!.uom } })}>
                                {SENSOR_TYPES.map((t) => <option key={t.code} value={t.code}>{t.name}</option>)}
                            </select></div>
                        <div><label className={label}>Min</label><input className={inp} value={s.min} onChange={(e) => up({ sensor: { ...s, min: e.target.value } })} /></div>
                        <div><label className={label}>Max</label><input className={inp} value={s.max} onChange={(e) => up({ sensor: { ...s, max: e.target.value } })} /></div>
                        <div><label className={label}>Đơn vị</label><input className={`${inp} font-mono`} value={s.uom} disabled /></div>
                        <p className="col-span-full text-[12.5px] text-gray-500">Rule: vượt ngưỡng → ALARM_CONDITION.</p>
                    </div>
                ) : <p className="text-[13px] text-gray-400">Chọn KDE <span className="font-mono">sensorElementList</span> ở lớp 6 để cấu hình.</p>}
            </div>
            <div>
                <h3 className="mb-2 text-[14px] font-semibold">Chứng nhận</h3>
                {hasCert ? (
                    <div className="flex flex-col gap-1.5">
                        {CERT_TYPES.map((n) => {
                            const c = cfg.certs.find((x) => x.name === n);
                            return (
                                <div key={n} className="flex items-center gap-2.5 rounded-xl border border-gray-200 px-3 py-2 dark:border-gray-700">
                                    <input type="checkbox" className="accent-brand-600" checked={!!c}
                                        onChange={() => up({ certs: c ? cfg.certs.filter((x) => x.name !== n) : [...cfg.certs, { name: n, required: false }] })} />
                                    <span className="flex-1 text-[13.5px]">{n}</span>
                                    {c && <Seg xs value={c.required ? "r" : "o"} options={[["o", "Tuỳ chọn"], ["r", "Bắt buộc"]]}
                                        onChange={(v) => up({ certs: cfg.certs.map((x) => (x.name === n ? { ...x, required: v === "r" } : x)) })} />}
                                </div>
                            );
                        })}
                    </div>
                ) : <p className="text-[13px] text-gray-400">Chọn KDE <span className="font-mono">certificationInfo</span> ở lớp 6 để cấu hình.</p>}
            </div>
            <div>
                <label className={label} htmlFor="trg">Khi nào dùng (trigger)</label>
                <textarea id="trg" rows={2} className={inp} value={cfg.trigger} onChange={(e) => up({ trigger: e.target.value })} placeholder="VD: Áp dụng khi lô hàng thủy sản tươi rời kho." />
            </div>
        </div>
    );
}
