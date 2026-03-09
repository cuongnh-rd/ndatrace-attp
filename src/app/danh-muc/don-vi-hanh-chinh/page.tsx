"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "DVHC001", ten: "Thành phố Hà Nội", loai: "Tỉnh/Thành phố", tinh_thanh: "Hà Nội", cap: 1, trang_thai: "active" },
  { id: "DVHC002", ten: "Thành phố Hồ Chí Minh", loai: "Tỉnh/Thành phố", tinh_thanh: "TP. Hồ Chí Minh", cap: 1, trang_thai: "active" },
  { id: "DVHC003", ten: "Thành phố Cần Thơ", loai: "Tỉnh/Thành phố", tinh_thanh: "Cần Thơ", cap: 1, trang_thai: "active" },
  { id: "DVHC004", ten: "Tỉnh Đồng Tháp", loai: "Tỉnh/Thành phố", tinh_thanh: "Đồng Tháp", cap: 1, trang_thai: "active" },
  { id: "DVHC005", ten: "Tỉnh Lâm Đồng", loai: "Tỉnh/Thành phố", tinh_thanh: "Lâm Đồng", cap: 1, trang_thai: "active" },
  { id: "DVHC006", ten: "Quận Ninh Kiều", loai: "Quận/Huyện", tinh_thanh: "Cần Thơ", cap: 2, trang_thai: "active" },
  { id: "DVHC007", ten: "Huyện Cao Lãnh", loai: "Quận/Huyện", tinh_thanh: "Đồng Tháp", cap: 2, trang_thai: "active" },
  { id: "DVHC008", ten: "Huyện Lấp Vò", loai: "Quận/Huyện", tinh_thanh: "Đồng Tháp", cap: 2, trang_thai: "active" },
  { id: "DVHC009", ten: "Thành phố Đà Lạt", loai: "Quận/Huyện", tinh_thanh: "Lâm Đồng", cap: 2, trang_thai: "active" },
  { id: "DVHC010", ten: "Huyện Đức Trọng", loai: "Quận/Huyện", tinh_thanh: "Lâm Đồng", cap: 2, trang_thai: "active" },
  { id: "DVHC011", ten: "Xã Tân Khánh Đông", loai: "Xã/Phường/Thị trấn", tinh_thanh: "Đồng Tháp", cap: 3, trang_thai: "active" },
  { id: "DVHC012", ten: "Phường An Bình", loai: "Xã/Phường/Thị trấn", tinh_thanh: "Cần Thơ", cap: 3, trang_thai: "active" },
  { id: "DVHC013", ten: "Xã Lạc Xuân", loai: "Xã/Phường/Thị trấn", tinh_thanh: "Lâm Đồng", cap: 3, trang_thai: "active" },
  { id: "DVHC014", ten: "Thị trấn Liên Nghĩa", loai: "Xã/Phường/Thị trấn", tinh_thanh: "Lâm Đồng", cap: 3, trang_thai: "inactive" },
  { id: "DVHC015", ten: "Tỉnh Bến Tre", loai: "Tỉnh/Thành phố", tinh_thanh: "Bến Tre", cap: 1, trang_thai: "active" },
];

const loaiColors: Record<string, "success" | "info" | "warning"> = {
  "Tỉnh/Thành phố": "success",
  "Quận/Huyện": "info",
  "Xã/Phường/Thị trấn": "warning",
};

const columns = [
  { key: "id", label: "Mã", width: "100px" },
  { key: "ten", label: "Tên đơn vị" },
  {
    key: "loai",
    label: "Loại",
    width: "180px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={loaiColors[row.loai as string] ?? "neutral"}>{row.loai as string}</Badge>
    ),
  },
  { key: "tinh_thanh", label: "Tỉnh/Thành", width: "140px" },
  { key: "cap", label: "Cấp", width: "70px" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    width: "130px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Hoạt động" : "Không dùng"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Đơn vị hành chính"
      subtitle="Quản lý danh mục đơn vị hành chính các cấp trong hệ thống"
      stats={[
        { label: "Tổng đơn vị", value: data.length, variant: "info" },
        { label: "Tỉnh/Thành phố", value: data.filter((d) => d.loai === "Tỉnh/Thành phố").length, variant: "success" },
        { label: "Quận/Huyện", value: data.filter((d) => d.loai === "Quận/Huyện").length, variant: "info" },
        { label: "Xã/Phường", value: data.filter((d) => d.loai === "Xã/Phường/Thị trấn").length, variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten", "loai", "tinh_thanh"]}
      addLabel="Thêm đơn vị hành chính"
    />
  );
}
