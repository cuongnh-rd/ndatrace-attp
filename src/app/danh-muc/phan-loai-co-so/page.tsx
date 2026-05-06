"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TableToolbar from "@/components/ui/TableToolbar";
import PageHeader from "@/components/ui/PageHeader";
import { Plus } from "lucide-react";
import { EMPTY_FORM, NSP_OPTIONS, PhanLoai, generateMaPL, initialData } from "./_data";
import PhanLoaiTable from "./_PhanLoaiTable";
import PhanLoaiModal from "./_PhanLoaiModal";
import DeleteModal from "./_DeleteModal";

type ModalMode = "add" | "edit" | null;

export default function PhanLoaiCoSoPage() {
  const [data, setData] = useState<PhanLoai[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<PhanLoai | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<PhanLoai | null>(null);

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((d) => {
      if (q && !(d.maPL.toLowerCase().includes(q) || d.tenPhanLoai.toLowerCase().includes(q))) return false;
      if (filters.trangThai && d.trangThai !== filters.trangThai) return false;
      return true;
    });
  }, [data, searchQuery, filters]);

  function openAdd() {
    setSelectedItem(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setModalMode("add");
  }

  function openEdit(item: PhanLoai) {
    setSelectedItem(item);
    setFormData({
      maPL: item.maPL,
      tenPhanLoai: item.tenPhanLoai,
      moTa: item.moTa,
      trangThai: item.trangThai,
      nhomSanPhamIds: item.nhomSanPhamIds,
    });
    setErrors({});
    setModalMode("edit");
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((d) => d.maPL !== deleteTarget.maPL));
    setDeleteTarget(null);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.tenPhanLoai.trim()) errs.tenPhanLoai = "Tên loại là bắt buộc";
    if (formData.nhomSanPhamIds.length === 0) errs.nhomSanPhamIds = "Phải chọn ít nhất 1 Nhóm sản phẩm";
    if (modalMode === "add" && formData.maPL.trim()) {
      const dup = data.find((d) => d.maPL === formData.maPL.trim());
      if (dup) errs.maPL = "Mã loại đã tồn tại";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;

    const resolvedMaPL = modalMode === "add"
      ? (formData.maPL.trim() || generateMaPL(data))
      : selectedItem!.maPL;

    const names = NSP_OPTIONS
      .filter((o) => formData.nhomSanPhamIds.includes(o.value))
      .map((o) => o.label);

    if (modalMode === "add") {
      setData((prev) => [...prev, {
        maPL: resolvedMaPL,
        tenPhanLoai: formData.tenPhanLoai,
        moTa: formData.moTa,
        trangThai: formData.trangThai,
        nhomSanPhamIds: formData.nhomSanPhamIds,
        nhomSanPhamNames: names,
        soCoSo: 0,
      }]);
    } else {
      setData((prev) =>
        prev.map((d) =>
          d.maPL === selectedItem!.maPL
            ? { ...d, tenPhanLoai: formData.tenPhanLoai, moTa: formData.moTa, trangThai: formData.trangThai, nhomSanPhamIds: formData.nhomSanPhamIds, nhomSanPhamNames: names }
            : d
        )
      );
    }
    setModalMode(null);
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Phân loại cơ sở"
        subtitle="Quản lý danh mục phân loại các cơ sở kinh doanh thực phẩm trên địa bàn"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Thêm phân loại
          </button>
        }
      />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <TableToolbar
          searchable
          searchQuery={searchQuery}
          onSearchChange={(v: string) => setSearchQuery(v)}
          filterableCols={[
            { key: "trangThai", label: "Trạng thái", options: ["Hoạt động", "Không hoạt động"] },
          ]}
          data={data as unknown as Record<string, unknown>[]}
          filters={filters}
          onFilterChange={(key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }))}
          onClearFilters={() => setFilters({})}
          total={filteredData.length}
        />
        <PhanLoaiTable data={filteredData} onEdit={openEdit} onDelete={(item) => setDeleteTarget(item)} />
      </div>

      <DeleteModal
        item={deleteTarget}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <PhanLoaiModal
        mode={modalMode ?? "add"}
        isOpen={modalMode !== null}
        formData={formData}
        errors={errors}
        onChange={(patch) => {
          setFormData((prev) => ({ ...prev, ...patch }));
          setErrors((prev) => {
            const next = { ...prev };
            Object.keys(patch).forEach((k) => delete next[k]);
            return next;
          });
        }}
        onSave={handleSave}
        onClose={() => setModalMode(null)}
      />
    </DashboardLayout>
  );
}
