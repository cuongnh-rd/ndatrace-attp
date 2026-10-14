"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Lock, AlertTriangle } from "lucide-react";
import DispositionLayer from "./DispositionLayer";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Banner, Dialog, IssueList, NoteSlot, Seg, Tag, T, btn, btnP, card, inp, label } from "@/components/txng/ui";
import {
    ACTIONS, BIZ_STEPS, BIZ_TX_TYPES, CERT_TYPES, EVENT_KDES, EVENT_TYPES, ILMD_FIELDS, LAYER_NAMES, SENSOR_TYPES,
    type Action, type EtCode, actLabel, bizLabel, etLabel, etOf, fieldLabel, ilmdAllowed, suggestAction, txLabel,
} from "@/lib/txng/catalog";
import {
    type Cte, type CteConfig, type KdeCfg, autoKdes, clone, ctes, derivedFromBizStep, emptyConfig, ME_USER, myOrg, nextCteCode, nextCteId,
    patch, session, TODAY, validateCte, vDraft,
} from "@/lib/txng/cte";

const LAYERS = LAYER_NAMES;

/** Đồng bộ KDE tự động bắt buộc theo ET + action (AC-17: ET-02 OBSERVE → parentID chuyển optional) */
function syncAuto(et: EtCode, c: CteConfig): CteConfig {
    const auto = autoKdes(et, c.action);
    const prevAuto = autoKdes(et, null);
    const rest = c.kdes.filter((x) => !auto.includes(x.code)).map((x) => (prevAuto.includes(x.code) && !auto.includes(x.code) ? { ...x, required: false } : x));
    return { ...c, kdes: [...auto.map((code) => ({ code, required: true, note: c.kdes.find((x) => x.code === code)?.note ?? "" })), ...rest] };
}

