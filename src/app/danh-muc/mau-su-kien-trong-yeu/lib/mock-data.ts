import type {
    CteTemplate,
    CteEvent,
    KdeCteMapping,
    CteVersionHistory,
    KdeLibraryItem,
    L1Template,
    CteNotification,
} from "./types";

// ---------------------------------------------------------------------------
// KDE Library (simplified snapshot — sourced from Thư viện KDE Layer 1)
// ---------------------------------------------------------------------------
export const kdeLibrary: KdeLibraryItem[] = [
    { id: "kde-001", code: "HARVEST_DATE",    name: "Ngày thu hoạch",            data_type: "string",  current_version: 2, status: "Hoạt động", description: "Ngày thực hiện thu hoạch sản phẩm tại vùng trồng" },
    { id: "kde-002", code: "LOT_NUMBER",      name: "Số lô sản xuất",            data_type: "string",  current_version: 1, status: "Hoạt động", description: "Mã định danh lô sản xuất do nhà máy cấp" },
    { id: "kde-003", code: "PRODUCER_ID",     name: "Mã nhà sản xuất",           data_type: "string",  current_version: 2, status: "Hoạt động", description: "Mã định danh doanh nghiệp sản xuất trong hệ thống quốc gia" },
    { id: "kde-004", code: "WEIGHT_NET",      name: "Khối lượng tịnh",           data_type: "number",  current_version: 1, status: "Hoạt động", description: "Khối lượng thực phẩm không bao bì (kg)" },
    { id: "kde-005", code: "STORAGE_METHOD",  name: "Phương thức bảo quản",      data_type: "array",   current_version: 2, status: "Hoạt động", description: "Phương pháp bảo quản trong chuỗi cung ứng" },
    { id: "kde-006", code: "EXPIRY_DATE",     name: "Ngày hết hạn sử dụng",      data_type: "string",  current_version: 1, status: "Hoạt động", description: "Ngày sản phẩm hết hạn ghi trên bao bì" },
    { id: "kde-007", code: "GPS_LOCATION",    name: "Tọa độ địa lý",             data_type: "object",  current_version: 2, status: "Hoạt động", description: "Vị trí GPS tại thời điểm khai báo sự kiện" },
    { id: "kde-008", code: "TEMPERATURE",     name: "Nhiệt độ vận chuyển",       data_type: "number",  current_version: 1, status: "Hoạt động", description: "Nhiệt độ môi trường trong quá trình vận chuyển (°C)" },
    { id: "kde-009", code: "BATCH_CODE",      name: "Mã lô hàng",               data_type: "string",  current_version: 1, status: "Hoạt động", description: "Mã định danh lô hàng phục vụ truy xuất" },
    { id: "kde-010", code: "STORAGE_TEMP",    name: "Nhiệt độ bảo quản",         data_type: "number",  current_version: 1, status: "Hoạt động", description: "Nhiệt độ bảo quản sản phẩm tại kho (°C)" },
    { id: "kde-011", code: "IS_IMPORTED",     name: "Sản phẩm nhập khẩu",        data_type: "boolean", current_version: 1, status: "Hoạt động", description: "Đánh dấu sản phẩm có nguồn gốc nhập khẩu" },
    { id: "kde-012", code: "CERTIFICATE_NO",  name: "Số giấy chứng nhận",        data_type: "string",  current_version: 1, status: "Ngừng hoạt động", description: "[Deprecated] Đã tách thành VC riêng" },
    { id: "kde-013", code: "ORGANIC_CERT",    name: "Giấy chứng nhận hữu cơ",   data_type: "string",  current_version: 1, status: "Hoạt động", description: "File scan giấy chứng nhận hữu cơ (PDF)" },
    { id: "kde-014", code: "VEHICLE_PLATE",   name: "Biển số phương tiện",       data_type: "string",  current_version: 1, status: "Hoạt động", description: "Biển số xe vận chuyển hàng hoá" },
    { id: "kde-015", code: "PACKAGING_TYPE",  name: "Loại bao bì",              data_type: "string",  current_version: 1, status: "Hoạt động", description: "Chất liệu và quy cách bao bì sản phẩm" },
];

// ---------------------------------------------------------------------------
// Helper: build KDE mapping
// ---------------------------------------------------------------------------
function makeKde(
    id: string, eventId: string,
    kdeItem: KdeLibraryItem,
    kdeVersion: number,
    order: number,
    isRequired: boolean,
    note = ""
): KdeCteMapping {
    return {
        id,
        event_id: eventId,
        kde_id: kdeItem.id,
        kde_code: kdeItem.code,
        kde_name: kdeItem.name,
        kde_data_type: kdeItem.data_type,
        kde_version: kdeVersion,
        kde_current_version: kdeItem.current_version,
        display_order: order,
        is_required: isRequired,
        note,
    };
}

const k = (code: string) => kdeLibrary.find((x) => x.code === code)!;

// ---------------------------------------------------------------------------
// Template 1 — HN-CTE-001 Rau củ Hà Nội (Active v3, có KDE outdated)
// ---------------------------------------------------------------------------
const t1_e1_id = "evt-t1-01";
const t1_e2_id = "evt-t1-02";
const t1_e3_id = "evt-t1-03";

