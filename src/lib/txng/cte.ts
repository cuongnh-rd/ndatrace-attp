/**
 * Kho CTE (F-M5 CTE Builder) — mock in-memory, dùng chung cho menu
 * "Sự kiện trọng yếu" và "Quy trình tiêu chuẩn TXNG".
 */
import {
    type Action, type EtCode, EVENT_KDES, bizStepOf, ilmdAllowed, etOf, dispOf, groupCodes, persistGroups, suggestAction, suggestDisp, PERSIST_GROUPS,
} from "./catalog";

export type CteStatus = "draft" | "active" | "scheduled" | "superseded";
export type C2Level = "Bộ" | "Sở";
export type CteSource = "NEW" | "CLONED_FROM_C1" | "CLONED_FROM_C2";

export interface KdeCfg { code: string; required: boolean; note: string }
export interface SensorCfg { type: string; min: string; max: string; uom: string }
export interface CertCfg { name: string; required: boolean }

export interface CteConfig {
    bizStep: string;                    // L2
    action: Action | null;              // L3 (ET-03: null) — tự điền theo bizStep × ET
    actionManual?: boolean;             // L3: C2 đã sửa tay lệch khuyến nghị
    dispPersist: string[];              // L4: nhóm persistent (theo bảng 4.4, khoá)
    dispNormal: string[];               // L4: danh sách disposition thường được phép
    /** Cấu trúc trước v5 (1 disposition) — chuyển thành danh sách khi clone / tạo version (QĐ-06) */
    legacyDisposition?: string;
    bizTxTypes: string[];               // L5
    kdes: KdeCfg[];                     // L6
    ilmd: KdeCfg[];                     // L6 (conditional)
    sensor: SensorCfg | null;           // L7
    certs: CertCfg[];                   // L7
    trigger: string;                    // L7
}

export interface CteVersion {
    v: number;
    status: CteStatus;
    effectiveFrom: string;   // yyyy-mm-dd
    effectiveTo: string;     // ngày ngừng áp dụng
    cancelled?: boolean;     // huỷ trước khi áp dụng
    replacedBy?: number;
    config: CteConfig;
    createdAt: string;
    createdBy: string;
}

export interface Cte {
    id: string;
    code: string;
    name: string;
    et: EtCode;
    level: C2Level;
    org: string;
    source: CteSource;
    cloneSourceId?: string;
    /** Cấu hình gốc của CTE cấp Bộ khi Sở clone — dùng để enforce AD-06 */
    parentConfig?: CteConfig;
    /** Bản clone vừa được chuyển lớp 4 từ cấu trúc cũ — cần rà soát */
    migrated?: boolean;
    createdAt: string;
    versions: CteVersion[];
}

export const TODAY = "2026-10-12";
export const ME_USER = "Nguyễn Hà Cương";
export const ORG_BO = "Bộ Nông nghiệp và Môi trường";
export const ORG_SO = "Sở KHCN Hà Nội";

/** Vai trò đang mô phỏng (prototype) */
export const session: { level: C2Level } = { level: "Bộ" };
export const myOrg = () => (session.level === "Bộ" ? ORG_BO : ORG_SO);

