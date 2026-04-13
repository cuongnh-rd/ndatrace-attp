"use client";

import { Building2, Search, X, Settings } from "lucide-react";
import { useState } from "react";
import { scopePartners } from "@/lib/mock-data";
import type { DataScopeState } from "../../lib/types";
import { getPartnerCompanies, getModeLabel } from "../../lib/helpers";
import ModeDot from "./ModeDot";
import PartnerDetailModal from "./PartnerDetailModal";

function AgencyScopeSection({ scope, onScopeChange }: { scope: DataScopeState; onScopeChange: (s: DataScopeState) => void }) {
    const [openPartnerId, setOpenPartnerId] = useState<string | null>(null);
    const [query, setQuery] = useState("");

    function togglePartner(partnerId: string) {
        const isSelected = partnerId in scope.partnerScopes;
        if (isSelected) {
            const rest = { ...scope.partnerScopes };
            delete rest[partnerId];
            onScopeChange({ ...scope, partnerScopes: rest });
        } else {
            onScopeChange({
                ...scope,
                partnerScopes: { ...scope.partnerScopes, [partnerId]: { mode: "allow_all", excludeList: [], allowList: [] } },
            });
        }
    }

    const hasAny = Object.keys(scope.partnerScopes).length > 0;
    const filteredPartners = scopePartners.filter((p) => p.ten.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-0.5">
                    <Building2 size={15} className="text-brand-500" />
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Theo Đối tác</h3>
                </div>
                <p className="text-xs text-gray-400">Chọn theo đối tác / doanh nghiệp cụ thể</p>
            </div>

            <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <input
                    type="radio"
                    name="agency-type"
                    checked={scope.agencyType === "all"}
                    onChange={() => onScopeChange({ ...scope, agencyType: "all", partnerScopes: {} })}
                    className="accent-brand-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Tất cả đối tác</span>
            </label>

            <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <input
                    type="radio"
                    name="agency-type"
                    checked={scope.agencyType === "specific"}
                    onChange={() => onScopeChange({ ...scope, agencyType: "specific" })}
                    className="accent-brand-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Chọn cụ thể</span>
            </label>

            {scope.agencyType === "specific" && (
                <>
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-1.5">
                            <Search size={13} className="text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Tìm kiếm đối tác"
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
                        {filteredPartners.length === 0 ? (
                            <div className="px-4 py-6 text-center text-xs text-gray-400">Không tìm thấy kết quả phù hợp</div>
                        ) : (
                            filteredPartners.map((partner) => {
                                const ps = scope.partnerScopes[partner.id];
                                const isSelected = !!ps;
                                const dns = getPartnerCompanies(partner.id);
                                return (
                                    <div key={partner.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => togglePartner(partner.id)}
                                                className="w-4 h-4 rounded accent-brand-600 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <button
                                                    onClick={() => isSelected && setOpenPartnerId(partner.id)}
                                                    className={`text-sm font-medium text-left w-full truncate ${isSelected ? "text-gray-800 dark:text-gray-200 hover:text-brand-600 cursor-pointer" : "text-gray-400 cursor-default"
                                                        }`}
                                                >
                                                    {partner.ten}
                                                </button>
                                            </div>
                                            {isSelected && ps && (
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <ModeDot mode={ps.mode} />
                                                        <span className="text-xs text-gray-500">{getModeLabel(ps, dns.length)}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setOpenPartnerId(partner.id)}
                                                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                        title="Cấu hình đối tác"
                                                    >
                                                        <Settings size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}

            {scope.agencyType === "specific" && hasAny && (
                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
                    <p className="text-xs text-gray-400">{Object.keys(scope.partnerScopes).length} đối tác được chọn</p>
                </div>
            )}

            {openPartnerId && <PartnerDetailModal partnerId={openPartnerId} scope={scope} onScopeChange={onScopeChange} onClose={() => setOpenPartnerId(null)} />}
        </div>
    );
}

export default AgencyScopeSection;
