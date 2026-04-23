export type KdeDataType = "text" | "number" | "date" | "boolean" | "enum" | "file" | "gps";
export type KdeStatus = "published" | "deprecated" | "draft";

export interface KdeField {
    version: string;
    nghi_dinh: string;
    nghi_dinh_full: string;
    co_quan: string;
    import_date: string;
    description: string;
    data_type: KdeDataType;
    unit: string;
    validation_rule: string;
    enum_options?: string[];
    is_current: boolean;
}

export interface Kde {
    code: string;
    name: string;
    status: KdeStatus;
    current_version: string;
    nhom_nganh_hang: string;
    versions: KdeField[];
}

export interface CteUsage {
    kde_code: string;
    cte_id: string;
    cte_name: string;
    layer: string;
    owner: string;
    used_version: string;
    cte_status: "active" | "draft";
}

export type DiffChange = "added" | "removed" | "changed" | "unchanged";

export interface DiffRow {
    field: string;
    label: string;
    v1: string;
    v2: string;
    change: DiffChange;
}

export type ImportChangeType = "new" | "updated" | "unchanged";

export interface ImportPreviewRow {
    code: string;
    name: string;
    data_type: KdeDataType;
    change_type: ImportChangeType;
    change_note?: string;
}
