"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { Download, X, Search, History, Eye } from "lucide-react";

interface ScanEvent {
  id: string;
  uid: string;
  ten_san_pham: string;
  gtin: string;
  doanh_nghiep: string;
  thoi_gian: string;
  nguon_quet: "QR code" | "Direct link";
  thiet_bi: string;
  ip_address: string;
  vi_tri: string;
  thoi_gian_sort: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const uidProducts: Record<string, { ten_san_pham: string; gtin: string; doanh_nghiep: string }> = {
  "UID-VN-00100001": { ten_san_pham: "Gạo ST25 hữu cơ", gtin: "8938501685025", doanh_nghiep: "Công ty CP Nông sản Việt" },
  "UID-VN-00100002": { ten_san_pham: "Tôm sú đông lạnh", gtin: "8938501685032", doanh_nghiep: "Công ty TNHH Thủy sản Minh Phú" },
  "UID-VN-00100003": { ten_san_pham: "Cà phê Arabica Đà Lạt", gtin: "8938501685049", doanh_nghiep: "Cơ sở Cà phê Nguyên Chất" },
  "UID-VN-00100004": { ten_san_pham: "Nước mắm Phú Quốc", gtin: "8938501685056", doanh_nghiep: "Công ty CP Thực phẩm Khải Hoàn" },
  "UID-VN-00100005": { ten_san_pham: "Xoài cát Hòa Lộc", gtin: "8938501685063", doanh_nghiep: "HTX Nông nghiệp Tiền Giang" },
  "UID-VN-00100006": { ten_san_pham: "Cá tra phi-lê đông lạnh", gtin: "8938501685070", doanh_nghiep: "Công ty CP Vĩnh Hoàn" },
  "UID-VN-00100008": { ten_san_pham: "Nước dừa tươi đóng lon", gtin: "8938501685094", doanh_nghiep: "Công ty TNHH Cocoxim" },
  "UID-VN-00100009": { ten_san_pham: "Hạt điều rang muối", gtin: "8938501685100", doanh_nghiep: "Công ty CP Hạt Điều Lafooco" },
  "UID-VN-00100011": { ten_san_pham: "Bưởi da xanh Bến Tre", gtin: "8938501685124", doanh_nghiep: "HTX Bưởi Da Xanh Bến Tre" },
  "UID-VN-00100013": { ten_san_pham: "Sữa tươi thanh trùng", gtin: "8938501685148", doanh_nghiep: "Công ty CP Sữa Việt Nam" },
  "UID-VN-00100014": { ten_san_pham: "Mật ong rừng Tây Nguyên", gtin: "8938501685155", doanh_nghiep: "Cơ sở Mật Ong Rừng Đắk Lắk" },
  "UID-VN-00100016": { ten_san_pham: "Tôm hùm đất sống", gtin: "8938501685179", doanh_nghiep: "Công ty TNHH Hải sản Phú Yên" },
  "UID-VN-00100018": { ten_san_pham: "Vải thiều Lục Ngạn", gtin: "8938501685193", doanh_nghiep: "HTX Vải Thiều Lục Ngạn" },
  "UID-VN-00100019": { ten_san_pham: "Cua biển Cà Mau", gtin: "8938501685209", doanh_nghiep: "Công ty CP Thủy sản Cà Mau" },
  "UID-VN-00100021": { ten_san_pham: "Tiêu đen Chư Sê", gtin: "8938501685223", doanh_nghiep: "HTX Hồ Tiêu Gia Lai" },
  "UID-VN-00100022": { ten_san_pham: "Cá ngừ đại dương đóng hộp", gtin: "8938501685230", doanh_nghiep: "Công ty CP Đồ Hộp Hạ Long" },
  "UID-VN-00100024": { ten_san_pham: "Thịt bò nhập khẩu Úc", gtin: "8938501685254", doanh_nghiep: "Công ty TNHH Thực phẩm Hùng Cường" },
  "UID-VN-00100025": { ten_san_pham: "Gạo ST25 hữu cơ", gtin: "8938501685261", doanh_nghiep: "Công ty CP Nông sản Việt" },
  "UID-VN-00100027": { ten_san_pham: "Bưởi da xanh Bến Tre", gtin: "8938501685285", doanh_nghiep: "HTX Bưởi Da Xanh Bến Tre" },
  "UID-VN-00100028": { ten_san_pham: "Cá tra phi-lê đông lạnh", gtin: "8938501685292", doanh_nghiep: "Công ty CP Vĩnh Hoàn" },
};

const provinces = ["TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Hải Phòng", "Khánh Hòa", "An Giang", "Tiền Giang"];
const devices = [
  "Mobile / Chrome 124", "Mobile / Safari 17", "Desktop / Chrome 124", "Desktop / Firefox 125",
  "Mobile / Chrome 123", "Desktop / Edge 124", "Mobile / Samsung Browser 24",
];
const ipBases = ["118.71", "103.49", "171.224", "27.73", "113.160", "14.232", "42.112", "183.80"];

function makeIp(seed: number) {
  const base = ipBases[seed % ipBases.length];
  return `${base}.xx.xx`;
}

// Generate ~50 scan events spread over last 60 days
const uidList = Object.keys(uidProducts);
const now = new Date("2026-05-04T18:00:00").getTime();
const day = 86400000;

const rawEvents: Array<{ uid: string; daysAgo: number; hour: number; nguon: "QR code" | "Direct link" }> = [
  { uid: "UID-VN-00100001", daysAgo: 0, hour: 9, nguon: "QR code" },
  { uid: "UID-VN-00100001", daysAgo: 2, hour: 14, nguon: "QR code" },
  { uid: "UID-VN-00100001", daysAgo: 5, hour: 11, nguon: "Direct link" },
  { uid: "UID-VN-00100001", daysAgo: 12, hour: 16, nguon: "QR code" },
  { uid: "UID-VN-00100001", daysAgo: 30, hour: 10, nguon: "QR code" },
  { uid: "UID-VN-00100002", daysAgo: 0, hour: 10, nguon: "QR code" },
  { uid: "UID-VN-00100002", daysAgo: 3, hour: 15, nguon: "QR code" },
  { uid: "UID-VN-00100002", daysAgo: 7, hour: 8, nguon: "Direct link" },
  { uid: "UID-VN-00100003", daysAgo: 1, hour: 13, nguon: "QR code" },
  { uid: "UID-VN-00100003", daysAgo: 8, hour: 11, nguon: "QR code" },
  { uid: "UID-VN-00100004", daysAgo: 0, hour: 16, nguon: "Direct link" },
  { uid: "UID-VN-00100004", daysAgo: 4, hour: 9, nguon: "QR code" },
  { uid: "UID-VN-00100004", daysAgo: 15, hour: 14, nguon: "QR code" },
  { uid: "UID-VN-00100005", daysAgo: 2, hour: 10, nguon: "QR code" },
  { uid: "UID-VN-00100006", daysAgo: 0, hour: 11, nguon: "QR code" },
  { uid: "UID-VN-00100006", daysAgo: 1, hour: 17, nguon: "Direct link" },
  { uid: "UID-VN-00100006", daysAgo: 6, hour: 12, nguon: "QR code" },
  { uid: "UID-VN-00100006", daysAgo: 20, hour: 9, nguon: "QR code" },
  { uid: "UID-VN-00100008", daysAgo: 1, hour: 8, nguon: "QR code" },
  { uid: "UID-VN-00100008", daysAgo: 9, hour: 15, nguon: "QR code" },
  { uid: "UID-VN-00100009", daysAgo: 0, hour: 14, nguon: "QR code" },
  { uid: "UID-VN-00100009", daysAgo: 3, hour: 10, nguon: "Direct link" },
  { uid: "UID-VN-00100009", daysAgo: 18, hour: 16, nguon: "QR code" },
  { uid: "UID-VN-00100011", daysAgo: 2, hour: 13, nguon: "QR code" },
  { uid: "UID-VN-00100011", daysAgo: 7, hour: 9, nguon: "QR code" },
  { uid: "UID-VN-00100013", daysAgo: 0, hour: 12, nguon: "QR code" },
  { uid: "UID-VN-00100013", daysAgo: 5, hour: 11, nguon: "Direct link" },
  { uid: "UID-VN-00100014", daysAgo: 1, hour: 15, nguon: "QR code" },
  { uid: "UID-VN-00100014", daysAgo: 10, hour: 10, nguon: "QR code" },
  { uid: "UID-VN-00100014", daysAgo: 25, hour: 14, nguon: "QR code" },
  { uid: "UID-VN-00100016", daysAgo: 0, hour: 9, nguon: "Direct link" },
  { uid: "UID-VN-00100016", daysAgo: 4, hour: 16, nguon: "QR code" },
  { uid: "UID-VN-00100018", daysAgo: 2, hour: 11, nguon: "QR code" },
  { uid: "UID-VN-00100018", daysAgo: 14, hour: 13, nguon: "QR code" },
  { uid: "UID-VN-00100019", daysAgo: 1, hour: 10, nguon: "QR code" },
  { uid: "UID-VN-00100019", daysAgo: 6, hour: 15, nguon: "Direct link" },
  { uid: "UID-VN-00100019", daysAgo: 22, hour: 9, nguon: "QR code" },
  { uid: "UID-VN-00100021", daysAgo: 3, hour: 14, nguon: "QR code" },
  { uid: "UID-VN-00100021", daysAgo: 11, hour: 10, nguon: "QR code" },
  { uid: "UID-VN-00100022", daysAgo: 0, hour: 16, nguon: "QR code" },
  { uid: "UID-VN-00100022", daysAgo: 8, hour: 11, nguon: "Direct link" },
  { uid: "UID-VN-00100024", daysAgo: 2, hour: 13, nguon: "QR code" },
  { uid: "UID-VN-00100024", daysAgo: 16, hour: 9, nguon: "QR code" },
  { uid: "UID-VN-00100025", daysAgo: 1, hour: 14, nguon: "QR code" },
  { uid: "UID-VN-00100025", daysAgo: 5, hour: 10, nguon: "Direct link" },
  { uid: "UID-VN-00100025", daysAgo: 13, hour: 15, nguon: "QR code" },
  { uid: "UID-VN-00100027", daysAgo: 3, hour: 11, nguon: "QR code" },
  { uid: "UID-VN-00100027", daysAgo: 19, hour: 16, nguon: "QR code" },
  { uid: "UID-VN-00100028", daysAgo: 0, hour: 10, nguon: "QR code" },
  { uid: "UID-VN-00100028", daysAgo: 7, hour: 13, nguon: "Direct link" },
];

export const scanEvents: ScanEvent[] = rawEvents.map((e, i) => {
  const ts = now - e.daysAgo * day + e.hour * 3600000 + (i * 137000) % 3600000;
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  const thoi_gian = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  const prod = uidProducts[e.uid];
  return {
    id: `SCN-${String(i + 1).padStart(4, "0")}`,
    uid: e.uid,
    ten_san_pham: prod.ten_san_pham,
    gtin: prod.gtin,
    doanh_nghiep: prod.doanh_nghiep,
    thoi_gian,
    nguon_quet: e.nguon,
    thiet_bi: devices[(i * 3 + e.daysAgo) % devices.length],
    ip_address: makeIp(i + e.daysAgo),
    vi_tri: provinces[(i + e.daysAgo * 2) % provinces.length],
    thoi_gian_sort: ts,
  };
}).sort((a, b) => b.thoi_gian_sort - a.thoi_gian_sort);

// ── CSV export ────────────────────────────────────────────────────────────────
function downloadCSV(rows: ScanEvent[], filename: string) {
  const headers = ["Mã định danh", "Tên sản phẩm", "Mã sản phẩm", "Doanh nghiệp", "Thời gian quét", "Nguồn quét", "Thiết bị", "Vị trí quét", "IP Address"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [r.uid, r.ten_san_pham, r.gtin, r.doanh_nghiep, r.thoi_gian, r.nguon_quet, r.thiet_bi, r.vi_tri, r.ip_address]
        .map((v) => `"${v}"`)
        .join(",")
    ),
  ];
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LichSuQuetPage() {
  const router = useRouter();
  const [selectedScan, setSelectedScan] = useState<ScanEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterProvince, setFilterProvince] = useState("");

