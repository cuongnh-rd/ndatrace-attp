"use client";

import { use, useReducer, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Banner, Tag, btn, btnD, btnP, btnSm, inp, useToast } from "@/components/txng/ui";
import { famOf } from "@/lib/txng/catalog";
import { cteById, patch } from "@/lib/txng/cte";
import {
    type Proc, type ProcStep, NOW, PROC_STATUS, applyVersion, cteInactive, fmtDT, isOutdated, newProcVersion, pActive, pMain,
    pPending, procById, procs, updateStepCte, validateProc,
} from "@/lib/txng/process";
import Builder from "../components/Builder";
import ProcInfoCard from "../components/ProcInfoCard";
import { HistoryTab, OverviewTab } from "../components/ProcTabs";
import {
    AddKdeDialog, AddStepDialog, ConfirmDialog, CteDiffDialog, DeactivateDialog, PreviewDialog, PublishDialog, ReactivateDialog, ScheduleDialog,
} from "../components/ProcDialogs";

type Tab = "steps" | "hist" | "ov";
type Dlg =
    | { k: "addStep" } | { k: "addKde"; s: ProcStep } | { k: "diff"; s: ProcStep } | { k: "publish" } | { k: "sched" }
    | { k: "off" } | { k: "reon" } | { k: "preview" } | { k: "confirm"; title: string; msg: string; btn: string; danger?: boolean; fn: () => void };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const p = procById(id);
    if (!p)
        return (
            <DashboardLayout>
                <Banner kind="warn">Không tìm thấy quy trình. <Link className="underline" href="/danh-muc/quy-trinh-tieu-chuan">Quay lại danh sách</Link></Banner>
            </DashboardLayout>
        );
    return <Detail key={id} p={p} />;
}

