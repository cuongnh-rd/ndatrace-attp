"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, GitBranch } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DetailTabs from "../[code]/components/DetailTabs";
import KdeFormTab from "../[code]/components/KdeFormTab";
import type { KdeFormData, KdeFormRef } from "../[code]/components/KdeFormTab";

const tabs = [
    { id: "info", label: "Thông tin chi tiết" },
    { id: "versions", label: "Lịch sử phiên bản" },
    { id: "cte", label: "Sự kiện đang dùng" },
];

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <Icon size={32} className="text-gray-300" />
                <p className="text-[14px]">{message}</p>
            </div>
        </div>
    );
}

export default function Page() {
    const router = useRouter();
    const formRef = useRef<KdeFormRef>(null);
    const [activeTab, setActiveTab] = useState("info");

    const handleSave = (_data: KdeFormData) => {
        router.push("/danh-muc/thu-vien-kde");
    };

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-4">
                <Link
                    href="/danh-muc/thu-vien-kde"
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Thêm trường dữ liệu mới</h1>
                </div>
                <Link
                    href="/danh-muc/thu-vien-kde"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Hủy
                </Link>
                <button
                    onClick={() => formRef.current?.submit()}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
                >
                    Lưu
                </button>
            </div>

            <DetailTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

            {activeTab === "info" && (
                <KdeFormTab ref={formRef} mode="create" onSave={handleSave} />
            )}
            {activeTab === "versions" && (
                <EmptyState icon={Clock} message="Chưa có lịch sử phiên bản" />
            )}
            {activeTab === "cte" && (
                <EmptyState icon={GitBranch} message="Chưa có CTE nào sử dụng trường dữ liệu này" />
            )}
        </DashboardLayout>
    );
}
