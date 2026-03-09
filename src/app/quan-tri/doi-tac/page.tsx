"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "DT001", ten: "GS1 Vietnam", loai: "Tổ chức tiêu chuẩn", quoc_gia: "Việt Nam", lien_he: "Nguyễn Hồng Minh", email: "contact@gs1.org.vn", trang_thai: "active" },
  { id: "DT002", ten: "Aeon Vietnam", loai: "Nhà bán lẻ", quoc_gia: "Việt Nam", lien_he: "Tanaka Hiroshi", email: "partner@aeon.vn", trang_thai: "active" },
  { id: "DT003", ten: "Masan Consumer", loai: "Doanh nghiệp thực phẩm", quoc_gia: "Việt Nam", lien_he: "Trần Văn Lợi", email: "supply@masan.vn", trang_thai: "active" },
  { id: "DT004", ten: "Bureau Veritas Vietnam", loai: "Tổ chức chứng nhận", quoc_gia: "Pháp", lien_he: "Jean-Paul Martin", email: "vn@bureauveritas.com", trang_thai: "active" },
  { id: "DT005", ten: "SGS Vietnam", loai: "Tổ chức kiểm định", quoc_gia: "Thụy Sỹ", lien_he: "Lê Thị Thu Hà", email: "info@sgs.com.vn", trang_thai: "active" },
  { id: "DT006", ten: "Giao Hàng Nhanh (GHN)", loai: "Logistics", quoc_gia: "Việt Nam", lien_he: "Phạm Hùng", email: "b2b@ghn.vn", trang_thai: "active" },
  { id: "DT007", ten: "Shopee Vietnam", loai: "Thương mại điện tử", quoc_gia: "Singapore", lien_he: "Vũ Minh Tú", email: "seller@shopee.vn", trang_thai: "active" },
  { id: "DT008", ten: "FPT Software", loai: "Công nghệ thông tin", quoc_gia: "Việt Nam", lien_he: "Hoàng Đức Vinh", email: "partner@fpt.com.vn", trang_thai: "active" },
  { id: "DT009", ten: "Intertek Vietnam", loai: "Tổ chức kiểm định", quoc_gia: "Anh", lien_he: "David Nguyen", email: "vietnam@intertek.com", trang_thai: "active" },
  { id: "DT010", ten: "Lazada Vietnam", loai: "Thương mại điện tử", quoc_gia: "Đức", lien_he: "Ngô Thị Kim Anh", email: "seller@lazada.vn", trang_thai: "inactive" },
  { id: "DT011", ten: "Vinamilk", loai: "Doanh nghiệp thực phẩm", quoc_gia: "Việt Nam", lien_he: "Đặng Thu Hương", email: "supply@vinamilk.com.vn", trang_thai: "active" },
  { id: "DT012", ten: "KPMG Vietnam", loai: "Kiểm toán & tư vấn", quoc_gia: "Hà Lan", lien_he: "Nguyễn Bá Long", email: "vn@kpmg.com", trang_thai: "active" },
  { id: "DT013", ten: "ITC – International Trade Centre", loai: "Tổ chức quốc tế", quoc_gia: "Thụy Sỹ", lien_he: "Sophie Bernard", email: "vietnam@intracen.org", trang_thai: "active" },
  { id: "DT014", ten: "Tổng công ty Bưu điện Việt Nam (VNPost)", loai: "Logistics", quoc_gia: "Việt Nam", lien_he: "Trịnh Công Hùng", email: "partner@vnpost.vn", trang_thai: "inactive" },
];

const loaiColors: Record<string, "success" | "info" | "warning" | "neutral"> = {
  "Tổ chức tiêu chuẩn": "success",
  "Nhà bán lẻ": "info",
  "Doanh nghiệp thực phẩm": "warning",
  "Tổ chức chứng nhận": "success",
  "Tổ chức kiểm định": "neutral",
  "Logistics": "info",
  "Thương mại điện tử": "warning",
  "Công nghệ thông tin": "info",
  "Kiểm toán & tư vấn": "neutral",
  "Tổ chức quốc tế": "success",
};

const columns = [
  { key: "id", label: "Mã", width: "80px" },
  { key: "ten", label: "Tên đối tác" },
  {
    key: "loai",
    label: "Loại đối tác",
    width: "170px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={loaiColors[row.loai as string] ?? "neutral"}>{row.loai as string}</Badge>
    ),
  },
  { key: "quoc_gia", label: "Quốc gia", width: "110px" },
  { key: "lien_he", label: "Liên hệ", width: "150px" },
  { key: "email", label: "Email" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    width: "130px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Hoạt động" : "Ngừng hợp tác"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Đối tác"
      subtitle="Quản lý thông tin đối tác trong và ngoài nước của hệ thống"
      stats={[
        { label: "Tổng đối tác", value: data.length, variant: "info" },
        { label: "Đang hợp tác", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Ngừng hợp tác", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
        { label: "Đối tác quốc tế", value: data.filter((d) => d.quoc_gia !== "Việt Nam").length, variant: "info" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten", "loai", "quoc_gia", "lien_he", "email"]}
      addLabel="Thêm đối tác"
    />
  );
}
