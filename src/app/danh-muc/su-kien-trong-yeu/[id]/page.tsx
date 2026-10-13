"use client";

import { use, useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Lock } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Banner, Dialog, IssueList, Tag, T, btn, btnD, btnP, btnSm, card, inp, label, useToast } from "@/components/txng/ui";
import { BIZ_TX_TYPES, SENSOR_TYPES, bizStepOf, etOf, fieldName, suggestAction } from "@/lib/txng/catalog";
import {
    STATUS_META, TODAY, applyScheduled, canEdit, cancelScheduled, cloneCte, cteById, ctes, fmtDate, newVersion,
    autoFixPersist, groupLabel, publishVersion, vActive, vDraft, vMain, vScheduled, validateCte, type Cte, type CteVersion,
} from "@/lib/txng/cte";
import { procsUsingCte, pMain, PROC_STATUS } from "@/lib/txng/process";

type Tab = "cfg" | "hist" | "use";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const cte = cteById(id);
    if (!cte) {
        return (
            <DashboardLayout>
                <Banner kind="warn">Không tìm thấy sự kiện trọng yếu. <Link className="underline" href="/danh-muc/su-kien-trong-yeu">Quay lại danh sách</Link></Banner>
            </DashboardLayout>
        );
    }
    return <Detail key={id} cte={cte} />;
}

