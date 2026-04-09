import type { DataScopeState } from "./types";

export const permSections = [
    {
        label: "Truy xuất nguồn gốc",
        moduleNames: ["Doanh nghiệp", "Cơ sở", "Sản phẩm", "Sự kiện truy xuất", "Tem nhãn (UID/QR)", "Báo cáo sản phẩm"],
    },
    {
        label: "Quản lý ATTP",
        moduleNames: ["Chứng chỉ"],
    },
    {
        label: "Báo cáo thống kê",
        moduleNames: ["Báo cáo"],
    },
    {
        label: "Quản trị hệ thống",
        moduleNames: ["Quản trị người dùng"],
    },
    {
        label: "Tích hợp hệ thống",
        moduleNames: ["Tích hợp API"],
    },
];

export const defaultScopes: Record<string, DataScopeState> = {
    // Quản trị quốc gia — toàn hệ thống, không giới hạn
    "super-admin": {
        agencyType: "all",
        partnerScopes: {},
        regionType: "all",
        selectedProvinces: [],
        provinceScopes: {},
        categoryType: "all",
        selectedCategories: [],
        categoryScopes: {},
    },
    // Bộ ban ngành Admin — toàn quốc, toàn ngành
    "bo-ban-nganh-admin": {
        agencyType: "all",
        partnerScopes: {},
        regionType: "all",
        selectedProvinces: [],
        provinceScopes: {},
        categoryType: "all",
        selectedCategories: [],
        categoryScopes: {},
    },
    // Bộ ban ngành Ops — lọc theo ngành hàng được gán (VD: Bộ NN&PTNT → Nông sản thực phẩm)
    "bo-ban-nganh-ops": {
        agencyType: "all",
        partnerScopes: {},
        regionType: "all",
        selectedProvinces: [],
        provinceScopes: {},
        categoryType: "specific",
        selectedCategories: ["NS001"],
        categoryScopes: {},
    },
    // Sở tỉnh Admin — lọc theo tỉnh được gán (VD: Sở NN&PTNT Hà Nội)
    "so-tinh-admin": {
        agencyType: "all",
        partnerScopes: {},
        regionType: "specific",
        selectedProvinces: ["HN"],
        provinceScopes: {},
        categoryType: "all",
        selectedCategories: [],
        categoryScopes: {},
    },
    // Sở tỉnh Ops — lọc theo tỉnh + ngành hàng (VD: cán bộ Sở HN - nông sản)
    "so-tinh-ops": {
        agencyType: "all",
        partnerScopes: {},
        regionType: "specific",
        selectedProvinces: ["HN"],
        provinceScopes: {},
        categoryType: "specific",
        selectedCategories: ["NS001"],
        categoryScopes: {},
    },
    // Đại lý Admin — phạm vi đại lý của mình (VD: Đại lý Hà Nội - AgriLink)
    "dai-ly-admin": {
        agencyType: "specific",
        partnerScopes: { "DT001": { mode: "allow_all", excludeList: [], allowList: [] } },
        regionType: "all",
        selectedProvinces: [],
        provinceScopes: {},
        categoryType: "specific",
        selectedCategories: ["NS001"],
        categoryScopes: {},
    },
    // Đại lý Ops — thừa hưởng từ admin đại lý
    "dai-ly-ops": {
        agencyType: "specific",
        partnerScopes: { "DT001": { mode: "allow_all", excludeList: [], allowList: [] } },
        regionType: "all",
        selectedProvinces: [],
        provinceScopes: {},
        categoryType: "specific",
        selectedCategories: ["NS001"],
        categoryScopes: {},
    },
};

export const emptyScope: DataScopeState = {
    agencyType: "all",
    partnerScopes: {},
    regionType: "all",
    selectedProvinces: [],
    provinceScopes: {},
    categoryType: "all",
    selectedCategories: [],
    categoryScopes: {},
};
