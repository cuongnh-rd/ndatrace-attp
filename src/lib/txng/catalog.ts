/**
 * Danh mục tham chiếu cho CTE Builder (F-M5) — mock dữ liệu C1:
 * Event Type (F-M1), bizStep / disposition / bizTransactionType (F-M4), KDE theo ET (F-M3).
 */

export type EtCode = "ET-01" | "ET-02" | "ET-03" | "ET-04" | "ET-05";
export type Action = "ADD" | "OBSERVE" | "DELETE";
export type Fit = "ok" | "warn";

export interface EventType {
    code: EtCode;
    epcis: string;
    name: string;
    desc: string;
    active: boolean;
}

export const EVENT_TYPES: EventType[] = [
    { code: "ET-01", epcis: "ObjectEvent", name: "Ghi nhận trạng thái", desc: "Ghi nhận việc xảy ra với sản phẩm / lô: tạo định danh, thu hoạch, vận chuyển, kiểm tra…", active: true },
    { code: "ET-02", epcis: "AggregationEvent", name: "Đóng gói, tách, hợp nhất", desc: "Đóng gói sản phẩm vào thùng, pallet hoặc tách ra", active: true },
    { code: "ET-03", epcis: "TransformationEvent", name: "Chuyển đổi, chế biến", desc: "Đầu vào bị tiêu thụ để tạo ra đầu ra mới (sơ chế, chế biến, phối trộn)", active: true },
    { code: "ET-04", epcis: "TransactionEvent", name: "Liên kết giao dịch thương mại", desc: "Gắn sản phẩm với chứng từ giao dịch: đơn hàng, hoá đơn, vận đơn", active: true },
    { code: "ET-05", epcis: "AssociationEvent", name: "Thiết lập quan hệ định danh", desc: "Gắn thiết bị (cảm biến, tag) với đối tượng", active: true },
];
export const etOf = (code: EtCode) => EVENT_TYPES.find((e) => e.code === code)!;
/** Tên hiển thị theo thuật ngữ NĐ 372: tên Việt trước, thuật ngữ chuẩn trong ngoặc */
export const etLabel = (code: EtCode) => `${etOf(code).name} (${etOf(code).epcis})`;

export const ACTIONS: { code: Action; name: string; desc: string }[] = [
    { code: "ADD", name: "Thêm mới", desc: "Đối tượng bắt đầu tồn tại / được thêm vào (tạo định danh, thu hoạch, đóng gói)" },
    { code: "OBSERVE", name: "Ghi nhận", desc: "Quan sát đối tượng đã tồn tại, không thay đổi (vận chuyển, kiểm tra)" },
    { code: "DELETE", name: "Kết thúc", desc: "Đối tượng kết thúc vòng đời / bị gỡ ra (tiêu huỷ, tách gói)" },
];

