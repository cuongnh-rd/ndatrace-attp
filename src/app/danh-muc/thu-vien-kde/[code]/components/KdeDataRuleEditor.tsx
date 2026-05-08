"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus, ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import type { KdeDataType, KdeDataRule, StringRule, ArrayRule, ObjectRule, KdeChild } from "../../lib/types";
import { STRING_FORMAT_OPTIONS } from "../../lib/constants";

const inputClass =
    "w-full px-3 py-1.5 text-[14px] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-all";

const smallInputClass =
    "w-full px-2.5 py-1 text-[13px] border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-all";

export function defaultRule(type: KdeDataType): KdeDataRule {
    switch (type) {
        case "string":
            return { type: "string", rule: { format: "none" } };
        case "boolean":
            return { type: "boolean", rule: null };
        case "array":
            return { type: "array", rule: { item_type: "string" } };
        case "object":
            return { type: "object", rule: { children: [] } };
    }
}

// ─── String Rule ──────────────────────────────────────────────────────────────

function StringRuleEditor({
    rule,
    onChange,
    compact = false,
}: {
    rule: StringRule;
    onChange: (r: StringRule) => void;
    compact?: boolean;
}) {
    const labelClass = `text-[${compact ? "12px" : "13px"}] text-gray-500 dark:text-gray-400 mb-1`;
    const grid = compact ? "grid grid-cols-3 gap-2" : "grid grid-cols-3 gap-3";

    return (
        <div className={grid}>
            <div>
                <p className={labelClass}>Định dạng</p>
                <select
                    value={rule.format}
                    onChange={(e) => onChange({ ...rule, format: e.target.value as StringRule["format"] })}
                    className={compact ? smallInputClass : inputClass}
                >
                    {STRING_FORMAT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>
            <div>
                <p className={labelClass}>Số ký tự tối thiểu</p>
                <input
                    type="number"
                    min={0}
                    value={rule.min_length ?? ""}
                    onChange={(e) =>
                        onChange({ ...rule, min_length: e.target.value === "" ? undefined : Number(e.target.value) })
                    }
                    placeholder="Không giới hạn"
                    className={compact ? smallInputClass : inputClass}
                />
            </div>
            <div>
                <p className={labelClass}>Số ký tự tối đa</p>
                <input
                    type="number"
                    min={0}
                    value={rule.max_length ?? ""}
                    onChange={(e) =>
                        onChange({ ...rule, max_length: e.target.value === "" ? undefined : Number(e.target.value) })
                    }
                    placeholder="Không giới hạn"
                    className={compact ? smallInputClass : inputClass}
                />
            </div>
        </div>
    );
}

// ─── Boolean Rule ─────────────────────────────────────────────────────────────

function BooleanRuleEditor({ compact = false }: { compact?: boolean }) {
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[${compact ? "12" : "13"}px] text-gray-600 dark:text-gray-400`}>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200 font-medium text-[12px]">Đúng</span>
            <span className="text-gray-400">/</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 font-medium text-[12px]">Sai</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">Không có cấu hình thêm</span>
        </div>
    );
}

// ─── Array Rule ───────────────────────────────────────────────────────────────

function ArrayRuleEditor({
    rule,
    onChange,
    compact = false,
}: {
    rule: ArrayRule;
    onChange: (r: ArrayRule) => void;
    compact?: boolean;
}) {
    const [tagInput, setTagInput] = useState("");

    const addTag = () => {
        const val = tagInput.trim();
        if (!val) return;
        const current = rule.enum_options ?? [];
        if (current.includes(val)) return;
        onChange({ ...rule, enum_options: [...current, val] });
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        onChange({ ...rule, enum_options: (rule.enum_options ?? []).filter((t) => t !== tag) });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="space-y-3">
            <div>
                <p className={`text-[${compact ? "12" : "13"}px] text-gray-500 dark:text-gray-400 mb-1`}>Kiểu phần tử</p>
                <select
                    value={rule.item_type}
                    onChange={(e) =>
                        onChange({ item_type: e.target.value as ArrayRule["item_type"], enum_options: [] })
                    }
                    className={compact ? smallInputClass : inputClass}
                >
                    <option value="string">String — tự nhập chuỗi bất kỳ</option>
                    <option value="enum">Enum — chọn từ danh sách</option>
                </select>
            </div>

            {rule.item_type === "enum" && (
                <div>
                    <p className={`text-[${compact ? "12" : "13"}px] text-gray-500 dark:text-gray-400 mb-1.5`}>
                        Danh sách giá trị cho phép
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {(rule.enum_options ?? []).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-800"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-brand-900 dark:hover:text-brand-200 transition-colors"
                                >
                                    <X size={10} />
                                </button>
                            </span>
                        ))}
                        {(rule.enum_options ?? []).length === 0 && (
                            <span className="text-[12px] text-gray-400 italic">Chưa có giá trị nào</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập giá trị rồi nhấn Enter..."
                            className={compact ? smallInputClass : inputClass}
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="px-3 py-1.5 rounded-xl text-[13px] font-medium text-brand-600 border border-brand-200 hover:bg-brand-50 dark:text-brand-400 dark:border-brand-700 dark:hover:bg-brand-900/20 transition-colors whitespace-nowrap"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Object Rule ──────────────────────────────────────────────────────────────

const depthPanelStyle = [
    "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 rounded-xl",
    "border border-gray-200 dark:border-gray-700 border-l-2 border-l-blue-300 dark:border-l-blue-600 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl ml-3",
    "border border-gray-200 dark:border-gray-700 border-l-2 border-l-purple-300 dark:border-l-purple-600 bg-purple-50/30 dark:bg-purple-900/10 rounded-xl ml-6",
];

function ChildInlinePanel({
    initialValues,
    depth,
    onSave,
    onCancel,
    existingCodes,
}: {
    initialValues?: KdeChild;
    depth: number;
    onSave: (child: KdeChild) => void;
    onCancel: () => void;
    existingCodes: string[];
}) {
    const [form, setForm] = useState<KdeChild>(
        initialValues ?? {
            code: "",
            name: "",
            data_type: "string",
            required: false,
            string_rule: { format: "none" },
        }
    );
    const [error, setError] = useState("");

    const setField = <K extends keyof KdeChild>(key: K, value: KdeChild[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleTypeChange = (dt: KdeDataType) => {
        setForm((prev) => ({
            ...prev,
            data_type: dt,
            string_rule: dt === "string" ? { format: "none" } : undefined,
            array_rule: dt === "array" ? { item_type: "string" } : undefined,
            object_rule: dt === "object" ? { children: [] } : undefined,
        }));
    };

    const handleSave = () => {
        if (!form.code.trim()) { setError("Mã dữ liệu không được để trống"); return; }
        if (!form.name.trim()) { setError("Tên dữ liệu không được để trống"); return; }
        if (existingCodes.includes(form.code)) { setError("Mã này đã tồn tại"); return; }
        onSave(form);
    };

    const panelClass = depthPanelStyle[Math.min(depth, depthPanelStyle.length - 1)];

    return (
        <div className={`${panelClass} p-4 space-y-3`}>
            <p className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">
                {initialValues ? "Sửa trường con" : "Thêm trường con"}
            </p>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[12px] text-gray-500 dark:text-gray-400 mb-1 block">
                        Mã dữ liệu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.code}
                        onChange={(e) => setField("code", e.target.value.toUpperCase())}
                        readOnly={!!initialValues}
                        placeholder="VD: PRODUCT_NAME"
                        className={smallInputClass + (initialValues ? " bg-gray-100 dark:bg-gray-700/60 cursor-not-allowed text-gray-500" : "")}
                    />
                </div>
                <div>
                    <label className="text-[12px] text-gray-500 dark:text-gray-400 mb-1 block">
                        Tên dữ liệu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="Nhập tên trường..."
                        className={smallInputClass}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[12px] text-gray-500 dark:text-gray-400 mb-1 block">Kiểu dữ liệu</label>
                    <select
                        value={form.data_type}
                        onChange={(e) => handleTypeChange(e.target.value as KdeDataType)}
                        className={smallInputClass}
                    >
                        <option value="string">string</option>
                        <option value="boolean">boolean</option>
                        <option value="array">array</option>
                        {depth < 2 && <option value="object">object</option>}
                    </select>
                </div>
                <div>
                    <label className="text-[12px] text-gray-500 dark:text-gray-400 mb-1 block">Bắt buộc</label>
                    <div className="flex items-center gap-3 pt-1.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={form.required} onChange={() => setField("required", true)} className="accent-brand-500" />
                            <span className="text-[12px] text-gray-700 dark:text-gray-300">Bắt buộc</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={!form.required} onChange={() => setField("required", false)} className="accent-brand-500" />
                            <span className="text-[12px] text-gray-700 dark:text-gray-300">Tuỳ chọn</span>
                        </label>
                    </div>
                </div>
            </div>

            {form.data_type === "string" && form.string_rule && (
                <div>
                    <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Quy tắc String</p>
                    <StringRuleEditor rule={form.string_rule} onChange={(r) => setField("string_rule", r)} compact />
                </div>
            )}

            {form.data_type === "array" && form.array_rule && (
                <div>
                    <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Quy tắc Array</p>
                    <ArrayRuleEditor rule={form.array_rule} onChange={(r) => setField("array_rule", r)} compact />
                </div>
            )}

            {form.data_type === "object" && form.object_rule && (
                <div>
                    <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Trường con</p>
                    <ObjectRuleEditor
                        rule={form.object_rule}
                        onChange={(r) => setField("object_rule", r)}
                        compact
                        depth={depth + 1}
                    />
                </div>
            )}

            {error && <p className="text-[12px] text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1.5 rounded-xl text-[12px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    Huỷ
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="px-3 py-1.5 rounded-xl text-[12px] font-medium text-white bg-brand-500 hover:bg-brand-600 transition-colors"
                >
                    Lưu trường
                </button>
            </div>
        </div>
    );
}

export function ObjectRuleEditor({
    rule,
    onChange,
    compact = false,
    depth = 0,
}: {
    rule: ObjectRule;
    onChange: (r: ObjectRule) => void;
    compact?: boolean;
    depth?: number;
}) {
    const [panel, setPanel] = useState<{ mode: "add" } | { mode: "edit"; index: number } | null>(null);

    const addChild = (child: KdeChild) => {
        onChange({ children: [...rule.children, child] });
        setPanel(null);
    };

    const editChild = (index: number, child: KdeChild) => {
        const updated = [...rule.children];
        updated[index] = child;
        onChange({ children: updated });
        setPanel(null);
    };

    const removeChild = (index: number) => {
        onChange({ children: rule.children.filter((_, i) => i !== index) });
        if (panel?.mode === "edit" && panel.index === index) setPanel(null);
    };

    const editingChild = panel?.mode === "edit" ? rule.children[panel.index] : undefined;

    return (
        <div className="space-y-2">
            {rule.children.length === 0 ? (
                <p className="text-[13px] text-gray-400 italic py-2">Chưa có trường con nào</p>
            ) : (
                <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                    <table className="w-full text-[13px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800">
                                <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Mã</th>
                                <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Tên</th>
                                <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Kiểu</th>
                                <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Bắt buộc</th>
                                <th className="px-3 py-2" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {rule.children.map((child, i) => (
                                <tr key={child.code} className={`bg-white dark:bg-gray-900 ${panel?.mode === "edit" && panel.index === i ? "ring-1 ring-inset ring-brand-200 dark:ring-brand-800" : ""}`}>
                                    <td className="px-3 py-2 font-mono text-[12px] text-gray-700 dark:text-gray-300">{child.code}</td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{child.name}</td>
                                    <td className="px-3 py-2">
                                        <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
                                            {child.data_type}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {child.required ? (
                                            <span className="text-red-500 font-medium">Bắt buộc</span>
                                        ) : (
                                            <span className="text-gray-400">Tuỳ chọn</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setPanel(panel?.mode === "edit" && panel.index === i ? null : { mode: "edit", index: i })}
                                                className={`p-1 rounded transition-colors ${panel?.mode === "edit" && panel.index === i ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                            >
                                                <Pencil size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeChild(i)}
                                                className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <button
                type="button"
                onClick={() => setPanel(panel?.mode === "add" ? null : { mode: "add" })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border rounded-xl transition-colors ${
                    panel?.mode === "add"
                        ? "text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-600 bg-brand-50 dark:bg-brand-900/20"
                        : "text-brand-600 dark:text-brand-400 border-dashed border-brand-300 dark:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                }`}
            >
                <Plus size={13} />
                Thêm trường con
            </button>

            {panel && (
                <ChildInlinePanel
                    initialValues={editingChild}
                    depth={depth}
                    onSave={(child) =>
                        panel.mode === "add" ? addChild(child) : editChild(panel.index, child)
                    }
                    onCancel={() => setPanel(null)}
                    existingCodes={rule.children
                        .filter((_, i) => panel.mode !== "edit" || i !== panel.index)
                        .map((c) => c.code)}
                />
            )}
        </div>
    );
}

// ─── Read-only Rule View (dùng trong InfoTab / HistoryTab) ───────────────────

function ObjectRuleView({ rule, depth = 0 }: { rule: ObjectRule; depth?: number }) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    if (rule.children.length === 0) {
        return <span className="text-[13px] text-gray-400 italic">Không có trường con</span>;
    }
    return (
        <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden text-[13px]">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Mã</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Tên</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Kiểu</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400">Bắt buộc</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {rule.children.map((child) => {
                        const hasDetail =
                            (child.data_type === "string" && child.string_rule) ||
                            (child.data_type === "array" && child.array_rule) ||
                            (child.data_type === "object" && child.object_rule);
                        const isOpen = expanded[child.code];
                        return (
                            <>
                                <tr key={child.code} className="bg-white dark:bg-gray-900">
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-1">
                                            {hasDetail && (
                                                <button
                                                    type="button"
                                                    onClick={() => setExpanded((p) => ({ ...p, [child.code]: !p[child.code] }))}
                                                    className="p-0.5 text-gray-400 hover:text-gray-600"
                                                >
                                                    {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                </button>
                                            )}
                                            <span className="font-mono text-[12px] text-gray-700 dark:text-gray-300">{child.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{child.name}</td>
                                    <td className="px-3 py-2">
                                        <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">{child.data_type}</span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {child.required
                                            ? <span className="text-red-500 font-medium">Bắt buộc</span>
                                            : <span className="text-gray-400">Tuỳ chọn</span>}
                                    </td>
                                </tr>
                                {isOpen && hasDetail && (
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                                        <td colSpan={4} className="px-4 py-3">
                                            {child.data_type === "string" && child.string_rule && (
                                                <DataRuleView data_rule={{ type: "string", rule: child.string_rule }} />
                                            )}
                                            {child.data_type === "array" && child.array_rule && (
                                                <DataRuleView data_rule={{ type: "array", rule: child.array_rule }} />
                                            )}
                                            {child.data_type === "object" && child.object_rule && (
                                                <ObjectRuleView rule={child.object_rule} depth={depth + 1} />
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export function DataRuleView({ data_rule }: { data_rule: KdeDataRule }) {
    switch (data_rule.type) {
        case "string": {
            const { format, min_length, max_length } = data_rule.rule;
            const formatLabel = STRING_FORMAT_OPTIONS.find((o) => o.value === format)?.label ?? format;
            return (
                <div className="flex flex-wrap gap-3 text-[13px]">
                    <span className="text-gray-500 dark:text-gray-400">
                        Định dạng: <span className="font-medium text-gray-700 dark:text-gray-200">{formatLabel}</span>
                    </span>
                    {min_length !== undefined && (
                        <span className="text-gray-500 dark:text-gray-400">
                            Tối thiểu: <span className="font-medium text-gray-700 dark:text-gray-200">{min_length} ký tự</span>
                        </span>
                    )}
                    {max_length !== undefined && (
                        <span className="text-gray-500 dark:text-gray-400">
                            Tối đa: <span className="font-medium text-gray-700 dark:text-gray-200">{max_length} ký tự</span>
                        </span>
                    )}
                    {min_length === undefined && max_length === undefined && format === "none" && (
                        <span className="text-gray-400 italic">Không có ràng buộc thêm</span>
                    )}
                </div>
            );
        }
        case "boolean":
            return (
                <div className="flex items-center gap-2 text-[13px]">
                    <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200 font-medium text-[12px]">Đúng</span>
                    <span className="text-gray-400">/</span>
                    <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 font-medium text-[12px]">Sai</span>
                </div>
            );
        case "array": {
            const { item_type, enum_options } = data_rule.rule;
            return (
                <div className="space-y-1.5 text-[13px]">
                    <div className="text-gray-500 dark:text-gray-400">
                        Kiểu phần tử: <span className="font-medium text-gray-700 dark:text-gray-200">
                            {item_type === "enum" ? "Enum — chọn từ danh sách" : "String — tự nhập"}
                        </span>
                    </div>
                    {item_type === "enum" && enum_options && enum_options.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {enum_options.map((opt) => (
                                <span key={opt} className="px-2 py-0.5 rounded-full text-[12px] bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-800">
                                    {opt}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        case "object":
            return <ObjectRuleView rule={data_rule.rule} />;
    }
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

interface Props {
    data_type: KdeDataType;
    data_rule: KdeDataRule;
    onChange: (rule: KdeDataRule) => void;
    embedded?: boolean;
}

export default function KdeDataRuleEditor({ data_type, data_rule, onChange, embedded = false }: Props) {
    const [expanded, setExpanded] = useState(true);

    const renderContent = () => {
        switch (data_type) {
            case "string":
                if (data_rule.type !== "string") return null;
                return (
                    <StringRuleEditor
                        rule={data_rule.rule}
                        onChange={(r) => onChange({ type: "string", rule: r })}
                    />
                );
            case "boolean":
                return <BooleanRuleEditor />;
            case "array":
                if (data_rule.type !== "array") return null;
                return (
                    <ArrayRuleEditor
                        rule={data_rule.rule}
                        onChange={(r) => onChange({ type: "array", rule: r })}
                    />
                );
            case "object":
                if (data_rule.type !== "object") return null;
                return (
                    <ObjectRuleEditor
                        rule={data_rule.rule}
                        onChange={(r) => onChange({ type: "object", rule: r })}
                        depth={0}
                    />
                );
        }
    };

    if (embedded) {
        return (
            <div className="px-5 py-3">
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="flex items-center justify-between w-full mb-0 text-left"
                >
                    <span className="text-[14px] font-semibold text-gray-700 dark:text-gray-200">Quy tắc dữ liệu</span>
                    {expanded ? (
                        <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                    )}
                </button>
                {expanded && (
                    <div className="mt-3">
                        {renderContent()}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 text-left"
            >
                <span className="text-[14px] font-semibold text-gray-700 dark:text-gray-200">Quy tắc dữ liệu</span>
                {expanded ? (
                    <ChevronDown size={16} className="text-gray-400" />
                ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                )}
            </button>
            {expanded && (
                <div className="px-5 pb-4 pt-1 border-t border-gray-50 dark:border-gray-800">
                    {renderContent()}
                </div>
            )}
        </div>
    );
}
