// Shared mock data for all pages

export const companies = Array.from({ length: 30 }, (_, i) => ({
  id: `DN${String(i + 1).padStart(4, "0")}`,
  name: [
    "Công ty CP Nông sản Việt",
    "TNHH Thực phẩm Sạch",
    "HTX Nông nghiệp Xanh",
    "Công ty TNHH Rau củ Miền Bắc",
    "Trang trại Hữu Cơ Việt",
    "Công ty CP Thủy sản Sạch",
    "HTX Cà phê Tây Nguyên",
  ][i % 7],
  type: ["Công ty CP", "TNHH", "HTX", "Doanh nghiệp tư nhân"][i % 4],
  province: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ", "Lâm Đồng", "Nghệ An", "Bình Dương"][i % 7],
  status: ["active", "pending", "inactive"][i % 3],
  taxCode: `010${i + 1}00000${i + 1}`,
  phone: `0912${String(i + 1).padStart(6, "0")}`,
  products: 5 + i * 2,
  createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
}));

export const products = Array.from({ length: 40 }, (_, i) => ({
  id: `SP${String(i + 1).padStart(5, "0")}`,
  name: [
    "Gạo ST25",
    "Cà phê Robusta",
    "Chè Thái Nguyên",
    "Cá tra phi lê",
    "Tôm thẻ chân trắng",
    "Xoài cát Hòa Lộc",
    "Thanh long ruột đỏ",
    "Mít Thái",
  ][i % 8],
  category: ["Nông sản", "Thủy sản", "Thực phẩm chế biến", "Đồ uống"][i % 4],
  unit: ["kg", "tấn", "thùng", "lốc"][i % 4],
  company: companies[i % companies.length].name,
  status: ["active", "pending", "inactive"][i % 3],
  batchCount: Math.floor(3 + i * 0.8),
  createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
}));

export const certifications = Array.from({ length: 20 }, (_, i) => ({
  id: `CN${String(i + 1).padStart(4, "0")}`,
  name: ["VietGAP", "GlobalGAP", "HACCP", "ISO 22000", "Organic", "ASC"][i % 6],
  entity: companies[i % companies.length].name,
  type: ["Sản xuất", "Chế biến", "Vận chuyển"][i % 3],
  issuedAt: `2024-0${(i % 9) + 1}-15`,
  expiresAt: `2026-0${(i % 9) + 1}-15`,
  status: ["valid", "expiring", "expired"][i % 3],
  issuer: ["Cục BVTV", "SGS Việt Nam", "Bureau Veritas"][i % 3],
}));

export const alerts = Array.from({ length: 20 }, (_, i) => ({
  id: `CB${String(i + 1).padStart(4, "0")}`,
  title: [
    "Chứng nhận sắp hết hạn",
    "Phát hiện sản phẩm không rõ nguồn gốc",
    "Doanh nghiệp chưa cập nhật hồ sơ",
    "Sự kiện chuỗi cung ứng bất thường",
    "Lô hàng vi phạm quy định",
  ][i % 5],
  entity: companies[i % companies.length].name,
  level: ["high", "medium", "low"][i % 3],
  status: ["open", "processing", "resolved"][i % 3],
  createdAt: `2026-03-0${(i % 8) + 1}`,
}));

export const users = Array.from({ length: 15 }, (_, i) => ({
  id: `US${String(i + 1).padStart(4, "0")}`,
  name: ["Nguyễn Văn An", "Trần Thị Bình", "Lê Minh Cường", "Phạm Thị Dung", "Hoàng Văn Em"][i % 5],
  email: `user${i + 1}@tracechain.vn`,
  role: ["Quản trị viên", "Kiểm định viên", "Nhân viên", "Giám sát viên"][i % 4],
  department: ["Ban CNTT", "Ban Kiểm định", "Ban Quản lý", "Ban Giám sát"][i % 4],
  status: ["active", "inactive"][i % 2],
  lastLogin: `2026-03-0${(i % 8) + 1} ${8 + (i % 10)}:${String(i % 60).padStart(2, "0")}`,
}));