export default function CteWizard({ cte }: { cte?: Cte }) {
    const router = useRouter();
    const draft = cte ? vDraft(cte) : undefined;
    const editing = !!cte;
    const parent = cte?.parentConfig;

    const [name, setName] = useState(cte?.name ?? "");
    const [code] = useState(cte?.code ?? nextCteCode());
    const [et, setEt] = useState<EtCode | null>(cte?.et ?? null);
    const [cfg, setCfg] = useState<CteConfig>(() => (draft ? clone(draft.config) : emptyConfig()));
    const [step, setStep] = useState(editing ? 2 : 1);
    const [reached, setReached] = useState(editing ? 7 : 1);
    const [err, setErr] = useState("");
    const [saveIssues, setSaveIssues] = useState<string[]>([]);
    const [warnStep, setWarnStep] = useState("");
    const [pendingBiz, setPendingBiz] = useState<string | null>(null);

    const etLocked = editing || reached > 1;
    const skipL3 = et === "ET-03";
    const up = (p: Partial<CteConfig>) => setCfg((c) => ({ ...c, ...p }));
    const auto = et ? autoKdes(et, cfg.action) : [];

    /** Kiểm tra lớp hiện tại trước khi sang lớp sau */
    const layerError = (n: number): string => {
        if (n === 1 && !et) return "Chọn loại sự kiện.";
        if (n === 2 && !cfg.bizStep) return "Chọn công đoạn nghiệp vụ.";
        if (n === 3 && !skipL3 && !cfg.action) return "Chưa chọn tác động lên đối tượng.";
        if (n === 4 && cfg.legacyDisposition !== undefined) return "Disposition đang ở cấu trúc cũ — rà soát lại danh sách.";
        if (n === 5 && et === "ET-04" && !cfg.bizTxTypes.length) return "TransactionEvent yêu cầu chọn ≥1 loại giao dịch.";
        if (n === 6 && !cfg.kdes.some((x) => !auto.includes(x.code))) return "Cần chọn ít nhất 1 KDE ngoài các trường tự động bắt buộc.";
        return "";
    };

    const goNext = () => {
        const e = layerError(step);
        if (e) return setErr(e);
        setErr("");
        if (step === 1 && et) setCfg((c) => syncAuto(et, { ...c, action: et === "ET-03" ? null : c.action }));
        let n = step + 1;
        if (n === 3 && skipL3) n = 4;
        setStep(n);
        setReached((r) => Math.max(r, n >= 3 ? 7 : n));
    };
    const goBack = () => {
        setErr("");
        let n = step - 1;
        if (n === 3 && skipL3) n = 2;
        setStep(Math.max(1, n));
    };

    /** BR-M5-14: chọn bizStep → tính action + preselect disposition. Đã cấu hình lớp 3–4 thì hỏi xác nhận. */
    const applyBizStep = (b: string) => {
        if (!et) return;
        const fit = BIZ_STEPS.find((x) => x.code === b)?.fit[et];
        setWarnStep(fit === "warn" ? `Công đoạn ${bizLabel(b)} ít dùng với loại sự kiện ${etLabel(et)}. Bạn có chắc?` : "");
        setCfg((c) => syncAuto(et, { ...c, bizStep: b, ...derivedFromBizStep(et, b), action: et === "ET-03" ? null : derivedFromBizStep(et, b).action }));
        setPendingBiz(null);
    };
    const pickBizStep = (b: string) => {
        if (!et || b === cfg.bizStep) return;
        if (cfg.bizStep && reached > 2) return setPendingBiz(b);
        applyBizStep(b);
    };
    const setAction = (a: Action) => {
        if (!et) return;
        const rec = suggestAction(et, cfg.bizStep);
        setCfg((c) => syncAuto(et, { ...c, action: a, actionManual: !rec.includes(a), ilmd: ilmdAllowed(et, a) ? c.ilmd : [] }));
    };

    const save = () => {
        for (let i = 1; i <= 6; i++) {
            const e = layerError(i);
            if (e) {
                setSaveIssues([`${LAYERS[i - 1]} — ${e}`]);
                setStep(i);
                return;
            }
        }
        if (!name.trim()) return setSaveIssues(["Nhập tên sự kiện trọng yếu."]);
        const issues = parent ? validateCte({ et: et!, parentConfig: parent }, cfg).filter((x) => x.level === "error" && x.inherit) : [];
        if (issues.length) return setSaveIssues(issues.map((x) => x.msg));
        if (editing && draft) {
            patch(cte!, { name: name.trim(), migrated: false });
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
        if (n === 3 && skipL3 && reached > 1) return "skip";
        if (n === step) return "cur";
        if (n <= reached) return layerError(n) ? "todo" : "done";
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
                    <p className="text-[13px] text-gray-500">Cấu hình tuần tự từng bước. Bước sau chỉ mở khi bước trước hoàn thành.</p>
                </div>
                <Link href={editing ? `/danh-muc/su-kien-trong-yeu/${cte!.id}` : "/danh-muc/su-kien-trong-yeu"} className={btn}>Huỷ</Link>
                <button className={btnP} onClick={save}>Lưu nháp</button>
            </div>

            {parent && (
                <Banner kind="info">
                    CTE kế thừa từ cấp Bộ: không đổi được ET, bizStep, action; không hạ KDE bắt buộc thành tuỳ chọn; không bỏ disposition persistent và chỉ được thu hẹp danh sách disposition thường. Cấp Sở chỉ được thêm yêu cầu chặt hơn (KDE bắt buộc, ngưỡng cảm biến, chứng nhận).
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
                                        {l}
                                        {s === "skip" && <span className="block text-[11.5px] font-normal text-gray-400">Bỏ qua — ET-03 không có action</span>}
                                        {n === 3 && s === "done" && cfg.actionManual && <span className="block text-[11.5px] font-normal text-amber-600">Đã sửa tay</span>}
                                        {s === "todo" && <span className="block text-[11.5px] font-normal text-red-500">Chưa hoàn thành</span>}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>

                <section className={`${card} p-5`}>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2"><h2 className="text-[16px] font-semibold text-gray-900 dark:text-white">{LAYERS[step - 1]}</h2>{step === 5 && (et === "ET-04" ? <Tag cls={T.err}>Bắt buộc</Tag> : <Tag cls={T.mute}>Tuỳ chọn</Tag>)}</div>
                        {et && step > 1 && <Tag cls={T.info}>{etLabel(et)}</Tag>}
                    </div>

                    {step === 1 && (
                        <div className="flex flex-col gap-2">
                            {EVENT_TYPES.filter((e) => e.active).map((e) => (
                                <label key={e.code} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 ${et === e.code ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"} ${etLocked ? "cursor-not-allowed opacity-70" : ""}`}>
                                    <input type="radio" name="et" className="mt-1 accent-brand-600" checked={et === e.code} disabled={etLocked} onChange={() => setEt(e.code)} />
                                    <div>
                                        <div className="font-semibold">{etLabel(e.code)}</div>
                                        <div className="text-[12.5px] text-gray-500">{e.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}

                    {step === 2 && et && (
                        <div>
                            <p className="mb-2 mt-2 text-[13px] text-gray-500">Danh sách công đoạn phù hợp với {etOf(et).name}: ✅ khuyến nghị, ⚠️ ít dùng (vẫn cho chọn).</p>
                            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                                {BIZ_STEPS.filter((b) => b.fit[et]).sort((a, b) => (a.fit[et] === "ok" ? 0 : 1) - (b.fit[et] === "ok" ? 0 : 1)).map((b) => (
                                    <label key={b.code} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 ${cfg.bizStep === b.code ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"} ${parent ? "cursor-not-allowed opacity-70" : ""}`}>
                                        <input type="radio" name="bs" className="accent-brand-600" checked={cfg.bizStep === b.code} disabled={!!parent} onChange={() => pickBizStep(b.code)} />
                                        <span className="flex-1 text-[13.5px]">{bizLabel(b.code)}</span>
                                        {b.fit[et] === "warn" ? <Tag cls={T.warn}><AlertTriangle size={11} /> ít dùng</Tag> : null}
                                    </label>
                                ))}
                            </div>
                            {warnStep && <Banner kind="warn">{warnStep}</Banner>}
                        </div>
                    )}

                    {step === 3 && et && (() => {
                        const rec = suggestAction(et, cfg.bizStep);
                        return (
                            <div className="flex flex-col gap-2">
                                <p className="text-[13px] text-gray-500">
                                    Tự điền theo công đoạn {bizLabel(cfg.bizStep)} và loại sự kiện {etLabel(et)}.
                                    {rec.length > 1 && <> Giá trị hợp lệ khác: {rec.slice(1).map(actLabel).join(", ")}.</>}
                                </p>
                                {ACTIONS.map((a) => (
                                    <label key={a.code} title={a.desc} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 ${cfg.action === a.code ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"} ${parent ? "cursor-not-allowed opacity-70" : ""}`}>
                                        <input type="radio" name="act" className="mt-1 accent-brand-600" checked={cfg.action === a.code} disabled={!!parent} onChange={() => setAction(a.code)} />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{actLabel(a.code)}</span>
                                                {rec[0] === a.code && <Tag cls={T.ok}>Khuyến nghị theo công đoạn {bizLabel(cfg.bizStep)}</Tag>}
                                                {rec[0] !== a.code && rec.includes(a.code) && <Tag cls={T.mute}>Hợp lệ</Tag>}
                                            </div>
                                            <div className="text-[12.5px] text-gray-500">{a.desc}</div>
                                        </div>
                                    </label>
                                ))}
                                {cfg.action && !rec.includes(cfg.action) && (
                                    <Banner kind="info" action={<button className={`${btn} !px-2.5 !py-1 !text-[12px]`} onClick={() => setAction(rec[0])}>Dùng giá trị khuyến nghị</button>}>
                                        {actLabel(cfg.action)} ít dùng với công đoạn {bizLabel(cfg.bizStep)}. Khuyến nghị: {rec.map(actLabel).join(" / ")}.
                                    </Banner>
                                )}
                            </div>
                        );
                    })()}

                    {step === 4 && et && <DispositionLayer et={et} cfg={cfg} up={up} parent={parent} />}

                    {step === 5 && (
                        <div>
                            <p className="mb-2 text-[12.5px] text-gray-500">{et === "ET-04" ? "Chọn ít nhất 1 chứng từ liên quan." : "Có thể bỏ qua, hoặc chọn nếu muốn bắt buộc gắn chứng từ."}</p>
                            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                                {BIZ_TX_TYPES.map((b) => {
                                    const on = cfg.bizTxTypes.includes(b.code);
                                    return (
                                        <label key={b.code} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 ${on ? "border-brand-500 bg-brand-50/50" : "border-gray-200 dark:border-gray-700"}`}>
                                            <input type="checkbox" className="accent-brand-600" checked={on}
                                                onChange={() => up({ bizTxTypes: on ? cfg.bizTxTypes.filter((x) => x !== b.code) : [...cfg.bizTxTypes, b.code] })} />
                                            <span className="text-[13.5px]">{txLabel(b.code)}</span>
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
            <Dialog open={!!pendingBiz} onClose={() => setPendingBiz(null)} title="Đổi bizStep"
                footer={<><button className={btn} onClick={() => setPendingBiz(null)}>Huỷ — giữ {cfg.bizStep}</button><button className={btnP} onClick={() => applyBizStep(pendingBiz!)}>Xác nhận đổi</button></>}>
                Đổi công đoạn nghiệp vụ sang <b>{pendingBiz && bizLabel(pendingBiz)}</b> sẽ tính lại tác động lên đối tượng (action) và trạng thái sản phẩm (disposition). Cấu hình hiện tại của 2 bước này sẽ bị thay thế.
            </Dialog>
        </DashboardLayout>
    );
}

/* ---------- Lớp 6: KDE + ilmd ---------- */
function KdeLayer({ et, cfg, up, parent }: { et: EtCode; cfg: CteConfig; up: (p: Partial<CteConfig>) => void; parent?: CteConfig }) {
    const auto = autoKdes(et, cfg.action);
    const allowed = useMemo(() => EVENT_KDES.filter((k) => k.allow.includes(et)), [et]);
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
            <div key={code} className={`grid grid-cols-[16px_1fr_auto] items-center gap-2.5 rounded-xl border px-3 py-2 ${isAuto ? "border-yellow-200 bg-yellow-50/60" : sel ? "border-brand-200" : "border-gray-200 dark:border-gray-700"}`}>
                <input type="checkbox" className="accent-brand-600" checked={!!sel} disabled={lockedReq} onChange={() => toggle(list, code)} />
                <div className="min-w-0 text-[13.5px] font-medium">{name} <span className="font-normal text-gray-400">({code})</span></div>
                {sel ? (
                    <NoteSlot value={sel.note} editable onChange={(v) => patch(list, code, { note: v })} actions={<>
                        {isAuto && <Tag cls={T.gs1}><Lock size={11} /> Bắt buộc</Tag>}
                        {!isAuto && parentReq(code) && <Tag cls={T.info}>Bắt buộc theo sự kiện cấp Bộ</Tag>}
                        {!lockedReq && <Seg xs value={sel.required ? "r" : "o"} options={[["o", "Tuỳ chọn"], ["r", "Bắt buộc"]]} onChange={(v) => patch(list, code, { required: v === "r" })} />}
                    </>} />
                ) : <span />}
            </div>
        );
    };

    const ordered = [...allowed].sort((a, b) => (auto.includes(b.code) ? 1 : 0) - (auto.includes(a.code) ? 1 : 0));
    return (
        <div className="flex flex-col gap-5">
            <div>
                <h3 className="mb-1 text-[14px] font-semibold">Trường thông tin của sự kiện</h3>
                <p className="mb-2 text-[12.5px] text-gray-500">Danh sách trường thông tin tương thích với {etOf(et).name}.</p>
                <div className="flex flex-col gap-1.5">{ordered.map((k) => row("kdes", k.code, k.name))}</div>
            </div>
            <div>
                <h3 className="mb-1 text-[14px] font-semibold">Thông tin lô/mẻ (ILMD)</h3>
                {ilmdOk ? (
                    <>
                        <p className="mb-2 text-[12.5px] text-gray-500">{et === "ET-03" ? "Áp dụng cho thành phẩm đầu ra." : "Áp dụng khi tạo mới đối tượng."}</p>
                        <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">{ILMD_FIELDS.map((f) => row("ilmd", f.code, f.name))}</div>
                    </>
                ) : (
                    <Banner kind="info">Thông tin lô/mẻ chỉ khai báo khi tạo mới đối tượng ({actLabel("ADD")}) hoặc khi chuyển đổi, chế biến.</Banner>
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
            <p className="text-[12.5px] text-gray-500">Bước tuỳ chọn — có thể để trống và lưu nháp.</p>
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
                ) : <p className="text-[13px] text-gray-400">Chọn trường {fieldLabel("sensorElementList")} ở bước Dữ liệu sự kiện để cấu hình.</p>}
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
                ) : <p className="text-[13px] text-gray-400">Chọn trường {fieldLabel("certificationInfo")} ở bước Dữ liệu sự kiện để cấu hình.</p>}
            </div>
            <div>
                <label className={label} htmlFor="trg">Khi nào dùng (trigger)</label>
                <textarea id="trg" rows={2} className={inp} value={cfg.trigger} onChange={(e) => up({ trigger: e.target.value })} placeholder="VD: Áp dụng khi lô hàng thủy sản tươi rời kho." />
            </div>
        </div>
    );
}
