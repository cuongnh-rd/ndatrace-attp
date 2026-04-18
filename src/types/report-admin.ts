// Report admin types
export type Verdict = "confirmed_risk" | "likely_risk" | "insufficient_evidence" | "no_risk" | "spam";
export type RecommendedAction = "forward_urgent" | "forward_normal" | "escalate_authority" | "close_no_action" | "reject_spam";
export type CheckStatus = "ok" | "warning" | "danger" | "unknown";

export interface AdminForm {
    evidence_quality: string;
    description_consistency: string;
    location_consistency: string;
    admin_assessment: string;
    verdict: Verdict | "";
    recommended_action: RecommendedAction | "";
    override_reason: string;
}

export interface CheckItemData {
    status: CheckStatus;
    value: string;
}

export interface ChecksResult {
    product: CheckItemData;
    uid: CheckItemData;
    cert: CheckItemData;
    inspection: CheckItemData;
    relatedReports: CheckItemData;
    violations: CheckItemData;
    scanResult: CheckItemData;
}
