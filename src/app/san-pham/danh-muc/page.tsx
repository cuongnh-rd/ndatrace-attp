"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const categories = [
  { id: 1, name: "Thực phẩm", code: "TA", productCount: 156, parent: null, level: 1 },
  { id: 2, name: "Thực phẩm chế biến", code: "TA-01", productCount: 45, parent: "Thực phẩm", level: 2 },
  { id: 3, name: "Thực phẩm tươi sống", code: "TA-02", productCount: 38, parent: "Thực phẩm", level: 2 },
  { id: 4, name: "Thực phẩm đóng gói", code: "TA-03", productCount: 42, parent: "Thực phẩm", level: 2 },
  { id: 5, name: "Thức ăn gia súc", code: "TA-04", productCount: 31, parent: "Thực phẩm", level: 2 },
  { id: 6, name: "Đồ uống", code: "DB", productCount: 89, parent: null, level: 1 },
  { id: 7, name: "Đồ uống có cồn", code: "DB-01", productCount: 34, parent: "Đồ uống", level: 2 },
  { id: 8, name: "Đồ uống không cồn", code: "DB-02", productCount: 55, parent: "Đồ uống", level: 2 },
  { id: 9, name: "Hóa phẩm gia dụng", code: "HH", productCount: 67, parent: null, level: 1 },
  { id: 10, name: "Hóa chất tẩy rửa", code: "HH-01", productCount: 28, parent: "Hóa phẩm gia dụng", level: 2 },
  { id: 11, name: "Hóa chất bảo quản", code: "HH-02", productCount: 22, parent: "Hóa phẩm gia dụng", level: 2 },
  { id: 12, name: "Hóa chất nông nghiệp", code: "HH-03", productCount: 17, parent: "Hóa phẩm gia dụng", level: 2 },
  { id: 13, name: "Dược phẩm", code: "DP", productCount: 123, parent: null, level: 1 },
  { id: 14, name: "Thuốc kê đơn", code: "DP-01", productCount: 56, parent: "Dược phẩm", level: 2 },
  { id: 15, name: "Thuốc không kê đơn", code: "DP-02", productCount: 47, parent: "Dược phẩm", level: 2 },
  { id: 16, name: "Vật tư y tế", code: "DP-03", productCount: 20, parent: "Dược phẩm", level: 2 },
];

const columns = [
  { key: "code", label: "Mã", width: "100px" },
  { key: "name", label: "Tên danh mục" },
  { key: "level", label: "Cấp độ", render: (row: Record<string, unknown>) => {
    const level = row.level as number;
    const variant = level === 1 ? "success" : "info";
    const label = level === 1 ? "Cấp 1" : "Cấp 2";
    return <Badge variant={variant}>{label}</Badge>;
  }},
  { key: "parent", label: "Danh mục cha" },
  { key: "productCount", label: "Số sản phẩm", width: "120px" },
];

export default function Page() {
  return (
    <SectionPage
      title="Danh mục sản phẩm"
      subtitle="Quản lý danh mục và phân loại sản phẩm"
      stats={[
        { label: "Tổng danh mục", value: categories.length, variant: "info" },
        { label: "Cấp 1", value: categories.filter((c) => c.level === 1).length, variant: "success" },
        { label: "Cấp 2", value: categories.filter((c) => c.level === 2).length, variant: "info" },
        { label: "Tổng sản phẩm", value: categories.reduce((sum, c) => sum + c.productCount, 0), variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={categories}
      searchKeys={["name", "code"]}
      addLabel="Thêm danh mục"
    />
  );
}
