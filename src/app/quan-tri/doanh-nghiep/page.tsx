"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "DN001", ten: "Công ty CP Vĩnh Hoàn", ma_so_thue: "1400105000", loai_hinh: "Cổ phần", tinh_thanh: "Đồng Tháp", nguoi_dai_dien: "Nguyễn Ngô Thị Tuyết Nhung", trang_thai: "active" },
  { id: "DN002", ten: "Cty TNHH Thủy sản Minh Phú", ma_so_thue: "8001200089", loai_hinh: "TNHH", tinh_thanh: "Cà Mau", nguoi_dai_dien: "Lê Văn Quang", trang_thai: "active" },
  { id: "DN003", ten: "HTX Nông nghiệp Sóc Trăng", ma_so_thue: "2200334512", loai_hinh: "HTX", tinh_thanh: "Sóc Trăng", nguoi_dai_dien: "Trần Hữu Phước", trang_thai: "active" },
  { id: "DN004", ten: "Cty CP Cà phê Lâm Đồng", ma_so_thue: "5800198723", loai_hinh: "Cổ phần", tinh_thanh: "Lâm Đồng", nguoi_dai_dien: "Võ Minh Khoa", trang_thai: "active" },
  { id: "DN005", ten: "Cty TNHH Nước mắm Hưng Thành", ma_so_thue: "1001887643", loai_hinh: "TNHH", tinh_thanh: "Kiên Giang", nguoi_dai_dien: "Hứa Thị Lan", trang_thai: "active" },
  { id: "DN006", ten: "HTX Bưởi da xanh Mỏ Cày", ma_so_thue: "1400876321", loai_hinh: "HTX", tinh_thanh: "Bến Tre", nguoi_dai_dien: "Nguyễn Thành Lợi", trang_thai: "active" },
  { id: "DN007", ten: "Cty CP Nước giải khát Bến Tre", ma_so_thue: "1400543210", loai_hinh: "Cổ phần", tinh_thanh: "Bến Tre", nguoi_dai_dien: "Phan Văn Tiến", trang_thai: "active" },
  { id: "DN008", ten: "Cty TNHH Điều vàng Bình Phước", ma_so_thue: "3702118765", loai_hinh: "TNHH", tinh_thanh: "Bình Phước", nguoi_dai_dien: "Đỗ Thế Hùng", trang_thai: "active" },
  { id: "DN009", ten: "HTX Ong mật Kon Tum", ma_so_thue: "6000234198", loai_hinh: "HTX", tinh_thanh: "Kon Tum", nguoi_dai_dien: "Y Tuân Niê", trang_thai: "active" },
  { id: "DN010", ten: "Cty CP Chè Lâm Đồng", ma_so_thue: "5800376412", loai_hinh: "Cổ phần", tinh_thanh: "Lâm Đồng", nguoi_dai_dien: "Bùi Thị Hoa", trang_thai: "inactive" },
  { id: "DN011", ten: "HTX Vải thiều Bắc Giang", ma_so_thue: "2400912345", loai_hinh: "HTX", tinh_thanh: "Bắc Giang", nguoi_dai_dien: "Lương Văn Dũng", trang_thai: "active" },
  { id: "DN012", ten: "Cty TNHH Hải sản Đại Dương", ma_so_thue: "1801234567", loai_hinh: "TNHH", tinh_thanh: "Bình Thuận", nguoi_dai_dien: "Trần Thái Bình", trang_thai: "active" },
  { id: "DN013", ten: "Sabeco – Chi nhánh HCM", ma_so_thue: "0300582937", loai_hinh: "Cổ phần", tinh_thanh: "TP. Hồ Chí Minh", nguoi_dai_dien: "Nguyễn Thị Lan Anh", trang_thai: "active" },
  { id: "DN014", ten: "Cty CP Sữa Mộc Châu", ma_so_thue: "2600345678", loai_hinh: "Cổ phần", tinh_thanh: "Sơn La", nguoi_dai_dien: "Phạm Hải Long", trang_thai: "active" },
  { id: "DN015", ten: "HTX Hồ tiêu Gia Lai", ma_so_thue: "5901234501", loai_hinh: "HTX", tinh_thanh: "Gia Lai", nguoi_dai_dien: "Ksor Nay", trang_thai: "inactive" },
];

const loaiColors: Record<string, "success" | "info" | "warning"> = {
  "Cổ phần": "success",
  "TNHH": "info",
  "HTX": "warning",
};

const columns = [
  { key: "id", label: "Mã", width: "80px" },
  { key: "ten", label: "Tên doanh nghiệp" },
  { key: "ma_so_thue", label: "Mã số thuế", width: "130px" },
  {
    key: "loai_hinh",
    label: "Loại hình",
    width: "110px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={loaiColors[row.loai_hinh as string] ?? "neutral"}>{row.loai_hinh as string}</Badge>
    ),
  },
  { key: "tinh_thanh", label: "Tỉnh/Thành", width: "140px" },
  { key: "nguoi_dai_dien", label: "Người đại diện" },
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
      title="Doanh nghiệp"
      subtitle="Quản lý thông tin doanh nghiệp tham gia hệ thống truy xuất nguồn gốc"
      stats={[
        { label: "Tổng doanh nghiệp", value: data.length, variant: "info" },
        { label: "Đang hoạt động", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Ngừng hoạt động", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
        { label: "HTX", value: data.filter((d) => d.loai_hinh === "HTX").length, variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten", "ma_so_thue", "tinh_thanh", "nguoi_dai_dien"]}
      addLabel="Thêm doanh nghiệp"
    />
  );
}
