"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import { Plus, AlertTriangle, Search, CheckCircle, Clock, FlaskConical, MapPin, Factory, Truck, Store, Package } from "lucide-react";

// ── Truy xuất nguồn gốc sản phẩm ─────────────────────────────────────────────
type TraceStep = { buoc: string; icon: string; tenDonVi: string; diaChi: string; ngay: string; ghiChu: string };
type ProductTrace = { tenSanPham: string; maSanPham: string; loai: string; hanSuDung: string; steps: TraceStep[] };

const productTraceability: Record<string, ProductTrace> = {
  "SP-GA-001": {
    tenSanPham: "Thịt gà đông lạnh",
    maSanPham: "SP-GA-001",
    loai: "Thịt gia cầm",
    hanSuDung: "05/01/2025",
    steps: [
      { buoc: "Nguồn gốc", icon: "farm", tenDonVi: "Trang trại gà Minh Phát", diaChi: "Long An", ngay: "28/12/2024", ghiChu: "Gà thịt công nghiệp, kiểm dịch đạt yêu cầu" },
      { buoc: "Giết mổ & Sơ chế", icon: "factory", tenDonVi: "Lò giết mổ An Hạ", diaChi: "Củ Chi, TP.HCM", ngay: "30/12/2024", ghiChu: "Giết mổ theo quy trình HACCP, nhiệt độ bảo quản ≤ 4°C" },
      { buoc: "Phân phối", icon: "truck", tenDonVi: "Công ty Phân phối Thực phẩm Tươi Sống", diaChi: "Bình Dương", ngay: "02/01/2025", ghiChu: "Xe lạnh chuyên dụng, nhiệt độ vận chuyển 0–4°C" },
      { buoc: "Cung cấp cho cơ sở", icon: "store", tenDonVi: "Bếp ăn Công ty Pou Yuen", diaChi: "234 Tên Lửa, Bình Tân, TP.HCM", ngay: "04/01/2025", ghiChu: "Nhận hàng lúc 6:00 sáng, không kiểm tra nhiệt độ đầu vào" },
    ],
  },
  "SP-RAU-002": {
    tenSanPham: "Rau sống (xà lách, rau thơm)",
    maSanPham: "SP-RAU-002",
    loai: "Rau củ quả",
    hanSuDung: "02/02/2025",
    steps: [
      { buoc: "Nguồn gốc", icon: "farm", tenDonVi: "HTX Rau sạch Củ Chi", diaChi: "Củ Chi, TP.HCM", ngay: "31/01/2025", ghiChu: "Rau VietGAP, kiểm tra dư lượng thuốc trừ sâu đạt" },
      { buoc: "Sơ chế & Đóng gói", icon: "factory", tenDonVi: "Cơ sở sơ chế Hương Đồng", diaChi: "Hóc Môn, TP.HCM", ngay: "01/02/2025", ghiChu: "Rửa sơ bộ bằng nước sạch, không khử trùng đúng quy trình" },
      { buoc: "Phân phối", icon: "truck", tenDonVi: "Chợ đầu mối Thủ Đức", diaChi: "Thủ Đức, TP.HCM", ngay: "02/02/2025", ghiChu: "Giao hàng tại chợ, không kiểm soát nhiệt độ" },
      { buoc: "Cung cấp cho cơ sở", icon: "store", tenDonVi: "Canteen ĐH Bách Khoa", diaChi: "268 Lý Thường Kiệt, Q.10, TP.HCM", ngay: "02/02/2025", ghiChu: "Rau được sử dụng ngay mà không rửa lại bằng nước sạch" },
    ],
  },
  "SP-HAI-003": {
    tenSanPham: "Hải sản hỗn hợp (tôm, mực, nghêu)",
    maSanPham: "SP-HAI-003",
    loai: "Hải sản",
    hanSuDung: "25/01/2025",
    steps: [
      { buoc: "Nguồn gốc", icon: "farm", tenDonVi: "Cảng cá Bình Đông", diaChi: "Q.8, TP.HCM", ngay: "23/01/2025", ghiChu: "Hải sản khai thác nội địa, không có giấy kiểm dịch thú y" },
      { buoc: "Sơ chế", icon: "factory", tenDonVi: "Cơ sở hải sản Năm Phong", diaChi: "Q.4, TP.HCM", ngay: "24/01/2025", ghiChu: "Bảo quản tại nhiệt độ phòng quá 2 giờ trước khi ướp đá" },
      { buoc: "Phân phối", icon: "truck", tenDonVi: "Đại lý hải sản Hoàng Long", diaChi: "Q.4, TP.HCM", ngay: "25/01/2025", ghiChu: "Giao hàng buổi sáng, xe không có hệ thống làm lạnh" },
      { buoc: "Cung cấp cho cơ sở", icon: "store", tenDonVi: "Nhà hàng Bông Sen", diaChi: "Đường Nguyễn Lương Bằng, Q.7, TP.HCM", ngay: "25/01/2025", ghiChu: "Hải sản bảo quản trong tủ lạnh nhưng không đủ nhiệt độ (8°C thay vì ≤4°C)" },
    ],
  },
  "SP-COM-004": {
    tenSanPham: "Cơm hộp chế biến sẵn",
    maSanPham: "SP-COM-004",
    loai: "Thức ăn chế biến sẵn",
    hanSuDung: "14/02/2025",
    steps: [
      { buoc: "Nguồn gốc nguyên liệu", icon: "farm", tenDonVi: "Chợ đầu mối Bình Điền", diaChi: "Q.8, TP.HCM", ngay: "13/02/2025", ghiChu: "Mua thịt heo, rau củ tổng hợp tại chợ, không có chứng từ nguồn gốc" },
      { buoc: "Chế biến", icon: "factory", tenDonVi: "Bếp ăn Samsung HCMC", diaChi: "Khu CX Bình Thới, Q.9, TP.HCM", ngay: "14/02/2025", ghiChu: "Thực phẩm chế biến xong để ở nhiệt độ phòng hơn 4 tiếng trước khi phục vụ" },
      { buoc: "Phân phát nội bộ", icon: "truck", tenDonVi: "Bộ phận logistics nội bộ Samsung", diaChi: "Khu CX Bình Thới, Q.9", ngay: "14/02/2025", ghiChu: "Cơm được đóng hộp và vận chuyển đến các phân xưởng mà không giữ nhiệt" },
      { buoc: "Phục vụ", icon: "store", tenDonVi: "Canteen xưởng sản xuất Samsung", diaChi: "Khu CX Bình Thới, Q.9, TP.HCM", ngay: "14/02/2025", ghiChu: "Phục vụ ca 2 lúc 18:00, thức ăn đã nguội và có dấu hiệu biến chất" },
    ],
  },
  "SP-CA-005": {
    tenSanPham: "Cá nóc chế biến (món nhậu)",
    maSanPham: "SP-CA-005",
    loai: "Hải sản đặc biệt",
    hanSuDung: "05/03/2025",
    steps: [
      { buoc: "Nguồn gốc", icon: "farm", tenDonVi: "Ngư dân khai thác tự do", diaChi: "Vũng Tàu", ngay: "03/03/2025", ghiChu: "Cá nóc khai thác biển, loài có độc tố tetrodotoxin cực cao, bị cấm kinh doanh" },
      { buoc: "Sơ chế không hợp pháp", icon: "factory", tenDonVi: "Cơ sở chế biến không phép", diaChi: "Q.4, TP.HCM", ngay: "04/03/2025", ghiChu: "Sơ chế loại bỏ nội tạng nhưng không đảm bảo loại trừ hoàn toàn độc tố" },
      { buoc: "Phân phối chợ đen", icon: "truck", tenDonVi: "Trung gian không xác định", diaChi: "TP.HCM", ngay: "05/03/2025", ghiChu: "Vận chuyển bí mật, không có chứng từ, không qua kiểm dịch" },
      { buoc: "Phục vụ trái phép", icon: "store", tenDonVi: "Nhà hàng Hải sản Đại Dương", diaChi: "Đường Xóm Chiếu, Q.4, TP.HCM", ngay: "05/03/2025", ghiChu: "Phục vụ cá nóc dưới tên gọi khác, vi phạm nghiêm trọng quy định ATTP" },
    ],
  },
  "SP-BAM-006": {
    tenSanPham: "Bánh mì nhân thịt nguội",
    maSanPham: "SP-BAM-006",
    loai: "Bánh mì – Thức ăn đường phố",
    hanSuDung: "20/02/2025",
    steps: [
      { buoc: "Nguồn gốc nguyên liệu", icon: "farm", tenDonVi: "Lò bánh mì Thành Công", diaChi: "67 CMT8, Q.3, TP.HCM", ngay: "19/02/2025", ghiChu: "Bánh mì nướng tươi ngày, nhân pate và thịt nguội từ nhà cung cấp không rõ nguồn gốc" },
      { buoc: "Chế biến", icon: "factory", tenDonVi: "Xe bánh mì khu vực Bình Thạnh", diaChi: "Góc Xô Viết Nghệ Tĩnh, Bình Thạnh", ngay: "20/02/2025", ghiChu: "Nhân thịt để ngoài trời hơn 3 tiếng, không có tủ bảo quản lạnh" },
      { buoc: "Bán lẻ", icon: "store", tenDonVi: "Xe bánh mì di động", diaChi: "Bình Thạnh, TP.HCM", ngay: "20/02/2025", ghiChu: "Bán từ 6:00–10:00 sáng, điều kiện vệ sinh kém, không có găng tay" },
    ],
  },
  "SP-SUA-007": {
    tenSanPham: "Sữa chua tự làm",
    maSanPham: "SP-SUA-007",
    loai: "Sản phẩm từ sữa",
    hanSuDung: "01/03/2025",
    steps: [
      { buoc: "Nguyên liệu", icon: "farm", tenDonVi: "Đại lý sữa tươi Mộc Châu", diaChi: "Q.Tân Bình, TP.HCM", ngay: "28/02/2025", ghiChu: "Sữa tươi thanh trùng đạt chuẩn, bảo quản lạnh đúng quy định" },
      { buoc: "Chế biến", icon: "factory", tenDonVi: "Cơ sở tự sản xuất tại trường", diaChi: "Trường Tiểu học Lê Văn Tám, Q.1", ngay: "28/02/2025", ghiChu: "Ủ sữa chua tại nhiệt độ phòng, không kiểm soát pH và vi sinh" },
      { buoc: "Phân phát", icon: "store", tenDonVi: "Căng tin trường", diaChi: "Trường Tiểu học Lê Văn Tám, Q.1, TP.HCM", ngay: "01/03/2025", ghiChu: "Phát cho học sinh vào bữa sáng, không kiểm tra chất lượng trước khi dùng" },
    ],
  },
  "SP-NAM-008": {
    tenSanPham: "Nấm rừng (nấm hái tự nhiên)",
    maSanPham: "SP-NAM-008",
    loai: "Nấm – Rau củ",
    hanSuDung: "18/01/2025",
    steps: [
      { buoc: "Thu hái", icon: "farm", tenDonVi: "Hộ dân tự thu hái", diaChi: "Lâm Đồng", ngay: "16/01/2025", ghiChu: "Nấm hái tự nhiên, không qua giám định loài, lẫn nấm độc" },
      { buoc: "Vận chuyển", icon: "truck", tenDonVi: "Thương lái tự do", diaChi: "TP.HCM", ngay: "17/01/2025", ghiChu: "Vận chuyển không ướp lạnh, không có giấy tờ kiểm dịch" },
      { buoc: "Cung cấp", icon: "store", tenDonVi: "Nhà trẻ Họa Mi", diaChi: "P. Hiệp Bình Phước, Thủ Đức, TP.HCM", ngay: "18/01/2025", ghiChu: "Mua trực tiếp từ người bán dạo, không kiểm tra nguồn gốc" },
    ],
  },
};

