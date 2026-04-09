"use client";

import { MapPin } from "lucide-react";
import { provinceTree, wardTree } from "@/lib/mock-data";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import type { DataScopeState } from "../../lib/types";

function ProvinceDetailModal({
    provinceId,
    scope,
    onScopeChange,
    onClose,
}: {
    provinceId: string;
    scope: DataScopeState;
    onScopeChange: (s: DataScopeState) => void;
    onClose: () => void;
}) {
    const province = provinceTree.find((p) => p.id === provinceId)!;
    const wards = wardTree.filter((w) => w.province_id === provinceId);
    const selectedWards = scope.provinceScopes[provinceId] ?? [];
    const isAllMode = selectedWards.length === 0;

    function updateProvinceScope(ids: string[]) {
        const next = { ...scope.provinceScopes };
        if (ids.length === 0) {
            delete next[provinceId];
        } else {
            next[provinceId] = ids;
        }
        onScopeChange({ ...scope, provinceScopes: next });
    }

    function handleWardToggle(wardId: string) {
        if (isAllMode) {
            updateProvinceScope(wards.map((w) => w.id).filter((id) => id !== wardId));
        } else {
            const next = selectedWards.includes(wardId)
                ? selectedWards.filter((id) => id !== wardId)
                : [...selectedWards, wardId];
            updateProvinceScope(next);
        }
    }

    function isWardChecked(wardId: string) {
        return isAllMode ? true : selectedWards.includes(wardId);
    }

    return (
        <Modal isOpen title={`Chi tiết: ${province.ten}`} onClose={onClose}>
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => updateProvinceScope([])}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${isAllMode ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" /> Tất cả xã/phường
                </button>
                <button
                    onClick={() => {
                        if (isAllMode) updateProvinceScope(wards.map((w) => w.id));
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${!isAllMode ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" /> Chọn cụ thể
                </button>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto">
                {wards.map((ward) => {
                    const checked = isWardChecked(ward.id);
                    return (
                        <label key={ward.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="checkbox" checked={checked} onChange={() => handleWardToggle(ward.id)} className="w-4 h-4 rounded accent-brand-600" />
                            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{ward.ten}</span>
                            {checked && !isAllMode && <Badge variant="info">Chọn</Badge>}
                        </label>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                {isAllMode
                    ? `Tất cả ${wards.length} xã/phường thuộc ${province.ten}.`
                    : `${selectedWards.length}/${wards.length} xã/phường được chọn.`}
            </div>
        </Modal>
    );
}

export default ProvinceDetailModal;
