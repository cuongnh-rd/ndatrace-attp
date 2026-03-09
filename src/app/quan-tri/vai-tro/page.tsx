"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "VT001", ten: "Quản trị viên hệ thống", mo_ta: "Toàn quyền quản lý hệ thống", so_nguoi_dung: 3, quyen_han: "Toàn quyền", ngay_tao: "01/01/2024", trang_thai: "active" },
  { id: "VT002", ten: "Quản lý doanh nghiệp", mo_ta: "Quản lý thông tin và hoạt động doanh nghiệp", so_nguoi_dung: 45, quyen_han: "Đọc & Ghi", ngay_tao: "15/01/2024", trang_thai: "active" },
  { id: "VT003", ten: "Nhân viên kiểm tra chất lượng", mo_ta: "Nhập liệu và kiểm tra kết quả kiểm nghiệm", so_nguoi_dung: 128, quyen_han: "Đọc & Ghi", ngay_tao: "20/01/2024", trang_thai: "active" },
  { id: "VT004", ten: "Cán bộ quản lý nhà nước", mo_ta: "Giám sát và phê duyệt hồ sơ truy xuất", so_nguoi_dung: 67, quyen_han: "Đọc & Phê duyệt", ngay_tao: "01/02/2024", trang_thai: "active" },
  { id: "VT005", ten: "Người vận hành kho", mo_ta: "Quản lý nhập xuất kho và tồn kho", so_nguoi_dung: 89, quyen_han: "Đọc & Ghi", ngay_tao: "10/02/2024", trang_thai: "active" },
  { id: "VT006", ten: "Nhà cung cấp nguyên liệu", mo_ta: "Khai báo thông tin nguyên liệu và lô hàng", so_nguoi_dung: 214, quyen_han: "Khai báo", ngay_tao: "15/02/2024", trang_thai: "active" },
  { id: "VT007", ten: "Đơn vị vận chuyển", mo_ta: "Cập nhật trạng thái vận chuyển và giao nhận", so_nguoi_dung: 76, quyen_han: "Cập nhật", ngay_tao: "01/03/2024", trang_thai: "active" },
  { id: "VT008", ten: "Chuyên gia tư vấn", mo_ta: "Xem báo cáo và đưa ra khuyến nghị", so_nguoi_dung: 22, quyen_han: "Chỉ đọc", ngay_tao: "10/03/2024", trang_thai: "active" },
  { id: "VT009", ten: "Kiểm toán nội bộ", mo_ta: "Kiểm tra tính toàn vẹn dữ liệu và audit log", so_nguoi_dung: 11, quyen_han: "Chỉ đọc", ngay_tao: "20/03/2024", trang_thai: "active" },
  { id: "VT010", ten: "Người dùng công cộng", mo_ta: "Tra cứu thông tin sản phẩm qua mã QR", so_nguoi_dung: 5840, quyen_han: "Tra cứu", ngay_tao: "01/04/2024", trang_thai: "active" },
  { id: "VT011", ten: "Đối tác phân phối", mo_ta: "Xem thông tin lô hàng và chứng từ liên quan", so_nguoi_dung: 143, quyen_han: "Chỉ đọc", ngay_tao: "15/04/2024", trang_thai: "active" },
  { id: "VT012", ten: "Nhân viên IT nội bộ", mo_ta: "Hỗ trợ kỹ thuật và quản lý hạ tầng", so_nguoi_dung: 8, quyen_han: "Kỹ thuật", ngay_tao: "01/05/2024", trang_thai: "active" },
  { id: "VT013", ten: "Tester & QA", mo_ta: "Kiểm thử tính năng hệ thống trên môi trường staging", so_nguoi_dung: 6, quyen_han: "Kỹ thuật", ngay_tao: "10/05/2024", trang_thai: "inactive" },
  { id: "VT014", ten: "Vai trò khách (Demo)", mo_ta: "Dành cho trình diễn sản phẩm với khách hàng tiềm năng", so_nguoi_dung: 4, quyen_han: "Tra cứu", ngay_tao: "20/05/2024", trang_thai: "inactive" },
];

const quyenMap: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  "Toàn quyền": "danger",
  "Đọc & Ghi": "warning",
  "Đọc & Phê duyệt": "info",
  "Khai báo": "info",
  "Cập nhật": "info",
  "Chỉ đọc": "neutral",
  "Tra cứu": "neutral",
  "Kỹ thuật": "warning",
};

const columns = [
  { key: "id", label: "Mã vai trò", width: "100px" },
  { key: "ten", label: "Tên vai trò" },
  { key: "mo_ta", label: "Mô tả" },
  {
    key: "so_nguoi_dung",
    label: "Số người dùng",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono font-semibold">{(row.so_nguoi_dung as number).toLocaleString()}</span>
    ),
  },
  {
    key: "quyen_han",
    label: "Quyền hạn",
    render: (row: Record<string, unknown>) => (
      <Badge variant={quyenMap[row.quyen_han as string] ?? "neutral"}>{row.quyen_han as string}</Badge>
    ),
  },
  { key: "ngay_tao", label: "Ngày tạo", width: "110px" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Đang dùng" : "Vô hiệu"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Quản lý vai trò"
      subtitle="Phân quyền và quản lý vai trò người dùng trong hệ thống"
      stats={[
        { label: "Tổng vai trò", value: data.length, variant: "info" },
        { label: "Đang sử dụng", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Vô hiệu hóa", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
        { label: "Tổng người dùng", value: "6,656", variant: "info" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten", "mo_ta", "quyen_han"]}
      addLabel="Thêm vai trò"
    />
  );
}