/** Bảng 3.3 — bizStep × ET. Không có trong map = ❌ (ẩn). */
export interface BizStep { code: string; name: string; fit: Partial<Record<EtCode, Fit>> }
export const BIZ_STEPS: BizStep[] = [
    { code: "commissioning", name: "Kích hoạt mã UID", fit: { "ET-01": "ok", "ET-03": "ok", "ET-05": "warn" } },
    { code: "harvesting", name: "Thu hoạch", fit: { "ET-01": "ok" } },
    { code: "creating_class_instance", name: "Tạo lô sản phẩm", fit: { "ET-01": "ok", "ET-03": "ok" } },
    { code: "transforming", name: "Chế biến / sơ chế", fit: { "ET-03": "ok" } },
    { code: "packing", name: "Đóng gói", fit: { "ET-01": "ok", "ET-02": "ok", "ET-03": "warn" } },
    { code: "unpacking", name: "Mở gói / tách", fit: { "ET-02": "ok", "ET-01": "warn" } },
    { code: "loading", name: "Xếp hàng lên phương tiện", fit: { "ET-01": "ok", "ET-02": "ok" } },
    { code: "shipping", name: "Xuất hàng / vận chuyển", fit: { "ET-01": "ok", "ET-02": "ok", "ET-04": "ok" } },
    { code: "receiving", name: "Tiếp nhận", fit: { "ET-01": "ok", "ET-02": "ok", "ET-04": "ok" } },
    { code: "storing", name: "Lưu kho / bảo quản", fit: { "ET-01": "ok", "ET-02": "warn" } },
    { code: "inspecting", name: "Kiểm tra chất lượng", fit: { "ET-01": "ok", "ET-02": "warn" } },
    { code: "collecting", name: "Thu gom", fit: { "ET-01": "ok", "ET-02": "warn" } },
    { code: "accepting", name: "Chấp nhận giao dịch", fit: { "ET-04": "ok", "ET-01": "warn" } },
    { code: "retail_selling", name: "Bán lẻ", fit: { "ET-01": "ok", "ET-04": "ok" } },
    { code: "destroying", name: "Tiêu huỷ", fit: { "ET-01": "ok" } },
    { code: "installing", name: "Gắn thiết bị", fit: { "ET-05": "ok" } },
    { code: "sensor_reporting", name: "Ghi nhận cảm biến", fit: { "ET-01": "ok", "ET-05": "ok" } },
];
export const bizStepOf = (code: string) => BIZ_STEPS.find((b) => b.code === code);

/** Bảng 3.4 — action khuyến nghị theo bizStep × ET (giá trị đầu là mặc định) */
const ACTION_BY: Record<string, Action[]> = {
    commissioning: ["ADD"], harvesting: ["ADD"], creating_class_instance: ["ADD"], installing: ["ADD"],
    packing: ["ADD", "OBSERVE"], unpacking: ["DELETE"], loading: ["OBSERVE", "ADD"],
    shipping: ["OBSERVE"], receiving: ["OBSERVE"], storing: ["OBSERVE"], inspecting: ["OBSERVE"],
    collecting: ["OBSERVE", "ADD"], accepting: ["ADD", "OBSERVE"], retail_selling: ["OBSERVE"],
    destroying: ["DELETE", "OBSERVE"], sensor_reporting: ["OBSERVE"],
};
/** ET-01 packing là đóng gói tại chỗ → OBSERVE; ET-02 packing gộp vào thùng → ADD */
const ACTION_BY_ET: Record<string, Action[]> = { "ET-01|packing": ["OBSERVE"], "ET-04|shipping": ["ADD", "OBSERVE"], "ET-04|receiving": ["ADD", "OBSERVE"] };
export const suggestAction = (et: EtCode, bizStep: string): Action[] =>
    et === "ET-03" ? [] : ACTION_BY_ET[`${et}|${bizStep}`] ?? ACTION_BY[bizStep] ?? ["OBSERVE"];

/** Danh mục disposition CBV 2.0 (chỉ giá trị chuẩn — BR-M5-19). group = nhóm persistent loại trừ nhau. */
export interface Disposition { code: string; name: string; group?: string }
export const DISPOSITIONS: Disposition[] = [
    { code: "active", name: "Đang lưu thông" },
    { code: "in_progress", name: "Đang xử lý" },
    { code: "in_transit", name: "Đang vận chuyển" },
    { code: "sellable_accessible", name: "Sẵn sàng bán" },
    { code: "sellable_not_accessible", name: "Bán được nhưng chưa tiếp cận" },
    { code: "non_sellable_other", name: "Không bán được (khác)" },
    { code: "container_closed", name: "Đã niêm phong" },
    { code: "container_open", name: "Đã mở niêm phong" },
    { code: "encoded", name: "Đã mã hoá định danh" },
    { code: "damaged", name: "Hư hỏng" },
    { code: "expired", name: "Hết hạn" },
    { code: "needs_replacement", name: "Cần thay thế" },
    { code: "returned", name: "Bị trả lại" },
    { code: "recalled", name: "Bị thu hồi" },
    { code: "stolen", name: "Bị mất cắp" },
    { code: "unknown", name: "Không xác định" },
    { code: "destroyed", name: "Đã tiêu huỷ" },
    { code: "disposed", name: "Đã thải bỏ" },
    { code: "conformant", name: "Đạt", group: "inspection" },
    { code: "non_conformant", name: "Không đạt", group: "inspection" },
    { code: "completeness_verified", name: "Đủ hàng — đã kiểm đếm", group: "completeness" },
    { code: "completeness_inferred", name: "Đủ hàng — suy luận", group: "completeness" },
];
export const dispOf = (code: string) => DISPOSITIONS.find((d) => d.code === code);
export const PERSIST_GROUPS: Record<string, string> = { inspection: "Kết quả kiểm định", completeness: "Kiểm tra đủ hàng" };
export const groupCodes = (g: string) => DISPOSITIONS.filter((d) => d.group === g).map((d) => d.code);