function Detail({ cte }: { cte: Cte }) {
    const router = useRouter();
    const toast = useToast();
    const [, bump] = useReducer((x: number) => x + 1, 0);
    const [vi, setVi] = useState(() => cte.versions.indexOf(vMain(cte)));
    const [tab, setTab] = useState<Tab>("cfg");
    const [dlg, setDlg] = useState<null | "publish" | "del" | "cancel" | "newver" | "sim">(null);
    const [date, setDate] = useState("");
    const [dateErr, setDateErr] = useState("");

    const v = cte.versions[vi] ?? vMain(cte);
    const mine = canEdit(cte);
    const act = vActive(cte), sch = vScheduled(cte), dr = vDraft(cte);
    const issues = v.status === "draft" ? validateCte(cte, v.config) : [];
    const users = procsUsingCte(cte.id);
    const close = () => { setDlg(null); setDateErr(""); };
    const sel = (x: CteVersion) => setVi(cte.versions.indexOf(x));

    const doPublish = () => {
        if (act) {
            if (!date) return setDateErr("CTE đã có version đang áp dụng. Vui lòng chọn ngày áp dụng cho version mới.");
            if (date <= TODAY) return setDateErr("Ngày áp dụng phải là ngày tương lai.");
        }
        const hadSch = sch;
        publishVersion(cte, v, date);
        close();
        toast.show(act ? `Đã công bố v${v.v} — Chờ áp dụng từ ${fmtDate(date)}.${hadSch ? ` v${hadSch.v} đã bị huỷ.` : ""} Đã thông báo C3.` : `Đã công bố v${v.v} — Đang áp dụng.`);
        bump();
    };

    const actions = () => {
        if (!mine) return <button className={btn} onClick={() => router.push(`/danh-muc/su-kien-trong-yeu/${cloneCte(cte).id}/sua`)}><Copy size={14} /> Clone</button>;
        const clone = <button className={btn} onClick={() => router.push(`/danh-muc/su-kien-trong-yeu/${cloneCte(cte).id}/sua`)}><Copy size={14} /> Clone</button>;
        if (v.status === "draft")
            return (<>
                <button className={btnD} onClick={() => setDlg("del")}>{v.v === 1 ? "Xoá" : "Xoá bản nháp"}</button>
                <Link className={btn} href={`/danh-muc/su-kien-trong-yeu/${cte.id}/sua`}>Sửa</Link>
                <button className={btnP} onClick={() => { setDate(""); setDlg("publish"); }}>Công bố</button>
            </>);
        if (v.status === "scheduled")
            return (<>
                <button className={btn} onClick={() => setDlg("sim")} title="Chỉ có trong prototype">Mô phỏng tới ngày áp dụng</button>
                <button className={btnD} onClick={() => setDlg("cancel")}>Huỷ áp dụng</button>
            </>);
        if (v.status === "active")
            return (<>{clone}<button className={btnP} onClick={() => setDlg("newver")}>Tạo phiên bản mới</button></>);
        return clone;
    };

    return (
        <DashboardLayout>
            <div className="mb-4 flex items-center gap-3">
                <Link href="/danh-muc/su-kien-trong-yeu" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <ArrowLeft size={16} className="text-gray-600" />
                </Link>
                <span className="text-[13px] text-gray-500">Sự kiện trọng yếu / <b className="text-gray-800 dark:text-gray-200">{cte.name}</b></span>
            </div>

            <div className={`${card} mb-4 px-5 py-4`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{cte.name}</h1>
                            <Tag cls={STATUS_META[v.status].cls}>{STATUS_META[v.status].label}</Tag>
                            {!mine && <Tag cls={T.info}>Chỉ xem</Tag>}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-gray-500">
                            <span>Mã <b className="font-mono text-gray-800 dark:text-gray-200">{cte.code}</b></span>
                            <span>Event Type <b className="text-gray-800 dark:text-gray-200">{cte.et} · {etOf(cte.et).epcis}</b></span>
                            <span>Cấp <b className="text-gray-800 dark:text-gray-200">{cte.level} — {cte.org}</b></span>
                            {cte.cloneSourceId && <span>Clone từ <Link className="font-medium text-brand-700 underline" href={`/danh-muc/su-kien-trong-yeu/${cte.cloneSourceId}`}>{cteById(cte.cloneSourceId)?.name ?? cte.cloneSourceId}</Link></span>}
                            <span className="flex items-center gap-1.5">Phiên bản
                                <select className={`${inp} !w-auto !py-0.5 text-[13px]`} value={vi} onChange={(e) => setVi(+e.target.value)}>
                                    {cte.versions.map((x, i) => <option key={x.v} value={i}>v{x.v} · {STATUS_META[x.status].label}</option>)}
                                </select>
                            </span>
                            <span>Hiệu lực <b className="text-gray-800 dark:text-gray-200">{v.effectiveFrom ? fmtDate(v.effectiveFrom) : "—"}{v.effectiveTo ? ` → ${fmtDate(v.effectiveTo)}` : ""}</b></span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">{actions()}</div>
                </div>

                {v.status === "scheduled" && <Banner kind="info">Phiên bản {v.v} sẽ tự động áp dụng ngày <b>{fmtDate(v.effectiveFrom)}</b>{act ? ` và thay thế v${act.v}` : ""}. Trên C1 hiển thị cả 2 phiên bản để C3 kịp cập nhật.</Banner>}
                {v.status === "draft" && act && <Banner kind="info">Đang soạn v{v.v}. Phiên bản {act.v} vẫn đang áp dụng cho tới khi v{v.v} tới ngày áp dụng.</Banner>}
                {v.status === "active" && sch && <Banner kind="info">v{sch.v} đang chờ áp dụng từ {fmtDate(sch.effectiveFrom)}. <button className="font-semibold underline" onClick={() => sel(sch)}>Xem v{sch.v}</button></Banner>}
                {v.status === "superseded" && (
                    <Banner kind="info">
                        {v.cancelled ? `Phiên bản này đã bị huỷ trước khi áp dụng (${fmtDate(v.effectiveTo)}).` : `Phiên bản này đã ngừng áp dụng từ ${fmtDate(v.effectiveTo)}.`}
                        {v.replacedBy && ` Thay thế bởi v${v.replacedBy}.`} Chỉ xem.
                    </Banner>
                )}
                {v.status === "draft" && issues.length > 0 && (
                    <div className="mt-3">
                        <p className="mb-1.5 text-[13px] font-semibold text-gray-700">Kiểm tra trước khi công bố</p>
                        <IssueList items={issues.map((x) => ({ level: x.level, msg: x.msg, action: x.fix && mine && <button className="whitespace-nowrap text-[12.5px] font-semibold underline" onClick={() => { autoFixPersist(cte, v); bump(); }}>Bổ sung tự động</button> }))} />
                    </div>
                )}
            </div>

            <div className="mb-4 flex gap-1 border-b border-gray-200 dark:border-gray-800">
                {([["cfg", "Cấu hình 7 lớp"], ["hist", "Lịch sử phiên bản"], ["use", `Quy trình sử dụng (${users.length})`]] as [Tab, string][]).map(([k, l]) => (
                    <button key={k} onClick={() => setTab(k)} className={`-mb-px border-b-2 px-3.5 py-2.5 text-[13.5px] font-medium ${tab === k ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500"}`}>{l}</button>
                ))}
            </div>

            {tab === "cfg" && <ConfigView cte={cte} v={v} />}
            {tab === "hist" && (
                <div className={`${card} overflow-x-auto`}>
                    <table className="w-full text-[13.5px]">
                        <thead><tr className="border-b border-gray-100 bg-gray-50/60 text-left text-[12.5px] font-semibold text-gray-500 dark:border-gray-800"><th className="px-4 py-2.5">Phiên bản</th><th className="px-4 py-2.5">Trạng thái</th><th className="px-4 py-2.5">Ngày áp dụng</th><th className="px-4 py-2.5">Ngày ngừng</th><th className="px-4 py-2.5">Ghi chú</th><th className="px-4 py-2.5">Người tạo</th><th /></tr></thead>
                        <tbody>
                            {[...cte.versions].reverse().map((x) => (
                                <tr key={x.v} className="border-b border-gray-50 last:border-0 dark:border-gray-800">
                                    <td className="px-4 py-3 font-semibold">v{x.v}</td>
                                    <td className="px-4 py-3"><Tag cls={STATUS_META[x.status].cls}>{STATUS_META[x.status].label}</Tag></td>
                                    <td className="px-4 py-3">{fmtDate(x.effectiveFrom)}</td>
                                    <td className="px-4 py-3">{fmtDate(x.effectiveTo)}</td>
                                    <td className="px-4 py-3 text-gray-500">{x.status === "superseded" ? `${x.cancelled ? "Huỷ trước khi áp dụng" : "Ngừng áp dụng"}${x.replacedBy ? ` — thay thế bởi v${x.replacedBy}` : ""}` : "—"}</td>
                                    <td className="px-4 py-3 text-gray-500">{x.createdBy}</td>
                                    <td className="px-4 py-3"><button className={`${btn} ${btnSm}`} onClick={() => { sel(x); setTab("cfg"); }}>Xem</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {tab === "use" && (
                <div className={`${card} p-5`}>
                    <p className="mb-3 text-[13px] text-gray-500">Quy trình tiêu chuẩn TXNG đang sử dụng sự kiện này.</p>
                    {users.length ? (
                        <ul className="flex flex-col gap-2">
                            {users.map((p) => {
                                const m = pMain(p);
                                const vers = [...new Set(p.versions.filter((x) => x.status !== "super").flatMap((x) => x.steps.filter((s) => s.cteId === cte.id).map((s) => `v${s.cteVer}`)))];
                                return (
                                    <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3.5 py-2.5 dark:border-gray-700">
                                        <div>
                                            <Link className="font-semibold text-brand-700 hover:underline" href={`/danh-muc/quy-trinh-tieu-chuan/${p.id}`}>{p.name}</Link>
                                            <div className="text-[12.5px] text-gray-500">Đang dùng CTE {vers.join(", ")}</div>
                                        </div>
                                        <Tag cls={PROC_STATUS[m.status].cls}>{PROC_STATUS[m.status].label} (v{m.v})</Tag>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : <p className="text-[13px] text-gray-400">Chưa có quy trình nào sử dụng.</p>}
                </div>
            )}

            {/* Công bố */}
            <Dialog open={dlg === "publish"} onClose={close} title={`Công bố v${v.v} — ${cte.name}`}
                sub={act ? `Version ${act.v} đang được áp dụng. Chọn ngày version ${v.v} có hiệu lực để các bên kịp cập nhật.` : "CTE chưa có version áp dụng — công bố sẽ áp dụng ngay."}
                footer={<><button className={btn} onClick={close}>Huỷ</button>{!issues.some((x) => x.level === "error") && <button className={btnP} onClick={doPublish}>{act ? "Xác nhận công bố" : "Công bố và áp dụng ngay"}</button>}</>}>
                {issues.some((x) => x.level === "error") ? (
                    <div className="flex flex-col gap-2">
                        <p className="text-[13px]">Có {issues.filter((x) => x.level === "error").length} lỗi phải sửa trước khi công bố{issues.some((x) => x.level === "warn") ? ` và ${issues.filter((x) => x.level === "warn").length} cảnh báo (không chặn)` : ""}.</p>
                        <IssueList items={issues.map((x) => ({ level: x.level, msg: x.msg, action: x.fix && mine && <button className="whitespace-nowrap text-[12.5px] font-semibold underline" onClick={() => { autoFixPersist(cte, v); bump(); }}>Bổ sung tự động</button> }))} />
                        <Link className={`${btn} self-start`} href={`/danh-muc/su-kien-trong-yeu/${cte.id}/sua`}>Mở để sửa</Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {issues.length > 0 && <IssueList items={issues.map((x) => ({ level: x.level, msg: x.msg }))} />}
                        {act ? (
                            <div>
                                <label className={label} htmlFor="eff">Ngày áp dụng <span className="text-red-500">*</span></label>
                                <input id="eff" type="date" className={`${inp} !w-56`} value={date} min={TODAY} onChange={(e) => { setDate(e.target.value); setDateErr(""); }} />
                                {dateErr && <p className="mt-1 text-[12.5px] text-red-600">{dateErr}</p>}
                                {sch && <Banner kind="warn">v{sch.v} đang chờ áp dụng ({fmtDate(sch.effectiveFrom)}) sẽ bị huỷ (chuyển Ngừng áp dụng) và thay bằng v{v.v}.</Banner>}
                            </div>
                        ) : <p>v{v.v} chuyển sang <b>Đang áp dụng</b> ngay, xuất hiện trên C1 và C3 lấy được.</p>}
                    </div>
                )}
            </Dialog>

            <Dialog open={dlg === "del"} onClose={close} title={v.v === 1 ? "Xoá CTE" : `Xoá bản nháp v${v.v}`}
                footer={<><button className={btn} onClick={close}>Quay lại</button>{!(v.v === 1 && users.length) && <button className={btnD} onClick={() => {
                    if (v.v === 1) { ctes.splice(ctes.indexOf(cte), 1); router.push("/danh-muc/su-kien-trong-yeu"); return; }
                    cte.versions.splice(cte.versions.indexOf(v), 1); setVi(cte.versions.indexOf(vMain(cte))); close(); toast.show("Đã xoá bản nháp");
                }}>Xoá</button>}</>}>
                {v.v === 1 && users.length
                    ? <IssueList items={[{ level: "error", msg: `CTE đang được tham chiếu bởi quy trình ${users.map((p) => `"${p.name}"`).join(", ")}.` }]} />
                    : v.v === 1 ? `CTE "${cte.name}" chưa từng công bố và sẽ bị xoá hẳn. Thao tác được ghi audit log.` : `Bản nháp v${v.v} sẽ bị xoá. Các phiên bản khác không thay đổi.`}
            </Dialog>

            <Dialog open={dlg === "cancel"} onClose={close} title={`Huỷ áp dụng v${v.v}`}
                footer={<><button className={btn} onClick={close}>Quay lại</button><button className={btnD} onClick={() => { cancelScheduled(cte); close(); toast.show(`v${v.v} đã chuyển Ngừng áp dụng.`); bump(); }}>Huỷ áp dụng</button></>}>
                Hành động này không khuyến khích. Bạn có chắc muốn huỷ áp dụng v{v.v}? {act && `v${act.v} vẫn Đang áp dụng.`}
            </Dialog>

            <Dialog open={dlg === "sim"} onClose={close} title="Mô phỏng tới ngày áp dụng" sub="Chỉ có trong prototype — chạy scheduled job"
                footer={<><button className={btn} onClick={close}>Huỷ</button><button className={btnP} onClick={() => { applyScheduled(cte); close(); toast.show(`CTE "${cte.name}" đã cập nhật lên v${v.v}.`); bump(); }}>Chạy</button></>}>
                v{v.v} chuyển Đang áp dụng{act ? `, v${act.v} chuyển Ngừng áp dụng` : ""}. Quy trình đang dùng phiên bản cũ sẽ nhận cảnh báo cập nhật.
            </Dialog>

            <Dialog open={dlg === "newver"} onClose={close} title="Tạo phiên bản mới"
                footer={<><button className={btn} onClick={close}>Huỷ</button>{!dr && <button className={btnP} onClick={() => { newVersion(cte); router.push(`/danh-muc/su-kien-trong-yeu/${cte.id}/sua`); }}>Tạo v{Math.max(...cte.versions.map((x) => x.v)) + 1}</button>}</>}>
                {dr
                    ? <IssueList items={[{ level: "error", msg: <>Đã tồn tại version Nháp (v{dr.v}). Hoàn thành hoặc xoá v{dr.v} trước. <button className="font-semibold underline" onClick={() => { sel(dr); close(); }}>Mở v{dr.v}</button></> }]} />
                    : <>Phiên bản mới ở trạng thái Nháp, sao chép 7 lớp từ v{act?.v}. Event Type giữ nguyên ({cte.et}). v{act?.v} vẫn Đang áp dụng cho tới khi phiên bản mới tới ngày áp dụng.</>}
            </Dialog>

            {toast.node}
        </DashboardLayout>
    );
}

/* ---------- Xem chi tiết 7 lớp ---------- */
function Row({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-2 border-b border-gray-100 px-5 py-3.5 last:border-0 dark:border-gray-800 md:grid-cols-[220px_1fr]">
            <div className="text-[13px] font-semibold text-gray-500">L{n} · {title}</div>
            <div className="text-[13.5px] text-gray-800 dark:text-gray-200">{children}</div>
        </div>
    );
}

function ConfigView({ cte, v }: { cte: Cte; v: CteVersion }) {
    const c = v.config;
    const bs = bizStepOf(c.bizStep);
    const kdeTable = (list: typeof c.kdes) => (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table className="w-full text-[13px]">
                <tbody>
                    {list.map((k) => (
                        <tr key={k.code} className="border-b border-gray-50 last:border-0 dark:border-gray-800">
                            <td className="px-3 py-2"><div className="font-medium">{fieldName(k.code)}</div><div className="font-mono text-[12px] text-gray-400">{k.code}</div></td>
                            <td className="px-3 py-2">{k.required ? <Tag cls={T.gs1}><Lock size={11} /> Bắt buộc</Tag> : <Tag cls={T.mute}>Tuỳ chọn</Tag>}</td>
                            <td className="px-3 py-2 text-[12.5px] text-gray-500">{k.note || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    return (
        <div className={card}>
            <Row n={1} title="Event Type">{cte.et} · {etOf(cte.et).epcis} — {etOf(cte.et).name}</Row>
            <Row n={2} title="bizStep"><span className="font-mono">{c.bizStep || "—"}</span>{bs && <span className="text-gray-500"> — {bs.name}</span>}</Row>
            <Row n={3} title="action">
                {cte.et === "ET-03" ? <span className="text-gray-500">Không có trường action (TransformationEvent).</span> : (
                    <span className="flex flex-wrap items-center gap-2">
                        <span className="font-mono">{c.action ?? "—"}</span>
                        {c.action && suggestAction(cte.et, c.bizStep).includes(c.action) ? <Tag cls={T.ok}>Khuyến nghị</Tag> : c.action && <Tag cls={T.warn}>Đã sửa tay — khuyến nghị {suggestAction(cte.et, c.bizStep).join(" / ")}</Tag>}
                    </span>
                )}
            </Row>
            <Row n={4} title="Danh sách disposition">
                {c.legacyDisposition !== undefined ? (
                    <span><span className="font-mono">{c.legacyDisposition}</span> <Tag cls={T.warn}>Cấu trúc cũ (1 giá trị) — chuyển thành danh sách khi clone / tạo phiên bản mới</Tag></span>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <div><span className="text-gray-500">Persistent: </span>{c.dispPersist.length ? c.dispPersist.map((g) => <Tag key={g} cls={T.gs1}><Lock size={11} /> {groupLabel(g)}</Tag>) : <span className="text-gray-400">không có</span>}</div>
                        <div className="flex flex-wrap items-center gap-1.5"><span className="text-gray-500">Thường: </span>{c.dispNormal.length ? c.dispNormal.map((d) => <Tag key={d}><span className="font-mono">{d}</span></Tag>) : <span className="text-gray-400">không có</span>}</div>
                        {cte.et === "ET-03" && <span className="text-[12px] text-gray-400">Disposition áp dụng cho output products.</span>}
                    </div>
                )}
            </Row>
            <Row n={5} title="bizTransactionType">
                {c.bizTxTypes.length ? <div className="flex flex-wrap gap-1.5">{c.bizTxTypes.map((b) => <Tag key={b}>{BIZ_TX_TYPES.find((x) => x.code === b)?.name ?? b}</Tag>)}</div> : <span className="text-gray-400">Không yêu cầu</span>}
                {c.bizTxTypes.length > 0 && cte.et !== "ET-04" && <span className="ml-2 text-[12px] text-gray-400">(tuỳ chọn)</span>}
            </Row>
            <Row n={6} title="KDE + ilmd">
                <div className="flex flex-col gap-3">
                    <div>
                        <div className="mb-1.5 text-[12.5px] text-gray-500">{c.kdes.filter((k) => k.required).length} bắt buộc · {c.kdes.filter((k) => !k.required).length} tuỳ chọn</div>
                        {kdeTable(c.kdes)}
                    </div>
                    {c.ilmd.length > 0 && <div><div className="mb-1.5 text-[12.5px] font-semibold text-gray-500">ilmd — thông tin cấp lô{cte.et === "ET-03" ? " (output)" : ""}</div>{kdeTable(c.ilmd)}</div>}
                </div>
            </Row>
            <Row n={7} title="Cấu hình bổ sung">
                <div className="flex flex-col gap-1">
                    <span>Cảm biến: {c.sensor ? `${SENSOR_TYPES.find((s) => s.code === c.sensor!.type)?.name} ${c.sensor.min}–${c.sensor.max} ${c.sensor.uom === "CEL" ? "°C" : c.sensor.uom}` : <span className="text-gray-400">—</span>}</span>
                    <span>Chứng nhận: {c.certs.length ? c.certs.map((x) => `${x.name} (${x.required ? "bắt buộc" : "tuỳ chọn"})`).join(", ") : <span className="text-gray-400">—</span>}</span>
                    <span>Khi nào dùng: {c.trigger || <span className="text-gray-400">—</span>}</span>
                </div>
            </Row>
        </div>
    );
}