export const chains = Array.from({ length: 15 }, (_, i) => ({
  id: `CCU${String(i + 1).padStart(4, "0")}`,
  name: `Chuỗi ${["Gạo", "Cà phê", "Chè", "Cá tra", "Tôm"][i % 5]} ${String.fromCharCode(65 + i)}`,
  product: products[i % products.length].name,
  nodes: 3 + (i % 6),
  events: 12 + i * 3,
  status: ["active", "paused", "completed"][i % 3],
  startDate: `2024-0${(i % 9) + 1}-01`,
}));

export const batches = Array.from({ length: 25 }, (_, i) => ({
  id: `LH${String(i + 1).padStart(5, "0")}`,
  product: products[i % products.length].name,
  company: companies[i % companies.length].name,
  quantity: `${(10 + i * 5)} kg`,
  status: ["in-transit", "warehouse", "delivered", "recalled"][i % 4],
  productionDate: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  expiryDate: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
}));

// --- Scope/ABAC data for phân quyền dữ liệu ---

export const scopePartners = [
  { id: "DT001", ten: "Công ty AgriLink Hà Nội", tinh: "Hà Nội" },
  { id: "DT002", ten: "Đối tác Phân phối Miền Nam", tinh: "TP.HCM" },
  { id: "DT003", ten: "HTX Nông nghiệp Miền Trung", tinh: "Đà Nẵng" },
  { id: "DT004", ten: "Công ty CP Nông sản Đồng bằng", tinh: "Cần Thơ" },
  { id: "DT005", ten: "Đối tác Tây Nguyên Xanh", tinh: "Lâm Đồng" },
  { id: "DT006", ten: "Liên minh HTX Hà Nội", tinh: "Hà Nội" },
];

const _companyNames = [
  "Công ty CP Nông sản Việt", "TNHH Thực phẩm Sạch", "HTX Nông nghiệp Xanh",
  "Công ty TNHH Rau củ Miền Bắc", "Trang trại Hữu Cơ Việt",
  "Công ty CP Thủy sản Sạch", "HTX Cà phê Tây Nguyên",
];

export const scopeCompanies = Array.from({ length: 60 }, (_, i) => ({
  id: `SCN${String(i + 1).padStart(4, "0")}`,
  ten: _companyNames[i % _companyNames.length],
  doi_tac_id: ["DT001", "DT002", "DT003", "DT004", "DT005", "DT006"][i % 6],
  province: ["HN", "HCM", "DN", "CT", "LD", "NA", "BD"][i % 7],
  category_id: ["NS001", "TS001", "CB001"][i % 3],
}));

export const provinceTree = [
  { id: "HN",  ten: "Hà Nội",      so_quan: 30 },
  { id: "HCM", ten: "TP.HCM",      so_quan: 22 },
  { id: "DN",  ten: "Đà Nẵng",     so_quan: 8  },
  { id: "CT",  ten: "Cần Thơ",     so_quan: 9  },
  { id: "LD",  ten: "Lâm Đồng",    so_quan: 12 },
  { id: "NA",  ten: "Nghệ An",     so_quan: 21 },
  { id: "BD",  ten: "Bình Dương",  so_quan: 9  },
];

export const categoryTree = [
  { id: "NS001", ten: "Nông sản thực phẩm",     parent_id: null as string | null },
  { id: "NS002", ten: "Rau củ quả",              parent_id: "NS001" },
  { id: "NS003", ten: "Ngũ cốc & Lương thực",   parent_id: "NS001" },
  { id: "NS004", ten: "Gia vị & Thảo dược",     parent_id: "NS001" },
  { id: "TS001", ten: "Thủy sản",               parent_id: null as string | null },
  { id: "TS002", ten: "Thủy sản nuôi trồng",    parent_id: "TS001" },
  { id: "TS003", ten: "Thủy sản khai thác",     parent_id: "TS001" },
  { id: "CB001", ten: "Thực phẩm chế biến",     parent_id: null as string | null },
  { id: "CB002", ten: "Đồ hộp & Bảo quản",      parent_id: "CB001" },
  { id: "CB003", ten: "Thực phẩm đông lạnh",    parent_id: "CB001" },
];

