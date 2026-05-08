"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Tag, Plus } from "lucide-react";
import type { KdeDataType, KdeDataRule } from "../../lib/types";
import { DATA_TYPES } from "../../lib/constants";
import NhomThongTinModal from "./NhomThongTinModal";
import KdeDataRuleEditor, { defaultRule } from "./KdeDataRuleEditor";

export interface KdeFormData {
    code: string;
    name: string;
    description: string;
    data_type: KdeDataType;
    data_rule: KdeDataRule;
    status: "Hoạt động" | "Ngừng hoạt động";
    nhom_thong_tin: string[];
}

export interface KdeFormRef {
    submit: () => void;
    isValid: () => boolean;
}

interface Props {
    mode: "create" | "edit";
    initialValues?: Partial<KdeFormData>;
    onSave: (data: KdeFormData) => void;
}

const inputClass =
    "w-full px-3 py-1.5 text-[14px] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-all";

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[200px_1fr] gap-4 px-5 py-3">
            <div className="text-[14px] text-gray-500 dark:text-gray-400 pt-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </div>
            <div>{children}</div>
        </div>
    );
}

const KdeFormTab = forwardRef<KdeFormRef, Props>(function KdeFormTab({ mode, initialValues, onSave }, ref) {
    const [form, setForm] = useState<KdeFormData>({
        code: initialValues?.code ?? "",
        name: initialValues?.name ?? "",
        description: initialValues?.description ?? "",
        data_type: initialValues?.data_type ?? "string",
        data_rule: initialValues?.data_rule ?? defaultRule(initialValues?.data_type ?? "string"),
        status: initialValues?.status ?? "Hoạt động",
        nhom_thong_tin: initialValues?.nhom_thong_tin ?? [],
    });
    const [showModal, setShowModal] = useState(false);

    const set = <K extends keyof KdeFormData>(key: K, value: KdeFormData[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    useImperativeHandle(ref, () => ({
        submit: () => {
            if (!form.code.trim() || !form.name.trim()) return;
            onSave(form);
        },
        isValid: () => !!form.code.trim() && !!form.name.trim(),
    }));

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
                <FormRow label="Mã dữ liệu" required>
                    <input
                        type="text"
                        value={form.code}
                        onChange={(e) => set("code", e.target.value.toUpperCase())}
                        readOnly={mode === "edit"}
                        placeholder="VD: HARVEST_DATE"
                        className={inputClass + (mode === "edit" ? " bg-gray-50 dark:bg-gray-800/60 cursor-not-allowed text-gray-500" : "")}
                    />
                </FormRow>

                <FormRow label="Tên dữ liệu" required>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Nhập tên trường dữ liệu..."
                        className={inputClass}
                    />
                </FormRow>

                <FormRow label="Mô tả">
                    <textarea
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="Mô tả ý nghĩa và cách dùng..."
                        rows={3}
                        className={inputClass + " resize-none"}
                    />
                </FormRow>



                <FormRow label="Trạng thái" required>
                    <select
                        value={form.status}
                        onChange={(e) => set("status", e.target.value as KdeFormData["status"])}
                        className={inputClass}
                    >
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                    </select>
                </FormRow>

                <div className="grid grid-cols-[200px_1fr] gap-4 px-5 py-3">
                    <div className="text-[14px] text-gray-500 dark:text-gray-400 pt-1.5">Nhóm thông tin</div>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {form.nhom_thong_tin.map((nhom) => (
                            <span
                                key={nhom}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-800"
                            >
                                <Tag size={11} />
                                {nhom}
                            </span>
                        ))}
                        {form.nhom_thong_tin.length === 0 && (
                            <span className="text-[13px] text-gray-400 dark:text-gray-500 italic">Chưa gắn nhóm nào</span>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium text-brand-600 dark:text-brand-400 border border-dashed border-brand-300 dark:border-brand-700 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                        >
                            <Plus size={12} />
                            Gắn vào nhóm
                        </button>
                    </div>
                </div>
                <FormRow label="Kiểu dữ liệu" required>
                    <select
                        value={form.data_type}
                        onChange={(e) => {
                            const dt = e.target.value as KdeDataType;
                            setForm((prev) => ({ ...prev, data_type: dt, data_rule: defaultRule(dt) }));
                        }}
                        className={inputClass}
                    >
                        {DATA_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </FormRow>

                <KdeDataRuleEditor
                    embedded
                    data_type={form.data_type}
                    data_rule={form.data_rule}
                    onChange={(rule) => set("data_rule", rule)}
                />
            </div>

            {showModal && (
                <NhomThongTinModal
                    current={form.nhom_thong_tin}
                    onSave={(selected) => {
                        set("nhom_thong_tin", selected);
                        setShowModal(false);
                    }}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
});

export default KdeFormTab;
