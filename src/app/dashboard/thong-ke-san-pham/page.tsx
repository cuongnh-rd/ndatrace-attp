"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { san_pham: "Gạo ST25 hữu cơ", danh_muc: "Nông sản", doanh_nghiep: "HTX Nông nghiệp Sóc Trăng", tong_uid: 48200, su_kien: 312, chung_chi: 3, trang_thai: "active" },
  { san_pham: "Tôm sú đông lạnh", danh_muc: "Thủy sản", doanh_nghiep: "Cty TNHH Thủy sản Minh Phú", tong_uid: 120400, su_kien: 480, chung_chi: 4, trang_thai: "active" },
  { san_pham: "Cà phê Arabica Đà Lạt", danh_muc: "Nông sản", doanh_nghiep: "Cty CP Cà phê Lâm Đồng", tong_uid: 31800, su_kien: 218, chung_chi: 3, trang_thai: "active" },
  { san_pham: "Nước mắm Phú Quốc 40 độ đạm", danh_muc: "Thực phẩm", doanh_nghiep: "Cty TNHH Nước mắm Hưng Thành", tong_uid: 75000, su_kien: 354, chung_chi: 2, trang_thai: "active" },
  { san_pham: "Xoài cát Hòa Lộc", danh_muc: "Nông sản", doanh_nghiep: "HTX Cây ăn quả Cái Bè", tong_uid: 28500, su_kien: 167, chung_chi: 2, trang_thai: "active" },
  { san_pham: "Cá tra phi-lê đông lạnh", danh_muc: "Thủy sản", doanh_nghiep: "Cty CP Vĩnh Hoàn", tong_uid: 95600, su_kien: 512, chung_chi: 5, trang_thai: "active" },
  { san_pham: "Nước dừa tươi đóng lon", danh_muc: "Đồ uống", doanh_nghiep: "Cty CP Nước giải khát Bến Tre", tong_uid: 210000, su_kien: 690, chung_chi: 2, trang_thai: "active" },
  { san_pham: "Hạt điều rang muối", danh_muc: "Thực phẩm", doanh_nghiep: "Cty TNHH Điều vàng Bình Phước", tong_uid: 42000, su_kien: 234, chung_chi: 2, trang_thai: "active" },
  { san_pham: "Trà ô long cao nguyên", danh_muc: "Đồ uống", doanh_nghiep: "Cty CP Chè Lâm Đồng", tong_uid: 18700, su_kien: 98, chung_chi: 1, trang_thai: "inactive" },
  { san_pham: "Bưởi da xanh Bến Tre", danh_muc: "Nông sản", doanh_nghiep: "HTX Bưởi da xanh Mỏ Cày", tong_uid: 35400, su_kien: 204, chung_chi: 2, trang_thai: "active" },
  { san_pham: "Sữa tươi thanh trùng", danh_muc: "Thực phẩm", doanh_nghiep: "Cty CP Sữa Mộc Châu", tong_uid: 380000, su_kien: 1240, chung_chi: 4, trang_thai: "active" },
  { san_pham: "Mật ong rừng Tây Nguyên", danh_muc: "Thực phẩm", doanh_nghiep: "HTX Ong mật Kon Tum", tong_uid: 9800, su_kien: 72, chung_chi: 1, trang_thai: "active" },
  { san_pham: "Tiêu đen Chư Sê", danh_muc: "Nông sản", doanh_nghiep: "HTX Hồ tiêu Gia Lai", tong_uid: 12400, su_kien: 89, chung_chi: 1, trang_thai: "inactive" },
  { san_pham: "Cá ngừ đại dương đóng hộp", danh_muc: "Thủy sản", doanh_nghiep: "Cty CP Đồ hộp Hạ Long", tong_uid: 89000, su_kien: 378, chung_chi: 3, trang_thai: "active" },
  { san_pham: "Vải thiều Lục Ngạn", danh_muc: "Nông sản", doanh_nghiep: "HTX Vải thiều Bắc Giang", tong_uid: 41200, su_kien: 228, chung_chi: 2, trang_thai: "active" },
];

const danhMucMap: Record<string, "success" | "info" | "warning" | "neutral"> = {
  "Nông sản": "success",
  "Thủy sản": "info",
  "Thực phẩm": "warning",
  "Đồ uống": "neutral",
};

const columns = [
  { key: "san_pham", label: "Sản phẩm" },
  {
    key: "danh_muc",
    label: "Danh mục",
    render: (row: Record<string, unknown>) => (
      <Badge variant={danhMucMap[row.danh_muc as string] ?? "neutral"}>{row.danh_muc as string}</Badge>
    ),
  },
  { key: "doanh_nghiep", label: "Doanh nghiệp" },
  {
    key: "tong_uid",
    label: "Tổng UID",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono font-semibold">{(row.tong_uid as number).toLocaleString()}</span>
    ),
  },
  {
    key: "su_kien",
    label: "Sự kiện",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono">{(row.su_kien as number).toLocaleString()}</span>
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
        {row.trang_thai === "active" ? "Đang kinh doanh" : "Ngừng kinh doanh"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Thống kê sản phẩm"
      subtitle="Tổng hợp chỉ số hoạt động truy xuất nguồn gốc theo từng sản phẩm"
      stats={[
        { label: "Tổng sản phẩm", value: data.length, variant: "info" },
        { label: "Đang kinh doanh", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Tổng UID cấp", value: "1,237,200", variant: "info" },
        { label: "Tổng sự kiện", value: "6,276", variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["san_pham", "danh_muc", "doanh_nghiep"]}
      addLabel="Thêm sản phẩm"
    />
  );
}