// --- ProductReport mock data ---

export type ReportType = "counterfeit" | "suspicious" | "quality" | "expired" | "packaging";
export type ReportStatus = "submitted" | "resolved" | "completed" | "rejected";
export type ReportPriority = "critical" | "high" | "medium" | "low";
export type ScanResult = "fake" | "suspicious" | "authentic" | "unknown";

export interface ProductReport {
  id: string;
  report_code: string;
  product_name: string;
  gtin: string;
  sgtin?: string;
  partner_name: string;
  doi_tac_id: string;
  province: string;
  category_id: string;
  report_type: ReportType;
  status: ReportStatus;
  priority: ReportPriority;
  risk_score: number;
  scan_result: ScanResult;
  reporter_phone: string;
  reporter_name?: string;
  description: string;
  evidence_count: number;
  purchase_location: string;
  purchase_date: string;
  created_at: string;
}

export const reportTypeLabels: Record<ReportType, string> = {
  counterfeit: "Hàng giả",
  suspicious: "Nghi ngờ",
  quality: "Chất lượng",
  expired: "Hết hạn",
  packaging: "Bao bì",
};

export const priorityConfig: Record<ReportPriority, { label: string; variant: "danger" | "warning" | "info" | "neutral" }> = {
  critical: { label: "Khẩn cấp",  variant: "danger"  },
  high:     { label: "Cao",       variant: "warning" },
  medium:   { label: "Trung bình",variant: "info"    },
  low:      { label: "Thấp",      variant: "neutral" },
};

export const reportStatusConfig: Record<ReportStatus, { label: string; variant: "danger" | "warning" | "info" | "neutral" | "success" }> = {
  submitted:  { label: "Chưa xử lý",  variant: "info"    },
  resolved:   { label: "Đã xác minh", variant: "warning" },
  completed:  { label: "Hoàn thành",  variant: "success" },
  rejected:   { label: "Từ chối",     variant: "neutral" },
};

