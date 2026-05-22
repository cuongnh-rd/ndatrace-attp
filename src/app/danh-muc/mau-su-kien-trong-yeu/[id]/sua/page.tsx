"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Copy, AlertTriangle, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EventModal from "../../components/_EventModal";
import ImportFromCteModal from "../../components/_ImportFromCteModal";
import CteEventRow from "../../components/CteEventRow";
import VersionConfirmModal from "../components/_VersionConfirmModal";
import { getTemplateById, cteTemplates, versionHistories, generateId } from "../../lib/mock-data";
import { FAMILY_OPTIONS } from "../../lib/constants";
import type { CteEvent, CteTemplate, CteVersionHistory } from "../../lib/types";

interface FormData {
    vc_type: string;
    vc_type_name: string;
    family_name: string;
    description: string;
}

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = String(params.id ?? "");
    const original = getTemplateById(id);

    const [form, setForm] = useState<FormData>({ vc_type: "", vc_type_name: "", family_name: "", description: "" });
    const [events, setEvents] = useState<CteEvent[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CteEvent | null>(null);
    const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
    const [versionModalOpen, setVersionModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<"draft" | "publish" | null>(null);
    const [importOpen, setImportOpen] = useState(false);

    const dragIdx = useRef(-1);

    useEffect(() => {
        if (original) {
            setForm({
                vc_type: original.vc_type,
                vc_type_name: original.vc_type_name,
                family_name: original.family_name,
                description: original.description,
            });
            setEvents(original.events.map((e) => ({ ...e })));
            setExpandedEvents(new Set(original.events.map((e) => e.id)));
        }
    }, [id]);

    if (!original) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <BookOpen size={40} className="text-gray-300" />
                    <p className="text-gray-500">Không tìm thấy mẫu sự kiện với ID: {id}</p>
                    <Link href="/danh-muc/mau-su-kien-trong-yeu" className="text-sm text-brand-600 hover:underline">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const isDraft = original.status === "Nháp";
    const isActive = original.status === "Hoạt động";

    // Event handlers
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
                template_id: original.id,
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

    // Validation
    const allKdesHaveRequired = events.every((ev) => ev.kde_mappings.some((m) => m.is_required));
    const hasAnyMissingRequired = events.some((ev) => ev.kde_mappings.length > 0 && ev.kde_mappings.every((m) => !m.is_required));

    const validate = (publish: boolean) => {
        const errs: Record<string, string> = {};
        if (!form.vc_type_name.trim()) errs.vc_type_name = "Tên mẫu không được để trống";
        if (!form.vc_type.trim()) errs.vc_type = "Mã mẫu không được để trống";
        if (!form.family_name) errs.family_name = "Vui lòng chọn nhóm ngành";
        if (publish && events.length === 0) errs.events = "Cần ít nhất 1 sự kiện để công bố";
        if (publish && !allKdesHaveRequired) errs.required = "Mỗi sự kiện cần ít nhất 1 KDE bắt buộc";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const doSaveDraft = () => {
        const updatedTemplate: CteTemplate = {
            ...original,
            vc_type: form.vc_type,
            vc_type_name: form.vc_type_name,
            family_name: form.family_name,
            description: form.description,
            status: "Nháp",
            events: events.map((e) => ({ ...e, template_id: original.id })),
            updated_at: new Date().toLocaleDateString("vi-VN"),
        };
        const idx = cteTemplates.findIndex((t) => t.id === original.id);
        if (idx >= 0) cteTemplates[idx] = updatedTemplate;
        router.push(`/danh-muc/mau-su-kien-trong-yeu/${original.id}`);
    };

    const doPublish = () => {
        if (isActive) {
            // Create new version — supersede old
            const newId = generateId();
            const newVersion = original.version + 1;

            // Add to version history
            const histEntry: CteVersionHistory = {
                id: generateId(),
                template_id: original.id,
                version: original.version,
                snapshot_events: original.events,
                status: "Superseded",
                created_by: original.created_by,
                created_at: original.updated_at,
            };
            versionHistories.push(histEntry);

            // Update old to Không hoạt động
            const oldIdx = cteTemplates.findIndex((t) => t.id === original.id);
            if (oldIdx >= 0) cteTemplates[oldIdx] = { ...cteTemplates[oldIdx], status: "Không hoạt động" };

            // Create new active template (reuse same id for simplicity — update in place)
            const newTemplate: CteTemplate = {
                ...original,
                vc_type: form.vc_type,
                vc_type_name: form.vc_type_name,
                family_name: form.family_name,
                description: form.description,
                version: newVersion,
                status: "Hoạt động",
                events: events.map((e) => ({ ...e, template_id: original.id })),
                updated_at: new Date().toLocaleDateString("vi-VN"),
            };
            if (oldIdx >= 0) cteTemplates[oldIdx] = newTemplate;

        } else {
            // Draft → Active
            const updatedTemplate: CteTemplate = {
                ...original,
                vc_type: form.vc_type,
                vc_type_name: form.vc_type_name,
                family_name: form.family_name,
                description: form.description,
                status: "Hoạt động",
                events: events.map((e) => ({ ...e, template_id: original.id })),
                updated_at: new Date().toLocaleDateString("vi-VN"),
            };
            const idx = cteTemplates.findIndex((t) => t.id === original.id);
            if (idx >= 0) cteTemplates[idx] = updatedTemplate;
        }

        router.push(`/danh-muc/mau-su-kien-trong-yeu/${original.id}`);
    };

    const handleSaveDraft = () => {
        if (!validate(false)) return;
        doSaveDraft();
    };

    const handlePublishClick = () => {
        if (!validate(true)) return;
        if (isActive) {
            setPendingAction("publish");
            setVersionModalOpen(true);
        } else {
            doPublish();
        }
    };

    const handleVersionConfirm = () => {
        setVersionModalOpen(false);
        setPendingAction(null);
        doPublish();
    };

    return (
        <DashboardLayout>
            {/* Top bar */}
            <div className="flex items-center gap-3 mb-6">
                <Link href={`/danh-muc/mau-su-kien-trong-yeu/${original.id}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isDraft ? "Chỉnh sửa mẫu (Nháp)" : `Tạo phiên bản mới v${original.version + 1}`}
                    </h1>
                    <p className="text-[13px] text-gray-500">{original.vc_type}</p>
                </div>
                <Link href={`/danh-muc/mau-su-kien-trong-yeu/${original.id}`}
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Huỷ
                </Link>
                <button onClick={handleSaveDraft}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Lưu nháp
                </button>
                <button
                    onClick={handlePublishClick}
                    disabled={hasAnyMissingRequired}
                    className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                    Lưu + Công bố
                </button>
            </div>

            {/* AC4 global warning */}
            {hasAnyMissingRequired && (
                <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 rounded-xl text-[13px] text-amber-700 dark:text-amber-400">
                    <AlertTriangle size={14} className="shrink-0" />
                    Một hoặc nhiều sự kiện chưa có KDE bắt buộc. Cần bật "Bắt buộc" cho ít nhất 1 KDE mỗi sự kiện trước khi công bố.
                </div>
            )}

            <div className="space-y-5">
                {/* General info */}
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
                                className={`w-full px-3 py-2 text-[14px] border rounded-xl outline-none transition-colors bg-white dark:bg-gray-800 ${errors.vc_type_name ? "border-red-300" : "border-gray-200 dark:border-gray-700 focus:border-brand-400"}`} />
                            {errors.vc_type_name && <p className="text-[12px] text-red-500 mt-1">{errors.vc_type_name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Mã mẫu <span className="text-red-500">*</span>
                            </label>
                            <input value={form.vc_type}
                                onChange={(e) => { setForm((p) => ({ ...p, vc_type: e.target.value })); setErrors((p) => ({ ...p, vc_type: "" })); }}
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
                            {errors.events && <p className="text-[12px] text-red-500 mt-0.5">{errors.events}</p>}
                            {errors.required && <p className="flex items-center gap-1 text-[12px] text-amber-600 mt-0.5"><AlertTriangle size={11} />{errors.required}</p>}
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
                        <div className="py-14 flex flex-col items-center gap-2 text-gray-400">
                            <p className="text-[14px]">Chưa có sự kiện. Nhấn "Thêm sự kiện" để bắt đầu.</p>
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
                templateId={original.id}
            />

            <VersionConfirmModal
                isOpen={versionModalOpen}
                onClose={() => { setVersionModalOpen(false); setPendingAction(null); }}
                onConfirm={handleVersionConfirm}
                template={original}
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
