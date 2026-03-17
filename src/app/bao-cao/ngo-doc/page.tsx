"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  poisoningSummaryCards,
  poisoningByCause,
  poisoningByLocation,
  poisoningTrendData,
  poisoningByRegion,
  recentPoisoningCases,
  poisoningByFoodType,
  responseTimeStats,
} from "@/data/reports";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Báo cáo ngộ độc</h1>
        <p className="text-sm text-gray-500 mt-1">Thống kê các vụ ngộ độc thực phẩm</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {poisoningSummaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[14px] text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className={`text-[14px] mt-1 ${card.up ? "text-green-600" : "text-red-500"}`}>
              {card.change} so với tháng trước
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Nguyên nhân ngộ độc</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={poisoningByCause}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.cause}: ${entry.percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {poisoningByCause.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.severity === 'critical' ? '#ef4444' : entry.severity === 'high' ? '#f97316' : entry.severity === 'medium' ? '#f59e0b' : '#22c55e'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Địa điểm xảy ra</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={poisoningByLocation} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="location" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Số vụ" fill="#1570EF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Xu hướng ngộ độc (12 tháng)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={poisoningTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cases" name="Số vụ" stroke="#1570EF" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="people" name="Số người" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Response Time Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {responseTimeStats.map((stat) => (
          <div key={stat.metric} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[14px] text-gray-500 mb-1">{stat.metric}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-[14px] text-gray-400 mt-1">Mục tiêu: {stat.benchmark}</p>
          </div>
        ))}
      </div>

      {/* Recent Cases Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Vụ ngộ độc gần đây</h2>
        <DataTable
          columns={[
            { key: "id", label: "ID", width: "80px" },
            { key: "ngay_bat_dau", label: "Ngày bắt đầu" },
            { key: "dia_diem", label: "Địa điểm" },
            { key: "khu_vuc", label: "Khu vực" },
            { key: "so_nguoi", label: "Số người", render: (row) => <span className="font-mono">{(row.so_nguoi as number).toLocaleString()}</span> },
            { key: "nguoi_tu_vong", label: "Tử vong", render: (row) => <span className="font-mono text-red-700">{row.nguoi_tu_vong}</span> },
            { key: "nguyen_nhan", label: "Nguyên nhân" },
            { key: "thoi_gian_xu_ly", label: "Thời gian xử lý" },
            {
              key: "trang_thai",
              label: "Trạng thái",
              render: (row) => {
                const statusMap: Record<string, "success" | "warning" | "danger" | "neutral"> = {
                  "resolved": "success",
                  "investigating": "warning",
                  "active": "danger"
                };
                const labelMap: Record<string, string> = {
                  "resolved": "Đã xử lý",
                  "investigating": "Đang điều tra",
                  "active": "Đang hoạt động"
                };
                return <Badge variant={statusMap[row.trang_thai as string] ?? "neutral"}>
                  {labelMap[row.trang_thai as string] ?? row.trang_thai}
                </Badge>;
              },
            },
          ]}
          data={recentPoisoningCases}
          searchable
          searchKeys={["id", "dia_diem", "khu_vuc", "nguyen_nhan"] as never[]}
        />
      </div>
    </DashboardLayout>
  );
}
