"use client";

import { Layers } from "lucide-react";
import { categoryTree } from "@/lib/mock-data";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import type { DataScopeState } from "../../lib/types";

function CategoryDetailModal({
    categoryId,
    scope,
    onScopeChange,
    onClose,
}: {
    categoryId: string;
    scope: DataScopeState;
    onScopeChange: (s: DataScopeState) => void;
    onClose: () => void;
}) {
    const parent = categoryTree.find((c) => c.id === categoryId)!;
    const children = categoryTree.filter((c) => c.parent_id === categoryId);
    const selectedChildren = scope.categoryScopes[categoryId] ?? [];
    const isAllMode = selectedChildren.length === 0;

    function updateCategoryScope(ids: string[]) {
        const next = { ...scope.categoryScopes };
        if (ids.length === 0) {
            delete next[categoryId];
        } else {
            next[categoryId] = ids;
        }
        onScopeChange({ ...scope, categoryScopes: next });
    }

    function handleChildToggle(childId: string) {
        if (isAllMode) {
            updateCategoryScope(children.map((c) => c.id).filter((id) => id !== childId));
        } else {
            const next = selectedChildren.includes(childId)
                ? selectedChildren.filter((id) => id !== childId)
                : [...selectedChildren, childId];
            updateCategoryScope(next);
        }
    }

    function isChildChecked(childId: string) {
        return isAllMode ? true : selectedChildren.includes(childId);
    }

    return (
        <Modal isOpen title={`Chi tiết: ${parent.ten}`} onClose={onClose}>
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => updateCategoryScope([])}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${isAllMode ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" /> Tất cả danh mục con
                </button>
                <button
                    onClick={() => {
                        if (isAllMode) updateCategoryScope(children.map((c) => c.id));
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${!isAllMode ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" /> Chọn cụ thể
                </button>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto">
                {children.map((child) => {
                    const checked = isChildChecked(child.id);
                    return (
                        <label key={child.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                            <input type="checkbox" checked={checked} onChange={() => handleChildToggle(child.id)} className="w-4 h-4 rounded accent-brand-600" />
                            <Layers size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{child.ten}</span>
                            {checked && !isAllMode && <Badge variant="info">Chọn</Badge>}
                        </label>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                {isAllMode
                    ? `Tất cả ${children.length} danh mục con thuộc ${parent.ten}.`
                    : `${selectedChildren.length}/${children.length} danh mục con được chọn.`}
            </div>
        </Modal>
    );
}

export default CategoryDetailModal;
