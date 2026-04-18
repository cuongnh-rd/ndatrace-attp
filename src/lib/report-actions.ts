import { Verdict, RecommendedAction } from "@/types/report-admin";

export function suggestAction(
    verdict: Verdict,
    riskScore: number,
    scanResult: string
): RecommendedAction {
    if (verdict === "spam") return "reject_spam";
    if (verdict === "no_risk") return "close_no_action";
    if (verdict === "insufficient_evidence") return "close_no_action";
    if (verdict === "likely_risk") return "forward_normal";
    if (verdict === "confirmed_risk" && scanResult === "fake")
        return "escalate_authority";
    if (verdict === "confirmed_risk")
        return riskScore >= 70 ? "forward_urgent" : "forward_normal";
    return "close_no_action";
}

export const actionConfig: Record<
    RecommendedAction,
    { label: string; desc: string; color: string; btnClass: string }
> = {
    forward_urgent: {
        label: "Chuyển tiếp khẩn cho doanh nghiệp",
        desc: "Yêu cầu DN xử lý trong 24 giờ",
        color: "text-blue-700",
        btnClass: "bg-brand-600 hover:bg-brand-700 text-white",
    },
    forward_normal: {
        label: "Chuyển tiếp doanh nghiệp",
        desc: "Yêu cầu DN xử lý theo SLA tiêu chuẩn",
        color: "text-blue-600",
        btnClass: "bg-brand-600 hover:bg-brand-700 text-white",
    },
    escalate_authority: {
        label: "Chuyển cơ quan chức năng",
        desc: "Chuyển QLTT / Công an kinh tế xử lý",
        color: "text-red-700",
        btnClass: "bg-red-600 hover:bg-red-700 text-white",
    },
    close_no_action: {
        label: "Đóng báo cáo",
        desc: "Không có rủi ro, đóng và ghi chú kết quả",
        color: "text-gray-700",
        btnClass:
            "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200",
    },
    reject_spam: {
        label: "Từ chối (Spam)",
        desc: "Đánh dấu báo cáo là spam",
        color: "text-red-600",
        btnClass:
            "bg-white dark:bg-gray-900 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
    },
};

export const verdictLabels: Record<Verdict, string> = {
    confirmed_risk: "Xác nhận rủi ro",
    likely_risk: "Có khả năng rủi ro",
    insufficient_evidence: "Không đủ bằng chứng",
    no_risk: "Không có rủi ro",
    spam: "Spam / Sai mục đích",
};
