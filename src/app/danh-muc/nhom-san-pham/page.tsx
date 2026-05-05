"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TableToolbar from "@/components/ui/TableToolbar";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import { Plus, Layers, CheckCircle, XCircle, Link } from "lucide-react";

type NspStatus = "ACTIVE" | "INACTIVE";

interface NhomSanPham {
  id: string;
  code: string;
  name: string;
  administrative_unit: string;
  description: string;
  status: NspStatus;
  so_loai_hinh: number;
}

const ADMINISTRATIVE_UNITS = [
  "Bộ Quốc phòng",
  "Bộ Công an",
  "Bộ Ngoại giao",
  "Bộ Nội vụ",
  "Bộ Tư pháp",
  "Bộ Tài chính",
  "Bộ Công Thương",
  "Bộ Nông nghiệp và Môi trường",
  "Bộ Xây dựng",
  "Bộ Khoa học và Công nghệ",
  "Bộ Văn hóa, Thể thao và Du lịch",
  "Bộ Y tế",
  "Bộ Giáo dục và Đào tạo",
  "Bộ Dân tộc và Tôn giáo",
];

const STATUS_LABEL_MAP: Record<string, NspStatus> = {
  "Hoạt động": "ACTIVE",
  "Không hoạt động": "INACTIVE",
};

const initialData: NhomSanPham[] = [
  { id: "1", code: "NSP_YT_001", name: "Nước uống đóng chai", administrative_unit: "Bộ Y tế", description: "Nước đóng chai, nước tinh khiết, nước khoáng thiên nhiên", status: "ACTIVE", so_loai_hinh: 2 },
  { id: "2", code: "NSP_YT_002", name: "Thực phẩm chức năng", administrative_unit: "Bộ Y tế", description: "Thực phẩm bổ sung vi chất, thực phẩm bảo vệ sức khỏe", status: "ACTIVE", so_loai_hinh: 3 },
  { id: "3", code: "NSP_YT_003", name: "Phụ gia thực phẩm", administrative_unit: "Bộ Y tế", description: "Các chất phụ gia, hóa chất sử dụng trong chế biến thực phẩm", status: "ACTIVE", so_loai_hinh: 1 },
  { id: "4", code: "NSP_YT_004", name: "Vi chất bổ sung vào thực phẩm", administrative_unit: "Bộ Y tế", description: "Vitamin, khoáng chất và vi chất dinh dưỡng bổ sung vào thực phẩm", status: "INACTIVE", so_loai_hinh: 0 },
  { id: "5", code: "NSP_NN_001", name: "Ngũ cốc", administrative_unit: "Bộ Nông nghiệp và Môi trường", description: "Lúa gạo, ngô, mì, đại mạch và các loại ngũ cốc", status: "ACTIVE", so_loai_hinh: 2 },
  { id: "6", code: "NSP_NN_002", name: "Thịt và sản phẩm từ thịt", administrative_unit: "Bộ Nông nghiệp và Môi trường", description: "Thịt gia súc, gia cầm tươi sống và chế biến", status: "ACTIVE", so_loai_hinh: 3 },
  { id: "7", code: "NSP_NN_003", name: "Thủy sản", administrative_unit: "Bộ Nông nghiệp và Môi trường", description: "Cá, tôm, cua và các loại thủy hải sản tươi sống, đông lạnh", status: "ACTIVE", so_loai_hinh: 2 },
  { id: "8", code: "NSP_CT_001", name: "Bia", administrative_unit: "Bộ Công Thương", description: "Các loại bia sản xuất trong nước và nhập khẩu", status: "ACTIVE", so_loai_hinh: 1 },
  { id: "9", code: "NSP_CT_002", name: "Nước giải khát", administrative_unit: "Bộ Công Thương", description: "Nước ngọt, nước ép, đồ uống không cồn đóng chai/hộp", status: "ACTIVE", so_loai_hinh: 2 },
  { id: "10", code: "NSP_CT_003", name: "Sữa chế biến", administrative_unit: "Bộ Công Thương", description: "Sữa bột, sữa đặc, sữa thanh trùng và các sản phẩm từ sữa chế biến", status: "ACTIVE", so_loai_hinh: 1 },
];