export const productReports: ProductReport[] = [
  {
    id: "rpt-001", report_code: "RPT-20260328-0001",
    product_name: "Gạo ST25 túi 5kg", gtin: "8938507512345", sgtin: "8938507512345.000001",
    partner_name: "Công ty AgriLink Hà Nội", doi_tac_id: "DT001", province: "HN", category_id: "NS001",
    report_type: "counterfeit", status: "submitted", priority: "critical", risk_score: 82,
    scan_result: "fake",
    reporter_phone: "0912***456", reporter_name: "Nguyễn Văn A",
    description: "Sản phẩm có bao bì giống hệt gạo ST25 chính hãng nhưng tem QR không quét được. Màu sắc gạo khác thường, mùi lạ.",
    evidence_count: 4, purchase_location: "Chợ Hà Đông, Hà Nội", purchase_date: "2026-03-27", created_at: "2026-03-28T08:15:00",
  },
  {
    id: "rpt-002", report_code: "RPT-20260327-0003",
    product_name: "Cà phê Robusta gói 500g", gtin: "8934567891234",
    partner_name: "Đối tác Tây Nguyên Xanh", doi_tac_id: "DT005", province: "LD", category_id: "CB001",
    report_type: "suspicious", status: "submitted", priority: "high", risk_score: 55,
    scan_result: "suspicious",
    reporter_phone: "0987***123",
    description: "Bao bì nhìn khác với sản phẩm tôi mua lần trước, logo hơi mờ, tem niêm phong bị bong.",
    evidence_count: 2, purchase_location: "Siêu thị BigC Đà Lạt, Lâm Đồng", purchase_date: "2026-03-25", created_at: "2026-03-27T14:30:00",
  },
  {
    id: "rpt-003", report_code: "RPT-20260326-0007",
    product_name: "Tôm thẻ chân trắng đông lạnh 1kg", gtin: "8936543210987",
    partner_name: "HTX Nông nghiệp Miền Trung", doi_tac_id: "DT003", province: "DN", category_id: "TS001",
    report_type: "expired", status: "resolved", priority: "high", risk_score: 45,
    scan_result: "authentic",
    reporter_phone: "0935***789", reporter_name: "Trần Thị B",
    description: "Sản phẩm đã quá hạn sử dụng 3 ngày nhưng vẫn được bày bán trên kệ siêu thị.",
    evidence_count: 3, purchase_location: "Siêu thị Co.opmart Đà Nẵng", purchase_date: "2026-03-24", created_at: "2026-03-26T10:00:00",
  },
  {
    id: "rpt-004", report_code: "RPT-20260325-0002",
    product_name: "Chè Thái Nguyên hộp 200g", gtin: "8931234567890",
    partner_name: "Công ty AgriLink Hà Nội", doi_tac_id: "DT001", province: "HN", category_id: "NS001",
    report_type: "quality", status: "completed", priority: "medium", risk_score: 18,
    scan_result: "authentic",
    reporter_phone: "0901***234",
    description: "Chè có mùi ẩm mốc, màu nước pha không đúng như thông tin trên bao bì.",
    evidence_count: 1, purchase_location: "Cửa hàng online, giao hàng tại Hà Nội", purchase_date: "2026-03-20", created_at: "2026-03-25T09:45:00",
  },
  {
    id: "rpt-005", report_code: "RPT-20260324-0005",
    product_name: "Cá tra phi lê đông lạnh 500g", gtin: "8937654321098",
    partner_name: "Đối tác Phân phối Miền Nam", doi_tac_id: "DT002", province: "HCM", category_id: "TS001",
    report_type: "counterfeit", status: "resolved", priority: "critical", risk_score: 91,
    scan_result: "fake",
    reporter_phone: "0969***567", reporter_name: "Lê Minh C",
    description: "Mã QR quét ra thông tin sản phẩm hoàn toàn khác. Bao bì in không sắc nét, địa chỉ nhà máy không tồn tại.",
    evidence_count: 5, purchase_location: "Chợ Bình Tây, TP.HCM", purchase_date: "2026-03-22", created_at: "2026-03-24T16:20:00",
  },
  {
    id: "rpt-006", report_code: "RPT-20260323-0009",
    product_name: "Gạo ST25 túi 5kg", gtin: "8938507512345", sgtin: "8938507512345.000087",
    partner_name: "Công ty AgriLink Hà Nội", doi_tac_id: "DT001", province: "HN", category_id: "NS001",
    report_type: "counterfeit", status: "submitted", priority: "critical", risk_score: 78,
    scan_result: "fake",
    reporter_phone: "0912***111",
    description: "Phát hiện sản phẩm có SGTIN đã được quét quá nhiều lần (>50 lần), nghi hàng giả sử dụng lại mã.",
    evidence_count: 2, purchase_location: "Tạp hóa đường Nguyễn Trãi, Hà Nội", purchase_date: "2026-03-23", created_at: "2026-03-23T11:00:00",
  },
  {
    id: "rpt-007", report_code: "RPT-20260322-0004",
    product_name: "Xoài cát Hòa Lộc thùng 10kg", gtin: "8939876543210",
    partner_name: "Công ty CP Nông sản Đồng bằng", doi_tac_id: "DT004", province: "CT", category_id: "NS001",
    report_type: "packaging", status: "submitted", priority: "medium", risk_score: 32,
    scan_result: "unknown",
    reporter_phone: "0778***900",
    description: "Nhãn dán trên thùng bị nhòe chữ, không đọc được ngày đóng gói và hạn dùng.",
    evidence_count: 2, purchase_location: "Cửa hàng trái cây đường 30/4, Cần Thơ", purchase_date: "2026-03-21", created_at: "2026-03-22T13:15:00",
  },
  {
    id: "rpt-008", report_code: "RPT-20260321-0011",
    product_name: "Thanh long ruột đỏ 1kg", gtin: "8935432198765",
    partner_name: "Đối tác Phân phối Miền Nam", doi_tac_id: "DT002", province: "HCM", category_id: "NS001",
    report_type: "quality", status: "submitted", priority: "low", risk_score: 12,
    scan_result: "authentic",
    reporter_phone: "0858***443",
    description: "Sản phẩm mua về bị hư hỏng, ruột bị nhũn dù còn 5 ngày nữa mới hết hạn.",
    evidence_count: 1, purchase_location: "VinMart Quận 7, TP.HCM", purchase_date: "2026-03-20", created_at: "2026-03-21T08:30:00",
  },
  {
    id: "rpt-009", report_code: "RPT-20260320-0006",
    product_name: "Cà phê Robusta gói 500g", gtin: "8934567891234",
    partner_name: "Đối tác Tây Nguyên Xanh", doi_tac_id: "DT005", province: "LD", category_id: "CB001",
    report_type: "counterfeit", status: "rejected", priority: "low", risk_score: 8,
    scan_result: "authentic",
    reporter_phone: "0933***222",
    description: "Nghi ngờ hàng giả nhưng sau kiểm tra thực tế là do người dùng so sánh nhầm với phiên bản bao bì cũ.",
    evidence_count: 1, purchase_location: "Grab Mart, giao hàng Lâm Đồng", purchase_date: "2026-03-19", created_at: "2026-03-20T15:00:00",
  },
  {
    id: "rpt-010", report_code: "RPT-20260319-0008",
    product_name: "Mít Thái thùng 5kg", gtin: "8932109876543",
    partner_name: "Liên minh HTX Hà Nội", doi_tac_id: "DT006", province: "HN", category_id: "NS001",
    report_type: "suspicious", status: "submitted", priority: "medium", risk_score: 38,
    scan_result: "suspicious",
    reporter_phone: "0912***787",
    description: "QR code quét được nhưng thông tin hiển thị không khớp với sản phẩm cầm trên tay (tên sản phẩm khác).",
    evidence_count: 3, purchase_location: "Chợ Long Biên, Hà Nội", purchase_date: "2026-03-18", created_at: "2026-03-19T10:20:00",
  },
  {
    id: "rpt-011", report_code: "RPT-20260318-0012",
    product_name: "Tôm thẻ chân trắng đông lạnh 1kg", gtin: "8936543210987",
    partner_name: "HTX Nông nghiệp Miền Trung", doi_tac_id: "DT003", province: "DN", category_id: "TS001",
    report_type: "counterfeit", status: "resolved", priority: "high", risk_score: 63,
    scan_result: "suspicious",
    reporter_phone: "0905***654", reporter_name: "Phạm Văn D",
    description: "Mua tại điểm bán lẻ nhưng bao bì in chữ mờ hơn so với hàng mua tại siêu thị. Tem QR in lại trên giấy dán.",
    evidence_count: 3, purchase_location: "Chợ Cồn, Đà Nẵng", purchase_date: "2026-03-17", created_at: "2026-03-18T09:00:00",
  },
  {
    id: "rpt-012", report_code: "RPT-20260317-0014",
    product_name: "Gạo ST25 túi 5kg", gtin: "8938507512345",
    partner_name: "Công ty AgriLink Hà Nội", doi_tac_id: "DT001", province: "HN", category_id: "NS001",
    report_type: "suspicious", status: "submitted", priority: "high", risk_score: 47,
    scan_result: "suspicious",
    reporter_phone: "0974***345",
    description: "Người bán không xuất trình được hóa đơn nguồn gốc, giá bán thấp hơn thị trường 30%.",
    evidence_count: 2, purchase_location: "Đường Lê Duẩn, Hà Nội", purchase_date: "2026-03-16", created_at: "2026-03-17T14:00:00",
  },
  {
    id: "rpt-013", report_code: "RPT-20260316-0003",
    product_name: "Chè Thái Nguyên hộp 200g", gtin: "8931234567890",
    partner_name: "Liên minh HTX Hà Nội", doi_tac_id: "DT006", province: "HN", category_id: "NS001",
    report_type: "packaging", status: "completed", priority: "low", risk_score: 5,
    scan_result: "authentic",
    reporter_phone: "0886***012",
    description: "Hộp bị móp góc khi nhận hàng, tem niêm phong vẫn nguyên vẹn.",
    evidence_count: 1, purchase_location: "Shopee Mall, giao hàng Hà Nội", purchase_date: "2026-03-15", created_at: "2026-03-16T11:30:00",
  },
  {
    id: "rpt-014", report_code: "RPT-20260315-0010",
    product_name: "Cá tra phi lê đông lạnh 500g", gtin: "8937654321098",
    partner_name: "Đối tác Phân phối Miền Nam", doi_tac_id: "DT002", province: "HCM", category_id: "TS001",
    report_type: "counterfeit", status: "submitted", priority: "critical", risk_score: 85,
    scan_result: "fake",
    reporter_phone: "0922***678", reporter_name: "Hoàng Thị E",
    description: "QR code dẫn đến trang web lạ không phải NDATrace. Sản phẩm không có mùi đặc trưng, nghi bị tráo hàng.",
    evidence_count: 4, purchase_location: "Chợ đầu mối Bình Điền, TP.HCM", purchase_date: "2026-03-14", created_at: "2026-03-15T07:45:00",
  },
  {
    id: "rpt-015", report_code: "RPT-20260314-0016",
    product_name: "Thanh long ruột đỏ 1kg", gtin: "8935432198765",
    partner_name: "Đối tác Phân phối Miền Nam", doi_tac_id: "DT002", province: "HCM", category_id: "NS001",
    report_type: "expired", status: "completed", priority: "medium", risk_score: 22,
    scan_result: "authentic",
    reporter_phone: "0944***890",
    description: "Sản phẩm hết hạn 2 ngày, cửa hàng đã thu hồi và xin lỗi. Báo cáo để ghi nhận.",
    evidence_count: 1, purchase_location: "Bách Hóa Xanh Quận 1, TP.HCM", purchase_date: "2026-03-13", created_at: "2026-03-14T16:00:00",
  },
];

