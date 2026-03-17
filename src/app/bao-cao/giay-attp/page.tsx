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
  certificateSummaryCards,
  certificateByType,
  certificateByIndustry,
  certificateTrendData,
  expiringCertificates,
  renewalStats,
} from "@/data/reports";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Báo cáo giấy ATTP</h1>
        <p className="text-sm text-gray-500 mt-1">Thống kê giấy chứng nhận an toàn thực phẩm</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {certificateSummaryCards.map((card) => (
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
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Phân loại theo loại giấy chứng nhận</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={certificateByType} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} giấy`, "Số lượng"]} />
              <Bar dataKey="issued" name="Đã cấp" fill="#1570EF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="active" name="Còn hiệu lực" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Thống kê gia hạn giấy chứng nhận</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={renewalStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.type}: ${entry.percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {renewalStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Xu hướng cấp phát giấy chứng nhận (12 tháng)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={certificateTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} giấy`, "Số lượng"]} />
            <Legend />
            <Line type="monotone" dataKey="issued" name="Cấp mới" stroke="#1570EF" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="renewed" name="Gia hạn" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="revoked" name="Thu hồi" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expiring Certificates Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Giấy chứng nhận sắp hết hạn</h2>
        <DataTable
          columns={[
            { key: "id", label: "ID", width: "80px" },
            { key: "ten_co_so", label: "Tên cơ sở" },
            { key: "loai_giay", label: "Loại giấy" },
            { key: "ngay_cap", label: "Ngày cấp" },
            { key: "ngay_het_han", label: "Ngày hết hạn" },
            { key: "dia_chi", label: "Địa chỉ" },
            {
              key: "tinh_trang",
              label: "Tình trạng",
              render: (row) => {
                const statusMap: Record<string, "success" | "warning" | "danger" | "neutral"> = {
                  "critical": "danger",
                  "warning": "warning",
                  "normal": "success"
                };
                const labelMap: Record<string, string> = {
                  "critical": "Sắp hết hạn",
                  "warning": "Cần gia hạn",
                  "normal": "Bình thường"
                };
                return <Badge variant={statusMap[row.tinh_trang as string] ?? "neutral"}>
                  {labelMap[row.tinh_trang as string] ?? row.tinh_trang}
                </Badge>;
              },
            },
          ]}
          data={expiringCertificates}
          searchable
          searchKeys={["id", "ten_co_so", "loai_giay", "dia_chi"] as never[]}
        />
      </div>
    </DashboardLayout>
  );
}
