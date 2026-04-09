"use client";

import { MapPin, Search, X } from "lucide-react";
import { useState } from "react";
import { provinceTree } from "@/lib/mock-data";
import type { DataScopeState } from "../../lib/types";
import ProvinceDetailModal from "./ProvinceDetailModal";

function RegionScopeSection({ scope, onScopeChange }: { scope: DataScopeState; onScopeChange: (s: DataScopeState) => void }) {
    const [query, setQuery] = useState("");
    const [openProvinceId, setOpenProvinceId] = useState<string | null>(null);

    function toggleProvince(id: string) {
        const isChecked = scope.selectedProvinces.includes(id);
        if (isChecked) {
            const nextProvinceScopes = { ...scope.provinceScopes };
            delete nextProvinceScopes[id];
            onScopeChange({
                ...scope,
                selectedProvinces: scope.selectedProvinces.filter((p) => p !== id),
                provinceScopes: nextProvinceScopes,
            });
        } else {
            onScopeChange({ ...scope, selectedProvinces: [...scope.selectedProvinces, id] });
        }
    }

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
                <input
                    type="radio"
                    name="region-type"
                    checked={scope.regionType === "all"}
                    onChange={() => onScopeChange({ ...scope, regionType: "all", selectedProvinces: [], provinceScopes: {} })}
                    className="accent-brand-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Tất cả địa phương</span>
            </label>

            <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <input
                    type="radio"
                    name="region-type"
                    checked={scope.regionType === "specific"}
                    onChange={() => onScopeChange({ ...scope, regionType: "specific" })}
                    className="accent-brand-600"
                />
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
                        {provinceTree.filter((p) => p.ten.toLowerCase().includes(query.toLowerCase())).length === 0 ? (
                            <div className="px-4 py-6 text-center text-xs text-gray-400">Không tìm thấy kết quả phù hợp</div>
                        ) : (
                            provinceTree
                                .filter((p) => p.ten.toLowerCase().includes(query.toLowerCase()))
                                .map((prov) => {
                                    const checked = scope.selectedProvinces.includes(prov.id);
                                    const wardScope = scope.provinceScopes[prov.id];
                                    const wardLabel = wardScope && wardScope.length > 0 ? `${wardScope.length} xã/phường` : "Tất cả xã/phường";
                                    return (
                                        <div
                                            key={prov.id}
                                            className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleProvince(prov.id)}
                                                className="w-4 h-4 rounded accent-brand-600 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <button
                                                    onClick={() => checked && setOpenProvinceId(prov.id)}
                                                    className={`text-sm font-medium text-left w-full truncate ${checked ? "text-gray-800 dark:text-gray-200 hover:text-brand-600 cursor-pointer" : "text-gray-400 cursor-default"
                                                        }`}
                                                >
                                                    {prov.ten}
                                                </button>
                                                <p className="text-xs text-gray-400">→ {prov.so_xa} xã/phường</p>
                                            </div>
                                            {checked && (
                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    <span
                                                        className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${wardScope && wardScope.length > 0 ? "bg-blue-500" : "bg-green-500"
                                                            }`}
                                                    />
                                                    <span className="text-xs text-gray-500">{wardLabel}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </>
            )}

            {scope.regionType === "specific" && scope.selectedProvinces.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
                    <p className="text-xs text-gray-400">{scope.selectedProvinces.length} tỉnh/thành được chọn</p>
                </div>
            )}

            {openProvinceId && <ProvinceDetailModal provinceId={openProvinceId} scope={scope} onScopeChange={onScopeChange} onClose={() => setOpenProvinceId(null)} />}
        </div>
    );
}

export default RegionScopeSection;
