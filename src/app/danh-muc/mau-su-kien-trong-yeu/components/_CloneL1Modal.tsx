"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Search, ChevronRight, CheckCircle2, Copy } from "lucide-react";
import { l1Templates, cteTemplates, generateId, generateVcType } from "../lib/mock-data";
import type { L1Template, CteTemplate, CteEvent, KdeCteMapping } from "../lib/types";
import { kdeLibrary } from "../lib/mock-data";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CloneL1Modal({ isOpen, onClose }: Props) {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selected, setSelected] = useState<L1Template | null>(null);
    const [search, setSearch] = useState("");
    const [familyFilter, setFamilyFilter] = useState("");

    const families = useMemo(() => [...new Set(l1Templates.map((t) => t.family_name))], []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return l1Templates.filter((t) => {
            if (q && !(t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q))) return false;
            if (familyFilter && t.family_name !== familyFilter) return false;
            return true;
        });
    }, [search, familyFilter]);

    const handleClone = () => {
        if (!selected) return;

        const templateId = generateId();
        const vcType = generateVcType();

        const events: CteEvent[] = selected.events.map((l1Evt, eIdx) => {
            const eventId = generateId();
            const kde_mappings: KdeCteMapping[] = l1Evt.kdes.map((l1Kde, kIdx) => {
                const libraryItem = kdeLibrary.find((k) => k.id === l1Kde.kde_id);
                return {
                    id: generateId(),
                    event_id: eventId,
                    kde_id: l1Kde.kde_id,
                    kde_code: l1Kde.kde_code,
                    kde_name: l1Kde.kde_name,
                    kde_data_type: l1Kde.kde_data_type,
                    kde_version: l1Kde.kde_version,
                    kde_current_version: libraryItem?.current_version ?? l1Kde.kde_version,
                    display_order: kIdx + 1,
                    is_required: l1Kde.is_required,
                    note: "",
                };
            });
            return {
                id: eventId,
                template_id: templateId,
                event_code: l1Evt.event_code,
                event_name: l1Evt.event_name,
                display_order: eIdx + 1,
                kde_mappings,
            };
        });

        const newTemplate: CteTemplate = {
            id: templateId,
            vc_type: vcType,
            vc_type_name: selected.name + " (Hà Nội)",
            family_id: null,
            family_name: selected.family_name,
            authority_level: "Provincial",
            version: 1,
            status: "Nháp",
            description: "",
            cloned_from_id: selected.id,
            events,
            updated_at: new Date().toLocaleDateString("vi-VN"),
            created_by: "Nguyễn Hà Cương",
        };

        cteTemplates.push(newTemplate);
        onClose();
        router.push(`/danh-muc/mau-su-kien-trong-yeu/${templateId}/sua`);
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[88vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tạo từ mẫu cấp trên</h2>
                        <p className="text-[13px] text-gray-500 mt-0.5">Bước {step} / 3</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-0 px-6 py-3 border-b border-gray-50 dark:border-gray-800 shrink-0">
                    {[["1", "Chọn mẫu"], ["2", "Xem trước"], ["3", "Xác nhận"]].map(([s, label], i) => (
                        <div key={s} className="flex items-center">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold transition-colors ${
                                    Number(s) < step ? "bg-brand-600 text-white" :
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
                    {step === 2 && selected && <Step2 template={selected} />}
                    {step === 3 && selected && <Step3 template={selected} />}
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
                        <button onClick={handleClone}
                            className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">
                            <Copy size={14} /> Tạo mẫu từ bản này
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function Step1({ templates, selected, onSelect, search, onSearch, families, familyFilter, onFamilyFilter }: {
    templates: L1Template[]; selected: L1Template | null; onSelect: (t: L1Template) => void;
    search: string; onSearch: (v: string) => void; families: string[];
    familyFilter: string; onFamilyFilter: (v: string) => void;
}) {
    return (
        <div>
            <p className="text-[14px] text-gray-500 mb-4">Chọn mẫu sự kiện từ thư viện cấp trên để làm điểm xuất phát. Bạn có thể chỉnh sửa sau khi tạo.</p>
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Tìm theo tên hoặc mã..."
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
                    return (
                        <button key={t.id} onClick={() => onSelect(t)}
                            className={`text-left p-4 rounded-xl border-2 transition-all ${isSelected ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"}`}>
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <code className="font-mono text-[12px] text-brand-600 dark:text-brand-400">{t.code}</code>
                                {isSelected && <CheckCircle2 size={16} className="text-brand-600 shrink-0" />}
                            </div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-[14px] leading-snug">{t.name}</p>
                            <div className="flex items-center gap-3 mt-2 text-[13px] text-gray-500">
                                <span>{t.family_name}</span>
                                <span>·</span>
                                <span>v{t.version}</span>
                                <span>·</span>
                                <span>{t.events.reduce((acc, e) => acc + e.kdes.length, 0)} KDE</span>
                            </div>
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

function Step2({ template }: { template: L1Template }) {
    return (
        <div>
            <p className="text-[14px] text-gray-500 mb-5">Xem trước cấu trúc mẫu. Sau khi tạo, bạn có thể thêm, bớt hoặc điều chỉnh các sự kiện và KDE.</p>
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3 mb-1">
                    <code className="font-mono text-[13px] text-brand-600 dark:text-brand-400">{template.code}</code>
                    <span className="text-gray-400">·</span>
                    <span className="text-[13px] text-gray-500">v{template.version}</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{template.name}</p>
                <p className="text-[13px] text-gray-500 mt-0.5">{template.family_name}</p>
            </div>
            <div className="space-y-3">
                {template.events.map((evt, eIdx) => (
                    <div key={evt.event_code} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50/80 dark:bg-gray-800/60">
                            <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-[12px] font-bold flex items-center justify-center">{eIdx + 1}</span>
                            <span className="font-semibold text-[14px] text-gray-800 dark:text-gray-200">{evt.event_name}</span>
                            <code className="font-mono text-[12px] text-gray-400 ml-auto">{evt.event_code}</code>
                        </div>
                        <table className="w-full text-[13px]">
                            <tbody>
                                {evt.kdes.map((kde) => (
                                    <tr key={kde.kde_code} className="border-t border-gray-50 dark:border-gray-800/60">
                                        <td className="px-4 py-2 font-mono text-gray-400 w-36">{kde.kde_code}</td>
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{kde.kde_name}</td>
                                        <td className="px-4 py-2 text-gray-400">{kde.kde_data_type}</td>
                                        <td className="px-4 py-2 text-right">
                                            {kde.is_required
                                                ? <span className="text-[11px] font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full border border-brand-100">Bắt buộc</span>
                                                : <span className="text-[11px] text-gray-400">Tuỳ chọn</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Step3({ template }: { template: L1Template }) {
    const totalKde = template.events.reduce((acc, e) => acc + e.kdes.length, 0);
    return (
        <div>
            <p className="text-[14px] text-gray-500 mb-5">Xác nhận để tạo mẫu mới ở trạng thái <strong>Nháp</strong> với cấu trúc từ mẫu đã chọn. Bạn sẽ được chuyển sang màn hình chỉnh sửa ngay sau khi tạo.</p>
            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">Mẫu nguồn</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{template.name}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">Nhóm ngành</span>
                    <span className="text-gray-700 dark:text-gray-300">{template.family_name}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">Số sự kiện</span>
                    <span className="text-gray-700 dark:text-gray-300">{template.events.length} sự kiện</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">Tổng số KDE</span>
                    <span className="text-gray-700 dark:text-gray-300">{totalKde} trường dữ liệu</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">Trạng thái tạo</span>
                    <span className="text-blue-600 font-medium">Nháp</span>
                </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 rounded-xl text-[13px] text-amber-700 dark:text-amber-400">
                Sau khi tạo, mọi thay đổi trên mẫu này sẽ độc lập với mẫu nguồn.
            </div>
        </div>
    );
}