export interface ReportVerification {
  id: string;
  report_id: string;
  product_exists: boolean;
  product_status: string;
  uid_status: string;
  uid_scan_count: number;
  uid_last_scan_location: string;
  certificate_status: string;
  certificate_expiry: string;
  recent_inspection_result: string;
  recent_inspection_date: string;
  related_reports_count: number;
  related_reports_same_sgtin: number;
  partner_violation_history: number;
  evidence_quality?: string;
  description_consistency?: string;
  location_consistency?: string;
  admin_assessment?: string;
  risk_score: number;
  verdict?: string;
  recommended_action?: string;
}

export const reportVerifications: ReportVerification[] = [
  {
    id: "rv-001", report_id: "rpt-001",
    product_exists: true, product_status: "Hoạt động",
    uid_status: "revoked", uid_scan_count: 58, uid_last_scan_location: "TP.HCM",
    certificate_status: "valid", certificate_expiry: "2027-06-30",
    recent_inspection_result: "Đạt", recent_inspection_date: "2025-12-15",
    related_reports_count: 5, related_reports_same_sgtin: 3,
    partner_violation_history: 1, risk_score: 82,
  },
  {
    id: "rv-002", report_id: "rpt-002",
    product_exists: true, product_status: "Hoạt động",
    uid_status: "activated", uid_scan_count: 4, uid_last_scan_location: "Lâm Đồng",
    certificate_status: "expiring", certificate_expiry: "2026-04-20",
    recent_inspection_result: "Đạt có điều kiện", recent_inspection_date: "2026-02-10",
    related_reports_count: 2, related_reports_same_sgtin: 0,
    partner_violation_history: 0, risk_score: 55,
  },
  {
    id: "rv-005", report_id: "rpt-005",
    product_exists: true, product_status: "Hoạt động",
    uid_status: "revoked", uid_scan_count: 102, uid_last_scan_location: "Hà Nội",
    certificate_status: "expired", certificate_expiry: "2025-11-01",
    recent_inspection_result: "Không đạt", recent_inspection_date: "2026-01-05",
    related_reports_count: 7, related_reports_same_sgtin: 2,
    partner_violation_history: 3, risk_score: 91,
  },
  {
    id: "rv-006", report_id: "rpt-006",
    product_exists: true, product_status: "Hoạt động",
    uid_status: "used", uid_scan_count: 54, uid_last_scan_location: "Hà Nội",
    certificate_status: "valid", certificate_expiry: "2027-06-30",
    recent_inspection_result: "Đạt", recent_inspection_date: "2025-12-15",
    related_reports_count: 5, related_reports_same_sgtin: 2,
    partner_violation_history: 1, risk_score: 78,
  },
  {
    id: "rv-014", report_id: "rpt-014",
    product_exists: true, product_status: "Hoạt động",
    uid_status: "revoked", uid_scan_count: 89, uid_last_scan_location: "Hà Nội",
    certificate_status: "expired", certificate_expiry: "2025-09-15",
    recent_inspection_result: "Không đạt", recent_inspection_date: "2025-10-20",
    related_reports_count: 4, related_reports_same_sgtin: 1,
    partner_violation_history: 2, risk_score: 85,
  },
];

