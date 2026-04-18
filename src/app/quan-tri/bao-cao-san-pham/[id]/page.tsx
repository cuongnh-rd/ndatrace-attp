"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Phone,
  User,
  Package,
  QrCode,
  Building2,
  MapPin,
  Calendar,
  Save,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import RiskGauge from "../components/RiskGauge";
import CheckItem from "../components/CheckItem";
import ReportAdminForm from "../components/ReportAdminForm";
import RecommendedActionBox from "../components/RecommendedActionBox";
import ReportConfirmModal from "../components/ReportConfirmModal";
import {
  productReports,
  reportVerifications,
  reportTypeLabels,
  priorityConfig,
  reportStatusConfig,
} from "@/lib/mock-data";
import { AdminForm, RecommendedAction, Verdict } from "@/types/report-admin";
import { suggestAction, actionConfig } from "@/lib/report-actions";
import { deriveChecks } from "@/lib/report-checks";

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

  const effectiveAction = (isOverriding && form.recommended_action
    ? form.recommended_action
    : suggestedAction) as RecommendedAction | null;
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
    setForm((f) => ({
      ...f,
      verdict: v,
      recommended_action: "",
      override_reason: "",
    }));
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
          <span>
            Đã ghi nhận kết quả xác minh. Báo cáo đã được xử lý theo quyết định
            của bạn.
          </span>
        </div>
      )}

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Cột trái: Thông tin báo cáo từ người dân ── */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Thông tin người báo cáo
              </p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Số điện thoại</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {report.reporter_phone}
                  </p>
                </div>
              </div>
              {report.reporter_name && (
                <div className="flex items-center gap-3">
                  <User size={15} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Họ tên</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {report.reporter_name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Thông tin sản phẩm
              </p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Package size={15} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Tên sản phẩm</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {report.product_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <QrCode size={15} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">GTIN</p>
                  <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                    {report.gtin}
                  </p>
                </div>
              </div>
              {report.sgtin && (
                <div className="flex items-center gap-3">
                  <QrCode size={15} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">SGTIN</p>
                    <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {report.sgtin}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Building2 size={15} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Doanh nghiệp</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {report.partner_name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Nội dung báo cáo
              </p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Loại:
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {reportTypeLabels[report.report_type]}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {report.description}
              </p>
              {/* Evidence placeholder */}
              {report.evidence_count > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">
                    {report.evidence_count} ảnh bằng chứng
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({
                      length: Math.min(report.evidence_count, 3),
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Vị trí & Mua hàng
              </p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin
                  size={15}
                  className="text-gray-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-gray-400">Nơi mua</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {report.purchase_location}
                  </p>
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
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Kết quả kiểm tra tự động
              </p>
            </div>
            <div className="p-5">
              <CheckItem
                label="Sản phẩm tồn tại trên hệ thống"
                value={checks.product.value}
                status={checks.product.status}
              />
              <CheckItem
                label="Trạng thái UID"
                value={checks.uid.value}
                status={checks.uid.status}
              />
              <CheckItem
                label="Giấy chứng nhận ATTP"
                value={checks.cert.value}
                status={checks.cert.status}
              />
              <CheckItem
                label="Kiểm tra ATTP gần nhất"
                value={checks.inspection.value}
                status={checks.inspection.status}
              />
              <CheckItem
                label="Số báo cáo trùng GTIN"
                value={checks.relatedReports.value}
                status={checks.relatedReports.status}
              />
              <CheckItem
                label="Tiền sử vi phạm doanh nghiệp"
                value={checks.violations.value}
                status={checks.violations.status}
              />
              <CheckItem
                label="Kết quả thuật toán xác thực"
                value={checks.scanResult.value}
                status={checks.scanResult.status}
              />
            </div>
          </div>

          {/* Risk gauge */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Điểm rủi ro tổng hợp
              </p>
            </div>
            <div className="p-5 flex flex-col items-center">
              <RiskGauge
                score={verification?.risk_score ?? report.risk_score}
              />
              <div className="w-full mt-4 grid grid-cols-4 gap-1 text-center">
                {(
                  [
                    ["0–19", "bg-green-500"],
                    ["20–39", "bg-yellow-400"],
                    ["40–69", "bg-orange-400"],
                    ["70–100", "bg-red-500"],
                  ] as [string, string][]
                ).map(([range, bg]) => (
                  <div key={range} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-full h-1.5 rounded-full ${bg}`}
                    />
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
          <ReportAdminForm
            form={form}
            onChange={setForm}
            canEdit={canEdit}
            submitted={submitted}
          />

          {/* Recommended action box */}
          <RecommendedActionBox
            suggestedAction={suggestedAction}
            isOverriding={isOverriding}
            onOverrideToggle={() => setIsOverriding((v) => !v)}
            form={form}
            onFormChange={setForm}
            canEdit={canEdit}
            submitted={submitted}
          />

          {/* Action buttons */}
          {canEdit && !submitted && effectiveAction && (
            <div className="space-y-2">
              {/* Primary action */}
              <button
                onClick={handleSubmit}
                disabled={
                  !form.admin_assessment.trim() ||
                  !form.verdict ||
                  (isOverriding && !form.recommended_action)
                }
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${actionConfig[effectiveAction].btnClass}`}
              >
                <Save size={15} />
                {actionConfig[effectiveAction].label}
                <ChevronRight size={14} />
              </button>
              {!form.admin_assessment.trim() && (
                <p className="text-xs text-gray-400 text-center">
                  Vui lòng nhập nhận định tổng thể để tiếp tục
                </p>
              )}
            </div>
          )}

          {/* Read-only state */}
          {(!canEdit || submitted) && (
            <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 text-center">
              {submitted
                ? "Báo cáo đã được xác minh"
                : "Báo cáo ở trạng thái không thể chỉnh sửa"}
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      <ReportConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmSubmit}
        effectiveAction={effectiveAction}
        isOverrideDetected={isOverrideDetected}
      />
    </DashboardLayout>
  );
}
