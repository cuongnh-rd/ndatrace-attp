"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { doanh_nghiep: "Cty CP Vĩnh Hoàn", loai_hinh: "Cổ phần", tinh_thanh: "Đồng Tháp", so_san_pham: 38, tong_uid: 421800, chung_chi: 5, trang_thai: "active" },
  { doanh_nghiep: "Cty TNHH Thủy sản Minh Phú", loai_hinh: "TNHH", tinh_thanh: "Cà Mau", so_san_pham: 24, tong_uid: 312500, chung_chi: 4, trang_thai: "active" },
  { doanh_nghiep: "HTX Nông nghiệp Sóc Trăng", loai_hinh: "HTX", tinh_thanh: "Sóc Trăng", so_san_pham: 12, tong_uid: 98400, chung_chi: 2, trang_thai: "active" },
  { doanh_nghiep: "Sabeco - Chi nhánh HCM", loai_hinh: "Cổ phần", tinh_thanh: "TP. Hồ Chí Minh", so_san_pham: 15, tong_uid: 870000, chung_chi: 3, trang_thai: "active" },
  { doanh_nghiep: "Cty CP Sữa Mộc Châu", loai_hinh: "Cổ phần", tinh_thanh: "Sơn La", so_san_pham: 21, tong_uid: 560000, chung_chi: 4, trang_thai: "active" },
  { doanh_nghiep: "Cty CP Cà phê Lâm Đồng", loai_hinh: "Cổ phần", tinh_thanh: "Lâm Đồng", so_san_pham: 9, tong_uid: 74200, chung_chi: 3, trang_thai: "active" },
  { doanh_nghiep: "HTX Vải thiều Bắc Giang", loai_hinh: "HTX", tinh_thanh: "Bắc Giang", so_san_pham: 6, tong_uid: 51800, chung_chi: 2, trang_thai: "active" },
  { doanh_nghiep: "Cty TNHH Điều vàng Bình Phước", loai_hinh: "TNHH", tinh_thanh: "Bình Phước", so_san_pham: 8, tong_uid: 92000, chung_chi: 2, trang_thai: "active" },
  { doanh_nghiep: "Cty CP Đồ hộp Hạ Long", loai_hinh: "Cổ phần", tinh_thanh: "Quảng Ninh", so_san_pham: 17, tong_uid: 183000, chung_chi: 3, trang_thai: "active" },
  { doanh_nghiep: "HTX Bưởi da xanh Mỏ Cày", loai_hinh: "HTX", tinh_thanh: "Bến Tre", so_san_pham: 4, tong_uid: 42300, chung_chi: 2, trang_thai: "active" },
  { doanh_nghiep: "Cty TNHH Nhập khẩu Thực phẩm Á Châu", loai_hinh: "TNHH", tinh_thanh: "TP. Hồ Chí Minh", so_san_pham: 32, tong_uid: 219000, chung_chi: 5, trang_thai: "active" },
  { doanh_nghiep: "Cty CP Nước giải khát Bến Tre", loai_hinh: "Cổ phần", tinh_thanh: "Bến Tre", so_san_pham: 11, tong_uid: 384000, chung_chi: 2, trang_thai: "active" },
  { doanh_nghiep: "HTX Hồ tiêu Gia Lai", loai_hinh: "HTX", tinh_thanh: "Gia Lai", so_san_pham: 5, tong_uid: 18700, chung_chi: 1, trang_thai: "inactive" },
  { doanh_nghiep: "Cty TNHH Hải sản Đại Dương", loai_hinh: "TNHH", tinh_thanh: "Bình Thuận", so_san_pham: 13, tong_uid: 67400, chung_chi: 2, trang_thai: "active" },
  { doanh_nghiep: "HTX Ong mật Kon Tum", loai_hinh: "HTX", tinh_thanh: "Kon Tum", so_san_pham: 3, tong_uid: 9800, chung_chi: 1, trang_thai: "active" },
];

const loaiHinhMap: Record<string, "success" | "info" | "warning" | "neutral"> = {
  "Cổ phần": "info",
  "TNHH": "warning",
  "HTX": "success",
  "Tư nhân": "neutral",
};

const columns = [
  { key: "doanh_nghiep", label: "Doanh nghiệp" },
  {
    key: "loai_hinh",
    label: "Loại hình",
    render: (row: Record<string, unknown>) => (
      <Badge variant={loaiHinhMap[row.loai_hinh as string] ?? "neutral"}>{row.loai_hinh as string}</Badge>
    ),
  },
  { key: "tinh_thanh", label: "Tỉnh/Thành" },
  {
    key: "so_san_pham",
    label: "Số sản phẩm",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono">{(row.so_san_pham as number).toLocaleString()}</span>
    ),
  },
  {
    key: "tong_uid",
    label: "Tổng UID",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono font-semibold">{(row.tong_uid as number).toLocaleString()}</span>
    ),
  },
  {
    key: "chung_chi",
    label: "Chứng chỉ",
    render: (row: Record<string, unknown>) => (
      <Badge variant={(row.chung_chi as number) >= 4 ? "success" : (row.chung_chi as number) >= 2 ? "info" : "neutral"}>
        {row.chung_chi as number}
      </Badge>
    ),
  },
  {
    key: "trang_thai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Hoạt động" : "Tạm dừng"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Thống kê doanh nghiệp"
      subtitle="Tổng hợp số liệu hoạt động truy xuất nguồn gốc theo từng doanh nghiệp"
      stats={[
        { label: "Tổng doanh nghiệp", value: data.length, variant: "info" },
        { label: "Đang hoạt động", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Tổng UID cấp", value: "4,404,900", variant: "info" },
        { label: "Tổng sản phẩm", value: data.reduce((s, d) => s + d.so_san_pham, 0), variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["doanh_nghiep", "loai_hinh", "tinh_thanh"]}
      addLabel="Thêm doanh nghiệp"
    />
  );
}
