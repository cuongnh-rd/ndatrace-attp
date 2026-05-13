"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, GripVertical, Pencil, Trash2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EventModal from "../components/_EventModal";
import { cteTemplates, generateId, generateVcType } from "../lib/mock-data";
import { FAMILY_OPTIONS } from "../lib/constants";
import type { CteEvent, CteTemplate } from "../lib/types";

interface FormData {
    vc_type: string;
    vc_type_name: string;
    family_name: string;
    description: string;
}

const EMPTY_FORM: FormData = { vc_type: "", vc_type_name: "", family_name: "", description: "" };

export default function Page() {
    const router = useRouter();
    const [form, setForm] = useState<FormData>({ ...EMPTY_FORM, vc_type: generateVcType() });
    const [events, setEvents] = useState<CteEvent[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CteEvent | null>(null);
    const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

    // Drag state
    const dragIdx = { current: -1 };

    const handleDragStart = (idx: number) => { dragIdx.current = idx; };
    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (dragIdx.current < 0 || dragIdx.current === idx) return;
        setEvents((prev) => {
            const next = [...prev];
            const [moved] = next.splice(dragIdx.current, 1);
            next.splice(idx, 0, moved);
            dragIdx.current = idx;
            return next.map((ev, i) => ({ ...ev, display_order: i + 1 }));
        });
    };

    const handleSaveEvent = (event: CteEvent) => {
        setEvents((prev) => {
            const idx = prev.findIndex((e) => e.id === event.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = event;
                return next;
            }
            return [...prev, { ...event, display_order: prev.length + 1 }];
        });
        setEventModalOpen(false);
        setEditingEvent(null);
    };

    const openAddEvent = () => { setEditingEvent(null); setEventModalOpen(true); };
    const openEditEvent = (ev: CteEvent) => { setEditingEvent(ev); setEventModalOpen(true); };

    const deleteEvent = (id: string) => {
        setEvents((prev) => prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, display_order: i + 1 })));
    };

    const toggleExpand = (id: string) => {
        setExpandedEvents((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const validate = (publish: boolean) => {
        const errs: Record<string, string> = {};
        if (!form.vc_type_name.trim()) errs.vc_type_name = "Tên mẫu không được để trống";
        if (!form.vc_type.trim()) errs.vc_type = "Mã mẫu không được để trống";
        if (!form.family_name) errs.family_name = "Vui lòng chọn nhóm ngành";
        if (publish && events.length === 0) errs.events = "Cần ít nhất 1 sự kiện để công bố";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSaveDraft = () => {
        if (!validate(false)) return;
        const templateId = generateId();
        const template: CteTemplate = {
            id: templateId,
            vc_type: form.vc_type,
            vc_type_name: form.vc_type_name,
            family_id: null,
            family_name: form.family_name,
            authority_level: "Provincial",
            version: 1,
            status: "Nháp",
            description: form.description,
            cloned_from_id: null,
            events: events.map((e) => ({ ...e, template_id: templateId })),
            updated_at: new Date().toLocaleDateString("vi-VN"),
            created_by: "Nguyễn Hà Cương",
        };
        cteTemplates.push(template);
        router.push(`/danh-muc/mau-su-kien-trong-yeu/${templateId}`);
    };

    const handlePublish = () => {
        if (!validate(true)) return;
        const templateId = generateId();
        const template: CteTemplate = {
            id: templateId,
            vc_type: form.vc_type,
            vc_type_name: form.vc_type_name,
            family_id: null,
            family_name: form.family_name,
            authority_level: "Provincial",
            version: 1,
            status: "Hoạt động",
            description: form.description,
            cloned_from_id: null,
            events: events.map((e) => ({ ...e, template_id: templateId })),
            updated_at: new Date().toLocaleDateString("vi-VN"),
            created_by: "Nguyễn Hà Cương",
        };
        cteTemplates.push(template);
        router.push(`/danh-muc/mau-su-kien-trong-yeu/${templateId}`);
    };

    return (
        <DashboardLayout>
            {/* Top bar */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/danh-muc/mau-su-kien-trong-yeu"
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tạo mẫu sự kiện trọng yếu mới</h1>
                </div>
                <Link href="/danh-muc/mau-su-kien-trong-yeu"
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Huỷ
                </Link>
                <button onClick={handleSaveDraft}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Lưu nháp
                </button>
                <button onClick={handlePublish}
                    className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">
                    Lưu + Công bố
                </button>
            </div>

            <div className="space-y-5">
                {/* General info card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <h2 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-5">Thông tin chung</h2>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Tên mẫu sự kiện <span className="text-red-500">*</span>
                            </label>
                            <input value={form.vc_type_name}
                                onChange={(e) => { setForm((p) => ({ ...p, vc_type_name: e.target.value })); setErrors((p) => ({ ...p, vc_type_name: "" })); }}
                                placeholder="VD: Quy trình TXNG Rau củ Hà Nội"
                                className={`w-full px-3 py-2 text-[14px] border rounded-xl outline-none transition-colors bg-white dark:bg-gray-800 ${errors.vc_type_name ? "border-red-300" : "border-gray-200 dark:border-gray-700 focus:border-brand-400"}`} />
                            {errors.vc_type_name && <p className="text-[12px] text-red-500 mt-1">{errors.vc_type_name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Mã mẫu <span className="text-red-500">*</span>
                            </label>
                            <input value={form.vc_type}
                                onChange={(e) => { setForm((p) => ({ ...p, vc_type: e.target.value })); setErrors((p) => ({ ...p, vc_type: "" })); }}
                                placeholder="VD: HN-CTE-004"
                                className={`w-full px-3 py-2 text-[14px] font-mono border rounded-xl outline-none transition-colors bg-white dark:bg-gray-800 ${errors.vc_type ? "border-red-300" : "border-gray-200 dark:border-gray-700 focus:border-brand-400"}`} />
                            {errors.vc_type && <p className="text-[12px] text-red-500 mt-1">{errors.vc_type}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Nhóm ngành <span className="text-red-500">*</span>
                            </label>
                            <select value={form.family_name}
                                onChange={(e) => { setForm((p) => ({ ...p, family_name: e.target.value })); setErrors((p) => ({ ...p, family_name: "" })); }}
                                className={`w-full px-3 py-2 text-[14px] border rounded-xl outline-none transition-colors bg-white dark:bg-gray-800 ${errors.family_name ? "border-red-300" : "border-gray-200 dark:border-gray-700 focus:border-brand-400"}`}>
                                <option value="">-- Chọn nhóm ngành --</option>
                                {FAMILY_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                            </select>
                            {errors.family_name && <p className="text-[12px] text-red-500 mt-1">{errors.family_name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Mô tả</label>
                            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                placeholder="Mô tả ngắn về mẫu sự kiện này..."
                                rows={2}
                                className="w-full px-3 py-2 text-[14px] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-brand-400 transition-colors bg-white dark:bg-gray-800 resize-none" />
                        </div>
                    </div>
                </div>

                {/* Events card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <div>
                            <h2 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">
                                Danh sách sự kiện trọng yếu
                                {events.length > 0 && <span className="ml-2 text-[13px] font-normal text-gray-400">{events.length} sự kiện</span>}
                            </h2>
                            {errors.events && (
                                <p className="flex items-center gap-1 text-[12px] text-red-500 mt-0.5">
                                    <AlertTriangle size={12} /> {errors.events}
                                </p>
                            )}
                        </div>
                        <button onClick={openAddEvent}
                            className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl px-3 py-2 transition-colors">
                            <Plus size={14} /> Thêm sự kiện
                        </button>
                    </div>

                    {events.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                <Plus size={20} className="text-gray-300" />
                            </div>
                            <p className="text-[14px]">Chưa có sự kiện nào. Nhấn "Thêm sự kiện" để bắt đầu.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {events.map((ev, idx) => (
                                <EventRow
                                    key={ev.id}
                                    event={ev}
                                    index={idx}
                                    expanded={expandedEvents.has(ev.id)}
                                    onToggleExpand={() => toggleExpand(ev.id)}
                                    onEdit={() => openEditEvent(ev)}
                                    onDelete={() => deleteEvent(ev.id)}
                                    onDragStart={() => handleDragStart(idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDragEnd={() => { dragIdx.current = -1; }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <EventModal
                isOpen={eventModalOpen}
                onClose={() => { setEventModalOpen(false); setEditingEvent(null); }}
                onSave={handleSaveEvent}
                existingEvent={editingEvent}
                templateId=""
            />
        </DashboardLayout>
    );
}

function EventRow({ event: ev, index, expanded, onToggleExpand, onEdit, onDelete, onDragStart, onDragOver, onDragEnd }: {
    event: CteEvent; index: number; expanded: boolean;
    onToggleExpand: () => void; onEdit: () => void; onDelete: () => void;
    onDragStart: () => void; onDragOver: (e: React.DragEvent) => void; onDragEnd: () => void;
}) {
    const requiredCount = ev.kde_mappings.filter((m) => m.is_required).length;

    return (
        <div draggable onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
            <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 cursor-grab active:cursor-grabbing transition-colors">
                <GripVertical size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
                <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-[12px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[14px] text-gray-800 dark:text-gray-200">{ev.event_name}</span>
                        <code className="font-mono text-[12px] text-gray-400">{ev.event_code}</code>
                    </div>
                    <p className="text-[13px] text-gray-400 mt-0.5">
                        {ev.kde_mappings.length} KDE &nbsp;·&nbsp; {requiredCount} bắt buộc
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onToggleExpand}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Xem KDE">
                        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button onClick={onEdit}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-500 transition-colors" title="Sửa">
                        <Pencil size={15} />
                    </button>
                    <button onClick={onDelete}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors" title="Xóa">
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>
            {expanded && ev.kde_mappings.length > 0 && (
                <div className="px-14 pb-3">
                    <table className="w-full text-[13px] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                                <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Mã KDE</th>
                                <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Tên</th>
                                <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Kiểu</th>
                                <th className="text-left px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Bắt buộc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ev.kde_mappings.map((m) => (
                                <tr key={m.kde_code} className="border-t border-gray-50 dark:border-gray-800/60">
                                    <td className="px-3 py-2 font-mono text-brand-600 dark:text-brand-400 text-[12px]">{m.kde_code}</td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{m.kde_name}</td>
                                    <td className="px-3 py-2 text-gray-400">{m.kde_data_type}</td>
                                    <td className="px-3 py-2">
                                        {m.is_required
                                            ? <span className="text-[11px] font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full border border-brand-100">Bắt buộc</span>
                                            : <span className="text-[11px] text-gray-400">Tuỳ chọn</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
