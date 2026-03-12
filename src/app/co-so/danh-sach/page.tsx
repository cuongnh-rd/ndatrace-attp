"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Building2, ShieldCheck, AlertTriangle, Clock } from "lucide-react";

const danhSachCoSoData: Record<string, unknown>[] = [
  { maCS: "CS-2026-001", tenCoSo: "Nhà hàng Hải sản Biển Đông", loaiHinh: "Nhà hàng", diaChi: "12 Nguyễn Huệ, P. Bến Nghé, Q.1", chuCoSo: "Nguyễn Văn Bình", soDienThoai: "028 3822 1234", soGCN: "GCN-2025-0123", ngayCapGCN: "15/03/2025", ngayHetHan: "15/03/2027", mucRuiRo: "Trung bình", trangThai: "Hoạt động" },
  { maCS: "CS-2026-002", tenCoSo: "Bếp ăn tập thể Công ty Pou Yuen", loaiHinh: "Bếp ăn tập thể", diaChi: "234 Tên Lửa, P. Bình Trị Đông B, Bình Tân", chuCoSo: "Trần Thị Lan", soDienThoai: "028 3751 5678", soGCN: "GCN-2024-0456", ngayCapGCN: "20/06/2024", ngayHetHan: "20/06/2026", mucRuiRo: "Cao", trangThai: "Hoạt động" },
  { maCS: "CS-2026-003", tenCoSo: "Cơ sở sản xuất bánh kẹo Hương Sen", loaiHinh: "Sản xuất thực phẩm", diaChi: "45 Lê Văn Sỹ, P. 13, Q.3", chuCoSo: "Lê Thị Hương", soDienThoai: "028 3930 9012", soGCN: "GCN-2025-0789", ngayCapGCN: "10/01/2025", ngayHetHan: "10/01/2027", mucRuiRo: "Cao", trangThai: "Đình chỉ" },
  { maCS: "CS-2026-004", tenCoSo: "Siêu thị Co.opmart Bình Thạnh", loaiHinh: "Siêu thị", diaChi: "217 Xô Viết Nghệ Tĩnh, P. 21, Bình Thạnh", chuCoSo: "Phạm Quốc Tuấn", soDienThoai: "028 3841 3456", soGCN: "GCN-2024-1012", ngayCapGCN: "05/09/2024", ngayHetHan: "05/09/2026", mucRuiRo: "Thấp", trangThai: "Hoạt động" },
  { maCS: "CS-2026-005", tenCoSo: "Lò giết mổ An Hạ", loaiHinh: "Giết mổ gia súc, gia cầm", diaChi: "Đường An Hạ, X. Phạm Văn Hai, Bình Chánh", chuCoSo: "Hoàng Văn Mạnh", soDienThoai: "028 3765 7890", soGCN: "GCN-2025-1234", ngayCapGCN: "01/04/2025", ngayHetHan: "01/04/2026", mucRuiRo: "Rất cao", trangThai: "Hoạt động" },
  { maCS: "CS-2026-006", tenCoSo: "Công ty TNHH Nước uống Ánh Dương", loaiHinh: "Sản xuất nước uống", diaChi: "34 Hoàng Hoa Thám, P. 13, Tân Bình", chuCoSo: "Nguyễn Thị Ánh", soDienThoai: "028 3849 2345", soGCN: "GCN-2025-1567", ngayCapGCN: "20/07/2025", ngayHetHan: "20/07/2027", mucRuiRo: "Cao", trangThai: "Hoạt động" },
  { maCS: "CS-2026-007", tenCoSo: "Quán ăn Cơm Tấm Thuận Kiều", loaiHinh: "Nhà hàng", diaChi: "67 Châu Văn Liêm, P. 11, Q.5", chuCoSo: "Vũ Thị Thanh", soDienThoai: "090 123 4567", soGCN: "", ngayCapGCN: "", ngayHetHan: "", mucRuiRo: "Trung bình", trangThai: "Chờ cấp phép" },
  { maCS: "CS-2026-008", tenCoSo: "Chuỗi Cà phê Sáng Việt – CN Bình Thạnh", loaiHinh: "Nhà hàng", diaChi: "34 Đinh Bộ Lĩnh, P. 26, Bình Thạnh", chuCoSo: "Đỗ Minh Khoa", soDienThoai: "028 3512 6789", soGCN: "GCN-2024-1890", ngayCapGCN: "12/11/2024", ngayHetHan: "12/11/2026", mucRuiRo: "Thấp", trangThai: "Hoạt động" },
  { maCS: "CS-2026-009", tenCoSo: "HTX Rau sạch Củ Chi", loaiHinh: "Sản xuất thực phẩm", diaChi: "Ấp Bàu Tre, X. Phú Mỹ Hưng, Củ Chi", chuCoSo: "Trương Văn Khởi", soDienThoai: "093 456 7890", soGCN: "GCN-2025-2123", ngayCapGCN: "08/02/2025", ngayHetHan: "08/02/2027", mucRuiRo: "Thấp", trangThai: "Hoạt động" },
  { maCS: "CS-2026-010", tenCoSo: "Nhà hàng Buffet Nhật Sakura", loaiHinh: "Nhà hàng", diaChi: "89 Lê Thánh Tôn, P. Bến Thành, Q.1", chuCoSo: "Yamamoto Kenji", soDienThoai: "028 3824 5678", soGCN: "GCN-2025-2456", ngayCapGCN: "15/05/2025", ngayHetHan: "15/05/2027", mucRuiRo: "Trung bình", trangThai: "Hoạt động" },
  { maCS: "CS-2026-011", tenCoSo: "Trường Mầm non Họa Mi – Căng tin", loaiHinh: "Căng tin trường học", diaChi: "78 Nơ Trang Long, P. 11, Bình Thạnh", chuCoSo: "Nguyễn Thị Kim Loan", soDienThoai: "028 3553 1234", soGCN: "GCN-2024-2789", ngayCapGCN: "01/08/2024", ngayHetHan: "01/08/2026", mucRuiRo: "Cao", trangThai: "Sắp hết hạn" },
  { maCS: "CS-2026-012", tenCoSo: "Cơ sở chế biến hải sản Năm Phong", loaiHinh: "Chế biến hải sản", diaChi: "23 Bến Bình Đông, P. 11, Q.8", chuCoSo: "Nguyễn Văn Năm", soDienThoai: "091 234 5678", soGCN: "GCN-2023-3012", ngayCapGCN: "10/04/2023", ngayHetHan: "10/04/2025", mucRuiRo: "Cao", trangThai: "Hết hạn" },
  { maCS: "CS-2026-013", tenCoSo: "Siêu thị Mini Phước Lộc", loaiHinh: "Siêu thị", diaChi: "234 Tên Lửa, P. Bình Trị Đông, Bình Tân", chuCoSo: "Phước Lộc Group", soDienThoai: "028 3620 3456", soGCN: "", ngayCapGCN: "", ngayHetHan: "", mucRuiRo: "Trung bình", trangThai: "Đình chỉ" },
  { maCS: "CS-2026-014", tenCoSo: "Công ty CP Thực phẩm Sao Vàng", loaiHinh: "Sản xuất thực phẩm", diaChi: "12 Tân Kỳ Tân Quý, P. Sơn Kỳ, Tân Phú", chuCoSo: "Lê Hữu Phúc", soDienThoai: "028 3815 7890", soGCN: "GCN-2025-3345", ngayCapGCN: "22/09/2025", ngayHetHan: "22/09/2027", mucRuiRo: "Cao", trangThai: "Hoạt động" },
  { maCS: "CS-2026-015", tenCoSo: "Chợ Bình Điền – Khu hải sản", loaiHinh: "Chợ truyền thống", diaChi: "Đường Nguyễn Văn Linh, P. Tân Tạo, Bình Tân", chuCoSo: "Ban quản lý Chợ Bình Điền", soDienThoai: "028 3752 1234", soGCN: "GCN-2024-3678", ngayCapGCN: "30/12/2024", ngayHetHan: "30/12/2026", mucRuiRo: "Trung bình", trangThai: "Hoạt động" },
];

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
    key: "loaiHinh", label: "Loại hình",
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
    key: "mucRuiRo", label: "Mức rủi ro",
    render: (row: Record<string, unknown>) => {
      const val = String(row.mucRuiRo);
      const variant = val === "Rất cao" ? "danger" : val === "Cao" ? "warning" : val === "Trung bình" ? "info" : "neutral";
      return <Badge variant={variant as "danger" | "warning" | "info" | "neutral"}>{val}</Badge>;
    },
  },
  {
    key: "trangThai", label: "Trạng thái",
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
  return (
    <DashboardLayout>
      <PageHeader
        title="Danh sách cơ sở"
        subtitle="Danh sách các cơ sở sản xuất, kinh doanh thực phẩm trên địa bàn thành phố"
        action={
          <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
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
          data={danhSachCoSoData}
          searchable
          searchKeys={["maCS", "tenCoSo", "loaiHinh", "chuCoSo", "diaChi"]}
        />
      </div>
    </DashboardLayout>
  );
}
