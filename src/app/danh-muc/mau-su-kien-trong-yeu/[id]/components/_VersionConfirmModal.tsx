"use client";

import { AlertTriangle } from "lucide-react";
import type { CteTemplate } from "../../lib/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    template: CteTemplate | null;
}

export default function VersionConfirmModal({ isOpen, onClose, onConfirm, template }: Props) {
    if (!isOpen || !template) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} className="text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">Tạo phiên bản mới?</h2>
                        <p className="text-[14px] text-gray-500 mt-1">
                            Mẫu <strong className="text-gray-800 dark:text-gray-200">{template.vc_type_name}</strong> đang hoạt động (v{template.version}).
                            Chỉnh sửa sẽ tạo phiên bản mới <strong>v{template.version + 1}</strong>.
                            Phiên bản hiện tại (v{template.version}) sẽ bị khoá.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 text-[13px] text-gray-500 mb-5">
                    Các quy trình TXNG tại Layer 3 đang dùng v{template.version} sẽ vẫn hoạt động bình thường. Layer 3 sẽ nhận thông báo khi bạn công bố phiên bản mới.
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        Huỷ
                    </button>
                    <button onClick={onConfirm}
                        className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">
                        Tiếp tục — Tạo v{template.version + 1}
                    </button>
                </div>
            </div>
        </div>
    );
}
