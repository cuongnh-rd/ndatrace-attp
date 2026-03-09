"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "TL001", ten: "Quy trình truy xuất nguồn gốc thủy sản", loai: "Quy trình", phien_ban: "v2.3", ngay_cap_nhat: "10/01/2026", luot_tai: 1240, trang_thai: "active" },
  { id: "TL002", ten: "Hướng dẫn nhập liệu sự kiện sản xuất", loai: "Hướng dẫn", phien_ban: "v1.8", ngay_cap_nhat: "05/01/2026", luot_tai: 876, trang_thai: "active" },
  { id: "TL003", ten: "Tiêu chuẩn VietGAP cho rau củ quả", loai: "Tiêu chuẩn", phien_ban: "v3.0", ngay_cap_nhat: "20/12/2025", luot_tai: 2150, trang_thai: "active" },
  { id: "TL004", ten: "Biểu mẫu khai báo lô hàng xuất khẩu", loai: "Biểu mẫu", phien_ban: "v1.2", ngay_cap_nhat: "15/12/2025", luot_tai: 540, trang_thai: "active" },
  { id: "TL005", ten: "Quy định GMP cho cơ sở chế biến thực phẩm", loai: "Quy định", phien_ban: "v2.1", ngay_cap_nhat: "01/12/2025", luot_tai: 1890, trang_thai: "active" },
  { id: "TL006", ten: "Mẫu báo cáo kiểm tra chất lượng định kỳ", loai: "Biểu mẫu", phien_ban: "v1.5", ngay_cap_nhat: "20/11/2025", luot_tai: 720, trang_thai: "active" },
  { id: "TL007", ten: "Hướng dẫn sử dụng hệ thống QR truy xuất", loai: "Hướng dẫn", phien_ban: "v4.0", ngay_cap_nhat: "10/11/2025", luot_tai: 3400, trang_thai: "active" },
  { id: "TL008", ten: "Tiêu chuẩn GlobalG.A.P. phiên bản 6.0", loai: "Tiêu chuẩn", phien_ban: "v6.0", ngay_cap_nhat: "01/11/2025", luot_tai: 1120, trang_thai: "active" },
  { id: "TL009", ten: "Quy trình cấp chứng chỉ hữu cơ nội địa", loai: "Quy trình", phien_ban: "v1.4", ngay_cap_nhat: "25/10/2025", luot_tai: 680, trang_thai: "inactive" },
  { id: "TL010", ten: "Biểu mẫu đăng ký mã số cơ sở nuôi trồng", loai: "Biểu mẫu", phien_ban: "v2.0", ngay_cap_nhat: "10/10/2025", luot_tai: 950, trang_thai: "active" },
  { id: "TL011", ten: "Hướng dẫn truy xuất lô sản phẩm bị triệu hồi", loai: "Hướng dẫn", phien_ban: "v1.1", ngay_cap_nhat: "05/10/2025", luot_tai: 430, trang_thai: "active" },
  { id: "TL012", ten: "Tiêu chuẩn HACCP ứng dụng trong chế biến thủy sản", loai: "Tiêu chuẩn", phien_ban: "v2.5", ngay_cap_nhat: "20/09/2025", luot_tai: 1670, trang_thai: "active" },
  { id: "TL013", ten: "Quy định về nhãn mác sản phẩm nông nghiệp", loai: "Quy định", phien_ban: "v1.9", ngay_cap_nhat: "15/09/2025", luot_tai: 2310, trang_thai: "active" },
  { id: "TL014", ten: "Mẫu hợp đồng liên kết sản xuất và tiêu thụ", loai: "Biểu mẫu", phien_ban: "v1.0", ngay_cap_nhat: "01/09/2025", luot_tai: 380, trang_thai: "inactive" },
  { id: "TL015", ten: "Hướng dẫn tích hợp API truy xuất bên thứ ba", loai: "Hướng dẫn", phien_ban: "v3.2", ngay_cap_nhat: "20/08/2025", luot_tai: 590, trang_thai: "active" },
];

const loaiMap: Record<string, "success" | "info" | "warning" | "neutral"> = {
  "Quy trình": "success",
  "Hướng dẫn": "info",
  "Tiêu chuẩn": "warning",
  "Biểu mẫu": "neutral",
  "Quy định": "danger",
};

const columns = [
  { key: "id", label: "Mã tài liệu", width: "100px" },
  { key: "ten", label: "Tên tài liệu" },
  {
    key: "loai",
    label: "Loại",
    render: (row: Record<string, unknown>) => (
      <Badge variant={loaiMap[row.loai as string] ?? "neutral"}>{row.loai as string}</Badge>
    ),
  },
  { key: "phien_ban", label: "Phiên bản", width: "100px" },
  { key: "ngay_cap_nhat", label: "Ngày cập nhật", width: "130px" },
  {
    key: "luot_tai",
    label: "Lượt tải",
    render: (row: Record<string, unknown>) => (
      <span className="font-mono">{(row.luot_tai as number).toLocaleString()}</span>
    ),
  },
  {
    key: "trang_thai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Công bố" : "Lưu trữ"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Thư viện tài liệu"
      subtitle="Kho lưu trữ quy trình, tiêu chuẩn và biểu mẫu phục vụ truy xuất nguồn gốc"
      stats={[
        { label: "Tổng tài liệu", value: data.length, variant: "info" },
        { label: "Đang công bố", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Lưu trữ", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
        { label: "Tổng lượt tải", value: "19,748", variant: "info" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "ten", "loai", "phien_ban"]}
      addLabel="Thêm tài liệu"
    />
  );
}
