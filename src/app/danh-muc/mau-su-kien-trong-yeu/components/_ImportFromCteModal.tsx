"use client";

import { useState, useMemo } from "react";
import { X, Search, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle, Download, FileText } from "lucide-react";
import { mockTemplatesForImport } from "../lib/mock-data";
import { generateId } from "../lib/mock-data";
import type { CteEvent, CteTemplate } from "../lib/types";

interface Props {
    open: boolean;
    onClose: () => void;
    onImport: (events: CteEvent[]) => void;
    existingEventCodes: string[];
}

export default function ImportFromCteModal({ open, onClose, onImport, existingEventCodes }: Props) {
    const [selected, setSelected] = useState<CteTemplate | null>(null);
    const [search, setSearch] = useState("");
    const [familyFilter, setFamilyFilter] = useState("");

    const availableTemplates = useMemo(
        () => mockTemplatesForImport.filter((t) => t.status !== "Không hoạt động"),
        []
    );

    const families = useMemo(
        () => [...new Set(availableTemplates.map((t) => t.family_name))].sort(),
        [availableTemplates]
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return availableTemplates.filter((t) => {
            if (q && !(t.vc_type_name.toLowerCase().includes(q) || t.vc_type.toLowerCase().includes(q))) return false;
            if (familyFilter && t.family_name !== familyFilter) return false;
            return true;
        });
    }, [search, familyFilter, availableTemplates]);

    const duplicateCodes = useMemo(() => {
        if (!selected) return [];
        return selected.events
            .map((e) => e.event_code)
            .filter((code) => existingEventCodes.includes(code));
    }, [selected, existingEventCodes]);

    const handleSelect = (t: CteTemplate) => {
        setSelected(t);
    };

    const handleImport = () => {
        if (!selected) return;
        const cloned: CteEvent[] = selected.events.map((evt) => {
            const newEventId = generateId();
            return {
                ...evt,
                id: newEventId,
                template_id: "",
                kde_mappings: evt.kde_mappings.map((m) => ({
                    ...m,
                    id: generateId(),
                    event_id: newEventId,
                })),
            };
        });
        onImport(cloned);
        reset();
    };

    const reset = () => {
        setSelected(null);
        setSearch("");
        setFamilyFilter("");
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-5xl max-h-[88vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Thêm sự kiện từ mẫu</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                {/* Body — 2 columns */}
                <div className="flex flex-1 min-h-0">
                    {/* LEFT: template list */}
                    <div className="w-72 shrink-0 border-r border-gray-100 dark:border-gray-800 flex flex-col">
                        {/* Search + filter */}
                        <div className="p-3 space-y-2 border-b border-gray-50 dark:border-gray-800 shrink-0">
                            <div className="relative">
                                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm tên hoặc mã mẫu..."
                                    className="w-full pl-7 pr-3 py-1.5 text-[13px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none focus:border-brand-400 transition-colors"
                                />
                            </div>
                            <select
                                value={familyFilter}
                                onChange={(e) => setFamilyFilter(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-[13px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none focus:border-brand-400 transition-colors"
                            >
                                <option value="">Tất cả nhóm ngành</option>
                                {families.map((f) => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>

                        {/* Template list */}
                        <div className="flex-1 overflow-y-auto py-1.5">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center py-10 text-gray-400 gap-2">
                                    <Search size={24} className="text-gray-300" />
                                    <p className="text-[13px]">Không tìm thấy mẫu</p>
                                </div>
                            ) : (
                                filtered.map((t) => {
                                    const isSelected = selected?.id === t.id;
                                    const totalKde = t.events.reduce((acc, e) => acc + e.kde_mappings.length, 0);
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => handleSelect(t)}
                                            className={`w-full text-left px-3 py-2.5 transition-colors border-b border-gray-50 dark:border-gray-800/60 last:border-0 ${
                                                isSelected
                                                    ? "bg-brand-50 dark:bg-brand-900/20"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                                <code className="font-mono text-[11px] text-brand-600 dark:text-brand-400">{t.vc_type}</code>
                                                {isSelected && <CheckCircle2 size={13} className="text-brand-600 shrink-0" />}
                                            </div>
                                            <p className={`text-[13px] leading-snug mb-1 ${isSelected ? "font-semibold text-brand-700 dark:text-brand-300" : "text-gray-800 dark:text-gray-200"}`}>
                                                {t.vc_type_name}
                                            </p>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                                <span>{t.events.length} CTE</span>
                                                <span>·</span>
                                                <span>{totalKde} KDE</span>
                                                {t.status === "Nháp" && (
                                                    <>
                                                        <span>·</span>
                                                        <span className="text-amber-500">Nháp</span>
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* RIGHT: preview */}
                    <div className="flex-1 overflow-y-auto">
                        {selected ? (
                            <PreviewPane
                                template={selected}
                                existingEventCodes={existingEventCodes}
                                duplicateCodes={duplicateCodes}
                            />
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!selected}
                        className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
                    >
                        <Download size={14} /> Xác nhận thêm
                    </button>
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 py-16">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <FileText size={24} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-[14px] font-medium text-gray-400">Chọn một mẫu để xem trước</p>
            <p className="text-[13px] text-gray-300 dark:text-gray-600 text-center max-w-52">
                Nhấp vào tên mẫu bên trái để xem chi tiết các sự kiện trọng yếu
            </p>
        </div>
    );
}

function PreviewPane({ template, existingEventCodes, duplicateCodes }: {
    template: CteTemplate;
    existingEventCodes: string[];
    duplicateCodes: string[];
}) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(template.events.map((e) => e.id)));

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="p-5">
            {/* Template info */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2.5 mb-1">
                    <code className="font-mono text-[13px] text-brand-600 dark:text-brand-400">{template.vc_type}</code>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-[12px] text-gray-400">v{template.version}</span>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-[12px] text-gray-400">{template.family_name}</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{template.vc_type_name}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[12px] text-gray-400">
                    <span>{template.events.length} sự kiện trọng yếu</span>
                    <span>·</span>
                    <span>{template.events.reduce((acc, e) => acc + e.kde_mappings.length, 0)} trường dữ liệu</span>
                </div>
            </div>

            {/* Events list */}
            <div className="space-y-2">
                {template.events.map((evt, eIdx) => {
                    const isDuplicate = existingEventCodes.includes(evt.event_code);
                    const isExpanded = expanded.has(evt.id);
                    return (
                        <div key={evt.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggle(evt.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50/80 dark:bg-gray-800/60 hover:bg-gray-100/60 dark:hover:bg-gray-800 transition-colors text-left"
                            >
                                <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-[12px] font-bold flex items-center justify-center shrink-0">
                                    {eIdx + 1}
                                </span>
                                <span className="font-semibold text-[14px] text-gray-800 dark:text-gray-200 flex-1">{evt.event_name}</span>
                                {isDuplicate && (
                                    <span className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 px-2 py-0.5 rounded-full">
                                        <AlertTriangle size={10} /> Trùng mã
                                    </span>
                                )}
                                <span className="text-gray-400 text-[12px]">{evt.kde_mappings.length} KDE</span>
                                {isExpanded ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
                            </button>
                            {isExpanded && evt.kde_mappings.length > 0 && (
                                <table className="w-full text-[13px]">
                                    <tbody>
                                        {evt.kde_mappings.map((m) => (
                                            <tr key={m.kde_code} className="border-t border-gray-50 dark:border-gray-800/60">
                                                <td className="px-4 py-2 font-mono text-gray-400 w-36">{m.kde_code}</td>
                                                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{m.kde_name}</td>
                                                <td className="px-4 py-2 text-gray-400">{m.kde_data_type}</td>
                                                <td className="px-4 py-2 text-right">
                                                    {m.is_required
                                                        ? <span className="text-[11px] font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full border border-brand-100">Bắt buộc</span>
                                                        : <span className="text-[11px] text-gray-400">Tuỳ chọn</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Duplicate warning */}
            {duplicateCodes.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 rounded-xl text-[13px] text-amber-700 dark:text-amber-400">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <div>
                            <span className="font-medium">Lưu ý: </span>
                            {duplicateCodes.length} sự kiện có mã trùng với sự kiện hiện tại ({duplicateCodes.join(", ")}). Các sự kiện này vẫn sẽ được thêm vào danh sách.
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-xl text-[13px] text-gray-500">
                Sau khi thêm, các sự kiện sẽ được nối tiếp vào danh sách hiện tại. Bạn có thể kéo để sắp xếp lại thứ tự.
            </div>
        </div>
    );
}
