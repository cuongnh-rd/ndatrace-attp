"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, Database, AlertTriangle, ChevronDown, ChevronRight,
  Building2, MapPin, Layers, Save, X, Check, Users, Info, Search,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import {
  phanQuyenRoles, scopePartners, scopeCompanies, provinceTree, categoryTree, wardTree,
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
  provinceScopes: Record<string, string[]>;   // province_id → [] = all wards | [wardId,...] = specific
  categoryType: "all" | "specific";
  selectedCategories: string[];
  categoryScopes: Record<string, string[]>;   // parent_id → [] = all children | [childId,...] = specific
}

// ─── Static permission data ──────────────────────────────────────────────────

type RolePerm = { xem: boolean; tao: boolean; sua: boolean; xoa: boolean; xuat: boolean; phe_duyet: boolean };

const modules: { name: string; roles: Record<string, RolePerm> }[] = [
  {
    name: "Doanh nghiệp",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: true },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
  {
    name: "Cơ sở",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
  {
    name: "Sản phẩm",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
  {
    name: "Sự kiện truy xuất",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Tem nhãn (UID/QR)",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Chứng chỉ",
    roles: {
      "super-admin": { xem: true, tao: false, sua: true, xoa: false, xuat: false, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: true },
      "so-tinh-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: true },
      "dai-ly-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Báo cáo",
    roles: {
      "super-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
  {
    name: "Quản trị người dùng",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "so-tinh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Tích hợp API",
    roles: {
      "super-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "bo-ban-nganh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-admin": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "so-tinh-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: true, sua: true, xoa: true, xuat: false, phe_duyet: false },
      "dai-ly-ops": { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
    },
  },
  {
    name: "Báo cáo sản phẩm",
    roles: {
      "super-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: true },
      "bo-ban-nganh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: true },
      "bo-ban-nganh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "so-tinh-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-admin": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
      "dai-ly-ops": { xem: true, tao: false, sua: false, xoa: false, xuat: true, phe_duyet: false },
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPartnerCompanies(partnerId: string) {
  return scopeCompanies.filter((c) => c.doi_tac_id === partnerId);
}

function computePreviewCount(scope: DataScopeState): number {
  return scopeCompanies.filter((c) => {
    if (scope.agencyType === "specific") {
      const ps = scope.partnerScopes[c.doi_tac_id];
      if (!ps) return false;
      if (ps.mode === "exclude" && ps.excludeList.includes(c.id)) return false;
      if (ps.mode === "allow_only" && !ps.allowList.includes(c.id)) return false;
    }
    if (scope.regionType === "specific" && !scope.selectedProvinces.includes(c.province)) return false;
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
      mode === "exclude" ? "bg-amber-500" :
        "bg-purple-500";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />;
}

function PermCell({ allowed }: { allowed: boolean }) {
  return (
    <div className="flex justify-center">
      {allowed
        ? <span className="text-green-600 font-bold text-base">✓</span>
        : <span className="text-gray-300 text-base">—</span>}
    </div>
  );
}

// ─── Partner detail modal ─────────────────────────────────────────────────────

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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${ps.mode === "allow_all" ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            <ModeDot mode="allow_all" /> Chọn toàn bộ
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${ps.mode === "allow_only" ? "bg-purple-50 border-purple-300 text-purple-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            <ModeDot mode="allow_only" /> Chọn chỉ định
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
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Chuyển sang chế độ Chọn chỉ định?</h3>
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

// ─── Province detail modal ────────────────────────────────────────────────────

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

// ─── Category detail modal ────────────────────────────────────────────────────

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

// ─── Agency scope section ─────────────────────────────────────────────────────

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
                placeholder="Tìm kiếm đối tác..."
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

// ─── Region scope section ─────────────────────────────────────────────────────

function RegionScopeSection({ scope, onScopeChange }: { scope: DataScopeState; onScopeChange: (s: DataScopeState) => void }) {
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-0.5">
          <MapPin size={15} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Theo Địa phương</h3>
        </div>
        <p className="text-xs text-gray-400">Chọn tỉnh/thành — click tên để giới hạn đến xã/phường cụ thể.</p>
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
                placeholder="Tìm kiếm tỉnh/thành..."
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
            ) : provinceTree.filter((p) => p.ten.toLowerCase().includes(query.toLowerCase())).map((prov) => {
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
                    <p className="text-xs text-gray-400">→ {prov.so_xa} xã/phường</p>
                  </div>
                  {checked && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${wardScope && wardScope.length > 0 ? "bg-blue-500" : "bg-green-500"}`} />
                      <span className="text-xs text-gray-500">{wardLabel}</span>
                    </div>
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

// ─── Category scope section ───────────────────────────────────────────────────

function CategoryScopeSection({ scope, onScopeChange }: { scope: DataScopeState; onScopeChange: (s: DataScopeState) => void }) {
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-0.5">
          <Layers size={15} className="text-emerald-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Theo Nhóm ngành</h3>
        </div>
        <p className="text-xs text-gray-400">Chọn nhóm cha — click tên để giới hạn đến danh mục con cụ thể.</p>
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
                placeholder="Tìm kiếm nhóm ngành..."
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
            {parents.filter((parent) => {
              const children = categoryTree.filter((c) => c.parent_id === parent.id);
              const q = query.toLowerCase();
              return parent.ten.toLowerCase().includes(q) || children.some((c) => c.ten.toLowerCase().includes(q));
            }).length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-gray-400">Không tìm thấy kết quả phù hợp</div>
            ) : parents.filter((parent) => {
              const children = categoryTree.filter((c) => c.parent_id === parent.id);
              const q = query.toLowerCase();
              return parent.ten.toLowerCase().includes(q) || children.some((c) => c.ten.toLowerCase().includes(q));
            }).map((parent) => {
              const children = categoryTree.filter((c) => c.parent_id === parent.id);
              const isChecked = scope.selectedCategories.includes(parent.id);
              const isExpanded = expanded[parent.id] ?? false;
              const childScope = scope.categoryScopes[parent.id];
              const childLabel = childScope && childScope.length > 0 ? `${childScope.length}/${children.length} danh mục con` : `Tất cả danh mục con`;
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

// ─── Tab: Phân quyền chức năng ────────────────────────────────────────────────

function FunctionPermTab({ roleId }: { roleId: string }) {
  const role = phanQuyenRoles.find((r) => r.id === roleId);
  if (!role) return null;

  const permCols: { key: keyof RolePerm; label: string }[] = [
    { key: "xem", label: "Xem" },
    { key: "tao", label: "Tạo" },
    { key: "sua", label: "Sửa" },
    { key: "xoa", label: "Xóa" },
    { key: "xuat", label: "Xuất" },
    { key: "phe_duyet", label: "Phê duyệt" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Quyền thao tác trên từng chức năng
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-3 text-[13px] font-semibold text-gray-600 dark:text-gray-400 w-52">Chức năng</th>
              {permCols.map((col) => (
                <th key={col.key} className="text-center px-3 py-3 text-[13px] font-semibold text-gray-600 dark:text-gray-400">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, i) => {
              const perms = mod.roles[roleId] ?? { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false };
              return (
                <tr key={mod.name} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50"}>
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-[13px]">{mod.name}</td>
                  {permCols.map((col) => (
                    <td key={col.key} className="px-3 py-3">
                      <PermCell allowed={perms[col.key]} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Default scopes per role (pre-configured from docx) ──────────────────────

const defaultScopes: Record<string, DataScopeState> = {
  // Quản trị quốc gia — toàn hệ thống, không giới hạn
  "super-admin": {
    agencyType: "all", partnerScopes: {},
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "all", selectedCategories: [], categoryScopes: {},
  },
  // Bộ ban ngành Admin — toàn quốc, toàn ngành
  "bo-ban-nganh-admin": {
    agencyType: "all", partnerScopes: {},
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "all", selectedCategories: [], categoryScopes: {},
  },
  // Bộ ban ngành Ops — lọc theo ngành hàng được gán (VD: Bộ NN&PTNT → Nông sản thực phẩm)
  "bo-ban-nganh-ops": {
    agencyType: "all", partnerScopes: {},
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "specific", selectedCategories: ["NS001"], categoryScopes: {},
  },
  // Sở tỉnh Admin — lọc theo tỉnh được gán (VD: Sở NN&PTNT Hà Nội)
  "so-tinh-admin": {
    agencyType: "all", partnerScopes: {},
    regionType: "specific", selectedProvinces: ["HN"], provinceScopes: {},
    categoryType: "all", selectedCategories: [], categoryScopes: {},
  },
  // Sở tỉnh Ops — lọc theo tỉnh + ngành hàng (VD: cán bộ Sở HN - nông sản)
  "so-tinh-ops": {
    agencyType: "all", partnerScopes: {},
    regionType: "specific", selectedProvinces: ["HN"], provinceScopes: {},
    categoryType: "specific", selectedCategories: ["NS001"], categoryScopes: {},
  },
  // Đại lý Admin — phạm vi đại lý của mình (VD: Đại lý Hà Nội - AgriLink)
  "dai-ly-admin": {
    agencyType: "specific",
    partnerScopes: { "DT001": { mode: "allow_all", excludeList: [], allowList: [] } },
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "specific", selectedCategories: ["NS001"], categoryScopes: {},
  },
  // Đại lý Ops — thừa hưởng từ admin đại lý
  "dai-ly-ops": {
    agencyType: "specific",
    partnerScopes: { "DT001": { mode: "allow_all", excludeList: [], allowList: [] } },
    regionType: "all", selectedProvinces: [], provinceScopes: {},
    categoryType: "specific", selectedCategories: ["NS001"], categoryScopes: {},
  },
};

const emptyScope: DataScopeState = {
  agencyType: "all", partnerScopes: {},
  regionType: "all", selectedProvinces: [], provinceScopes: {},
  categoryType: "all", selectedCategories: [], categoryScopes: {},
};

// ─── Tab: Phân quyền dữ liệu ─────────────────────────────────────────────────

function DataScopeTab({ roleId }: { roleId: string }) {
  const [scope, setScope] = useState<DataScopeState>(
    defaultScopes[roleId] ?? emptyScope
  );
  const [saved, setSaved] = useState(false);

  const previewCount = useMemo(() => computePreviewCount(scope), [scope]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setScope(defaultScopes[roleId] ?? emptyScope);
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border border-brand-100 dark:border-brand-800 rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center">
          <Database size={18} className="text-brand-600 dark:text-brand-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">Phạm vi dữ liệu hiện tại</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {previewCount === scopeCompanies.length
              ? `Toàn bộ ${previewCount} doanh nghiệp`
              : `${previewCount} doanh nghiệp`}
          </p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>Logic kết hợp: <strong className="text-gray-600 dark:text-gray-300">AND</strong></p>
          <p>Cập nhật real-time theo cấu hình</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <AgencyScopeSection scope={scope} onScopeChange={setScope} />
        <RegionScopeSection scope={scope} onScopeChange={setScope} />
        <CategoryScopeSection scope={scope} onScopeChange={setScope} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-5 py-3">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Chú thích chế độ đối tác:</p>
        <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Chọn toàn bộ — Tự động cập nhật Doanh nghiệp mới</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Loại trừ — Trừ danh sách loại trừ, tự động cập nhật doanh nghiệp mới</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Chọn chỉ định — Chỉ doanh nghiệp chỉ định, KHÔNG cập nhật doanh nghiệp mới</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Đặt lại về mặc định
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl transition-colors ${saved ? "bg-green-500 text-white" : "bg-brand-600 hover:bg-brand-700 text-white"}`}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saved ? "Đã lưu!" : "Lưu cấu hình"}
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Thông tin vai trò ───────────────────────────────────────────────────

function RoleInfoTab({ role }: { role: { id: string; ten: string; mo_ta: string; so_nguoi: number; scope_configured: boolean } }) {
  const [ten, setTen] = useState(role.ten);
  const [moTa, setMoTa] = useState(role.mo_ta);
  const [trangThai, setTrangThai] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Card thông tin chính */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thông tin vai trò</h2>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Tên vai trò */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Tên vai trò <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              placeholder="Nhập tên vai trò..."
              className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-colors"
            />
          </div>

          {/* Mô tả vai trò */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Mô tả vai trò
            </label>
            <textarea
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              placeholder="Nhập mô tả cho vai trò này..."
              rows={4}
              className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-colors resize-none"
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Trạng thái
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTrangThai(!trangThai)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${trangThai ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${trangThai ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
              <span className={`text-sm font-medium ${trangThai ? "text-green-600" : "text-gray-400"}`}>
                {trangThai ? "Hoạt động" : "Không hoạt động"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card thông tin hệ thống (read-only) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thông tin hệ thống</h2>
          {/* <p className="text-xs text-gray-400 mt-0.5">Chỉ đọc — được quản lý tự động bởi hệ thống</p> */}
        </div>
        <div className="px-5 py-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Mã vai trò</p>
            <p className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">{role.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Số người dùng</p>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
              <Users size={13} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{role.so_nguoi.toLocaleString()} người</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-1">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl transition-colors ${saved ? "bg-green-500 text-white" : "bg-brand-600 hover:bg-brand-700 text-white"
            }`}
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saved ? "Đã lưu!" : "Lưu thông tin"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState(0);

  const role = phanQuyenRoles.find((r) => r.id === id);

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <ShieldCheck size={40} className="text-gray-300" />
          <p className="text-gray-500">Không tìm thấy vai trò</p>
          <Link href="/quan-tri/vai-tro" className="text-sm text-brand-600 hover:underline">← Quay lại danh sách</Link>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { label: "Thông tin vai trò", icon: Info },
    { label: "Phân quyền chức năng", icon: ShieldCheck },
    { label: "Phân quyền dữ liệu", icon: Database },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/quan-tri/vai-tro"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{role.ten}</h1>
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
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === i
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

      {activeTab === 0 && <RoleInfoTab role={role} />}
      {activeTab === 1 && <FunctionPermTab roleId={id} />}
      {activeTab === 2 && <DataScopeTab roleId={id} />}
    </DashboardLayout>
  );
}
