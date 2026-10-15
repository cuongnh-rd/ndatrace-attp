/**
 * Kho Quy trình tiêu chuẩn TXNG (F-M6 CTE Template) — mock in-memory.
 * Mỗi công đoạn tham chiếu 1 CTE Đang áp dụng (theo id + version) trong CTE Builder.
 */
import { type CteConfig, ctes, cteById, vActive, ME_USER, TODAY, clone } from "./cte";
import { FAMILIES, ME_BO, fieldName, libOf, ilmdAllowed } from "./catalog";

export type ProcStatus = "draft" | "sched" | "active" | "super" | "off";
export type Mode = "keep" | "req" | "hide";

export interface InhField { src: "inh"; code: string; mode: Mode; note: string }
export interface ExtField { src: "ext"; code: string; req: boolean; note: string }
export type RestField = InhField | ExtField;

export interface ProcStep {
    uid: string;
    cteId: string;
    cteVer: number;
    name: string;
    req: boolean;
    note: string;
    coreNotes: Record<string, string>;
    rest: RestField[];
}
export interface ProcVersion {
    v: number;
    status: ProcStatus;
    from: string; // "yyyy-mm-dd hh:mm"
    to: string;
    by: string;
    note: string;
    offReason?: string;
    steps: ProcStep[];
}
export interface Proc { id: string; code: string; fam: string; name: string; desc: string; law: string; versions: ProcVersion[] }

