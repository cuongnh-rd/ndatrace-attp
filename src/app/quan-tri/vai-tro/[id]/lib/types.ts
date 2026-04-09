export type RolePerm = {
    xem: boolean;
    tao: boolean;
    sua: boolean;
    xoa: boolean;
    xuat: boolean;
    phe_duyet: boolean;
};

export type AgencyMode = "allow_all" | "exclude" | "allow_only";

export interface PartnerScope {
    mode: AgencyMode;
    excludeList: string[];
    allowList: string[];
}

export interface DataScopeState {
    agencyType: "all" | "specific";
    partnerScopes: Record<string, PartnerScope>;
    regionType: "all" | "specific";
    selectedProvinces: string[];
    provinceScopes: Record<string, string[]>; // province_id → [] = all wards | [wardId,...] = specific
    categoryType: "all" | "specific";
    selectedCategories: string[];
    categoryScopes: Record<string, string[]>; // parent_id → [] = all children | [childId,...] = specific
}

export interface RoleInfo {
    id: string;
    ten: string;
    mo_ta: string;
    so_nguoi: number;
    scope_configured: boolean;
}

export const permCols: { key: keyof RolePerm; label: string }[] = [
    { key: "xem", label: "Xem" },
    { key: "tao", label: "Tạo" },
    { key: "sua", label: "Sửa" },
    { key: "xoa", label: "Xóa" },
    { key: "xuat", label: "Xuất" },
    { key: "phe_duyet", label: "Phê duyệt" },
];
