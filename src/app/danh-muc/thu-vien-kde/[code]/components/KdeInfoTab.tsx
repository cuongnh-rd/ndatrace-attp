"use client";

import { useState } from "react";
import { Tag, Plus } from "lucide-react";
import type { Kde, KdeField } from "../../lib/types";
import NhomThongTinModal from "./NhomThongTinModal";
import { DataRuleView } from "./KdeDataRuleEditor";

interface Props {
    kde: Kde;
    version: KdeField;
}

function Mono({ children }: { children: React.ReactNode }) {
    return (
        <span className="font-mono text-[13px] bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">
            {children}
        </span>
    );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[200px_1fr] gap-4 px-5 py-3">
            <div className="text-[14px] text-gray-500 dark:text-gray-400">{label}</div>
            <div className="text-[14px] text-gray-800 dark:text-gray-200">{children}</div>
        </div>
    );
}

export default function KdeInfoTab({ kde, version }: Props) {
    const [nhomList, setNhomList] = useState<string[]>(kde.nhom_thong_tin);
    const [showModal, setShowModal] = useState(false);

    const staticRows: [string, React.ReactNode][] = [
        ["Mã dữ liệu", <Mono key="c">{kde.code}</Mono>],
        ["Tên dữ liệu", kde.name],
        ["Mô tả", version.description],
        ["Phiên bản hiện tại", <Mono key="v">{kde.current_version} — {version.nghi_dinh_full}</Mono>],
        ["Trạng thái", kde.status],
        ["Ngày tạo", version.import_date],
    ];

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
                {staticRows.map(([label, value]) => (
                    <InfoRow key={label} label={label}>{value}</InfoRow>
                ))}

                {/* Nhóm thông tin — N-N, interactive */}
                <div className="grid grid-cols-[200px_1fr] gap-4 px-5 py-3">
                    <div className="text-[14px] text-gray-500 dark:text-gray-400">Nhóm thông tin</div>
                    <div className="flex flex-wrap items-center gap-2">
                        {nhomList.map((nhom) => (
                            <span
                                key={nhom}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-800"
                            >
                                <Tag size={11} />
                                {nhom}
                            </span>
                        ))}
                        {nhomList.length === 0 && (
                            <span className="text-[13px] text-gray-400 dark:text-gray-500 italic">Chưa gắn nhóm nào</span>
                        )}
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium text-brand-600 dark:text-brand-400 border border-dashed border-brand-300 dark:border-brand-700 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                        >
                            <Plus size={12} />
                            Gắn vào nhóm
                        </button>
                    </div>
                </div>

                {/* Kiểu dữ liệu + Quy tắc */}
                <InfoRow label="Kiểu dữ liệu">
                    <Mono>{version.data_type}</Mono>
                </InfoRow>

                {version.data_rule && (
                    <div className="grid grid-cols-[200px_1fr] gap-4 px-5 py-3">
                        <div className="text-[14px] text-gray-500 dark:text-gray-400">Quy tắc dữ liệu</div>
                        <div>
                            <DataRuleView data_rule={version.data_rule} />
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <NhomThongTinModal
                    current={nhomList}
                    onSave={(selected) => {
                        setNhomList(selected);
                        setShowModal(false);
                    }}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