/** Bảng 4.4 — disposition thường gợi ý theo ET + bizStep (phần tử đầu = 🔵 mặc định, còn lại ⚪). */
const DISP_SUGGEST: Record<string, string[]> = {
    "ET-01|commissioning": ["active", "encoded"],
    "ET-01|harvesting": ["active", "in_progress"],
    "ET-01|creating_class_instance": ["active"],
    "ET-01|packing": ["active", "container_closed"],
    "ET-02|packing": ["in_progress", "container_closed"],
    "ET-03|packing": ["active"],
    "ET-02|unpacking": ["active", "container_open"],
    "ET-01|loading": ["in_transit"],
    "ET-02|loading": ["in_transit"],
    "ET-01|shipping": ["in_transit", "active"],
    "ET-02|shipping": ["in_transit"],
    "ET-04|shipping": ["in_transit"],
    "ET-01|receiving": ["active", "sellable_accessible", "damaged"],
    "ET-02|receiving": ["active"],
    "ET-04|receiving": ["active"],
    "ET-01|storing": ["active", "sellable_accessible"],
    "ET-01|inspecting": ["damaged", "expired"],
    "ET-02|inspecting": ["damaged"],
    "ET-01|collecting": ["in_progress"],
    "ET-04|accepting": ["active"],
    "ET-01|retail_selling": ["sellable_accessible"],
    "ET-04|retail_selling": ["sellable_accessible"],
    "ET-01|destroying": ["destroyed", "disposed"],
    "ET-03|transforming": ["active", "disposed", "destroyed"],
    "ET-03|commissioning": ["active"],
    "ET-03|creating_class_instance": ["active"],
};
export const suggestDisp = (et: EtCode, bizStep: string) => DISP_SUGGEST[`${et}|${bizStep}`] ?? [];
/** Bảng 4.4 — nhóm persistent bắt buộc theo ET + bizStep (BR-M5-16) */
const PERSIST_REQ: Record<string, string[]> = { "ET-01|inspecting": ["inspection"], "ET-02|inspecting": ["inspection"] };
export const persistGroups = (et: EtCode, bizStep: string) => PERSIST_REQ[`${et}|${bizStep}`] ?? [];

export const BIZ_TX_TYPES: { code: string; name: string }[] = [
    { code: "po", name: "Đơn đặt hàng" },
    { code: "poc", name: "Xác nhận đơn hàng" },
    { code: "desadv", name: "Thông báo giao hàng" },
    { code: "recadv", name: "Thông báo nhận hàng" },
    { code: "inv", name: "Hóa đơn" },
    { code: "bol", name: "Vận đơn" },
    { code: "prodorder", name: "Lệnh sản xuất" },
    { code: "pedigree", name: "Hồ sơ phả hệ" },
    { code: "rma", name: "Phiếu trả hàng" },
];

