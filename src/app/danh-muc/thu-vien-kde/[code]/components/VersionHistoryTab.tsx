"use client";

import { useState } from "react";
import Link from "next/link";
import { GitCompare, ChevronDown, ChevronRight } from "lucide-react";
import type { Kde, KdeField } from "../../lib/types";
import { DataRuleView } from "./KdeDataRuleEditor";

interface Props {
    kde: Kde;
}

function VersionCard({ kde, v }: { kde: Kde; v: KdeField }) {
    const [expanded, setExpanded] = useState(v.is_current);

    return (
        <div className="px-5 py-4">
            <div className="flex items-start gap-3">
                <span
                    className={`inline-flex items-center justify-center min-w-[40px] h-6 px-2 rounded-full text-[12px] font-mono font-semibold ${v.is_current
                        ? "bg-brand-50 text-brand-700 border border-brand-200"
                        : "bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                        }`}
                >
                    {v.version}
                </span>
                <div className="flex-1">
                    <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200">
                        {v.version} — {v.nghi_dinh}
                    </p>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {v.import_date} · {v.is_current ? "Hoạt động" : "Ngừng hoạt động"}
                    </p>

                    {v.data_rule && (
                        <div className="mt-2">
                            <button
                                onClick={() => setExpanded((e) => !e)}
                                className="inline-flex items-center gap-1 text-[12px] text-brand-600 dark:text-brand-400 hover:underline"
                            >
                                {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                Quy tắc dữ liệu ({v.data_rule.type})
                            </button>
                            {expanded && (
                                <div className="mt-2 pl-1">
                                    <DataRuleView data_rule={v.data_rule} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {kde.versions.length > 1 && (
                    <Link
                        href={`/danh-muc/thu-vien-kde/${kde.code}/so-sanh`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
                    >
                        <GitCompare size={12} /> So sánh
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function VersionHistoryTab({ kde }: Props) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
            {kde.versions.map((v) => (
                <VersionCard key={v.version} kde={kde} v={v} />
            ))}
        </div>
    );
}
