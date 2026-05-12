import { scopeCompanies } from "@/lib/mock-data";

// ─── Types ───────────────────────────────────────────────────────────────────

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

export type RolePerm = {
  xem: boolean;
  tao: boolean;
  sua: boolean;
  xoa: boolean;
  xuat: boolean;
  phe_duyet: boolean;
};

// ─── Permission modules ───────────────────────────────────────────────────────

export const modules: { name: string; roles: Record<string, RolePerm> }[] = [
  {
    name: "Doanh nghiệp",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: true },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
  {
    name: "Cơ sở",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
  {
    name: "Sản phẩm",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
  {
    name: "Sự kiện truy xuất",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Tem nhãn (UID/QR)",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Chứng chỉ",
    roles: {
      "super-admin": { xem: true, tao: false, sua: true, xoa: false, xuat: false, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: true },
      "so-tinh-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: true },
      "dai-ly-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Báo cáo",
    roles: {
      "super-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
  {
    name: "Quản trị người dùng",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "so-tinh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Tích hợp API",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Báo cáo sản phẩm",
    roles: {
      "super-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: true },
      "bo-ban-nganh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: true },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
];

export const permSections: { label: string; moduleNames: string[] }[] = [
  { label: "Truy xuất nguồn gốc", moduleNames: ["Doanh nghiệp", "Cơ sở", "Sản phẩm", "Sự kiện truy xuất", "Tem nhãn (UID/QR)", "Báo cáo sản phẩm"] },
  { label: "Quản lý ATTP", moduleNames: ["Chứng chỉ"] },
  { label: "Báo cáo thống kê", moduleNames: ["Báo cáo"] },
  { label: "Quản trị hệ thống", moduleNames: ["Quản trị người dùng"] },
  { label: "Tích hợp hệ thống", moduleNames: ["Tích hợp API"] },
];

export const permCols: { key: keyof RolePerm; label: string }[] = [
  { key: "xem", label: "Xem" },
  { key: "tao", label: "Tạo" },
  { key: "sua", label: "Sửa" },
  { key: "xoa", label: "Xóa" },
  { key: "xuat", label: "Xuất" },
  { key: "phe_duyet", label: "Phê duyệt" },
];

// ─── Default scopes per role ──────────────────────────────────────────────────

export const defaultScopes: Record<string, DataScopeState> = {
  "super-admin": {
    agencyType: "all", partnerScopes: {},
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "all", selectedCategories: [], categoryScopes: {},
  },
  "bo-ban-nganh-admin": {
    agencyType: "all", partnerScopes: {},
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "all", selectedCategories: [], categoryScopes: {},
  },
  "bo-ban-nganh-ops": {
    agencyType: "all", partnerScopes: {},
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "specific", selectedCategories: ["NS001"], categoryScopes: {},
  },
  "so-tinh-admin": {
    agencyType: "all", partnerScopes: {},
    regionType: "specific", selectedProvinces: ["HN"], provinceScopes: {},
    categoryType: "all", selectedCategories: [], categoryScopes: {},
  },
  "so-tinh-ops": {
    agencyType: "all", partnerScopes: {},
    regionType: "specific", selectedProvinces: ["HN"], provinceScopes: {},
    categoryType: "specific", selectedCategories: ["NS001"], categoryScopes: {},
  },
  "dai-ly-admin": {
    agencyType: "specific",
    partnerScopes: { "DT001": { mode: "allow_all", excludeList: [], allowList: [] } },
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "specific", selectedCategories: ["NS001"], categoryScopes: {},
  },
  "dai-ly-ops": {
    agencyType: "specific",
    partnerScopes: { "DT001": { mode: "allow_all", excludeList: [], allowList: [] } },
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "specific", selectedCategories: ["NS001"], categoryScopes: {},
  },
};

export const emptyScope: DataScopeState = {
  agencyType: "all", partnerScopes: {},
  regionType: "all", selectedProvinces: [], provinceScopes: {},
  categoryType: "all", selectedCategories: [], categoryScopes: {},
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPartnerCompanies(partnerId: string) {
  return scopeCompanies.filter((c) => c.doi_tac_id === partnerId);
}

export function getModeLabel(ps: PartnerScope, totalDn: number): string {
  if (ps.mode === "allow_all") return `${totalDn}/${totalDn}`;
  if (ps.mode === "exclude") return `${totalDn - ps.excludeList.length}/${totalDn} (−${ps.excludeList.length})`;
  return `${ps.allowList.length} chỉ định`;
}