/** KDE của sự kiện (F-M3) — allow: ET dùng được; auto: ET tự động bắt buộc. */
export interface EventKde { code: string; name: string; allow: EtCode[]; auto?: EtCode[] }
const ALL: EtCode[] = ["ET-01", "ET-02", "ET-03", "ET-04", "ET-05"];
export const EVENT_KDES: EventKde[] = [
    { code: "eventTime", name: "Thời điểm sự kiện", allow: ALL, auto: ALL },
    { code: "eventTimeZoneOffset", name: "Múi giờ", allow: ALL, auto: ALL },
    { code: "epcList", name: "Định danh đối tượng (mã sản phẩm / lô)", allow: ["ET-01", "ET-04"], auto: ["ET-01"] },
    { code: "quantityList", name: "Số lượng theo lớp sản phẩm", allow: ["ET-01", "ET-02", "ET-04"] },
    { code: "parentID", name: "Đơn vị đóng gói cha (thùng / pallet)", allow: ["ET-02", "ET-04", "ET-05"], auto: ["ET-02", "ET-05"] }, // ET-02: chỉ auto khi action ≠ OBSERVE
    { code: "childEPCs", name: "Đối tượng con được gộp / tách", allow: ["ET-02"] },
    { code: "inputEPCList", name: "Đầu vào bị tiêu thụ", allow: ["ET-03"], auto: ["ET-03"] },
    { code: "inputQuantityList", name: "Số lượng đầu vào", allow: ["ET-03"] },
    { code: "outputEPCList", name: "Đầu ra được tạo mới", allow: ["ET-03"], auto: ["ET-03"] },
    { code: "outputQuantityList", name: "Số lượng đầu ra", allow: ["ET-03"] },
    { code: "readPoint", name: "Điểm ghi nhận", allow: ALL },
    { code: "bizLocation", name: "Địa điểm diễn ra sự kiện", allow: ALL },
    { code: "sourceList", name: "Nơi gửi", allow: ["ET-01", "ET-02", "ET-03", "ET-04"] },
    { code: "destinationList", name: "Nơi nhận", allow: ["ET-01", "ET-02", "ET-03", "ET-04"] },
    { code: "bizTransactionList", name: "Chứng từ giao dịch (PO, hoá đơn, vận đơn)", allow: ALL, auto: ["ET-04"] },
    { code: "sensorElementList", name: "Dữ liệu cảm biến nhiệt độ / độ ẩm", allow: ALL },
    { code: "certificationInfo", name: "Chứng nhận áp dụng (VietGAP, HACCP…)", allow: ALL },
    { code: "gs1:growingArea", name: "Mã vùng trồng / vùng nuôi", allow: ["ET-01", "ET-03"] },
    { code: "gs1:performedBy", name: "Người thực hiện", allow: ALL },
    { code: "gs1:dispositionReason", name: "Lý do xử lý", allow: ["ET-01", "ET-02"] },
];
export const kdeOf = (code: string) => EVENT_KDES.find((k) => k.code === code) ?? ILMD_FIELDS.find((k) => k.code === code);

/** Trường ilmd (thông tin cấp lô) — chỉ ET-01 + ADD hoặc ET-03. */
export const ILMD_FIELDS: { code: string; name: string }[] = [
    { code: "lotNumber", name: "Số lô sản xuất" },
    { code: "productionDate", name: "Ngày sản xuất" },
    { code: "bestBeforeDate", name: "Sử dụng tốt nhất trước" },
    { code: "itemExpirationDate", name: "Hạn sử dụng" },
    { code: "harvestDate", name: "Ngày thu hoạch" },
    { code: "countryOfOrigin", name: "Xuất xứ" },
];
export const ilmdAllowed = (et: EtCode, action: Action | null) => et === "ET-03" || (et === "ET-01" && action === "ADD");

export const CERT_TYPES = ["VietGAP", "GlobalGAP", "HACCP", "ISO 22000", "Hữu cơ (TCVN 11041)", "Chứng nhận kiểm dịch"];
export const SENSOR_TYPES: { code: string; name: string; uom: string }[] = [
    { code: "temperature", name: "Nhiệt độ", uom: "CEL" },
    { code: "relative_humidity", name: "Độ ẩm tương đối", uom: "A93" },
];