const stats = [
  { label: "Tổng vụ", value: "47", icon: AlertTriangle, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Đang điều tra", value: "8", icon: Search, color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "Đã kết luận", value: "35", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  { label: "Đang xử lý", value: "4", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
];

const vuNgoDocData: Record<string, unknown>[] = [
  { maVu: "NGD-2025-001", diaDiem: "Bếp ăn Công ty Pou Yuen, Bình Tân", ngayXayRa: "05/01/2025", soNguoiMac: 47, soNguoiNhapVien: 12, nguyenNhan: "Vi khuẩn Salmonella", trangThai: "Đã kết luận" },
  { maVu: "NGD-2025-002", diaDiem: "Quán cơm bình dân đường Lê Văn Sỹ, Q.3", ngayXayRa: "12/01/2025", soNguoiMac: 8, soNguoiNhapVien: 3, nguyenNhan: "Ngộ độc thức ăn", trangThai: "Đã kết luận" },
  { maVu: "NGD-2025-003", diaDiem: "Nhà trẻ Họa Mi, P. Hiệp Bình Phước, Thủ Đức", ngayXayRa: "18/01/2025", soNguoiMac: 15, soNguoiNhapVien: 6, nguyenNhan: "Độc tố nấm mốc", trangThai: "Đang xử lý" },
  { maVu: "NGD-2025-004", diaDiem: "Tiệc cưới nhà hàng Bông Sen, Q.7", ngayXayRa: "25/01/2025", soNguoiMac: 32, soNguoiNhapVien: 8, nguyenNhan: "Vi sinh vật", trangThai: "Đã kết luận" },
  { maVu: "NGD-2025-005", diaDiem: "Canteen Trường ĐH Bách Khoa, Q.10", ngayXayRa: "02/02/2025", soNguoiMac: 23, soNguoiNhapVien: 9, nguyenNhan: "Vi khuẩn E.coli", trangThai: "Đã kết luận" },
  { maVu: "NGD-2025-006", diaDiem: "Hàng bún bò vỉa hè 123 Đinh Tiên Hoàng", ngayXayRa: "10/02/2025", soNguoiMac: 5, soNguoiNhapVien: 2, nguyenNhan: "Chưa xác định", trangThai: "Đang điều tra" },
  { maVu: "NGD-2025-007", diaDiem: "Bếp ăn Công ty Samsung HCMC, Q.9", ngayXayRa: "14/02/2025", soNguoiMac: 68, soNguoiNhapVien: 22, nguyenNhan: "Staphylococcus aureus", trangThai: "Đã kết luận" },
  { maVu: "NGD-2025-008", diaDiem: "Xe bánh mì khu vực Bình Thạnh", ngayXayRa: "20/02/2025", soNguoiMac: 4, soNguoiNhapVien: 1, nguyenNhan: "Chưa xác định", trangThai: "Đang điều tra" },
  { maVu: "NGD-2025-009", diaDiem: "Trường Tiểu học Lê Văn Tám, Quận 1", ngayXayRa: "01/03/2025", soNguoiMac: 28, soNguoiNhapVien: 7, nguyenNhan: "Vi khuẩn Listeria", trangThai: "Đang xử lý" },
  { maVu: "NGD-2025-010", diaDiem: "Nhà hàng Hải sản Đại Dương, Q.4", ngayXayRa: "05/03/2025", soNguoiMac: 12, soNguoiNhapVien: 4, nguyenNhan: "Độc tố cá nóc", trangThai: "Đã kết luận" },
  { maVu: "NGD-2025-011", diaDiem: "Lễ hội ẩm thực phường Bến Nghé, Q.1", ngayXayRa: "08/03/2025", soNguoiMac: 9, soNguoiNhapVien: 3, nguyenNhan: "Chưa xác định", trangThai: "Đang điều tra" },
  { maVu: "NGD-2025-012", diaDiem: "Bếp ăn Bệnh viện Q.11", ngayXayRa: "10/03/2025", soNguoiMac: 6, soNguoiNhapVien: 4, nguyenNhan: "Ngộ độc hóa chất", trangThai: "Đang điều tra" },
  { maVu: "NGD-2025-013", diaDiem: "Tiệc sinh nhật tư gia đường Lê Quang Định", ngayXayRa: "11/03/2025", soNguoiMac: 7, soNguoiNhapVien: 2, nguyenNhan: "Chưa xác định", trangThai: "Đang điều tra" },
  { maVu: "NGD-2025-014", diaDiem: "Quán bún thịt nướng P. Tân Định, Q.1", ngayXayRa: "12/03/2025", soNguoiMac: 3, soNguoiNhapVien: 1, nguyenNhan: "Vi sinh vật", trangThai: "Đang xử lý" },
  { maVu: "NGD-2025-015", diaDiem: "Căng tin Trường THPT Gia Định, Bình Thạnh", ngayXayRa: "14/03/2025", soNguoiMac: 19, soNguoiNhapVien: 5, nguyenNhan: "Vi khuẩn Salmonella", trangThai: "Đang điều tra" },
];

// Kết quả điều tra
const ketQuaDieuTraData: Record<string, unknown>[] = [
  { maVu: "NGD-2025-001", sanPham: "Thịt gà đông lạnh", maSanPham: "SP-GA-001", doanhNghiep: "Công ty CP Chăn nuôi Minh Phát", ketLuanNguyenNhan: "Vi khuẩn Salmonella trong thịt gà chưa nấu chín", bienPhapXuLy: "Đình chỉ bếp ăn, tiêu hủy thực phẩm, phạt 25 triệu", coSoLienQuan: "Bếp ăn Công ty Pou Yuen", ngayKetLuan: "20/01/2025", trangThai: "Hoàn thành" },
  { maVu: "NGD-2025-002", sanPham: "Bánh mì nhân thịt nguội", maSanPham: "SP-BAM-006", doanhNghiep: "Lò bánh mì Thành Công", ketLuanNguyenNhan: "Thức ăn bảo quản không đúng cách, để quá 4 tiếng", bienPhapXuLy: "Cảnh cáo, yêu cầu cải thiện điều kiện bảo quản", coSoLienQuan: "Quán cơm Lê Văn Sỹ", ngayKetLuan: "25/01/2025", trangThai: "Hoàn thành" },
  { maVu: "NGD-2025-004", sanPham: "Hải sản hỗn hợp (tôm, mực, nghêu)", maSanPham: "SP-HAI-003", doanhNghiep: "Cơ sở hải sản Năm Phong", ketLuanNguyenNhan: "Hải sản nhiễm khuẩn do bảo quản lạnh không đủ nhiệt độ", bienPhapXuLy: "Phạt 50 triệu, tạm đình chỉ hoạt động 1 tháng", coSoLienQuan: "Nhà hàng Bông Sen", ngayKetLuan: "10/02/2025", trangThai: "Hoàn thành" },
  { maVu: "NGD-2025-005", sanPham: "Rau sống (xà lách, rau thơm)", maSanPham: "SP-RAU-002", doanhNghiep: "HTX Rau sạch Củ Chi", ketLuanNguyenNhan: "Vi khuẩn E.coli trong rau sống không được rửa đúng cách", bienPhapXuLy: "Phạt 15 triệu, yêu cầu tập huấn vệ sinh thực phẩm", coSoLienQuan: "Canteen ĐH Bách Khoa", ngayKetLuan: "20/02/2025", trangThai: "Hoàn thành" },
  { maVu: "NGD-2025-007", sanPham: "Cơm hộp chế biến sẵn", maSanPham: "SP-COM-004", doanhNghiep: "Bếp ăn nội bộ Samsung HCMC", ketLuanNguyenNhan: "Tụ cầu vàng từ thực phẩm chế biến sẵn để quá lâu", bienPhapXuLy: "Phạt 35 triệu, thay đổi quy trình chế biến", coSoLienQuan: "Bếp ăn Samsung HCMC", ngayKetLuan: "05/03/2025", trangThai: "Hoàn thành" },
  { maVu: "NGD-2025-010", sanPham: "Cá nóc chế biến (món nhậu)", maSanPham: "SP-CA-005", doanhNghiep: "Nhà hàng Hải sản Đại Dương", ketLuanNguyenNhan: "Độc tố tetrodotoxin từ cá nóc được phục vụ trái phép", bienPhapXuLy: "Đình chỉ vĩnh viễn phục vụ cá nóc, phạt 80 triệu", coSoLienQuan: "Nhà hàng Hải sản Đại Dương", ngayKetLuan: "20/03/2025", trangThai: "Hoàn thành" },
  { maVu: "NGD-2025-003", sanPham: "Nấm rừng (nấm hái tự nhiên)", maSanPham: "SP-NAM-008", doanhNghiep: "Hộ dân tự thu hái (Lâm Đồng)", ketLuanNguyenNhan: "Đang lấy mẫu thực phẩm xét nghiệm tại viện kiểm nghiệm", bienPhapXuLy: "Tạm đình chỉ bếp ăn, chờ kết quả xét nghiệm", coSoLienQuan: "Nhà trẻ Họa Mi", ngayKetLuan: "Đang điều tra", trangThai: "Đang xử lý" },
  { maVu: "NGD-2025-009", sanPham: "Sữa chua tự làm", maSanPham: "SP-SUA-007", doanhNghiep: "Tự sản xuất tại trường", ketLuanNguyenNhan: "Phân lập được Listeria monocytogenes trong mẫu thức ăn", bienPhapXuLy: "Đình chỉ canteen, tiêu hủy toàn bộ thực phẩm", coSoLienQuan: "Trường Tiểu học Lê Văn Tám", ngayKetLuan: "Đang hoàn tất", trangThai: "Đang xử lý" },
];

const vuNgoDocColumns = [
  { key: "maVu", label: "Mã vụ", sortable: true },
  { key: "diaDiem", label: "Địa điểm xảy ra" },
  { key: "ngayXayRa", label: "Ngày xảy ra" },
  { key: "soNguoiMac", label: "Số người mắc", sortable: true },
  { key: "soNguoiNhapVien", label: "Nhập viện", sortable: true },
  { key: "nguyenNhan", label: "Nguyên nhân nghi ngờ" },
  {
    key: "trangThai", label: "Trạng thái",
    render: (row: Record<string, unknown>) => {
      const val = String(row.trangThai);
      const variant = val === "Đã kết luận" ? "success" : val === "Đang điều tra" ? "warning" : "info";
      return <Badge variant={variant as "success" | "warning" | "info"}>{val}</Badge>;
    },
  },
];

const ketQuaColumnsBase = [
  { key: "maVu", label: "Mã vụ", sortable: true },
  { key: "doanhNghiep", label: "Doanh nghiệp" },
  { key: "ketLuanNguyenNhan", label: "Kết luận nguyên nhân" },
  { key: "bienPhapXuLy", label: "Biện pháp xử lý" },
  { key: "coSoLienQuan", label: "Cơ sở liên quan" },
  { key: "ngayKetLuan", label: "Ngày kết luận" },
  {
    key: "trangThai", label: "Trạng thái",
    render: (row: Record<string, unknown>) => {
      const val = String(row.trangThai);
      const variant = val === "Hoàn thành" ? "success" : "warning";
      return <Badge variant={variant as "success" | "warning"}>{val}</Badge>;
    },
  },
];

const tabs = [
  { id: "danh-sach", label: "Danh sách vụ ngộ độc", icon: AlertTriangle },
  { id: "ket-qua", label: "Kết quả điều tra", icon: FlaskConical },
];

const stepIconMap: Record<string, React.ReactNode> = {
  farm: <MapPin size={15} className="text-green-600" />,
  factory: <Factory size={15} className="text-blue-600" />,
  truck: <Truck size={15} className="text-orange-500" />,
  store: <Store size={15} className="text-purple-600" />,
};

const stepBgMap: Record<string, string> = {
  farm: "bg-green-50 border-green-100",
  factory: "bg-blue-50 border-blue-100",
  truck: "bg-orange-50 border-orange-100",
  store: "bg-purple-50 border-purple-100",
};

export default function DanhSachNgoDocPage() {
  const [tab, setTab] = useState("danh-sach");
  const [selectedProduct, setSelectedProduct] = useState<ProductTrace | null>(null);

  const ketQuaColumns = [
    ketQuaColumnsBase[0],
    {
      key: "sanPham",
      label: "Sản phẩm",
      render: (row: Record<string, unknown>) => (
        <button
          onClick={() => setSelectedProduct(productTraceability[String(row.maSanPham)] ?? null)}
          className="text-brand-600 hover:text-brand-800 hover:underline font-medium text-left"
        >
          {String(row.sanPham)}
        </button>
      ),
    },
    ...ketQuaColumnsBase.slice(1),
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Ngộ độc thực phẩm"
        subtitle="Quản lý danh sách vụ ngộ độc và kết quả điều tra nguyên nhân"
        action={
          <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <Plus size={16} />
            Khai báo vụ mới
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "text-brand-600 border-b-2 border-brand-600 bg-brand-50/40"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="p-5">
          {tab === "danh-sach" && (
            <DataTable columns={vuNgoDocColumns} data={vuNgoDocData} searchable searchKeys={["maVu", "diaDiem", "nguyenNhan"]} />
          )}
          {tab === "ket-qua" && (
            <DataTable columns={ketQuaColumns} data={ketQuaDieuTraData} searchable searchKeys={["maVu", "coSoLienQuan", "ketLuanNguyenNhan"]} />
          )}
        </div>
      </div>
      {/* Modal truy xuất nguồn gốc sản phẩm */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct ? `Truy xuất nguồn gốc – ${selectedProduct.tenSanPham}` : ""}
      >
        {selectedProduct && (
          <div className="flex flex-col gap-5">
            {/* Thông tin sản phẩm */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <Package size={18} className="text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{selectedProduct.tenSanPham}</p>
                <p className="text-xs text-gray-500">{selectedProduct.maSanPham} · {selectedProduct.loai}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Hạn sử dụng</p>
                <p className="text-xs font-semibold text-red-500">{selectedProduct.hanSuDung}</p>
              </div>
            </div>

            {/* Timeline truy xuất */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Chuỗi cung ứng</p>
              <div className="flex flex-col gap-3">
                {selectedProduct.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    {/* Connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${stepBgMap[step.icon] ?? "bg-gray-50 border-gray-100"}`}>
                        {stepIconMap[step.icon]}
                      </div>
                      {idx < selectedProduct.steps.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 my-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{step.buoc}</span>
                        <span className="text-xs text-gray-400">{step.ngay}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{step.tenDonVi}</p>
                      <p className="text-xs text-gray-500 mb-1">{step.diaChi}</p>
                      <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5 leading-relaxed">{step.ghiChu}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