const t1Events: CteEvent[] = [
    {
        id: t1_e1_id,
        template_id: "tpl-001",
        event_code: "EVT-THU-HOACH",
        event_name: "Thu hoạch",
        display_order: 1,
        kde_mappings: [
            makeKde("km-001", t1_e1_id, k("HARVEST_DATE"),   1, 1, true,  "Ghi theo ngày dương lịch dd/MM/yyyy"),
            makeKde("km-002", t1_e1_id, k("LOT_NUMBER"),     1, 2, true,  ""),
            makeKde("km-003", t1_e1_id, k("GPS_LOCATION"),   1, 3, false, "Tọa độ khu vực trồng trọt"),
            makeKde("km-004", t1_e1_id, k("ORGANIC_CERT"),   1, 4, false, ""),
        ],
    },
    {
        id: t1_e2_id,
        template_id: "tpl-001",
        event_code: "EVT-DONG-GOI",
        event_name: "Đóng gói",
        display_order: 2,
        kde_mappings: [
            makeKde("km-005", t1_e2_id, k("LOT_NUMBER"),     1, 1, true,  ""),
            makeKde("km-006", t1_e2_id, k("WEIGHT_NET"),     1, 2, true,  "Đơn vị kg, ghi 2 chữ số thập phân"),
            makeKde("km-007", t1_e2_id, k("EXPIRY_DATE"),    1, 3, true,  ""),
            makeKde("km-008", t1_e2_id, k("PACKAGING_TYPE"), 1, 4, false, ""),
        ],
    },
    {
        id: t1_e3_id,
        template_id: "tpl-001",
        event_code: "EVT-VAN-CHUYEN",
        event_name: "Vận chuyển",
        display_order: 3,
        kde_mappings: [
            makeKde("km-009", t1_e3_id, k("BATCH_CODE"),     1, 1, true,  ""),
            makeKde("km-010", t1_e3_id, k("STORAGE_TEMP"),   1, 2, true,  "Duy trì 2–8°C trong suốt hành trình"),
            makeKde("km-011", t1_e3_id, k("STORAGE_METHOD"), 1, 3, false, ""),
            makeKde("km-012", t1_e3_id, k("VEHICLE_PLATE"),  1, 4, false, ""),
        ],
    },
];

// ---------------------------------------------------------------------------
// Template 2 — HN-CTE-002 Thủy sản Hà Nội (Active v2)
// ---------------------------------------------------------------------------
const t2_e1_id = "evt-t2-01";
const t2_e2_id = "evt-t2-02";

const t2Events: CteEvent[] = [
    {
        id: t2_e1_id,
        template_id: "tpl-002",
        event_code: "EVT-CHE-BIEN",
        event_name: "Chế biến",
        display_order: 1,
        kde_mappings: [
            makeKde("km-101", t2_e1_id, k("LOT_NUMBER"),    1, 1, true,  ""),
            makeKde("km-102", t2_e1_id, k("PRODUCER_ID"),   1, 2, true,  ""),
            makeKde("km-103", t2_e1_id, k("WEIGHT_NET"),    1, 3, true,  ""),
            makeKde("km-104", t2_e1_id, k("TEMPERATURE"),   1, 4, false, "Nhiệt độ phòng chế biến"),
        ],
    },
    {
        id: t2_e2_id,
        template_id: "tpl-002",
        event_code: "EVT-XUAT-KHO",
        event_name: "Xuất kho",
        display_order: 2,
        kde_mappings: [
            makeKde("km-105", t2_e2_id, k("BATCH_CODE"),    1, 1, true,  ""),
            makeKde("km-106", t2_e2_id, k("EXPIRY_DATE"),   1, 2, true,  ""),
            makeKde("km-107", t2_e2_id, k("IS_IMPORTED"),   1, 3, false, ""),
        ],
    },
];

// ---------------------------------------------------------------------------
// Template 3 — HN-CTE-003 Thực phẩm chế biến (Draft v1)
// ---------------------------------------------------------------------------
const t3_e1_id = "evt-t3-01";
const t3_e2_id = "evt-t3-02";

