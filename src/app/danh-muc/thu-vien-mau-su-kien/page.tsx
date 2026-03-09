"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "TVMSK001", ten_mau: "Thu hoạch lúa – Đồng bằng sông Cửu Long", loai_su_kien: "Sản xuất", nganh_hang: "Lúa gạo", so_luot_dung: 284, ngay_tao: "2024-03-10", trang_thai: "active" },
  { id: "TVMSK002", ten_mau: "Nuôi tôm sú quảng canh", loai_su_kien: "Nuôi trồng", nganh_hang: "Thủy sản", so_luot_dung: 156, ngay_tao: "2024-03-15", trang_thai: "active" },
  { id: "TVMSK003", ten_mau: "Xay xát và đánh bóng gạo", loai_su_kien: "Chế biến", nganh_hang: "Lúa gạo", so_luot_dung: 198, ngay_tao: "2024-04-01", trang_thai: "active" },
  { id: "TVMSK004", ten_mau: "Cấp đông hải sản IQF", loai_su_kien: "Chế biến", nganh_hang: "Thủy sản", so_luot_dung: 132, ngay_tao: "2024-04-10", trang_thai: "active" },
  { id: "TVMSK005", ten_mau: "Rang xay cà phê robusta", loai_su_kien: "Chế biến", nganh_hang: "Cà phê", so_luot_dung: 89, ngay_tao: "2024-04-20", trang_thai: "active" },
  { id: "TVMSK006", ten_mau: "Bón phân theo quy trình VietGAP", loai_su_kien: "Canh tác", nganh_hang: "Nông sản", so_luot_dung: 312, ngay_tao: "2024-05-01", trang_thai: "active" },
  { id: "TVMSK007", ten_mau: "Đóng gói hút chân không hải sản", loai_su_kien: "Đóng gói", nganh_hang: "Thủy sản", so_luot_dung: 204, ngay_tao: "2024-05-15", trang_thai: "active" },
  { id: "TVMSK008", ten_mau: "Kiểm tra nhanh dư lượng thuốc BVTV", loai_su_kien: "Kiểm tra", nganh_hang: "Nông sản", so_luot_dung: 178, ngay_tao: "2024-06-01", trang_thai: "active" },
  { id: "TVMSK009", ten_mau: "Vận chuyển lạnh tôm đông lạnh", loai_su_kien: "Vận chuyển", nganh_hang: "Thủy sản", so_luot_dung: 245, ngay_tao: "2024-06-10", trang_thai: "active" },
  { id: "TVMSK010", ten_mau: "Phơi và bảo quản hạt điều", loai_su_kien: "Lưu kho", nganh_hang: "Cây công nghiệp", so_luot_dung: 67, ngay_tao: "2024-06-20", trang_thai: "active" },
  { id: "TVMSK011", ten_mau: "Kiểm tra phân loại trái cây xuất khẩu", loai_su_kien: "Kiểm tra", nganh_hang: "Cây ăn quả", so_luot_dung: 145, ngay_tao: "2024-07-05", trang_thai: "active" },
  { id: "TVMSK012", ten_mau: "Thu mua mật ong từ hộ ong", loai_su_kien: "Thu mua", nganh_hang: "Sản phẩm ong", so_luot_dung: 41, ngay_tao: "2024-07-15", trang_thai: "active" },
  { id: "TVMSK013", ten_mau: "Xuất khẩu gạo – lấy mẫu kiểm định", loai_su_kien: "Xuất khẩu", nganh_hang: "Lúa gạo", so_luot_dung: 78, ngay_tao: "2024-08-01", trang_thai: "active" },
  { id: "TVMSK014", ten_mau: "Thanh trùng sữa tươi HTST", loai_su_kien: "Chế biến", nganh_hang: "Sản phẩm sữa", so_luot_dung: 112, ngay_tao: "2024-08-15", trang_thai: "inactive" },
  { id: "TVMSK015", ten_mau: "Gắn tem QR lô hàng rau củ", loai_su_kien: "Đóng gói", nganh_hang: "Nông sản", so_luot_dung: 389, ngay_tao: "2024-09-01", trang_thai: "active" },
];

const eventTypeColors: Record<string, "success" | "info" | "warning" | "neutral"> = {
  "Sản xuất": "success",
  "Nuôi trồng": "info",
  "Chế biến": "warning",
  "Canh tác": "success",
  "Đóng gói": "neutral",
  "Kiểm tra": "neutral",
  "Vận chuyển": "info",
  "Lưu kho": "neutral",
  "Thu mua": "warning",
  "Xuất khẩu": "info",
};

const columns = [
  { key: "id", label: "Mã", width: "110px" },
  { key: "ten_mau", label: "Tên mẫu" },
  {
    key: "loai_su_kien",
    label: "Loại sự kiện",
    width: "140px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={eventTypeColors[row.loai_su_kien as string] ?? "neutral"}>{row.loai_su_kien as string}</Badge>
    ),
  },
  { key: "nganh_hang", label: "Ngành hàng", width: "150px" },
  {
    key: "so_luot_dung",
    label: "Số lượt dùng",
    width: "120px",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono font-semibold">{(row.so_luot_dung as number).toLocaleString()}</span>
    ),
  },
  { key: "ngay_tao", label: "Ngày tạo", width: "120px" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    width: "120px",
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
      title="Thư viện mẫu sự kiện"
      subtitle="Quản lý thư viện mẫu sự kiện tái sử dụng cho các chuỗi cung ứng trong hệ thống"
      stats={[
        { label: "Tổng mẫu", value: data.length, variant: "info" },
        { label: "Đang sử dụng", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Tổng lượt dùng", value: data.reduce((s, d) => s + d.so_luot_dung, 0).toLocaleString(), variant: "info" },
        { label: "Phổ biến nhất", value: Math.max(...data.map((d) => d.so_luot_dung)), variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten_mau", "loai_su_kien", "nganh_hang"]}
      addLabel="Thêm mẫu sự kiện"
    />
  );
}
