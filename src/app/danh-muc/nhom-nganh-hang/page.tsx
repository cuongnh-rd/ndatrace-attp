"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "NNH001", ten_nhom: "Nông sản", danh_muc_cha: "(Gốc)", mo_ta: "Các loại nông sản trồng trọt và thu hoạch từ đất", so_san_pham: 124, trang_thai: "active" },
  { id: "NNH002", ten_nhom: "Thủy sản", danh_muc_cha: "(Gốc)", mo_ta: "Sản phẩm từ đánh bắt và nuôi trồng thủy hải sản", so_san_pham: 98, trang_thai: "active" },
  { id: "NNH003", ten_nhom: "Thực phẩm chế biến", danh_muc_cha: "(Gốc)", mo_ta: "Các sản phẩm thực phẩm qua chế biến công nghiệp", so_san_pham: 87, trang_thai: "active" },
  { id: "NNH004", ten_nhom: "Đồ uống", danh_muc_cha: "(Gốc)", mo_ta: "Nước giải khát, đồ uống có cồn và không cồn", so_san_pham: 54, trang_thai: "active" },
  { id: "NNH005", ten_nhom: "Lúa gạo", danh_muc_cha: "Nông sản", mo_ta: "Các giống lúa và sản phẩm gạo các loại", so_san_pham: 38, trang_thai: "active" },
  { id: "NNH006", ten_nhom: "Cây ăn quả", danh_muc_cha: "Nông sản", mo_ta: "Trái cây nhiệt đới và ôn đới trồng trong nước", so_san_pham: 52, trang_thai: "active" },
  { id: "NNH007", ten_nhom: "Rau củ quả", danh_muc_cha: "Nông sản", mo_ta: "Các loại rau xanh, củ và quả thực phẩm", so_san_pham: 34, trang_thai: "active" },
  { id: "NNH008", ten_nhom: "Cây công nghiệp", danh_muc_cha: "Nông sản", mo_ta: "Cà phê, hồ tiêu, điều, cao su và các cây công nghiệp", so_san_pham: 29, trang_thai: "active" },
  { id: "NNH009", ten_nhom: "Cá nước ngọt", danh_muc_cha: "Thủy sản", mo_ta: "Cá tra, cá basa, cá rô phi và thủy sản nước ngọt", so_san_pham: 41, trang_thai: "active" },
  { id: "NNH010", ten_nhom: "Hải sản", danh_muc_cha: "Thủy sản", mo_ta: "Tôm, cua, mực và các loại hải sản biển", so_san_pham: 57, trang_thai: "active" },
  { id: "NNH011", ten_nhom: "Sản phẩm từ sữa", danh_muc_cha: "Thực phẩm chế biến", mo_ta: "Sữa tươi, sữa bột, phô mai, yaourt và các sản phẩm từ sữa", so_san_pham: 22, trang_thai: "active" },
  { id: "NNH012", ten_nhom: "Đồ hộp và đóng gói", danh_muc_cha: "Thực phẩm chế biến", mo_ta: "Thực phẩm đóng hộp, chân không và bao bì kín", so_san_pham: 35, trang_thai: "active" },
  { id: "NNH013", ten_nhom: "Nước giải khát", danh_muc_cha: "Đồ uống", mo_ta: "Nước ngọt, nước ép trái cây và đồ uống không cồn", so_san_pham: 31, trang_thai: "active" },
  { id: "NNH014", ten_nhom: "Bia và rượu", danh_muc_cha: "Đồ uống", mo_ta: "Các sản phẩm bia, rượu và đồ uống có cồn", so_san_pham: 23, trang_thai: "inactive" },
];

const columns = [
  { key: "id", label: "Mã", width: "90px" },
  { key: "ten_nhom", label: "Tên nhóm" },
  { key: "danh_muc_cha", label: "Danh mục cha", width: "160px" },
  { key: "mo_ta", label: "Mô tả" },
  {
    key: "so_san_pham",
    label: "Số sản phẩm",
    width: "110px",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono font-semibold">{row.so_san_pham as number}</span>
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
      title="Nhóm ngành hàng"
      subtitle="Quản lý phân loại nhóm ngành hàng và danh mục sản phẩm trong hệ thống"
      stats={[
        { label: "Tổng nhóm", value: data.length, variant: "info" },
        { label: "Nhóm gốc", value: data.filter((d) => d.danh_muc_cha === "(Gốc)").length, variant: "success" },
        { label: "Nhóm con", value: data.filter((d) => d.danh_muc_cha !== "(Gốc)").length, variant: "info" },
        { label: "Tổng sản phẩm", value: data.reduce((s, d) => s + d.so_san_pham, 0), variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten_nhom", "danh_muc_cha", "mo_ta"]}
      addLabel="Thêm nhóm ngành hàng"
    />
  );
}
