"use client";

import { GripVertical, Pencil, Trash2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import type { CteEvent } from "../lib/types";

interface CteEventRowProps {
    event: CteEvent;
    index: number;
    expanded: boolean;
    onToggleExpand: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
}

export default function CteEventRow({
    event: ev,
    index,
    expanded,
    onToggleExpand,
    onEdit,
    onDelete,
    onDragStart,
    onDragOver,
    onDragEnd,
}: CteEventRowProps) {
    const requiredCount = ev.kde_mappings.filter((m) => m.is_required).length;
    const hasNoRequired = ev.kde_mappings.length > 0 && requiredCount === 0;

    return (
        <div draggable onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
            {/* Event header */}
            <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 cursor-grab active:cursor-grabbing transition-colors">
                <GripVertical size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
                <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-[12px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[14px] text-gray-800 dark:text-gray-200">{ev.event_name}</span>
                        {hasNoRequired && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-600">
                                <AlertTriangle size={11} /> Thiếu KDE bắt buộc
                            </span>
                        )}
                    </div>
                    <p className="text-[13px] text-gray-400 mt-0.5">
                        {ev.kde_mappings.length} KDE &nbsp;·&nbsp; {requiredCount} bắt buộc
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onToggleExpand}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Xem KDE"
                    >
                        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-500 transition-colors"
                        title="Chỉnh sửa sự kiện"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                        title="Xóa sự kiện"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* KDE table — view only */}
            {expanded && ev.kde_mappings.length > 0 && (
                <div className="px-14 pb-4">
                    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                        <table className="w-full text-[13px]">
                            <thead>
                                <tr className="bg-gray-50/80 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                                    <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500 w-8">#</th>
                                    <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Mã KDE</th>
                                    <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Tên</th>
                                    <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Kiểu</th>
                                    <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Bắt buộc</th>
                                    <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ev.kde_mappings.map((m, kIdx) => (
                                    <tr key={m.id} className="border-t border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/40 dark:hover:bg-gray-800/20">
                                        <td className="px-3 py-2.5 text-gray-400 font-mono text-[12px]">{kIdx + 1}</td>
                                        <td className="px-3 py-2.5">
                                            <code className="font-mono text-[12px] text-brand-600 dark:text-brand-400">{m.kde_code}</code>
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{m.kde_name}</td>
                                        <td className="px-3 py-2.5 text-gray-400">{m.kde_data_type}</td>
                                        <td className="px-3 py-2.5">
                                            {m.is_required
                                                ? <span className="text-[11px] font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full border border-brand-100">Bắt buộc</span>
                                                : <span className="text-[11px] text-gray-400">Tuỳ chọn</span>}
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-400 text-[13px] max-w-[160px] truncate">
                                            {m.note || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
