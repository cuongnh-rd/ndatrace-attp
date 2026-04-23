"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getKdeByCode } from "../../lib/mock-data";
import { computeDiff } from "../../lib/diff";
import type { DiffChange } from "../../lib/types";

const cellStyle: Record<DiffChange, string> = {
    added: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    removed: "bg-red-50 text-red-700 line-through dark:bg-red-900/20 dark:text-red-300",
    changed: "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
    unchanged: "text-gray-500 dark:text-gray-400",
};

export default function Page() {
    const params = useParams();
    const code = String(params.code ?? "");
    const kde = getKdeByCode(code);

    const versions = kde?.versions ?? [];
    const defaultV1 = versions.length > 1 ? versions[versions.length - 1].version : versions[0]?.version ?? "";
    const defaultV2 = versions[0]?.version ?? "";
    const [v1Key, setV1Key] = useState(defaultV1);
    const [v2Key, setV2Key] = useState(defaultV2);

    const diff = useMemo(() => {
        if (!kde) return [];
        const v1 = kde.versions.find((v) => v.version === v1Key);
        const v2 = kde.versions.find((v) => v.version === v2Key);
        if (!v1 || !v2) return [];
        return computeDiff(v1, v2);
    }, [kde, v1Key, v2Key]);

    if (!kde) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <BookOpen size={40} className="text-gray-300" />
                    <p className="text-gray-500">Không tìm thấy KDE với code {code}</p>
                    <Link href="/danh-muc/thu-vien-kde" className="text-sm text-brand-600 hover:underline">
                        ← Quay lại Thư viện KDE
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const v1Meta = kde.versions.find((v) => v.version === v1Key);
    const v2Meta = kde.versions.find((v) => v.version === v2Key);

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-4">
                <Link
                    href={`/danh-muc/thu-vien-kde/${kde.code}`}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">So sánh phiên bản — {kde.name}</h1>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                        <code className="font-mono">{kde.code}</code> · So sánh hai phiên bản của KDE
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-5 px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <VersionSelect value={v1Key} onChange={setV1Key} options={kde.versions.map((v) => ({ value: v.version, label: `${v.version} — ${v.nghi_dinh}` }))} />
                <span className="text-[13px] text-gray-500 dark:text-gray-400">so với</span>
                <VersionSelect value={v2Key} onChange={setV2Key} options={kde.versions.map((v) => ({ value: v.version, label: `${v.version} — ${v.nghi_dinh}` }))} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="grid grid-cols-2 bg-gray-50/80 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                    <div className="px-5 py-3 text-[13px] font-semibold text-gray-600 dark:text-gray-300 border-r border-gray-100 dark:border-gray-800">
                        {v1Meta?.version} — {v1Meta?.nghi_dinh}{" "}
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">Cũ</span>
                    </div>
                    <div className="px-5 py-3 text-[13px] font-semibold text-gray-600 dark:text-gray-300">
                        {v2Meta?.version} — {v2Meta?.nghi_dinh}{" "}
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-200">Hiện tại</span>
                    </div>
                </div>

                {diff.map((row) => (
                    <div key={row.field} className="grid grid-cols-2 border-b border-gray-50 dark:border-gray-800 last:border-b-0">
                        <div className={`px-5 py-3 text-[14px] border-r border-gray-50 dark:border-gray-800 ${cellStyle[row.change === "added" ? "unchanged" : row.change]}`}>
                            <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">{row.label}</p>
                            {row.v1}
                        </div>
                        <div className={`px-5 py-3 text-[14px] ${cellStyle[row.change === "removed" ? "unchanged" : row.change]}`}>
                            <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">{row.label}</p>
                            {row.v2}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-[12px] text-gray-600 dark:text-gray-400">
                <LegendDot className="bg-green-100 border-green-200" /> Thêm mới
                <LegendDot className="bg-red-100 border-red-200" /> Loại bỏ
                <LegendDot className="bg-amber-100 border-amber-200" /> Thay đổi
                <LegendDot className="bg-gray-50 border-gray-200" /> Không đổi
            </div>
        </DashboardLayout>
    );
}

function VersionSelect({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="px-3 py-2 text-[14px] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-300 min-w-[200px]"
        >
            {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    );
}

function LegendDot({ className }: { className: string }) {
    return <span className={`inline-block w-3 h-3 rounded border ${className} mr-1`} />;
}
