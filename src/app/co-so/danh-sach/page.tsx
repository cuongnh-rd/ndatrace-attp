"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import MultiSelect from "@/components/ui/MultiSelect";
import { Plus, Building2, ShieldCheck, AlertTriangle, Clock } from "lucide-react";

interface CoSo {
  maCS: string;
  tenCoSo: string;
  loaiHinh: string;
  diaChi: string;
  chuCoSo: string;
  soDienThoai: string;
  soGCN: string;
  ngayCapGCN: string;
  ngayHetHan: string;
  mucRuiRo: string;
  trangThai: string;
  nhomSanPhamIds: string[];
  loaiHinhId: string;
}

// NSP options (ACTIVE only)
const NSP_OPTIONS = [
  { value: "NSP_YT_001", label: "Nước uống đóng chai" },
  { value: "NSP_YT_002", label: "Thực phẩm chức năng" },
  { value: "NSP_YT_003", label: "Phụ gia thực phẩm" },
  { value: "NSP_NN_001", label: "Ngũ cốc" },
  { value: "NSP_NN_002", label: "Thịt và sản phẩm từ thịt" },
  { value: "NSP_NN_003", label: "Thủy sản" },
  { value: "NSP_CT_001", label: "Bia" },
  { value: "NSP_CT_002", label: "Nước giải khát" },
  { value: "NSP_CT_003", label: "Sữa chế biến" },
];

