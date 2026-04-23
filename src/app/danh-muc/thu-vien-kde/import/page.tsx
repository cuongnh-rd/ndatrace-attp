"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, AlertTriangle, FileSpreadsheet } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import { importPreview, importSummary } from "../lib/mock-data";
import type { ImportChangeType } from "../lib/types";

const changeBadge: Record<ImportChangeType, { label: string; variant: "success" | "warning" | "neutral" }> = {
    new: { label: "Thêm mới", variant: "success" },
    updated: { label: "Cập nhật", variant: "warning" },
    unchanged: { label: "Không đổi", variant: "neutral" },
};

export default function Page() {
    const router = useRouter();
    const [step, setStep] = useState<"form" | "preview">("form");
    const [nghiDinh, setNghiDinh] = useState("37/2025/NĐ-CP");
    const [issueDate, setIssueDate] = useState("2025-03-15");
    const [agency, setAgency] = useState("Chính phủ");

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/danh-muc/thu-vien-kde"
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nhập KDE từ nghị định</h1>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                        Upload file Excel/CSV theo template chuẩn. Hệ thống tự động tạo version mới nếu import đè lên KDE đã tồn tại.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <StepIndicator index={1} label="Thông tin nghị định" active={step === "form"} done={step === "preview"} />
                <span className="flex-1 max-w-[60px] h-px bg-gray-200" />
                <StepIndicator index={2} label="Xem trước & xác nhận" active={step === "preview"} done={false} />
            </div>

            {step === "form" ? (
                <div className="max-w-xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
                    <Field label="Số nghị định" required>
                        <input
                            value={nghiDinh}
                            onChange={(e) => setNghiDinh(e.target.value)}
                            placeholder="VD: 37/2025/NĐ-CP"
                            className="w-full px-3 py-2 text-[14px] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-300"
                        />
                    </Field>
                    <Field label="Ngày ban hành" required>
                        <input
                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            className="w-full px-3 py-2 text-[14px] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-300"
                        />
                    </Field>
                    <Field label="Cơ quan ban hành" required>
                        <input
                            value={agency}
                            onChange={(e) => setAgency(e.target.value)}
                            placeholder="VD: Chính phủ"
                            className="w-full px-3 py-2 text-[14px] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-300"
                        />
                    </Field>
                    <Field label="File KDE (.xlsx / .csv)" required>
                        <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-xl px-6 py-8 text-center bg-gray-50/60 dark:bg-gray-800/40">
                            <FileSpreadsheet size={24} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-2">Kéo file vào đây hoặc</p>
                            <button
                                type="button"
                                onClick={() => setStep("preview")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Chọn file từ máy
                            </button>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
                                Tải <span className="text-brand-600 underline cursor-pointer">template chuẩn</span> · Tối đa 10MB
                            </p>
                        </div>
                    </Field>

                    <div className="flex items-center gap-2 pt-2">
                        <button
                            onClick={() => setStep("preview")}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
                        >
                            <Upload size={14} /> Tiếp theo: Xem trước
                        </button>
                        <Link
                            href="/danh-muc/thu-vien-kde"
                            className="px-4 py-2 text-[14px] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Hủy
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-5">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
                        <p className="text-[13px] text-gray-500 dark:text-gray-400">
                            Nghị định <span className="font-semibold text-gray-800 dark:text-gray-200">{nghiDinh}</span> · {agency} · {issueDate}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <SummaryCard label="Thêm mới" value={importSummary.new} tone="success" />
                        <SummaryCard label="Cập nhật" value={importSummary.updated} tone="warning" />
                        <SummaryCard label="Không thay đổi" value={importSummary.unchanged} tone="neutral" />
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                                    <th className="text-left px-5 py-3 text-[14px] font-semibold uppercase tracking-wide text-gray-500">Code</th>
                                    <th className="text-left px-5 py-3 text-[14px] font-semibold uppercase tracking-wide text-gray-500">Tên KDE</th>
                                    <th className="text-left px-5 py-3 text-[14px] font-semibold uppercase tracking-wide text-gray-500">Kiểu</th>
                                    <th className="text-left px-5 py-3 text-[14px] font-semibold uppercase tracking-wide text-gray-500">Thay đổi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {importPreview.map((row) => (
                                    <tr key={row.code} className="border-b border-gray-50 dark:border-gray-800 last:border-b-0">
                                        <td className="px-5 py-3.5">
                                            <code className="font-mono text-[13px] bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">
                                                {row.code}
                                            </code>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-800 dark:text-gray-200">{row.name}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-mono bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                {row.data_type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={changeBadge[row.change_type].variant}>
                                                {row.change_note ?? changeBadge[row.change_type].label}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl text-[13px] text-amber-800 dark:text-amber-300">
                        <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                        <span>{importSummary.updated} KDE được cập nhật sẽ tạo version mới. Các CTE đang dùng version cũ sẽ nhận thông báo sau khi import.</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.push("/danh-muc/thu-vien-kde")}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
                        >
                            Xác nhận import
                        </button>
                        <button
                            onClick={() => setStep("form")}
                            className="px-4 py-2 text-[14px] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            ← Quay lại
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function StepIndicator({ index, label, active, done }: { index: number; label: string; active: boolean; done: boolean }) {
    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] ${active
            ? "bg-brand-600 text-white"
            : done
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${active ? "bg-white/30" : done ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
                }`}>
                {index}
            </span>
            {label}
        </div>
    );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: "success" | "warning" | "neutral" }) {
    const toneMap = {
        success: "text-green-700 dark:text-green-300",
        warning: "text-amber-700 dark:text-amber-300",
        neutral: "text-gray-700 dark:text-gray-300",
    };
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
            <p className="text-[13px] text-gray-500 dark:text-gray-400">{label}</p>
            <p className={`text-2xl font-bold ${toneMap[tone]} mt-0.5`}>{value}</p>
        </div>
    );
}
