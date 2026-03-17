// Data samples for Báo cáo giấy ATTP (ATTP Certificates Report)

export const certificateSummaryCards = [
  { label: "Giấy chứng nhận ATTP", value: "18,420", change: "+8.7%", up: true },
  { label: "Sắp hết hạn", value: "2,847", change: "+12.4%", up: false },
  { label: "Đã gia hạn", value: "4,284", change: "+15.2%", up: true },
  { label: "Đã thu hồi", value: "384", change: "-5.6%", up: false },
];

export const certificateByType = [
  { type: "Giấy chứng nhận cơ sở đủ điều kiện ATTP", issued: 12840, active: 11840, expired: 1000 },
  { type: "Giấy chứng nhận cơ sở đủ điều kiện VSTP", issued: 4520, active: 4280, expired: 240 },
  { type: "Giấy xác nhận kiến thức ATTP", issued: 6280, active: 5840, expired: 440 },
  { type: "Giấy chứng nhận sản phẩm đạt chuẩn", issued: 2480, active: 2180, expired: 300 },
  { type: "Giấy tiếp nhận đăng ký SC", issued: 18420, active: 16240, expired: 2180 },
];

export const certificateByIndustry = [
  { industry: "Nhà hàng ăn uống", total: 7240, valid: 6840, expiring: 400 },
  { industry: "Thực phẩm chế biến sẵn", total: 3840, valid: 3480, expiring: 360 },
  { industry: "Đồ uống", total: 2180, valid: 1980, expiring: 200 },
  { industry: "Nguyên liệu thực phẩm", total: 1820, valid: 1680, expiring: 140 },
  { industry: "Bếp ăn tập thể", total: 980, valid: 940, expiring: 40 },
  { industry: "Kho vận", total: 680, valid: 640, expiring: 40 },
  { industry: "Vận chuyển thực phẩm", total: 420, valid: 380, expiring: 40 },
  { industry: "Khác", total: 1260, valid: 1120, expiring: 140 },
];

export const certificateTrendData = [
  { month: "T1", issued: 1240, renewed: 280, revoked: 28, expired: 84 },
  { month: "T2", issued: 1380, renewed: 320, revoked: 32, expired: 96 },
  { month: "T3", issued: 1420, renewed: 340, revoked: 24, expired: 108 },
  { month: "T4", issued: 1280, renewed: 380, revoked: 36, expired: 124 },
  { month: "T5", issued: 1580, renewed: 420, revoked: 28, expired: 142 },
  { month: "T6", issued: 1620, renewed: 480, revoked: 32, expired: 168 },
  { month: "T7", issued: 1480, renewed: 520, revoked: 28, expired: 196 },
  { month: "T8", issued: 1520, renewed: 580, revoked: 24, expired: 224 },
  { month: "T9", issued: 1640, renewed: 640, revoked: 32, expired: 252 },
  { month: "T10", issued: 1720, renewed: 720, revoked: 28, expired: 280 },
  { month: "T11", issued: 1840, renewed: 840, revoked: 24, expired: 312 },
  { month: "T12", issued: 1960, renewed: 920, revoked: 32, expired: 340 },
];

export const expiringCertificates = [
  { id: "GC001", ten_co_so: "Nhà hàng Hải Sản VIP", loai_giay: "GC đủ điều kiện ATTP", ngay_cap: "15/03/2021", ngay_het_han: "15/03/2026", tinh_trang: "critical", dia_chi: "Q.1, TP.HCM" },
  { id: "GC002", ten_co_so: "Cty CP Thực phẩm Đông Dương", loai_giay: "GC sản phẩm đạt chuẩn", ngay_cap: "20/04/2021", ngay_het_han: "20/04/2026", tinh_trang: "critical", dia_chi: "Q.7, TP.HCM" },
  { id: "GC003", ten_co_so: "Nhà hàng Cơm Niêu Sài Gòn", loai_giay: "GC đủ điều kiện ATTP", ngay_cap: "01/05/2021", ngay_het_han: "01/05/2026", tinh_trang: "warning", dia_chi: "Q.3, TP.HCM" },
  { id: "GC004", ten_co_so: "Xưởng sản xuất Mì Hảo Hảo", loai_giay: "GC đủ điều kiện VSTP", ngay_cap: "10/06/2021", ngay_het_han: "10/06/2026", tinh_trang: "warning", dia_chi: "Bình Dương" },
  { id: "GC005", ten_co_so: "Cửa hàng thực phẩm sạch Organic", loai_giay: "GC đủ điều kiện ATTP", ngay_cap: "25/07/2021", ngay_het_han: "25/07/2026", tinh_trang: "warning", dia_chi: "Q.2, TP.HCM" },
  { id: "GC006", ten_co_so: "Bếp ăn tập thể Công ty Samsung", loai_giay: "GC đủ điều kiện ATTP", ngay_cap: "15/08/2021", ngay_het_han: "15/08/2026", tinh_trang: "normal", dia_chi: "Bắc Ninh" },
  { id: "GC007", ten_co_so: "Nhà hàng Phở 24", loai_giay: "GC đủ điều kiện ATTP", ngay_cap: "01/09/2021", ngay_het_han: "01/09/2026", tinh_trang: "normal", dia_chi: "Q.1, TP.HCM" },
  { id: "GC008", ten_co_so: "Cty CP Nước giải khát Tân Hiệp Phát", loai_giay: "GC sản phẩm đạt chuẩn", ngay_cap: "20/10/2021", ngay_het_han: "20/10/2026", tinh_trang: "normal", dia_chi: "Bình Dương" },
  { id: "GC009", ten_co_so: "Chợ đầu mối Bình Điền", loai_giay: "GC đủ điều kiện VSTP", ngay_cap: "05/11/2021", ngay_het_han: "05/11/2026", tinh_trang: "normal", dia_chi: "Q.8, TP.HCM" },
  { id: "GC010", ten_co_so: "Cty Nhập khẩu Thực phẩm Âu Á", loai_giay: "GC đủ điều kiện ATTP", ngay_cap: "15/12/2021", ngay_het_han: "15/12/2026", tinh_trang: "normal", dia_chi: "Q.9, TP.HCM" },
];

export const renewalStats = [
  { type: "Gia hạn đúng hạn", count: 3842, percentage: 89.7, color: "#22c55e" },
  { type: "Gia hạn quá hạn < 30 ngày", count: 328, percentage: 7.7, color: "#f59e0b" },
  { type: "Gia hạn quá hạn > 30 ngày", count: 84, percentage: 2.0, color: "#ef4444" },
  { type: "Chưa gia hạn", count: 30, percentage: 0.6, color: "#6b7280" },
];
