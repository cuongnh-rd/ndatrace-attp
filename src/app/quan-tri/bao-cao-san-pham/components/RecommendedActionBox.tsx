"use client";

import { CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { AdminForm, RecommendedAction } from "@/types/report-admin";
import { actionConfig } from "@/lib/report-actions";

interface RecommendedActionBoxProps {
    suggestedAction: RecommendedAction | null;
    isOverriding: boolean;
    onOverrideToggle: () => void;
    form: AdminForm;
    onFormChange: (form: AdminForm) => void;
    canEdit: boolean;
    submitted: boolean;
}

export default function RecommendedActionBox({
    suggestedAction,
    isOverriding,
    onOverrideToggle,
    form,
    onFormChange,
    canEdit,
    submitted,
}: RecommendedActionBoxProps) {
    if (!suggestedAction) return null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Hành động đề xuất
                </p>
            </div>
            <div className="p-5 space-y-3">
                {!isOverriding ? (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                {actionConfig[suggestedAction].label}
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                {actionConfig[suggestedAction].desc}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
                            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                            Bạn đang ghi đè hành động đề xuất. Vui lòng nêu lý do.
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                Chọn hành động <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.recommended_action}
                                onChange={(e) =>
                                    onFormChange({
                                        ...form,
                                        recommended_action: e.target.value as RecommendedAction | "",
                                    })
                                }
                                disabled={!canEdit || submitted}
                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">-- Chọn hành động --</option>
                                {(
                                    Object.entries(actionConfig) as [RecommendedAction, typeof actionConfig[RecommendedAction]][]
                                ).map(([action, cfg]) => (
                                    <option key={action} value={action}>
                                        {cfg.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                Lý do ghi đè <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Giải thích tại sao bạn ghi đè hành động đề xuất..."
                                value={form.override_reason}
                                onChange={(e) =>
                                    onFormChange({ ...form, override_reason: e.target.value })
                                }
                                disabled={!canEdit || submitted}
                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 disabled:opacity-50 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </>
                )}

                {canEdit && !submitted && (
                    <button
                        onClick={onOverrideToggle}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw size={12} />
                        {isOverriding ? "Quay lại đề xuất hệ thống" : "Ghi đè hành động"}
                    </button>
                )}
            </div>
        </div>
    );
}