export const STATUS_META: Record<CteStatus, { label: string; cls: string }> = {
    draft: { label: "Nháp", cls: "bg-white text-gray-600 border-gray-300" },
    active: { label: "Đang áp dụng", cls: "bg-brand-50 text-brand-700 border-brand-200" },
    scheduled: { label: "Chờ áp dụng", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    superseded: { label: "Ngừng áp dụng", cls: "bg-gray-100 text-gray-500 border-gray-200" },
};

export const fmtDate = (d: string) => (d ? d.split("-").reverse().join("/") : "—");

/* ---------- mock ---------- */
const k = (code: string, required = false, note = ""): KdeCfg => ({ code, required, note });
type MockCfg = Partial<CteConfig> & Pick<CteConfig, "bizStep" | "kdes"> & { disposition?: string; persistentDisposition?: string };
const base = ({ disposition, persistentDisposition, ...p }: MockCfg): CteConfig => ({
    action: null, dispPersist: persistentDisposition ? [dispOf(persistentDisposition)!.group!] : [],
    dispNormal: disposition && !dispOf(disposition)?.group ? [disposition] : [], bizTxTypes: [], ilmd: [], sensor: null, certs: [], trigger: "", ...p,
});
const ver = (v: number, status: CteStatus, config: CteConfig, from = "", to = "", extra: Partial<CteVersion> = {}): CteVersion => ({
    v, status, config, effectiveFrom: from, effectiveTo: to, createdAt: from || TODAY, createdBy: ME_USER, ...extra,
});

const harvestV2 = base({
    action: "ADD", bizStep: "harvesting", disposition: "active",
    kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("bizLocation", true), k("readPoint", true), k("gs1:performedBy"), k("certificationInfo"), k("bizTransactionList")],
    ilmd: [k("lotNumber", true), k("harvestDate", true)],
    trigger: "Áp dụng khi kết thúc thu hoạch một lô tại vùng trồng / vùng nuôi.",
});
const harvestV3: CteConfig = {
    ...harvestV2,
    kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("bizLocation", true), k("readPoint", true), k("gs1:growingArea", true), k("gs1:performedBy"), k("certificationInfo"), k("sensorElementList")],
    certs: [{ name: "VietGAP", required: false }],
};
const shipCfg = base({
    action: "OBSERVE", bizStep: "shipping", dispNormal: ["in_transit", "active"], bizTxTypes: ["desadv"],
    kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("sourceList", true), k("destinationList", true), k("readPoint", true, "Điền GLN địa điểm xuất kho."), k("bizTransactionList"), k("sensorElementList")],
    sensor: { type: "temperature", min: "2", max: "8", uom: "CEL" },
    certs: [{ name: "VietGAP", required: true }],
    trigger: "Áp dụng khi lô hàng rời kho / cơ sở.",
});

export const ctes: Cte[] = [
    {
        id: "cte-01", code: "CTE-NN-001", name: "Kích hoạt định danh", et: "ET-01", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-06-02",
        versions: [ver(1, "active", base({ action: "ADD", bizStep: "commissioning", disposition: "active", kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("bizLocation", true), k("readPoint", true), k("gs1:performedBy")], ilmd: [k("lotNumber", true), k("productionDate")] }), "2026-06-10")],
    },
    {
        id: "cte-02", code: "CTE-NN-002", name: "Thu hoạch", et: "ET-01", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-06-02",
        versions: [
            ver(1, "superseded", base({ action: "ADD", bizStep: "harvesting", disposition: "active", kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("bizLocation", true)] }), "2026-06-10", "2026-08-01", { replacedBy: 2 }),
            ver(2, "superseded", harvestV2, "2026-08-01", "2026-10-01", { replacedBy: 3 }),
            ver(3, "active", harvestV3, "2026-10-01"),
        ],
    },
    {
        id: "cte-03", code: "CTE-NN-003", name: "Làm mát sau thu hoạch", et: "ET-01", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-06-05",
        versions: [ver(1, "active", base({ action: "OBSERVE", bizStep: "storing", disposition: "active", kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("bizLocation", true), k("sensorElementList"), k("gs1:performedBy")], sensor: { type: "temperature", min: "0", max: "5", uom: "CEL" } }), "2026-06-15")],
    },
    {
        id: "cte-04", code: "CTE-NN-004", name: "Đóng gói", et: "ET-02", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-06-05",
        versions: [ver(1, "active", base({ action: "ADD", bizStep: "packing", disposition: "in_progress", kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("parentID", true), k("childEPCs", true), k("bizLocation", true), k("gs1:performedBy")] }), "2026-06-15")],
    },
    {
        id: "cte-05", code: "CTE-NN-005", name: "Sơ chế / chế biến", et: "ET-03", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-06-08",
        versions: [ver(1, "active", base({ bizStep: "transforming", disposition: "active", kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("inputEPCList", true), k("outputEPCList", true), k("bizLocation", true), k("gs1:performedBy"), k("certificationInfo")], ilmd: [k("lotNumber", true), k("itemExpirationDate", true), k("productionDate")] }), "2026-06-20")],
    },
    {
        id: "cte-06", code: "CTE-NN-006", name: "Vận chuyển", et: "ET-01", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-06-08",
        versions: [
            ver(1, "active", shipCfg, "2026-06-20"),
            ver(2, "scheduled", { ...shipCfg, kdes: [...shipCfg.kdes, k("gs1:performedBy")] }, "2026-11-01"),
        ],
    },
    {
        id: "cte-07", code: "CTE-NN-007", name: "Tiếp nhận", et: "ET-01", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-06-10",
        versions: [ver(1, "active", base({ action: "OBSERVE", bizStep: "receiving", disposition: "active", kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("bizLocation", true), k("sourceList", true), k("bizTransactionList"), k("gs1:performedBy")] }), "2026-06-20")],
    },
    {
        id: "cte-08", code: "CTE-NN-008", name: "Kiểm tra chất lượng", et: "ET-01", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-06-10",
        versions: [ver(1, "active", base({ action: "OBSERVE", bizStep: "inspecting", persistentDisposition: "conformant", dispNormal: ["damaged", "returned"], kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("bizLocation", true), k("gs1:performedBy"), k("gs1:dispositionReason")] }), "2026-06-25")],
    },
    {
        id: "cte-09", code: "CTE-NN-009", name: "Tiêu huỷ", et: "ET-01", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-06-12",
        versions: [ver(1, "active", base({ action: "DELETE", bizStep: "destroying", legacyDisposition: "destroyed", kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("bizLocation", true), k("gs1:dispositionReason"), k("gs1:performedBy")] }), "2026-06-25")],
    },
    {
        id: "cte-10", code: "CTE-NN-010", name: "Mua bán theo đơn hàng", et: "ET-04", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-07-01",
        versions: [ver(1, "active", base({ action: "ADD", bizStep: "accepting", disposition: "active", bizTxTypes: ["po", "inv"], kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("bizTransactionList", true), k("epcList", true), k("sourceList", true), k("destinationList", true)] }), "2026-07-05")],
    },
    {
        id: "cte-11", code: "CTE-NN-011", name: "Xuất kho thủy sản tươi", et: "ET-01", level: "Bộ", org: ORG_BO, source: "NEW", createdAt: "2026-10-05",
        versions: [ver(1, "draft", base({ action: "OBSERVE", bizStep: "shipping", disposition: "in_transit", kdes: [k("eventTime", true), k("eventTimeZoneOffset", true), k("epcList", true), k("sourceList", true)] }), "", "", { createdAt: "2026-10-05" })],
    },
    {
        id: "cte-12", code: "CTE-HN-001", name: "Vận chuyển rau (Hà Nội)", et: "ET-01", level: "Sở", org: ORG_SO, source: "CLONED_FROM_C2", cloneSourceId: "cte-06", parentConfig: shipCfg, createdAt: "2026-09-02",
        versions: [ver(1, "active", { ...shipCfg, kdes: [...shipCfg.kdes, k("gs1:performedBy", true)] }, "2026-09-10")],
    },
];