  const today = new Date("2026-05-04").setHours(0, 0, 0, 0);
  const sevenDaysAgo = today - 6 * day;

  const totalToday = useMemo(
    () => scanEvents.filter((e) => e.thoi_gian_sort >= today).length,
    []
  );
  const total7Days = useMemo(
    () => scanEvents.filter((e) => e.thoi_gian_sort >= sevenDaysAgo).length,
    []
  );

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scanEvents.filter((e) => {
      if (q && !e.uid.toLowerCase().includes(q) && !e.ten_san_pham.toLowerCase().includes(q)) return false;
      if (filterProvince && e.vi_tri !== filterProvince) return false;
      if (fromDate) {
        const from = new Date(fromDate).setHours(0, 0, 0, 0);
        if (e.thoi_gian_sort < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate).setHours(23, 59, 59, 999);
        if (e.thoi_gian_sort > to) return false;
      }
      return true;
    });
  }, [searchQuery, filterProvince, fromDate, toDate]);

  const hasFilter = searchQuery || filterProvince || fromDate || toDate;
  const clearFilters = () => {
    setSearchQuery("");
    setFilterProvince("");
    setFromDate("");
    setToDate("");
  };

  const allProvinces = useMemo(
    () => Array.from(new Set(scanEvents.map((e) => e.vi_tri))).sort((a, b) => a.localeCompare(b, "vi")),
    []
  );

  const columns = [
    {
      key: "uid",
      label: "Mã định danh",
      width: "180px",
      render: (row: Record<string, unknown>) => (
        <span className="font-mono text-[13px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-gray-800 dark:text-gray-200">
          {row.uid as string}
        </span>
      ),
    },
    { key: "ten_san_pham", label: "Tên sản phẩm", render: (row: Record<string, unknown>) => row.ten_san_pham as string },
    {
      key: "vi_tri",
      label: "Vị trí quét",
      width: "240px",
      render: (row: Record<string, unknown>) => row.vi_tri as string,
    },
    { key: "thoi_gian", label: "Thời gian quét", width: "200px", render: (row: Record<string, unknown>) => row.thoi_gian as string },
    {
      key: "_actions",
      label: "Thao tác",
      width: "220px",
      sortable: false,
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedScan(row as unknown as ScanEvent)}
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Xem chi tiết"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => router.push(`/truy-xuat/lich-su-quet/${encodeURIComponent(row.uid as string)}`)}
            className="p-1.5 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
            title="Lịch sử quét"
          >
            <History size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lịch sử quét UID</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Theo dõi lịch sử tra cứu từng mã định danh
          </p>
        </div>
        <button
          onClick={() => downloadCSV(filteredData, "lich-su-quet-uid.csv")}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Download size={14} /> Xuất CSV
        </button>
      </div>

      {/* Stat cards */}
      {/* <div className="flex items-center gap-3 mb-5">
        <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <p className="text-[14px] text-gray-500 dark:text-gray-400">Tổng lượt quét</p>
          <Badge variant="info">{scanEvents.length}</Badge>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <p className="text-[14px] text-gray-500 dark:text-gray-400">Hôm nay</p>
          <Badge variant="success">{totalToday}</Badge>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <p className="text-[14px] text-gray-500 dark:text-gray-400">7 ngày gần nhất</p>
          <Badge variant="warning">{total7Days}</Badge>
        </div>
      </div> */}

      {/* Table + inline filters */}
      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={filteredData as unknown as Record<string, unknown>[]}
        customToolbar={
          <>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo UID, tên sản phẩm..."
                className="pl-8 pr-3 py-2 text-[14px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-brand-400 transition-colors w-56"
              />
            </div>
            {/* From date */}
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-gray-500 dark:text-gray-400 whitespace-nowrap">Từ ngày</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 text-[14px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-brand-400 transition-colors"
              />
            </div>
            {/* To date */}
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-gray-500 dark:text-gray-400 whitespace-nowrap">Đến ngày</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 text-[14px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-brand-400 transition-colors"
              />
            </div>
            {/* Province */}
            <select
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="px-3 py-2 text-[14px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:border-brand-400 transition-colors"
            >
              <option value="">Tất cả khu vực</option>
              {allProvinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {/* Clear */}
            {hasFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[14px] text-red-500 hover:text-red-600 transition-colors"
              >
                <X size={13} /> Xoá lọc
              </button>
            )}
          </>
        }
      />

      {/* Modal AC5 */}
      <Modal
        isOpen={selectedScan !== null}
        onClose={() => setSelectedScan(null)}
        title="Chi tiết lần quét"
      >
        {selectedScan && (
          <div className="space-y-5">
            {/* Section 1 — Thông tin sản phẩm */}
            <div>
              <p className="text-[13px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                Thông tin sản phẩm
              </p>
              <div className="space-y-2.5">
                <InfoRow label="Mã định danh">
                  <span className="font-mono text-[13px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-gray-800 dark:text-gray-200">
                    {selectedScan.uid}
                  </span>
                </InfoRow>
                <InfoRow label="Tên sản phẩm">
                  <span className="font-medium">{selectedScan.ten_san_pham}</span>
                </InfoRow>
                <InfoRow label="Mã sản phẩm">{selectedScan.gtin}</InfoRow>
                <InfoRow label="Doanh nghiệp">{selectedScan.doanh_nghiep}</InfoRow>
                <InfoRow label="Trang truy xuất">
                  <a
                    href={`https://ndatrace.vn/01/${selectedScan.gtin}/21/${selectedScan.uid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 dark:text-brand-400 hover:underline break-all text-[13px]"
                  >
                    {`https://ndatrace.vn/01/${selectedScan.gtin}/21/${selectedScan.uid}`}
                  </a>
                </InfoRow>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            {/* Section 2 — Thông tin lần quét */}
            <div>
              <p className="text-[13px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                Thông tin lần quét
              </p>
              <div className="space-y-2.5">
                <InfoRow label="Thời điểm">{selectedScan.thoi_gian}</InfoRow>
                <InfoRow label="Nguồn quét">
                  <Badge variant={selectedScan.nguon_quet === "QR code" ? "info" : "neutral"}>
                    {selectedScan.nguon_quet}
                  </Badge>
                </InfoRow>
                <InfoRow label="Thiết bị">{selectedScan.thiet_bi}</InfoRow>
                <InfoRow label="Địa chỉ IP">
                  <span className="font-mono text-[13px]">{selectedScan.ip_address}</span>
                </InfoRow>
                <InfoRow label="Vị trí quét">{selectedScan.vi_tri}</InfoRow>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setSelectedScan(null);
                  router.push(`/truy-xuat/lich-su-quet/${encodeURIComponent(selectedScan.uid)}`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
              >
                <History size={14} /> Xem lịch sử quét UID này →
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[13px] text-gray-500 dark:text-gray-400 w-32 shrink-0 pt-0.5">{label}</span>
      <span className="text-[14px] text-gray-800 dark:text-gray-200">{children}</span>
    </div>
  );
}
