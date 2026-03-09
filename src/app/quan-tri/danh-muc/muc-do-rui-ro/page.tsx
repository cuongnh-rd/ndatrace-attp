"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "MDRR001", muc_do: "Rất cao", diem_so: "90-100", mo_ta: "Nguy cơ nghiêm trọng, cần xử lý khẩn cấp ngay lập tức", mau: "Đỏ đậm (#7F1D1D)", trang_thai: "active" },
  { id: "MDRR002", muc_do: "Cao", diem_so: "70-89", mo_ta: "Rủi ro cao, cần ưu tiên xử lý trong vòng 24 giờ", mau: "Đỏ (#DC2626)", trang_thai: "active" },
  { id: "MDRR003", muc_do: "Trung bình cao", diem_so: "55-69", mo_ta: "Rủi ro đáng kể, cần theo dõi và lên kế hoạch xử lý", mau: "Cam (#EA580C)", trang_thai: "active" },
  { id: "MDRR004", muc_do: "Trung bình", diem_so: "40-54", mo_ta: "Rủi ro ở mức chấp nhận được, cần kiểm soát định kỳ", mau: "Vàng (#D97706)", trang_thai: "active" },
  { id: "MDRR005", muc_do: "Trung bình thấp", diem_so: "25-39", mo_ta: "Rủi ro thấp, cần ghi nhận và theo dõi thường xuyên", mau: "Vàng nhạt (#FBBF24)", trang_thai: "active" },
  { id: "MDRR006", muc_do: "Thấp", diem_so: "10-24", mo_ta: "Rủi ro rất thấp, có thể chấp nhận với biện pháp phòng ngừa cơ bản", mau: "Xanh lá (#16A34A)", trang_thai: "active" },
  { id: "MDRR007", muc_do: "Rất thấp", diem_so: "0-9", mo_ta: "Gần như không có rủi ro, chỉ cần theo dõi định kỳ hàng tháng", mau: "Xanh lá nhạt (#4ADE80)", trang_thai: "active" },
  { id: "MDRR008", muc_do: "Không xác định", diem_so: "N/A", mo_ta: "Chưa có đủ thông tin để đánh giá mức độ rủi ro", mau: "Xám (#6B7280)", trang_thai: "active" },
  { id: "MDRR009", muc_do: "Đang đánh giá", diem_so: "N/A", mo_ta: "Đang trong quá trình thu thập dữ liệu và phân tích", mau: "Xanh dương (#2563EB)", trang_thai: "active" },
  { id: "MDRR010", muc_do: "Tạm đình chỉ", diem_so: "N/A", mo_ta: "Đối tượng đang bị tạm đình chỉ hoạt động, chờ xem xét", mau: "Tím (#7C3AED)", trang_thai: "active" },
  { id: "MDRR011", muc_do: "Khẩn cấp", diem_so: "100", mo_ta: "Tình huống khủng hoảng cần triệu hồi sản phẩm hoặc dừng hoạt động", mau: "Đen (#111827)", trang_thai: "active" },
  { id: "MDRR012", muc_do: "Đã xử lý", diem_so: "0", mo_ta: "Rủi ro đã được xử lý hoàn toàn và đóng hồ sơ", mau: "Xanh lam (#0284C7)", trang_thai: "inactive" },
];

const mucDoVariant = (muc: string): "danger" | "warning" | "info" | "success" | "neutral" => {
  if (["Rất cao", "Cao", "Khẩn cấp"].includes(muc)) return "danger";
  if (["Trung bình cao", "Trung bình"].includes(muc)) return "warning";
  if (["Trung bình thấp", "Không xác định", "Đang đánh giá", "Tạm đình chỉ"].includes(muc)) return "info";
  if (["Thấp", "Rất thấp"].includes(muc)) return "success";
  return "neutral";
};

const columns = [
  { key: "id", label: "Mã", width: "100px" },
  {
    key: "muc_do",
    label: "Mức độ",
    render: (row: Record<string, unknown>) => (
      <Badge variant={mucDoVariant(row.muc_do as string)}>{row.muc_do as string}</Badge>
    ),
  },
  { key: "diem_so", label: "Điểm số", width: "110px" },
  { key: "mo_ta", label: "Mô tả" },
  { key: "mau", label: "Màu hiển thị" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => (
      <Badge variant={row.trang_thai === "active" ? "success" : "neutral"}>
        {row.trang_thai === "active" ? "Áp dụng" : "Không dùng"}
      </Badge>
    ),
  },
];

export default function Page() {
  return (
    <SectionPage
      title="Mức độ rủi ro (Quản trị)"
      subtitle="Danh mục phân loại mức độ rủi ro dùng trong hệ thống cảnh báo và giám sát"
      stats={[
        { label: "Tổng mức độ", value: data.length, variant: "info" },
        { label: "Đang áp dụng", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Mức cao & rất cao", value: 2, variant: "danger" },
        { label: "Không dùng", value: data.filter((d) => d.trang_thai === "inactive").length, variant: "neutral" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "muc_do", "mo_ta"]}
      addLabel="Thêm mức độ"
    />
  );
}
