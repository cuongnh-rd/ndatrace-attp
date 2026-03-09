"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "NNH001", ten_nhom: "Nông sản tươi sống", danh_muc_cha: "Nông sản", so_san_pham: 1842, trang_thai: "active" },
  { id: "NNH002", ten_nhom: "Rau củ quả", danh_muc_cha: "Nông sản tươi sống", so_san_pham: 634, trang_thai: "active" },
  { id: "NNH003", ten_nhom: "Trái cây nhiệt đới", danh_muc_cha: "Nông sản tươi sống", so_san_pham: 487, trang_thai: "active" },
  { id: "NNH004", ten_nhom: "Cây lương thực & Hạt ngũ cốc", danh_muc_cha: "Nông sản tươi sống", so_san_pham: 312, trang_thai: "active" },
  { id: "NNH005", ten_nhom: "Cây công nghiệp", danh_muc_cha: "Nông sản", so_san_pham: 278, trang_thai: "active" },
  { id: "NNH006", ten_nhom: "Thủy sản nuôi trồng", danh_muc_cha: "Thủy sản", so_san_pham: 723, trang_thai: "active" },
  { id: "NNH007", ten_nhom: "Thủy sản đánh bắt", danh_muc_cha: "Thủy sản", so_san_pham: 412, trang_thai: "active" },
  { id: "NNH008", ten_nhom: "Thủy sản chế biến", danh_muc_cha: "Thủy sản", so_san_pham: 298, trang_thai: "active" },
  { id: "NNH009", ten_nhom: "Thực phẩm chế biến", danh_muc_cha: "Thực phẩm", so_san_pham: 956, trang_thai: "active" },
  { id: "NNH010", ten_nhom: "Đồ uống không cồn", danh_muc_cha: "Đồ uống", so_san_pham: 345, trang_thai: "active" },
  { id: "NNH011", ten_nhom: "Đồ uống có cồn", danh_muc_cha: "Đồ uống", so_san_pham: 187, trang_thai: "active" },
  { id: "NNH012", ten_nhom: "Gia vị và Nước chấm", danh_muc_cha: "Thực phẩm chế biến", so_san_pham: 241, trang_thai: "active" },
  { id: "NNH013", ten_nhom: "Sản phẩm từ sữa", danh_muc_cha: "Thực phẩm", so_san_pham: 189, trang_thai: "active" },
  { id: "NNH014", ten_nhom: "Dược liệu & Thảo mộc", danh_muc_cha: "Dược phẩm", so_san_pham: 134, trang_thai: "active" },
  { id: "NNH015", ten_nhom: "Sản phẩm hữu cơ chứng nhận", danh_muc_cha: "(Liên ngành)", so_san_pham: 98, trang_thai: "inactive" },
];

const columns = [
  { key: "id", label: "Mã", width: "90px" },
  { key: "ten_nhom", label: "Tên nhóm ngành hàng" },
  { key: "danh_muc_cha", label: "Danh mục cha" },
  {
    key: "so_san_pham",
    label: "Số sản phẩm",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono font-semibold">{(row.so_san_pham as number).toLocaleString()}</span>
    ),
  },
  {
    key: "trang_thai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Đang dùng" : "Tạm dừng"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Nhóm ngành hàng (Quản trị)"
      subtitle="Phân loại nhóm ngành hàng và danh mục sản phẩm trong hệ thống truy xuất"
      stats={[
        { label: "Tổng nhóm", value: data.length, variant: "info" },
        { label: "Đang sử dụng", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Tạm dừng", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
        { label: "Tổng sản phẩm", value: "7,136", variant: "info" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten_nhom", "danh_muc_cha"]}
      addLabel="Thêm nhóm"
    />
  );
}
