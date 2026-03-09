"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "ND001", ho_ten: "Nguyễn Văn An", email: "nguyen.van.an@ndatrace.vn", vai_tro: "Quản trị viên", don_vi: "Ban Công nghệ", ngay_tao: "2024-01-10", trang_thai: "active" },
  { id: "ND002", ho_ten: "Trần Thị Bích", email: "tran.thi.bich@ndatrace.vn", vai_tro: "Kiểm duyệt viên", don_vi: "Ban Nghiệp vụ", ngay_tao: "2024-02-15", trang_thai: "active" },
  { id: "ND003", ho_ten: "Lê Minh Cường", email: "le.minh.cuong@hsx.vn", vai_tro: "Doanh nghiệp", don_vi: "HTX Nông nghiệp Sóc Trăng", ngay_tao: "2024-03-01", trang_thai: "active" },
  { id: "ND004", ho_ten: "Phạm Hồng Dương", email: "pham.hong.duong@vinhhoan.com", vai_tro: "Doanh nghiệp", don_vi: "Cty CP Vĩnh Hoàn", ngay_tao: "2024-03-15", trang_thai: "active" },
  { id: "ND005", ho_ten: "Vũ Thị Oanh", email: "vu.thi.oanh@ndatrace.vn", vai_tro: "Kiểm duyệt viên", don_vi: "Ban Nghiệp vụ", ngay_tao: "2024-04-01", trang_thai: "active" },
  { id: "ND006", ho_ten: "Đặng Minh Khoa", email: "dang.minh.khoa@ndatrace.vn", vai_tro: "Chuyên viên kỹ thuật", don_vi: "Ban Công nghệ", ngay_tao: "2024-04-20", trang_thai: "active" },
  { id: "ND007", ho_ten: "Hoàng Thị Lan", email: "hoang.thi.lan@masan.vn", vai_tro: "Doanh nghiệp", don_vi: "Masan Consumer", ngay_tao: "2024-05-10", trang_thai: "active" },
  { id: "ND008", ho_ten: "Ngô Quang Hải", email: "ngo.quang.hai@ndatrace.vn", vai_tro: "Quản trị viên", don_vi: "Ban Công nghệ", ngay_tao: "2024-05-25", trang_thai: "active" },
  { id: "ND009", ho_ten: "Bùi Thị Thanh Nga", email: "bui.thanh.nga@minhphu.vn", vai_tro: "Doanh nghiệp", don_vi: "Cty TNHH Thủy sản Minh Phú", ngay_tao: "2024-06-05", trang_thai: "active" },
  { id: "ND010", ho_ten: "Trịnh Văn Hùng", email: "trinh.van.hung@ndatrace.vn", vai_tro: "Kiểm duyệt viên", don_vi: "Ban Nghiệp vụ", ngay_tao: "2024-06-20", trang_thai: "inactive" },
  { id: "ND011", ho_ten: "Lý Thị Kim Ngân", email: "ly.kim.ngan@coffeelamphuong.vn", vai_tro: "Doanh nghiệp", don_vi: "Cty CP Cà phê Lâm Đồng", ngay_tao: "2024-07-10", trang_thai: "active" },
  { id: "ND012", ho_ten: "Phan Anh Tú", email: "phan.anh.tu@ndatrace.vn", vai_tro: "Chuyên viên kỹ thuật", don_vi: "Ban Công nghệ", ngay_tao: "2024-08-01", trang_thai: "active" },
  { id: "ND013", ho_ten: "Mai Thị Hồng", email: "mai.thi.hong@vinamilk.com.vn", vai_tro: "Doanh nghiệp", don_vi: "Cty CP Sữa Mộc Châu", ngay_tao: "2024-08-20", trang_thai: "active" },
  { id: "ND014", ho_ten: "Cao Xuân Thắng", email: "cao.xuan.thang@ndatrace.vn", vai_tro: "Quản trị viên", don_vi: "Ban Lãnh đạo", ngay_tao: "2024-09-10", trang_thai: "active" },
  { id: "ND015", ho_ten: "Đinh Thị Yến", email: "dinh.thi.yen@gs1.org.vn", vai_tro: "Đối tác", don_vi: "GS1 Vietnam", ngay_tao: "2024-10-01", trang_thai: "inactive" },
];

const roleColors: Record<string, "success" | "info" | "warning" | "neutral"> = {
  "Quản trị viên": "danger" as "neutral",
  "Kiểm duyệt viên": "warning",
  "Doanh nghiệp": "info",
  "Chuyên viên kỹ thuật": "success",
  "Đối tác": "neutral",
};

const columns = [
  { key: "id", label: "Mã", width: "80px" },
  { key: "ho_ten", label: "Họ và tên" },
  { key: "email", label: "Email" },
  {
    key: "vai_tro",
    label: "Vai trò",
    width: "160px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={roleColors[row.vai_tro as string] ?? "neutral"}>{row.vai_tro as string}</Badge>
    ),
  },
  { key: "don_vi", label: "Đơn vị" },
  { key: "ngay_tao", label: "Ngày tạo", width: "120px" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    width: "130px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Hoạt động" : "Vô hiệu hóa"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Người dùng"
      subtitle="Quản lý tài khoản và phân quyền người dùng trong hệ thống"
      stats={[
        { label: "Tổng người dùng", value: data.length, variant: "info" },
        { label: "Đang hoạt động", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Vô hiệu hóa", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
        { label: "Quản trị viên", value: data.filter((d) => d.vai_tro === "Quản trị viên").length, variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ho_ten", "email", "vai_tro", "don_vi"]}
      addLabel="Thêm người dùng"
    />
  );
}
