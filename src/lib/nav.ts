export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    label: "Tổng quan",
    href: "/dashboard",
    children: [
      { label: "Tổng quan", href: "/dashboard" },
      { label: "Chỉ số hoạt động", href: "/dashboard/chi-so" },
      { label: "Cảnh báo", href: "/dashboard/canh-bao" },
      { label: "Bản đồ ATTP", href: "/dashboard/ban-do" },
    ],
  },
  {
    label: "Quản lý ATTP",
    href: "/quan-ly-attp",
    children: [
      { label: "Giấy chứng nhận ATTP", href: "/chung-nhan-attp/danh-sach" },
      { label: "Hồ sơ tự công bố", href: "/tu-cong-bo/danh-sach" },
      { label: "Kiểm tra ATTP", href: "/kiem-tra" },
      { label: "Ngộ độc thực phẩm", href: "/ngo-doc/danh-sach" },
      { label: "Danh sách truyền thông", href: "/truyen-thong/chien-dich" },
    ],
  },
  {
    label: "Truy xuất nguồn gốc",
    href: "/truy-xuat",
    children: [
      { label: "Doanh nghiệp", href: "/quan-tri/doanh-nghiep" },
      { label: "Cơ sở", href: "/truy-xuat/co-so" },
      { label: "Sản phẩm", href: "/truy-xuat/san-pham" },
      { label: "Lô sản phẩm", href: "/truy-xuat/lo-san-pham" },
      { label: "Phản ánh sản phẩm", href: "/quan-tri/bao-cao-san-pham" },
      { label: "Lịch sử quét UID", href: "/truy-xuat/lich-su-quet" },
    ],
  },
  {
    label: "Báo cáo thống kê",
    href: "/bao-cao",
    children: [
      { label: "Báo cáo cơ sở", href: "/bao-cao/co-so" },
      { label: "Báo cáo giấy ATTP", href: "/bao-cao/giay-attp" },
      { label: "Báo cáo kiểm tra", href: "/bao-cao/kiem-tra" },
      { label: "Báo cáo ngộ độc", href: "/bao-cao/ngo-doc" },
      { label: "Báo cáo truyền thông", href: "/bao-cao/truyen-thong" },
    ],
  },
  {
    label: "Quản trị hệ thống",
    href: "/quan-tri",
    children: [
      { label: "Bộ ban ngành", href: "/quan-tri/bo-ban-nganh" },
      { label: "Đối tác", href: "/quan-tri/doi-tac" },
      { label: "Người dùng", href: "/quan-tri/nguoi-dung" },
      { label: "Vai trò", href: "/quan-tri/vai-tro" },
    ],
  },
  {
    label: "Danh mục hệ thống",
    href: "/danh-muc",
    children: [
      { label: "Trường dữ liệu", href: "/danh-muc/thu-vien-kde" },
      { label: "Đơn vị hành chính", href: "/danh-muc/don-vi-hanh-chinh" },
      { label: "Nhóm ngành hàng", href: "/danh-muc/nhom-nganh-hang" },
      { label: "Loại chứng chỉ", href: "/danh-muc/loai-chung-chi" },
      { label: "Mức độ rủi ro", href: "/danh-muc/muc-do-rui-ro" },
      { label: "Nhóm sản phẩm", href: "/danh-muc/nhom-san-pham" },
      { label: "Phân loại cơ sở", href: "/co-so/phan-loai" },
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
