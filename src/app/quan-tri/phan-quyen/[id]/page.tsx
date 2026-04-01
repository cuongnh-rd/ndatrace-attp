"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ShieldCheck, Database, AlertTriangle, ChevronDown, ChevronRight,
  Building2, MapPin, Layers, Save, X, Check, Users,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import {
  phanQuyenRoles, scopePartners, scopeCompanies, provinceTree, categoryTree,
} from "@/lib/mock-data";

// ─── Types ───────────────────────────────────────────────────────────────────

type AgencyMode = "allow_all" | "exclude" | "allow_only";

interface PartnerScope {
  mode: AgencyMode;
  excludeList: string[];
  allowList: string[];
}

interface DataScopeState {
  agencyType: "all" | "specific";
  partnerScopes: Record<string, PartnerScope>;
  regionType: "all" | "specific";
  selectedProvinces: string[];
  categoryType: "all" | "specific";
  selectedCategories: string[];
}

// ─── Static permission data ──────────────────────────────────────────────────

const modules = [
  { name: "Sản phẩm",          roles: { "quan-tri-vien": { xem:true, tao:true, sua:true, xoa:true,  phe_duyet:true  }, "quan-ly": { xem:true, tao:true, sua:true, xoa:false, phe_duyet:true  }, "kiem-dinh-vien": { xem:true, tao:false, sua:false, xoa:false, phe_duyet:true  }, "nhan-vien-nhap-lieu": { xem:true, tao:true, sua:true, xoa:false, phe_duyet:false }, "doi-tac": { xem:true,  tao:false, sua:false, xoa:false, phe_duyet:false }, "nguoi-xem": { xem:true,  tao:false, sua:false, xoa:false, phe_duyet:false } } },
  { name: "Sự kiện truy xuất", roles: { "quan-tri-vien": { xem:true, tao:true, sua:true, xoa:true,  phe_duyet:true  }, "quan-ly": { xem:true, tao:true, sua:true, xoa:false, phe_duyet:true  }, "kiem-dinh-vien": { xem:true, tao:false, sua:false, xoa:false, phe_duyet:true  }, "nhan-vien-nhap-lieu": { xem:true, tao:true, sua:true, xoa:false, phe_duyet:false }, "doi-tac": { xem:true,  tao:false, sua:false, xoa:false, phe_duyet:false }, "nguoi-xem": { xem:true,  tao:false, sua:false, xoa:false, phe_duyet:false } } },
  { name: "Tem nhãn (UID/QR)", roles: { "quan-tri-vien": { xem:true, tao:true, sua:true, xoa:true,  phe_duyet:true  }, "quan-ly": { xem:true, tao:true, sua:true, xoa:false, phe_duyet:false }, "kiem-dinh-vien": { xem:true, tao:false, sua:false, xoa:false, phe_duyet:false }, "nhan-vien-nhap-lieu": { xem:true, tao:true, sua:false,xoa:false, phe_duyet:false }, "doi-tac": { xem:true,  tao:false, sua:false, xoa:false, phe_duyet:false }, "nguoi-xem": { xem:true,  tao:false, sua:false, xoa:false, phe_duyet:false } } },
  { name: "Chứng chỉ",         roles: { "quan-tri-vien": { xem:true, tao:true, sua:true, xoa:true,  phe_duyet:true  }, "quan-ly": { xem:true, tao:true, sua:true, xoa:false, phe_duyet:true  }, "kiem-dinh-vien": { xem:true, tao:false, sua:false, xoa:false, phe_duyet:true  }, "nhan-vien-nhap-lieu": { xem:true, tao:true, sua:true, xoa:false, phe_duyet:false }, "doi-tac": { xem:false, tao:false, sua:false, xoa:false, phe_duyet:false }, "nguoi-xem": { xem:true,  tao:false, sua:false, xoa:false, phe_duyet:false } } },
  { name: "Báo cáo",           roles: { "quan-tri-vien": { xem:true, tao:true, sua:true, xoa:true,  phe_duyet:true  }, "quan-ly": { xem:true, tao:true, sua:false,xoa:false, phe_duyet:false }, "kiem-dinh-vien": { xem:true, tao:false, sua:false, xoa:false, phe_duyet:false }, "nhan-vien-nhap-lieu": { xem:false,tao:false, sua:false,xoa:false, phe_duyet:false }, "doi-tac": { xem:false, tao:false, sua:false, xoa:false, phe_duyet:false }, "nguoi-xem": { xem:false, tao:false, sua:false, xoa:false, phe_duyet:false } } },
  { name: "Quản trị người dùng",roles:{ "quan-tri-vien": { xem:true, tao:true, sua:true, xoa:true,  phe_duyet:true  }, "quan-ly": { xem:true, tao:false,sua:false,xoa:false, phe_duyet:false }, "kiem-dinh-vien": { xem:false,tao:false, sua:false, xoa:false, phe_duyet:false }, "nhan-vien-nhap-lieu": { xem:false,tao:false, sua:false,xoa:false, phe_duyet:false }, "doi-tac": { xem:false, tao:false, sua:false, xoa:false, phe_duyet:false }, "nguoi-xem": { xem:false, tao:false, sua:false, xoa:false, phe_duyet:false } } },
  { name: "Tích hợp API",       roles: { "quan-tri-vien": { xem:true, tao:true, sua:true, xoa:true,  phe_duyet:true  }, "quan-ly": { xem:true, tao:false,sua:false,xoa:false, phe_duyet:false }, "kiem-dinh-vien": { xem:false,tao:false, sua:false, xoa:false, phe_duyet:false }, "nhan-vien-nhap-lieu": { xem:false,tao:false, sua:false,xoa:false, phe_duyet:false }, "doi-tac": { xem:true,  tao:true, sua:false, xoa:false, phe_duyet:false }, "nguoi-xem": { xem:false, tao:false, sua:false, xoa:false, phe_duyet:false } } },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPartnerCompanies(partnerId: string) {
  return scopeCompanies.filter((c) => c.doi_tac_id === partnerId);
}

function computePreviewCount(scope: DataScopeState): number {
  return scopeCompanies.filter((c) => {
    // Agency filter
    if (scope.agencyType === "specific") {
      const ps = scope.partnerScopes[c.doi_tac_id];
      if (!ps) return false;
      if (ps.mode === "exclude" && ps.excludeList.includes(c.id)) return false;
      if (ps.mode === "allow_only" && !ps.allowList.includes(c.id)) return false;
    }
    // Region filter
    if (scope.regionType === "specific" && !scope.selectedProvinces.includes(c.province)) return false;
    // Category filter
    if (scope.categoryType === "specific" && !scope.selectedCategories.includes(c.category_id)) return false;
    return true;
  }).length;
}

function getModeLabel(ps: PartnerScope, totalDn: number): string {
  if (ps.mode === "allow_all") return `${totalDn}/${totalDn}`;
  if (ps.mode === "exclude") return `${totalDn - ps.excludeList.length}/${totalDn} (−${ps.excludeList.length})`;
  return `${ps.allowList.length} chỉ định`;
}

function ModeDot({ mode }: { mode: AgencyMode }) {
  const color =
    mode === "allow_all" ? "bg-green-500" :
    mode === "exclude"   ? "bg-amber-500" :
                           "bg-purple-500";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PermCell({ allowed }: { allowed: boolean }) {
  return (
    <div className="flex justify-center">
      {allowed
        ? <span className="text-green-600 font-bold text-base">✓</span>
        : <span className="text-gray-300 text-base">—</span>}
    </div>
  );
}

// Partner detail modal: shows DN list with checkbox interactions
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
  const ps = scope.partnerScopes[partnerId] ?? { mode: "allow_all" as AgencyMode, excludeList: [], allowList: [] };

  function updatePs(updated: PartnerScope) {
    onScopeChange({
      ...scope,
      partnerScopes: { ...scope.partnerScopes, [partnerId]: updated },
    });
  }

  function handleDnToggle(dnId: string) {
    if (ps.mode === "allow_all") {
      // Uncheck → switch to exclude, add to excludeList
      updatePs({ ...ps, mode: "exclude", excludeList: [dnId], allowList: [] });
    } else if (ps.mode === "exclude") {
      const inExclude = ps.excludeList.includes(dnId);
      const newList = inExclude
        ? ps.excludeList.filter((id) => id !== dnId)
        : [...ps.excludeList, dnId];
      updatePs({ ...ps, excludeList: newList, mode: newList.length === 0 ? "allow_all" : "exclude" });
    } else {
      // allow_only
      const inAllow = ps.allowList.includes(dnId);
      const newList = inAllow
        ? ps.allowList.filter((id) => id !== dnId)
        : [...ps.allowList, dnId];
      updatePs({ ...ps, allowList: newList });
    }
  }

  function handleAllowAll() {
    updatePs({ mode: "allow_all", excludeList: [], allowList: [] });
  }

  function handleAllowOnly() {
    setShowConfirm(true);
  }

  function confirmAllowOnly() {
    updatePs({ mode: "allow_only", excludeList: [], allowList: [] });
    setShowConfirm(false);
  }

  function isDnChecked(dnId: string): boolean {
    if (ps.mode === "allow_all") return true;
    if (ps.mode === "exclude") return !ps.excludeList.includes(dnId);
    return ps.allowList.includes(dnId);
  }

  return (
    <>
      <Modal isOpen title={`Chi tiết: ${partner.ten}`} onClose={onClose}>
        {/* Mode controls */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleAllowAll}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              ps.mode === "allow_all"
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ModeDot mode="allow_all" />
            Allow all
          </button>
          <button
            onClick={handleAllowOnly}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              ps.mode === "allow_only"
                ? "bg-purple-50 border-purple-300 text-purple-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ModeDot mode="allow_only" />
            Allow only
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <ModeDot mode={ps.mode} />
            <span className="text-xs text-gray-500">{getModeLabel(ps, dns.length)}</span>
          </div>
        </div>

        {/* DN list */}
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {dns.map((dn) => {
            const checked = isDnChecked(dn.id);
            const isExcluded = ps.mode === "exclude" && ps.excludeList.includes(dn.id);
            return (
              <label
                key={dn.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleDnToggle(dn.id)}
                  className="w-4 h-4 rounded accent-brand-600"
                />
                <Building2 size={14} className={isExcluded ? "text-red-400" : "text-gray-400"} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isExcluded ? "text-red-500 line-through" : "text-gray-700"}`}>
                    {dn.ten}
                  </p>
                  <p className="text-xs text-gray-400">{dn.id}</p>
                </div>
                {isExcluded && <Badge variant="danger">Loại trừ</Badge>}
                {ps.mode === "allow_only" && checked && <Badge variant="info">Cho phép</Badge>}
              </label>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          {ps.mode === "allow_all" && "Tất cả doanh nghiệp thuộc đối tác này đều trong phạm vi. DN mới tự động vào scope."}
          {ps.mode === "exclude" && `Tất cả trừ ${ps.excludeList.length} DN đã loại trừ. DN mới tự động vào scope (trừ danh sách loại trừ).`}
          {ps.mode === "allow_only" && "Chỉ các DN được chỉ định mới trong scope. DN mới sẽ KHÔNG tự động vào scope."}
        </div>
      </Modal>

      {/* Confirm switch to Allow only */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Chuyển sang chế độ Allow only?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Chế độ <strong>Allow only</strong> tắt cập nhật tự động. Doanh nghiệp mới đăng ký qua đối tác này
                  sẽ <strong>không tự động vào scope</strong> — bạn cần thêm thủ công mỗi khi có DN mới.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmAllowOnly}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Xác nhận chuyển
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Agency scope column
function AgencyScopeSection({
  scope,
  onScopeChange,
}: {
  scope: DataScopeState;
  onScopeChange: (s: DataScopeState) => void;
}) {
  const [openPartnerId, setOpenPartnerId] = useState<string | null>(null);

  function togglePartner(partnerId: string) {
    const isSelected = partnerId in scope.partnerScopes;
    if (isSelected) {
      const rest = { ...scope.partnerScopes };
      delete rest[partnerId];
      onScopeChange({ ...scope, partnerScopes: rest, agencyType: Object.keys(rest).length === 0 ? "all" : "specific" });
    } else {
      onScopeChange({
        ...scope,
        agencyType: "specific",
        partnerScopes: {
          ...scope.partnerScopes,
          [partnerId]: { mode: "allow_all", excludeList: [], allowList: [] },
        },
      });
    }
  }

  const hasAny = Object.keys(scope.partnerScopes).length > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-0.5">
          <Building2 size={15} className="text-brand-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Theo Đối tác</h3>
        </div>
        <p className="text-xs text-gray-400">Tick đối tác để thêm vào phạm vi. Click tên để cấu hình chi tiết.</p>
      </div>

      {/* All toggle */}
      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input
          type="radio"
          name="agency-type"
          checked={scope.agencyType === "all"}
          onChange={() => onScopeChange({ ...scope, agencyType: "all", partnerScopes: {} })}
          className="accent-brand-600"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Tất cả đối tác</span>
        {scope.agencyType === "all" && <Badge variant="success">Active</Badge>}
      </label>

      {/* Partner list */}
      <div className="flex-1 overflow-y-auto max-h-96">
        {scopePartners.map((partner) => {
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
                    className={`text-sm font-medium text-left w-full truncate ${
                      isSelected ? "text-gray-800 dark:text-gray-200 hover:text-brand-600 cursor-pointer" : "text-gray-400 cursor-default"
                    }`}
                  >
                    {partner.ten}
                  </button>
                  <p className="text-xs text-gray-400">{partner.tinh}</p>
                </div>
                {isSelected && ps && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <ModeDot mode={ps.mode} />
                    <span className="text-xs text-gray-500">{getModeLabel(ps, dns.length)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasAny && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
          <p className="text-xs text-gray-400">
            {Object.keys(scope.partnerScopes).length} đối tác được chọn
          </p>
        </div>
      )}

      {/* Partner detail modal */}
      {openPartnerId && (
        <PartnerDetailModal
          partnerId={openPartnerId}
          scope={scope}
          onScopeChange={onScopeChange}
          onClose={() => setOpenPartnerId(null)}
        />
      )}
    </div>
  );
}

// Region scope column
function RegionScopeSection({
  scope,
  onScopeChange,
}: {
  scope: DataScopeState;
  onScopeChange: (s: DataScopeState) => void;
}) {
  function toggleProvince(id: string) {
    const selected = scope.selectedProvinces.includes(id)
      ? scope.selectedProvinces.filter((p) => p !== id)
      : [...scope.selectedProvinces, id];
    onScopeChange({ ...scope, selectedProvinces: selected });
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-0.5">
          <MapPin size={15} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Theo Địa phương</h3>
        </div>
        <p className="text-xs text-gray-400">Chọn tỉnh/thành — tự bao gồm toàn bộ quận/huyện.</p>
      </div>

      {/* All */}
      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input
          type="radio"
          name="region-type"
          checked={scope.regionType === "all"}
          onChange={() => onScopeChange({ ...scope, regionType: "all", selectedProvinces: [] })}
          className="accent-brand-600"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Tất cả địa phương</span>
        {scope.regionType === "all" && <Badge variant="success">Active</Badge>}
      </label>

      {/* Specific */}
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

      {/* Province list */}
      {scope.regionType === "specific" && (
        <div className="flex-1 overflow-y-auto max-h-80">
          {provinceTree.map((prov) => {
            const checked = scope.selectedProvinces.includes(prov.id);
            return (
              <label
                key={prov.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleProvince(prov.id)}
                  className="w-4 h-4 rounded accent-brand-600"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{prov.ten}</p>
                  <p className="text-xs text-gray-400">→ {prov.so_quan} quận/huyện</p>
                </div>
                {checked && <Check size={14} className="text-green-500 flex-shrink-0" />}
              </label>
            );
          })}
        </div>
      )}

      {scope.regionType === "specific" && scope.selectedProvinces.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
          <p className="text-xs text-gray-400">{scope.selectedProvinces.length} tỉnh/thành được chọn</p>
        </div>
      )}
    </div>
  );
}

// Category scope column
function CategoryScopeSection({
  scope,
  onScopeChange,
}: {
  scope: DataScopeState;
  onScopeChange: (s: DataScopeState) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const parents = categoryTree.filter((c) => c.parent_id === null);

  function toggleCategory(id: string) {
    const selected = scope.selectedCategories.includes(id)
      ? scope.selectedCategories.filter((c) => c !== id)
      : [...scope.selectedCategories, id];
    onScopeChange({ ...scope, selectedCategories: selected });
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-0.5">
          <Layers size={15} className="text-emerald-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Theo Nhóm ngành</h3>
        </div>
        <p className="text-xs text-gray-400">Chọn nhóm cha — tự bao gồm tất cả danh mục con.</p>
      </div>

      {/* All */}
      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input
          type="radio"
          name="category-type"
          checked={scope.categoryType === "all"}
          onChange={() => onScopeChange({ ...scope, categoryType: "all", selectedCategories: [] })}
          className="accent-brand-600"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Tất cả nhóm ngành</span>
        {scope.categoryType === "all" && <Badge variant="success">Active</Badge>}
      </label>

      {/* Specific */}
      <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <input
          type="radio"
          name="category-type"
          checked={scope.categoryType === "specific"}
          onChange={() => onScopeChange({ ...scope, categoryType: "specific" })}
          className="accent-brand-600"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Chọn cụ thể</span>
      </label>

      {/* Category tree */}
      {scope.categoryType === "specific" && (
        <div className="flex-1 overflow-y-auto max-h-80">
          {parents.map((parent) => {
            const children = categoryTree.filter((c) => c.parent_id === parent.id);
            const isChecked = scope.selectedCategories.includes(parent.id);
            const isExpanded = expanded[parent.id] ?? true;

            return (
              <div key={parent.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(parent.id)}
                    className="w-4 h-4 rounded accent-brand-600"
                  />
                  <button
                    onClick={() => toggleExpand(parent.id)}
                    className="flex items-center gap-1.5 flex-1 text-left"
                  >
                    {isExpanded
                      ? <ChevronDown size={13} className="text-gray-400 flex-shrink-0" />
                      : <ChevronRight size={13} className="text-gray-400 flex-shrink-0" />}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{parent.ten}</span>
                  </button>
                  {isChecked && <Check size={14} className="text-green-500 flex-shrink-0" />}
                </div>

                {isExpanded && children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center gap-2 pl-10 pr-4 py-2 bg-gray-50/50 dark:bg-gray-800/20"
                  >
                    <span className="w-3 h-px bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                    <span className={`text-xs ${isChecked ? "text-gray-600 dark:text-gray-400" : "text-gray-400"}`}>
                      {child.ten}
                    </span>
                    {isChecked && (
                      <span className="ml-auto text-[10px] text-green-600 font-medium">included</span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {scope.categoryType === "specific" && scope.selectedCategories.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 rounded-b-2xl">
          <p className="text-xs text-gray-400">{scope.selectedCategories.length} nhóm ngành được chọn</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Phân quyền chức năng ────────────────────────────────────────────────

function FunctionPermTab({ roleId }: { roleId: string }) {
  const role = phanQuyenRoles.find((r) => r.id === roleId);
  if (!role) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Ma trận quyền chức năng — {role.ten}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">Quyền thao tác trên từng module hệ thống</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-3 text-[13px] font-semibold text-gray-600 dark:text-gray-400 w-48">Module</th>
              {["Xem", "Tạo", "Sửa", "Xóa", "Phê duyệt"].map((p) => (
                <th key={p} className="text-center px-3 py-3 text-[13px] font-semibold text-gray-600 dark:text-gray-400">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, i) => {
              const perms = (mod.roles as Record<string, { xem: boolean; tao: boolean; sua: boolean; xoa: boolean; phe_duyet: boolean }>)[roleId] ?? { xem: false, tao: false, sua: false, xoa: false, phe_duyet: false };
              return (
                <tr key={mod.name} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50"}>
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-[13px]">{mod.name}</td>
                  <td className="px-3 py-3"><PermCell allowed={perms.xem} /></td>
                  <td className="px-3 py-3"><PermCell allowed={perms.tao} /></td>
                  <td className="px-3 py-3"><PermCell allowed={perms.sua} /></td>
                  <td className="px-3 py-3"><PermCell allowed={perms.xoa} /></td>
                  <td className="px-3 py-3"><PermCell allowed={perms.phe_duyet} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Phân quyền dữ liệu ─────────────────────────────────────────────────

function DataScopeTab({ roleId }: { roleId: string }) {
  const [scope, setScope] = useState<DataScopeState>({
    agencyType: "all",
    partnerScopes: {},
    regionType: "all",
    selectedProvinces: [],
    categoryType: "all",
    selectedCategories: [],
  });
  const [saved, setSaved] = useState(false);

  const previewCount = useMemo(() => computePreviewCount(scope), [scope]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setScope({ agencyType: "all", partnerScopes: {}, regionType: "all", selectedProvinces: [], categoryType: "all", selectedCategories: [] });
  }

  return (
    <div className="space-y-4">
      {/* Preview banner */}
      <div className="bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border border-brand-100 dark:border-brand-800 rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center">
          <Database size={18} className="text-brand-600 dark:text-brand-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">Phạm vi dữ liệu hiện tại</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {previewCount === scopeCompanies.length
              ? `Toàn bộ ${previewCount} doanh nghiệp`
              : `${previewCount} doanh nghiệp trong scope`}
          </p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>Logic kết hợp: <strong className="text-gray-600 dark:text-gray-300">AND</strong></p>
          <p>Cập nhật real-time theo cấu hình</p>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-4">
        <AgencyScopeSection scope={scope} onScopeChange={setScope} />
        <RegionScopeSection scope={scope} onScopeChange={setScope} />
        <CategoryScopeSection scope={scope} onScopeChange={setScope} />
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-5 py-3">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Chú thích chế độ đối tác:</p>
        <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Allow all — DN mới tự vào scope</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Exclude — Trừ danh sách loại trừ, DN mới tự vào scope</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Allow only — Chỉ DN chỉ định, DN mới KHÔNG tự vào scope</span>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Đặt lại về mặc định
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl transition-colors ${
            saved
              ? "bg-green-500 text-white"
              : "bg-brand-600 hover:bg-brand-700 text-white"
          }`}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saved ? "Đã lưu!" : "Lưu cấu hình"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState(0);

  const role = phanQuyenRoles.find((r) => r.id === id);

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <ShieldCheck size={40} className="text-gray-300" />
          <p className="text-gray-500">Không tìm thấy vai trò</p>
          <button onClick={() => router.back()} className="text-sm text-brand-600 hover:underline">← Quay lại</button>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { label: "Phân quyền chức năng", icon: ShieldCheck },
    { label: "Phân quyền dữ liệu",   icon: Database    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{role.ten}</h1>
            {role.scope_configured
              ? <Badge variant="success">Phạm vi đã cấu hình</Badge>
              : <Badge variant="warning">Chưa cấu hình phạm vi</Badge>
            }
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {role.mo_ta} &nbsp;·&nbsp;
            <span className="inline-flex items-center gap-1"><Users size={12} /> {role.so_nguoi.toLocaleString()} người dùng</span>
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === i
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 0 && <FunctionPermTab roleId={id} />}
      {activeTab === 1 && <DataScopeTab roleId={id} />}
    </DashboardLayout>
  );
}
