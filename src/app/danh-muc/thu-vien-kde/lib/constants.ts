import type { KdeDataType, KdeStatus, StringFormat } from "./types";

export const DATA_TYPES: KdeDataType[] = ["string", "number", "boolean", "array", "object"];

export const STATUS_OPTIONS: KdeStatus[] = ["Hoạt động", "Ngừng hoạt động", "Nháp"];

export const statusLabel: Record<KdeStatus, string> = {
    "Hoạt động": "Hoạt động",
    "Ngừng hoạt động": "Ngừng hoạt động",
    "Nháp": "Nháp",
};

export const statusVariant: Record<KdeStatus, "success" | "neutral" | "info"> = {
    "Hoạt động": "success",
    "Ngừng hoạt động": "neutral",
    "Nháp": "info",
};

export const dataTypeLabel: Record<KdeDataType, string> = {
    string: "string",
    number: "number",
    boolean: "boolean",
    array: "array",
    object: "object",
};

export const STRING_FORMAT_OPTIONS: { value: StringFormat; label: string }[] = [
    { value: "none", label: "Tuỳ chỉnh" },
    { value: "date", label: "Ngày (date)" },
    { value: "time", label: "Giờ (time)" },
    { value: "datetime", label: "Ngày & Giờ (datetime)" },
    { value: "email", label: "Email" },
];
