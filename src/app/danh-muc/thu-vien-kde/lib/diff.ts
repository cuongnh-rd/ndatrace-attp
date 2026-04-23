import type { DiffChange, DiffRow, KdeField } from "./types";

const DIFF_FIELDS: { field: keyof KdeField; label: string }[] = [
    { field: "description", label: "Mô tả" },
    { field: "data_type", label: "Kiểu dữ liệu" },
    { field: "unit", label: "Đơn vị" },
    { field: "validation_rule", label: "Quy tắc validate" },
    { field: "enum_options", label: "Enum options" },
    { field: "nghi_dinh", label: "Nghị định" },
];

function formatValue(value: unknown): string {
    if (value === undefined || value === null) return "—";
    if (Array.isArray(value)) return value.length ? value.join(" | ") : "—";
    const str = String(value);
    return str.trim() === "" ? "—" : str;
}

function classify(a: string, b: string): DiffChange {
    if (a === b) return "unchanged";
    if (a === "—" && b !== "—") return "added";
    if (b === "—" && a !== "—") return "removed";
    return "changed";
}

export function computeDiff(v1: KdeField, v2: KdeField): DiffRow[] {
    return DIFF_FIELDS.map(({ field, label }) => {
        const a = formatValue(v1[field]);
        const b = formatValue(v2[field]);
        return { field: String(field), label, v1: a, v2: b, change: classify(a, b) };
    });
}
