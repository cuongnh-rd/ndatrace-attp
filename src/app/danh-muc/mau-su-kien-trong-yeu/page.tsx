"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import SectionPage from "@/components/ui/SectionPage";
import CteListTable from "./components/CteListTable";
import type { CteTemplate } from "./lib/types";

export default function Page() {
    const router = useRouter();
    const [versionTarget, setVersionTarget] = useState<CteTemplate | null>(null);

    const handleEditActive = (template: CteTemplate) => {
        setVersionTarget(template);
    };

    const handleConfirmVersion = () => {
        if (!versionTarget) return;
        setVersionTarget(null);
        router.push(`/danh-muc/mau-su-kien-trong-yeu/${versionTarget.id}/sua`);
    };

    return (
        <>
            <SectionPage
                title="Mẫu sự kiện trọng yếu"
                subtitle="Quản lý Mẫu sự kiện trọng yếu theo nhóm ngành"
                actionButton={
                    <Link
                        href="/danh-muc/mau-su-kien-trong-yeu/tao-moi"
                        className="flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl px-4 py-2 transition-colors"
                    >
                        <Plus size={14} /> Tạo mẫu mới
                    </Link>
                }
            >
                <CteListTable onEditActive={handleEditActive} />
            </SectionPage>

            {/* Version confirm modal */}
            {versionTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setVersionTarget(null)} />
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tạo phiên bản mới?</h2>
                        <p className="text-[14px] text-gray-500 mb-4">
                            Mẫu <strong>{versionTarget.vc_type_name}</strong> đang hoạt động (v{versionTarget.version}).
                            Chỉnh sửa sẽ tạo phiên bản mới <strong>v{versionTarget.version + 1}</strong>.
                            Phiên bản hiện tại (v{versionTarget.version}) sẽ bị khóa.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button onClick={() => setVersionTarget(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                Huỷ
                            </button>
                            <button onClick={handleConfirmVersion}
                                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">
                                Tiếp tục — Tạo v{versionTarget.version + 1}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
