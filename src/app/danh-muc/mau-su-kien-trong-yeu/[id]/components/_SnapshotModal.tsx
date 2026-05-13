"use client";

import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { CteVersionHistory } from "../../lib/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    history: CteVersionHistory | null;
}

export default function SnapshotModal({ isOpen, onClose, history }: Props) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    if (!isOpen || !history) return null;

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[88vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Snapshot phiên bản v{history.version}</h2>
                        <p className="text-[13px] text-gray-500 mt-0.5">Tạo bởi {history.created_by} — {history.created_at}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {history.snapshot_events.length === 0 ? (
                        <p className="text-center text-gray-400 py-8 text-[14px]">Không có dữ liệu snapshot</p>
                    ) : history.snapshot_events.map((ev, eIdx) => (
                        <div key={ev.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggle(ev.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50/80 dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors text-left"
                            >
                                <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-[12px] font-bold flex items-center justify-center shrink-0">
                                    {eIdx + 1}
                                </span>
                                <div className="flex-1">
                                    <span className="font-semibold text-[14px] text-gray-800 dark:text-gray-200">{ev.event_name}</span>
                                    <span className="ml-2 font-mono text-[12px] text-gray-400">{ev.event_code}</span>
                                    <p className="text-[12px] text-gray-400">{ev.kde_mappings.length} KDE</p>
                                </div>
                                {expanded.has(ev.id) ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                            </button>

                            {(expanded.has(ev.id) || true) && ev.kde_mappings.length > 0 && (
                                <div className="border-t border-gray-50 dark:border-gray-800">
                                    <table className="w-full text-[13px]">
                                        <tbody>
                                            {ev.kde_mappings.map((m, kIdx) => (
                                                <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800/60 last:border-0">
                                                    <td className="px-4 py-2.5 text-gray-400 w-6 font-mono text-[12px]">{kIdx + 1}</td>
                                                    <td className="px-3 py-2.5 font-mono text-[12px] text-brand-600 dark:text-brand-400 w-40">{m.kde_code}</td>
                                                    <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{m.kde_name}</td>
                                                    <td className="px-3 py-2.5 text-gray-400">{m.kde_data_type}</td>
                                                    <td className="px-3 py-2.5 text-right font-mono text-[11px] text-gray-400">v{m.kde_version}</td>
                                                    <td className="px-3 py-2.5 text-right">
                                                        {m.is_required
                                                            ? <span className="text-[11px] text-brand-600 font-medium">Bắt buộc</span>
                                                            : <span className="text-[11px] text-gray-400">Tuỳ chọn</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
