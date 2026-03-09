export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    children: [
      { label: "Tổng quan", href: "/dashboard" },
      { label: "Chỉ số hoạt động", href: "/dashboard/chi-so" },
      { label: "Cảnh báo", href: "/dashboard/canh-bao" },
    ],
  },
  {
    label: "Truy xuất nguồn gốc",
    href: "/truy-xuat",
    children: [
      { label: "Sản phẩm", href: "/truy-xuat/san-pham" },
      { label: "Mã Tem được cấp UID/QR", href: "/truy-xuat/tem-nhan" },
      { label: "Danh sách sự kiện", href: "/truy-xuat/su-kien" },
      { label: "Quản lý lô khai báo", href: "/truy-xuat/lo-khai-bao" },
      { label: "Mẫu sự kiện trọng yếu", href: "/truy-xuat/mau-trong-yeu" },
      { label: "Chứng chỉ được cấp", href: "/truy-xuat/chung-chi-duoc-cap" },
    ],
  },
  {
    label: "Quản trị hệ thống",
    href: "/quan-tri",
    children: [
      { label: "Bộ ban ngành", href: "/quan-tri/bo-ban-nganh" },
      { label: "Đối tác", href: "/quan-tri/doi-tac" },
      { label: "Doanh nghiệp", href: "/quan-tri/doanh-nghiep" },
      { label: "Người dùng", href: "/quan-tri/nguoi-dung" },
      { label: "Phân quyền", href: "/quan-tri/phan-quyen" },
    ],
  },
  {
    label: "Danh mục hệ thống",
    href: "/danh-muc",
    children: [
      { label: "Đơn vị hành chính", href: "/danh-muc/don-vi-hanh-chinh" },
      { label: "Nhóm ngành hàng", href: "/danh-muc/nhom-nganh-hang" },
      { label: "Danh sách chứng chỉ", href: "/danh-muc/loai-chung-chi" },
      { label: "Mức độ rủi ro", href: "/danh-muc/muc-do-rui-ro" },
      { label: "Thư viện mẫu sự kiện", href: "/danh-muc/thu-vien-mau-su-kien" },
    ],
  },
  {
    label: "Tích hợp hệ thống",
    href: "/tich-hop",
    children: [
      { label: "Sự kiện tích hợp", href: "/tich-hop/webhook" },
      { label: "Nhật kí giao dịch", href: "/tich-hop/transaction" },
    ],
  },
];
