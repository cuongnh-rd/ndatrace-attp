"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronRight, Search, Filter, ShieldAlert } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import {
  productReports,
  reportTypeLabels,
  priorityConfig,
  reportStatusConfig,
  type ReportPriority,
  type ReportStatus,
  type ReportType,
} from "@/lib/mock-data";

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "">("");
  const [filterPriority, setFilterPriority] = useState<ReportPriority | "">("");
  const [filterType, setFilterType] = useState<ReportType | "">("");

  // Mock ABAC: chỉ hiển thị báo cáo trong phạm vi phân quyền (demo: hiển thị tất cả với banner thông báo)
  const scopedReports = productReports;

  const filtered = useMemo(() => {
    return scopedReports
      .filter((r) => {
        if (filterStatus && r.status !== filterStatus) return false;
        if (filterPriority && r.priority !== filterPriority) return false;
        if (filterType && r.report_type !== filterType) return false;
        if (searchText) {
          const q = searchText.toLowerCase();
          if (
            !r.report_code.toLowerCase().includes(q) &&
            !r.product_name.toLowerCase().includes(q) &&
            !r.gtin.includes(q) &&
            !r.partner_name.toLowerCase().includes(q)
          ) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const pOrder: Record<ReportPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [scopedReports, searchText, filterStatus, filterPriority, filterType]);

  // Stats
  const total      = scopedReports.length;
  const chuaXuLy   = scopedReports.filter((r) => r.status === "submitted").length;
  const daXacMinh  = scopedReports.filter((r) => r.status === "resolved").length;
  const hoanThanh  = scopedReports.filter((r) => r.status === "completed").length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Báo cáo sản phẩm</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tiếp nhận và xử lý báo cáo sản phẩm nghi ngờ từ người dân
        </p>
      </div>

      {/* ABAC scope banner */}
      <div className="mb-5 flex items-center gap-2 px-4 py-2.5 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl text-sm text-brand-700 dark:text-brand-300">
        <ShieldAlert size={15} />
        <span>Đang hiển thị dữ liệu trong phạm vi phân quyền của bạn</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tổng báo cáo</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chưa xử lý</p>
          <p className="text-2xl font-bold text-blue-600">{chuaXuLy}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Đã xác minh</p>
          <p className="text-2xl font-bold text-amber-500">{daXacMinh}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hoàn thành</p>
          <p className="text-2xl font-bold text-green-600">{hoanThanh}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã báo cáo, GTIN, tên sản phẩm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReportStatus | "")}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="submitted">Chưa xử lý</option>
            <option value="resolved">Đã xác minh</option>
            <option value="completed">Hoàn thành</option>
            <option value="rejected">Từ chối</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as ReportPriority | "")}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Tất cả mức ưu tiên</option>
            <option value="critical">Khẩn cấp</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ReportType | "")}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Tất cả loại báo cáo</option>
            <option value="counterfeit">Hàng giả</option>
            <option value="suspicious">Nghi ngờ</option>
            <option value="quality">Chất lượng</option>
            <option value="expired">Hết hạn</option>
            <option value="packaging">Bao bì</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Danh sách báo cáo
          </h2>
          <p className="text-xs text-gray-400">{filtered.length} kết quả</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-medium">Mã báo cáo</th>
                <th className="px-5 py-3 text-left font-medium">Sản phẩm (GTIN)</th>
                <th className="px-5 py-3 text-left font-medium">Doanh nghiệp</th>
                <th className="px-5 py-3 text-left font-medium">Loại</th>
                <th className="px-5 py-3 text-left font-medium">Ưu tiên</th>
                <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-5 py-3 text-left font-medium">Ngày gửi</th>
                <th className="px-5 py-3 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">
                    Không có báo cáo nào phù hợp
                  </td>
                </tr>
              ) : (
                filtered.map((report) => {
                  const statusCfg = reportStatusConfig[report.status];
                  const priCfg = priorityConfig[report.priority];
                  const isNew = report.status === "submitted";
                  return (
                    <tr
                      key={report.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isNew ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {isNew && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                          <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                            {report.report_code}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm leading-tight">
                          {report.product_name}
                        </p>
                        <p className="font-mono text-xs text-gray-400 mt-0.5">{report.gtin}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400 max-w-[160px] truncate">
                        {report.partner_name}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {reportTypeLabels[report.report_type]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={priCfg.variant}>{priCfg.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(report.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/quan-tri/bao-cao-san-pham/${report.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          {report.status === "submitted" ? "Xác minh" : "Xem chi tiết"}
                          <ChevronRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 dark:border-gray-800 flex items-center gap-2 text-xs text-gray-400">
            <AlertTriangle size={12} />
            <span>
              {chuaXuLy} báo cáo chưa xử lý •{" "}
              {scopedReports.filter((r) => r.priority === "critical" && r.status === "submitted").length} báo cáo khẩn cấp cần ưu tiên
            </span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
