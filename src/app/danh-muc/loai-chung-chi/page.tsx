"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "CC001", ten_chung_chi: "VietGAP", to_chuc_cap: "Bộ Nông nghiệp & PTNT", hieu_luc: 2, linh_vuc: "Nông sản", trang_thai: "active" },
  { id: "CC002", ten_chung_chi: "GlobalG.A.P.", to_chuc_cap: "FoodPLUS GmbH (Đức)", hieu_luc: 3, linh_vuc: "Nông sản", trang_thai: "active" },
  { id: "CC003", ten_chung_chi: "ASC (Aquaculture Stewardship Council)", to_chuc_cap: "ASC International", hieu_luc: 3, linh_vuc: "Thủy sản", trang_thai: "active" },
  { id: "CC004", ten_chung_chi: "BAP (Best Aquaculture Practices)", to_chuc_cap: "Global Seafood Alliance", hieu_luc: 2, linh_vuc: "Thủy sản", trang_thai: "active" },
  { id: "CC005", ten_chung_chi: "ISO 22000:2018", to_chuc_cap: "Bureau Veritas / SGS / Intertek", hieu_luc: 3, linh_vuc: "An toàn thực phẩm", trang_thai: "active" },
  { id: "CC006", ten_chung_chi: "HACCP", to_chuc_cap: "Cục An toàn thực phẩm – Bộ Y tế", hieu_luc: 3, linh_vuc: "An toàn thực phẩm", trang_thai: "active" },
  { id: "CC007", ten_chung_chi: "Organic Vietnam (TCVN 11041)", to_chuc_cap: "Bộ Nông nghiệp & PTNT", hieu_luc: 1, linh_vuc: "Hữu cơ", trang_thai: "active" },
  { id: "CC008", ten_chung_chi: "USDA Organic", to_chuc_cap: "USDA – Bộ Nông nghiệp Hoa Kỳ", hieu_luc: 1, linh_vuc: "Hữu cơ", trang_thai: "active" },
  { id: "CC009", ten_chung_chi: "EU Organic Certification", to_chuc_cap: "Cơ quan kiểm soát EU", hieu_luc: 1, linh_vuc: "Hữu cơ", trang_thai: "active" },
  { id: "CC010", ten_chung_chi: "4C (Common Code for Coffee Community)", to_chuc_cap: "GIZ / 4C Association", hieu_luc: 3, linh_vuc: "Cà phê", trang_thai: "active" },
  { id: "CC011", ten_chung_chi: "Rainforest Alliance", to_chuc_cap: "Rainforest Alliance International", hieu_luc: 3, linh_vuc: "Cây công nghiệp", trang_thai: "active" },
  { id: "CC012", ten_chung_chi: "MSC (Marine Stewardship Council)", to_chuc_cap: "MSC International", hieu_luc: 5, linh_vuc: "Thủy sản biển", trang_thai: "active" },
  { id: "CC013", ten_chung_chi: "Fairtrade", to_chuc_cap: "Fairtrade International", hieu_luc: 3, linh_vuc: "Cây công nghiệp", trang_thai: "inactive" },
  { id: "CC014", ten_chung_chi: "OCOP (Chương trình mỗi xã một sản phẩm)", to_chuc_cap: "Bộ Nông nghiệp & PTNT", hieu_luc: 3, linh_vuc: "Sản phẩm địa phương", trang_thai: "active" },
];

const linhVucColors: Record<string, "success" | "info" | "warning" | "neutral"> = {
  "Nông sản": "success",
  "Thủy sản": "info",
  "An toàn thực phẩm": "warning",
  "Hữu cơ": "success",
  "Cà phê": "warning",
  "Cây công nghiệp": "neutral",
  "Thủy sản biển": "info",
  "Sản phẩm địa phương": "neutral",
};

const columns = [
  { key: "id", label: "Mã", width: "80px" },
  { key: "ten_chung_chi", label: "Tên chứng chỉ" },
  { key: "to_chuc_cap", label: "Tổ chức cấp" },
  { key: "hieu_luc", label: "Hiệu lực (năm)", width: "130px" },
  {
    key: "linh_vuc",
    label: "Lĩnh vực",
    width: "160px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={linhVucColors[row.linh_vuc as string] ?? "neutral"}>{row.linh_vuc as string}</Badge>
    ),
  },
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
      title="Danh sách chứng chỉ"
      subtitle="Quản lý danh mục các loại chứng chỉ chất lượng và an toàn thực phẩm"
      stats={[
        { label: "Tổng chứng chỉ", value: data.length, variant: "info" },
        { label: "Đang sử dụng", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Chứng chỉ quốc tế", value: data.filter((d) => !d.to_chuc_cap.includes("Bộ") && !d.to_chuc_cap.includes("Cục")).length, variant: "info" },
        { label: "Chứng chỉ Việt Nam", value: data.filter((d) => d.to_chuc_cap.includes("Bộ") || d.to_chuc_cap.includes("Cục")).length, variant: "success" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten_chung_chi", "to_chuc_cap", "linh_vuc"]}
      addLabel="Thêm loại chứng chỉ"
    />
  );
}
