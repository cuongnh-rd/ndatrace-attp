"use client";

import { useState } from "react";
import { Layers, Search, X, ChevronDown, ChevronRight } from "lucide-react";
import { Settings2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { categoryTree } from "@/lib/mock-data";
import { DataScopeState } from "./_data";

// ─── CategoryDetailModal ──────────────────────────────────────────────────────

function CategoryDetailModal({
  categoryId, scope, onScopeChange, onClose,
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
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${isAllMode ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" /> Tất cả danh mục con
        </button>
        <button
          onClick={() => { if (isAllMode) updateCategoryScope(children.map((c) => c.id)); }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${!isAllMode ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
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

// ─── CategoryScopeSection ─────────────────────────────────────────────────────

export default function CategoryScopeSection({
  scope, onScopeChange,
}: {
  scope: DataScopeState;
  onScopeChange: (s: DataScopeState) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const parents = categoryTree.filter((c) => c.parent_id === null);

  function toggleCategory(id: string) {
    const isChecked = scope.selectedCategories.includes(id);
    if (isChecked) {
      const nextCategoryScopes = { ...scope.categoryScopes };
      delete nextCategoryScopes[id];
      onScopeChange({ ...scope, selectedCategories: scope.selectedCategories.filter((c) => c !== id), categoryScopes: nextCategoryScopes });
    } else {
      onScopeChange({ ...scope, selectedCategories: [...scope.selectedCategories, id] });
    }
  }

  const filteredParents = parents.filter((parent) => {
    const children = categoryTree.filter((c) => c.parent_id === parent.id);
    const q = query.toLowerCase();
    return parent.ten.toLowerCase().includes(q) || children.some((c) => c.ten.toLowerCase().includes(q));
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-0.5">
          <Layers size={15} className="text-emerald-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Theo Nhóm ngành</h3>
        </div>
        <p className="text-xs text-gray-400">Chọn nhóm ngành — click tên để chọn nhóm ngành cụ thể.</p>
      </div>

      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input type="radio" name="category-type" checked={scope.categoryType === "all"} onChange={() => onScopeChange({ ...scope, categoryType: "all", selectedCategories: [], categoryScopes: {} })} className="accent-brand-600" />
        <span className="text-sm text-gray-700 dark:text-gray-300">Tất cả nhóm ngành</span>
      </label>

      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input type="radio" name="category-type" checked={scope.categoryType === "specific"} onChange={() => onScopeChange({ ...scope, categoryType: "specific" })} className="accent-brand-600" />
        <span className="text-sm text-gray-700 dark:text-gray-300">Chọn cụ thể</span>
      </label>

      {scope.categoryType === "specific" && (
        <>
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-1.5">
              <Search size={13} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm nhóm ngành"
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-80">
            {filteredParents.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-gray-400">Không tìm thấy kết quả phù hợp</div>
            ) : filteredParents.map((parent) => {
              const children = categoryTree.filter((c) => c.parent_id === parent.id);
              const isChecked = scope.selectedCategories.includes(parent.id);
              const isExpanded = expanded[parent.id] ?? false;
              const childScope = scope.categoryScopes[parent.id];
              const childLabel = childScope && childScope.length > 0 ? `${childScope.length}/${children.length} danh mục con` : "Tất cả danh mục con";
              return (
                <div key={parent.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <input type="checkbox" checked={isChecked} onChange={() => toggleCategory(parent.id)} className="w-4 h-4 rounded accent-brand-600 flex-shrink-0" />
                    <button onClick={() => setExpanded((prev) => ({ ...prev, [parent.id]: !prev[parent.id] }))} className="flex items-center gap-1.5 text-left">
                      {isExpanded ? <ChevronDown size={13} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={13} className="text-gray-400 flex-shrink-0" />}
                    </button>
                    <button
                      onClick={() => isChecked && setOpenCategoryId(parent.id)}
                      className={`text-sm font-medium text-left flex-1 truncate ${isChecked ? "text-gray-800 dark:text-gray-200 hover:text-brand-600 cursor-pointer" : "text-gray-400 cursor-default"}`}
                    >
                      {parent.ten}
                    </button>
                    {isChecked && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${childScope && childScope.length > 0 ? "bg-blue-500" : "bg-green-500"}`} />
                        <span className="text-xs text-gray-500">{childLabel}</span>
                      </div>
                    )}
                    {isChecked && (
                      <button
                        onClick={() => setOpenCategoryId(parent.id)}
                        className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Cấu hình chi tiết"
                      >
                        <Settings2 size={14} />
                      </button>
                    )}
                  </div>
                  {isExpanded && children.map((child) => (
                    <div key={child.id} className="flex items-center gap-2 pl-10 pr-4 py-2 bg-gray-50/50 dark:bg-gray-800/20">
                      <span className="w-3 h-px bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                      <span className={`text-xs ${isChecked ? "text-gray-600 dark:text-gray-400" : "text-gray-400"}`}>{child.ten}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      {scope.categoryType === "specific" && scope.selectedCategories.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
          <p className="text-xs text-gray-400">{scope.selectedCategories.length} nhóm ngành được chọn</p>
        </div>
      )}

      {openCategoryId && (
        <CategoryDetailModal categoryId={openCategoryId} scope={scope} onScopeChange={onScopeChange} onClose={() => setOpenCategoryId(null)} />
      )}
    </div>
  );
}