// Loại hình cơ sở with their NSP linkages (mirrors phan-loai data)
const LOAI_HINH_DATA = [
  { id: "PL-001", ten: "Nhà hàng, quán ăn", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_001"] },
  { id: "PL-002", ten: "Bếp ăn tập thể", nhomSanPhamIds: ["NSP_NN_001", "NSP_NN_002"] },
  { id: "PL-003", ten: "Cơ sở sản xuất thực phẩm", nhomSanPhamIds: ["NSP_YT_003", "NSP_CT_003"] },
  { id: "PL-004", ten: "Thức ăn đường phố", nhomSanPhamIds: ["NSP_NN_002"] },
  { id: "PL-005", ten: "Siêu thị, cửa hàng tiện lợi", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_003", "NSP_NN_001"] },
  { id: "PL-006", ten: "Chợ truyền thống", nhomSanPhamIds: ["NSP_NN_002", "NSP_NN_003"] },
  { id: "PL-007", ten: "Cơ sở sản xuất nước uống", nhomSanPhamIds: ["NSP_YT_001"] },
  { id: "PL-008", ten: "Cơ sở chế biến hải sản", nhomSanPhamIds: ["NSP_NN_003"] },
  { id: "PL-009", ten: "Cơ sở giết mổ gia súc, gia cầm", nhomSanPhamIds: ["NSP_NN_002"] },
  { id: "PL-010", ten: "Cơ sở kinh doanh phụ gia thực phẩm", nhomSanPhamIds: ["NSP_YT_003"] },
  { id: "PL-011", ten: "Căng tin trường học", nhomSanPhamIds: ["NSP_NN_001", "NSP_NN_002"] },
  { id: "PL-012", ten: "Cơ sở nhập khẩu thực phẩm", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_003"] },
];

const initialData: CoSo[] = [
  { maCS: "CS-2026-001", tenCoSo: "Nhà hàng Hải sản Biển Đông", loaiHinh: "Nhà hàng", diaChi: "12 Nguyễn Huệ, P. Bến Nghé, Q.1", chuCoSo: "Nguyễn Văn Bình", soDienThoai: "028 3822 1234", soGCN: "GCN-2025-0123", ngayCapGCN: "15/03/2025", ngayHetHan: "15/03/2027", mucRuiRo: "Trung bình", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_001"], loaiHinhId: "PL-001" },
  { maCS: "CS-2026-002", tenCoSo: "Bếp ăn tập thể Công ty Pou Yuen", loaiHinh: "Bếp ăn tập thể", diaChi: "234 Tên Lửa, P. Bình Trị Đông B, Bình Tân", chuCoSo: "Trần Thị Lan", soDienThoai: "028 3751 5678", soGCN: "GCN-2024-0456", ngayCapGCN: "20/06/2024", ngayHetHan: "20/06/2026", mucRuiRo: "Cao", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_001", "NSP_NN_002"], loaiHinhId: "PL-002" },
  { maCS: "CS-2026-003", tenCoSo: "Cơ sở sản xuất bánh kẹo Hương Sen", loaiHinh: "Sản xuất thực phẩm", diaChi: "45 Lê Văn Sỹ, P. 13, Q.3", chuCoSo: "Lê Thị Hương", soDienThoai: "028 3930 9012", soGCN: "GCN-2025-0789", ngayCapGCN: "10/01/2025", ngayHetHan: "10/01/2027", mucRuiRo: "Cao", trangThai: "Đình chỉ", nhomSanPhamIds: ["NSP_YT_003", "NSP_CT_003"], loaiHinhId: "PL-003" },
  { maCS: "CS-2026-004", tenCoSo: "Siêu thị Co.opmart Bình Thạnh", loaiHinh: "Siêu thị", diaChi: "217 Xô Viết Nghệ Tĩnh, P. 21, Bình Thạnh", chuCoSo: "Phạm Quốc Tuấn", soDienThoai: "028 3841 3456", soGCN: "GCN-2024-1012", ngayCapGCN: "05/09/2024", ngayHetHan: "05/09/2026", mucRuiRo: "Thấp", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_002", "NSP_CT_003", "NSP_NN_001"], loaiHinhId: "PL-005" },
  { maCS: "CS-2026-005", tenCoSo: "Lò giết mổ An Hạ", loaiHinh: "Giết mổ gia súc, gia cầm", diaChi: "Đường An Hạ, X. Phạm Văn Hai, Bình Chánh", chuCoSo: "Hoàng Văn Mạnh", soDienThoai: "028 3765 7890", soGCN: "GCN-2025-1234", ngayCapGCN: "01/04/2025", ngayHetHan: "01/04/2026", mucRuiRo: "Rất cao", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_002"], loaiHinhId: "PL-009" },
  { maCS: "CS-2026-006", tenCoSo: "Công ty TNHH Nước uống Ánh Dương", loaiHinh: "Sản xuất nước uống", diaChi: "34 Hoàng Hoa Thám, P. 13, Tân Bình", chuCoSo: "Nguyễn Thị Ánh", soDienThoai: "028 3849 2345", soGCN: "GCN-2025-1567", ngayCapGCN: "20/07/2025", ngayHetHan: "20/07/2027", mucRuiRo: "Cao", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_YT_001"], loaiHinhId: "PL-007" },
  { maCS: "CS-2026-007", tenCoSo: "Quán ăn Cơm Tấm Thuận Kiều", loaiHinh: "Nhà hàng", diaChi: "67 Châu Văn Liêm, P. 11, Q.5", chuCoSo: "Vũ Thị Thanh", soDienThoai: "090 123 4567", soGCN: "", ngayCapGCN: "", ngayHetHan: "", mucRuiRo: "Trung bình", trangThai: "Chờ cấp phép", nhomSanPhamIds: ["NSP_CT_002"], loaiHinhId: "PL-001" },
  { maCS: "CS-2026-008", tenCoSo: "Chuỗi Cà phê Sáng Việt – CN Bình Thạnh", loaiHinh: "Nhà hàng", diaChi: "34 Đinh Bộ Lĩnh, P. 26, Bình Thạnh", chuCoSo: "Đỗ Minh Khoa", soDienThoai: "028 3512 6789", soGCN: "GCN-2024-1890", ngayCapGCN: "12/11/2024", ngayHetHan: "12/11/2026", mucRuiRo: "Thấp", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_001"], loaiHinhId: "PL-001" },
  { maCS: "CS-2026-009", tenCoSo: "HTX Rau sạch Củ Chi", loaiHinh: "Sản xuất thực phẩm", diaChi: "Ấp Bàu Tre, X. Phú Mỹ Hưng, Củ Chi", chuCoSo: "Trương Văn Khởi", soDienThoai: "093 456 7890", soGCN: "GCN-2025-2123", ngayCapGCN: "08/02/2025", ngayHetHan: "08/02/2027", mucRuiRo: "Thấp", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_001"], loaiHinhId: "PL-003" },
  { maCS: "CS-2026-010", tenCoSo: "Nhà hàng Buffet Nhật Sakura", loaiHinh: "Nhà hàng", diaChi: "89 Lê Thánh Tôn, P. Bến Thành, Q.1", chuCoSo: "Yamamoto Kenji", soDienThoai: "028 3824 5678", soGCN: "GCN-2025-2456", ngayCapGCN: "15/05/2025", ngayHetHan: "15/05/2027", mucRuiRo: "Trung bình", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_CT_002"], loaiHinhId: "PL-001" },
  { maCS: "CS-2026-011", tenCoSo: "Trường Mầm non Họa Mi – Căng tin", loaiHinh: "Căng tin trường học", diaChi: "78 Nơ Trang Long, P. 11, Bình Thạnh", chuCoSo: "Nguyễn Thị Kim Loan", soDienThoai: "028 3553 1234", soGCN: "GCN-2024-2789", ngayCapGCN: "01/08/2024", ngayHetHan: "01/08/2026", mucRuiRo: "Cao", trangThai: "Sắp hết hạn", nhomSanPhamIds: ["NSP_NN_001", "NSP_NN_002"], loaiHinhId: "PL-011" },
  { maCS: "CS-2026-012", tenCoSo: "Cơ sở chế biến hải sản Năm Phong", loaiHinh: "Chế biến hải sản", diaChi: "23 Bến Bình Đông, P. 11, Q.8", chuCoSo: "Nguyễn Văn Năm", soDienThoai: "091 234 5678", soGCN: "GCN-2023-3012", ngayCapGCN: "10/04/2023", ngayHetHan: "10/04/2025", mucRuiRo: "Cao", trangThai: "Hết hạn", nhomSanPhamIds: ["NSP_NN_003"], loaiHinhId: "PL-008" },
  { maCS: "CS-2026-013", tenCoSo: "Siêu thị Mini Phước Lộc", loaiHinh: "Siêu thị", diaChi: "234 Tên Lửa, P. Bình Trị Đông, Bình Tân", chuCoSo: "Phước Lộc Group", soDienThoai: "028 3620 3456", soGCN: "", ngayCapGCN: "", ngayHetHan: "", mucRuiRo: "Trung bình", trangThai: "Đình chỉ", nhomSanPhamIds: ["NSP_CT_003"], loaiHinhId: "PL-005" },
  { maCS: "CS-2026-014", tenCoSo: "Công ty CP Thực phẩm Sao Vàng", loaiHinh: "Sản xuất thực phẩm", diaChi: "12 Tân Kỳ Tân Quý, P. Sơn Kỳ, Tân Phú", chuCoSo: "Lê Hữu Phúc", soDienThoai: "028 3815 7890", soGCN: "GCN-2025-3345", ngayCapGCN: "22/09/2025", ngayHetHan: "22/09/2027", mucRuiRo: "Cao", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_YT_003"], loaiHinhId: "PL-003" },
  { maCS: "CS-2026-015", tenCoSo: "Chợ Bình Điền – Khu hải sản", loaiHinh: "Chợ truyền thống", diaChi: "Đường Nguyễn Văn Linh, P. Tân Tạo, Bình Tân", chuCoSo: "Ban quản lý Chợ Bình Điền", soDienThoai: "028 3752 1234", soGCN: "GCN-2024-3678", ngayCapGCN: "30/12/2024", ngayHetHan: "30/12/2026", mucRuiRo: "Trung bình", trangThai: "Hoạt động", nhomSanPhamIds: ["NSP_NN_002", "NSP_NN_003"], loaiHinhId: "PL-006" },
];

const EMPTY_FORM = {
  nhomSanPhamIds: [] as string[],
  loaiHinhId: "",
  tenCoSo: "",
  diaChi: "",
  chuCoSo: "",
  soDienThoai: "",
};

const inputCls = "w-full px-3 py-1.5 text-[14px] border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-colors";
const labelCls = "block text-[13px] font-medium text-gray-700 mb-1";

const stats = [
  { label: "Tổng cơ sở", value: "17.382", icon: Building2, color: "text-brand-600", bg: "bg-brand-50" },
  { label: "Đang hoạt động", value: "15.847", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
  { label: "Sắp hết hạn GCN", value: "234", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Vi phạm / Đình chỉ", value: "89", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
];

const columns = [
  { key: "maCS", label: "Mã CS", sortable: true },
  { key: "tenCoSo", label: "Tên cơ sở", sortable: true },
  {
    key: "loaiHinh",
    label: "Loại hình",
    render: (row: Record<string, unknown>) => (
      <Badge variant="neutral">{String(row.loaiHinh)}</Badge>
    ),
  },
  { key: "diaChi", label: "Địa chỉ" },
  { key: "chuCoSo", label: "Chủ cơ sở" },
  { key: "soDienThoai", label: "SĐT" },
  { key: "soGCN", label: "Số GCN" },
  { key: "ngayHetHan", label: "Hết hạn GCN" },
  {
    key: "mucRuiRo",
    label: "Mức rủi ro",
    render: (row: Record<string, unknown>) => {
      const val = String(row.mucRuiRo);
      const variant =
        val === "Rất cao" ? "danger" : val === "Cao" ? "warning" : val === "Trung bình" ? "info" : "neutral";
      return <Badge variant={variant as "danger" | "warning" | "info" | "neutral"}>{val}</Badge>;
    },
  },
  {
    key: "trangThai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => {
      const val = String(row.trangThai);
      const variant =
        val === "Hoạt động" ? "success" :
        val === "Sắp hết hạn" ? "warning" :
        val === "Hết hạn" || val === "Đình chỉ" ? "danger" : "neutral";
      return <Badge variant={variant as "success" | "warning" | "danger" | "neutral"}>{val}</Badge>;
    },
  },
];

export default function DanhSachCoSoPage() {
  const [data, setData] = useState<CoSo[]>(initialData);
  const [addOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtered loai hinh based on selected NSP (R08)
  const filteredLoaiHinh = LOAI_HINH_DATA.filter((lh) =>
    formData.nhomSanPhamIds.some((nspId) => lh.nhomSanPhamIds.includes(nspId))
  );

  function handleNspChange(ids: string[]) {
    setFormData({ ...formData, nhomSanPhamIds: ids, loaiHinhId: "" }); // R07: reset loai hinh
    if (errors.nhomSanPhamIds) setErrors({ ...errors, nhomSanPhamIds: "" });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (formData.nhomSanPhamIds.length === 0) errs.nhomSanPhamIds = "Phải chọn ít nhất 1 nhóm sản phẩm";
    if (!formData.loaiHinhId) errs.loaiHinhId = "Vui lòng chọn loại hình cơ sở";
    if (!formData.tenCoSo.trim()) errs.tenCoSo = "Tên cơ sở là bắt buộc";
    if (!formData.diaChi.trim()) errs.diaChi = "Địa chỉ là bắt buộc";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleAdd() {
    if (!validate()) return;

    const loaiHinhRecord = LOAI_HINH_DATA.find((lh) => lh.id === formData.loaiHinhId);
    const newIdx = data.length + 1;
    const newRecord: CoSo = {
      maCS: `CS-2026-${String(newIdx).padStart(3, "0")}`,
      tenCoSo: formData.tenCoSo.trim(),
      loaiHinh: loaiHinhRecord?.ten ?? "",
      diaChi: formData.diaChi.trim(),
      chuCoSo: formData.chuCoSo.trim(),
      soDienThoai: formData.soDienThoai.trim(),
      soGCN: "",
      ngayCapGCN: "",
      ngayHetHan: "",
      mucRuiRo: "Trung bình",
      trangThai: "Chờ cấp phép",
      nhomSanPhamIds: formData.nhomSanPhamIds,
      loaiHinhId: formData.loaiHinhId,
    };
    setData((prev) => [...prev, newRecord]);
    setAddOpen(false);
    setFormData(EMPTY_FORM);
    setErrors({});
  }

  function openAdd() {
    setFormData(EMPTY_FORM);
    setErrors({});
    setAddOpen(true);
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Danh sách cơ sở"
        subtitle="Danh sách các cơ sở sản xuất, kinh doanh thực phẩm trên địa bàn thành phố"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Thêm cơ sở
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-2">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon size={18} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <DataTable
          columns={columns}
          data={data as unknown as Record<string, unknown>[]}
          searchable
          searchKeys={["maCS", "tenCoSo", "loaiHinh", "chuCoSo"]}
        />
      </div>

      {/* Add Modal – cascading 3 steps */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Thêm cơ sở mới">
        <div className="space-y-5">

          {/* Step 1: Nhóm sản phẩm */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">1</span>
              <label className="text-[13px] font-semibold text-gray-700">
                Chọn Nhóm sản phẩm <span className="text-red-500">*</span>
              </label>
            </div>
            <MultiSelect
              options={NSP_OPTIONS}
              value={formData.nhomSanPhamIds}
              onChange={handleNspChange}
              placeholder="Chọn nhóm sản phẩm..."
            />
            {errors.nhomSanPhamIds && (
              <p className="mt-1 text-[12px] text-red-500">{errors.nhomSanPhamIds}</p>
            )}
          </div>

          {/* Step 2: Loại hình cơ sở (cascaded) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${formData.nhomSanPhamIds.length > 0 ? "bg-brand-600" : "bg-gray-300"}`}>2</span>
              <label className="text-[13px] font-semibold text-gray-700">
                Chọn Loại hình cơ sở <span className="text-red-500">*</span>
              </label>
            </div>
            <select
              value={formData.loaiHinhId}
              disabled={formData.nhomSanPhamIds.length === 0}
              onChange={(e) => {
                setFormData({ ...formData, loaiHinhId: e.target.value });
                if (errors.loaiHinhId) setErrors({ ...errors, loaiHinhId: "" });
              }}
              className={`${inputCls} ${formData.nhomSanPhamIds.length === 0 ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
            >
              <option value="">
                {formData.nhomSanPhamIds.length === 0
                  ? "— Chọn nhóm sản phẩm trước —"
                  : filteredLoaiHinh.length === 0
                  ? "— Không có loại hình phù hợp —"
                  : "-- Chọn loại hình cơ sở --"}
              </option>
              {filteredLoaiHinh.map((lh) => (
                <option key={lh.id} value={lh.id}>
                  {lh.ten}
                </option>
              ))}
            </select>
            {errors.loaiHinhId && (
              <p className="mt-1 text-[12px] text-red-500">{errors.loaiHinhId}</p>
            )}
            {formData.nhomSanPhamIds.length > 0 && filteredLoaiHinh.length > 0 && (
              <p className="mt-1 text-[11px] text-gray-400">
                Hiển thị {filteredLoaiHinh.length} loại hình phù hợp với nhóm sản phẩm đã chọn
              </p>
            )}
          </div>

          {/* Step 3: Thông tin cơ sở */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${formData.loaiHinhId ? "bg-brand-600" : "bg-gray-300"}`}>3</span>
              <label className="text-[13px] font-semibold text-gray-700">Thông tin cơ sở</label>
            </div>
            <div className="space-y-3 pl-7">
              <div>
                <label className={labelCls}>
                  Tên cơ sở <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenCoSo}
                  onChange={(e) => setFormData({ ...formData, tenCoSo: e.target.value })}
                  placeholder="Nhập tên cơ sở"
                  className={inputCls}
                />
                {errors.tenCoSo && <p className="mt-1 text-[12px] text-red-500">{errors.tenCoSo}</p>}
              </div>

              <div>
                <label className={labelCls}>
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  placeholder="Số nhà, đường, phường, quận"
                  className={inputCls}
                />
                {errors.diaChi && <p className="mt-1 text-[12px] text-red-500">{errors.diaChi}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Chủ cơ sở</label>
                  <input
                    type="text"
                    value={formData.chuCoSo}
                    onChange={(e) => setFormData({ ...formData, chuCoSo: e.target.value })}
                    placeholder="Họ tên chủ cơ sở"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.soDienThoai}
                    onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                    placeholder="0xx xxx xxxx"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setAddOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
            >
              Thêm cơ sở
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
