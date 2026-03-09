"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "DVHC001", ten: "Thành phố Hồ Chí Minh", loai: "Thành phố trực thuộc TW", tinh_thanh: "TP. Hồ Chí Minh", cap: "Cấp 1", trang_thai: "active" },
  { id: "DVHC002", ten: "Thành phố Hà Nội", loai: "Thành phố trực thuộc TW", tinh_thanh: "Hà Nội", cap: "Cấp 1", trang_thai: "active" },
  { id: "DVHC003", ten: "Tỉnh An Giang", loai: "Tỉnh", tinh_thanh: "An Giang", cap: "Cấp 1", trang_thai: "active" },
  { id: "DVHC004", ten: "Quận 1", loai: "Quận", tinh_thanh: "TP. Hồ Chí Minh", cap: "Cấp 2", trang_thai: "active" },
  { id: "DVHC005", ten: "Huyện Cái Bè", loai: "Huyện", tinh_thanh: "Tiền Giang", cap: "Cấp 2", trang_thai: "active" },
  { id: "DVHC006", ten: "Thị xã Hồng Ngự", loai: "Thị xã", tinh_thanh: "Đồng Tháp", cap: "Cấp 2", trang_thai: "active" },
  { id: "DVHC007", ten: "Xã Tân Phú Trung", loai: "Xã", tinh_thanh: "TP. Hồ Chí Minh", cap: "Cấp 3", trang_thai: "active" },
  { id: "DVHC008", ten: "Thị trấn Mỏ Cày", loai: "Thị trấn", tinh_thanh: "Bến Tre", cap: "Cấp 3", trang_thai: "active" },
  { id: "DVHC009", ten: "Phường Bến Nghé", loai: "Phường", tinh_thanh: "TP. Hồ Chí Minh", cap: "Cấp 3", trang_thai: "active" },
  { id: "DVHC010", ten: "Tỉnh Đắk Lắk", loai: "Tỉnh", tinh_thanh: "Đắk Lắk", cap: "Cấp 1", trang_thai: "active" },
  { id: "DVHC011", ten: "Huyện Lục Ngạn", loai: "Huyện", tinh_thanh: "Bắc Giang", cap: "Cấp 2", trang_thai: "active" },
  { id: "DVHC012", ten: "Xã Giục Tượng", loai: "Xã", tinh_thanh: "Kiên Giang", cap: "Cấp 3", trang_thai: "active" },
  { id: "DVHC013", ten: "Thành phố Buôn Ma Thuột", loai: "Thành phố thuộc tỉnh", tinh_thanh: "Đắk Lắk", cap: "Cấp 2", trang_thai: "active" },
  { id: "DVHC014", ten: "Huyện Phú Quốc (cũ)", loai: "Huyện", tinh_thanh: "Kiên Giang", cap: "Cấp 2", trang_thai: "inactive" },
  { id: "DVHC015", ten: "Thành phố Phú Quốc", loai: "Thành phố thuộc tỉnh", tinh_thanh: "Kiên Giang", cap: "Cấp 2", trang_thai: "active" },
];

const loaiMap: Record<string, "success" | "info" | "warning" | "neutral" | "danger"> = {
  "Thành phố trực thuộc TW": "danger",
  "Tỉnh": "warning",
  "Quận": "info",
  "Huyện": "info",
  "Thị xã": "info",
  "Thành phố thuộc tỉnh": "info",
  "Xã": "neutral",
  "Phường": "neutral",
  "Thị trấn": "neutral",
};

const capMap: Record<string, "success" | "warning" | "neutral"> = {
  "Cấp 1": "warning",
  "Cấp 2": "success",
  "Cấp 3": "neutral",
};

const columns = [
  { key: "id", label: "Mã", width: "100px" },
  { key: "ten", label: "Tên đơn vị" },
  {
    key: "loai",
    label: "Loại",
    render: (row: Record<string, unknown>) => (
      <Badge variant={loaiMap[row.loai as string] ?? "neutral"}>{row.loai as string}</Badge>
    ),
  },
  { key: "tinh_thanh", label: "Tỉnh/Thành" },
  {
    key: "cap",
    label: "Cấp hành chính",
    render: (row: Record<string, unknown>) => (
      <Badge variant={capMap[row.cap as string] ?? "neutral"}>{row.cap as string}</Badge>
    ),
  },
  {
    key: "trang_thai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Hiện hành" : "Đã thay đổi"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Đơn vị hành chính (Quản trị)"
      subtitle="Danh mục đơn vị hành chính các cấp trên toàn quốc"
      stats={[
        { label: "Tổng đơn vị", value: data.length, variant: "info" },
        { label: "Hiện hành", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Đã thay đổi", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
        { label: "Cấp hành chính", value: 3, variant: "info" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten", "loai", "tinh_thanh", "cap"]}
      addLabel="Thêm đơn vị"
    />
  );
}
