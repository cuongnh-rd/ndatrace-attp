"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, XCircle, AlertCircle, Image as ImageIcon,
  MapPin, Calendar, Phone, User, Package, Building2, QrCode,
  ChevronRight, Save, RotateCcw, ExternalLink,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import {
  productReports,
  reportVerifications,
  reportTypeLabels,
  priorityConfig,
  reportStatusConfig,
  type ReportStatus,
  type ProductReport,
  type ReportVerification,
} from "@/lib/mock-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type Verdict = "confirmed_risk" | "likely_risk" | "insufficient_evidence" | "no_risk" | "spam";
type RecommendedAction = "forward_urgent" | "forward_normal" | "escalate_authority" | "close_no_action" | "reject_spam";

interface AdminForm {
  evidence_quality: string;
  description_consistency: string;
  location_consistency: string;
  admin_assessment: string;
  verdict: Verdict | "";
  recommended_action: RecommendedAction | "";
  override_reason: string;
}

// ─── Decision matrix ──────────────────────────────────────────────────────────

function suggestAction(verdict: Verdict, riskScore: number, scanResult: string): RecommendedAction {
  if (verdict === "spam") return "reject_spam";
  if (verdict === "no_risk") return "close_no_action";
  if (verdict === "insufficient_evidence") return "close_no_action";
  if (verdict === "likely_risk") return "forward_normal";
  if (verdict === "confirmed_risk" && scanResult === "fake") return "escalate_authority";
  if (verdict === "confirmed_risk") return riskScore >= 70 ? "forward_urgent" : "forward_normal";
  return "close_no_action";
}

// ─── Risk gauge SVG ───────────────────────────────────────────────────────────

