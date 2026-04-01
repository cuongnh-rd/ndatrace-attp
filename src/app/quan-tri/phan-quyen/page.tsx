"use client";

import Link from "next/link";
import { ShieldCheck, Database, Users, ChevronRight, Settings } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import { phanQuyenRoles } from "@/lib/mock-data";

const funcPermSummary: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }[]> = {
  "quan-tri-vien":       [{ label: "Xem", variant: "info" }, { label: "Tạo", variant: "success" }, { label: "Sửa", variant: "warning" }, { label: "Xóa", variant: "danger" }, { label: "Phê duyệt", variant: "neutral" }],
  "quan-ly":             [{ label: "Xem", variant: "info" }, { label: "Tạo", variant: "success" }, { label: "Sửa", variant: "warning" }, { label: "Phê duyệt", variant: "neutral" }],
  "kiem-dinh-vien":      [{ label: "Xem", variant: "info" }, { label: "Phê duyệt", variant: "neutral" }],
  "nhan-vien-nhap-lieu": [{ label: "Xem", variant: "info" }, { label: "Tạo", variant: "success" }, { label: "Sửa", variant: "warning" }],
  "doi-tac":             [{ label: "Xem", variant: "info" }],
  "nguoi-xem":           [{ label: "Xem", variant: "info" }],
};

const dataScopeSummary: Record<string, string> = {
  "quan-tri-vien":       "Toàn hệ thống",
  "kiem-dinh-vien":      "Hà Nội, TP.HCM",
  "doi-tac":             "Theo đối tác được phân",
};

const configured = phanQuyenRoles.filter((r) => r.scope_configured).length;

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Phân quyền</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Cấu hình quyền chức năng và phạm vi dữ liệu cho từng vai trò trong hệ thống
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tổng vai trò</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{phanQuyenRoles.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Đã cấu hình phạm vi dữ liệu</p>
          <p className="text-2xl font-bold text-green-600">{configured}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chưa cấu hình</p>
          <p className="text-2xl font-bold text-amber-500">{phanQuyenRoles.length - configured}</p>
        </div>
      </div>

      {/* Role list */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Danh sách vai trò</h2>
          <p className="text-xs text-gray-400">Click vào vai trò để cấu hình quyền chức năng và phạm vi dữ liệu</p>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {phanQuyenRoles.map((role) => {
            const funcPerms = funcPermSummary[role.id] ?? [];
            const scopeLabel = dataScopeSummary[role.id];
            return (
              <Link
                key={role.id}
                href={`/quan-tri/phan-quyen/${role.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-brand-600 dark:text-brand-400" />
                </div>

                {/* Role info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{role.ten}</p>
                    {role.scope_configured
                      ? <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                          Đã cấu hình phạm vi
                        </span>
                      : <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                          Chưa cấu hình phạm vi
                        </span>
                    }
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{role.mo_ta}</p>
                  <div className="flex items-center gap-3">
                    {/* Functional permissions */}
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-gray-400" />
                      <div className="flex gap-1">
                        {funcPerms.map((p) => (
                          <Badge key={p.label} variant={p.variant}>{p.label}</Badge>
                        ))}
                      </div>
                    </div>
                    {/* Data scope */}
                    {scopeLabel && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Database size={12} className="text-gray-400" />
                        <span>{scopeLabel}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* User count */}
                <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-400 mr-2">
                  <Users size={13} />
                  <span>{role.so_nguoi.toLocaleString()} người dùng</span>
                </div>

                {/* Action */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className="text-xs text-brand-600 dark:text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Settings size={13} />
                    Cấu hình
                  </span>
                  <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-400 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
