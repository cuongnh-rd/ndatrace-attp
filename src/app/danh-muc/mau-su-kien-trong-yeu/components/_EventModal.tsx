"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Search, GripVertical, Trash2, ChevronDown, AlertTriangle } from "lucide-react";
import { kdeLibrary, generateId } from "../lib/mock-data";
import type { CteEvent, KdeCteMapping, KdeLibraryItem } from "../lib/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CteEvent) => void;
    existingEvent?: CteEvent | null;
    templateId: string;
    /** KDE codes already used in this event (exclude from library search) */
    usedKdeCodes?: string[];
}

interface KdeRow extends KdeCteMapping {
    _drag_id: string;
}

export default function EventModal({ isOpen, onClose, onSave, existingEvent, templateId, usedKdeCodes = [] }: Props) {
    const [eventName, setEventName] = useState("");
    const [eventCode, setEventCode] = useState("");
    const [rows, setRows] = useState<KdeRow[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPicker, setShowPicker] = useState(false);
    const [pickerSearch, setPickerSearch] = useState("");
    const [pickerType, setPickerType] = useState("");

    // Drag state
    const dragIdx = useRef<number | null>(null);

    // Init form when modal opens
    useEffect(() => {
        if (!isOpen) return;
        if (existingEvent) {
            setEventName(existingEvent.event_name);
            setEventCode(existingEvent.event_code);
            setRows(existingEvent.kde_mappings.map((m) => ({ ...m, _drag_id: m.id })));
        } else {
            setEventName("");
            setEventCode("");
            setRows([]);
        }
        setErrors({});
        setShowPicker(false);
        setPickerSearch("");
        setPickerType("");
    }, [isOpen, existingEvent]);

    // Already-selected codes in this event
    const selectedCodes = new Set(rows.map((r) => r.kde_code));
    const allUsedCodes = new Set([...selectedCodes]);

    const filteredLibrary = kdeLibrary.filter((k) => {
        if (k.status !== "Hoạt động") return false;
        if (allUsedCodes.has(k.code)) return false;
        const q = pickerSearch.trim().toLowerCase();
        if (q && !(k.name.toLowerCase().includes(q) || k.code.toLowerCase().includes(q))) return false;
        if (pickerType && k.data_type !== pickerType) return false;
        return true;
    });

    const uniqueTypes = [...new Set(kdeLibrary.filter((k) => k.status === "Hoạt động").map((k) => k.data_type))];

    const addKde = (item: KdeLibraryItem) => {
        const newRow: KdeRow = {
            _drag_id: generateId(),
            id: generateId(),
            event_id: existingEvent?.id ?? "",
            kde_id: item.id,
            kde_code: item.code,
            kde_name: item.name,
            kde_data_type: item.data_type,
            kde_version: item.current_version,
            kde_current_version: item.current_version,
            display_order: rows.length + 1,
            is_required: true,
            note: "",
        };
        setRows((prev) => [...prev, newRow]);
    };

    const removeKde = (dragId: string) => {
        setRows((prev) => {
            const updated = prev.filter((r) => r._drag_id !== dragId);
            return updated.map((r, i) => ({ ...r, display_order: i + 1 }));
        });
    };

    const toggleRequired = (dragId: string) => {
        setRows((prev) => prev.map((r) => r._drag_id === dragId ? { ...r, is_required: !r.is_required } : r));
    };

    const updateNote = (dragId: string, note: string) => {
        setRows((prev) => prev.map((r) => r._drag_id === dragId ? { ...r, note } : r));
    };

    // HTML5 drag-and-drop reorder
    const handleDragStart = (idx: number) => { dragIdx.current = idx; };
    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (dragIdx.current === null || dragIdx.current === idx) return;
        setRows((prev) => {
            const next = [...prev];
            const [moved] = next.splice(dragIdx.current!, 1);
            next.splice(idx, 0, moved);
            dragIdx.current = idx;
            return next.map((r, i) => ({ ...r, display_order: i + 1 }));
        });
    };
    const handleDragEnd = () => { dragIdx.current = null; };

    // Validate
    const hasNoRequired = rows.length > 0 && rows.every((r) => !r.is_required);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!eventName.trim()) errs.eventName = "Tên sự kiện không được để trống";
        if (!eventCode.trim()) errs.eventCode = "Mã sự kiện không được để trống";
        if (rows.length === 0) errs.kdes = "Cần thêm ít nhất 1 KDE vào sự kiện";
        if (hasNoRequired) errs.required = "Cần ít nhất 1 KDE bắt buộc (required)";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const eventId = existingEvent?.id ?? generateId();
        const event: CteEvent = {
            id: eventId,
            template_id: templateId,
            event_code: eventCode.trim().toUpperCase(),
            event_name: eventName.trim(),
            display_order: existingEvent?.display_order ?? 0,
            kde_mappings: rows.map(({ _drag_id, ...rest }) => ({ ...rest, event_id: eventId })),
        };
        onSave(event);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {existingEvent ? "Chỉnh sửa sự kiện" : "Thêm sự kiện trọng yếu"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Event info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Tên sự kiện <span className="text-red-500">*</span>
                            </label>
                            <input value={eventName} onChange={(e) => { setEventName(e.target.value); setErrors((p) => ({ ...p, eventName: "" })); }}
                                placeholder="VD: Thu hoạch"
                                className={`w-full px-3 py-2 text-[14px] border rounded-xl outline-none transition-colors bg-white dark:bg-gray-800 ${errors.eventName ? "border-red-300 focus:border-red-400" : "border-gray-200 dark:border-gray-700 focus:border-brand-400"}`} />
                            {errors.eventName && <p className="text-[12px] text-red-500 mt-1">{errors.eventName}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Mã sự kiện <span className="text-red-500">*</span>
                            </label>
                            <input value={eventCode} onChange={(e) => { setEventCode(e.target.value); setErrors((p) => ({ ...p, eventCode: "" })); }}
                                placeholder="VD: EVT-THU-HOACH"
                                className={`w-full px-3 py-2 text-[14px] font-mono border rounded-xl outline-none transition-colors bg-white dark:bg-gray-800 uppercase ${errors.eventCode ? "border-red-300 focus:border-red-400" : "border-gray-200 dark:border-gray-700 focus:border-brand-400"}`} />
                            {errors.eventCode && <p className="text-[12px] text-red-500 mt-1">{errors.eventCode}</p>}
                        </div>
                    </div>

                    {/* KDE section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">
                                    Trường dữ liệu (KDE)
                                    {rows.length > 0 && <span className="ml-2 text-gray-400 font-normal">{rows.length} trường</span>}
                                </p>
                                {errors.kdes && <p className="text-[12px] text-red-500 mt-0.5">{errors.kdes}</p>}
                                {errors.required && (
                                    <p className="flex items-center gap-1 text-[12px] text-amber-600 mt-0.5">
                                        <AlertTriangle size={12} />{errors.required}
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setShowPicker((v) => !v)}
                                className="flex items-center gap-1.5 text-[13px] font-medium text-brand-600 hover:text-brand-700 border border-brand-200 hover:border-brand-300 bg-brand-50 hover:bg-brand-100 rounded-xl px-3 py-1.5 transition-colors">
                                <Plus size={13} /> Thêm KDE từ thư viện
                                <ChevronDown size={12} className={`transition-transform ${showPicker ? "rotate-180" : ""}`} />
                            </button>
                        </div>

                        {/* KDE Picker */}
                        {showPicker && (
                            <div className="mb-3 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/40">
                                <div className="flex gap-2 p-3 border-b border-gray-100 dark:border-gray-800">
                                    <div className="relative flex-1">
                                        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input value={pickerSearch} onChange={(e) => setPickerSearch(e.target.value)}
                                            placeholder="Tìm KDE theo tên hoặc mã..."
                                            className="w-full pl-7 pr-3 py-1.5 text-[13px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none focus:border-brand-400" />
                                    </div>
                                    <select value={pickerType} onChange={(e) => setPickerType(e.target.value)}
                                        className="pl-2 pr-6 py-1.5 text-[13px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none focus:border-brand-400">
                                        <option value="">Tất cả kiểu</option>
                                        {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="max-h-44 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                                    {filteredLibrary.length === 0 ? (
                                        <div className="flex flex-col items-center py-6 text-gray-400 gap-1">
                                            <Search size={20} className="text-gray-300" />
                                            <p className="text-[13px]">Không tìm thấy KDE phù hợp</p>
                                        </div>
                                    ) : filteredLibrary.map((item) => (
                                        <button key={item.code} onClick={() => addKde(item)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white dark:hover:bg-gray-800 transition-colors text-left">
                                            <Plus size={14} className="text-brand-500 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <code className="font-mono text-[12px] text-brand-600 dark:text-brand-400">{item.code}</code>
                                                    <span className="text-[11px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{item.data_type}</span>
                                                </div>
                                                <p className="text-[13px] text-gray-700 dark:text-gray-300 truncate">{item.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Selected KDE table */}
                        {rows.length > 0 ? (
                            <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                                <table className="w-full text-[13px]">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                                            <th className="w-8 px-2 py-2"></th>
                                            <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">#</th>
                                            <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Mã KDE</th>
                                            <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Tên</th>
                                            <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Kiểu</th>
                                            <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Bắt buộc</th>
                                            <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Ghi chú</th>
                                            <th className="w-8 px-2 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, idx) => (
                                            <tr key={row._drag_id} draggable
                                                onDragStart={() => handleDragStart(idx)}
                                                onDragOver={(e) => handleDragOver(e, idx)}
                                                onDragEnd={handleDragEnd}
                                                className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/60 dark:hover:bg-gray-800/20 cursor-grab active:opacity-60 transition-opacity">
                                                <td className="px-2 py-2.5 text-gray-300 dark:text-gray-600">
                                                    <GripVertical size={14} />
                                                </td>
                                                <td className="px-3 py-2.5 text-gray-400 w-6 font-mono">{idx + 1}</td>
                                                <td className="px-3 py-2.5">
                                                    <code className="font-mono text-[12px] text-brand-600 dark:text-brand-400">{row.kde_code}</code>
                                                </td>
                                                <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 max-w-[140px] truncate">{row.kde_name}</td>
                                                <td className="px-3 py-2.5 text-gray-400">{row.kde_data_type}</td>
                                                <td className="px-3 py-2.5">
                                                    <button onClick={() => toggleRequired(row._drag_id)}
                                                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${row.is_required ? "bg-brand-600" : "bg-gray-200 dark:bg-gray-700"}`}>
                                                        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${row.is_required ? "translate-x-4" : "translate-x-0"}`} />
                                                    </button>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <input value={row.note} onChange={(e) => updateNote(row._drag_id, e.target.value)}
                                                        placeholder="Ghi chú..."
                                                        className="w-full px-2 py-1 text-[12px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none focus:border-brand-400 min-w-[100px]" />
                                                </td>
                                                <td className="px-2 py-2.5">
                                                    <button onClick={() => removeKde(row._drag_id)}
                                                        className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 size={13} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-10 text-center text-gray-400">
                                <p className="text-[14px]">Chưa có KDE nào. Nhấn "Thêm KDE từ thư viện" để bắt đầu.</p>
                            </div>
                        )}

                        {/* Warning when all are non-required */}
                        {hasNoRequired && rows.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 text-[13px] text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 px-3 py-2 rounded-lg">
                                <AlertTriangle size={14} />
                                Cần ít nhất 1 KDE bắt buộc trong sự kiện này.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        Huỷ
                    </button>
                    <button onClick={handleSave}
                        className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">
                        Lưu sự kiện
                    </button>
                </div>
            </div>
        </div>
    );
}
