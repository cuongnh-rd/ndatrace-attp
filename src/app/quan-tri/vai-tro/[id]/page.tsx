"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, AlertTriangle, Save, Info, ShieldCheck, Database } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { phanQuyenRoles } from "@/lib/mock-data";
import type { DataScopeState, RoleInfo } from "./lib/types";
import { defaultScopes, emptyScope } from "./lib/constants";
import RoleInfoTab from "./components/RoleInfoTab";
import FunctionPermTab from "./components/FunctionPermTab";
import DataScopeTab from "./components/DataScopeTab";

// ─── Types & Constants ───────────────────────────────────────────────────────
// All types and constants are now in lib/ folder

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const isNewRole = id === "new";

  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([0]));
  const [scope, setScope] = useState<DataScopeState>(() => defaultScopes[id] ?? emptyScope);
  const [saved, setSaved] = useState(false);

  // Handlers
  function handleTabChange(i: number) {
    setActiveTab(i);
    setVisitedTabs((prev) => new Set([...prev, i]));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setScope(defaultScopes[id] ?? emptyScope);
  }

  // Get role data
  const existingRole = phanQuyenRoles.find((r) => r.id === id);
  const role: RoleInfo | null = isNewRole
    ? { id: "new-role", ten: "", mo_ta: "", so_nguoi: 0, scope_configured: false }
    : (existingRole ?? null);

  if (!role && !isNewRole) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <ShieldCheck size={40} className="text-gray-300" />
          <p className="text-gray-500">Không tìm thấy vai trò</p>
          <Link href="/quan-tri/vai-tro" className="text-sm text-brand-600 hover:underline">
            ← Quay lại danh sách
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Tab configuration
  const tabs = [
    { label: "Thông tin vai trò", icon: Info },
    { label: "Phân quyền chức năng", icon: ShieldCheck },
    { label: "Phân quyền dữ liệu", icon: Database },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/quan-tri/vai-tro"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {isNewRole ? "Tạo vai trò mới" : role?.ten}
          </h1>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Đặt về mặc định
        </button>
        {visitedTabs.size < 3 && (
          <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
            <AlertTriangle size={12} />
            {visitedTabs.size}/3 bước đã xem

          </span>
        )}
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl transition-colors ${saved ? "bg-green-500 text-white" : "bg-brand-600 hover:bg-brand-700 text-white"
            }`}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saved ? "Đã lưu!" : "Lưu cấu hình"}
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-6">
        {tabs.map((tab, i) => {
          const isActive = activeTab === i;
          const isVisited = visitedTabs.has(i) && !isActive;
          const isLast = i === tabs.length - 1;
          return (
            <div key={tab.label} className="flex items-center">
              <button
                onClick={() => handleTabChange(i)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? "bg-brand-600 text-white shadow-md shadow-brand-200"
                  : isVisited
                    ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isActive
                    ? "bg-white/30 text-white"
                    : isVisited
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-500"
                    }`}
                >
                  {isVisited ? <Check size={12} /> : i + 1}
                </span>
                {tab.label}
              </button>
              {!isLast && (
                <div
                  className={`w-8 h-px mx-1 flex-shrink-0 ${visitedTabs.has(i) ? "bg-green-300" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Warning banner */}
      {visitedTabs.size < 3 && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <AlertTriangle size={15} className="flex-shrink-0" />
          <span>
            Cần kiểm tra đủ cả 3 bước để hoàn tất cấu hình vai trò.
            <strong>{visitedTabs.size}/3 bước</strong> đã xem.
          </span>
        </div>
      )}

      {/* Tab content */}
      {activeTab === 0 && role && <RoleInfoTab role={role} />}
      {activeTab === 1 && <FunctionPermTab roleId={id} />}
      {activeTab === 2 && <DataScopeTab scope={scope} onScopeChange={setScope} />}

      {/* Next button */}
      {activeTab < 2 && (
        <div className="flex justify-end mt-6">
          <button
            onClick={() => handleTabChange(activeTab + 1)}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
          >
            Bước tiếp theo
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
