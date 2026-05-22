"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Copy, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EventModal from "../components/_EventModal";
import ImportFromCteModal from "../components/_ImportFromCteModal";
import CteEventRow from "../components/CteEventRow";
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
    const [importOpen, setImportOpen] = useState(false);

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

    const handleImportEvents = (imported: CteEvent[]) => {
        setEvents((prev) => {
            const newEvents = imported.map((e, i) => ({
                ...e,
                id: generateId(),
                template_id: "",
                display_order: prev.length + i + 1,
                kde_mappings: e.kde_mappings.map((m) => ({ ...m, id: generateId() })),
            }));
            return [...prev, ...newEvents];
        });
        setImportOpen(false);
    };

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
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">Thông tin chung</h2>
                    </div>
                    <div className="px-6 py-5">
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
                        <div className="flex items-center gap-2">
                            <button onClick={() => setImportOpen(true)}
                                className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 border border-brand-200 hover:bg-brand-50 dark:border-brand-800 dark:hover:bg-brand-900/20 rounded-xl px-3 py-2 transition-colors">
                                <Copy size={14} /> Thêm sự kiện mẫu
                            </button>
                            <button onClick={openAddEvent}
                                className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl px-3 py-2 transition-colors">
                                <Plus size={14} /> Thêm mới sự kiện
                            </button>
                        </div>
                    </div>

                    {events.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                <Plus size={20} className="text-gray-300" />
                            </div>
                            <p className="text-[14px]">Chưa có sự kiện nào. Nhấn "Thêm mới sự kiện" hoặc "Thêm sự kiện mẫu" để bắt đầu.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {events.map((ev, idx) => (
                                <CteEventRow
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

            <ImportFromCteModal
                open={importOpen}
                onClose={() => setImportOpen(false)}
                onImport={handleImportEvents}
                existingEventCodes={events.map((e) => e.event_code)}
            />
        </DashboardLayout>
    );
}