/* ---------- helpers ---------- */
export const cteById = (id: string) => ctes.find((c) => c.id === id);
export const vActive = (c: Cte) => c.versions.find((v) => v.status === "active");
export const vScheduled = (c: Cte) => c.versions.find((v) => v.status === "scheduled");
export const vDraft = (c: Cte) => c.versions.find((v) => v.status === "draft");
export const vLatest = (c: Cte) => c.versions[c.versions.length - 1];
/** Version đại diện hiển thị trên danh sách */
export const vMain = (c: Cte) => vActive(c) ?? vScheduled(c) ?? vDraft(c) ?? vLatest(c);
export const canEdit = (c: Cte) => c.level === session.level;
/** CTE có thể dùng trong Quy trình (F-M6): có version Đang áp dụng */
export const isUsable = (c: Cte) => !!vActive(c);

let seq = 100;
export const nextCteId = () => `cte-${++seq}`;
export const nextCteCode = () => {
    const prefix = session.level === "Bộ" ? "CTE-NN-" : "CTE-HN-";
    const n = ctes.filter((c) => c.code.startsWith(prefix)).length + 1;
    return prefix + String(n).padStart(3, "0");
};

export const emptyConfig = (): CteConfig => base({ bizStep: "", kdes: [] });
export const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
/** Ghi vào đối tượng của kho mock (tránh gán trực tiếp props trong component) */
export const patch = <O extends object>(o: O, p: Partial<O>) => Object.assign(o, p);

/** Trường tự động bắt buộc theo ET (không bỏ được) */
export const autoKdes = (et: EtCode, action?: Action | null) =>
    EVENT_KDES.filter((x) => x.auto?.includes(et) && !(et === "ET-02" && x.code === "parentID" && action === "OBSERVE")).map((x) => x.code);

/** Lớp 3–4 tính theo bizStep (BR-M5-14): action khuyến nghị + preselect toàn bộ disposition gợi ý */
export const derivedFromBizStep = (et: EtCode, bizStep: string): Pick<CteConfig, "action" | "actionManual" | "dispPersist" | "dispNormal"> => ({
    action: suggestAction(et, bizStep)[0] ?? null,
    actionManual: false,
    dispPersist: persistGroups(et, bizStep),
    dispNormal: suggestDisp(et, bizStep),
});

