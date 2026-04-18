"use client";

import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import {
    productReports,
    reportTypeLabels,
    priorityConfig,
    reportStatusConfig,
    type ProductReport,
} from "@/lib/mock-data";

interface ReportTableProps {
    reports: ProductReport[];
    chuaXuLy: number;
}

export default function ReportTable({ reports, chuaXuLy }: ReportTableProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Danh sách báo cáo
                </h2>
                <p className="text-xs text-gray-400">{reports.length} kết quả</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <th className="px-5 py-3 text-left font-medium">Mã báo cáo</th>
                            <th className="px-5 py-3 text-left font-medium">
                                Sản phẩm (GTIN)
                            </th>
                            <th className="px-5 py-3 text-left font-medium">Doanh nghiệp</th>
                            <th className="px-5 py-3 text-left font-medium">Loại</th>
                            <th className="px-5 py-3 text-left font-medium">Ưu tiên</th>
                            <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
                            <th className="px-5 py-3 text-left font-medium">Ngày gửi</th>
                            <th className="px-5 py-3 text-left font-medium">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {reports.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-5 py-12 text-center text-gray-400 text-sm"
                                >
                                    Không có báo cáo nào phù hợp
                                </td>
                            </tr>
                        ) : (
                            reports.map((report) => {
                                const statusCfg = reportStatusConfig[report.status];
                                const priCfg = priorityConfig[report.priority];
                                const isNew = report.status === "submitted";
                                return (
                                    <tr
                                        key={report.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isNew ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}`}
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                {isNew && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                                )}
                                                <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                                    {report.report_code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm leading-tight">
                                                {report.product_name}
                                            </p>
                                            <p className="font-mono text-xs text-gray-400 mt-0.5">
                                                {report.gtin}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400 max-w-[160px] truncate">
                                            {report.partner_name}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                {reportTypeLabels[report.report_type]}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={priCfg.variant}>{priCfg.label}</Badge>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={statusCfg.variant}>
                                                {statusCfg.label}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {new Date(report.created_at).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Link
                                                href={`/quan-tri/bao-cao-san-pham/${report.id}`}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                                            >
                                                {report.status === "submitted" ? "Xác minh" : "Xem chi tiết"}
                                                <ChevronRight size={13} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer count */}
            {reports.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-50 dark:border-gray-800 flex items-center gap-2 text-xs text-gray-400">
                    <AlertTriangle size={12} />
                    <span>
                        {chuaXuLy} báo cáo chưa xử lý •{" "}
                        {
                            productReports.filter(
                                (r) => r.priority === "critical" && r.status === "submitted"
                            ).length
                        }{" "}
                        báo cáo khẩn cấp cần ưu tiên
                    </span>
                </div>
            )}
        </div>
    );
}
