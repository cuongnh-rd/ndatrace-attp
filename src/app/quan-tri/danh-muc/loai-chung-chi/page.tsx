"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "LCC001", ten: "VietGAP Rau củ quả", to_chuc: "Bộ Nông nghiệp & PTNT", hieu_luc: "2 năm", linh_vuc: "Nông nghiệp", trang_thai: "active" },
  { id: "LCC002", ten: "GlobalG.A.P.", to_chuc: "FoodPLUS GmbH (Đức)", hieu_luc: "1 năm", linh_vuc: "Nông nghiệp", trang_thai: "active" },
  { id: "LCC003", ten: "HACCP", to_chuc: "Cục An toàn thực phẩm", hieu_luc: "3 năm", linh_vuc: "Thực phẩm", trang_thai: "active" },
  { id: "LCC004", ten: "ISO 22000:2018", to_chuc: "Bureau Veritas Việt Nam", hieu_luc: "3 năm", linh_vuc: "Thực phẩm", trang_thai: "active" },
  { id: "LCC005", ten: "Hữu cơ USDA NOP", to_chuc: "USDA - Bộ Nông nghiệp Mỹ", hieu_luc: "1 năm", linh_vuc: "Nông nghiệp", trang_thai: "active" },
  { id: "LCC006", ten: "EU Organic", to_chuc: "Ủy ban châu Âu", hieu_luc: "1 năm", linh_vuc: "Nông nghiệp", trang_thai: "active" },
  { id: "LCC007", ten: "ASC - Nuôi trồng thủy sản", to_chuc: "Aquaculture Stewardship Council", hieu_luc: "2 năm", linh_vuc: "Thủy sản", trang_thai: "active" },
  { id: "LCC008", ten: "MSC - Đánh bắt bền vững", to_chuc: "Marine Stewardship Council", hieu_luc: "2 năm", linh_vuc: "Thủy sản", trang_thai: "active" },
  { id: "LCC009", ten: "VietGAP Thủy sản", to_chuc: "Bộ Nông nghiệp & PTNT", hieu_luc: "2 năm", linh_vuc: "Thủy sản", trang_thai: "active" },
  { id: "LCC010", ten: "GMP Dược phẩm", to_chuc: "Cục Quản lý Dược", hieu_luc: "5 năm", linh_vuc: "Dược phẩm", trang_thai: "active" },
  { id: "LCC011", ten: "FSSC 22000", to_chuc: "SGS Việt Nam", hieu_luc: "3 năm", linh_vuc: "Thực phẩm", trang_thai: "active" },
  { id: "LCC012", ten: "BRC Global Standard", to_chuc: "British Retail Consortium", hieu_luc: "1 năm", linh_vuc: "Thực phẩm", trang_thai: "active" },
  { id: "LCC013", ten: "Rainforest Alliance", to_chuc: "Rainforest Alliance Inc.", hieu_luc: "1 năm", linh_vuc: "Nông nghiệp", trang_thai: "active" },
  { id: "LCC014", ten: "4C Coffee Certification", to_chuc: "4C Association", hieu_luc: "3 năm", linh_vuc: "Nông nghiệp", trang_thai: "inactive" },
  { id: "LCC015", ten: "Halal MUI", to_chuc: "Majelis Ulama Indonesia", hieu_luc: "2 năm", linh_vuc: "Thực phẩm", trang_thai: "active" },
];

const linhVucMap: Record<string, "success" | "info" | "warning" | "neutral"> = {
  "Nông nghiệp": "success",
  "Thủy sản": "info",
  "Thực phẩm": "warning",
  "Dược phẩm": "neutral",
};

const columns = [
  { key: "id", label: "Mã", width: "90px" },
  { key: "ten", label: "Tên chứng chỉ" },
  { key: "to_chuc", label: "Tổ chức cấp" },
  { key: "hieu_luc", label: "Hiệu lực", width: "90px" },
  {
    key: "linh_vuc",
    label: "Lĩnh vực",
    render: (row: Record<string, unknown>) => (
      <Badge variant={linhVucMap[row.linh_vuc as string] ?? "neutral"}>{row.linh_vuc as string}</Badge>
    ),
  },
  {
    key: "trang_thai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Áp dụng" : "Ngừng áp dụng"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Loại chứng chỉ (Quản trị)"
      subtitle="Danh mục các loại chứng chỉ chất lượng và an toàn thực phẩm được công nhận"
      stats={[
        { label: "Tổng loại chứng chỉ", value: data.length, variant: "info" },
        { label: "Đang áp dụng", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Ngừng áp dụng", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
        { label: "Lĩnh vực", value: 4, variant: "info" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten", "to_chuc", "linh_vuc"]}
      addLabel="Thêm loại chứng chỉ"
    />
  );
}
