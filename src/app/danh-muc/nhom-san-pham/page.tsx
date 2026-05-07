"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TableToolbar from "@/components/ui/TableToolbar";
import PageHeader from "@/components/ui/PageHeader";
import { Plus } from "lucide-react";
import { EMPTY_FORM, NhomSanPham, NspStatus, STATUS_LABEL_MAP, initialData } from "./_data";
import NhomSanPhamTable from "./_NhomSanPhamTable";
import NhomSanPhamModal from "./_NhomSanPhamModal";
import ViewModal from "./_ViewModal";
import DeleteModal from "./_DeleteModal";

type ModalMode = "add" | "edit" | null;

export default function NhomSanPhamPage() {
  const [data, setData] = useState<NhomSanPham[]>(initialData);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<NhomSanPham | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [viewTarget, setViewTarget] = useState<NhomSanPham | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NhomSanPham | null>(null);

  const visibleData = data.filter((d) => d.status !== ("DELETED" as NspStatus));

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visibleData.filter((d) => {
      if (q && !(d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q) || d.administrative_unit.toLowerCase().includes(q))) return false;
      if (filters.status && d.status !== STATUS_LABEL_MAP[filters.status]) return false;
      if (filters.administrative_unit && d.administrative_unit !== filters.administrative_unit) return false;
      return true;
    });
  }, [visibleData, searchQuery, filters]);

  const toolbarData = useMemo(
    () => visibleData.map((d) => ({
      ...d,
      status: d.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động",
    })),
    [visibleData]
  );

  function openAdd() {
    setFormData(EMPTY_FORM);
    setErrors({});
    setSelectedItem(null);
    setModalMode("add");
  }

  function openEdit(item: NhomSanPham) {
    setFormData({
      code: item.code,
      name: item.name,
      administrative_unit: item.administrative_unit,
      description: item.description,
      status: item.status,
    });
    setErrors({});
    setSelectedItem(item);
    setModalMode("edit");
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.code.trim()) errs.code = "Mã nhóm là bắt buộc";
    if (!formData.name.trim()) errs.name = "Tên nhóm là bắt buộc";
    if (!formData.administrative_unit) errs.administrative_unit = "Vui lòng chọn đơn vị quản lý";

    const existingCode = data.find((d) => d.code === formData.code.trim() && d.id !== selectedItem?.id);
    if (existingCode) errs.code = "Mã nhóm đã tồn tại";

    const existingName = data.find((d) => d.name === formData.name.trim() && d.id !== selectedItem?.id);
    if (existingName) errs.name = "Tên nhóm đã tồn tại";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;

    if (modalMode === "add") {
      setData((prev) => [...prev, {
        id: String(Date.now()),
        code: formData.code.trim(),
        name: formData.name.trim(),
        administrative_unit: formData.administrative_unit,
        description: formData.description.trim(),
        status: "ACTIVE",
        so_loai_hinh: 0,
      }]);
    } else if (modalMode === "edit" && selectedItem) {
      if (formData.status === "INACTIVE" && selectedItem.status === "ACTIVE" && selectedItem.so_loai_hinh > 0) {
        const confirmed = window.confirm(
          `Nhóm sản phẩm này đang được liên kết với ${selectedItem.so_loai_hinh} Loại hình cơ sở. Việc vô hiệu hóa sẽ không tự động gỡ liên kết. Bạn có chắc không?`
        );
        if (!confirmed) return;
      }
      setData((prev) =>
        prev.map((d) =>
          d.id === selectedItem.id
            ? { ...d, name: formData.name.trim(), administrative_unit: formData.administrative_unit, description: formData.description.trim(), status: formData.status }
            : d
        )
      );
    }
    setModalMode(null);
    setSelectedItem(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setData((prev) => prev.map((d) => d.id === deleteTarget.id ? { ...d, status: "DELETED" as NspStatus } : d));
    setDeleteTarget(null);
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Nhóm sản phẩm"
        subtitle="Quản lý danh mục nhóm sản phẩm phục vụ phân loại cơ sở ATTP"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Thêm nhóm sản phẩm
          </button>
        }
      />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <TableToolbar
          searchable
          searchQuery={searchQuery}
          onSearchChange={(v: string) => setSearchQuery(v)}
          filterableCols={[
            { key: "status", label: "Tất cả trạng thái", options: ["Hoạt động", "Không hoạt động"] },
            { key: "administrative_unit", label: "Đơn vị quản lý" },
          ]}
          data={toolbarData as unknown as Record<string, unknown>[]}
          filters={filters}
          onFilterChange={(key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }))}
          onClearFilters={() => setFilters({})}
          total={filteredData.length}
        />
        <NhomSanPhamTable
          data={filteredData}
          onView={(item) => setViewTarget(item)}
          onEdit={openEdit}
          onDelete={(item) => setDeleteTarget(item)}
        />
      </div>

      <ViewModal
        item={viewTarget}
        onClose={() => setViewTarget(null)}
        onEdit={(item) => { setViewTarget(null); openEdit(item); }}
      />

      <DeleteModal
        item={deleteTarget}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <NhomSanPhamModal
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
        onClose={() => { setModalMode(null); setSelectedItem(null); }}
      />
    </DashboardLayout>
  );
}
