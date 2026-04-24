"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, GitCompare, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import DetailTabs from "./components/DetailTabs";
import KdeInfoTab from "./components/KdeInfoTab";
import VersionHistoryTab from "./components/VersionHistoryTab";
import CteUsageTab from "./components/CteUsageTab";
import { getKdeByCode, getCteUsageByKde } from "../lib/mock-data";
import { statusLabel, statusVariant } from "../lib/constants";

export default function Page() {
    const params = useParams();
    const code = String(params.code ?? "");
    const kde = getKdeByCode(code);
    const usage = useMemo(() => getCteUsageByKde(code), [code]);
    const [activeTab, setActiveTab] = useState("info");

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
        { id: "cte", label: "Đang sử dụng", badge: usage.length },
    ];

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
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{kde.name}</h1>
                </div>
                {/* {kde.versions.length > 1 && (
                    <Link
                        href={`/danh-muc/thu-vien-kde/${kde.code}/so-sanh`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <GitCompare size={14} /> So sánh phiên bản
                    </Link>
                )} */}
            </div>

            <DetailTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

            {activeTab === "info" && <KdeInfoTab kde={kde} version={current} />}
            {activeTab === "versions" && <VersionHistoryTab kde={kde} />}
            {activeTab === "cte" && <CteUsageTab kde={kde} usage={usage} />}
        </DashboardLayout>
    );
}
