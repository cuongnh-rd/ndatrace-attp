"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "MTY001", ten_mau: "Thu hoạch lúa", loai_su_kien: "Sản xuất", mo_ta: "Ghi nhận quá trình thu hoạch lúa tại ruộng", ngay_tao: "2025-06-10", trang_thai: "active" },
  { id: "MTY002", ten_mau: "Nuôi tôm thẻ chân trắng", loai_su_kien: "Nuôi trồng", mo_ta: "Theo dõi quá trình nuôi tôm thẻ chân trắng theo tiêu chuẩn ASC", ngay_tao: "2025-06-15", trang_thai: "active" },
  { id: "MTY003", ten_mau: "Chế biến cà phê nhân", loai_su_kien: "Chế biến", mo_ta: "Quy trình chế biến cà phê nhân từ quả tươi", ngay_tao: "2025-06-20", trang_thai: "active" },
  { id: "MTY004", ten_mau: "Kiểm tra chất lượng đầu vào", loai_su_kien: "Kiểm tra", mo_ta: "Kiểm tra nguyên liệu đầu vào trước khi đưa vào sản xuất", ngay_tao: "2025-07-01", trang_thai: "active" },
  { id: "MTY005", ten_mau: "Đóng gói thành phẩm", loai_su_kien: "Đóng gói", mo_ta: "Ghi nhận thông tin đóng gói sản phẩm thành phẩm", ngay_tao: "2025-07-05", trang_thai: "active" },
  { id: "MTY006", ten_mau: "Vận chuyển lạnh", loai_su_kien: "Vận chuyển", mo_ta: "Theo dõi vận chuyển sản phẩm đông lạnh bảo đảm nhiệt độ chuỗi lạnh", ngay_tao: "2025-07-10", trang_thai: "active" },
  { id: "MTY007", ten_mau: "Phun thuốc bảo vệ thực vật", loai_su_kien: "Canh tác", mo_ta: "Ghi nhận thông tin phun thuốc BVTV theo khuyến cáo", ngay_tao: "2025-07-15", trang_thai: "active" },
  { id: "MTY008", ten_mau: "Nhập kho bảo quản", loai_su_kien: "Lưu kho", mo_ta: "Ghi nhận nhập kho và điều kiện bảo quản sản phẩm", ngay_tao: "2025-07-20", trang_thai: "active" },
  { id: "MTY009", ten_mau: "Xuất khẩu hải sản", loai_su_kien: "Xuất khẩu", mo_ta: "Thủ tục và kiểm định sản phẩm hải sản xuất khẩu", ngay_tao: "2025-08-01", trang_thai: "inactive" },
  { id: "MTY010", ten_mau: "Chứng nhận GlobalG.A.P.", loai_su_kien: "Chứng nhận", mo_ta: "Quy trình kiểm tra và cấp chứng nhận GlobalG.A.P. cho nông sản", ngay_tao: "2025-08-05", trang_thai: "active" },
  { id: "MTY011", ten_mau: "Kiểm dịch thực vật", loai_su_kien: "Kiểm tra", mo_ta: "Kiểm dịch thực vật trước khi xuất khẩu sang thị trường EU", ngay_tao: "2025-08-10", trang_thai: "active" },
  { id: "MTY012", ten_mau: "Ươm giống thủy sản", loai_su_kien: "Nuôi trồng", mo_ta: "Ghi nhận thông tin ươm giống và chất lượng con giống thủy sản", ngay_tao: "2025-08-15", trang_thai: "active" },
  { id: "MTY013", ten_mau: "Thu mua nguyên liệu", loai_su_kien: "Thu mua", mo_ta: "Ghi nhận thông tin thu mua nguyên liệu từ nông dân và HTX", ngay_tao: "2025-09-01", trang_thai: "inactive" },
  { id: "MTY014", ten_mau: "Phân loại sản phẩm", loai_su_kien: "Chế biến", mo_ta: "Phân loại và đánh giá chất lượng sản phẩm sau thu hoạch", ngay_tao: "2025-09-10", trang_thai: "active" },
];

const eventTypeColors: Record<string, "success" | "info" | "warning" | "neutral" | "danger"> = {
  "Sản xuất": "success",
  "Nuôi trồng": "info",
  "Chế biến": "warning",
  "Kiểm tra": "neutral",
  "Đóng gói": "neutral",
  "Vận chuyển": "info",
  "Canh tác": "success",
  "Lưu kho": "neutral",
  "Xuất khẩu": "info",
  "Chứng nhận": "success",
  "Thu mua": "warning",
};

const columns = [
  { key: "id", label: "Mã mẫu", width: "100px" },
  { key: "ten_mau", label: "Tên mẫu" },
  {
    key: "loai_su_kien",
    label: "Loại sự kiện",
    width: "140px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={eventTypeColors[row.loai_su_kien as string] ?? "neutral"}>{row.loai_su_kien as string}</Badge>
    ),
  },
  { key: "mo_ta", label: "Mô tả" },
  { key: "ngay_tao", label: "Ngày tạo", width: "120px" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    width: "130px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Đang dùng" : "Không dùng"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Mẫu sự kiện trọng yếu"
      subtitle="Quản lý các mẫu sự kiện trọng yếu trong chuỗi cung ứng và truy xuất nguồn gốc"
      stats={[
        { label: "Tổng mẫu", value: data.length, variant: "info" },
        { label: "Đang sử dụng", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Không sử dụng", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
        { label: "Loại sự kiện", value: new Set(data.map((d) => d.loai_su_kien)).size, variant: "info" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten_mau", "loai_su_kien", "mo_ta"]}
      addLabel="Thêm mẫu sự kiện"
    />
  );
}
