import type { KdeDataType, KdeStatus } from "./types";

export const DATA_TYPES: KdeDataType[] = ["text", "number", "date", "boolean", "enum", "file", "gps"];

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
    text: "text",
    number: "number",
    date: "date",
    boolean: "boolean",
    enum: "enum",
    file: "file",
    gps: "gps",
};
