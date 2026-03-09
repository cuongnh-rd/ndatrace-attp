"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { ma_nut: "ND001", ten_dia_diem: "Trang trại gạo ST25 Sóc Trăng", loai: "Sản xuất", tinh_thanh: "Sóc Trăng", doanh_nghiep: "HTX Nông nghiệp Sóc Trăng", so_su_kien: 312, trang_thai: "active" },
  { ma_nut: "ND002", ten_dia_diem: "Nhà máy chế biến thủy sản Minh Phú", loai: "Sản xuất", tinh_thanh: "Cà Mau", doanh_nghiep: "Cty TNHH Thủy sản Minh Phú", so_su_kien: 480, trang_thai: "active" },
  { ma_nut: "ND003", ten_dia_diem: "Kho lạnh cảng Cát Lái", loai: "Vận chuyển", tinh_thanh: "TP. Hồ Chí Minh", doanh_nghiep: "Cty CP Logistics Tân Cảng", so_su_kien: 1240, trang_thai: "active" },
  { ma_nut: "ND004", ten_dia_diem: "Trung tâm phân phối BigC Hà Nội", loai: "Phân phối", tinh_thanh: "Hà Nội", doanh_nghiep: "Central Retail Việt Nam", so_su_kien: 876, trang_thai: "active" },
  { ma_nut: "ND005", ten_dia_diem: "Siêu thị Co.opmart Quận 7", loai: "Bán lẻ", tinh_thanh: "TP. Hồ Chí Minh", doanh_nghiep: "Saigon Co.op", so_su_kien: 654, trang_thai: "active" },
  { ma_nut: "ND006", ten_dia_diem: "Vùng nuôi tôm sú Đầm Dơi", loai: "Sản xuất", tinh_thanh: "Cà Mau", doanh_nghiep: "HTX Nuôi trồng thủy sản Đầm Dơi", so_su_kien: 198, trang_thai: "active" },
  { ma_nut: "ND007", ten_dia_diem: "Tuyến xe lạnh HCM - Hà Nội", loai: "Vận chuyển", tinh_thanh: "Toàn quốc", doanh_nghiep: "Cty CP Vận tải Lạnh Bắc Nam", so_su_kien: 2340, trang_thai: "active" },
  { ma_nut: "ND008", ten_dia_diem: "Kho ngoại quan sân bay Nội Bài", loai: "Vận chuyển", tinh_thanh: "Hà Nội", doanh_nghiep: "ALS - Dịch vụ kho vận hàng không", so_su_kien: 543, trang_thai: "active" },
  { ma_nut: "ND009", ten_dia_diem: "Trung tâm phân phối Vinmart+ HCM", loai: "Phân phối", tinh_thanh: "TP. Hồ Chí Minh", doanh_nghiep: "Masan Consumer", so_su_kien: 1180, trang_thai: "active" },
  { ma_nut: "ND010", ten_dia_diem: "Vườn bưởi da xanh Mỏ Cày Nam", loai: "Sản xuất", tinh_thanh: "Bến Tre", doanh_nghiep: "HTX Bưởi da xanh Mỏ Cày", so_su_kien: 204, trang_thai: "active" },
  { ma_nut: "ND011", ten_dia_diem: "Chợ đầu mối nông sản Thủ Đức", loai: "Phân phối", tinh_thanh: "TP. Hồ Chí Minh", doanh_nghiep: "BQL Chợ đầu mối Thủ Đức", so_su_kien: 3450, trang_thai: "active" },
  { ma_nut: "ND012", ten_dia_diem: "Chuỗi cửa hàng Bách Hóa Xanh", loai: "Bán lẻ", tinh_thanh: "TP. Hồ Chí Minh", doanh_nghiep: "Mobile World Group", so_su_kien: 2180, trang_thai: "active" },
  { ma_nut: "ND013", ten_dia_diem: "Nhà máy chế biến cà phê Đà Lạt", loai: "Sản xuất", tinh_thanh: "Lâm Đồng", doanh_nghiep: "Cty CP Cà phê Lâm Đồng", so_su_kien: 218, trang_thai: "active" },
  { ma_nut: "ND014", ten_dia_diem: "Kho phân phối Đà Nẵng", loai: "Phân phối", tinh_thanh: "Đà Nẵng", doanh_nghiep: "Cty CP Phân phối Miền Trung", so_su_kien: 567, trang_thai: "active" },
  { ma_nut: "ND015", ten_dia_diem: "Cửa hàng Winmart Hải Phòng (Cũ)", loai: "Bán lẻ", tinh_thanh: "Hải Phòng", doanh_nghiep: "Masan Consumer", so_su_kien: 89, trang_thai: "inactive" },
];

const loaiMap: Record<string, "success" | "info" | "warning" | "neutral"> = {
  "Sản xuất": "success",
  "Vận chuyển": "info",
  "Phân phối": "warning",
  "Bán lẻ": "neutral",
};

const columns = [
  { key: "ma_nut", label: "Mã nút", width: "90px" },
  { key: "ten_dia_diem", label: "Tên địa điểm" },
  {
    key: "loai",
    label: "Loại nút",
    render: (row: Record<string, unknown>) => (
      <Badge variant={loaiMap[row.loai as string] ?? "neutral"}>{row.loai as string}</Badge>
    ),
  },
  { key: "tinh_thanh", label: "Tỉnh/Thành" },
  { key: "doanh_nghiep", label: "Doanh nghiệp" },
  {
    key: "so_su_kien",
    label: "Số sự kiện",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono font-semibold">{(row.so_su_kien as number).toLocaleString()}</span>
    ),
  },
  {
    key: "trang_thai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Hoạt động" : "Ngừng hoạt động"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Bản đồ chuỗi cung ứng"
      subtitle="Danh sách các nút trong chuỗi cung ứng từ sản xuất đến tay người tiêu dùng"
      stats={[
        { label: "Tổng nút", value: data.length, variant: "info" },
        { label: "Sản xuất", value: data.filter((d) => d.loai === "Sản xuất").length, variant: "success" },
        { label: "Vận chuyển", value: data.filter((d) => d.loai === "Vận chuyển").length, variant: "info" },
        { label: "Phân phối & Bán lẻ", value: data.filter((d) => ["Phân phối", "Bán lẻ"].includes(d.loai)).length, variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["ma_nut", "ten_dia_diem", "loai", "tinh_thanh", "doanh_nghiep"]}
      addLabel="Thêm nút"
    />
  );
}
