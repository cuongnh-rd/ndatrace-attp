"use client";

import { AdminForm, Verdict } from "@/types/report-admin";
import { verdictLabels } from "@/lib/report-actions";

interface ReportAdminFormProps {
    form: AdminForm;
    onChange: (form: AdminForm) => void;
    canEdit: boolean;
    submitted: boolean;
}

export default function ReportAdminForm({
    form,
    onChange,
    canEdit,
    submitted,
}: ReportAdminFormProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Đánh giá thủ công
                </p>
            </div>
            <div className="p-5 space-y-4">
                {/* evidence_quality */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        Chất lượng bằng chứng
                    </label>
                    <select
                        value={form.evidence_quality}
                        onChange={(e) =>
                            onChange({ ...form, evidence_quality: e.target.value })
                        }
                        disabled={!canEdit || submitted}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">-- Chọn --</option>
                        <option value="clear">Rõ ràng</option>
                        <option value="blurry">Mờ / Khó đọc</option>
                        <option value="irrelevant">Không liên quan</option>
                        <option value="none">Không có ảnh</option>
                    </select>
                </div>

                {/* description_consistency */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        Mô tả nhất quán
                    </label>
                    <select
                        value={form.description_consistency}
                        onChange={(e) =>
                            onChange({ ...form, description_consistency: e.target.value })
                        }
                        disabled={!canEdit || submitted}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">-- Chọn --</option>
                        <option value="consistent">Nhất quán</option>
                        <option value="inconsistent">Không nhất quán</option>
                        <option value="vague">Mơ hồ / Thiếu chi tiết</option>
                    </select>
                </div>

                {/* location_consistency */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        Vị trí khớp vùng phân phối
                    </label>
                    <select
                        value={form.location_consistency}
                        onChange={(e) =>
                            onChange({ ...form, location_consistency: e.target.value })
                        }
                        disabled={!canEdit || submitted}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">-- Chọn --</option>
                        <option value="match">Khớp</option>
                        <option value="mismatch">Không khớp</option>
                        <option value="unknown">Không xác định</option>
                    </select>
                </div>

                {/* verdict */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        Kết luận xác minh <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.verdict}
                        onChange={(e) =>
                            onChange({
                                ...form,
                                verdict: e.target.value as Verdict | "",
                                recommended_action: "",
                                override_reason: "",
                            })
                        }
                        disabled={!canEdit || submitted}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">-- Chọn kết luận --</option>
                        {(Object.keys(verdictLabels) as Verdict[]).map((v) => (
                            <option key={v} value={v}>
                                {verdictLabels[v]}
                            </option>
                        ))}
                    </select>
                </div>

                {/* admin_assessment */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        Nhận định tổng thể <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Nhập nhận định của bạn về báo cáo này..."
                        value={form.admin_assessment}
                        onChange={(e) =>
                            onChange({ ...form, admin_assessment: e.target.value })
                        }
                        disabled={!canEdit || submitted}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 disabled:opacity-50 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>
        </div>
    );
}
