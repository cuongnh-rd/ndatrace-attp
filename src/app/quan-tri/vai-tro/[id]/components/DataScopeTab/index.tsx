"use client";

import { Database } from "lucide-react";
import { useMemo } from "react";
import { scopeCompanies } from "@/lib/mock-data";
import type { DataScopeState } from "../../lib/types";
import { computePreviewCount } from "../../lib/helpers";
import AgencyScopeSection from "./AgencyScopeSection";
import RegionScopeSection from "./RegionScopeSection";
import CategoryScopeSection from "./CategoryScopeSection";

function DataScopeTab({
    scope,
    onScopeChange,
}: {
    scope: DataScopeState;
    onScopeChange: (s: DataScopeState) => void;
}) {
    const previewCount = useMemo(() => computePreviewCount(scope), [scope]);

    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border border-brand-100 dark:border-brand-800 rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center">
                    <Database size={18} className="text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phạm vi dữ liệu hiện tại</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {previewCount === scopeCompanies.length
                            ? `Toàn bộ ${previewCount} doanh nghiệp`
                            : `${previewCount} doanh nghiệp`}
                    </p>
                </div>
                <div className="text-right text-xs text-gray-400">
                    <p>
                        Logic kết hợp: <strong className="text-gray-600 dark:text-gray-300">AND</strong>
                    </p>
                    <p>Cập nhật real-time theo cấu hình</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <AgencyScopeSection scope={scope} onScopeChange={onScopeChange} />
                <RegionScopeSection scope={scope} onScopeChange={onScopeChange} />
                <CategoryScopeSection scope={scope} onScopeChange={onScopeChange} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-5 py-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Chú thích chế độ đối tác:</p>
                <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Chọn toàn bộ — Tự động cập nhật Doanh nghiệp mới
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Loại trừ — Trừ danh sách loại trừ, tự động cập nhật doanh nghiệp mới
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Chọn chỉ định — Chỉ doanh nghiệp chỉ định, KHÔNG cập nhật doanh nghiệp mới
                    </span>
                </div>
            </div>
        </div>
    );
}

export default DataScopeTab;
