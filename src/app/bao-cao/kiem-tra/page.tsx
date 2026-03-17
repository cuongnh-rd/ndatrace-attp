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
  inspectionSummaryCards,
  inspectionByType,
  inspectionByViolationLevel,
  inspectionTrendData,
  commonViolations,
  recentInspections,
  inspectionByRegion,
} from "@/data/reports";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Báo cáo kiểm tra</h1>
        <p className="text-sm text-gray-500 mt-1">Thống kê kết quả kiểm tra an toàn thực phẩm</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {inspectionSummaryCards.map((card) => (
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
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Phân loại theo loại kiểm tra</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={inspectionByType} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} đợt`, "Số lượng"]} />
              <Bar dataKey="total" name="Tổng" fill="#1570EF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="passed" name="Đạt" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="Không đạt" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Mức độ vi phạm</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={inspectionByViolationLevel}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.level}: ${entry.percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {inspectionByViolationLevel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Xu hướng kiểm tra (12 tháng)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={inspectionTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} đợt`, "Số lượng"]} />
            <Legend />
            <Line type="monotone" dataKey="inspections" name="Tổng kiểm tra" stroke="#1570EF" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="passed" name="Đạt" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="failed" name="Không đạt" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Inspections Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Kiểm tra gần đây</h2>
        <DataTable
          columns={[
            { key: "id", label: "ID", width: "80px" },
            { key: "ten_co_so", label: "Tên cơ sở" },
            { key: "dia_chi", label: "Địa chỉ" },
            { key: "ngay_kiem_tra", label: "Ngày kiểm tra" },
            { key: "loai_kiem_tra", label: "Loại kiểm tra" },
            { key: "nguoi_kiem_tra", label: "Người kiểm tra" },
            { key: "vi_pham", label: "Vi phạm" },
            {
              key: "ket_qua",
              label: "Kết quả",
              render: (row) => {
                const statusMap: Record<string, "success" | "warning" | "danger" | "neutral"> = {
                  "passed": "success",
                  "warning": "warning",
                  "failed": "danger"
                };
                const labelMap: Record<string, string> = {
                  "passed": "Đạt",
                  "warning": "Cảnh báo",
                  "failed": "Không đạt"
                };
                return <Badge variant={statusMap[row.ket_qua as string] ?? "neutral"}>
                  {labelMap[row.ket_qua as string] ?? row.ket_qua}
                </Badge>;
              },
            },
          ]}
          data={recentInspections}
          searchable
          searchKeys={["id", "ten_co_so", "dia_chi", "nguoi_kiem_tra"] as never[]}
        />
      </div>
    </DashboardLayout>
  );
}
