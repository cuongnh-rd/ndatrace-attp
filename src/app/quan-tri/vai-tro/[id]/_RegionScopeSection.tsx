"use client";

import { useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { Settings2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { provinceTree, wardTree } from "@/lib/mock-data";
import { DataScopeState } from "./_data";

// ─── ProvinceDetailModal ──────────────────────────────────────────────────────

function ProvinceDetailModal({
  provinceId, scope, onScopeChange, onClose,
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
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${isAllMode ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" /> Tất cả xã/phường
        </button>
        <button
          onClick={() => { if (isAllMode) updateProvinceScope(wards.map((w) => w.id)); }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${!isAllMode ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
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

// ─── RegionScopeSection ───────────────────────────────────────────────────────

export default function RegionScopeSection({
  scope, onScopeChange,
}: {
  scope: DataScopeState;
  onScopeChange: (s: DataScopeState) => void;
}) {
  const [query, setQuery] = useState("");
  const [openProvinceId, setOpenProvinceId] = useState<string | null>(null);

  function toggleProvince(id: string) {
    const isChecked = scope.selectedProvinces.includes(id);
    if (isChecked) {
      const nextProvinceScopes = { ...scope.provinceScopes };
      delete nextProvinceScopes[id];
      onScopeChange({ ...scope, selectedProvinces: scope.selectedProvinces.filter((p) => p !== id), provinceScopes: nextProvinceScopes });
    } else {
      onScopeChange({ ...scope, selectedProvinces: [...scope.selectedProvinces, id] });
    }
  }

  const filteredProvinces = provinceTree.filter((p) => p.ten.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-0.5">
          <MapPin size={15} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Theo Địa phương</h3>
        </div>
        <p className="text-xs text-gray-400">Chọn địa phương — click tên để giới hạn đến xã/phường.</p>
      </div>

      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input type="radio" name="region-type" checked={scope.regionType === "all"} onChange={() => onScopeChange({ ...scope, regionType: "all", selectedProvinces: [], provinceScopes: {} })} className="accent-brand-600" />
        <span className="text-sm text-gray-700 dark:text-gray-300">Tất cả địa phương</span>
      </label>

      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input type="radio" name="region-type" checked={scope.regionType === "specific"} onChange={() => onScopeChange({ ...scope, regionType: "specific" })} className="accent-brand-600" />
        <span className="text-sm text-gray-700 dark:text-gray-300">Chọn cụ thể</span>
      </label>

      {scope.regionType === "specific" && (
        <>
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-1.5">
              <Search size={13} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm địa phương"
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
            {filteredProvinces.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-gray-400">Không tìm thấy kết quả phù hợp</div>
            ) : filteredProvinces.map((prov) => {
              const checked = scope.selectedProvinces.includes(prov.id);
              const wardScope = scope.provinceScopes[prov.id];
              const wardLabel = wardScope && wardScope.length > 0 ? `${wardScope.length} xã/phường` : "Tất cả xã/phường";
              return (
                <div key={prov.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <input type="checkbox" checked={checked} onChange={() => toggleProvince(prov.id)} className="w-4 h-4 rounded accent-brand-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => checked && setOpenProvinceId(prov.id)}
                      className={`text-sm font-medium text-left w-full truncate ${checked ? "text-gray-800 dark:text-gray-200 hover:text-brand-600 cursor-pointer" : "text-gray-400 cursor-default"}`}
                    >
                      {prov.ten}
                    </button>
                  </div>
                  {checked && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${wardScope && wardScope.length > 0 ? "bg-blue-500" : "bg-green-500"}`} />
                      <span className="text-xs text-gray-500">{wardLabel}</span>
                    </div>
                  )}
                  {checked && (
                    <button
                      onClick={() => setOpenProvinceId(prov.id)}
                      className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Cấu hình chi tiết"
                    >
                      <Settings2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {scope.regionType === "specific" && scope.selectedProvinces.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
          <p className="text-xs text-gray-400">{scope.selectedProvinces.length} tỉnh/thành được chọn</p>
        </div>
      )}

      {openProvinceId && (
        <ProvinceDetailModal provinceId={openProvinceId} scope={scope} onScopeChange={onScopeChange} onClose={() => setOpenProvinceId(null)} />
      )}
    </div>
  );
}
