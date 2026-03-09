"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { ma: "CB001", loai_rui_ro: "Vượt ngưỡng dư lượng thuốc BVTV", doi_tuong: "Rau muống VietGAP - HTX Lâm Đồng", muc_do: "Cao", thoi_gian: "09/03/2026 06:15", phu_trach: "Nguyễn Văn An", trang_thai_xu_ly: "Đang xử lý" },
  { ma: "CB002", loai_rui_ro: "Chứng chỉ GlobalG.A.P. sắp hết hạn", doi_tuong: "HTX Vải thiều Bắc Giang", muc_do: "Trung bình", thoi_gian: "08/03/2026 14:30", phu_trach: "Trần Thị Bích", trang_thai_xu_ly: "Đã xử lý" },
  { ma: "CB003", loai_rui_ro: "Gián đoạn chuỗi cung ứng", doi_tuong: "Cty TNHH Minh Phú - Tuyến vận chuyển CaMau-HCM", muc_do: "Rất cao", thoi_gian: "08/03/2026 09:45", phu_trach: "Lê Minh Tuấn", trang_thai_xu_ly: "Khẩn cấp" },
  { ma: "CB004", loai_rui_ro: "Thông tin lô hàng không khớp", doi_tuong: "Lô tôm sú LH-20260301-008", muc_do: "Trung bình", thoi_gian: "07/03/2026 16:20", phu_trach: "Phạm Thu Hà", trang_thai_xu_ly: "Đã xử lý" },
  { ma: "CB005", loai_rui_ro: "Phát hiện QR giả mạo", doi_tuong: "Sản phẩm gạo ST25 tại thị trường Hà Nội", muc_do: "Rất cao", thoi_gian: "07/03/2026 11:00", phu_trach: "Nguyễn Văn An", trang_thai_xu_ly: "Đang xử lý" },
  { ma: "CB006", loai_rui_ro: "Tài khoản đăng nhập bất thường", doi_tuong: "Người dùng: admin@vinhhoancorp.vn", muc_do: "Cao", thoi_gian: "06/03/2026 23:14", phu_trach: "Đỗ Quang Huy", trang_thai_xu_ly: "Đã xử lý" },
  { ma: "CB007", loai_rui_ro: "Kiểm nghiệm E.coli vượt tiêu chuẩn", doi_tuong: "Cá tra phi-lê lô LH-2260285 - Vĩnh Hoàn", muc_do: "Rất cao", thoi_gian: "06/03/2026 08:30", phu_trach: "Trần Thị Bích", trang_thai_xu_ly: "Triệu hồi" },
  { ma: "CB008", loai_rui_ro: "Doanh nghiệp chưa cập nhật báo cáo định kỳ", doi_tuong: "HTX Hồ tiêu Gia Lai", muc_do: "Thấp", thoi_gian: "05/03/2026 09:00", phu_trach: "Lê Minh Tuấn", trang_thai_xu_ly: "Đã xử lý" },
  { ma: "CB009", loai_rui_ro: "Nhiệt độ kho lạnh vượt ngưỡng", doi_tuong: "Kho lạnh KL-04 - Cty CP Đồ hộp Hạ Long", muc_do: "Cao", thoi_gian: "05/03/2026 02:47", phu_trach: "Phạm Thu Hà", trang_thai_xu_ly: "Đã xử lý" },
  { ma: "CB010", loai_rui_ro: "Nguyên liệu nhập không rõ nguồn gốc", doi_tuong: "Lô nguyên liệu NL-BTP-220", muc_do: "Trung bình", thoi_gian: "04/03/2026 15:10", phu_trach: "Nguyễn Văn An", trang_thai_xu_ly: "Đang xử lý" },
  { ma: "CB011", loai_rui_ro: "Hết hạn sử dụng chưa thu hồi", doi_tuong: "Nước mắm Phú Quốc lô PM-2024091", muc_do: "Cao", thoi_gian: "03/03/2026 11:30", phu_trach: "Đỗ Quang Huy", trang_thai_xu_ly: "Đã xử lý" },
  { ma: "CB012", loai_rui_ro: "Sự cố hệ thống API truy xuất", doi_tuong: "Kết nối tới hệ thống quốc gia TXNG", muc_do: "Trung bình", thoi_gian: "02/03/2026 04:00", phu_trach: "Đỗ Quang Huy", trang_thai_xu_ly: "Đã xử lý" },
  { ma: "CB013", loai_rui_ro: "Mã số vùng trồng hết hạn", doi_tuong: "MSVT-BG-0041 - HTX Vải thiều Lục Ngạn", muc_do: "Thấp", thoi_gian: "01/03/2026 08:00", phu_trach: "Trần Thị Bích", trang_thai_xu_ly: "Chờ xử lý" },
];

const mucDoVariant: Record<string, "danger" | "warning" | "info" | "success" | "neutral"> = {
  "Rất cao": "danger",
  "Cao": "warning",
  "Trung bình": "info",
  "Thấp": "success",
};

const trangThaiVariant: Record<string, "danger" | "warning" | "info" | "success" | "neutral"> = {
  "Khẩn cấp": "danger",
  "Triệu hồi": "danger",
  "Đang xử lý": "warning",
  "Chờ xử lý": "info",
  "Đã xử lý": "success",
};

const columns = [
  { key: "ma", label: "Mã cảnh báo", width: "100px" },
  { key: "loai_rui_ro", label: "Loại rủi ro" },
  { key: "doi_tuong", label: "Đối tượng" },
  {
    key: "muc_do",
    label: "Mức độ",
    render: (row: Record<string, unknown>) => (
      <Badge variant={mucDoVariant[row.muc_do as string] ?? "neutral"}>{row.muc_do as string}</Badge>
    ),
  },
  { key: "thoi_gian", label: "Thời gian", width: "140px" },
  { key: "phu_trach", label: "Người phụ trách" },
  {
    key: "trang_thai_xu_ly",
    label: "Trạng thái xử lý",
    render: (row: Record<string, unknown>) => (
      <Badge variant={trangThaiVariant[row.trang_thai_xu_ly as string] ?? "neutral"}>
        {row.trang_thai_xu_ly as string}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Cảnh báo rủi ro"
      subtitle="Theo dõi và quản lý các cảnh báo rủi ro trong chuỗi cung ứng thực phẩm"
      stats={[
        { label: "Tổng cảnh báo", value: data.length, variant: "info" },
        { label: "Rất cao & Khẩn cấp", value: data.filter((d) => d.muc_do === "Rất cao").length, variant: "danger" },
        { label: "Đang xử lý", value: data.filter((d) => ["Đang xử lý", "Chờ xử lý", "Khẩn cấp", "Triệu hồi"].includes(d.trang_thai_xu_ly)).length, variant: "warning" },
        { label: "Đã xử lý", value: data.filter((d) => d.trang_thai_xu_ly === "Đã xử lý").length, variant: "success" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["ma", "loai_rui_ro", "doi_tuong", "phu_trach"]}
      addLabel="Tạo cảnh báo"
    />
  );
}
