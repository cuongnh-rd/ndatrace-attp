"use client";

import { AlertTriangle, Building2 } from "lucide-react";
import { useState } from "react";
import { scopePartners } from "@/lib/mock-data";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import type { DataScopeState, PartnerScope } from "../../lib/types";
import { getPartnerCompanies, getModeLabel } from "../../lib/helpers";
import ModeDot from "./ModeDot";

function PartnerDetailModal({
    partnerId,
    scope,
    onScopeChange,
    onClose,
}: {
    partnerId: string;
    scope: DataScopeState;
    onScopeChange: (s: DataScopeState) => void;
    onClose: () => void;
}) {
    const [showConfirm, setShowConfirm] = useState(false);
    const partner = scopePartners.find((p) => p.id === partnerId)!;
    const dns = getPartnerCompanies(partnerId);
    const ps = scope.partnerScopes[partnerId] ?? { mode: "allow_all" as const, excludeList: [], allowList: [] };

    function updatePs(updated: PartnerScope) {
        onScopeChange({ ...scope, partnerScopes: { ...scope.partnerScopes, [partnerId]: updated } });
    }

    function handleDnToggle(dnId: string) {
        if (ps.mode === "allow_all") {
            updatePs({ ...ps, mode: "exclude", excludeList: [dnId], allowList: [] });
        } else if (ps.mode === "exclude") {
            const newList = ps.excludeList.includes(dnId) ? ps.excludeList.filter((id) => id !== dnId) : [...ps.excludeList, dnId];
            updatePs({ ...ps, excludeList: newList, mode: newList.length === 0 ? "allow_all" : "exclude" });
        } else {
            const newList = ps.allowList.includes(dnId) ? ps.allowList.filter((id) => id !== dnId) : [...ps.allowList, dnId];
            updatePs({ ...ps, allowList: newList });
        }
    }

    function isDnChecked(dnId: string): boolean {
        if (ps.mode === "allow_all") return true;
        if (ps.mode === "exclude") return !ps.excludeList.includes(dnId);
        return ps.allowList.includes(dnId);
    }

    return (
        <>
            <Modal isOpen title={`Danh sách Doanh nghiệp thuộc: ${partner.ten}`} onClose={onClose}>
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => updatePs({ mode: "allow_all", excludeList: [], allowList: [] })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${ps.mode === "allow_all"
                            ? "bg-green-50 border-green-300 text-green-700"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <ModeDot mode="allow_all" /> Chọn toàn bộ
                    </button>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${ps.mode === "allow_only"
                            ? "bg-purple-50 border-purple-300 text-purple-700"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <ModeDot mode="allow_only" /> Chọn cụ thể
                    </button>
                    <div className="ml-auto flex items-center gap-1.5">
                        <ModeDot mode={ps.mode} />
                        <span className="text-xs text-gray-500">{getModeLabel(ps, dns.length)}</span>
                    </div>
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto">
                    {dns.map((dn) => {
                        const checked = isDnChecked(dn.id);
                        const isExcluded = ps.mode === "exclude" && ps.excludeList.includes(dn.id);
                        return (
                            <label key={dn.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                <input type="checkbox" checked={checked} onChange={() => handleDnToggle(dn.id)} className="w-4 h-4 rounded accent-brand-600" />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${isExcluded ? "text-red-500 line-through" : "text-gray-700"}`}>{dn.ten}</p>
                                    <p className="text-xs text-gray-400">{dn.id}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 mb-4">
                    {ps.mode === "allow_all" && "Tất cả doanh nghiệp thuộc đối tác này."}
                    {ps.mode === "exclude" && `Tất cả doanh nghiệp thuộc đối tác, loại trừ ${ps.excludeList.length} doanh nghiệp.`}
                    {ps.mode === "allow_only" && "Chỉ các doanh nghiệp được chọn."}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colo   rs"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors"
                    >
                        Xác nhận
                    </button>
                </div>
            </Modal>

            {showConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirm(false)} />
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <AlertTriangle size={18} className="text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Chuyển sang chế độ Chọn cụ thể?</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Doanh nghiệp mới sẽ <strong>không tự động thêm vào phạm vi dữ liệu</strong> — cần thêm thủ công.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    updatePs({ mode: "allow_only", excludeList: [], allowList: [] });
                                    setShowConfirm(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PartnerDetailModal;
