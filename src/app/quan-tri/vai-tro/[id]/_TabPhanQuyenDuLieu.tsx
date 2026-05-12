"use client";

import { DataScopeState } from "./_data";
import AgencyScopeSection from "./_AgencyScopeSection";
import RegionScopeSection from "./_RegionScopeSection";
import CategoryScopeSection from "./_CategoryScopeSection";

interface Props {
  scope: DataScopeState;
  onScopeChange: (s: DataScopeState) => void;
}

export default function TabPhanQuyenDuLieu({ scope, onScopeChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <AgencyScopeSection scope={scope} onScopeChange={onScopeChange} />
        <RegionScopeSection scope={scope} onScopeChange={onScopeChange} />
        <CategoryScopeSection scope={scope} onScopeChange={onScopeChange} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-5 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Chú thích chế độ đối tác:</p>
          <p className="text-xs text-gray-400">
            Logic kết hợp: <strong className="text-gray-600 dark:text-gray-300">AND</strong>
            <span className="mx-1.5">·</span>Cập nhật real-time theo cấu hình
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Chọn toàn bộ — Tự động cập nhật Doanh nghiệp mới</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Loại trừ — Trừ danh sách loại trừ, tự động cập nhật doanh nghiệp mới</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Chọn cụ thể — Chỉ doanh nghiệp chỉ định, KHÔNG cập nhật doanh nghiệp mới</span>
        </div>
      </div>
    </div>
  );
}
