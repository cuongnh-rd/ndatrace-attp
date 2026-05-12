"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";
import { phanQuyenRoles } from "@/lib/mock-data";

const totalUsers = phanQuyenRoles.reduce((sum, r) => sum + r.so_nguoi, 0);
const activeCount = phanQuyenRoles.filter((r) => r.trang_thai === "Hoạt động").length;
const inactiveCount = phanQuyenRoles.length - activeCount;

const columns = [
  {
    key: "ten",
    label: "Tên vai trò",
    render: (row: Record<string, unknown>) => (
      <div>
        <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200">{row.ten as string}</p>
      </div>
    ),
  },
  {
    key: "mo_ta",
    label: "Mô tả",
    render: (row: Record<string, unknown>) => (
      <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">{row.mo_ta as string}</p>
    ),
  },
  {
    key: "trang_thai",
    label: "Trạng thái",
    width: "150px",
    render: (row: Record<string, unknown>) => {
      const status = (row.trang_thai as string) || "Không hoạt động";
      const variant = status === "Hoạt động" ? "success" : "neutral";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },

  { key: "ngay_tao", label: "Ngày tạo", width: "110px" },
  {
    key: "_action",
    label: "Thao tác",
    width: "90px",
    sortable: false,
    render: (row: Record<string, unknown>) => (
      <Link
        href={`/quan-tri/vai-tro/${row.id as string}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-700 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
      >
        <Settings size={12} />
        Sửa
      </Link>
    ),
  },
] as Parameters<typeof SectionPage>[0]["tableColumns"];

// Inject _action key for the render to have row.id
const tableData = phanQuyenRoles.map((r) => ({ ...r, _action: "" }));

export default function Page() {
  return (
    <SectionPage
      title="Quản lý vai trò"
      subtitle="Phân quyền và quản lý vai trò người dùng theo 4 cấp quản lý trong hệ thống"
      addLabel="Thêm vai trò"
      stats={[
        { label: "Tổng vai trò", value: phanQuyenRoles.length, variant: "info" },
        { label: "Đang hoạt động", value: activeCount, variant: "success" },
        { label: "Không hoạt động", value: inactiveCount, variant: "neutral" },
        { label: "Tổng người dùng", value: totalUsers.toLocaleString(), variant: "info" },
      ]}
      tableColumns={columns}
      tableData={tableData}
      searchable
      searchKeys={["ten", "mo_ta"]}
    />
  );
}
