// Data samples for Báo cáo ngộ độc (Food Poisoning Reports)

export const poisoningSummaryCards = [
  { label: "Vụ ngộ độc năm 2026", value: "127", change: "-18.4%", up: false },
  { label: "Số người bị ngộ độc", value: "1,847", change: "-22.1%", up: false },
  { label: "Số người tử vong", value: "3", change: "-50.0%", up: false },
  { label: "Tỷ lệ xử lý thành công", value: "99.8%", change: "+0.2%", up: true },
];

export const poisoningByCause = [
  { cause: "Vi khuẩn (Salmonella, E.coli...)", count: 58, percentage: 45.7, severity: "high" },
  { cause: "Độc tố thực phẩm", count: 32, percentage: 25.2, severity: "high" },
  { cause: "Hóa chất độc hại", count: 18, percentage: 14.2, severity: "critical" },
  { cause: "Nấm độc", count: 12, percentage: 9.4, severity: "high" },
  { cause: "Nguyên nhân khác", count: 7, percentage: 5.5, severity: "medium" },
];

export const poisoningByLocation = [
  { location: "Nhà hàng ăn uống", count: 48, people: 682, deaths: 1 },
  { location: "Hộ gia đình", count: 38, people: 284, deaths: 1 },
  { location: "Bếp ăn tập thể", count: 24, people: 624, deaths: 1 },
  { location: "Cơ sở sản xuất thực phẩm", count: 12, people: 198, deaths: 0 },
  { location: "Trường học", count: 5, people: 59, deaths: 0 },
];

export const poisoningTrendData = [
  { month: "T1", cases: 12, people: 168, deaths: 0 },
  { month: "T2", cases: 14, people: 198, deaths: 0 },
  { month: "T3", cases: 16, people: 224, deaths: 0 },
  { month: "T4", cases: 18, people: 252, deaths: 0 },
  { month: "T5", cases: 22, people: 308, deaths: 1 },
  { month: "T6", cases: 20, people: 280, deaths: 0 },
  { month: "T7", cases: 16, people: 224, deaths: 0 },
  { month: "T8", cases: 14, people: 196, deaths: 0 },
  { month: "T9", cases: 12, people: 168, deaths: 0 },
  { month: "T10", cases: 10, people: 140, deaths: 1 },
  { month: "T11", cases: 8, people: 112, deaths: 0 },
  { month: "T12", cases: 7, people: 98, deaths: 1 },
];

export const poisoningByRegion = [
  { region: "Thành phố Hồ Chí Minh", cases: 28, people: 412, deaths: 1 },
  { region: "Hà Nội", cases: 24, people: 348, deaths: 1 },
  { region: "Đà Nẵng", cases: 12, people: 168, deaths: 0 },
  { region: "Cần Thơ", cases: 10, people: 140, deaths: 0 },
  { region: "Hải Phòng", cases: 14, people: 196, deaths: 0 },
  { region: "Nghệ An", cases: 8, people: 112, deaths: 0 },
  { region: "Thanh Hóa", cases: 10, people: 140, deaths: 0 },
  { region: "Khánh Hòa", cases: 8, people: 112, deaths: 1 },
  { region: "Bình Dương", cases: 8, people: 112, deaths: 0 },
  { region: "Đồng Nai", cases: 5, people: 70, deaths: 0 },
];

