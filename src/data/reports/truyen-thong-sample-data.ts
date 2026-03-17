// Data samples for Báo cáo truyền thông (Communication Reports)

export const communicationSummaryCards = [
  { label: "Chiến dịch truyền thông", value: "28", change: "+16.7%", up: true },
  { label: "Bài đăng truyền thông", value: "1,487", change: "+24.3%", up: true },
  { label: "Lượt tiếp cận", value: "2.8M", change: "+32.1%", up: true },
  { label: "Tương tác tích cực", value: "847K", change: "+28.6%", up: true },
];

export const campaignByChannel = [
  { channel: "Facebook", campaigns: 12, posts: 624, reach: 1200000, engagement: 384000 },
  { channel: "YouTube", campaigns: 6, posts: 84, reach: 840000, engagement: 168000 },
  { channel: "TikTok", campaigns: 4, posts: 128, reach: 480000, engagement: 192000 },
  { channel: "Website", campaigns: 4, posts: 428, reach: 240000, engagement: 72000 },
  { channel: "Zalo", campaigns: 2, posts: 223, reach: 40000, engagement: 31000 },
];

export const campaignByTopic = [
  { topic: "Kiến thức ATTP cơ bản", campaigns: 8, posts: 428, reach: 840000, engagement: 284000 },
  { topic: "Cách nhận biết thực phẩm không an toàn", campaigns: 6, posts: 312, reach: 680000, engagement: 224000 },
  { topic: "Quy trình bảo quản thực phẩm", campaigns: 5, posts: 284, reach: 520000, engagement: 168000 },
  { topic: "Nghĩa vụ của cơ sở kinh doanh", campaigns: 4, posts: 196, reach: 380000, engagement: 96000 },
  { topic: "Quyền lợi của người tiêu dùng", campaigns: 3, posts: 148, reach: 280000, engagement: 56000 },
  { topic: "Cập nhật quy định mới", campaigns: 2, posts: 119, reach: 100000, engagement: 19000 },
];

export const communicationTrendData = [
  { month: "T1", posts: 84, reach: 180000, engagement: 52000 },
  { month: "T2", posts: 108, reach: 220000, engagement: 68000 },
  { month: "T3", posts: 124, reach: 260000, engagement: 78000 },
  { month: "T4", posts: 142, reach: 300000, engagement: 92000 },
  { month: "T5", posts: 168, reach: 340000, engagement: 108000 },
  { month: "T6", posts: 184, reach: 380000, engagement: 124000 },
  { month: "T7", posts: 156, reach: 320000, engagement: 104000 },
  { month: "T8", posts: 142, reach: 300000, engagement: 96000 },
  { month: "T9", posts: 128, reach: 280000, engagement: 88000 },
  { month: "T10", posts: 148, reach: 320000, engagement: 104000 },
  { month: "T11", posts: 164, reach: 360000, engagement: 116000 },
  { month: "T12", posts: 1487, reach: 2800000, engagement: 847000 },
];

export const recentCampaigns = [
  { id: "TT001", ten_chien_dich: "Tháng hành động ATTP 2026", kenh: "Đa kênh", ngay_bat_dau: "01/03/2026", ngay_ket_thuc: "31/03/2026", bai_dang: 84, tiep_can: 480000, tuong_tac: 168000, trang_thai: "active" },
  { id: "TT002", ten_chien_dich: "An toàn thực phẩm mùa Tết", kenh: "Facebook", ngay_bat_dau: "15/01/2026", ngay_ket_thuc: "15/02/2026", bai_dang: 32, tiep_can: 320000, tuong_tac: 96000, trang_thai: "completed" },
  { id: "TT003", ten_chien_dich: "Kiến thức ATTP cho trẻ em", kenh: "YouTube", ngay_bat_dau: "01/02/2026", ngay_ket_thuc: "28/02/2026", bai_dang: 16, tiep_can: 240000, tuong_tac: 48000, trang_thai: "completed" },
  { id: "TT004", ten_chien_dich: "Nhận biết thực phẩm bẩn", kenh: "TikTok", ngay_bat_dau: "10/02/2026", ngay_ket_thuc: "10/03/2026", bai_dang: 48, tiep_can: 360000, tuong_tac: 144000, trang_thai: "completed" },
  { id: "TT005", ten_chien_dich: "Quy định mới về ATTP", kenh: "Website", ngay_bat_dau: "01/01/2026", ngay_ket_thuc: "31/01/2026", bai_dang: 24, tiep_can: 120000, tuong_tac: 24000, trang_thai: "completed" },
  { id: "TT006", ten_chien_dich: "ATTP cho bếp ăn gia đình", kenh: "Zalo", ngay_bat_dau: "15/01/2026", ngay_ket_thuc: "15/02/2026", bai_dang: 28, tiep_can: 40000, tuong_tac: 31000, trang_thai: "completed" },
  { id: "TT007", ten_chien_dich: "An toàn thực phẩm mùa hè", kenh: "Facebook", ngay_bat_dau: "01/05/2026", ngay_ket_thuc: "31/05/2026", bai_dang: 40, tiep_can: 280000, tuong_tac: 84000, trang_thai: "upcoming" },
  { id: "TT008", ten_chien_dich: "ATTP cho người cao tuổi", kenh: "YouTube", ngay_bat_dau: "01/06/2026", ngay_ket_thuc: "30/06/2026", bai_dang: 12, tiep_can: 180000, tuong_tac: 36000, trang_thai: "upcoming" },
];

