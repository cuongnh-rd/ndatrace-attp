"use client";

import { useState, useMemo } from "react";
import { ShieldAlert } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReportStats from "./components/ReportStats";
import ReportFilterBar from "./components/ReportFilterBar";
import ReportTable from "./components/ReportTable";
import {
  productReports,
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
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => {
        const pOrder: Record<ReportPriority, number> = {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3,
        };
        if (pOrder[a.priority] !== pOrder[b.priority])
          return pOrder[a.priority] - pOrder[b.priority];
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
  }, [searchText, filterStatus, filterPriority, filterType]);

  // Stats
  const total = scopedReports.length;
  const chuaXuLy = scopedReports.filter((r) => r.status === "submitted").length;
  const daXacMinh = scopedReports.filter((r) => r.status === "resolved").length;
  const hoanThanh = scopedReports.filter((r) => r.status === "completed").length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Phản ánh sản phẩm
        </h1>
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
      <div className="mb-6">
        <ReportStats
          total={total}
          chuaXuLy={chuaXuLy}
          daXacMinh={daXacMinh}
          hoanThanh={hoanThanh}
        />
      </div>

      {/* Filter bar */}
      <div className="mb-4">
        <ReportFilterBar
          searchText={searchText}
          onSearchChange={setSearchText}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          filterPriority={filterPriority}
          onPriorityChange={setFilterPriority}
          filterType={filterType}
          onTypeChange={setFilterType}
        />
      </div>

      {/* Table */}
      <ReportTable reports={filtered} chuaXuLy={chuaXuLy} />
    </DashboardLayout>
  );
}
