"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const statCards = [
  { label: "Tổng sự kiện ", value: "28,430", color: "text-blue-600", sub: "Tháng 3/2026" },
  { label: "Đang ", value: "1,248", color: "text-amber-600", sub: "Thời gian thực" },
  { label: "Hoàn thành tháng này", value: "26,890", color: "text-green-600", sub: "94.6% đúng hạn" },
  { label: "Sự cố ", value: "292", color: "text-red-600", sub: "1.03% tổng sự kiện" },
];

const trendData = [
  { week: "T1W1", events: 6200, completed: 5980, incidents: 62 },
  { week: "T1W2", events: 6800, completed: 6540, incidents: 71 },
  { week: "T1W3", events: 7100, completed: 6870, incidents: 58 },
  { week: "T1W4", events: 6900, completed: 6680, incidents: 74 },
  { week: "T2W1", events: 7400, completed: 7150, incidents: 82 },
  { week: "T2W2", events: 7800, completed: 7560, incidents: 69 },
  { week: "T2W3", events: 8100, completed: 7900, incidents: 88 },
  { week: "T2W4", events: 7900, completed: 7680, incidents: 76 },
  { week: "T3W1", events: 8400, completed: 8120, incidents: 91 },
  { week: "T3W2", events: 8700, completed: 8450, incidents: 79 },
];

const transportEvents = [
  { id: "VC001", ma_lo: "LO-2026-0001", san_pham: "Gạo ST25 hữu cơ", tu: "Sóc Trăng", den: "Hà Nội", phuong_tien: "Xe tải đông lạnh", ngay_khoi_hanh: "01/03/2026", ngay_den: "04/03/2026", trang_thai: "completed" },
  { id: "VC002", ma_lo: "LO-2026-0002", san_pham: "Tôm sú đông lạnh", tu: "Cà Mau", den: "TP.HCM", phuong_tien: "Container lạnh", ngay_khoi_hanh: "02/03/2026", ngay_den: "03/03/2026", trang_thai: "completed" },
  { id: "VC003", ma_lo: "LO-2026-0003", san_pham: "Cà phê Arabica", tu: "Lâm Đồng", den: "Cảng Cát Lái", phuong_tien: "Xe tải", ngay_khoi_hanh: "02/03/2026", ngay_den: "03/03/2026", trang_thai: "incident" },
  { id: "VC004", ma_lo: "LO-2026-0004", san_pham: "Nước mắm Phú Quốc", tu: "Phú Quốc", den: "Hà Nội", phuong_tien: "Máy bay", ngay_khoi_hanh: "03/03/2026", ngay_den: "03/03/2026", trang_thai: "completed" },
  { id: "VC005", ma_lo: "LO-2026-0005", san_pham: "Xoài cát Hòa Lộc", tu: "Tiền Giang", den: "Hà Nội", phuong_tien: "Xe tải lạnh", ngay_khoi_hanh: "04/03/2026", ngay_den: "07/03/2026", trang_thai: "completed" },
  { id: "VC006", ma_lo: "LO-2026-0006", san_pham: "Cá tra phi-lê", tu: "An Giang", den: "Cảng Cát Lái", phuong_tien: "Xe đông lạnh", ngay_khoi_hanh: "04/03/2026", ngay_den: "05/03/2026", trang_thai: "completed" },
  { id: "VC007", ma_lo: "LO-2026-0007", san_pham: "Rau muống VietGAP", tu: "Lâm Đồng", den: "TP.HCM", phuong_tien: "Xe tải lạnh", ngay_khoi_hanh: "05/03/2026", ngay_den: "05/03/2026", trang_thai: "completed" },
  { id: "VC008", ma_lo: "LO-2026-0008", san_pham: "Nước dừa Bến Tre", tu: "Bến Tre", den: "Cảng Cát Lái", phuong_tien: "Xe tải", ngay_khoi_hanh: "05/03/2026", ngay_den: "06/03/2026", trang_thai: "completed" },
  { id: "VC009", ma_lo: "LO-2026-0009", san_pham: "Hạt điều Bình Phước", tu: "Bình Phước", den: "Cảng Cái Mép", phuong_tien: "Xe tải", ngay_khoi_hanh: "06/03/2026", ngay_den: "07/03/2026", trang_thai: "incident" },
  { id: "VC010", ma_lo: "LO-2026-0010", san_pham: "Bưởi da xanh", tu: "Bến Tre", den: "Hà Nội", phuong_tien: "Xe tải lạnh", ngay_khoi_hanh: "06/03/2026", ngay_den: "09/03/2026", trang_thai: "in_transit" },
  { id: "VC011", ma_lo: "LO-2026-0011", san_pham: "Mực khô Bình Thuận", tu: "Phan Thiết", den: "Hà Nội", phuong_tien: "Xe tải", ngay_khoi_hanh: "07/03/2026", ngay_den: "10/03/2026", trang_thai: "in_transit" },
  { id: "VC012", ma_lo: "LO-2026-0012", san_pham: "Sữa tươi Mộc Châu", tu: "Sơn La", den: "Hà Nội", phuong_tien: "Xe đông lạnh", ngay_khoi_hanh: "07/03/2026", ngay_den: "08/03/2026", trang_thai: "completed" },
  { id: "VC013", ma_lo: "LO-2026-0013", san_pham: "Mật ong Kon Tum", tu: "Kon Tum", den: "Cảng Đà Nẵng", phuong_tien: "Xe tải", ngay_khoi_hanh: "07/03/2026", ngay_den: "08/03/2026", trang_thai: "completed" },
  { id: "VC014", ma_lo: "LO-2026-0014", san_pham: "Vải thiều Bắc Giang", tu: "Bắc Giang", den: "Cửa khẩu Hữu Nghị", phuong_tien: "Xe tải lạnh", ngay_khoi_hanh: "08/03/2026", ngay_den: "09/03/2026", trang_thai: "in_transit" },
  { id: "VC015", ma_lo: "LO-2026-0015", san_pham: "Cua biển Cà Mau", tu: "Cà Mau", den: "TP.HCM", phuong_tien: "Xe đặc biệt", ngay_khoi_hanh: "08/03/2026", ngay_den: "09/03/2026", trang_thai: "in_transit" },
  { id: "VC016", ma_lo: "LO-2026-0016", san_pham: "Tiêu đen Gia Lai", tu: "Gia Lai", den: "Cảng Cái Mép", phuong_tien: "Xe tải", ngay_khoi_hanh: "08/03/2026", ngay_den: "09/03/2026", trang_thai: "in_transit" },
  { id: "VC017", ma_lo: "LO-2026-0017", san_pham: "Cá ngừ Đà Nẵng", tu: "Đà Nẵng", den: "Cảng Cái Mép", phuong_tien: "Container lạnh", ngay_khoi_hanh: "08/03/2026", ngay_den: "09/03/2026", trang_thai: "completed" },
  { id: "VC018", ma_lo: "LO-2026-0018", san_pham: "Nhãn lồng Hưng Yên", tu: "Hưng Yên", den: "Hà Nội", phuong_tien: "Xe tải lạnh", ngay_khoi_hanh: "08/03/2026", ngay_den: "08/03/2026", trang_thai: "completed" },
  { id: "VC019", ma_lo: "LO-2026-0019", san_pham: "Thịt bò nhập khẩu Úc", tu: "Cảng Cát Lái", den: "Kho TP.HCM", phuong_tien: "Xe đông lạnh", ngay_khoi_hanh: "08/03/2026", ngay_den: "08/03/2026", trang_thai: "completed" },
  { id: "VC020", ma_lo: "LO-2026-0020", san_pham: "Gạo ST25 hữu cơ", tu: "Sóc Trăng", den: "Cảng Cần Thơ", phuong_tien: "Sà lan", ngay_khoi_hanh: "08/03/2026", ngay_den: "09/03/2026", trang_thai: "in_transit" },
];

