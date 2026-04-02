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
    ],
  },
  {
    label: "Quản lý cơ sở",
    href: "/co-so",
    children: [
      { label: "Phân loại cơ sở", href: "/co-so/phan-loai" },
      { label: "Danh sách cơ sở", href: "/co-so/danh-sach" },
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
    ],
  },
  {
    label: "Truyền thông ATTP",
    href: "/truyen-thong",
    children: [
      { label: "Danh sách truyền thông", href: "/truyen-thong/chien-dich" },
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
      { label: "Doanh nghiệp", href: "/quan-tri/doanh-nghiep" },
      { label: "Người dùng", href: "/quan-tri/nguoi-dung" },
      { label: "Phân quyền", href: "/quan-tri/phan-quyen" },
      { label: "Báo cáo sản phẩm", href: "/quan-tri/bao-cao-san-pham" },
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
