"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DetailTabs from "../components/DetailTabs";
import KdeFormTab from "../components/KdeFormTab";
import VersionHistoryTab from "../components/VersionHistoryTab";
import CteUsageTab from "../components/CteUsageTab";
import { getKdeByCode, getCteUsageByKde } from "../../lib/mock-data";
import type { KdeFormData, KdeFormRef } from "../components/KdeFormTab";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const code = String(params.code ?? "");
    const kde = getKdeByCode(code);
    const usage = useMemo(() => getCteUsageByKde(code), [code]);
    const [activeTab, setActiveTab] = useState("info");
    const formRef = useRef<KdeFormRef>(null);

    if (!kde) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <BookOpen size={40} className="text-gray-300" />
                    <p className="text-gray-500">Không tìm thấy KDE với code {code}</p>
                    <Link href="/danh-muc/thu-vien-kde" className="text-sm text-brand-600 hover:underline">
                        ← Quay lại Thư viện KDE
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const current = kde.versions.find((v) => v.is_current) ?? kde.versions[0];

    const tabs = [
        { id: "info", label: "Thông tin chi tiết" },
        { id: "versions", label: "Lịch sử phiên bản" },
        { id: "cte", label: "Sự kiện đang dùng", badge: usage.length },
    ];

    const initialValues: Partial<KdeFormData> = {
        code: kde.code,
        name: kde.name,
        description: current.description,
        data_type: current.data_type,
        status: kde.status === "Nháp" ? "Hoạt động" : kde.status,
        nhom_thong_tin: kde.nhom_thong_tin,
    };

    const handleSave = (_data: KdeFormData) => {
        router.push(`/danh-muc/thu-vien-kde/${code}`);
    };

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-4">
                <Link
                    href={`/danh-muc/thu-vien-kde/${code}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sửa — {kde.name}</h1>
                </div>
                <Link
                    href={`/danh-muc/thu-vien-kde/${code}`}
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
                <KdeFormTab ref={formRef} mode="edit" initialValues={initialValues} onSave={handleSave} />
            )}
            {activeTab === "versions" && <VersionHistoryTab kde={kde} />}
            {activeTab === "cte" && <CteUsageTab kde={kde} usage={usage} />}
        </DashboardLayout>
    );
}
