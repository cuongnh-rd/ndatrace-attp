"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import { ArrowLeft, Download } from "lucide-react";
import { scanEvents } from "../page";

function downloadCSV(rows: ReturnType<typeof scanEvents.filter>, filename: string) {
  const headers = ["Mã định danh", "Tên sản phẩm", "Mã sản phẩm", "Thời gian quét", "Nguồn quét", "Vị trí quét", "IP Address"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [r.uid, r.ten_san_pham, r.gtin, r.thoi_gian, r.nguon_quet, r.vi_tri, r.ip_address]
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

export default function LichSuQuetUidPage() {
  const router = useRouter();
  const params = useParams();
  const uid = decodeURIComponent(String(params.uid ?? ""));

  const uidEvents = useMemo(
    () => scanEvents.filter((e) => e.uid === uid),
    [uid]
  );

  const firstEvent = uidEvents[uidEvents.length - 1];
  const productName = firstEvent?.ten_san_pham ?? "—";
  const gtin = firstEvent?.gtin ?? "—";
  const doanhNghiep = firstEvent?.doanh_nghiep ?? "—";

  // Stats
  const totalScans = uidEvents.length;

  const last30Days = useMemo(() => {
    const cutoff = new Date("2026-05-04").getTime() - 30 * 86400000;
    return uidEvents.filter((e) => e.thoi_gian_sort >= cutoff).length;
  }, [uidEvents]);

  const avgPerDay = last30Days > 0 ? (last30Days / 30).toFixed(1) : "0";

  const peakDay = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of uidEvents) {
      const d = new Date(e.thoi_gian_sort);
      const key = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    let max = 0;
    let maxDay = "—";
    for (const [day, count] of Object.entries(counts)) {
      if (count > max) { max = count; maxDay = day; }
    }
    return { count: max, day: maxDay };
  }, [uidEvents]);

  const columns = [
    { key: "thoi_gian", label: "Thời gian", width: "220px", render: (row: Record<string, unknown>) => row.thoi_gian as string },
    {
      key: "nguon_quet",
      label: "Nguồn quét",
      width: "140px",
      render: (row: Record<string, unknown>) => (
        <Badge variant={row.nguon_quet === "QR code" ? "info" : "neutral"}>
          {row.nguon_quet as string}
        </Badge>
      ),
    },
    { key: "vi_tri", label: "Vị trí quét", width: "140px" },
    {
      key: "ip_address",
      label: "IP Address",
      width: "140px",
      render: (row: Record<string, unknown>) => (
        <span className="font-mono text-[13px]">{row.ip_address as string}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      {/* Back button */}
      <button
        onClick={() => router.push("/truy-xuat/lich-su-quet")}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 transition-colors"
      >
        <ArrowLeft size={15} />
        <span>Lịch sử quét mã định danh</span>
      </button>

      {/* Page title row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white font-mono">{uid}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {productName}
            {/* <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
            {gtin} */}
            <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
            {doanhNghiep}
          </p>
        </div>
        <button
          onClick={() => downloadCSV(uidEvents, `lich-su-quet-${uid}.csv`)}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Download size={14} /> Xuất CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <p className="text-[14px] text-gray-500 dark:text-gray-400">Tổng lượt quét</p>
          <Badge variant="info">{totalScans}</Badge>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <p className="text-[14px] text-gray-500 dark:text-gray-400">TB lượt/ngày (30 ngày)</p>
          <Badge variant="neutral">{avgPerDay}</Badge>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <p className="text-[14px] text-gray-500 dark:text-gray-400">Đỉnh quét cao nhất</p>
          <Badge variant="warning">{peakDay.count} lượt — {peakDay.day}</Badge>
        </div>
      </div>

      {/* Table */}
      {uidEvents.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 py-16 text-center text-gray-400 text-[14px]">
          Không có dữ liệu quét cho UID này
        </div>
      ) : (
        <DataTable
          columns={columns as Parameters<typeof DataTable>[0]["columns"]}
          data={uidEvents as unknown as Record<string, unknown>[]}
        />
      )}
    </DashboardLayout>
  );
}
