"use client";

import { useState } from "react";
import { Building2, Search, X, AlertTriangle } from "lucide-react";
import { Settings2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { scopePartners } from "@/lib/mock-data";
import { AgencyMode, DataScopeState, PartnerScope, getPartnerCompanies, getModeLabel } from "./_data";

// ─── ModeDot ─────────────────────────────────────────────────────────────────

export function ModeDot({ mode }: { mode: AgencyMode }) {
  const color =
    mode === "allow_all" ? "bg-green-500" :
      mode === "exclude" ? "bg-amber-500" :
        "bg-purple-500";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />;
}

// ─── PartnerDetailModal ───────────────────────────────────────────────────────

function PartnerDetailModal({
  partnerId, scope, onScopeChange, onClose,
}: {
  partnerId: string;
  scope: DataScopeState;
  onScopeChange: (s: DataScopeState) => void;
  onClose: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const partner = scopePartners.find((p) => p.id === partnerId)!;
  const dns = getPartnerCompanies(partnerId);
  const ps = scope.partnerScopes[partnerId] ?? { mode: "allow_all" as AgencyMode, excludeList: [], allowList: [] };

  function updatePs(updated: PartnerScope) {
    onScopeChange({ ...scope, partnerScopes: { ...scope.partnerScopes, [partnerId]: updated } });
  }

  function handleDnToggle(dnId: string) {
    if (ps.mode === "allow_all") {
      updatePs({ ...ps, mode: "exclude", excludeList: [dnId], allowList: [] });
    } else if (ps.mode === "exclude") {
      const newList = ps.excludeList.includes(dnId)
        ? ps.excludeList.filter((id) => id !== dnId)
        : [...ps.excludeList, dnId];
      updatePs({ ...ps, excludeList: newList, mode: newList.length === 0 ? "allow_all" : "exclude" });
    } else {
      const newList = ps.allowList.includes(dnId)
        ? ps.allowList.filter((id) => id !== dnId)
        : [...ps.allowList, dnId];
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
      <Modal isOpen title={`Chi tiết: ${partner.ten}`} onClose={onClose}>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => updatePs({ mode: "allow_all", excludeList: [], allowList: [] })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${ps.mode === "allow_all" ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <ModeDot mode="allow_all" /> Chọn toàn bộ
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${ps.mode === "allow_only" ? "bg-purple-50 border-purple-300 text-purple-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
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
                <Building2 size={14} className={isExcluded ? "text-red-400" : "text-gray-400"} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isExcluded ? "text-red-500 line-through" : "text-gray-700"}`}>{dn.ten}</p>
                  <p className="text-xs text-gray-400">{dn.id}</p>
                </div>
                {isExcluded && <Badge variant="danger">Loại trừ</Badge>}
                {ps.mode === "allow_only" && checked && <Badge variant="info">Cho phép</Badge>}
              </label>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          {ps.mode === "allow_all" && "Tất cả doanh nghiệp thuộc đối tác này."}
          {ps.mode === "exclude" && `Tất cả doanh nghiệp thuộc đối tác, loại trừ ${ps.excludeList.length} doanh nghiệp.`}
          {ps.mode === "allow_only" && "Chỉ các doanh nghiệp được chọn."}
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
                  Doanh nghiệp mới sẽ <strong>không tự động vào scope</strong> — cần thêm thủ công.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Hủy</button>
              <button
                onClick={() => { updatePs({ mode: "allow_only", excludeList: [], allowList: [] }); setShowConfirm(false); }}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700"
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

// ─── AgencyScopeSection ───────────────────────────────────────────────────────

export default function AgencyScopeSection({
  scope, onScopeChange,
}: {
  scope: DataScopeState;
  onScopeChange: (s: DataScopeState) => void;
}) {
  const [openPartnerId, setOpenPartnerId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  function togglePartner(partnerId: string) {
    const isSelected = partnerId in scope.partnerScopes;
    if (isSelected) {
      const rest = { ...scope.partnerScopes };
      delete rest[partnerId];
      onScopeChange({ ...scope, partnerScopes: rest });
    } else {
      onScopeChange({ ...scope, partnerScopes: { ...scope.partnerScopes, [partnerId]: { mode: "allow_all", excludeList: [], allowList: [] } } });
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
        <p className="text-xs text-gray-400">Chọn đối tác — click tên để cấu hình chi tiết từng đối tác.</p>
      </div>

      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input type="radio" name="agency-type" checked={scope.agencyType === "all"} onChange={() => onScopeChange({ ...scope, agencyType: "all", partnerScopes: {} })} className="accent-brand-600" />
        <span className="text-sm text-gray-700 dark:text-gray-300">Tất cả đối tác</span>
      </label>

      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input type="radio" name="agency-type" checked={scope.agencyType === "specific"} onChange={() => onScopeChange({ ...scope, agencyType: "specific" })} className="accent-brand-600" />
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
            ) : filteredPartners.map((partner) => {
              const ps = scope.partnerScopes[partner.id];
              const isSelected = !!ps;
              const dns = getPartnerCompanies(partner.id);
              return (
                <div key={partner.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <input type="checkbox" checked={isSelected} onChange={() => togglePartner(partner.id)} className="w-4 h-4 rounded accent-brand-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => isSelected && setOpenPartnerId(partner.id)}
                        className={`text-sm font-medium text-left w-full truncate ${isSelected ? "text-gray-800 dark:text-gray-200 hover:text-brand-600 cursor-pointer" : "text-gray-400 cursor-default"}`}
                      >
                        {partner.ten}
                      </button>
                    </div>
                    {isSelected && ps && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <ModeDot mode={ps.mode} />
                        <span className="text-xs text-gray-500">{getModeLabel(ps, dns.length)}</span>
                      </div>
                    )}
                    {isSelected && (
                      <button
                        onClick={() => setOpenPartnerId(partner.id)}
                        className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        title="Cấu hình chi tiết"
                      >
                        <Settings2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {scope.agencyType === "specific" && hasAny && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
          <p className="text-xs text-gray-400">{Object.keys(scope.partnerScopes).length} đối tác được chọn</p>
        </div>
      )}

      {openPartnerId && (
        <PartnerDetailModal partnerId={openPartnerId} scope={scope} onScopeChange={onScopeChange} onClose={() => setOpenPartnerId(null)} />
      )}
    </div>
  );
}