const EMPTY_FORM = {
  code: "",
  name: "",
  administrative_unit: "",
  description: "",
  status: "ACTIVE" as NspStatus,
};

type ModalMode = "add" | "edit" | "view" | null;

const inputCls = "w-full px-3 py-1.5 text-[14px] border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-colors";
const labelCls = "block text-[13px] font-medium text-gray-700 mb-1";

export default function NhomSanPhamPage() {
  const [data, setData] = useState<NhomSanPham[]>(initialData);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<NhomSanPham | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const visibleData = data.filter((d) => d.status !== ("DELETED" as NspStatus));

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visibleData.filter((d) => {
      if (q && !(d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q) || d.administrative_unit.toLowerCase().includes(q))) {
        return false;
      }
      if (filters.status && d.status !== STATUS_LABEL_MAP[filters.status]) return false;
      if (filters.administrative_unit && d.administrative_unit !== filters.administrative_unit) return false;
      return true;
    });
  }, [visibleData, searchQuery, filters]);

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

  function openView(item: NhomSanPham) {
    setSelectedItem(item);
    setModalMode("view");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedItem(null);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.code.trim()) errs.code = "Mã nhóm là bắt buộc";
    if (!formData.name.trim()) errs.name = "Tên nhóm là bắt buộc";
    if (!formData.administrative_unit) errs.administrative_unit = "Vui lòng chọn đơn vị quản lý";

    const existingCode = data.find(
      (d) => d.code === formData.code.trim() && d.id !== selectedItem?.id
    );
    if (existingCode) errs.code = "Mã nhóm đã tồn tại";

    const existingName = data.find(
      (d) => d.name === formData.name.trim() && d.id !== selectedItem?.id
    );
    if (existingName) errs.name = "Tên nhóm đã tồn tại";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;

    if (modalMode === "add") {
      const newItem: NhomSanPham = {
        id: String(Date.now()),
        code: formData.code.trim(),
        name: formData.name.trim(),
        administrative_unit: formData.administrative_unit,
        description: formData.description.trim(),
        status: "ACTIVE",
        so_loai_hinh: 0,
      };
      setData((prev) => [...prev, newItem]);
    } else if (modalMode === "edit" && selectedItem) {
      if (
        formData.status === "INACTIVE" &&
        selectedItem.status === "ACTIVE" &&
        selectedItem.so_loai_hinh > 0
      ) {
        const confirmed = window.confirm(
          `Nhóm sản phẩm này đang được liên kết với ${selectedItem.so_loai_hinh} Loại hình cơ sở. Việc vô hiệu hóa sẽ không tự động gỡ liên kết. Bạn có chắc không?`
        );
        if (!confirmed) return;
      }
      setData((prev) =>
        prev.map((d) =>
          d.id === selectedItem.id
            ? {
              ...d,
              name: formData.name.trim(),
              administrative_unit: formData.administrative_unit,
              description: formData.description.trim(),
              status: formData.status,
            }
            : d
        )
      );
    }
    closeModal();
  }

  function handleDelete(item: NhomSanPham) {
    if (item.so_loai_hinh > 0) {
      window.alert(
        `Không thể xóa. Nhóm sản phẩm đang được liên kết với ${item.so_loai_hinh} Loại hình cơ sở. Vui lòng gỡ liên kết trước khi xóa.`
      );
      return;
    }
    const confirmed = window.confirm(`Xác nhận xóa nhóm sản phẩm "${item.name}"?`);
    if (!confirmed) return;
    setData((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, status: "DELETED" as NspStatus } : d))
    );
  }

  const stats = [
    {
      label: "Tổng nhóm",
      value: String(visibleData.length),
      icon: Layers,
      color: "text-brand-600",
      bg: "bg-brand-50",
    },
    {
      label: "Đang hoạt động",
      value: String(visibleData.filter((d) => d.status === "ACTIVE").length),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Không hoạt động",
      value: String(visibleData.filter((d) => d.status === "INACTIVE").length),
      icon: XCircle,
      color: "text-gray-500",
      bg: "bg-gray-100",
    },
    {
      label: "Tổng loại hình liên kết",
      value: String(visibleData.reduce((s, d) => s + d.so_loai_hinh, 0)),
      icon: Link,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  // Build toolbar data with Vietnamese status labels for display
  const toolbarData = useMemo(
    () => visibleData.map((d) => ({
      ...d,
      status: d.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động",
    })),
    [visibleData]
  );

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

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-2"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon size={18} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                {["MÃ NHÓM", "TÊN NHÓM SẢN PHẨM", "ĐƠN VỊ QUẢN LÝ", "SỐ LOẠI HÌNH", "TRẠNG THÁI", "THAO TÁC"].map((h) => (
                  <th key={h} className="text-left px-5 py-3">
                    <span className="text-[14px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[13px] text-gray-700 dark:text-gray-300">{row.code}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-800 dark:text-gray-200 font-medium">{row.name}</td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-700 dark:text-gray-300">{row.administrative_unit}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{row.so_loai_hinh}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={row.status === "ACTIVE" ? "success" : "neutral"}>
                      {row.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openView(row)}
                        className="text-[12px] text-brand-600 hover:underline font-medium"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => openEdit(row)}
                        className="text-[12px] text-amber-600 hover:underline font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="text-[12px] text-red-500 hover:underline font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-[14px]">
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalMode === "add" || modalMode === "edit"}
        onClose={closeModal}
        title={modalMode === "add" ? "Thêm nhóm sản phẩm" : "Chỉnh sửa nhóm sản phẩm"}
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              Mã nhóm sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              disabled={modalMode === "edit"}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="VD: NSP_YT_001"
              className={`${inputCls} ${modalMode === "edit" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
            />
            {errors.code && <p className="mt-1 text-[12px] text-red-500">{errors.code}</p>}
            {modalMode === "add" && (
              <p className="mt-1 text-[11px] text-gray-400">
                Gợi ý: NSP_YT_001 (Y tế), NSP_NN_001 (NN&MT), NSP_CT_001 (Công Thương)
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              Tên nhóm sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên nhóm sản phẩm"
              className={inputCls}
            />
            {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className={labelCls}>
              Đơn vị quản lý <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.administrative_unit}
              onChange={(e) => setFormData({ ...formData, administrative_unit: e.target.value })}
              className={inputCls}
            >
              <option value="">-- Chọn Bộ/Cơ quan --</option>
              {ADMINISTRATIVE_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            {errors.administrative_unit && (
              <p className="mt-1 text-[12px] text-red-500">{errors.administrative_unit}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả nghiệp vụ (tùy chọn)"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          {modalMode === "edit" && (
            <div>
              <label className={labelCls}>Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as NspStatus })}
                className={inputCls}
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
            >
              {modalMode === "add" ? "Thêm mới" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={modalMode === "view"}
        onClose={closeModal}
        title="Chi tiết nhóm sản phẩm"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={labelCls}>Mã nhóm</p>
                <p className="text-[14px] font-mono font-semibold text-gray-800">{selectedItem.code}</p>
              </div>
              <div>
                <p className={labelCls}>Trạng thái</p>
                <Badge variant={selectedItem.status === "ACTIVE" ? "success" : "neutral"}>
                  {selectedItem.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
            </div>

            <div>
              <p className={labelCls}>Tên nhóm sản phẩm</p>
              <p className="text-[14px] text-gray-800">{selectedItem.name}</p>
            </div>

            <div>
              <p className={labelCls}>Đơn vị quản lý</p>
              <p className="text-[14px] text-gray-800">{selectedItem.administrative_unit}</p>
            </div>

            <div>
              <p className={labelCls}>Mô tả</p>
              <p className="text-[14px] text-gray-500">{selectedItem.description || "—"}</p>
            </div>

            <div>
              <p className={labelCls}>Loại hình cơ sở đang liên kết</p>
              {selectedItem.so_loai_hinh === 0 ? (
                <p className="text-[13px] text-gray-400 italic">Chưa có loại hình liên kết</p>
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-xl">
                  <p className="text-[13px] text-gray-600">
                    <span className="font-semibold text-brand-600">{selectedItem.so_loai_hinh}</span> loại hình đang sử dụng nhóm sản phẩm này
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => { closeModal(); openEdit(selectedItem); }}
                className="px-4 py-2 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
