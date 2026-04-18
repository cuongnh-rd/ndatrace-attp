"use client";

import { AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { RecommendedAction } from "@/types/report-admin";
import { actionConfig } from "@/lib/report-actions";

interface ReportConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    effectiveAction: RecommendedAction | null;
    isOverrideDetected: boolean;
}

export default function ReportConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    effectiveAction,
    isOverrideDetected,
}: ReportConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận hành động">
            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bạn sắp thực hiện:{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {effectiveAction ? actionConfig[effectiveAction].label : ""}
                    </span>
                </p>
                {isOverrideDetected && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>
                            Hành động này khác với đề xuất hệ thống và sẽ được ghi vào Audit
                            Log kèm lý do ghi đè.
                        </span>
                    </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Thao tác này sẽ được ghi nhận và không thể hoàn tác.
                </p>
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </Modal>
    );
}
