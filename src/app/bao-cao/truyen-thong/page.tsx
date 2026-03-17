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
  communicationSummaryCards,
  campaignByChannel,
  campaignByTopic,
  communicationTrendData,
  recentCampaigns,
  topPerformingPosts,
  audienceDemographics,
  engagementByContentType,
} from "@/data/reports";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Báo cáo truyền thông</h1>
        <p className="text-sm text-gray-500 mt-1">Thống kê hoạt động truyền thông an toàn thực phẩm</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {communicationSummaryCards.map((card) => (
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
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Hiệu quả theo kênh truyền thông</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={campaignByChannel} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="channel" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}`, "Lượt tiếp cận"]} />
              <Bar dataKey="reach" name="Tiếp cận" fill="#1570EF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="engagement" name="Tương tác" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Phân bố khán giả theo độ tuổi</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={audienceDemographics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.ageGroup}: ${entry.percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
              >
                {audienceDemographics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#1570EF', '#22c55e', '#f59e0b', '#ef4444', '#6b7280'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Xu hướng hoạt động truyền thông (12 tháng)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={communicationTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="reach" name="Tiếp cận" stroke="#1570EF" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="engagement" name="Tương tác" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Campaigns Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Chiến dịch gần đây</h2>
        <DataTable
          columns={[
            { key: "id", label: "ID", width: "80px" },
            { key: "ten_chien_dich", label: "Tên chiến dịch" },
            { key: "kenh", label: "Kênh" },
            { key: "ngay_bat_dau", label: "Ngày bắt đầu" },
            { key: "ngay_ket_thuc", label: "Ngày kết thúc" },
            { key: "bai_dang", label: "Bài đăng", render: (row) => <span className="font-mono">{(row.bai_dang as number).toLocaleString()}</span> },
            { key: "tiep_can", label: "Tiếp cận", render: (row) => <span className="font-mono">{(row.tiep_can as number).toLocaleString()}</span> },
            { key: "tuong_tac", label: "Tương tác", render: (row) => <span className="font-mono text-green-700">{(row.tuong_tac as number).toLocaleString()}</span> },
            {
              key: "trang_thai",
              label: "Trạng thái",
              render: (row) => {
                const statusMap: Record<string, "success" | "warning" | "neutral"> = {
                  "active": "success",
                  "completed": "success",
                  "upcoming": "warning"
                };
                const labelMap: Record<string, string> = {
                  "active": "Đang chạy",
                  "completed": "Đã hoàn thành",
                  "upcoming": "Sắp diễn ra"
                };
                return <Badge variant={statusMap[row.trang_thai as string] ?? "neutral"}>
                  {labelMap[row.trang_thai as string] ?? row.trang_thai}
                </Badge>;
              },
            },
          ]}
          data={recentCampaigns}
          searchable
          searchKeys={["id", "ten_chien_dich", "kenh"] as never[]}
        />
      </div>

      {/* Top Performing Posts */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Bài đăng hiệu quả nhất</h2>
        <DataTable
          columns={[
            { key: "rank", label: "#", width: "50px" },
            { key: "tieu_de", label: "Tiêu đề" },
            { key: "kenh", label: "Kênh", render: (row) => <Badge variant="info">{row.kenh}</Badge> },
            { key: "luot_xem", label: "Lượt xem", render: (row) => <span className="font-mono">{(row.luot_xem as number).toLocaleString()}</span> },
            { key: "tuong_tac", label: "Tương tác", render: (row) => <span className="font-mono text-green-700">{(row.tuong_tac as number).toLocaleString()}</span> },
            { key: "ngay_dang", label: "Ngày đăng" },
          ]}
          data={topPerformingPosts}
          searchable
          searchKeys={["tieu_de", "kenh"] as never[]}
        />
      </div>
    </DashboardLayout>
  );
}
