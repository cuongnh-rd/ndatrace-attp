"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import type { CteTemplate } from "../../lib/types";

interface Props {
    template: CteTemplate;
    highlightOutdated?: boolean;
}

export default function EventsKdeTab({ template, highlightOutdated }: Props) {
    const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set(template.events.map((e) => e.id)));

    const toggle = (id: string) => {
        setExpandedEvents((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    if (template.events.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 py-16 flex flex-col items-center gap-2 text-gray-400">
                <p className="text-[14px]">Chưa có sự kiện nào trong mẫu này</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {template.events.map((ev, eIdx) => {
                const isExpanded = expandedEvents.has(ev.id);
                const outdatedCount = ev.kde_mappings.filter((m) => m.kde_version < m.kde_current_version).length;

                return (
                    <div key={ev.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {/* Event header */}
                        <button
                            onClick={() => toggle(ev.id)}
                            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors text-left"
                        >
                            <span className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-[13px] font-bold flex items-center justify-center shrink-0">
                                {eIdx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-[15px] text-gray-800 dark:text-gray-200">{ev.event_name}</span>
                                    <code className="font-mono text-[12px] text-gray-400">{ev.event_code}</code>
                                </div>
                                <p className="text-[13px] text-gray-400 mt-0.5">
                                    {ev.kde_mappings.length} KDE &nbsp;·&nbsp; {ev.kde_mappings.filter((m) => m.is_required).length} bắt buộc
                                    {outdatedCount > 0 && (
                                        <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                                            <AlertTriangle size={12} /> {outdatedCount} lỗi thời
                                        </span>
                                    )}
                                </p>
                            </div>
                            {isExpanded ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                        </button>

                        {/* KDE table */}
                        {isExpanded && (
                            <div className="border-t border-gray-50 dark:border-gray-800">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50/80 dark:bg-gray-800/40 border-b border-gray-50 dark:border-gray-800">
                                            <th className="text-left px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-gray-500 w-10">#</th>
                                            <th className="text-left px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Mã KDE</th>
                                            <th className="text-left px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Tên trường</th>
                                            <th className="text-left px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Kiểu DL</th>
                                            <th className="text-left px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Bắt buộc</th>
                                            <th className="text-left px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Ghi chú</th>
                                            <th className="text-left px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Tình trạng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ev.kde_mappings.map((m, kIdx) => {
                                            const isOutdated = m.kde_version < m.kde_current_version;
                                            return (
                                                <tr
                                                    key={m.id}
                                                    id={`kde-row-${m.id}`}
                                                    className={`border-b border-gray-50 dark:border-gray-800/60 transition-colors ${isOutdated && highlightOutdated ? "bg-amber-50/60 dark:bg-amber-900/10" : "hover:bg-gray-50/40 dark:hover:bg-gray-800/20"}`}
                                                >
                                                    <td className="px-5 py-3 text-gray-400 font-mono text-[13px]">{kIdx + 1}</td>
                                                    <td className="px-3 py-3">
                                                        <code className="font-mono text-[13px] text-brand-600 dark:text-brand-400">{m.kde_code}</code>
                                                    </td>
                                                    <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{m.kde_name}</td>
                                                    <td className="px-3 py-3 text-gray-500 text-[13px]">{m.kde_data_type}</td>
                                                    <td className="px-3 py-3">
                                                        {m.is_required
                                                            ? <span className="text-[11px] font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full border border-brand-100">Bắt buộc</span>
                                                            : <span className="text-[11px] text-gray-400">Tuỳ chọn</span>}
                                                    </td>
                                                    <td className="px-3 py-3 text-gray-400 text-[13px] max-w-[160px] truncate">
                                                        {m.note || "—"}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        {isOutdated ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-900/40 px-2 py-0.5 rounded-full">
                                                                <AlertTriangle size={11} />
                                                                Có v{m.kde_current_version} mới
                                                            </span>
                                                        ) : (
                                                            <span className="text-[11px] text-gray-400">Mới nhất</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
