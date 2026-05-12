"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Database, Info, Save, Check } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { phanQuyenRoles } from "@/lib/mock-data";
import { DataScopeState, defaultScopes, emptyScope } from "./_data";
import TabThongTin from "./_TabThongTin";
import TabPhanQuyenChucNang from "./_TabPhanQuyenChucNang";
import TabPhanQuyenDuLieu from "./_TabPhanQuyenDuLieu";

const tabs = [
  { label: "Thông tin vai trò", icon: Info },
  { label: "Phân quyền chức năng", icon: ShieldCheck },
  { label: "Phân quyền dữ liệu", icon: Database },
];

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState(0);
  const [scope, setScope] = useState<DataScopeState>(() => defaultScopes[id] ?? emptyScope);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setScope(defaultScopes[id] ?? emptyScope);
  }

  const role = phanQuyenRoles.find((r) => r.id === id);

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <ShieldCheck size={40} className="text-gray-300" />
          <p className="text-gray-500">Không tìm thấy vai trò</p>
          <Link href="/quan-tri/vai-tro" className="text-sm text-brand-600 hover:underline">← Quay lại danh sách</Link>
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{role.ten}</h1>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Đặt về mặc định
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl transition-colors ${saved ? "bg-green-500 text-white" : "bg-brand-600 hover:bg-brand-700 text-white"}`}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saved ? "Đã lưu!" : "Lưu cấu hình"}
        </button>
      </div>

      {/* Step bar */}
      <div className="flex items-center mb-5">
        {tabs.map((tab, i) => {
          const isActive = activeTab === i;
          const isDone = activeTab > i;
          return (
            <div key={tab.label} className="flex items-center">
              <button onClick={() => setActiveTab(i)} className="flex items-center gap-2.5 group">
                <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 transition-colors ${
                  isActive
                    ? "bg-brand-600 border-brand-600 text-white"
                    : isDone
                    ? "bg-brand-100 border-brand-400 text-brand-600 dark:bg-brand-900/40 dark:border-brand-600 dark:text-brand-400"
                    : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                }`}>
                  {i + 1}
                </span>
                <span className={`text-sm font-medium transition-colors ${
                  isActive ? "text-gray-900 dark:text-white" :
                  isDone ? "text-brand-600 dark:text-brand-400" :
                  "text-gray-400 dark:text-gray-500"
                }`}>
                  {tab.label}
                </span>
              </button>
              {i < tabs.length - 1 && (
                <div className={`mx-3 h-px w-10 transition-colors ${activeTab > i ? "bg-brand-400" : "bg-gray-200 dark:bg-gray-700"}`} />
              )}
            </div>
          );
        })}
      </div>

      {activeTab === 0 && <TabThongTin role={role} />}
      {activeTab === 1 && <TabPhanQuyenChucNang roleId={id} />}
      {activeTab === 2 && <TabPhanQuyenDuLieu scope={scope} onScopeChange={setScope} />}
    </DashboardLayout>
  );
}