/** QĐ-06: chuyển cấu trúc cũ (1 disposition) thành danh sách. Trả về true nếu có chuyển đổi. */
export function migrateConfig(et: EtCode, cfg: CteConfig): boolean {
    if (cfg.legacyDisposition === undefined) return false;
    const d = dispOf(cfg.legacyDisposition);
    cfg.dispNormal = d && !d.group ? [d.code] : [];
    cfg.dispPersist = persistGroups(et, cfg.bizStep);
    delete cfg.legacyDisposition;
    return true;
}
/** F6 AC-15: bổ sung nhóm persistent còn thiếu theo bảng 4.4 */
export function autoFixPersist(c: Cte, v: CteVersion) {
    v.config.dispPersist = [...new Set([...v.config.dispPersist, ...persistGroups(c.et, v.config.bizStep)])];
}
/** Tóm tắt lớp 4 cho danh sách, VD "3 · 1 nhóm persistent" */
export const dispSummary = (cfg: CteConfig) =>
    cfg.legacyDisposition !== undefined ? cfg.legacyDisposition || "—"
        : `${cfg.dispNormal.length}${cfg.dispPersist.length ? ` · ${cfg.dispPersist.length} nhóm persistent` : ""}`;
export const groupLabel = (g: string) => `${PERSIST_GROUPS[g] ?? g} (${groupCodes(g).join(" / ")})`;

/* ---------- Cross-layer validation (F-M5-F6 AC-02 → AC-07) ---------- */
export interface Issue { level: "error" | "warn"; layer: number; msg: string; fix?: "persist" }
export function validateCte(c: Pick<Cte, "et" | "parentConfig">, cfg: CteConfig): Issue[] {
    const out: Issue[] = [];
    const et = c.et;
    if (!cfg.bizStep) out.push({ level: "error", layer: 2, msg: "Lớp 2 — chưa chọn bizStep." });
    if (et !== "ET-03" && !cfg.action) out.push({ level: "error", layer: 3, msg: "Lớp 3 — chưa có action." });
    else {
        const fit = bizStepOf(cfg.bizStep)?.fit[et];
        if (!fit) out.push({ level: "error", layer: 2, msg: `bizStep "${cfg.bizStep}" không tương thích ${etOf(et).epcis}.` });
        else if (fit === "warn") out.push({ level: "warn", layer: 2, msg: `bizStep "${cfg.bizStep}" ít dùng với ${etOf(et).epcis}.` });
    }
    if (cfg.bizStep && et !== "ET-03" && cfg.action && !suggestAction(et, cfg.bizStep).includes(cfg.action))
        out.push({ level: "warn", layer: 3, msg: `action ${cfg.action} lệch khuyến nghị (${suggestAction(et, cfg.bizStep).join(" / ")}) cho bizStep ${cfg.bizStep}.` });
    if (cfg.legacyDisposition !== undefined) out.push({ level: "error", layer: 4, msg: "Lớp 4 — disposition đang ở cấu trúc cũ, cần rà soát lại theo dạng danh sách." });
    else {
        const missing = persistGroups(et, cfg.bizStep).filter((g) => !cfg.dispPersist.includes(g));
        missing.forEach((g) => out.push({ level: "error", layer: 4, fix: "persist", msg: `Lớp 4 — bizStep ${cfg.bizStep} yêu cầu nhóm persistent ${groupLabel(g)}. (BR-M5-16)` }));
        if (!cfg.dispNormal.length && !cfg.dispPersist.length) out.push({ level: "warn", layer: 4, msg: "CTE không có disposition — doanh nghiệp sẽ không khai báo trạng thái ở sự kiện này." });
    }
    if (et === "ET-04" && cfg.bizTxTypes.length === 0) out.push({ level: "error", layer: 5, msg: "TransactionEvent yêu cầu chọn ≥1 loại giao dịch ở lớp 5." });
    if (et === "ET-01" && !cfg.kdes.some((x) => x.code === "epcList" || x.code === "quantityList"))
        out.push({ level: "error", layer: 6, msg: "ObjectEvent yêu cầu epcList hoặc quantityList." });
    cfg.kdes.forEach((x) => {
        const d = EVENT_KDES.find((e) => e.code === x.code);
        if (d && !d.allow.includes(et)) out.push({ level: "error", layer: 6, msg: `KDE '${x.code}' không tương thích ${etOf(et).epcis}.` });
    });
    if (cfg.ilmd.length && !ilmdAllowed(et, cfg.action))
        out.push({ level: "error", layer: 6, msg: `ilmd không được phép khi action = ${cfg.action}. Xoá cấu hình ilmd hoặc đổi action thành ADD.` });
    const auto = autoKdes(et, cfg.action);
    if (cfg.kdes.filter((x) => !auto.includes(x.code)).length === 0)
        out.push({ level: "error", layer: 6, msg: "Cần chọn ít nhất 1 KDE ngoài các trường tự động bắt buộc." });
    // AD-06: Sở chỉ thêm chặt hơn Bộ
    if (c.parentConfig) {
        const p = c.parentConfig;
        if (p.action !== cfg.action || p.bizStep !== cfg.bizStep)
            out.push({ level: "error", layer: 2, msg: "Không được phép thay đổi ET, action hoặc bizStep của CTE kế thừa từ Bộ (AD-06)." });
        const extra = cfg.dispNormal.filter((d) => !p.dispNormal.includes(d));
        if (extra.length) out.push({ level: "error", layer: 4, msg: `Cấp Sở chỉ được thu hẹp danh sách disposition của CTE cấp Bộ — không thêm ${extra.join(", ")}. (AD-06)` });
        if (p.dispPersist.some((g) => !cfg.dispPersist.includes(g))) out.push({ level: "error", layer: 4, msg: "Không thể bỏ disposition persistent. (AD-06, BR-M5-16)" });
        p.kdes.filter((x) => x.required).forEach((x) => {
            const mine = cfg.kdes.find((y) => y.code === x.code);
            if (!mine || !mine.required) out.push({ level: "error", layer: 6, msg: `KDE '${x.code}' là required theo CTE cấp Bộ. Cấp Sở chỉ thêm, không bớt (AD-06).` });
        });
    }
    return out;
}

