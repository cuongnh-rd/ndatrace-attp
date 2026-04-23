import type { KdeDataType, KdeStatus } from "./types";

export const DATA_TYPES: KdeDataType[] = ["text", "number", "date", "boolean", "enum", "file", "gps"];

export const STATUS_OPTIONS: KdeStatus[] = ["published", "deprecated", "draft"];

export const statusLabel: Record<KdeStatus, string> = {
    published: "Đang áp dụng",
    deprecated: "Deprecated",
    draft: "Nháp",
};

export const statusVariant: Record<KdeStatus, "success" | "neutral" | "info"> = {
    published: "success",
    deprecated: "neutral",
    draft: "info",
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
