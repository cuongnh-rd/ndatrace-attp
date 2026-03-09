"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "DVT001", ten: "Kilôgam", viet_tat: "kg", loai: "Khối lượng", mo_ta: "Đơn vị khối lượng cơ bản trong hệ SI", trang_thai: "active" },
  { id: "DVT002", ten: "Gam", viet_tat: "g", loai: "Khối lượng", mo_ta: "1 kg = 1.000 g", trang_thai: "active" },
  { id: "DVT003", ten: "Tấn", viet_tat: "tấn", loai: "Khối lượng", mo_ta: "1 tấn = 1.000 kg, dùng trong vận chuyển hàng hóa", trang_thai: "active" },
  { id: "DVT004", ten: "Lít", viet_tat: "L", loai: "Thể tích", mo_ta: "Đơn vị thể tích phổ biến cho chất lỏng", trang_thai: "active" },
  { id: "DVT005", ten: "Mililít", viet_tat: "mL", loai: "Thể tích", mo_ta: "1 L = 1.000 mL, dùng cho dung dịch nhỏ", trang_thai: "active" },
  { id: "DVT006", ten: "Mét khối", viet_tat: "m³", loai: "Thể tích", mo_ta: "Dùng cho chất lỏng khối lượng lớn và xây dựng", trang_thai: "active" },
  { id: "DVT007", ten: "Cái / Chiếc", viet_tat: "cái", loai: "Đơn vị đếm", mo_ta: "Đơn vị đếm cho sản phẩm nguyên chiếc", trang_thai: "active" },
  { id: "DVT008", ten: "Hộp", viet_tat: "hộp", loai: "Đơn vị đếm", mo_ta: "Đơn vị đóng gói dạng hộp cứng hoặc giấy", trang_thai: "active" },
  { id: "DVT009", ten: "Túi", viet_tat: "túi", loai: "Đơn vị đếm", mo_ta: "Đơn vị đóng gói dạng túi nhựa hoặc vải", trang_thai: "active" },
  { id: "DVT010", ten: "Chai", viet_tat: "chai", loai: "Đơn vị đếm", mo_ta: "Đóng gói dạng chai thủy tinh hoặc nhựa", trang_thai: "active" },
  { id: "DVT011", ten: "Lon", viet_tat: "lon", loai: "Đơn vị đếm", mo_ta: "Đóng gói dạng lon kim loại", trang_thai: "active" },
  { id: "DVT012", ten: "Bó", viet_tat: "bó", loai: "Đơn vị đếm", mo_ta: "Dùng cho rau củ quả theo bó", trang_thai: "active" },
  { id: "DVT013", ten: "Quả / Trái", viet_tat: "quả", loai: "Đơn vị đếm", mo_ta: "Đơn vị đếm cho trái cây và rau củ nguyên quả", trang_thai: "active" },
  { id: "DVT014", ten: "Thùng", viet_tat: "thùng", loai: "Đơn vị đếm", mo_ta: "Đơn vị đóng gói thùng carton hoặc gỗ", trang_thai: "active" },
  { id: "DVT015", ten: "Pallet", viet_tat: "pallet", loai: "Đơn vị đếm", mo_ta: "Đơn vị vận chuyển hàng loạt trên pallet gỗ", trang_thai: "active" },
];

const loaiMap: Record<string, "warning" | "info" | "success"> = {
  "Khối lượng": "warning",
  "Thể tích": "info",
  "Đơn vị đếm": "success",
};

const columns = [
  { key: "id", label: "Mã", width: "90px" },
  { key: "ten", label: "Tên đơn vị" },
  { key: "viet_tat", label: "Viết tắt", width: "90px" },
  {
    key: "loai",
    label: "Loại",
    render: (row: Record<string, unknown>) => (
      <Badge variant={loaiMap[row.loai as string] ?? "neutral"}>{row.loai as string}</Badge>
    ),
  },
  { key: "mo_ta", label: "Mô tả" },
  {
    key: "trang_thai",
    label: "Trạng thái",
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
      title="Đơn vị tính"
      subtitle="Danh mục đơn vị đo lường dùng trong khai báo sản phẩm và giao dịch"
      stats={[
        { label: "Tổng đơn vị", value: data.length, variant: "info" },
        { label: "Khối lượng", value: data.filter((d) => d.loai === "Khối lượng").length, variant: "warning" },
        { label: "Thể tích", value: data.filter((d) => d.loai === "Thể tích").length, variant: "info" },
        { label: "Đơn vị đếm", value: data.filter((d) => d.loai === "Đơn vị đếm").length, variant: "success" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten", "viet_tat", "loai"]}
      addLabel="Thêm đơn vị"
    />
  );
}