export const PROC_STATUS: Record<ProcStatus, { label: string; cls: string }> = {
    draft: { label: "Nháp", cls: "bg-gray-50 text-gray-600 border-gray-200" },
    sched: { label: "Chờ áp dụng", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    active: { label: "Hoạt động", cls: "bg-brand-50 text-brand-700 border-brand-200" },
    super: { label: "Đã thay thế", cls: "bg-gray-100 text-gray-400 border-gray-200" },
    off: { label: "Không hoạt động", cls: "bg-red-50 text-red-700 border-red-200" },
};

export const NOW = "2026-10-12 15:00";
export const fmtDT = (s: string) => {
    if (!s) return "—";
    const [d, t] = s.split(" ");
    return `${d.split("-").reverse().join("/")}${t ? " " + t : ""}`;
};

/* ---------- liên kết CTE ---------- */
export const cteCfg = (s: ProcStep): CteConfig | undefined => cteById(s.cteId)?.versions.find((v) => v.v === s.cteVer)?.config;
/** Trường bắt buộc theo CTE (khoá, không đổi được) */
export const coreOf = (cfg: CteConfig) => [...cfg.kdes.filter((x) => x.required), ...cfg.ilmd.filter((x) => x.required)].map((x) => x.code);
/** Trường tuỳ chọn của CTE (Bộ được nâng bắt buộc / ẩn) */
export const optOf = (cfg: CteConfig) => [...cfg.kdes.filter((x) => !x.required), ...cfg.ilmd.filter((x) => !x.required)].map((x) => x.code);
export const latestVer = (cteId: string) => {
    const c = cteById(cteId);
    return c ? vActive(c)?.v ?? 0 : 0;
};
export const isOutdated = (s: ProcStep) => s.cteVer < latestVer(s.cteId);
export const cteInactive = (s: ProcStep) => latestVer(s.cteId) === 0;

let uidc = 100;
export const uid = () => "s" + ++uidc;

export function mkStep(cteId: string, ver?: number, name?: string, opt: { uid?: string; req?: boolean; modes?: Record<string, Mode>; ext?: [string, boolean, string?][] } = {}): ProcStep {
    const c = cteById(cteId)!;
    const v = ver ?? vActive(c)!.v;
    const cfg = c.versions.find((x) => x.v === v)!.config;
    return {
        uid: opt.uid ?? uid(), cteId, cteVer: v, name: name ?? c.name, req: opt.req ?? true, note: "", coreNotes: {},
        rest: [
            ...optOf(cfg).filter((code) => opt.modes?.[code] !== "hide").map((code): RestField => ({ src: "inh", code, mode: opt.modes?.[code] ?? "keep", note: "" })),
            ...(opt.ext ?? []).map(([code, req, note]): RestField => ({ src: "ext", code, req, note: note ?? "" })),
        ],
    };
}

/* ---------- mock ---------- */
export const procs: Proc[] = [
    {
        id: "p1", code: "QT-NNMT-RAU", fam: "rau", name: "Quy trình TXNG rau ăn lá", desc: "Áp dụng cho cơ sở trồng, sơ chế, kinh doanh rau ăn lá.", law: "Nghị định 37/2025/NĐ-CP",
        versions: [
            { v: 1, status: "super", from: "2026-07-01 00:00", to: "2026-09-01 00:00", by: ME_USER, note: "Ban hành lần đầu", steps: [mkStep("cte-02", 2, "Thu hoạch", { uid: "r1" }), mkStep("cte-06", 1, "Vận chuyển", { uid: "r2" })] },
            { v: 2, status: "active", from: "2026-09-01 00:00", to: "", by: ME_USER, note: "Bổ sung sơ chế, kiểm tra chất lượng", steps: [mkStep("cte-02", 2, "Thu hoạch", { uid: "r1", ext: [["ndatrace:phiInterval", true]] }), mkStep("cte-05", 1, "Sơ chế", { uid: "r3" }), mkStep("cte-08", 1, "Kiểm tra chất lượng", { uid: "r4", ext: [["ndatrace:labResult", true]] }), mkStep("cte-06", 1, "Vận chuyển", { uid: "r2" })] },
            { v: 3, status: "sched", from: "2027-01-01 00:00", to: "", by: ME_USER, note: "Bổ sung bước đóng gói theo Thông tư hướng dẫn", steps: [mkStep("cte-02", 3, "Thu hoạch", { uid: "r1", ext: [["ndatrace:phiInterval", true]] }), mkStep("cte-05", 1, "Sơ chế", { uid: "r3" }), mkStep("cte-08", 1, "Kiểm tra chất lượng", { uid: "r4", ext: [["ndatrace:labResult", true]] }), mkStep("cte-04", 1, "Đóng gói", { uid: "r5" }), mkStep("cte-06", 1, "Vận chuyển", { uid: "r2" })] },
        ],
    },
    {
        id: "p2", code: "QT-NNMT-TS", fam: "ts", name: "Quy trình TXNG thủy sản nuôi", desc: "Áp dụng cho cơ sở nuôi trồng, thu hoạch, sơ chế thủy sản.", law: "Nghị định 37/2025/NĐ-CP",
        versions: [{
            v: 1, status: "active", from: "2026-08-15 00:00", to: "", by: ME_USER, note: "Ban hành lần đầu", steps: [
                mkStep("cte-02", 2, "Thu hoạch", { uid: "t1", modes: { bizTransactionList: "hide", certificationInfo: "req" }, ext: [["ndatrace:pondId", true, "Theo mã ao đã đăng ký với Chi cục"], ["ndatrace:harvestMethod", false]] }),
                mkStep("cte-03", 1, "Làm mát sau thu hoạch", { uid: "t2", req: false, modes: { sensorElementList: "req" } }),
                mkStep("cte-05", 1, "Sơ chế", { uid: "t3" }),
                mkStep("cte-08", 1, "Kiểm tra chất lượng", { uid: "t4", ext: [["ndatrace:labResult", true]] }),
                mkStep("cte-06", 1, "Vận chuyển về nhà máy", { uid: "t5", ext: [["ndatrace:vehiclePlate", true], ["ndatrace:storageTemp", false]] }),
                mkStep("cte-06", 1, "Vận chuyển đến điểm bán", { uid: "t6", ext: [["ndatrace:vehiclePlate", true]] }),
            ],
        }],
    },
    {
        id: "p3", code: "QT-NNMT-GAO", fam: "gao", name: "Quy trình TXNG gạo", desc: "", law: "",
        versions: [{ v: 1, status: "draft", from: "", to: "", by: "", note: "", steps: [mkStep("cte-02", 3, "Thu hoạch lúa", { uid: "g1" })] }],
    },
    {
        id: "p4", code: "QT-NNMT-CHE", fam: "che", name: "Quy trình TXNG chè", desc: "", law: "Nghị định 37/2025/NĐ-CP",
        versions: [{ v: 1, status: "off", from: "2026-05-01 00:00", to: "2026-09-20 10:00", by: ME_USER, note: "Ban hành lần đầu", offReason: "Chờ hợp nhất với quy trình nông sản chế biến", steps: [mkStep("cte-02", 2, "Hái chè", { uid: "c1" }), mkStep("cte-05", 1, "Chế biến", { uid: "c2" })] }],
    },
];

/** Quy trình của Bộ khác (chỉ xem ở tab Toàn cảnh) */
export const OTHER_PROCS = [
    { bo: "Bộ Y tế", fam: "ts", name: "Quy trình ATTP thủy sản", v: 2, steps: [["cte-08", "Kiểm nghiệm ATTP", 3], ["cte-07", "Tiếp nhận tại cơ sở chế biến", 2], ["cte-05", "Chế biến", 2]] as [string, string, number][] },
    { bo: "Bộ Công Thương", fam: "qua", name: "Quy trình lưu thông trái cây", v: 1, steps: [["cte-07", "Tiếp nhận tại kho", 1], ["cte-06", "Phân phối", 2]] as [string, string, number][] },
];

/* ---------- helpers ---------- */
export const procById = (id: string) => procs.find((p) => p.id === id);
export const pActive = (p: Proc) => p.versions.find((v) => v.status === "active");
export const pPending = (p: Proc) => p.versions.find((v) => v.status === "draft" || v.status === "sched");
export const pOff = (p: Proc) => p.versions.find((v) => v.status === "off");
export const pMain = (p: Proc) => pActive(p) ?? pOff(p) ?? p.versions[p.versions.length - 1];
export const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

/** CTE đang được quy trình nào tham chiếu (BR-D-07 — chặn xoá CTE) */
export const procsUsingCte = (cteId: string) => procs.filter((p) => p.versions.some((v) => v.status !== "super" && v.steps.some((s) => s.cteId === cteId)));

export const visibleCount = (s: ProcStep) => {
    const cfg = cteCfg(s);
    return (cfg ? coreOf(cfg).length : 0) + s.rest.filter((r) => !(r.src === "inh" && r.mode === "hide")).length;
};
export const countReq = (v: ProcVersion) =>
    v.steps.reduce((n, s) => n + (cteCfg(s) ? coreOf(cteCfg(s)!).length : 0) + s.rest.filter((r) => (r.src === "inh" && r.mode === "req") || (r.src === "ext" && r.req)).length, 0);

export function overlapBo(fam: string, cteId: string) {
    return OTHER_PROCS.filter((o) => o.fam === fam && o.steps.some((x) => x[0] === cteId)).map((o) => o.bo);
}

export function procWarnings(p: Proc) {
    const v = pActive(p) ?? pPending(p) ?? p.versions[p.versions.length - 1];
    const out: string[] = [];
    if (v.steps.some(isOutdated)) out.push("Có sự kiện trọng yếu đã ra phiên bản mới");
    if (v.steps.some(cteInactive)) out.push("Có sự kiện trọng yếu không còn áp dụng");
    return out;
}

/** Lý do không thêm được trường từ thư viện KDE vào công đoạn */
export function kdeBlock(s: ProcStep, code: string): { why: string; unhide?: string } | null {
    const L = libOf(code)!;
    const c = cteById(s.cteId)!;
    const cfg = cteCfg(s)!;
    if (s.rest.some((r) => r.src === "ext" && r.code === code)) return { why: "Đã thêm vào công đoạn này." };
    if (L.map && coreOf(cfg).includes(L.map)) return { why: `Trùng với trường bắt buộc "${fieldName(L.map)}" đã có trong sự kiện trọng yếu.` };
    if (L.map) {
        const r = s.rest.find((x) => x.src === "inh" && x.code === L.map) as InhField | undefined;
        if (r) return { why: "Trường này đã có trong danh sách trường bổ sung." };
        if (optOf(cfg).includes(L.map)) return { why: `Trùng với trường gợi ý "${fieldName(L.map)}" của sự kiện trọng yếu — chọn ở mục Gợi ý theo sự kiện trọng yếu.` };
    }
    if (L.ilmd && !ilmdAllowed(c.et, cfg.action)) return { why: "Thông tin cấp lô chỉ được ghi tại sự kiện tạo mới định danh (ADD) hoặc chế biến." };
    if (L.gdsn) return { why: "Đây là thông tin sản phẩm, khai một lần tại Quản lý GTIN, không khai theo từng sự kiện." };
    return null;
}

export interface PIssue { m: string; uid?: string }
export function validateProc(p: Proc, v: ProcVersion) {
    const E: PIssue[] = [], W: PIssue[] = [];
    if (!p.name.trim()) E.push({ m: "Chưa nhập tên quy trình." });
    if (!v.steps.length) E.push({ m: "Quy trình chưa có công đoạn nào." });
    else if (!v.steps.some((s) => s.req)) E.push({ m: "Quy trình cần có ít nhất một công đoạn bắt buộc." });
    const seen: Record<string, 1> = {};
    v.steps.forEach((s) => {
        const n = norm(s.name);
        if (seen[n]) E.push({ m: `Tên công đoạn "${s.name}" bị trùng.`, uid: s.uid });
        seen[n] = 1;
        if (cteInactive(s)) E.push({ m: `Công đoạn "${s.name}" dùng sự kiện trọng yếu không còn áp dụng.`, uid: s.uid });
        s.rest.filter((r) => r.src === "ext").forEach((r) => {
            const b = kdeBlock({ ...s, rest: s.rest.filter((x) => x !== r) }, r.code);
            if (b) E.push({ m: `Trường "${libOf(r.code)?.name}" tại công đoạn "${s.name}" không hợp lệ: ${b.why}`, uid: s.uid });
        });
        if (isOutdated(s)) W.push({ m: `Công đoạn "${s.name}" đang dùng sự kiện trọng yếu v${s.cteVer}, đã có v${latestVer(s.cteId)}.`, uid: s.uid });
        const ov = overlapBo(p.fam, s.cteId);
        if (ov.length) W.push({ m: `Công đoạn "${s.name}" cũng có trong quy trình của ${ov.join(", ")}. Doanh nghiệp có thể phải khai báo trùng.`, uid: s.uid });
    });
    const other = procs.find((x) => x !== p && x.fam === p.fam && x.versions.some((y) => y.status === "active" || y.status === "sched"));
    if (other) E.push({ m: `Bộ đã có quy trình "${other.name}" cho nhóm ngành này.` });
    return { E, W };
}

export function applyVersion(p: Proc, v: ProcVersion, at: string) {
    const a = pActive(p);
    if (a && a !== v) {
        a.status = "super";
        a.to = at;
    }
    v.status = "active";
    v.from = at;
}

export function newProcVersion(p: Proc): ProcVersion {
    const a = pActive(p) ?? p.versions[p.versions.length - 1];
    const nv: ProcVersion = { ...clone(a), v: Math.max(...p.versions.map((x) => x.v)) + 1, status: "draft", from: "", to: "", note: "", by: "" };
    delete nv.offReason;
    p.versions.push(nv);
    return nv;
}

/** Cập nhật công đoạn lên version CTE mới nhất đang áp dụng */
export function updateStepCte(s: ProcStep) {
    const nv = latestVer(s.cteId);
    const cfg = cteById(s.cteId)!.versions.find((x) => x.v === nv)!.config;
    const core = coreOf(cfg), opt = optOf(cfg), merged: string[] = [];
    s.rest = s.rest.filter((r) => {
        const L = r.src === "ext" ? libOf(r.code) : undefined;
        if (L?.map && core.includes(L.map)) {
            if (r.note) s.coreNotes[L.map] = r.note;
            merged.push(L.name);
            return false;
        }
        return !(r.src === "inh" && !opt.includes(r.code));
    });
    opt.forEach((code) => {
        if (!s.rest.some((r) => r.src === "inh" && r.code === code)) s.rest.push({ src: "inh", code, mode: "keep", note: "" });
    });
    s.cteVer = nv;
    return merged;
}

export function createProc(fam: string, name: string, law: string, desc: string): Proc {
    const id = "p" + (procs.length + 1 + Math.floor(Math.random() * 999));
    const p: Proc = { id, code: `QT-NNMT-${fam.replace(/-/g, "").toUpperCase()}`, fam, name, desc, law, versions: [{ v: 1, status: "draft", from: "", to: "", by: "", note: "", steps: [] }] };
    procs.unshift(p);
    return p;
}

export const myFamilies = () => FAMILIES.filter((f) => f.bo.includes(ME_BO));
/** CTE chọn được khi thêm công đoạn: CTE cấp Bộ có version Đang áp dụng */
export const usableCtes = () => ctes.filter((c) => c.level === "Bộ" && !!vActive(c));
export { TODAY };
