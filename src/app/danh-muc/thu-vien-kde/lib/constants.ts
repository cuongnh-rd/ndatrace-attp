import type { KdeDataType, KdeStatus } from "./types";

export const DATA_TYPES: KdeDataType[] = ["string", "boolean", "array", "object"];

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
    boolean: "boolean",
    array: "array",
    object: "object",
};
