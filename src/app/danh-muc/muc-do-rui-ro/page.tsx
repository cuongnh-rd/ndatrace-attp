"use client";

import SectionPage from "@/components/ui/SectionPage";
import Badge from "@/components/ui/Badge";

const data = [
  { id: "RR001", muc_do: "Rất thấp", mo_ta: "Sản phẩm đạt toàn bộ tiêu chuẩn, chuỗi cung ứng minh bạch hoàn toàn", diem_so: "0–20", mau_sac: "Xanh lá", hanh_dong: "Không cần can thiệp", trang_thai: "active" },
  { id: "RR002", muc_do: "Thấp", mo_ta: "Một vài điểm nhỏ cần lưu ý, không ảnh hưởng an toàn thực phẩm", diem_so: "21–40", mau_sac: "Xanh dương", hanh_dong: "Theo dõi định kỳ", trang_thai: "active" },
  { id: "RR003", muc_do: "Trung bình", mo_ta: "Có dấu hiệu bất thường trong một số khâu của chuỗi cung ứng", diem_so: "41–60", mau_sac: "Vàng", hanh_dong: "Kiểm tra và xác minh lại", trang_thai: "active" },
  { id: "RR004", muc_do: "Cao", mo_ta: "Vi phạm tiêu chuẩn ở nhiều khâu, cần điều tra ngay", diem_so: "61–80", mau_sac: "Cam", hanh_dong: "Tạm dừng lưu thông, điều tra", trang_thai: "active" },
  { id: "RR005", muc_do: "Rất cao", mo_ta: "Nghi vấn gian lận hoặc vi phạm nghiêm trọng an toàn thực phẩm", diem_so: "81–100", mau_sac: "Đỏ", hanh_dong: "Thu hồi sản phẩm, báo cáo cơ quan chức năng", trang_thai: "active" },
  { id: "RR006", muc_do: "Chưa xác định", mo_ta: "Sản phẩm hoặc lô hàng chưa được đánh giá rủi ro đầy đủ", diem_so: "N/A", mau_sac: "Xám", hanh_dong: "Yêu cầu bổ sung thông tin", trang_thai: "active" },
  { id: "RR007", muc_do: "Rủi ro khai báo sai", mo_ta: "Phát hiện thông tin khai báo không khớp với thực tế kiểm tra", diem_so: "Tùy mức độ", mau_sac: "Cam đậm", hanh_dong: "Cảnh báo doanh nghiệp, yêu cầu chỉnh sửa", trang_thai: "active" },
  { id: "RR008", muc_do: "Rủi ro chuỗi lạnh", mo_ta: "Nhiệt độ bảo quản hoặc vận chuyển vượt ngưỡng quy định", diem_so: "Tự động", mau_sac: "Đỏ cam", hanh_dong: "Kiểm tra lô hàng, đánh giá thiệt hại", trang_thai: "active" },
  { id: "RR009", muc_do: "Rủi ro dư lượng hóa chất", mo_ta: "Kết quả xét nghiệm phát hiện dư lượng thuốc BVTV vượt mức cho phép", diem_so: "Tùy nồng độ", mau_sac: "Đỏ", hanh_dong: "Thu hồi ngay, xét nghiệm lại toàn bộ lô", trang_thai: "active" },
  { id: "RR010", muc_do: "Rủi ro giả mạo tem nhãn", mo_ta: "Phát hiện tem QR không hợp lệ hoặc có dấu hiệu làm giả", diem_so: "Tự động", mau_sac: "Đỏ đậm", hanh_dong: "Chặn QR, báo cơ quan chức năng", trang_thai: "active" },
  { id: "RR011", muc_do: "Rủi ro hết hạn chứng chỉ", mo_ta: "Doanh nghiệp đang sử dụng chứng chỉ đã hết hạn hoặc sắp hết hạn", diem_so: "Tự động", mau_sac: "Vàng", hanh_dong: "Nhắc gia hạn hoặc tạm khóa tài khoản", trang_thai: "active" },
  { id: "RR012", muc_do: "Rủi ro xuất xứ không rõ ràng", mo_ta: "Không thể xác minh nguồn gốc xuất xứ của nguyên liệu đầu vào", diem_so: "51–70", mau_sac: "Cam", hanh_dong: "Yêu cầu cung cấp hồ sơ, tạm đình chỉ lưu thông", trang_thai: "active" },
  { id: "RR013", muc_do: "Rủi ro tích lũy", mo_ta: "Doanh nghiệp có nhiều cảnh báo nhỏ tích lũy qua thời gian", diem_so: "Cộng dồn", mau_sac: "Vàng cam", hanh_dong: "Kiểm tra định kỳ tăng tần suất", trang_thai: "inactive" },
];

const mucDoVariant = (id: string): "success" | "info" | "warning" | "danger" | "neutral" => {
  if (["RR001"].includes(id)) return "success";
  if (["RR002"].includes(id)) return "info";
  if (["RR003", "RR011"].includes(id)) return "warning";
  if (["RR006", "RR013"].includes(id)) return "neutral";
  return "danger";
};

const columns = [
  { key: "id", label: "Mã", width: "80px" },
  {
    key: "muc_do",
    label: "Mức độ",
    width: "200px",
    render: (row: Record<string, unknown>) => (
      <Badge variant={mucDoVariant(row.id as string)}>{row.muc_do as string}</Badge>
    ),
  },
  { key: "mo_ta", label: "Mô tả" },
  { key: "diem_so", label: "Điểm số", width: "110px" },
  { key: "mau_sac", label: "Màu sắc", width: "110px" },
  { key: "hanh_dong", label: "Hành động yêu cầu" },
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
      title="Mức độ rủi ro"
      subtitle="Quản lý các mức độ rủi ro và quy trình xử lý tương ứng trong hệ thống"
      stats={[
        { label: "Tổng mức rủi ro", value: data.length, variant: "info" },
        { label: "Đang sử dụng", value: data.filter((d) => d.trang_thai === "active").length, variant: "success" },
        { label: "Rủi ro cao/rất cao", value: data.filter((d) => ["RR004", "RR005", "RR008", "RR009", "RR010"].includes(d.id)).length, variant: "danger" },
        { label: "Tự động phát hiện", value: data.filter((d) => d.diem_so === "Tự động").length, variant: "warning" },
      ]}
      tableColumns={columns}
      tableData={data}
      searchKeys={["id", "muc_do", "mo_ta", "mau_sac", "hanh_dong"]}
      addLabel="Thêm mức độ rủi ro"
    />
  );
}
