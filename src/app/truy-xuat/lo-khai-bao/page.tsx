"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "LKB001", san_pham: "Gạo ST25 hữu cơ", doanh_nghiep: "HTX Nông nghiệp Sóc Trăng", so_luong: 5000, don_vi: "kg", ngay_khai_bao: "2026-01-05", trang_thai: "approved" },
  { id: "LKB002", san_pham: "Tôm sú đông lạnh", doanh_nghiep: "Cty TNHH Thủy sản Minh Phú", so_luong: 2800, don_vi: "kg", ngay_khai_bao: "2026-01-08", trang_thai: "approved" },
  { id: "LKB003", san_pham: "Cà phê Arabica Đà Lạt", doanh_nghiep: "Cty CP Cà phê Lâm Đồng", so_luong: 1200, don_vi: "kg", ngay_khai_bao: "2026-01-10", trang_thai: "pending" },
  { id: "LKB004", san_pham: "Nước mắm Phú Quốc 40 độ đạm", doanh_nghiep: "Cty TNHH Nước mắm Hưng Thành", so_luong: 8000, don_vi: "chai", ngay_khai_bao: "2026-01-12", trang_thai: "approved" },
  { id: "LKB005", san_pham: "Xoài cát Hòa Lộc", doanh_nghiep: "HTX Cây ăn quả Cái Bè", so_luong: 3500, don_vi: "kg", ngay_khai_bao: "2026-01-15", trang_thai: "approved" },
  { id: "LKB006", san_pham: "Hạt điều rang muối", doanh_nghiep: "Cty TNHH Điều vàng Bình Phước", so_luong: 900, don_vi: "túi", ngay_khai_bao: "2026-01-18", trang_thai: "rejected" },
  { id: "LKB007", san_pham: "Bưởi da xanh Bến Tre", doanh_nghiep: "HTX Bưởi da xanh Mỏ Cày", so_luong: 4200, don_vi: "quả", ngay_khai_bao: "2026-01-20", trang_thai: "approved" },
  { id: "LKB008", san_pham: "Cá tra phi-lê đông lạnh", doanh_nghiep: "Cty CP Vĩnh Hoàn", so_luong: 6500, don_vi: "kg", ngay_khai_bao: "2026-01-22", trang_thai: "pending" },
  { id: "LKB009", san_pham: "Mật ong rừng Tây Nguyên", doanh_nghiep: "HTX Ong mật Kon Tum", so_luong: 500, don_vi: "lọ", ngay_khai_bao: "2026-01-25", trang_thai: "approved" },
  { id: "LKB010", san_pham: "Tiêu đen Chư Sê", doanh_nghiep: "HTX Hồ tiêu Gia Lai", so_luong: 750, don_vi: "kg", ngay_khai_bao: "2026-01-28", trang_thai: "pending" },
  { id: "LKB011", san_pham: "Vải thiều Lục Ngạn", doanh_nghiep: "HTX Vải thiều Bắc Giang", so_luong: 9800, don_vi: "kg", ngay_khai_bao: "2026-02-01", trang_thai: "approved" },
  { id: "LKB012", san_pham: "Nhãn lồng Hưng Yên", doanh_nghiep: "HTX Nhãn lồng Phố Hiến", so_luong: 3100, don_vi: "kg", ngay_khai_bao: "2026-02-05", trang_thai: "approved" },
  { id: "LKB013", san_pham: "Cua biển Cà Mau", doanh_nghiep: "Cty TNHH Thủy hải sản Năm Căn", so_luong: 1400, don_vi: "con", ngay_khai_bao: "2026-02-08", trang_thai: "rejected" },
  { id: "LKB014", san_pham: "Trà ô long cao nguyên", doanh_nghiep: "Cty CP Chè Lâm Đồng", so_luong: 2200, don_vi: "hộp", ngay_khai_bao: "2026-02-10", trang_thai: "approved" },
  { id: "LKB015", san_pham: "Mực khô Bình Thuận", doanh_nghiep: "Cty TNHH Hải sản Đại Dương", so_luong: 680, don_vi: "kg", ngay_khai_bao: "2026-02-12", trang_thai: "pending" },
];

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "neutral" }> = {
  approved: { label: "Đã duyệt", variant: "success" },
  pending: { label: "Chờ duyệt", variant: "warning" },
  rejected: { label: "Từ chối", variant: "danger" },
};

const columns = [
  { key: "id", label: "Mã lô", width: "100px" },
  { key: "san_pham", label: "Sản phẩm" },
  { key: "doanh_nghiep", label: "Doanh nghiệp" },
  {
    key: "so_luong",
    label: "Số lượng",
    width: "110px",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono">{(row.so_luong as number).toLocaleString()} {row.don_vi as string}</span>
    ),
  },
  { key: "ngay_khai_bao", label: "Ngày khai báo", width: "140px" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    width: "130px",
    render: (row: Record<string, unknown>) => {
      const s = statusMap[row.trang_thai as string];
      return <Badge variant={s.variant}>{s.label}</Badge>;
    },
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Quản lý lô khai báo"
      subtitle="Quản lý và theo dõi các lô hàng đã khai báo trong hệ thống truy xuất nguồn gốc"
      stats={[
        { label: "Tổng lô khai báo", value: data.length, variant: "info" },
        { label: "Đã duyệt", value: data.filter((d) => d.trang_thai === "approved").length, variant: "success" },
        { label: "Chờ duyệt", value: data.filter((d) => d.trang_thai === "pending").length, variant: "warning" },
        { label: "Từ chối", value: data.filter((d) => d.trang_thai === "rejected").length, variant: "danger" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "san_pham", "doanh_nghiep"]}
      addLabel="Thêm lô khai báo"
    />
  );
}