const columns = [
  { key: "id", label: "Mã", width: "80px" },
  { key: "ma_lo", label: "Mã lô" },
  { key: "san_pham", label: "Sản phẩm" },
  { key: "tu", label: "Điểm xuất" },
  { key: "den", label: "Điểm đến" },
  { key: "phuong_tien", label: "Phương tiện" },
  { key: "ngay_khoi_hanh", label: "Khởi hành" },
  { key: "ngay_den", label: "Dự kiến đến" },
  {
    key: "trang_thai",
    label: "Trạng thái",
    render: (row: Record<string, unknown>) => {
      const map: Record<string, { label: string; variant: "success" | "info" | "danger" }> = {
        completed: { label: "Hoàn thành", variant: "success" },
        in_transit: { label: "Đang ", variant: "info" },
        incident: { label: "Sự cố", variant: "danger" },
      };
      const m = map[row.trang_thai as string];
      return <Badge variant={m.variant}>{m.label}</Badge>;
    },
  },
];

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Sự kiện  (VC)</h1>
        <p className="text-sm text-gray-500 mt-1">Báo cáo sự kiện  trong chuỗi cung ứng</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[13px] text-gray-500 mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-[13px] text-gray-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Xu hướng sự kiện  (10 tuần)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="events" name="Tổng sự kiện" stroke="#1570EF" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="completed" name="Hoàn thành" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="incidents" name="Sự cố" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Danh sách sự kiện </h2>
        <DataTable columns={columns} data={transportEvents} searchable searchKeys={["id", "ma_lo", "san_pham", "tu", "den"] as never[]} />
      </div>
    </DashboardLayout>
  );
}