export interface Family { id: string; name: string; bo: string[] }
export const ME_BO = "Bộ Nông nghiệp và Môi trường";
export const FAMILIES: Family[] = [
    { id: "rau", name: "Rau ăn lá", bo: [ME_BO] },
    { id: "ts", name: "Thủy sản nuôi", bo: [ME_BO, "Bộ Y tế"] },
    { id: "gao", name: "Gạo", bo: [ME_BO] },
    { id: "che", name: "Chè", bo: [ME_BO] },
    { id: "qua", name: "Trái cây tươi", bo: [ME_BO, "Bộ Công Thương"] },
    { id: "thit", name: "Thịt gia súc, gia cầm", bo: [ME_BO, "Bộ Y tế"] },
];
export const famOf = (id: string) => FAMILIES.find((f) => f.id === id)!;

/** Thư viện KDE bổ sung — Bộ thêm vào công đoạn của quy trình. */
export interface LibKde { code: string; name: string; map?: string; ilmd?: boolean; gdsn?: boolean }
export const LIB_KDES: LibKde[] = [
    { code: "ndatrace:growingArea", name: "Mã vùng trồng / vùng nuôi", map: "gs1:growingArea" },
    { code: "ndatrace:phiInterval", name: "Số ngày cách ly thuốc BVTV" },
    { code: "ndatrace:vehiclePlate", name: "Biển số phương tiện vận chuyển" },
    { code: "ndatrace:storageTemp", name: "Nhiệt độ bảo quản yêu cầu" },
    { code: "ndatrace:harvestMethod", name: "Phương thức thu hoạch / đánh bắt" },
    { code: "ndatrace:pondId", name: "Mã ao / lồng nuôi" },
    { code: "ndatrace:labResult", name: "Kết quả kiểm nghiệm" },
    { code: "ndatrace:feedLot", name: "Lô thức ăn chăn nuôi / thủy sản đã dùng" },
    { code: "ndatrace:quarantineCert", name: "Số giấy chứng nhận kiểm dịch" },
    { code: "ndatrace:harvestTime", name: "Thời gian thu hoạch", map: "eventTime" },
    { code: "gs1:hasBatchLotNumber", name: "Số lô sản xuất", map: "lotNumber", ilmd: true },
    { code: "gs1:itemExpirationDate", name: "Hạn sử dụng", map: "itemExpirationDate", ilmd: true },
    { code: "gs1:productionDate", name: "Ngày sản xuất", map: "productionDate", ilmd: true },
    { code: "gdsn:ingredientStatement", name: "Thành phần sản phẩm", gdsn: true },
    { code: "gdsn:brandName", name: "Thương hiệu", gdsn: true },
    { code: "sensorElementList", name: "Dữ liệu cảm biến nhiệt độ / độ ẩm", map: "sensorElementList" },
];
export const libOf = (code: string) => LIB_KDES.find((k) => k.code === code);
export const fieldName = (code: string) => kdeOf(code)?.name ?? libOf(code)?.name ?? code;

/* ---------- Nhãn hiển thị: "Tên Việt (thuật ngữ)" ---------- */
const lbl = (name: string | undefined, code: string) => (name ? `${name} (${code})` : code);
export const actLabel = (a: Action) => lbl(ACTIONS.find((x) => x.code === a)?.name, a);
export const bizLabel = (code: string) => lbl(bizStepOf(code)?.name, code);
export const dispLabel = (code: string) => lbl(dispOf(code)?.name, code);
export const txLabel = (code: string) => lbl(BIZ_TX_TYPES.find((x) => x.code === code)?.name, code);
export const fieldLabel = (code: string) => lbl(fieldName(code) === code ? undefined : fieldName(code), code);
/** Tên các lớp cấu hình theo thuật ngữ NĐ 372 */
export const LAYER_NAMES = ["Loại sự kiện", "Công đoạn nghiệp vụ (bizStep)", "Tác động lên đối tượng (action)", "Trạng thái sản phẩm (disposition)", "Chứng từ liên quan (bizTransaction)", "Dữ liệu sự kiện (KDE)", "Cấu hình bổ sung"];