const t3Events: CteEvent[] = [
    {
        id: t3_e1_id,
        template_id: "tpl-003",
        event_code: "EVT-SAN-XUAT",
        event_name: "Sản xuất",
        display_order: 1,
        kde_mappings: [
            makeKde("km-201", t3_e1_id, k("PRODUCER_ID"),    2, 1, true,  ""),
            makeKde("km-202", t3_e1_id, k("LOT_NUMBER"),     1, 2, true,  ""),
            makeKde("km-203", t3_e1_id, k("STORAGE_METHOD"), 2, 3, false, ""),
        ],
    },
    {
        id: t3_e2_id,
        template_id: "tpl-003",
        event_code: "EVT-KIEM-TRA",
        event_name: "Kiểm tra chất lượng",
        display_order: 2,
        kde_mappings: [
            makeKde("km-204", t3_e2_id, k("IS_IMPORTED"),    1, 1, true,  ""),
            makeKde("km-205", t3_e2_id, k("CERTIFICATE_NO"), 1, 2, false, ""),
        ],
    },
];

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------
export let cteTemplates: CteTemplate[] = [
    {
        id: "tpl-001",
        vc_type: "HN-CTE-001",
        vc_type_name: "Quy trình TXNG Rau củ Hà Nội",
        family_id: "fam-001",
        family_name: "Nông sản",
        authority_level: "Provincial",
        version: 3,
        status: "Hoạt động",
        description: "Mẫu sự kiện trọng yếu áp dụng cho chuỗi truy xuất rau củ quả trên địa bàn Hà Nội, tuân thủ tiêu chuẩn VietGAP.",
        cloned_from_id: "l1-cte-non-001",
        events: t1Events,
        updated_at: "13/05/2026",
        created_by: "Nguyễn Hà Cương",
    },
    {
        id: "tpl-002",
        vc_type: "HN-CTE-002",
        vc_type_name: "Quy trình TXNG Thủy sản Hà Nội",
        family_id: "fam-002",
        family_name: "Thủy sản",
        authority_level: "Provincial",
        version: 2,
        status: "Hoạt động",
        description: "Mẫu sự kiện trọng yếu cho chuỗi thủy sản an toàn, áp dụng tại các cơ sở chế biến và phân phối thủy sản trên địa bàn Hà Nội.",
        cloned_from_id: null,
        events: t2Events,
        updated_at: "08/05/2026",
        created_by: "Nguyễn Hà Cương",
    },
    {
        id: "tpl-003",
        vc_type: "HN-CTE-003",
        vc_type_name: "Quy trình TXNG Thực phẩm Hà Nội",
        family_id: "fam-003",
        family_name: "Thực phẩm chế biến",
        authority_level: "Provincial",
        version: 1,
        status: "Nháp",
        description: "Mẫu sự kiện trọng yếu đang xây dựng cho chuỗi thực phẩm chế biến.",
        cloned_from_id: null,
        events: t3Events,
        updated_at: "10/05/2026",
        created_by: "Trần Minh Đức",
    },
];

// ---------------------------------------------------------------------------
// Version History
// ---------------------------------------------------------------------------
export const versionHistories: CteVersionHistory[] = [
    {
        id: "vh-001-v3",
        template_id: "tpl-001",
        version: 3,
        snapshot_events: t1Events,
        status: "Active",
        created_by: "Nguyễn Hà Cương",
        created_at: "13/05/2026 09:14",
    },
    {
        id: "vh-001-v2",
        template_id: "tpl-001",
        version: 2,
        snapshot_events: [
            {
                id: "snap-e1",
                template_id: "tpl-001",
                event_code: "EVT-THU-HOACH",
                event_name: "Thu hoạch",
                display_order: 1,
                kde_mappings: [
                    makeKde("s-001", "snap-e1", k("HARVEST_DATE"),  1, 1, true,  ""),
                    makeKde("s-002", "snap-e1", k("LOT_NUMBER"),    1, 2, true,  ""),
                    makeKde("s-003", "snap-e1", k("GPS_LOCATION"),  1, 3, false, ""),
                ],
            },
            {
                id: "snap-e2",
                template_id: "tpl-001",
                event_code: "EVT-DONG-GOI",
                event_name: "Đóng gói",
                display_order: 2,
                kde_mappings: [
                    makeKde("s-004", "snap-e2", k("WEIGHT_NET"),   1, 1, true, ""),
                    makeKde("s-005", "snap-e2", k("EXPIRY_DATE"),  1, 2, true, ""),
                ],
            },
        ],
        status: "Superseded",
        created_by: "Nguyễn Hà Cương",
        created_at: "01/04/2026 14:22",
    },
    {
        id: "vh-001-v1",
        template_id: "tpl-001",
        version: 1,
        snapshot_events: [
            {
                id: "snap-v1-e1",
                template_id: "tpl-001",
                event_code: "EVT-THU-HOACH",
                event_name: "Thu hoạch",
                display_order: 1,
                kde_mappings: [
                    makeKde("sv1-001", "snap-v1-e1", k("HARVEST_DATE"), 1, 1, true,  ""),
                    makeKde("sv1-002", "snap-v1-e1", k("LOT_NUMBER"),   1, 2, true,  ""),
                ],
            },
        ],
        status: "Superseded",
        created_by: "Trần Minh Đức",
        created_at: "15/02/2026 10:05",
    },
    {
        id: "vh-002-v2",
        template_id: "tpl-002",
        version: 2,
        snapshot_events: t2Events,
        status: "Active",
        created_by: "Nguyễn Hà Cương",
        created_at: "08/05/2026 11:30",
    },
    {
        id: "vh-002-v1",
        template_id: "tpl-002",
        version: 1,
        snapshot_events: [
            {
                id: "snap2-v1-e1",
                template_id: "tpl-002",
                event_code: "EVT-CHE-BIEN",
                event_name: "Chế biến",
                display_order: 1,
                kde_mappings: [
                    makeKde("sv2-001", "snap2-v1-e1", k("LOT_NUMBER"),  1, 1, true, ""),
                    makeKde("sv2-002", "snap2-v1-e1", k("WEIGHT_NET"),  1, 2, true, ""),
                ],
            },
        ],
        status: "Superseded",
        created_by: "Nguyễn Hà Cương",
        created_at: "20/03/2026 09:00",
    },
];

