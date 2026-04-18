"use client";

interface ReportStatsProps {
    total: number;
    chuaXuLy: number;
    daXacMinh: number;
    hoanThanh: number;
}

export default function ReportStats({
    total,
    chuaXuLy,
    daXacMinh,
    hoanThanh,
}: ReportStatsProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Tổng báo cáo
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {total}
                </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Chưa xử lý
                </p>
                <p className="text-2xl font-bold text-blue-600">{chuaXuLy}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Đã xác minh
                </p>
                <p className="text-2xl font-bold text-amber-500">{daXacMinh}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Hoàn thành
                </p>
                <p className="text-2xl font-bold text-green-600">{hoanThanh}</p>
            </div>
        </div>
    );
}
