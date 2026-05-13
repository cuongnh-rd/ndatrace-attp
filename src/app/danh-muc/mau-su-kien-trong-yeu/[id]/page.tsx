"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, BookOpen, AlertTriangle, X } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import DetailTabs from "./components/DetailTabs";
import EventsKdeTab from "./components/EventsKdeTab";
import VersionHistoryTab from "./components/VersionHistoryTab";
import InfoTab from "./components/InfoTab";
import VersionConfirmModal from "./components/_VersionConfirmModal";
import { getTemplateById, countOutdatedKdes } from "../lib/mock-data";
import { statusVariant, statusLabel } from "../lib/constants";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = String(params.id ?? "");
    const template = getTemplateById(id);
    const [activeTab, setActiveTab] = useState("events");
    const [highlightOutdated, setHighlightOutdated] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
    const [versionModalOpen, setVersionModalOpen] = useState(false);
    const eventsRef = useRef<HTMLDivElement>(null);

    if (!template) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <BookOpen size={40} className="text-gray-300" />
                    <p className="text-gray-500">Không tìm thấy mẫu sự kiện với ID: {id}</p>
                    <Link href="/danh-muc/mau-su-kien-trong-yeu" className="text-sm text-brand-600 hover:underline">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const outdatedCount = countOutdatedKdes(template);
    const isActive = template.status === "Hoạt động";

    const handleEditClick = () => {
        if (isActive) {
            setVersionModalOpen(true);
        } else {
            router.push(`/danh-muc/mau-su-kien-trong-yeu/${template.id}/sua`);
        }
    };

    const handleVersionConfirm = () => {
        setVersionModalOpen(false);
        router.push(`/danh-muc/mau-su-kien-trong-yeu/${template.id}/sua`);
    };

    const handleShowOutdated = () => {
        setActiveTab("events");
        setHighlightOutdated(true);
        setTimeout(() => {
            eventsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const tabs = [
        { id: "events", label: "Sự kiện & KDE", badge: template.events.length },
        { id: "versions", label: "Lịch sử phiên bản" },
        { id: "info", label: "Thông tin chung" },
    ];

    return (
        <DashboardLayout>
            {/* Back + header */}
            <div className="flex items-center gap-3 mb-4">
                <Link href="/danh-muc/mau-su-kien-trong-yeu"
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{template.vc_type_name}</h1>
                        <code className="font-mono text-[13px] text-gray-400">{template.vc_type}</code>
                        <Badge variant={statusVariant[template.status]}>{statusLabel[template.status]}</Badge>
                        <span className="font-mono text-[13px] text-gray-400">v{template.version}</span>
                    </div>
                    <p className="text-[13px] text-gray-500 mt-0.5">{template.family_name}</p>
                </div>
                <button onClick={handleEditClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Pencil size={14} />
                    {isActive ? `Chỉnh sửa (tạo v${template.version + 1})` : "Chỉnh sửa"}
                </button>
            </div>

            {/* AC7 — Outdated KDE banner */}
            {outdatedCount > 0 && showBanner && (
                <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-xl">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                    <p className="text-[14px] text-amber-800 dark:text-amber-300 flex-1">
                        <strong>{outdatedCount} KDE</strong> trong mẫu này đang dùng phiên bản cũ hơn thư viện.{" "}
                        <button onClick={handleShowOutdated} className="underline hover:no-underline font-medium transition-colors">
                            Xem chi tiết ↓
                        </button>
                    </p>
                    <button onClick={() => setShowBanner(false)}
                        className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded transition-colors">
                        <X size={14} className="text-amber-600" />
                    </button>
                </div>
            )}

            {/* Active CTE read-only notice */}
            {isActive && (
                <div className="px-4 py-2.5 mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-[13px] text-blue-700 dark:text-blue-300">
                    Mẫu đang hoạt động — chỉnh sửa sẽ tạo phiên bản mới và khoá phiên bản hiện tại.
                </div>
            )}

            <DetailTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

            <div ref={eventsRef}>
                {activeTab === "events" && (
                    <EventsKdeTab template={template} highlightOutdated={highlightOutdated} />
                )}
            </div>
            {activeTab === "versions" && <VersionHistoryTab templateId={template.id} />}
            {activeTab === "info" && <InfoTab template={template} />}

            <VersionConfirmModal
                isOpen={versionModalOpen}
                onClose={() => setVersionModalOpen(false)}
                onConfirm={handleVersionConfirm}
                template={template}
            />
        </DashboardLayout>
    );
}
