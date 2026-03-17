// Data samples for Báo cáo cơ sở (Facilities Report)

export const facilitySummaryCards = [
  { label: "Tổng cơ sở đăng ký", value: "24,580", change: "+5.2%", up: true },
  { label: "Cơ sở có chứng nhận ATTP", value: "18,420", change: "+8.7%", up: true },
  { label: "Cơ sở vi phạm", value: "1,247", change: "-12.4%", up: false },
  { label: "Tỷ lệ tuân thủ", value: "94.8%", change: "+2.1%", up: true },
];

export const facilityByType = [
  { type: "Nhà hàng ăn uống", total: 8420, certified: 7240, violation: 387 },
  { type: "Cửa hàng thực phẩm", total: 10240, certified: 8920, violation: 487 },
  { type: "Xưởng sản xuất", total: 2180, certified: 1980, violation: 156 },
  { type: "Chợ đầu mối", total: 420, certified: 380, violation: 42 },
  { type: "Kho bảo quản", total: 1320, certified: 1100, violation: 89 },
  { type: "Vận chuyển thực phẩm", total: 980, certified: 820, violation: 68 },
  { type: "Cơ sở bếp ăn tập thể", total: 1020, certified: 980, violation: 18 },
];

export const facilityByRegion = [
  { region: "Thành phố Hồ Chí Minh", total: 8420, certified: 7820, violation: 412 },
  { region: "Hà Nội", total: 6840, certified: 6480, violation: 324 },
  { region: "Đà Nẵng", total: 1280, certified: 1180, violation: 68 },
  { region: "Cần Thơ", total: 920, certified: 860, violation: 52 },
  { region: "Hải Phòng", total: 1240, certified: 1140, violation: 76 },
  { region: "Nghệ An", total: 840, certified: 740, violation: 84 },
  { region: "Thanh Hóa", total: 980, certified: 820, violation: 98 },
  { region: "Khánh Hòa", total: 760, certified: 680, violation: 62 },
  { region: "Bình Dương", total: 1180, certified: 1080, violation: 74 },
  { region: "Đồng Nai", total: 1120, certified: 1020, violation: 76 },
];

export const facilityTrendData = [
  { month: "T1", registered: 21800, certified: 16200, violations: 142 },
  { month: "T2", registered: 22400, certified: 16800, violations: 156 },
  { month: "T3", registered: 23100, certified: 17500, violations: 168 },
  { month: "T4", registered: 23800, certified: 18100, violations: 142 },
  { month: "T5", registered: 24200, certified: 18400, violations: 198 },
  { month: "T6", registered: 24600, certified: 18700, violations: 212 },
  { month: "T7", registered: 24900, certified: 18900, violations: 188 },
  { month: "T8", registered: 25200, certified: 19100, violations: 174 },
  { month: "T9", registered: 25800, certified: 19400, violation: 162 },
  { month: "T10", registered: 26200, certified: 19800, violations: 148 },
  { month: "T11", registered: 26800, certified: 20100, violations: 134 },
  { month: "T12", registered: 27500, certified: 20500, violations: 120 },
];

export const violationByCategory = [
  { category: "Vệ sinh cơ sở vật chất", count: 428, severity: "high" },
  { category: "Bảo quản thực phẩm", count: 387, severity: "high" },
  { category: "Giấy tờ chứng nhận", count: 312, severity: "medium" },
  { category: "Nhân viên y tế", count: 284, severity: "medium" },
  { category: "Nguồn gốc thực phẩm", count: 198, severity: "high" },
  { category: "Quy trình chế biến", count: 148, severity: "medium" },
];