export const topPerformingPosts = [
  { rank: 1, tieu_de: "5 dấu hiệu nhận biết thực phẩm bẩn", kenh: "TikTok", luot_xem: 128000, tuong_tac: 64000, ngay_dang: "15/02/2026" },
  { rank: 2, tieu_de: "Cách bảo quản thực phẩm trong tủ lạnh", kenh: "YouTube", luot_xem: 96000, tuong_tac: 24000, ngay_dang: "10/02/2026" },
  { rank: 3, tieu_de: "Quy định mới về chứng nhận ATTP", kenh: "Facebook", luot_xem: 84000, tuong_tac: 28000, ngay_dang: "05/02/2026" },
  { rank: 4, tieu_de: "An toàn thực phẩm cho trẻ em", kenh: "YouTube", luot_xem: 72000, tuong_tac: 18000, ngay_dang: "20/01/2026" },
  { rank: 5, tieu_de: "Kiểm tra thực phẩm trước khi mua", kenh: "Facebook", luot_xem: 68000, tuong_tac: 22000, ngay_dang: "25/01/2026" },
  { rank: 6, tieu_de: "ATTP mùa Tết Nguyên Đán", kenh: "Facebook", luot_xem: 64000, tuong_tac: 20000, ngay_dang: "10/01/2026" },
  { rank: 7, tieu_de: "Cách rửa rau củ quả đúng cách", kenh: "TikTok", luot_xem: 56000, tuong_tac: 28000, ngay_dang: "18/02/2026" },
  { rank: 8, tieu_de: "Quyền lợi khi mua thực phẩm", kenh: "Website", luot_xem: 48000, tuong_tac: 8000, ngay_dang: "15/01/2026" },
  { rank: 9, tieu_de: "ATTP cho người già", kenh: "Zalo", luot_xem: 24000, tuong_tac: 18000, ngay_dang: "20/01/2026" },
  { rank: 10, tieu_de: "Tháng hành động ATTP 2026", kenh: "Facebook", luot_xem: 18000, tuong_tac: 6000, ngay_dang: "01/03/2026" },
];

export const audienceDemographics = [
  { ageGroup: "18-24", percentage: 28.4, gender: "Nữ chiếm 65%" },
  { ageGroup: "25-34", percentage: 35.6, gender: "Nữ chiếm 58%" },
  { ageGroup: "35-44", percentage: 22.8, gender: "Nữ chiếm 52%" },
  { ageGroup: "45-54", percentage: 9.2, gender: "Nam chiếm 55%" },
  { ageGroup: "55+", percentage: 4.0, gender: "Nam chiếm 60%" },
];

export const communicationByRegion = [
  { region: "Thành phố Hồ Chí Minh", campaigns: 8, posts: 384, reach: 840000, engagement: 284000 },
  { region: "Hà Nội", campaigns: 6, posts: 284, reach: 680000, engagement: 224000 },
  { region: "Đà Nẵng", campaigns: 4, posts: 168, reach: 320000, engagement: 96000 },
  { region: "Cần Thơ", campaigns: 3, posts: 124, reach: 240000, engagement: 72000 },
  { region: "Hải Phòng", campaigns: 3, posts: 124, reach: 240000, engagement: 72000 },
  { region: "Khác", campaigns: 4, posts: 403, reach: 480000, engagement: 99000 },
];

export const engagementByContentType = [
  { type: "Video", count: 84, avgEngagement: 68.4, percentage: 38.2 },
  { type: "Infographic", count: 324, avgEngagement: 42.8, percentage: 28.6 },
  { type: "Bài viết", count: 684, avgEngagement: 28.4, percentage: 22.8 },
  { type: "Livestream", count: 12, avgEngagement: 84.2, percentage: 8.4 },
  { type: "Khác", count: 383, avgEngagement: 18.4, percentage: 2.0 },
];
