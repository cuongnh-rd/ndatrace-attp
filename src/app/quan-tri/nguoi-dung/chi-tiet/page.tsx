"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { thoi_gian: "09/03/2026 08:14:32", hanh_dong: "Đăng nhập hệ thống", module: "Xác thực", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 08:17:05", hanh_dong: "Xem danh sách sản phẩm", module: "Truy xuất", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 08:21:18", hanh_dong: "Tạo mới lô khai báo", module: "Lô khai báo", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 08:34:47", hanh_dong: "Cập nhật thông tin sản phẩm SP014", module: "Truy xuất", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 09:02:11", hanh_dong: "Tải xuống báo cáo kiểm tra", module: "Thư viện", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 09:15:29", hanh_dong: "Thêm sự kiện vào chuỗi cung ứng", module: "Sự kiện", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 09:28:53", hanh_dong: "Cập nhật chứng chỉ GlobalG.A.P.", module: "Chứng chỉ", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 10:05:14", hanh_dong: "Xuất danh sách doanh nghiệp", module: "Quản trị", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 10:12:36", hanh_dong: "Xóa tem nhãn TN-2890 (thử nghiệm)", module: "Tem nhãn", dia_chi_ip: "203.113.152.41", ket_qua: "warning" },
  { thoi_gian: "09/03/2026 10:31:08", hanh_dong: "Phê duyệt hồ sơ doanh nghiệp DN-0127", module: "Doanh nghiệp", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 11:04:22", hanh_dong: "Thay đổi mật khẩu tài khoản", module: "Xác thực", dia_chi_ip: "192.168.1.5", ket_qua: "success" },
  { thoi_gian: "09/03/2026 11:47:55", hanh_dong: "Truy cập module phân quyền trái phép", module: "Quản trị", dia_chi_ip: "118.70.45.200", ket_qua: "danger" },
  { thoi_gian: "09/03/2026 13:15:40", hanh_dong: "Đăng xuất hệ thống", module: "Xác thực", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 14:08:17", hanh_dong: "Đăng nhập lại sau nghỉ trưa", module: "Xác thực", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
  { thoi_gian: "09/03/2026 14:30:52", hanh_dong: "Tạo báo cáo thống kê tháng 2/2026", module: "Dashboard", dia_chi_ip: "203.113.152.41", ket_qua: "success" },
];

const ketQuaVariant: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
};

const ketQuaLabel: Record<string, string> = {
  success: "Thành công",
  warning: "Cảnh báo",
  danger: "Thất bại",
};

const moduleMap: Record<string, "success" | "info" | "warning" | "neutral" | "danger"> = {
  "Xác thực": "info",
  "Truy xuất": "success",
  "Lô khai báo": "success",
  "Thư viện": "neutral",
  "Sự kiện": "success",
  "Chứng chỉ": "warning",
  "Quản trị": "danger",
  "Tem nhãn": "warning",
  "Doanh nghiệp": "info",
  "Dashboard": "info",
};

const columns = [
  { key: "thoi_gian", label: "Thời gian", width: "160px" },
  { key: "hanh_dong", label: "Hành động" },
  {
    key: "module",
    label: "Module",
    render: (row: Record<string, unknown>) => (
      <Badge variant={moduleMap[row.module as string] ?? "neutral"}>{row.module as string}</Badge>
    ),
  },
  { key: "dia_chi_ip", label: "Địa chỉ IP", width: "140px" },
  {
    key: "ket_qua",
    label: "Kết quả",
    render: (row: Record<string, unknown>) => (
      <Badge variant={ketQuaVariant[row.ket_qua as string] ?? "neutral"}>
        {ketQuaLabel[row.ket_qua as string] ?? (row.ket_qua as string)}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Chi tiết người dùng"
      subtitle="Lịch sử hoạt động và nhật ký thao tác của tài khoản người dùng"
      stats={[
        { label: "Tổng hoạt động", value: data.length, variant: "info" },
        { label: "Thành công", value: data.filter((d) => d.ket_qua === "success").length, variant: "success" },
        { label: "Cảnh báo", value: data.filter((d) => d.ket_qua === "warning").length, variant: "warning" },
        { label: "Thất bại", value: data.filter((d) => d.ket_qua === "danger").length, variant: "danger" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["thoi_gian", "hanh_dong", "module", "dia_chi_ip"]}
      addLabel="Xuất nhật ký"
    />
  );
}