export const recentPoisoningCases = [
  { id: "ND001", ngay_bat_dau: "10/03/2026", dia_diem: "Nhà hàng Hải Sản VIP", khu_vuc: "Q.1, TP.HCM", so_nguoi: 28, nguoi_tu_vong: 0, nguyen_nhan: "Vi khuẩn Salmonella", trang_thai: "resolved", thoi_gian_xu_ly: "3 ngày" },
  { id: "ND002", ngay_bat_dau: "08/03/2026", dia_diem: "Hộ gia đình", khu_vuc: "Q.7, TP.HCM", so_nguoi: 6, nguoi_tu_vong: 0, nguyen_nhan: "Nấm độc", trang_thai: "resolved", thoi_gian_xu_ly: "2 ngày" },
  { id: "ND003", ngay_bat_dau: "05/03/2026", dia_diem: "Bếp ăn tập thể Công ty Vinamilk", khu_vuc: "Bình Dương", so_nguoi: 42, nguoi_tu_vong: 0, nguyen_nhan: "Độc tố thực phẩm", trang_thai: "resolved", thoi_gian_xu_ly: "4 ngày" },
  { id: "ND004", ngay_bat_dau: "28/02/2026", dia_diem: "Nhà hàng Cơm Niêu Sài Gòn", khu_vuc: "Q.3, TP.HCM", so_nguoi: 18, nguoi_tu_vong: 0, nguyen_nhan: "Vi khuẩn E.coli", trang_thai: "resolved", thoi_gian_xu_ly: "3 ngày" },
  { id: "ND005", ngay_bat_dau: "25/02/2026", dia_diem: "Xưởng sản xuất Mì Hảo Hảo", khu_vuc: "Bình Dương", so_nguoi: 24, nguoi_tu_vong: 0, nguyen_nhan: "Hóa chất độc hại", trang_thai: "resolved", thoi_gian_xu_ly: "5 ngày" },
  { id: "ND006", ngay_bat_dau: "20/02/2026", dia_diem: "Trường THPT Nguyễn Du", khu_vuc: "Đà Nẵng", so_nguoi: 12, nguoi_tu_vong: 0, nguyen_nhan: "Vi khuẩn Salmonella", trang_thai: "resolved", thoi_gian_xu_ly: "3 ngày" },
  { id: "ND007", ngay_bat_dau: "15/02/2026", dia_diem: "Nhà hàng Phở 24", khu_vuc: "Q.1, TP.HCM", so_nguoi: 8, nguoi_tu_vong: 0, nguyen_nhan: "Độc tố thực phẩm", trang_thai: "resolved", thoi_gian_xu_ly: "2 ngày" },
  { id: "ND008", ngay_bat_dau: "10/02/2026", dia_diem: "Hộ gia đình", khu_vuc: "Hà Nội", so_nguoi: 4, nguoi_tu_vong: 1, nguyen_nhan: "Nấm độc", trang_thai: "resolved", thoi_gian_xu_ly: "1 ngày" },
  { id: "ND009", ngay_bat_dau: "05/02/2026", dia_diem: "Chợ đầu mối Bình Điền", khu_vuc: "Q.8, TP.HCM", so_nguoi: 16, nguoi_tu_vong: 0, nguyen_nhan: "Vi khuẩn E.coli", trang_thai: "resolved", thoi_gian_xu_ly: "3 ngày" },
  { id: "ND010", ngay_bat_dau: "01/02/2026", dia_diem: "Cty Nhập khẩu Thực phẩm Âu Á", khu_vuc: "Q.9, TP.HCM", so_nguoi: 6, nguoi_tu_vong: 0, nguyen_nhan: "Hóa chất độc hại", trang_thai: "resolved", thoi_gian_xu_ly: "4 ngày" },
];

export const poisoningByFoodType = [
  { foodType: "Hải sản", count: 32, percentage: 25.2 },
  { foodType: "Thịt gia cầm", count: 28, percentage: 22.0 },
  { foodType: "Rau củ quả", count: 24, percentage: 18.9 },
  { foodType: "Thịt lợn", count: 18, percentage: 14.2 },
  { foodType: "Sản phẩm sữa", count: 12, percentage: 9.4 },
  { foodType: "Đồ uống", count: 8, percentage: 6.3 },
  { foodType: "Khác", count: 5, percentage: 3.9 },
];

export const responseTimeStats = [
  { metric: "Thời gian trung bình để phát hiện", value: "4.2 giờ", benchmark: "≤ 6 giờ" },
  { metric: "Thời gian trung bình để xử lý", value: "2.8 ngày", benchmark: "≤ 3 ngày" },
  { metric: "Tỷ lệ điều tra nguyên nhân thành công", value: "94.5%", benchmark: "≥ 90%" },
  { metric: "Tỷ lệ xử lý triệt để", value: "98.4%", benchmark: "≥ 95%" },
];
