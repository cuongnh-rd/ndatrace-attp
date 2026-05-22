"use client";

import { useState, useMemo } from "react";
import { X, Search, CheckCircle2, ChevronDown, ChevronUp, ChevronRight, AlertTriangle, Download } from "lucide-react";
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
    const [step, setStep] = useState<1 | 2 | 3>(1);
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

    const handleImport = () => {
        if (!selected) return;
        const cloned: CteEvent[] = selected.events.map((evt, i) => {
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
        setStep(1);
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
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[88vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Thêm sự kiện từ mẫu</h2>
                        <p className="text-[13px] text-gray-500 mt-0.5">Bước {step} / 3</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center px-6 py-3 border-b border-gray-50 dark:border-gray-800 shrink-0">
                    {[["1", "Chọn mẫu"], ["2", "Xem trước"], ["3", "Xác nhận"]].map(([s, label], i) => (
                        <div key={s} className="flex items-center">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold transition-colors ${Number(s) < step ? "bg-brand-600 text-white" :
                                        Number(s) === step ? "bg-brand-600 text-white" :
                                            "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                    }`}>
                                    {Number(s) < step ? <CheckCircle2 size={14} /> : s}
                                </div>
                                <span className={`text-[13px] ${Number(s) === step ? "font-semibold text-gray-900 dark:text-white" : "text-gray-400"}`}>{label}</span>
                            </div>
                            {i < 2 && <div className="mx-3 h-px w-8 bg-gray-200 dark:bg-gray-700" />}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <Step1
                            templates={filtered}
                            selected={selected}
                            onSelect={setSelected}
                            search={search}
                            onSearch={setSearch}
                            families={families}
                            familyFilter={familyFilter}
                            onFamilyFilter={setFamilyFilter}
                        />
                    )}
                    {step === 2 && selected && (
                        <Step2 template={selected} existingEventCodes={existingEventCodes} />
                    )}
                    {step === 3 && selected && (
                        <Step3 template={selected} duplicateCodes={duplicateCodes} />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                    {step > 1 ? (
                        <button onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            ← Quay lại
                        </button>
                    ) : (
                        <button onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            Huỷ
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                            disabled={!selected}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
                        >
                            {step === 1 ? "Xem trước" : "Tiếp tục"} <ChevronRight size={14} />
                        </button>
                    ) : (
                        <button onClick={handleImport}
                            className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">
                            <Download size={14} /> Xác nhận thêm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function Step1({ templates, selected, onSelect, search, onSearch, families, familyFilter, onFamilyFilter }: {
    templates: CteTemplate[]; selected: CteTemplate | null; onSelect: (t: CteTemplate) => void;
    search: string; onSearch: (v: string) => void; families: string[];
    familyFilter: string; onFamilyFilter: (v: string) => void;
}) {
    return (
        <div>
            <p className="text-[14px] text-gray-500 mb-4">
                Chọn một mẫu sự kiện trọng yếu đã tạo. Toàn bộ sự kiện trong mẫu đó sẽ được thêm vào danh sách hiện tại.
            </p>
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={(e) => onSearch(e.target.value)}
                        placeholder="Tìm theo tên hoặc mã mẫu..."
                        className="w-full pl-8 pr-3 py-2 text-[14px] border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 outline-none focus:border-brand-400 transition-colors" />
                </div>
                <select value={familyFilter} onChange={(e) => onFamilyFilter(e.target.value)}
                    className="pl-3 pr-8 py-2 text-[14px] border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 outline-none focus:border-brand-400 transition-colors">
                    <option value="">Tất cả nhóm ngành</option>
                    {families.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {templates.map((t) => {
                    const isSelected = selected?.id === t.id;
                    const totalKde = t.events.reduce((acc, e) => acc + e.kde_mappings.length, 0);
                    return (
                        <button key={t.id} onClick={() => onSelect(t)}
                            className={`text-left p-4 rounded-xl border-2 transition-all ${isSelected ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"}`}>
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <code className="font-mono text-[12px] text-brand-600 dark:text-brand-400">{t.vc_type}</code>
                                {isSelected && <CheckCircle2 size={16} className="text-brand-600 shrink-0" />}
                            </div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-[14px] leading-snug">{t.vc_type_name}</p>
                            <div className="flex items-center gap-3 mt-2 text-[13px] text-gray-500">
                                <span>{t.family_name}</span>
                                <span>·</span>
                                <span>{t.events.length} CTE</span>
                                <span>·</span>
                                <span>{totalKde} KDE</span>
                            </div>
                            {t.status === "Nháp" && (
                                <span className="inline-block mt-2 text-[11px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full border border-amber-100">
                                    Nháp
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
            {templates.length === 0 && (
                <div className="flex flex-col items-center py-12 text-gray-400 gap-2">
                    <Search size={28} className="text-gray-300" />
                    <p className="text-[14px]">Không tìm thấy mẫu phù hợp</p>
                </div>
            )}
        </div>
    );
}

function Step2({ template, existingEventCodes }: { template: CteTemplate; existingEventCodes: string[] }) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(template.events.map((e) => e.id)));

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div>
            <p className="text-[14px] text-gray-500 mb-5">
                Xem trước các sự kiện sẽ được thêm vào. Sau khi import bạn có thể chỉnh sửa từng sự kiện.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3 mb-1">
                    <code className="font-mono text-[13px] text-brand-600 dark:text-brand-400">{template.vc_type}</code>
                    <span className="text-gray-400">·</span>
                    <span className="text-[13px] text-gray-500">v{template.version}</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{template.vc_type_name}</p>
                <p className="text-[13px] text-gray-500 mt-0.5">{template.family_name}</p>
            </div>
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
        </div>
    );
}

function Step3({ template, duplicateCodes }: { template: CteTemplate; duplicateCodes: string[] }) {
    const totalKde = template.events.reduce((acc, e) => acc + e.kde_mappings.length, 0);
    return (
        <div>
            <p className="text-[14px] text-gray-500 mb-5">
                Xác nhận để thêm tất cả sự kiện từ mẫu đã chọn vào danh sách hiện tại.
            </p>
            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">Mẫu nguồn</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{template.vc_type_name}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">Nhóm ngành</span>
                    <span className="text-gray-700 dark:text-gray-300">{template.family_name}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">Số sự kiện sẽ thêm</span>
                    <span className="font-semibold text-brand-600">{template.events.length} sự kiện</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">Tổng số trường dữ liệu</span>
                    <span className="text-gray-700 dark:text-gray-300">{totalKde} trường dữ liệu</span>
                </div>
            </div>
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
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-xl text-[13px] text-gray-500">
                Sau khi thêm, các sự kiện sẽ được nối tiếp vào danh sách hiện tại. Bạn có thể kéo để sắp xếp lại thứ tự.
            </div>
        </div>
    );
}