export const phanQuyenRoles = [
  { id: "super-admin",        ten: "Quản trị viên quốc gia",            mo_ta: "Quản trị toàn bộ hệ thống NDATrace, không giới hạn phạm vi địa lý hay ngành hàng",            so_nguoi: 3,   scope_configured: true,  layer: "national", ngay_tao: "01/01/2024", trang_thai: "Hoạt động"     },
  { id: "bo-ban-nganh-admin", ten: "Quản trị hệ thống Bộ NN&PTNT",     mo_ta: "Cấu hình và quản trị người dùng cho Bộ Nông nghiệp & Phát triển Nông thôn",                  so_nguoi: 12,  scope_configured: true,  layer: "sector",   ngay_tao: "15/01/2024", trang_thai: "Hoạt động"     },
  { id: "bo-ban-nganh-ops",   ten: "Vận hành nghiệp vụ Bộ Công Thương", mo_ta: "Xử lý hồ sơ ATTP và theo dõi ngành hàng tiêu dùng trong phạm vi Bộ Công Thương",            so_nguoi: 45,  scope_configured: false, layer: "sector",   ngay_tao: "20/01/2024", trang_thai: "Hoạt động"     },
  { id: "so-tinh-admin",      ten: "Quản trị hệ thống Sở Y tế TP.HCM", mo_ta: "Quản lý tài khoản và cấu hình phân quyền cho Sở Y tế Thành phố Hồ Chí Minh",               so_nguoi: 63,  scope_configured: false, layer: "sector",   ngay_tao: "01/02/2024", trang_thai: "Hoạt động"     },
  { id: "so-tinh-ops",        ten: "Vận hành Sở Nông nghiệp Hà Nội",   mo_ta: "Vận hành nghiệp vụ ATTP cho ngành nông sản thực phẩm tại địa bàn thành phố Hà Nội",          so_nguoi: 248, scope_configured: false, layer: "sector",   ngay_tao: "10/02/2024", trang_thai: "Hoạt động"     },
  { id: "dai-ly-admin",       ten: "Quản trị Đại lý AgriLink Hà Nội",  mo_ta: "Quản lý tài khoản và cấu hình dữ liệu trong phạm vi Đại lý AgriLink Hà Nội",                so_nguoi: 28,  scope_configured: true,  layer: "agency",   ngay_tao: "15/03/2024", trang_thai: "Hoạt động"     },
  { id: "dai-ly-ops",         ten: "Vận hành Đại lý Phân phối Miền Nam",mo_ta: "Khai báo và vận hành nghiệp vụ truy xuất nguồn gốc cho Đại lý Phân phối khu vực Miền Nam",  so_nguoi: 142, scope_configured: true,  layer: "agency",   ngay_tao: "01/04/2024", trang_thai: "Không hoạt động" },
];