/* ---------- Publish lifecycle (F-M5-F6 AC-08 → AC-14) ---------- */
export function publishVersion(c: Cte, v: CteVersion, date?: string) {
    const act = vActive(c);
    if (!act) {
        v.status = "active";
        v.effectiveFrom = TODAY;
        return;
    }
    const sch = vScheduled(c);
    if (sch) {
        sch.status = "superseded";
        sch.cancelled = true;
        sch.effectiveTo = TODAY;
        sch.replacedBy = v.v;
    }
    v.status = "scheduled";
    v.effectiveFrom = date!;
}
/** Mô phỏng scheduled job tới ngày áp dụng (AC-10) */
export function applyScheduled(c: Cte) {
    const sch = vScheduled(c);
    if (!sch) return;
    const act = vActive(c);
    if (act) {
        act.status = "superseded";
        act.effectiveTo = sch.effectiveFrom;
        act.replacedBy = sch.v;
    }
    sch.status = "active";
}
export function cancelScheduled(c: Cte) {
    const sch = vScheduled(c);
    if (!sch) return;
    sch.status = "superseded";
    sch.cancelled = true;
    sch.effectiveTo = TODAY;
}
export function newVersion(c: Cte): CteVersion {
    const src = vActive(c) ?? vLatest(c);
    const v: CteVersion = { v: Math.max(...c.versions.map((x) => x.v)) + 1, status: "draft", effectiveFrom: "", effectiveTo: "", config: clone(src.config), createdAt: TODAY, createdBy: ME_USER };
    migrateConfig(c.et, v.config); // BR-M5-20: giữ nguyên danh sách, chỉ chuyển cấu trúc cũ
    c.versions.push(v);
    return v;
}
export function cloneCte(src: Cte): Cte {
    const cfg = clone((vActive(src) ?? vLatest(src)).config);
    const migrated = migrateConfig(src.et, cfg); // BR-M5-20 / QĐ-06
    const fromBo = src.level === "Bộ" && session.level === "Sở";
    const c: Cte = {
        id: nextCteId(), code: nextCteCode(), name: `${src.name} (bản sao)`, et: src.et, level: session.level, org: myOrg(),
        source: src.level === session.level ? "NEW" : "CLONED_FROM_C2", cloneSourceId: src.id, migrated,
        parentConfig: fromBo ? clone(cfg) : undefined, createdAt: TODAY,
        versions: [{ v: 1, status: "draft", effectiveFrom: "", effectiveTo: "", config: cfg, createdAt: TODAY, createdBy: ME_USER }],
    };
    ctes.unshift(c);
    return c;
}
