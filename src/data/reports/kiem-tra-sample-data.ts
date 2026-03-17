// Data samples for Báo cáo kiểm tra (Inspection Reports)

export const inspectionSummaryCards = [
  { label: "Tổng đợt kiểm tra", value: "4,284", change: "+12.4%", up: true },
  { label: "Cơ sở đạt", value: "3,847", change: "+8.2%", up: true },
  { label: "Cơ sở không đạt", value: "437", change: "-15.6%", up: false },
  { label: "Tỷ lệ đạt chuẩn", value: "89.8%", change: "+3.2%", up: true },
];

export const inspectionByType = [
  { type: "Kiểm tra định kỳ", total: 2840, passed: 2540, failed: 300 },
  { type: "Kiểm tra đột xuất", total: 980, passed: 880, failed: 100 },
  { type: "Kiểm tra sau khiếu nại", total: 284, passed: 248, failed: 36 },
  { type: "Kiểm tra theo yêu cầu", total: 180, passed: 179, failed: 1 },
];

export const inspectionByViolationLevel = [
  { level: "Không vi phạm", count: 2847, percentage: 66.5, color: "#22c55e" },
  { level: "Vi phạm nhỏ", count: 1084, percentage: 25.3, color: "#f59e0b" },
  { level: "Vi phạm trung bình", count: 284, percentage: 6.6, color: "#f97316" },
  { level: "Vi phạm nghiêm trọng", count: 69, percentage: 1.6, color: "#ef4444" },
];

export const inspectionTrendData = [
  { month: "T1", inspections: 320, passed: 288, failed: 32, rate: 90.0 },
  { month: "T2", inspections: 340, passed: 306, failed: 34, rate: 90.0 },
  { month: "T3", inspections: 380, passed: 342, failed: 38, rate: 90.0 },
  { month: "T4", inspections: 420, passed: 378, failed: 42, rate: 90.0 },
  { month: "T5", inspections: 460, passed: 414, failed: 46, rate: 90.0 },
  { month: "T6", inspections: 480, passed: 432, failed: 48, rate: 90.0 },
  { month: "T7", inspections: 360, passed: 324, failed: 36, rate: 90.0 },
  { month: "T8", inspections: 340, passed: 306, failed: 34, rate: 90.0 },
  { month: "T9", inspections: 380, passed: 342, failed: 38, rate: 90.0 },
  { month: "T10", inspections: 420, passed: 378, failed: 42, rate: 90.0 },
  { month: "T11", inspections: 460, passed: 414, failed: 46, rate: 90.0 },
  { month: "T12", inspections: 424, passed: 381, failed: 43, rate: 89.9 },
];

export const commonViolations = [
  { rank: 1, violation: "Vệ sinh cá nhân không đảm bảo", count: 482, percentage: 25.8 },
  { rank: 2, violation: "Bảo quản thực phẩm không đúng quy định", count: 384, percentage: 20.5 },
  { rank: 3, violation: "Thiếu giấy tờ chứng nhận", count: 284, percentage: 15.2 },
  { rank: 4, violation: "Cơ sở vật chất không đạt chuẩn", count: 248, percentage: 13.3 },
  { rank: 5, violation: "Quy trình chế biến sai phạm", count: 196, percentage: 10.5 },
  { rank: 6, violation: "Nhân viên không có chứng chỉ VSTP", count: 168, percentage: 9.0 },
  { rank: 7, violation: "Nguồn gốc thực phẩm không rõ ràng", count: 112, percentage: 6.0 },
];