function Detail({ p }: { p: Proc }) {
    const isNew = useSearchParams().get("new") === "1";
    const router = useRouter();
    const toast = useToast();
    const [, bump] = useReducer((x: number) => x + 1, 0);
    const [vi, setVi] = useState(() => p.versions.indexOf(pMain(p)));
    const [tab, setTab] = useState<Tab>("steps");
    const [sel, setSel] = useState<string | null>(() => pMain(p).steps[0]?.uid ?? null);
    const [errSteps, setErrSteps] = useState<Set<string>>(new Set());
    const [dlg, setDlg] = useState<Dlg | null>(null);

    const v = p.versions[vi] ?? pMain(p);
    const f = famOf(p.fam);
    const a = pActive(p), pe = pPending(p);
    const editable = v.status === "draft";
    const outdated = v.steps.filter(isOutdated);
    const inactive = v.steps.filter(cteInactive);
    const prev = p.versions.find((x) => x.status === "active" && x !== v) ?? null;

    const close = () => setDlg(null);
    const done = (m: string) => { close(); toast.show(m); bump(); };
    const openV = (i: number) => { setVi(i); setSel(p.versions[i].steps[0]?.uid ?? null); setErrSteps(new Set()); };
    const confirm = (title: string, msg: string, b: string, fn: () => void, danger = true) => setDlg({ k: "confirm", title, msg, btn: b, danger, fn });
    const toEdit = () => {
        if (pe) return openV(p.versions.indexOf(pe));
        const nv = newProcVersion(p);
        openV(p.versions.indexOf(nv));
        toast.show(`Đã tạo bản nháp phiên bản ${nv.v}. Phiên bản ${a?.v} vẫn đang áp dụng.`);
    };
    const publish = () => {
        setErrSteps(new Set(validateProc(p, v).E.filter((e) => e.uid).map((e) => e.uid!)));
        setDlg({ k: "publish" });
    };

    let acts = null;
    if (v.status === "draft")
        acts = (<>
            {v.v > 1
                ? <button className={btnD} onClick={() => confirm("Huỷ bản nháp", `Bản nháp phiên bản ${v.v} và mọi thay đổi trong đó sẽ bị xoá. Phiên bản đang áp dụng không thay đổi.`, "Huỷ bản nháp", () => { p.versions.splice(vi, 1); openV(p.versions.indexOf(pMain(p))); toast.show("Đã huỷ bản nháp"); })}>Huỷ bản nháp</button>
                : <button className={btnD} onClick={() => confirm("Xoá quy trình", `Quy trình "${p.name}" chưa từng áp dụng và sẽ bị xoá hẳn. Nhóm ngành ${f.name} có thể tạo quy trình mới.`, "Xoá quy trình", () => { procs.splice(procs.indexOf(p), 1); router.push("/danh-muc/quy-trinh-tieu-chuan"); })}>Xoá</button>}
            <button className={btnP} onClick={publish}>Publish</button>
        </>);
    else if (v.status === "sched")
        acts = (<>
            <button className={btn} onClick={() => setDlg({ k: "sched" })}>Đổi lịch</button>
            <button className={btn} onClick={() => confirm("Huỷ lịch áp dụng", `Phiên bản ${v.v} quay về trạng thái Nháp để bạn chỉnh sửa tiếp.`, "Huỷ lịch", () => { v.status = "draft"; v.from = ""; toast.show("Đã huỷ lịch. Phiên bản về Nháp."); bump(); }, false)}>Huỷ lịch</button>
            <button className={btnP} onClick={() => {
                const { E } = validateProc(p, v);
                if (E.length) return toast.show("Không áp dụng được: " + E[0].m);
                confirm("Áp dụng ngay", `Phiên bản ${v.v} sẽ áp dụng ngay thay vì chờ tới ${fmtDT(v.from)}.`, "Áp dụng ngay", () => { applyVersion(p, v, NOW); toast.show(`Phiên bản ${v.v} đang áp dụng.`); bump(); }, false);
            }}>Áp dụng ngay</button>
        </>);
    else if (v.status === "active")
        acts = (<>
            <button className={btnD} onClick={() => setDlg({ k: "off" })}>Vô hiệu hoá</button>
            <button className={btnP} onClick={toEdit}>{pe ? `Mở v${pe.v} ${pe.status === "sched" ? "(chờ áp dụng)" : "(nháp)"}` : "Chỉnh sửa"}</button>
        </>);
    else if (v.status === "off") acts = <button className={btnP} onClick={() => setDlg({ k: "reon" })}>Kích hoạt lại</button>;
    else acts = null;

    return (
        <DashboardLayout>
            <div className="mb-4 flex items-center gap-3">
                <Link href="/danh-muc/quy-trinh-tieu-chuan" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <ArrowLeft size={16} className="text-gray-600" />
                </Link>
                <span className="text-[13px] text-gray-500">Quy trình tiêu chuẩn TXNG / <b className="text-gray-800 dark:text-gray-200">{p.name || "Quy trình mới"}</b></span>
            </div>

            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{p.name || "Quy trình mới"}</h1>
                            <Tag cls={PROC_STATUS[v.status].cls}>{PROC_STATUS[v.status].label}</Tag>
                            {p.versions.length > 1 && (
                                <select aria-label="Phiên bản" className={`${inp} !w-auto !py-0.5 text-[13px]`} value={vi} onChange={(e) => openV(+e.target.value)}>
                                    {p.versions.map((x, i) => <option key={x.v} value={i}>v{x.v} · {PROC_STATUS[x.status].label}</option>)}
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">{acts}</div>
            </div>

            <div className="mb-4">
                {v.status === "sched" && <Banner kind="info">Phiên bản {v.v} sẽ tự động áp dụng lúc <b>{fmtDT(v.from)}</b>{a ? ` và thay thế phiên bản ${a.v}` : ""}. Cấu hình đã khoá; huỷ lịch để chỉnh sửa.</Banner>}
                {v.status === "draft" && v.v > 1 && a && <Banner kind="info">Đang soạn phiên bản {v.v}. Phiên bản {a.v} vẫn đang áp dụng cho doanh nghiệp cho tới khi bạn publish bản này.</Banner>}
                {outdated.length > 0 && v.status !== "super" && v.status !== "off" && (
                    <Banner kind="warn" action={
                        v.status === "draft"
                            ? <button className={`${btn} ${btnSm}`} onClick={() => { outdated.forEach(updateStepCte); toast.show(`Đã cập nhật ${outdated.length} công đoạn lên phiên bản mới nhất`); bump(); }}>Cập nhật tất cả</button>
                            : v.status === "active" ? <button className={`${btn} ${btnSm}`} onClick={toEdit}>Chỉnh sửa để cập nhật</button> : undefined
                    }>
                        {outdated.length} công đoạn đang dùng sự kiện trọng yếu phiên bản cũ: {[...new Set(outdated.map((s) => cteById(s.cteId)?.name))].join(", ")}.{" "}
                        {v.status === "draft" ? "Chọn công đoạn để xem thay đổi và cập nhật." : "Tạo phiên bản mới để cập nhật."}
                    </Banner>
                )}
                {inactive.length > 0 && v.status !== "super" && <Banner kind="err">Sự kiện trọng yếu không còn áp dụng: {inactive.map((s) => cteById(s.cteId)?.name).join(", ")}. Phiên bản đang áp dụng vẫn chạy; không thể publish phiên bản mới còn chứa công đoạn này.</Banner>}
                {v.status === "off" && <Banner kind="err">Quy trình đã vô hiệu hoá lúc {fmtDT(v.to)}. Lý do: {v.offReason || "—"}. Doanh nghiệp không khai báo sự kiện mới theo quy trình này; dữ liệu đã khai giữ nguyên.</Banner>}
                {v.status === "super" && <Banner kind="info">Phiên bản đã bị thay thế, chỉ xem. Hiệu lực từ {fmtDT(v.from)} đến {fmtDT(v.to)}.</Banner>}
            </div>

            <ProcInfoCard p={p} v={v} editable={editable} startOpen={isNew} onChange={bump} />

            <div className="mb-4 flex gap-1 border-b border-gray-200 dark:border-gray-800" role="tablist">
                {([["steps", "Công đoạn và trường thông tin"], ["hist", "Lịch sử phiên bản"], ["ov", "Toàn cảnh nhóm ngành"]] as [Tab, string][]).map(([k, l]) => (
                    <button key={k} role="tab" onClick={() => setTab(k)} className={`-mb-px border-b-2 px-3.5 py-2.5 text-[13.5px] font-medium ${tab === k ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500"}`}>{l}</button>
                ))}
            </div>

            {tab === "steps" && (
                <Builder p={p} v={v} prev={prev} editable={editable} sel={sel} errSteps={errSteps} onSel={(u) => { setSel(u); bump(); }} bump={bump}
                    toast={toast.show} onPreview={(u) => { setSel(u); setDlg({ k: "preview" }); }} onAddStep={() => setDlg({ k: "addStep" })} onAddKde={(s) => setDlg({ k: "addKde", s })} onDiff={(s) => setDlg({ k: "diff", s })}
                    onConfirm={(t, m, b, fn) => confirm(t, m, b, fn)} />
            )}
            {tab === "hist" && <HistoryTab p={p} onOpen={(i) => { openV(i); setTab("steps"); }} />}
            {tab === "ov" && <OverviewTab p={p} fallback={v} />}

            {dlg?.k === "addStep" && <AddStepDialog p={p} v={v} onClose={close} onAdded={(s, renamed) => {
                setSel(s.uid); done(renamed ? `Đã thêm công đoạn. Đặt tên phân biệt cho "${s.name}".` : "Đã thêm công đoạn");
            }} />}
            {dlg?.k === "addKde" && <AddKdeDialog s={dlg.s} onClose={close} onDone={done} />}
            {dlg?.k === "diff" && <CteDiffDialog s={dlg.s} editable={editable} onClose={close} onDone={done} />}
            {dlg?.k === "publish" && <PublishDialog p={p} v={v} onClose={close} onGoStep={(u) => { setSel(u); setTab("steps"); close(); }} onDone={(m) => { setErrSteps(new Set()); done(m); }} />}
            {dlg?.k === "sched" && <ScheduleDialog v={v} onClose={close} onDone={done} />}
            {dlg?.k === "off" && <DeactivateDialog p={p} v={v} onClose={close} onDone={done} />}
            {dlg?.k === "reon" && <ReactivateDialog p={p} v={v} onClose={close} onDone={done} onNewVersion={() => {
                close(); patch(v, { status: "active" }); const nv = newProcVersion(p); patch(v, { status: "off" }); openV(p.versions.indexOf(nv));
            }} />}
            {dlg?.k === "preview" && <PreviewDialog v={v} start={sel} onClose={close} />}
            {dlg?.k === "confirm" && <ConfirmDialog title={dlg.title} msg={dlg.msg} btnLabel={dlg.btn} danger={dlg.danger} onClose={close} onOk={dlg.fn} />}

            {toast.node}
        </DashboardLayout>
    );
}

