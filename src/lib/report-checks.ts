import { CheckStatus, ChecksResult } from "@/types/report-admin";
import { ProductReport, ReportVerification } from "@/lib/mock-data";

export function deriveChecks(
    report: ProductReport,
    v: ReportVerification | undefined
): ChecksResult {
    if (!v) {
        // fallback: generate from report data
        return {
            product: {
                status: "ok" as CheckStatus,
                value: "Sản phẩm đang hoạt động",
            },
            uid: { status: "unknown" as CheckStatus, value: "Không có dữ liệu UID" },
            cert: {
                status: "unknown" as CheckStatus,
                value: "Không có dữ liệu chứng chỉ",
            },
            inspection: {
                status: "unknown" as CheckStatus,
                value: "Không có dữ liệu kiểm tra",
            },
            relatedReports: {
                status: "ok" as CheckStatus,
                value: "Không có báo cáo trùng",
            },
            violations: {
                status: "ok" as CheckStatus,
                value: "Không có tiền sử vi phạm",
            },
            scanResult: {
                status: (report.scan_result === "fake"
                    ? "danger"
                    : report.scan_result === "suspicious"
                        ? "warning"
                        : report.scan_result === "authentic"
                            ? "ok"
                            : "unknown") as CheckStatus,
                value:
                    report.scan_result === "fake"
                        ? "Kết quả: Hàng giả"
                        : report.scan_result === "suspicious"
                            ? "Kết quả: Nghi ngờ"
                            : report.scan_result === "authentic"
                                ? "Kết quả: Xác thực"
                                : "Chưa có kết quả",
            },
        };
    }

    const product: { status: CheckStatus; value: string } = {
        status: v.product_exists
            ? v.product_status === "Thu hồi"
                ? "danger"
                : "ok"
            : "danger",
        value: v.product_exists
            ? `Sản phẩm ${v.product_status}`
            : "Sản phẩm không tồn tại trên hệ thống",
    };

    const uidScanHigh = v.uid_scan_count > 10;
    const uidRevoked = v.uid_status === "revoked";
    const uid: { status: CheckStatus; value: string } = {
        status: uidRevoked ? "danger" : uidScanHigh ? "warning" : "ok",
        value: `UID ${v.uid_status} — đã quét ${v.uid_scan_count} lần (quét gần nhất: ${v.uid_last_scan_location})`,
    };

    const certExpired =
        v.certificate_status === "expired" || v.certificate_status === "none";
    const certExpiring = v.certificate_status === "expiring";
    const cert: { status: CheckStatus; value: string } = {
        status: certExpired ? "danger" : certExpiring ? "warning" : "ok",
        value: certExpired
            ? `Giấy CN ATTP ${v.certificate_status === "none" ? "không có" : "đã hết hạn"} (${v.certificate_expiry})`
            : `Giấy CN ATTP còn hiệu lực — hết hạn ${new Date(v.certificate_expiry).toLocaleDateString("vi-VN")}`,
    };

    const inspFail = v.recent_inspection_result === "Không đạt";
    const inspCond = v.recent_inspection_result === "Đạt có điều kiện";
    const inspection: { status: CheckStatus; value: string } = {
        status: inspFail ? "danger" : inspCond ? "warning" : "ok",
        value: `${v.recent_inspection_result} (${new Date(v.recent_inspection_date).toLocaleDateString("vi-VN")})`,
    };

    const relatedReports: { status: CheckStatus; value: string } = {
        status: v.related_reports_count >= 3 ? "warning" : "ok",
        value: `${v.related_reports_count} báo cáo cùng GTIN trong 30 ngày${v.related_reports_same_sgtin > 0 ? ` (${v.related_reports_same_sgtin} trùng SGTIN)` : ""}`,
    };

    const violations: { status: CheckStatus; value: string } = {
        status:
            v.partner_violation_history >= 2
                ? "danger"
                : v.partner_violation_history >= 1
                    ? "warning"
                    : "ok",
        value:
            v.partner_violation_history > 0
                ? `${v.partner_violation_history} lần vi phạm ATTP trong 12 tháng`
                : "Không có tiền sử vi phạm",
    };

    const scanResult: { status: CheckStatus; value: string } = {
        status:
            report.scan_result === "fake"
                ? "danger"
                : report.scan_result === "suspicious"
                    ? "warning"
                    : report.scan_result === "authentic"
                        ? "ok"
                        : "unknown",
        value:
            report.scan_result === "fake"
                ? "Kết quả thuật toán: Hàng giả"
                : report.scan_result === "suspicious"
                    ? "Kết quả thuật toán: Nghi ngờ"
                    : report.scan_result === "authentic"
                        ? "Kết quả thuật toán: Xác thực"
                        : "Chưa có kết quả",
    };

    return {
        product,
        uid,
        cert,
        inspection,
        relatedReports,
        violations,
        scanResult,
    };
}
