export type KdeDataType = "string" | "boolean" | "array" | "object";
export type KdeStatus = "Hoạt động" | "Ngừng hoạt động" | "Nháp";
export type StringFormat = "none" | "date" | "time" | "datetime" | "email";

export interface StringRule {
    format: StringFormat;
    min_length?: number;
    max_length?: number;
}

export interface ArrayRule {
    item_type: "string" | "enum";
    enum_options?: string[];
}

export interface KdeChild {
    code: string;
    name: string;
    data_type: KdeDataType;
    required: boolean;
    string_rule?: StringRule;
    array_rule?: ArrayRule;
    object_rule?: ObjectRule;
}

export interface ObjectRule {
    children: KdeChild[];
}

export type KdeDataRule =
    | { type: "string"; rule: StringRule }
    | { type: "boolean"; rule: null }
    | { type: "array"; rule: ArrayRule }
    | { type: "object"; rule: ObjectRule };

export interface KdeField {
    version: string;
    nghi_dinh: string;
    nghi_dinh_full: string;
    import_date: string;
    description: string;
    data_type: KdeDataType;
    unit: string;
    validation_rule: string;
    enum_options?: string[];
    data_rule?: KdeDataRule;
    is_current: boolean;
}

export interface Kde {
    code: string;
    name: string;
    status: KdeStatus;
    current_version: string;
    nhom_thong_tin: string[];
    versions: KdeField[];
}

export interface CteUsage {
    kde_code: string;
    cte_id: string;
    cte_name: string;
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
