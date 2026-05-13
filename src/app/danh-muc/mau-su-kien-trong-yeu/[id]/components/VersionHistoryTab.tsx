"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getVersionHistories } from "../../lib/mock-data";
import type { CteVersionHistory } from "../../lib/types";
import SnapshotModal from "./_SnapshotModal";

interface Props {
    templateId: string;
}

export default function VersionHistoryTab({ templateId }: Props) {
    const histories = getVersionHistories(templateId);
    const [snapshot, setSnapshot] = useState<CteVersionHistory | null>(null);

    if (histories.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 py-14 text-center text-gray-400">
                <p className="text-[14px]">Chưa có lịch sử phiên bản</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                            <Th>Phiên bản</Th>
                            <Th>Ngày tạo</Th>
                            <Th>Người tạo</Th>
                            <Th>Trạng thái</Th>
                            <Th>Thao tác</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {histories.map((h) => (
                            <tr key={h.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-colors">
                                <td className="px-5 py-3.5 font-mono text-[14px] font-semibold text-gray-700 dark:text-gray-300">
                                    v{h.version}
                                </td>
                                <td className="px-5 py-3.5 text-[14px] text-gray-500 dark:text-gray-400">{h.created_at}</td>
                                <td className="px-5 py-3.5 text-[14px] text-gray-600 dark:text-gray-300">{h.created_by}</td>
                                <td className="px-5 py-3.5">
                                    {h.status === "Active"
                                        ? <Badge variant="success">Đang hoạt động</Badge>
                                        : <Badge variant="neutral">Đã thay thế</Badge>}
                                </td>
                                <td className="px-5 py-3.5">
                                    <button
                                        onClick={() => setSnapshot(h)}
                                        className="inline-flex items-center gap-1.5 text-[13px] text-brand-600 hover:text-brand-700 transition-colors"
                                    >
                                        <Eye size={14} /> Xem snapshot
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SnapshotModal
                isOpen={!!snapshot}
                onClose={() => setSnapshot(null)}
                history={snapshot}
            />
        </>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="text-left px-5 py-3">
            <span className="text-[14px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{children}</span>
        </th>
    );
}