export const recentInspections = [
  { id: "KT001", ten_co_so: "Nhà hàng Hải Sản VIP", dia_chi: "Q.1, TP.HCM", ngay_kiem_tra: "15/03/2026", loai_kiem_tra: "Đột xuất", ket_qua: "passed", vi_pham: "Không", nguoi_kiem_tra: "Nguyễn Văn A" },
  { id: "KT002", ten_co_so: "Cty CP Thực phẩm Đông Dương", dia_chi: "Q.7, TP.HCM", ngay_kiem_tra: "14/03/2026", loai_kiem_tra: "Định kỳ", ket_qua: "warning", vi_pham: "Vệ sinh cá nhân", nguoi_kiem_tra: "Trần Thị B" },
  { id: "KT003", ten_co_so: "Nhà hàng Cơm Niêu Sài Gòn", dia_chi: "Q.3, TP.HCM", ngay_kiem_tra: "13/03/2026", loai_kiem_tra: "Định kỳ", ket_qua: "passed", vi_pham: "Không", nguoi_kiem_tra: "Lê Văn C" },
  { id: "KT004", ten_co_so: "Xưởng sản xuất Mì Hảo Hảo", dia_chi: "Bình Dương", ngay_kiem_tra: "12/03/2026", loai_kiem_tra: "Sau khiếu nại", ket_qua: "failed", vi_phab: "Nhiều vi phạm", nguoi_kiem_tra: "Phạm Thị D" },
  { id: "KT005", ten_co_so: "Cửa hàng thực phẩm sạch Organic", dia_chi: "Q.2, TP.HCM", ngay_kiem_tra: "11/03/2026", loai_kiem_tra: "Định kỳ", ket_qua: "passed", vi_pham: "Không", nguoi_kiem_tra: "Hoàng Văn E" },
  { id: "KT006", ten_co_so: "Bếp ăn tập thể Công ty Samsung", dia_chi: "Bắc Ninh", ngay_kiem_tra: "10/03/2026", loai_kiem_tra: "Theo yêu cầu", ket_qua: "passed", vi_pham: "Không", nguoi_kiem_tra: "Ngô Thị F" },
  { id: "KT007", ten_co_so: "Nhà hàng Phở 24", dia_chi: "Q.1, TP.HCM", ngay_kiem_tra: "09/03/2026", loai_kiem_tra: "Đột xuất", ket_qua: "warning", vi_pham: "Bảo quản thực phẩm", nguoi_kiem_tra: "Đỗ Văn G" },
  { id: "KT008", ten_co_so: "Cty CP Nước giải khát Tân Hiệp Phát", dia_chi: "Bình Dương", ngay_kiem_tra: "08/03/2026", loai_kiem_tra: "Định kỳ", ket_qua: "passed", vi_pham: "Không", nguoi_kiem_tra: "Vũ Thị H" },
  { id: "KT009", ten_co_so: "Chợ đầu mối Bình Điền", dia_chi: "Q.8, TP.HCM", ngay_kiem_tra: "07/03/2026", loai_kiem_tra: "Định kỳ", ket_qua: "warning", vi_pham: "Cơ sở vật chất", nguoi_kiem_tra: "Lương Văn I" },
  { id: "KT010", ten_co_so: "Cty Nhập khẩu Thực phẩm Âu Á", dia_chi: "Q.9, TP.HCM", ngay_kiem_tra: "06/03/2026", loai_kiem_tra: "Đột xuất", ket_qua: "passed", vi_pham: "Không", nguoi_kiem_tra: "Phạm Thị K" },
];

export const inspectionByRegion = [
  { region: "Thành phố Hồ Chí Minh", total: 1240, passed: 1120, failed: 120, rate: 90.3 },
  { region: "Hà Nội", total: 980, passed: 880, failed: 100, rate: 89.8 },
  { region: "Đà Nẵng", total: 420, passed: 380, failed: 40, rate: 90.5 },
  { region: "Cần Thơ", total: 340, passed: 304, failed: 36, rate: 89.4 },
  { region: "Hải Phòng", total: 380, passed: 342, failed: 38, rate: 90.0 },
  { region: "Nghệ An", total: 280, passed: 248, failed: 32, rate: 88.6 },
  { region: "Thanh Hóa", total: 320, passed: 284, failed: 36, rate: 88.8 },
  { region: "Khánh Hòa", total: 240, passed: 216, failed: 24, rate: 90.0 },
  { region: "Bình Dương", total: 380, passed: 340, failed: 40, rate: 89.5 },
  { region: "Đồng Nai", total: 304, passed: 273, failed: 31, rate: 89.8 },
];
