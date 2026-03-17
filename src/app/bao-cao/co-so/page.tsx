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
  facilitySummaryCards,
  facilityByType,
  facilityByRegion,
  facilityTrendData,
  violationByCategory,
} from "@/data/reports";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Báo cáo cơ sở</h1>
        <p className="text-sm text-gray-500 mt-1">Thống kê và báo cáo tình hình cơ sở kinh doanh thực phẩm</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {facilitySummaryCards.map((card) => (
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
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Phân loại cơ sở theo loại hình</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facilityByType} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} cơ sở`, "Số lượng"]} />
              <Bar dataKey="total" name="Tổng cơ sở" fill="#1570EF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="certified" name="Đã chứng nhận" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Phân bố theo khu vực</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facilityByRegion.slice(0, 6)} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="region" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} cơ sở`, "Số lượng"]} />
              <Bar dataKey="total" name="Tổng cơ sở" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Xu hướng đăng ký cơ sở (12 tháng)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={facilityTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} cơ sở`, "Số lượng"]} />
              <Legend />
              <Line type="monotone" dataKey="registered" name="Đăng ký" stroke="#1570EF" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="certified" name="Chứng nhận" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Thống kê vi phạm theo danh mục</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={violationByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.category}: ${entry.count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {violationByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.severity === 'high' ? '#ef4444' : entry.severity === 'medium' ? '#f59e0b' : '#22c55e'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Chi tiết cơ sở theo loại hình</h2>
        <DataTable
          columns={[
            { key: "type", label: "Loại hình cơ sở" },
            { key: "total", label: "Tổng cơ sở", render: (row) => <span className="font-mono">{(row.total as number).toLocaleString()}</span> },
            { key: "certified", label: "Đã chứng nhận", render: (row) => <span className="font-mono text-green-700">{(row.certified as number).toLocaleString()}</span> },
            { key: "violation", label: "Vi phạm", render: (row) => <span className="font-mono text-red-700">{(row.violation as number).toLocaleString()}</span> },
            {
              key: "rate",
              label: "Tỷ lệ đạt",
              render: (row) => {
                const rate = ((row.certified as number) / (row.total as number) * 100).toFixed(1);
                return <Badge variant="success">{rate}%</Badge>;
              },
            },
          ]}
          data={facilityByType}
          searchable
          searchKeys={["type"] as never[]}
        />
      </div>
    </DashboardLayout>
  );
}