// ---------------------------------------------------------------------------
// L1 Templates (for Clone modal)
// ---------------------------------------------------------------------------
export const l1Templates: L1Template[] = [
    {
        id: "l1-cte-non-001",
        code: "L1-CTE-NON-001",
        name: "Rau củ quả VietGAP",
        family_name: "Nông sản",
        version: 5,
        events: [
            {
                event_code: "EVT-CANH-TAC",
                event_name: "Canh tác & Gieo trồng",
                kdes: [
                    { kde_id: "kde-001", kde_code: "HARVEST_DATE",   kde_name: "Ngày thu hoạch",      kde_data_type: "string",  kde_version: 2, is_required: true  },
                    { kde_id: "kde-007", kde_code: "GPS_LOCATION",    kde_name: "Tọa độ địa lý",       kde_data_type: "object",  kde_version: 2, is_required: false },
                    { kde_id: "kde-013", kde_code: "ORGANIC_CERT",    kde_name: "Giấy chứng nhận hữu cơ", kde_data_type: "string", kde_version: 1, is_required: false },
                ],
            },
            {
                event_code: "EVT-DONG-GOI",
                event_name: "Đóng gói & Ghi nhãn",
                kdes: [
                    { kde_id: "kde-002", kde_code: "LOT_NUMBER",     kde_name: "Số lô sản xuất",      kde_data_type: "string",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-004", kde_code: "WEIGHT_NET",      kde_name: "Khối lượng tịnh",     kde_data_type: "number",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-006", kde_code: "EXPIRY_DATE",     kde_name: "Ngày hết hạn",        kde_data_type: "string",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-009", kde_code: "BATCH_CODE",      kde_name: "Mã lô hàng",          kde_data_type: "string",  kde_version: 1, is_required: true  },
                ],
            },
            {
                event_code: "EVT-VAN-CHUYEN",
                event_name: "Vận chuyển",
                kdes: [
                    { kde_id: "kde-010", kde_code: "STORAGE_TEMP",   kde_name: "Nhiệt độ bảo quản",   kde_data_type: "number",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-005", kde_code: "STORAGE_METHOD",  kde_name: "Phương thức bảo quản", kde_data_type: "array",  kde_version: 2, is_required: false },
                ],
            },
        ],
    },
    {
        id: "l1-cte-thu-001",
        code: "L1-CTE-THU-001",
        name: "Thủy sản an toàn",
        family_name: "Thủy sản",
        version: 3,
        events: [
            {
                event_code: "EVT-CHE-BIEN",
                event_name: "Chế biến thủy sản",
                kdes: [
                    { kde_id: "kde-002", kde_code: "LOT_NUMBER",     kde_name: "Số lô sản xuất",      kde_data_type: "string",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-003", kde_code: "PRODUCER_ID",     kde_name: "Mã nhà sản xuất",     kde_data_type: "string",  kde_version: 2, is_required: true  },
                    { kde_id: "kde-004", kde_code: "WEIGHT_NET",      kde_name: "Khối lượng tịnh",     kde_data_type: "number",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-008", kde_code: "TEMPERATURE",     kde_name: "Nhiệt độ vận chuyển", kde_data_type: "number",  kde_version: 1, is_required: false },
                ],
            },
            {
                event_code: "EVT-XUAT-KHO",
                event_name: "Xuất kho",
                kdes: [
                    { kde_id: "kde-009", kde_code: "BATCH_CODE",      kde_name: "Mã lô hàng",          kde_data_type: "string",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-005", kde_code: "STORAGE_METHOD",  kde_name: "Phương thức bảo quản", kde_data_type: "array",  kde_version: 2, is_required: false },
                    { kde_id: "kde-011", kde_code: "IS_IMPORTED",      kde_name: "Sản phẩm nhập khẩu",  kde_data_type: "boolean", kde_version: 1, is_required: false },
                ],
            },
        ],
    },
    {
        id: "l1-cte-thup-001",
        code: "L1-CTE-THUP-001",
        name: "Thực phẩm chế biến",
        family_name: "Thực phẩm chế biến",
        version: 2,
        events: [
            {
                event_code: "EVT-SAN-XUAT",
                event_name: "Sản xuất",
                kdes: [
                    { kde_id: "kde-003", kde_code: "PRODUCER_ID",    kde_name: "Mã nhà sản xuất",     kde_data_type: "string",  kde_version: 2, is_required: true  },
                    { kde_id: "kde-002", kde_code: "LOT_NUMBER",      kde_name: "Số lô sản xuất",      kde_data_type: "string",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-011", kde_code: "IS_IMPORTED",     kde_name: "Sản phẩm nhập khẩu",  kde_data_type: "boolean", kde_version: 1, is_required: false },
                ],
            },
            {
                event_code: "EVT-DONG-GOI",
                event_name: "Đóng gói",
                kdes: [
                    { kde_id: "kde-004", kde_code: "WEIGHT_NET",     kde_name: "Khối lượng tịnh",     kde_data_type: "number",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-006", kde_code: "EXPIRY_DATE",    kde_name: "Ngày hết hạn",         kde_data_type: "string",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-015", kde_code: "PACKAGING_TYPE", kde_name: "Loại bao bì",          kde_data_type: "string",  kde_version: 1, is_required: false },
                ],
            },
        ],
    },
    {
        id: "l1-cte-lua-001",
        code: "L1-CTE-LUA-001",
        name: "Lúa gạo hữu cơ",
        family_name: "Lúa gạo",
        version: 2,
        events: [
            {
                event_code: "EVT-CANH-TAC",
                event_name: "Canh tác",
                kdes: [
                    { kde_id: "kde-001", kde_code: "HARVEST_DATE",  kde_name: "Ngày thu hoạch",      kde_data_type: "string",  kde_version: 2, is_required: true  },
                    { kde_id: "kde-007", kde_code: "GPS_LOCATION",  kde_name: "Tọa độ địa lý",       kde_data_type: "object",  kde_version: 2, is_required: false },
                    { kde_id: "kde-013", kde_code: "ORGANIC_CERT",  kde_name: "Giấy chứng nhận hữu cơ", kde_data_type: "string", kde_version: 1, is_required: true },
                ],
            },
            {
                event_code: "EVT-DONG-GOI",
                event_name: "Đóng gói",
                kdes: [
                    { kde_id: "kde-004", kde_code: "WEIGHT_NET",   kde_name: "Khối lượng tịnh",     kde_data_type: "number",  kde_version: 1, is_required: true  },
                    { kde_id: "kde-002", kde_code: "LOT_NUMBER",   kde_name: "Số lô sản xuất",      kde_data_type: "string",  kde_version: 1, is_required: true  },
                ],
            },
        ],
    },
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export let notifications: CteNotification[] = [
    {
        id: "notif-001",
        template_id: "tpl-001",
        template_name: "Quy trình TXNG Rau củ Hà Nội",
        family_name: "Nông sản",
        old_version: 2,
        new_version: 3,
        affected_portals: ["Vinmart TXNG Portal", "BigC Supply Chain", "Metro Vietnam"],
        created_at: "13/05/2026 09:14",
        is_read: false,
    },
    {
        id: "notif-002",
        template_id: "tpl-002",
        template_name: "Quy trình TXNG Thủy sản Hà Nội",
        family_name: "Thủy sản",
        old_version: 1,
        new_version: 2,
        affected_portals: ["Mega Market TXNG"],
        created_at: "08/05/2026 11:30",
        is_read: false,
    },
];

// ---------------------------------------------------------------------------
// Mock templates dùng cho Import modal (10 mẫu)
// ---------------------------------------------------------------------------
export const mockTemplatesForImport: CteTemplate[] = [
    {
        id: "imp-001",
        vc_type: "HN-IMP-001",
        vc_type_name: "Rau củ sạch VietGAP",
        family_id: null,
        family_name: "Nông sản",
        authority_level: "Provincial",
        version: 2,
        status: "Hoạt động",
        description: "Mẫu chuẩn cho chuỗi rau củ VietGAP",
        cloned_from_id: null,
        updated_at: "10/05/2026",
        created_by: "Nguyễn Hà Cương",
        events: (() => {
            const e1 = "imp-e1-01"; const e2 = "imp-e1-02"; const e3 = "imp-e1-03";
            return [
                { id: e1, template_id: "imp-001", event_code: "EVT-THU-HOACH", event_name: "Thu hoạch", display_order: 1, kde_mappings: [makeKde("ik-001", e1, k("HARVEST_DATE"), 2, 1, true, ""), makeKde("ik-002", e1, k("LOT_NUMBER"), 1, 2, true, ""), makeKde("ik-003", e1, k("GPS_LOCATION"), 2, 3, false, "")] },
                { id: e2, template_id: "imp-001", event_code: "EVT-DONG-GOI", event_name: "Đóng gói", display_order: 2, kde_mappings: [makeKde("ik-004", e2, k("WEIGHT_NET"), 1, 1, true, ""), makeKde("ik-005", e2, k("EXPIRY_DATE"), 1, 2, true, ""), makeKde("ik-006", e2, k("PACKAGING_TYPE"), 1, 3, false, "")] },
                { id: e3, template_id: "imp-001", event_code: "EVT-VAN-CHUYEN", event_name: "Vận chuyển", display_order: 3, kde_mappings: [makeKde("ik-007", e3, k("BATCH_CODE"), 1, 1, true, ""), makeKde("ik-008", e3, k("STORAGE_TEMP"), 1, 2, true, ""), makeKde("ik-009", e3, k("VEHICLE_PLATE"), 1, 3, false, "")] },
            ];
        })(),
    },
    {
        id: "imp-002",
        vc_type: "HN-IMP-002",
        vc_type_name: "Tôm thẻ chân trắng xuất khẩu",
        family_id: null,
        family_name: "Thủy sản",
        authority_level: "Provincial",
        version: 1,
        status: "Hoạt động",
        description: "Quy trình truy xuất tôm thẻ chân trắng xuất khẩu",
        cloned_from_id: null,
        updated_at: "08/05/2026",
        created_by: "Trần Minh Đức",
        events: (() => {
            const e1 = "imp-e2-01"; const e2 = "imp-e2-02"; const e3 = "imp-e2-03";
            return [
                { id: e1, template_id: "imp-002", event_code: "EVT-NUOI-TRONG", event_name: "Nuôi trồng", display_order: 1, kde_mappings: [makeKde("ik-011", e1, k("PRODUCER_ID"), 2, 1, true, ""), makeKde("ik-012", e1, k("GPS_LOCATION"), 2, 2, false, "")] },
                { id: e2, template_id: "imp-002", event_code: "EVT-CHE-BIEN", event_name: "Chế biến & Đông lạnh", display_order: 2, kde_mappings: [makeKde("ik-013", e2, k("LOT_NUMBER"), 1, 1, true, ""), makeKde("ik-014", e2, k("TEMPERATURE"), 1, 2, true, ""), makeKde("ik-015", e2, k("WEIGHT_NET"), 1, 3, true, "")] },
                { id: e3, template_id: "imp-002", event_code: "EVT-XUAT-KHAU", event_name: "Xuất khẩu", display_order: 3, kde_mappings: [makeKde("ik-016", e3, k("BATCH_CODE"), 1, 1, true, ""), makeKde("ik-017", e3, k("IS_IMPORTED"), 1, 2, false, "")] },
            ];
        })(),
    },
    {
        id: "imp-003",
        vc_type: "HN-IMP-003",
        vc_type_name: "Gạo ST25 hữu cơ",
        family_id: null,
        family_name: "Lúa gạo",
        authority_level: "Provincial",
        version: 1,
        status: "Hoạt động",
        description: "Mẫu truy xuất gạo ST25 đặc sản",
        cloned_from_id: null,
        updated_at: "05/05/2026",
        created_by: "Nguyễn Hà Cương",
        events: (() => {
            const e1 = "imp-e3-01"; const e2 = "imp-e3-02";
            return [
                { id: e1, template_id: "imp-003", event_code: "EVT-CANH-TAC", event_name: "Canh tác", display_order: 1, kde_mappings: [makeKde("ik-021", e1, k("HARVEST_DATE"), 2, 1, true, ""), makeKde("ik-022", e1, k("GPS_LOCATION"), 2, 2, false, ""), makeKde("ik-023", e1, k("ORGANIC_CERT"), 1, 3, true, "")] },
                { id: e2, template_id: "imp-003", event_code: "EVT-DONG-GOI", event_name: "Xay xát & Đóng gói", display_order: 2, kde_mappings: [makeKde("ik-024", e2, k("LOT_NUMBER"), 1, 1, true, ""), makeKde("ik-025", e2, k("WEIGHT_NET"), 1, 2, true, ""), makeKde("ik-026", e2, k("PACKAGING_TYPE"), 1, 3, false, "")] },
            ];
        })(),
    },
    {
        id: "imp-004",
        vc_type: "HN-IMP-004",
        vc_type_name: "Trái cây tươi xuất khẩu",
        family_id: null,
        family_name: "Trái cây",
        authority_level: "Provincial",
        version: 1,
        status: "Hoạt động",
        description: "Quy trình truy xuất trái cây tươi xuất khẩu",
        cloned_from_id: null,
        updated_at: "03/05/2026",
        created_by: "Lê Văn An",
        events: (() => {
            const e1 = "imp-e4-01"; const e2 = "imp-e4-02";
            return [
                { id: e1, template_id: "imp-004", event_code: "EVT-THU-HAI", event_name: "Thu hái", display_order: 1, kde_mappings: [makeKde("ik-031", e1, k("HARVEST_DATE"), 2, 1, true, ""), makeKde("ik-032", e1, k("PRODUCER_ID"), 2, 2, true, ""), makeKde("ik-033", e1, k("GPS_LOCATION"), 2, 3, false, "")] },
                { id: e2, template_id: "imp-004", event_code: "EVT-PHAN-LOAI", event_name: "Phân loại & Đóng gói", display_order: 2, kde_mappings: [makeKde("ik-034", e2, k("WEIGHT_NET"), 1, 1, true, ""), makeKde("ik-035", e2, k("EXPIRY_DATE"), 1, 2, true, ""), makeKde("ik-036", e2, k("BATCH_CODE"), 1, 3, true, "")] },
            ];
        })(),
    },
    {
        id: "imp-005",
        vc_type: "HN-IMP-005",
        vc_type_name: "Thịt lợn an toàn VietGAP",
        family_id: null,
        family_name: "Chăn nuôi",
        authority_level: "Provincial",
        version: 2,
        status: "Hoạt động",
        description: "Mẫu truy xuất thịt lợn sạch theo tiêu chuẩn VietGAP",
        cloned_from_id: null,
        updated_at: "01/05/2026",
        created_by: "Trần Minh Đức",
        events: (() => {
            const e1 = "imp-e5-01"; const e2 = "imp-e5-02"; const e3 = "imp-e5-03";
            return [
                { id: e1, template_id: "imp-005", event_code: "EVT-GIET-MO", event_name: "Giết mổ", display_order: 1, kde_mappings: [makeKde("ik-041", e1, k("PRODUCER_ID"), 2, 1, true, ""), makeKde("ik-042", e1, k("LOT_NUMBER"), 1, 2, true, "")] },
                { id: e2, template_id: "imp-005", event_code: "EVT-CHE-BIEN", event_name: "Chế biến", display_order: 2, kde_mappings: [makeKde("ik-043", e2, k("WEIGHT_NET"), 1, 1, true, ""), makeKde("ik-044", e2, k("TEMPERATURE"), 1, 2, true, ""), makeKde("ik-045", e2, k("STORAGE_METHOD"), 2, 3, false, "")] },
                { id: e3, template_id: "imp-005", event_code: "EVT-PHAN-PHOI", event_name: "Phân phối", display_order: 3, kde_mappings: [makeKde("ik-046", e3, k("BATCH_CODE"), 1, 1, true, ""), makeKde("ik-047", e3, k("VEHICLE_PLATE"), 1, 2, false, ""), makeKde("ik-048", e3, k("STORAGE_TEMP"), 1, 3, true, "")] },
            ];
        })(),
    },
    {
        id: "imp-006",
        vc_type: "HN-IMP-006",
        vc_type_name: "Nước mắm truyền thống",
        family_id: null,
        family_name: "Thực phẩm chế biến",
        authority_level: "Provincial",
        version: 1,
        status: "Hoạt động",
        description: "Quy trình truy xuất nước mắm truyền thống",
        cloned_from_id: null,
        updated_at: "28/04/2026",
        created_by: "Nguyễn Hà Cương",
        events: (() => {
            const e1 = "imp-e6-01"; const e2 = "imp-e6-02";
            return [
                { id: e1, template_id: "imp-006", event_code: "EVT-UY-CHIN", event_name: "Ủ chín", display_order: 1, kde_mappings: [makeKde("ik-051", e1, k("PRODUCER_ID"), 2, 1, true, ""), makeKde("ik-052", e1, k("LOT_NUMBER"), 1, 2, true, "")] },
                { id: e2, template_id: "imp-006", event_code: "EVT-DONG-GOI", event_name: "Đóng chai & Dán nhãn", display_order: 2, kde_mappings: [makeKde("ik-053", e2, k("EXPIRY_DATE"), 1, 1, true, ""), makeKde("ik-054", e2, k("BATCH_CODE"), 1, 2, true, ""), makeKde("ik-055", e2, k("PACKAGING_TYPE"), 1, 3, false, "")] },
            ];
        })(),
    },
    {
        id: "imp-007",
        vc_type: "HN-IMP-007",
        vc_type_name: "Bánh kẹo & Thực phẩm khô",
        family_id: null,
        family_name: "Thực phẩm chế biến",
        authority_level: "Provincial",
        version: 1,
        status: "Nháp",
        description: "Mẫu đang xây dựng cho ngành bánh kẹo",
        cloned_from_id: null,
        updated_at: "20/04/2026",
        created_by: "Lê Văn An",
        events: (() => {
            const e1 = "imp-e7-01"; const e2 = "imp-e7-02";
            return [
                { id: e1, template_id: "imp-007", event_code: "EVT-SAN-XUAT", event_name: "Sản xuất", display_order: 1, kde_mappings: [makeKde("ik-061", e1, k("PRODUCER_ID"), 2, 1, true, ""), makeKde("ik-062", e1, k("LOT_NUMBER"), 1, 2, true, ""), makeKde("ik-063", e1, k("IS_IMPORTED"), 1, 3, false, "")] },
                { id: e2, template_id: "imp-007", event_code: "EVT-DONG-GOI", event_name: "Đóng gói thành phẩm", display_order: 2, kde_mappings: [makeKde("ik-064", e2, k("WEIGHT_NET"), 1, 1, true, ""), makeKde("ik-065", e2, k("EXPIRY_DATE"), 1, 2, true, "")] },
            ];
        })(),
    },
    {
        id: "imp-008",
        vc_type: "HN-IMP-008",
        vc_type_name: "Rau mầm & Rau thủy canh",
        family_id: null,
        family_name: "Nông sản",
        authority_level: "Provincial",
        version: 1,
        status: "Hoạt động",
        description: "Quy trình truy xuất rau mầm và rau thủy canh",
        cloned_from_id: null,
        updated_at: "15/04/2026",
        created_by: "Nguyễn Hà Cương",
        events: (() => {
            const e1 = "imp-e8-01"; const e2 = "imp-e8-02";
            return [
                { id: e1, template_id: "imp-008", event_code: "EVT-GIEO-TRONG", event_name: "Gieo trồng", display_order: 1, kde_mappings: [makeKde("ik-071", e1, k("HARVEST_DATE"), 2, 1, true, ""), makeKde("ik-072", e1, k("GPS_LOCATION"), 2, 2, false, "")] },
                { id: e2, template_id: "imp-008", event_code: "EVT-THU-HOACH-DONG-GOI", event_name: "Thu hoạch & Đóng gói", display_order: 2, kde_mappings: [makeKde("ik-073", e2, k("LOT_NUMBER"), 1, 1, true, ""), makeKde("ik-074", e2, k("WEIGHT_NET"), 1, 2, true, ""), makeKde("ik-075", e2, k("EXPIRY_DATE"), 1, 3, true, "")] },
            ];
        })(),
    },
    {
        id: "imp-009",
        vc_type: "HN-IMP-009",
        vc_type_name: "Cá tra & Cá basa fillet",
        family_id: null,
        family_name: "Thủy sản",
        authority_level: "Provincial",
        version: 1,
        status: "Hoạt động",
        description: "Mẫu truy xuất cá tra, cá basa fillet đông lạnh",
        cloned_from_id: null,
        updated_at: "10/04/2026",
        created_by: "Trần Minh Đức",
        events: (() => {
            const e1 = "imp-e9-01"; const e2 = "imp-e9-02"; const e3 = "imp-e9-03";
            return [
                { id: e1, template_id: "imp-009", event_code: "EVT-NUOI-CA", event_name: "Nuôi cá", display_order: 1, kde_mappings: [makeKde("ik-081", e1, k("PRODUCER_ID"), 2, 1, true, ""), makeKde("ik-082", e1, k("GPS_LOCATION"), 2, 2, false, "")] },
                { id: e2, template_id: "imp-009", event_code: "EVT-FILLET-DONG-LANH", event_name: "Fillet & Đông lạnh", display_order: 2, kde_mappings: [makeKde("ik-083", e2, k("LOT_NUMBER"), 1, 1, true, ""), makeKde("ik-084", e2, k("WEIGHT_NET"), 1, 2, true, ""), makeKde("ik-085", e2, k("TEMPERATURE"), 1, 3, true, "")] },
                { id: e3, template_id: "imp-009", event_code: "EVT-XUAT-HANG", event_name: "Xuất hàng", display_order: 3, kde_mappings: [makeKde("ik-086", e3, k("BATCH_CODE"), 1, 1, true, ""), makeKde("ik-087", e3, k("STORAGE_TEMP"), 1, 2, true, ""), makeKde("ik-088", e3, k("VEHICLE_PLATE"), 1, 3, false, "")] },
            ];
        })(),
    },
    {
        id: "imp-010",
        vc_type: "HN-IMP-010",
        vc_type_name: "Sầu riêng Monthong",
        family_id: null,
        family_name: "Trái cây",
        authority_level: "Provincial",
        version: 1,
        status: "Hoạt động",
        description: "Quy trình truy xuất sầu riêng Monthong xuất khẩu",
        cloned_from_id: null,
        updated_at: "05/04/2026",
        created_by: "Nguyễn Hà Cương",
        events: (() => {
            const e1 = "imp-e10-01"; const e2 = "imp-e10-02"; const e3 = "imp-e10-03";
            return [
                { id: e1, template_id: "imp-010", event_code: "EVT-CANH-TAC", event_name: "Canh tác & Chăm sóc", display_order: 1, kde_mappings: [makeKde("ik-091", e1, k("PRODUCER_ID"), 2, 1, true, ""), makeKde("ik-092", e1, k("GPS_LOCATION"), 2, 2, false, ""), makeKde("ik-093", e1, k("ORGANIC_CERT"), 1, 3, false, "")] },
                { id: e2, template_id: "imp-010", event_code: "EVT-THU-HAI", event_name: "Thu hái", display_order: 2, kde_mappings: [makeKde("ik-094", e2, k("HARVEST_DATE"), 2, 1, true, ""), makeKde("ik-095", e2, k("LOT_NUMBER"), 1, 2, true, "")] },
                { id: e3, template_id: "imp-010", event_code: "EVT-DONG-LANH", event_name: "Làm lạnh & Đóng thùng", display_order: 3, kde_mappings: [makeKde("ik-096", e3, k("STORAGE_TEMP"), 1, 1, true, ""), makeKde("ik-097", e3, k("WEIGHT_NET"), 1, 2, true, ""), makeKde("ik-098", e3, k("BATCH_CODE"), 1, 3, true, "")] },
            ];
        })(),
    },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getTemplateById(id: string): CteTemplate | undefined {
    return cteTemplates.find((t) => t.id === id);
}

export function getVersionHistories(templateId: string): CteVersionHistory[] {
    return versionHistories
        .filter((v) => v.template_id === templateId)
        .sort((a, b) => b.version - a.version);
}

export function countOutdatedKdes(template: CteTemplate): number {
    let count = 0;
    for (const evt of template.events) {
        for (const m of evt.kde_mappings) {
            if (m.kde_version < m.kde_current_version) count++;
        }
    }
    return count;
}

export function generateVcType(): string {
    const num = cteTemplates.length + 1;
    return `HN-CTE-${String(num).padStart(3, "0")}`;
}

export function generateId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function saveTemplate(template: CteTemplate): void {
    const idx = cteTemplates.findIndex((t) => t.id === template.id);
    if (idx >= 0) {
        cteTemplates[idx] = template;
    } else {
        cteTemplates = [...cteTemplates, template];
    }
}
