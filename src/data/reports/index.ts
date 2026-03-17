// Export all report data samples for "Báo cáo thống kê" feature

export * from './co-so-sample-data';
export * from './giay-attp-sample-data';
export * from './kiem-tra-sample-data';
export * from './ngo-doc-sample-data';
export * from './truyen-thong-sample-data';

// Summary of available data samples
export const REPORT_DATA_SUMMARY = {
  coSo: {
    name: "Báo cáo cơ sở",
    description: "Thống kê và báo cáo tình hình cơ sở kinh doanh",
    dataSets: [
      "facilitySummaryCards - Tổng quan số liệu",
      "facilityByType - Phân loại theo loại hình cơ sở",
      "facilityByRegion - Phân loại theo khu vực",
      "facilityTrendData - Xu hướng theo thời gian",
      "violationByCategory - Thống kê vi phạm theo danh mục"
    ]
  },
  giayATTP: {
    name: "Báo cáo giấy ATTP",
    description: "Thống kê giấy chứng nhận an toàn thực phẩm",
    dataSets: [
      "certificateSummaryCards - Tổng quan số liệu",
      "certificateByType - Phân loại theo loại giấy",
      "certificateByIndustry - Phân loại theo ngành nghề",
      "certificateTrendData - Xu hướng cấp phát theo thời gian",
      "expiringCertificates - Danh sách giấy sắp hết hạn",
      "renewalStats - Thống kê gia hạn"
    ]
  },
  kiemTra: {
    name: "Báo cáo kiểm tra",
    description: "Thống kê kết quả kiểm tra an toàn thực phẩm",
    dataSets: [
      "inspectionSummaryCards - Tổng quan số liệu",
      "inspectionByType - Phân loại theo loại kiểm tra",
      "inspectionByViolationLevel - Thống kê theo mức độ vi phạm",
      "inspectionTrendData - Xu hướng kiểm tra theo thời gian",
      "commonViolations - Các vi phạm phổ biến",
      "recentInspections - Danh sách kiểm tra gần đây",
      "inspectionByRegion - Phân loại theo khu vực"
    ]
  },
  ngoDoc: {
    name: "Báo cáo ngộ độc",
    description: "Thống kê các vụ ngộ độc thực phẩm",
    dataSets: [
      "poisoningSummaryCards - Tổng quan số liệu",
      "poisoningByCause - Phân loại theo nguyên nhân",
      "poisoningByLocation - Phân loại theo địa điểm",
      "poisoningTrendData - Xu hướng ngộ độc theo thời gian",
      "poisoningByRegion - Phân loại theo khu vực",
      "recentPoisoningCases - Danh sách vụ ngộ độc gần đây",
      "poisoningByFoodType - Phân loại theo loại thực phẩm",
      "responseTimeStats - Thống kê thời gian xử lý"
    ]
  },
  truyenThong: {
    name: "Báo cáo truyền thông",
    description: "Thống kê hoạt động truyền thông an toàn thực phẩm",
    dataSets: [
      "communicationSummaryCards - Tổng quan số liệu",
      "campaignByChannel - Phân loại theo kênh truyền thông",
      "campaignByTopic - Phân loại theo chủ đề",
      "communicationTrendData - Xu hướng hoạt động theo thời gian",
      "recentCampaigns - Danh sách chiến dịch gần đây",
      "topPerformingPosts - Bài đăng hiệu quả nhất",
      "audienceDemographics - Thống kê khán giả",
      "communicationByRegion - Phân loại theo khu vực",
      "engagementByContentType - Thống kê tương tác theo loại nội dung"
    ]
  }
} as const;

export type ReportDataType = keyof typeof REPORT_DATA_SUMMARY;