function RiskGauge({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  // Arc: half circle, radius=60, strokeWidth=12
  const r = 60;
  const cx = 80;
  const cy = 80;
  const circumference = Math.PI * r; // half circle
  const dashOffset = circumference * (1 - clampedScore / 100);

  const color =
    clampedScore >= 70 ? "#ef4444" :
    clampedScore >= 40 ? "#f97316" :
    clampedScore >= 20 ? "#eab308" :
                         "#22c55e";

  const label =
    clampedScore >= 70 ? "Rủi ro cao" :
    clampedScore >= 40 ? "Rủi ro trung bình" :
    clampedScore >= 20 ? "Rủi ro thấp" :
                         "Không có rủi ro";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="160" height="90" viewBox="0 0 160 90">
        {/* Background track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Color zones */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${dashOffset}`}
          style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
        />
        {/* Score text */}
        <text x={cx} y={cy - 8} textAnchor="middle" className="fill-gray-900 dark:fill-white" fontSize="28" fontWeight="700" fill="currentColor">
          {clampedScore}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fill="#9ca3af">
          / 100
        </text>
      </svg>
      <p className="text-sm font-semibold" style={{ color }}>{label}</p>
    </div>
  );
}

// ─── Checklist item ───────────────────────────────────────────────────────────

type CheckStatus = "ok" | "warning" | "danger" | "unknown";

function CheckItem({
  label, value, status,
}: { label: string; value: string; status: CheckStatus }) {
  const icon =
    status === "ok"      ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" /> :
    status === "warning" ? <AlertCircle  size={16} className="text-amber-500 flex-shrink-0" /> :
    status === "danger"  ? <XCircle      size={16} className="text-red-500 flex-shrink-0" /> :
                           <AlertCircle  size={16} className="text-gray-400 flex-shrink-0" />;
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5 leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ─── Helper: derive check status from verification data ───────────────────────

function deriveChecks(report: ProductReport, v: ReportVerification | undefined) {
  if (!v) {
    // fallback: generate from report data
    return {
      product: { status: "ok" as CheckStatus, value: "Sản phẩm đang hoạt động" },
      uid: { status: "unknown" as CheckStatus, value: "Không có dữ liệu UID" },
      cert: { status: "unknown" as CheckStatus, value: "Không có dữ liệu chứng chỉ" },
      inspection: { status: "unknown" as CheckStatus, value: "Không có dữ liệu kiểm tra" },
      relatedReports: { status: "ok" as CheckStatus, value: "Không có báo cáo trùng" },
      violations: { status: "ok" as CheckStatus, value: "Không có tiền sử vi phạm" },
      scanResult: {
        status: (report.scan_result === "fake" ? "danger" : report.scan_result === "suspicious" ? "warning" : report.scan_result === "authentic" ? "ok" : "unknown") as CheckStatus,
        value: report.scan_result === "fake" ? "Kết quả: Hàng giả" : report.scan_result === "suspicious" ? "Kết quả: Nghi ngờ" : report.scan_result === "authentic" ? "Kết quả: Xác thực" : "Chưa có kết quả",
      },
    };
  }

  const product: { status: CheckStatus; value: string } = {
    status: v.product_exists ? (v.product_status === "Thu hồi" ? "danger" : "ok") : "danger",
    value: v.product_exists ? `Sản phẩm ${v.product_status}` : "Sản phẩm không tồn tại trên hệ thống",
  };

  const uidScanHigh = v.uid_scan_count > 10;
  const uidRevoked = v.uid_status === "revoked";
  const uid: { status: CheckStatus; value: string } = {
    status: uidRevoked ? "danger" : uidScanHigh ? "warning" : "ok",
    value: `UID ${v.uid_status} — đã quét ${v.uid_scan_count} lần (quét gần nhất: ${v.uid_last_scan_location})`,
  };

  const certExpired = v.certificate_status === "expired" || v.certificate_status === "none";
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
    status: v.partner_violation_history >= 2 ? "danger" : v.partner_violation_history >= 1 ? "warning" : "ok",
    value: v.partner_violation_history > 0
      ? `${v.partner_violation_history} lần vi phạm ATTP trong 12 tháng`
      : "Không có tiền sử vi phạm",
  };

  const scanResult: { status: CheckStatus; value: string } = {
    status: report.scan_result === "fake" ? "danger" : report.scan_result === "suspicious" ? "warning" : report.scan_result === "authentic" ? "ok" : "unknown",
    value: report.scan_result === "fake" ? "Kết quả thuật toán: Hàng giả" : report.scan_result === "suspicious" ? "Kết quả thuật toán: Nghi ngờ" : report.scan_result === "authentic" ? "Kết quả thuật toán: Xác thực" : "Chưa có kết quả",
  };

  return { product, uid, cert, inspection, relatedReports, violations, scanResult };
}

// ─── Action config ────────────────────────────────────────────────────────────

const actionConfig: Record<RecommendedAction, { label: string; desc: string; color: string; btnClass: string }> = {
  forward_urgent:       { label: "Chuyển tiếp khẩn cho doanh nghiệp", desc: "Yêu cầu DN xử lý trong 24 giờ",              color: "text-blue-700",  btnClass: "bg-brand-600 hover:bg-brand-700 text-white" },
  forward_normal:       { label: "Chuyển tiếp doanh nghiệp",          desc: "Yêu cầu DN xử lý theo SLA tiêu chuẩn",       color: "text-blue-600",  btnClass: "bg-brand-600 hover:bg-brand-700 text-white" },
  escalate_authority:   { label: "Chuyển cơ quan chức năng",          desc: "Chuyển QLTT / Công an kinh tế xử lý",        color: "text-red-700",   btnClass: "bg-red-600 hover:bg-red-700 text-white" },
  close_no_action:      { label: "Đóng báo cáo",                      desc: "Không có rủi ro, đóng và ghi chú kết quả",   color: "text-gray-700",  btnClass: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200" },
  reject_spam:          { label: "Từ chối (Spam)",                     desc: "Đánh dấu báo cáo là spam",                  color: "text-red-600",   btnClass: "bg-white dark:bg-gray-900 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" },
};

const verdictLabels: Record<Verdict, string> = {
  confirmed_risk:        "Xác nhận rủi ro",
  likely_risk:           "Có khả năng rủi ro",
  insufficient_evidence: "Không đủ bằng chứng",
  no_risk:               "Không có rủi ro",
  spam:                  "Spam / Sai mục đích",
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const report = productReports.find((r) => r.id === reportId);
  const verification = reportVerifications.find((v) => v.report_id === reportId);

  const [form, setForm] = useState<AdminForm>({
    evidence_quality: "",
    description_consistency: "",
    location_consistency: "",
    admin_assessment: "",
    verdict: "",
    recommended_action: "",
    override_reason: "",
  });
  const [isOverriding, setIsOverriding] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const suggestedAction = useMemo<RecommendedAction | null>(() => {
    if (!form.verdict || !report) return null;
    return suggestAction(form.verdict as Verdict, report.risk_score, report.scan_result);
  }, [form.verdict, report]);

  const effectiveAction = (isOverriding && form.recommended_action ? form.recommended_action : suggestedAction) as RecommendedAction | null;
  const isOverrideDetected = isOverriding && effectiveAction !== suggestedAction;

  if (!report) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-gray-400">Không tìm thấy báo cáo</div>
      </DashboardLayout>
    );
  }

  const checks = deriveChecks(report, verification);
  const priCfg = priorityConfig[report.priority];
  const statusCfg = reportStatusConfig[report.status];
  const canEdit = report.status === "submitted";

  function handleVerdictChange(v: Verdict | "") {
    setForm((f) => ({ ...f, verdict: v, recommended_action: "", override_reason: "" }));
    setIsOverriding(false);
  }

  function handleSubmit() {
    if (!form.admin_assessment.trim() || !form.verdict) return;
    setShowConfirmModal(true);
  }

  function confirmSubmit() {
    setShowConfirmModal(false);
    setSubmitted(true);
  }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 mb-3 transition-colors"
        >
          <ArrowLeft size={15} />
          Quay lại danh sách
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Phiếu xác minh #{report.report_code}
              </h1>
              <Badge variant={priCfg.variant}>{priCfg.label}</Badge>
              <Badge variant={submitted ? "success" : statusCfg.variant}>
                {submitted ? "Đã xác minh" : statusCfg.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tiếp nhận {new Date(report.created_at).toLocaleString("vi-VN")} •{" "}
              {reportTypeLabels[report.report_type]}
            </p>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {submitted && (
        <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-300">
          <CheckCircle2 size={16} />
          <span>Đã ghi nhận kết quả xác minh. Báo cáo đã được xử lý theo quyết định của bạn.</span>
        </div>
      )}

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Cột trái: Thông tin báo cáo từ người dân ── */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Thông tin người báo cáo</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Số điện thoại</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{report.reporter_phone}</p>
                </div>
              </div>
              {report.reporter_name && (
                <div className="flex items-center gap-3">
                  <User size={15} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Họ tên</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{report.reporter_name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Thông tin sản phẩm</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Package size={15} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Tên sản phẩm</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{report.product_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <QrCode size={15} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">GTIN</p>
                  <p className="font-mono text-sm text-gray-700 dark:text-gray-300">{report.gtin}</p>
                </div>
              </div>
              {report.sgtin && (
                <div className="flex items-center gap-3">
                  <QrCode size={15} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">SGTIN</p>
                    <p className="font-mono text-xs text-gray-600 dark:text-gray-400">{report.sgtin}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Building2 size={15} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Doanh nghiệp</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{report.partner_name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Nội dung báo cáo</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Loại:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {reportTypeLabels[report.report_type]}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{report.description}</p>
              {/* Evidence placeholder */}
              {report.evidence_count > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">{report.evidence_count} ảnh bằng chứng</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: Math.min(report.evidence_count, 3) }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <ImageIcon size={18} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Vị trí & Mua hàng</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Nơi mua</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{report.purchase_location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={15} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Ngày mua</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(report.purchase_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cột giữa: Kết quả kiểm tra tự động ── */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Kết quả kiểm tra tự động</p>
            </div>
            <div className="p-5">
              <CheckItem label="Sản phẩm tồn tại trên hệ thống" value={checks.product.value}   status={checks.product.status} />
              <CheckItem label="Trạng thái UID"                   value={checks.uid.value}       status={checks.uid.status} />
              <CheckItem label="Giấy chứng nhận ATTP"             value={checks.cert.value}      status={checks.cert.status} />
              <CheckItem label="Kiểm tra ATTP gần nhất"           value={checks.inspection.value} status={checks.inspection.status} />
              <CheckItem label="Số báo cáo trùng GTIN"            value={checks.relatedReports.value} status={checks.relatedReports.status} />
              <CheckItem label="Tiền sử vi phạm doanh nghiệp"     value={checks.violations.value} status={checks.violations.status} />
              <CheckItem label="Kết quả thuật toán xác thực"      value={checks.scanResult.value} status={checks.scanResult.status} />
            </div>
          </div>

          {/* Risk gauge */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Điểm rủi ro tổng hợp</p>
            </div>
            <div className="p-5 flex flex-col items-center">
              <RiskGauge score={verification?.risk_score ?? report.risk_score} />
              <div className="w-full mt-4 grid grid-cols-4 gap-1 text-center">
                {([["0–19", "bg-green-500"], ["20–39", "bg-yellow-400"], ["40–69", "bg-orange-400"], ["70–100", "bg-red-500"]] as [string, string][]).map(([range, bg]) => (
                  <div key={range} className="flex flex-col items-center gap-1">
                    <div className={`w-full h-1.5 rounded-full ${bg}`} />
                    <span className="text-[10px] text-gray-400">{range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-sm text-gray-600 dark:text-gray-300 hover:text-brand-700 dark:hover:text-brand-300">
                <span>Xem lịch sử hành trình sản phẩm</span>
                <ExternalLink size={13} className="flex-shrink-0" />
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-sm text-gray-600 dark:text-gray-300 hover:text-brand-700 dark:hover:text-brand-300">
                <span>Xem kết quả kiểm tra ATTP gần nhất</span>
                <ExternalLink size={13} className="flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Cột phải: Đánh giá của Admin ── */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Đánh giá thủ công</p>
            </div>
            <div className="p-5 space-y-4">
              {/* evidence_quality */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Chất lượng bằng chứng</label>
                <select
                  value={form.evidence_quality}
                  onChange={(e) => setForm((f) => ({ ...f, evidence_quality: e.target.value }))}
                  disabled={!canEdit || submitted}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">-- Chọn --</option>
                  <option value="clear">Rõ ràng</option>
                  <option value="blurry">Mờ / Khó đọc</option>
                  <option value="irrelevant">Không liên quan</option>
                  <option value="none">Không có ảnh</option>
                </select>
              </div>

              {/* description_consistency */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Mô tả nhất quán</label>
                <select
                  value={form.description_consistency}
                  onChange={(e) => setForm((f) => ({ ...f, description_consistency: e.target.value }))}
                  disabled={!canEdit || submitted}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">-- Chọn --</option>
                  <option value="consistent">Nhất quán</option>
                  <option value="inconsistent">Không nhất quán</option>
                  <option value="vague">Mơ hồ / Thiếu chi tiết</option>
                </select>
              </div>

              {/* location_consistency */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Vị trí khớp vùng phân phối</label>
                <select
                  value={form.location_consistency}
                  onChange={(e) => setForm((f) => ({ ...f, location_consistency: e.target.value }))}
                  disabled={!canEdit || submitted}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">-- Chọn --</option>
                  <option value="match">Khớp</option>
                  <option value="mismatch">Không khớp</option>
                  <option value="unknown">Không xác định</option>
                </select>
              </div>

              {/* verdict */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Kết luận xác minh <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.verdict}
                  onChange={(e) => handleVerdictChange(e.target.value as Verdict | "")}
                  disabled={!canEdit || submitted}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">-- Chọn kết luận --</option>
                  {(Object.keys(verdictLabels) as Verdict[]).map((v) => (
                    <option key={v} value={v}>{verdictLabels[v]}</option>
                  ))}
                </select>
              </div>

              {/* admin_assessment */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Nhận định tổng thể <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Nhập nhận định của bạn về báo cáo này..."
                  value={form.admin_assessment}
                  onChange={(e) => setForm((f) => ({ ...f, admin_assessment: e.target.value }))}
                  disabled={!canEdit || submitted}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 disabled:opacity-50 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Recommended action box */}
          {suggestedAction && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Hành động đề xuất</p>
              </div>
              <div className="p-5 space-y-3">
                {!isOverriding ? (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                        {actionConfig[suggestedAction].label}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                        {actionConfig[suggestedAction].desc}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>Bạn đang ghi đè đề xuất hệ thống. Vui lòng nhập lý do bên dưới.</span>
                    </div>
                    <select
                      value={form.recommended_action}
                      onChange={(e) => setForm((f) => ({ ...f, recommended_action: e.target.value as RecommendedAction }))}
                      disabled={submitted}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">-- Chọn hành động --</option>
                      <option value="forward_urgent">Chuyển tiếp khẩn cho doanh nghiệp</option>
                      <option value="forward_normal">Chuyển tiếp doanh nghiệp</option>
                      <option value="escalate_authority">Chuyển cơ quan chức năng</option>
                      <option value="close_no_action">Đóng báo cáo</option>
                      <option value="reject_spam">Từ chối (Spam)</option>
                    </select>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        Lý do ghi đè <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Lý do thay đổi hành động so với đề xuất..."
                        value={form.override_reason}
                        onChange={(e) => setForm((f) => ({ ...f, override_reason: e.target.value }))}
                        disabled={submitted}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </>
                )}

                {canEdit && !submitted && (
                  <button
                    onClick={() => setIsOverriding((v) => !v)}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={12} />
                    {isOverriding ? "Quay lại đề xuất hệ thống" : "Ghi đè hành động"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {canEdit && !submitted && effectiveAction && (
            <div className="space-y-2">
              {/* Primary action */}
              <button
                onClick={handleSubmit}
                disabled={!form.admin_assessment.trim() || !form.verdict || (isOverriding && !form.recommended_action)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${actionConfig[effectiveAction].btnClass}`}
              >
                <Save size={15} />
                {actionConfig[effectiveAction].label}
                <ChevronRight size={14} />
              </button>
              {!form.admin_assessment.trim() && (
                <p className="text-xs text-gray-400 text-center">Vui lòng nhập nhận định tổng thể để tiếp tục</p>
              )}
            </div>
          )}

          {/* Read-only state */}
          {(!canEdit || submitted) && (
            <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 text-center">
              {submitted ? "Báo cáo đã được xác minh" : "Báo cáo ở trạng thái không thể chỉnh sửa"}
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Xác nhận hành động"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bạn sắp thực hiện:{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {effectiveAction ? actionConfig[effectiveAction].label : ""}
            </span>
          </p>
          {isOverrideDetected && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>Hành động này khác với đề xuất hệ thống và sẽ được ghi vào Audit Log kèm lý do ghi đè.</span>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">Thao tác này sẽ được ghi nhận và không thể hoàn tác.</p>
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={confirmSubmit}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
