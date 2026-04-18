"use client";

import { Search, Filter } from "lucide-react";
import {
    ReportPriority,
    ReportStatus,
    ReportType,
} from "@/lib/mock-data";

interface ReportFilterBarProps {
    searchText: string;
    onSearchChange: (text: string) => void;
    filterStatus: ReportStatus | "";
    onStatusChange: (status: ReportStatus | "") => void;
    filterPriority: ReportPriority | "";
    onPriorityChange: (priority: ReportPriority | "") => void;
    filterType: ReportType | "";
    onTypeChange: (type: ReportType | "") => void;
}

export default function ReportFilterBar({
    searchText,
    onSearchChange,
    filterStatus,
    onStatusChange,
    filterPriority,
    onPriorityChange,
    filterType,
    onTypeChange,
}: ReportFilterBarProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Tìm mã báo cáo, GTIN, tên sản phẩm..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-gray-400" />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => onStatusChange(e.target.value as ReportStatus | "")}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="submitted">Chưa xử lý</option>
                    <option value="resolved">Đã xác minh</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="rejected">Từ chối</option>
                </select>

                <select
                    value={filterPriority}
                    onChange={(e) => onPriorityChange(e.target.value as ReportPriority | "")}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">Tất cả mức ưu tiên</option>
                    <option value="critical">Khẩn cấp</option>
                    <option value="high">Cao</option>
                    <option value="medium">Trung bình</option>
                    <option value="low">Thấp</option>
                </select>

                <select
                    value={filterType}
                    onChange={(e) => onTypeChange(e.target.value as ReportType | "")}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">Tất cả loại báo cáo</option>
                    <option value="counterfeit">Hàng giả</option>
                    <option value="suspicious">Nghi ngờ</option>
                    <option value="quality">Chất lượng</option>
                    <option value="expired">Hết hạn</option>
                    <option value="packaging">Bao bì</option>
                </select>
            </div>
        </div>
    );
}
