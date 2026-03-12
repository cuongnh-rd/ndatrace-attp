"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import { Plus, ClipboardList, CheckSquare, AlertOctagon, Gavel, FileText, Building2 } from "lucide-react";

// ── Chi tiết kế hoạch (popup) ─────────────────────────────────────────────────
type CoSo = { ten: string; ngayKiemTra: string; boPhanThucHien: string; ketQua: string };
type KeHoachDetail = { nghiDinh: string; noiDung: string; coSoCanKiemTra: CoSo[] };

const keHoachDetails: Record<string, KeHoachDetail> = {
  "KH-2026-001": {
    nghiDinh: "Nghị định 15/2018/NĐ-CP",
    noiDung: "Kiểm tra định kỳ điều kiện an toàn thực phẩm tại các cơ sở kinh doanh dịch vụ ăn uống, sản xuất và chế biến thực phẩm trên địa bàn Quận 1 nhằm đảm bảo tuân thủ các quy định về vệ sinh an toàn thực phẩm trong Quý I/2026.",
    coSoCanKiemTra: [
      { ten: "Nhà hàng Hải sản Biển Đông", ngayKiemTra: "05/01/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Đạt" },
      { ten: "Quán ăn Phở Bắc Hà", ngayKiemTra: "07/01/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Đạt" },
      { ten: "Siêu thị Vinmart Q.1", ngayKiemTra: "10/01/2026", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Đạt có điều kiện" },
      { ten: "Cơ sở bánh ngọt Hương Quê", ngayKiemTra: "12/01/2026", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Không đạt" },
      { ten: "Bếp ăn tập thể Công ty Bảo Việt", ngayKiemTra: "15/01/2026", boPhanThucHien: "Đội kiểm tra số 3", ketQua: "Đạt" },
    ],
  },
  "KH-2026-002": {
    nghiDinh: "Chỉ thị 06/CT-UBND ngày 10/01/2026",
    noiDung: "Kiểm tra đột xuất điều kiện vệ sinh an toàn thực phẩm tại các bếp ăn tập thể, cơ sở chế biến phục vụ dịp Tết Nguyên Đán 2026 trên toàn địa bàn thành phố, đảm bảo an toàn thực phẩm cho người dân trong dịp lễ.",
    coSoCanKiemTra: [
      { ten: "Bếp ăn tập thể Pou Yuen", ngayKiemTra: "20/01/2026", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Đạt có điều kiện" },
      { ten: "Nhà hàng tiệc cưới Đại Dương", ngayKiemTra: "22/01/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Đạt" },
      { ten: "Trung tâm tiệc cưới Palace", ngayKiemTra: "25/01/2026", boPhanThucHien: "Đội kiểm tra số 3", ketQua: "Đạt" },
    ],
  },
  "KH-2026-003": {
    nghiDinh: "Kế hoạch 12/KH-SYT ngày 05/02/2026",
    noiDung: "Chuyên đề kiểm tra điều kiện vệ sinh an toàn thực phẩm đối với các cơ sở kinh doanh thức ăn đường phố trên địa bàn Quận 3 và Quận 5 trong mùa hè, tập trung vào nguồn gốc nguyên liệu và điều kiện chế biến, bảo quản thực phẩm.",
    coSoCanKiemTra: [
      { ten: "Xe bánh tráng trộn Thanh Hiền", ngayKiemTra: "15/02/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Không đạt" },
      { ten: "Quán chè Hiển Khánh", ngayKiemTra: "16/02/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Đạt" },
      { ten: "Xe bún bò Huế Mệ Loan", ngayKiemTra: "17/02/2026", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Đạt có điều kiện" },
      { ten: "Hàng xôi cô Mười", ngayKiemTra: "18/02/2026", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Đạt" },
    ],
  },
  "KH-2026-004": {
    nghiDinh: "Nghị định 15/2018/NĐ-CP & Thông tư 48/2015/TT-BYT",
    noiDung: "Kiểm tra định kỳ điều kiện an toàn thực phẩm các cơ sở sản xuất, kinh doanh thực phẩm trên địa bàn quận Bình Thạnh trong Quý II/2026, chú trọng kiểm tra giấy chứng nhận ATTP và hồ sơ tự công bố sản phẩm.",
    coSoCanKiemTra: [
      { ten: "Nhà máy chế biến Thủy sản Hùng Vương", ngayKiemTra: "01/04/2026", boPhanThucHien: "Đội kiểm tra số 3", ketQua: "Chưa kiểm tra" },
      { ten: "Siêu thị Co.opmart Bình Thạnh", ngayKiemTra: "05/04/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Chưa kiểm tra" },
      { ten: "Chuỗi Cà phê Sáng Việt – CN Bình Thạnh", ngayKiemTra: "10/04/2026", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Chưa kiểm tra" },
    ],
  },
  "KH-2026-005": {
    nghiDinh: "Công văn 234/SYT-ATTP ngày 08/03/2026",
    noiDung: "Kiểm tra đột xuất các cơ sở kinh doanh thực phẩm tại Quận 7 và Quận 8 theo phản ánh của người dân về tình trạng mất vệ sinh an toàn thực phẩm, ưu tiên các cơ sở có dấu hiệu vi phạm được phản ánh qua đường dây nóng.",
    coSoCanKiemTra: [
      { ten: "Chợ Phú Mỹ Hưng", ngayKiemTra: "10/03/2026", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Đạt" },
      { ten: "Nhà hàng Sông Sài Gòn", ngayKiemTra: "12/03/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Không đạt" },
      { ten: "Cơ sở giò chả Hai Thanh", ngayKiemTra: "14/03/2026", boPhanThucHien: "Đội kiểm tra số 3", ketQua: "Đạt có điều kiện" },
    ],
  },
  "KH-2026-006": {
    nghiDinh: "Quyết định 45/QĐ-SYT ngày 20/04/2026",
    noiDung: "Chuyên đề kiểm tra điều kiện sản xuất, chất lượng sản phẩm và nguồn gốc nguyên liệu tại các cơ sở sản xuất nước giải khát đóng chai, nước tinh khiết trên địa bàn quận Tân Bình và Tân Phú.",
    coSoCanKiemTra: [
      { ten: "Công ty TNHH Nước uống Ánh Dương", ngayKiemTra: "05/05/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Chưa kiểm tra" },
      { ten: "Nhà máy nước tinh khiết Sao Mai", ngayKiemTra: "10/05/2026", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Chưa kiểm tra" },
      { ten: "Cơ sở nước ngọt Phương Nam", ngayKiemTra: "15/05/2026", boPhanThucHien: "Đội kiểm tra số 3", ketQua: "Chưa kiểm tra" },
    ],
  },
  "KH-2026-007": {
    nghiDinh: "Thông tư 30/2012/TT-BYT & Kế hoạch liên ngành Y tế – Giáo dục",
    noiDung: "Chuyên đề kiểm tra an toàn thực phẩm tại bếp ăn bán trú trường học trên địa bàn Gò Vấp và Bình Thạnh đầu năm học 2026-2027, kiểm tra hợp đồng cung cấp thực phẩm, chứng nhận sức khỏe nhân viên chế biến và điều kiện vệ sinh.",
    coSoCanKiemTra: [
      { ten: "Trường Tiểu học Phan Đình Phùng", ngayKiemTra: "01/09/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Chưa kiểm tra" },
      { ten: "Trường THCS Nguyễn Du", ngayKiemTra: "05/09/2026", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Chưa kiểm tra" },
      { ten: "Trường Mầm non Họa Mi", ngayKiemTra: "10/09/2026", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Chưa kiểm tra" },
      { ten: "Trường TH Bình Quới Tây", ngayKiemTra: "15/09/2026", boPhanThucHien: "Đội kiểm tra số 3", ketQua: "Chưa kiểm tra" },
    ],
  },
  "KH-2025-001": {
    nghiDinh: "Nghị định 15/2018/NĐ-CP",
    noiDung: "Kiểm tra định kỳ điều kiện an toàn thực phẩm tại các cơ sở kinh doanh trên địa bàn Quận 1 trong Quý I/2025.",
    coSoCanKiemTra: [
      { ten: "Nhà hàng Hải sản Biển Đông", ngayKiemTra: "05/01/2025", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Đạt" },
      { ten: "Quán ăn Phở Bắc Hà", ngayKiemTra: "07/01/2025", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Đạt" },
    ],
  },
  "KH-2025-002": {
    nghiDinh: "Chỉ thị 06/CT-UBND ngày 10/01/2025",
    noiDung: "Kiểm tra đột xuất bếp ăn tập thể và cơ sở chế biến phục vụ dịp Tết Nguyên Đán 2025.",
    coSoCanKiemTra: [
      { ten: "Bếp ăn tập thể Pou Yuen", ngayKiemTra: "20/01/2025", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Đạt" },
      { ten: "Nhà hàng tiệc cưới Đại Dương", ngayKiemTra: "22/01/2025", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Đạt có điều kiện" },
    ],
  },
  "KH-2025-003": {
    nghiDinh: "Kế hoạch 12/KH-SYT ngày 05/02/2025",
    noiDung: "Chuyên đề kiểm tra thức ăn đường phố tại Quận 3 và Quận 5 năm 2025.",
    coSoCanKiemTra: [
      { ten: "Xe bánh tráng trộn Thanh Hiền", ngayKiemTra: "15/02/2025", boPhanThucHien: "Đội kiểm tra số 1", ketQua: "Không đạt" },
      { ten: "Quán chè Hiển Khánh", ngayKiemTra: "17/02/2025", boPhanThucHien: "Đội kiểm tra số 2", ketQua: "Đạt" },
    ],
  },
};

// ── Kế hoạch kiểm tra ────────────────────────────────────────────────────────
const keHoachData: Record<string, unknown>[] = [
  { maKH: "KH-2026-001", tenKeHoach: "Kiểm tra định kỳ Q1/2026 – Quận 1", diaBan: "Quận 1", thoiGian: "01/01/2026 – 31/03/2026", soCoSo: 48, loai: "Định kỳ", trangThai: "Đang thực hiện" },
  { maKH: "KH-2026-002", tenKeHoach: "Kiểm tra đột xuất bếp ăn tập thể Tết 2026", diaBan: "Toàn TP", thoiGian: "20/01/2026 – 05/02/2026", soCoSo: 120, loai: "Đột xuất", trangThai: "Hoàn thành" },
  { maKH: "KH-2026-003", tenKeHoach: "Chuyên đề thức ăn đường phố mùa hè", diaBan: "Quận 3, Quận 5", thoiGian: "15/02/2026 – 28/02/2026", soCoSo: 67, loai: "Chuyên đề", trangThai: "Đang thực hiện" },
  { maKH: "KH-2026-004", tenKeHoach: "Kiểm tra định kỳ Q2/2026 – Bình Thạnh", diaBan: "Bình Thạnh", thoiGian: "01/04/2026 – 30/06/2026", soCoSo: 72, loai: "Định kỳ", trangThai: "Chờ thực hiện" },
  { maKH: "KH-2026-005", tenKeHoach: "Kiểm tra đột xuất sau phản ánh người dân", diaBan: "Quận 7, Quận 8", thoiGian: "10/03/2026 – 20/03/2026", soCoSo: 25, loai: "Đột xuất", trangThai: "Đang thực hiện" },
  { maKH: "KH-2026-006", tenKeHoach: "Chuyên đề cơ sở sản xuất nước giải khát", diaBan: "Tân Bình, Tân Phú", thoiGian: "05/05/2026 – 31/05/2026", soCoSo: 34, loai: "Chuyên đề", trangThai: "Chờ thực hiện" },
  { maKH: "KH-2026-007", tenKeHoach: "Kiểm tra an toàn thực phẩm trường học", diaBan: "Gò Vấp, Bình Thạnh", thoiGian: "01/09/2026 – 30/09/2026", soCoSo: 56, loai: "Chuyên đề", trangThai: "Chờ thực hiện" },
  { maKH: "KH-2025-001", tenKeHoach: "Kiểm tra định kỳ Q1/2025 – Quận 1", diaBan: "Quận 1", thoiGian: "01/01/2025 – 31/03/2025", soCoSo: 48, loai: "Định kỳ", trangThai: "Hoàn thành" },
  { maKH: "KH-2025-002", tenKeHoach: "Kiểm tra đột xuất bếp ăn tập thể Tết 2025", diaBan: "Toàn TP", thoiGian: "20/01/2025 – 05/02/2025", soCoSo: 120, loai: "Đột xuất", trangThai: "Hoàn thành" },
  { maKH: "KH-2025-003", tenKeHoach: "Chuyên đề kiểm tra thức ăn đường phố", diaBan: "Quận 3, Quận 5", thoiGian: "15/02/2025 – 28/02/2025", soCoSo: 67, loai: "Chuyên đề", trangThai: "Hoàn thành" },
];

// ── Kết quả kiểm tra ─────────────────────────────────────────────────────────
const ketQuaData: Record<string, unknown>[] = [
  { maKQ: "KQ-2026-001", tenCoSo: "Nhà hàng Hải sản Biển Đông", diaBan: "Q.1", ngayKiemTra: "05/01/2026", nguoiKiemTra: "Nguyễn Văn An", ketQua: "Đạt", ghiChu: "Đủ điều kiện ATTP" },
  { maKQ: "KQ-2026-002", tenCoSo: "Cơ sở sản xuất bánh kẹo Hương Sen", diaBan: "Q.3", ngayKiemTra: "07/01/2026", nguoiKiemTra: "Trần Thị Bình", ketQua: "Không đạt", ghiChu: "Vi phạm nhãn hàng hóa" },
  { maKQ: "KQ-2026-003", tenCoSo: "Quán ăn Cơm Tấm Thuận Kiều", diaBan: "Q.10", ngayKiemTra: "10/01/2026", nguoiKiemTra: "Lê Minh Cường", ketQua: "Đạt", ghiChu: "Bổ sung hồ sơ còn thiếu" },
  { maKQ: "KQ-2026-004", tenCoSo: "Siêu thị Mini Phước Lộc", diaBan: "Bình Tân", ngayKiemTra: "12/01/2026", nguoiKiemTra: "Phạm Thị Dung", ketQua: "Không đạt", ghiChu: "Giấy phép hết hạn chưa gia hạn" },
  { maKQ: "KQ-2026-005", tenCoSo: "Bếp ăn tập thể Pou Yuen", diaBan: "Bình Tân", ngayKiemTra: "15/01/2026", nguoiKiemTra: "Hoàng Văn Em", ketQua: "Đạt có điều kiện", ghiChu: "Cần hoàn thiện kho lưu trữ" },
  { maKQ: "KQ-2026-006", tenCoSo: "Nhà hàng Buffet Nhật Sakura", diaBan: "Q.1", ngayKiemTra: "18/01/2026", nguoiKiemTra: "Nguyễn Văn An", ketQua: "Đạt", ghiChu: "" },
  { maKQ: "KQ-2026-007", tenCoSo: "Lò bánh mì Thành Công", diaBan: "Q.3", ngayKiemTra: "20/01/2026", nguoiKiemTra: "Trần Thị Bình", ketQua: "Không đạt", ghiChu: "Không đảm bảo vệ sinh" },
  { maKQ: "KQ-2026-008", tenCoSo: "Chuỗi Cà phê Sáng Việt – Chi nhánh Bình Thạnh", diaBan: "Bình Thạnh", ngayKiemTra: "22/01/2026", nguoiKiemTra: "Lê Minh Cường", ketQua: "Đạt", ghiChu: "" },
  { maKQ: "KQ-2026-009", tenCoSo: "Công ty TNHH Nước uống Ánh Dương", diaBan: "Tân Phú", ngayKiemTra: "25/01/2026", nguoiKiemTra: "Phạm Thị Dung", ketQua: "Đạt", ghiChu: "" },
  { maKQ: "KQ-2026-010", tenCoSo: "Hàng bún bò vỉa hè 123 Đinh Tiên Hoàng", diaBan: "Bình Thạnh", ngayKiemTra: "28/01/2026", nguoiKiemTra: "Hoàng Văn Em", ketQua: "Không đạt", ghiChu: "Không có giấy phép kinh doanh" },
];

// ── Biên bản vi phạm ──────────────────────────────────────────────────────────
const viPhamData: Record<string, unknown>[] = [
  { maBB: "BB-2026-001", tenCoSo: "Cơ sở sản xuất bánh kẹo Hương Sen", diaChi: "45 Lê Văn Sỹ, Q.3", ngayLap: "07/01/2026", loaiViPham: "Vi phạm nhãn hàng hóa", hinhThucXuLy: "Cảnh cáo + Phạt tiền", trangThai: "Đã xử lý" },
  { maBB: "BB-2026-002", tenCoSo: "Siêu thị Mini Phước Lộc", diaChi: "234 Tên Lửa, Bình Tân", ngayLap: "12/01/2026", loaiViPham: "Kinh doanh với giấy phép hết hạn", hinhThucXuLy: "Đình chỉ hoạt động", trangThai: "Đang xử lý" },
  { maBB: "BB-2026-003", tenCoSo: "Lò bánh mì Thành Công", diaChi: "67 CMT8, Q.3", ngayLap: "20/01/2026", loaiViPham: "Không đảm bảo điều kiện vệ sinh", hinhThucXuLy: "Phạt tiền", trangThai: "Đang xử lý" },
  { maBB: "BB-2026-004", tenCoSo: "Hàng bún bò vỉa hè 123 Đinh Tiên Hoàng", diaChi: "123 Đinh Tiên Hoàng, Bình Thạnh", ngayLap: "28/01/2026", loaiViPham: "Không có giấy phép kinh doanh", hinhThucXuLy: "Phạt tiền + Buộc đăng ký", trangThai: "Chưa xử lý" },
  { maBB: "BB-2026-005", tenCoSo: "Cơ sở sản xuất thực phẩm Minh Hằng", diaChi: "89 Hoàng Văn Thụ, Q.7", ngayLap: "02/02/2026", loaiViPham: "Sử dụng phụ gia không được phép", hinhThucXuLy: "Tạm đình chỉ + Phạt tiền", trangThai: "Đang xử lý" },
  { maBB: "BB-2025-021", tenCoSo: "Xe bánh mì khu vực Bình Thạnh", diaChi: "Góc Xô Viết Nghệ Tĩnh, Bình Thạnh", ngayLap: "20/02/2025", loaiViPham: "Không xuất trình hồ sơ nguồn gốc", hinhThucXuLy: "Cảnh cáo", trangThai: "Đã xử lý" },
  { maBB: "BB-2025-022", tenCoSo: "Quán cơm bình dân đường Lê Văn Sỹ", diaChi: "78 Lê Văn Sỹ, Q.3", ngayLap: "12/01/2025", loaiViPham: "Điều kiện bảo quản thực phẩm không đạt", hinhThucXuLy: "Phạt tiền", trangThai: "Đã xử lý" },
];

const tabs = [
  { id: "ke-hoach", label: "Kế hoạch kiểm tra", icon: ClipboardList },
  { id: "ket-qua", label: "Kết quả kiểm tra", icon: CheckSquare },
  { id: "vi-pham", label: "Biên bản vi phạm & Xử phạt", icon: AlertOctagon },
];

const keHoachColumns = [
  { key: "maKH", label: "Mã KH", sortable: true },
  { key: "tenKeHoach", label: "Tên kế hoạch" },
  { key: "diaBan", label: "Địa bàn" },
  { key: "thoiGian", label: "Thời gian dự kiến" },
  { key: "soCoSo", label: "Số cơ sở", sortable: true },
  {
    key: "loai", label: "Loại kiểm tra",
    render: (row: Record<string, unknown>) => {
      const val = String(row.loai);
      const variant = val === "Định kỳ" ? "info" : val === "Đột xuất" ? "warning" : "neutral";
      return <Badge variant={variant as "info" | "warning" | "neutral"}>{val}</Badge>;
    },
  },
  {
    key: "trangThai", label: "Trạng thái",
    render: (row: Record<string, unknown>) => {
      const val = String(row.trangThai);
      const variant = val === "Hoàn thành" ? "success" : val === "Đang thực hiện" ? "info" : "neutral";
      return <Badge variant={variant as "success" | "info" | "neutral"}>{val}</Badge>;
    },
  },
];

const ketQuaColumns = [
  { key: "maKQ", label: "Mã KQ", sortable: true },
  { key: "tenCoSo", label: "Tên cơ sở", sortable: true },
  { key: "diaBan", label: "Địa bàn" },
  { key: "ngayKiemTra", label: "Ngày kiểm tra" },
  { key: "nguoiKiemTra", label: "Người kiểm tra" },
  {
    key: "ketQua", label: "Kết quả",
    render: (row: Record<string, unknown>) => {
      const val = String(row.ketQua);
      const variant = val === "Đạt" ? "success" : val === "Không đạt" ? "danger" : "warning";
      return <Badge variant={variant as "success" | "danger" | "warning"}>{val}</Badge>;
    },
  },
  { key: "ghiChu", label: "Ghi chú" },
];

const viPhamColumns = [
  { key: "maBB", label: "Mã BB", sortable: true },
  { key: "tenCoSo", label: "Tên cơ sở", sortable: true },
  { key: "diaChi", label: "Địa chỉ" },
  { key: "ngayLap", label: "Ngày lập" },
  { key: "loaiViPham", label: "Loại vi phạm" },
  { key: "hinhThucXuLy", label: "Hình thức xử lý" },
  {
    key: "trangThai", label: "Trạng thái",
    render: (row: Record<string, unknown>) => {
      const val = String(row.trangThai);
      const variant = val === "Đã xử lý" ? "success" : val === "Đang xử lý" ? "warning" : "danger";
      return <Badge variant={variant as "success" | "warning" | "danger"}>{val}</Badge>;
    },
  },
];

const stats = [
  { label: "Kế hoạch", value: "10", color: "text-brand-600", bg: "bg-brand-50" },
  { label: "Đã kiểm tra", value: "748", color: "text-green-600", bg: "bg-green-50" },
  { label: "Vi phạm", value: "127", color: "text-red-600", bg: "bg-red-50" },
  { label: "Đang xử lý", value: "34", color: "text-amber-600", bg: "bg-amber-50" },
];

export default function KiemTraATTPPage() {
  const [tab, setTab] = useState("ke-hoach");
  const [selectedKeHoach, setSelectedKeHoach] = useState<(typeof keHoachData)[0] | null>(null);

  const keHoachColumnsWithLink = [
    ...keHoachColumns.slice(0, 1),
    {
      key: "tenKeHoach",
      label: "Tên kế hoạch",
      render: (row: Record<string, unknown>) => (
        <button
          onClick={() => setSelectedKeHoach(row)}
          className="text-brand-600 hover:text-brand-800 hover:underline font-medium text-left"
        >
          {String(row.tenKeHoach)}
        </button>
      ),
    },
    ...keHoachColumns.slice(2),
  ];

  const detail = selectedKeHoach ? keHoachDetails[String(selectedKeHoach.maKH)] : null;

  return (
    <DashboardLayout>
      <PageHeader
        title="Kiểm tra ATTP"
        subtitle="Quản lý kế hoạch, kết quả kiểm tra và xử lý vi phạm an toàn thực phẩm"
        action={
          <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <Plus size={16} />
            Thêm kế hoạch
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-2">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <Gavel size={18} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
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
          {tab === "ke-hoach" && (
            <DataTable columns={keHoachColumnsWithLink} data={keHoachData} searchable searchKeys={["maKH", "tenKeHoach", "diaBan"]} />
          )}
          {tab === "ket-qua" && (
            <DataTable columns={ketQuaColumns} data={ketQuaData} searchable searchKeys={["maKQ", "tenCoSo", "diaBan"]} />
          )}
          {tab === "vi-pham" && (
            <DataTable columns={viPhamColumns} data={viPhamData} searchable searchKeys={["maBB", "tenCoSo", "loaiViPham"]} />
          )}
        </div>
      </div>
      {/* Modal chi tiết kế hoạch */}
      <Modal
        isOpen={!!selectedKeHoach}
        onClose={() => setSelectedKeHoach(null)}
        title={selectedKeHoach ? String(selectedKeHoach.tenKeHoach) : ""}
      >
        {selectedKeHoach && detail && (
          <div className="flex flex-col gap-6">
            {/* Phần 1: Nội dung / nghị định */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
                  <FileText size={15} className="text-brand-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Phần 1 — Nội dung hoặc nghị định về kế hoạch triển khai
                </h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-brand-600">{detail.nghiDinh}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{detail.noiDung}</p>
              </div>
            </div>

            {/* Phần 2: Danh sách cơ sở cần kiểm tra */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                  <Building2 size={15} className="text-green-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Phần 2 — Danh sách cơ sở cần kiểm tra
                </h3>
                <span className="ml-auto text-xs font-semibold text-white bg-green-500 rounded-full px-2 py-0.5">
                  {detail.coSoCanKiemTra.length} cơ sở
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tên cơ sở</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Ngày kiểm tra</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Bộ phận thực hiện</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Kết quả kiểm tra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.coSoCanKiemTra.map((cs, idx) => {
                      const ketQuaVariant =
                        cs.ketQua === "Đạt" ? "success" :
                        cs.ketQua === "Không đạt" ? "danger" :
                        cs.ketQua === "Đạt có điều kiện" ? "warning" : "neutral";
                      return (
                        <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                          <td className="px-4 py-3 text-xs font-bold text-gray-400">{idx + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{cs.ten}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{cs.ngayKiemTra}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{cs.boPhanThucHien}</td>
                          <td className="px-4 py-3">
                            <Badge variant={ketQuaVariant as "success" | "danger" | "warning" | "neutral"}>{cs.ketQua}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
