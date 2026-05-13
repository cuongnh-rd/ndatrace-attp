import type { CteStatus } from "./types";

export const CTE_STATUS_OPTIONS: CteStatus[] = ["Hoạt động", "Nháp", "Không hoạt động"];

export const statusLabel: Record<CteStatus, string> = {
    "Hoạt động": "Hoạt động",
    "Nháp": "Nháp",
    "Không hoạt động": "Không hoạt động",
};

export const statusVariant: Record<CteStatus, "success" | "info" | "neutral"> = {
    "Hoạt động": "success",
    "Nháp": "info",
    "Không hoạt động": "neutral",
};

export const FAMILY_OPTIONS = [
    "Nông sản",
    "Thủy sản",
    "Thực phẩm chế biến",
    "Lúa gạo",
    "Chăn nuôi",
    "Trái cây",
];

export const DATA_TYPE_LABELS: Record<string, string> = {
    string: "Chuỗi",
    number: "Số",
    boolean: "Có/Không",
    array: "Danh sách",
    object: "Đối tượng",
};
