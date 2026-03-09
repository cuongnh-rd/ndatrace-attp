"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "BBN001", ten: "Bộ Nông nghiệp và Phát triển Nông thôn", viet_tat: "MARD", dia_chi: "2 Ngọc Hà, Ba Đình, Hà Nội", so_dien_thoai: "024 3845 4026", trang_thai: "active" },
  { id: "BBN002", ten: "Bộ Công Thương", viet_tat: "MOIT", dia_chi: "54 Hai Bà Trưng, Hoàn Kiếm, Hà Nội", so_dien_thoai: "024 2220 2222", trang_thai: "active" },
  { id: "BBN003", ten: "Bộ Khoa học và Công nghệ", viet_tat: "MOST", dia_chi: "113 Trần Duy Hưng, Cầu Giấy, Hà Nội", so_dien_thoai: "024 3943 9731", trang_thai: "active" },
  { id: "BBN004", ten: "Bộ Y tế", viet_tat: "MOH", dia_chi: "138A Giảng Võ, Ba Đình, Hà Nội", so_dien_thoai: "024 6273 2273", trang_thai: "active" },
  { id: "BBN005", ten: "Bộ Tài nguyên và Môi trường", viet_tat: "MONRE", dia_chi: "10 Tôn Thất Thuyết, Nam Từ Liêm, Hà Nội", so_dien_thoai: "024 3795 0359", trang_thai: "active" },
  { id: "BBN006", ten: "Bộ Thông tin và Truyền thông", viet_tat: "MIC", dia_chi: "18 Nguyễn Du, Hai Bà Trưng, Hà Nội", so_dien_thoai: "024 3944 0000", trang_thai: "active" },
  { id: "BBN007", ten: "Cục An toàn thực phẩm", viet_tat: "VFA", dia_chi: "135/3 Núi Trúc, Ba Đình, Hà Nội", so_dien_thoai: "024 3846 7715", trang_thai: "active" },
  { id: "BBN008", ten: "Tổng cục Tiêu chuẩn Đo lường Chất lượng", viet_tat: "STAMEQ", dia_chi: "8 Hoàng Quốc Việt, Cầu Giấy, Hà Nội", so_dien_thoai: "024 3791 5866", trang_thai: "active" },
  { id: "BBN009", ten: "Cục Quản lý Chất lượng Nông Lâm sản và Thủy sản", viet_tat: "NAFIQAD", dia_chi: "10 Nguyễn Công Hoan, Ba Đình, Hà Nội", so_dien_thoai: "024 3771 7925", trang_thai: "active" },
  { id: "BBN010", ten: "Cục Thú y", viet_tat: "DAH", dia_chi: "15–17 Đường Ngọc Hồi, Hoàng Mai, Hà Nội", so_dien_thoai: "024 3869 1082", trang_thai: "active" },
  { id: "BBN011", ten: "Cục Bảo vệ Thực vật", viet_tat: "PPD", dia_chi: "149 Hồ Đắc Di, Đống Đa, Hà Nội", so_dien_thoai: "024 3533 0738", trang_thai: "active" },
  { id: "BBN012", ten: "Tổng cục Hải quan", viet_tat: "GDC", dia_chi: "162 Nguyễn Văn Cừ, Long Biên, Hà Nội", so_dien_thoai: "024 3872 0960", trang_thai: "active" },
  { id: "BBN013", ten: "Sở Nông nghiệp TP. Hồ Chí Minh", viet_tat: "SNNHCM", dia_chi: "59 Trần Quốc Toản, Q.3, TP. HCM", so_dien_thoai: "028 3930 5395", trang_thai: "active" },
  { id: "BBN014", ten: "Sở Công Thương TP. Cần Thơ", viet_tat: "SCTCT", dia_chi: "2 Hòa Bình, Ninh Kiều, Cần Thơ", so_dien_thoai: "0292 3820 045", trang_thai: "inactive" },
  { id: "BBN015", ten: "Sở Nông nghiệp tỉnh An Giang", viet_tat: "SNNAG", dia_chi: "27 Nguyễn Huệ, TP. Long Xuyên, An Giang", so_dien_thoai: "0296 3852 988", trang_thai: "active" },
];

const columns = [
  { key: "id", label: "Mã", width: "90px" },
  { key: "ten", label: "Tên bộ ban ngành" },
  { key: "viet_tat", label: "Viết tắt", width: "100px" },
  { key: "dia_chi", label: "Địa chỉ" },
  { key: "so_dien_thoai", label: "Số điện thoại", width: "150px" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    width: "130px",
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
      title="Bộ ban ngành"
      subtitle="Quản lý danh sách bộ, ban, ngành và cơ quan quản lý nhà nước liên quan"
      stats={[
        { label: "Tổng đơn vị", value: data.length, variant: "info" },
        { label: "Đang hoạt động", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Ngừng hoạt động", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten", "viet_tat", "dia_chi"]}
      addLabel="Thêm bộ ban ngành"
    />
  );
}
