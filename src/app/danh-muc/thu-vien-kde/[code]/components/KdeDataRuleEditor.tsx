"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import type { KdeDataType, KdeDataRule, StringRule, NumberRule, ArrayRule, ObjectRule, KdeChild } from "../../lib/types";
import { STRING_FORMAT_OPTIONS } from "../../lib/constants";

const inputClass =
    "w-full px-3 py-1.5 text-[14px] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-all";

const smallInputClass =
    "w-full px-2.5 py-1 text-[13px] border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-all";

export function defaultRule(type: KdeDataType): KdeDataRule {
    switch (type) {
        case "string":
            return { type: "string", rule: { format: "none" } };
        case "number":
            return { type: "number", rule: {} };
        case "boolean":
            return { type: "boolean", rule: null };
        case "array":
            return { type: "array", rule: { item_type: "string", string_rule: { format: "none" } } };
        case "object":
            return { type: "object", rule: { children: [] } };
    }
}

// ─── String Rule ──────────────────────────────────────────────────────────────

const FORMAT_SAMPLE: Record<StringRule["format"], string> = {
    none: "Bỏ trống nếu không yêu cầu định dạng",
    date: "VD: 2024-01-31",
    time: "VD: 14:30:00",
    datetime: "VD: 2024-01-31 14:30:00",
    email: "VD: user@example.com",
};

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

    const handleFormatChange = (format: StringRule["format"]) => {
        onChange({ ...rule, format, pattern: undefined });
    };

    return (
        <div className="space-y-2">
            <div className={grid}>
                <div>
                    <p className={labelClass}>Định dạng</p>
                    <select
                        value={rule.format}
                        onChange={(e) => handleFormatChange(e.target.value as StringRule["format"])}
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
            <div>
                <p className={labelClass}>Mẫu dữ liệu</p>
                <input
                    type="text"
                    value={rule.pattern ?? ""}
                    onChange={(e) =>
                        onChange({ ...rule, pattern: e.target.value === "" ? undefined : e.target.value })
                    }
                    placeholder={FORMAT_SAMPLE[rule.format]}
                    className={compact ? smallInputClass : inputClass}
                />
            </div>
        </div>
    );
}

// ─── Boolean Rule ─────────────────────────────────────────────────────────────

function BooleanRuleEditor({ compact = false }: { compact?: boolean }) {
    return (
        <div className={`inline-flex items-center px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[${compact ? "12" : "13"}px] text-gray-500 dark:text-gray-400`}>
            Không có cấu hình thêm
        </div>
    );
}

// ─── Number Rule ──────────────────────────────────────────────────────────────

function NumberRuleEditor({
    rule,
    onChange,
    compact = false,
}: {
    rule: NumberRule;
    onChange: (r: NumberRule) => void;
    compact?: boolean;
}) {
    const labelClass = `text-[${compact ? "12px" : "13px"}] text-gray-500 dark:text-gray-400 mb-1`;
    const grid = compact ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-3";

    return (
        <div className={grid}>
            <div>
                <p className={labelClass}>Giá trị tối thiểu</p>
                <input
                    type="number"
                    value={rule.min ?? ""}
                    onChange={(e) =>
                        onChange({ ...rule, min: e.target.value === "" ? undefined : Number(e.target.value) })
                    }
                    placeholder="Không giới hạn"
                    className={compact ? smallInputClass : inputClass}
                />
            </div>
            <div>
                <p className={labelClass}>Giá trị tối đa</p>
                <input
                    type="number"
                    value={rule.max ?? ""}
                    onChange={(e) =>
                        onChange({ ...rule, max: e.target.value === "" ? undefined : Number(e.target.value) })
                    }
                    placeholder="Không giới hạn"
                    className={compact ? smallInputClass : inputClass}
                />
            </div>
        </div>
    );
}

// ─── Array Rule ───────────────────────────────────────────────────────────────

const ARRAY_ITEM_TYPE_OPTIONS: { value: ArrayRule["item_type"]; label: string }[] = [
    { value: "string", label: "String" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "object", label: "Object" },
];

function ArrayRuleEditor({
    rule,
    onChange,
    compact = false,
    depth = 0,
}: {
    rule: ArrayRule;
    onChange: (r: ArrayRule) => void;
    compact?: boolean;
    depth?: number;
}) {
    const handleItemTypeChange = (item_type: ArrayRule["item_type"]) => {
        const base: ArrayRule = { item_type };
        if (item_type === "string") base.string_rule = { format: "none" };
        if (item_type === "object") base.object_rule = { children: [] };
        onChange(base);
    };

    return (
        <div className="space-y-3">
            <div>
                <p className={`text-[${compact ? "12" : "13"}px] text-gray-500 dark:text-gray-400 mb-1`}>Kiểu phần tử</p>
                <select
                    value={rule.item_type}
                    onChange={(e) => handleItemTypeChange(e.target.value as ArrayRule["item_type"])}
                    className={compact ? smallInputClass : inputClass}
                >
                    {ARRAY_ITEM_TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {rule.item_type === "string" && (
                <StringRuleEditor
                    rule={rule.string_rule ?? { format: "none" }}
                    onChange={(r) => onChange({ ...rule, string_rule: r })}
                    compact={compact}
                />
            )}
            {rule.item_type === "number" && (
                <NumberRuleEditor
                    rule={rule.number_rule ?? {}}
                    onChange={(r) => onChange({ ...rule, number_rule: r })}
                    compact={compact}
                />
            )}
            {rule.item_type === "boolean" && <BooleanRuleEditor compact={compact} />}
            {rule.item_type === "object" && (
                <ObjectRuleEditor
                    rule={rule.object_rule ?? { children: [] }}
                    onChange={(r) => onChange({ ...rule, object_rule: r })}
                    compact={compact}
                    depth={depth + 1}
                />
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
            required: true,
            string_rule: { format: "none" },
        }
    );
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(true);

    const setField = <K extends keyof KdeChild>(key: K, value: KdeChild[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleTypeChange = (dt: KdeDataType) => {
        setForm((prev) => ({
            ...prev,
            data_type: dt,
            string_rule: dt === "string" ? { format: "none" } : undefined,
            number_rule: dt === "number" ? {} : undefined,
            array_rule: dt === "array" ? { item_type: "string", string_rule: { format: "none" } } : undefined,
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
        <div className={panelClass}>
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left"
            >
                <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">
                    {initialValues ? "Sửa trường con" : "Thêm trường con"}
                </span>
                {expanded
                    ? <ChevronDown size={14} className="text-gray-400" />
                    : <ChevronRight size={14} className="text-gray-400" />
                }
            </button>

            {expanded && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-200/60 dark:border-gray-700/60 space-y-3">
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
                                <option value="number">number</option>
                                <option value="boolean">boolean</option>
                                <option value="array">array</option>
                                {depth < 2 && <option value="object">object</option>}
                            </select>
                        </div>
                        <div>
                            <label className="text-[12px] text-gray-500 dark:text-gray-400 mb-1 block">&nbsp;</label>
                            <label className="flex items-center gap-2 cursor-pointer pt-1.5">
                                <input
                                    type="checkbox"
                                    checked={form.required}
                                    onChange={(e) => setField("required", e.target.checked)}
                                    className="accent-brand-500 w-4 h-4"
                                />
                                <span className="text-[12px] text-gray-700 dark:text-gray-300">Bắt buộc</span>
                            </label>
                        </div>
                    </div>

                    {form.data_type === "string" && form.string_rule && (
                        <div>
                            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Quy tắc String</p>
                            <StringRuleEditor rule={form.string_rule} onChange={(r) => setField("string_rule", r)} compact />
                        </div>
                    )}

                    {form.data_type === "number" && (
                        <div>
                            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Quy tắc Number</p>
                            <NumberRuleEditor rule={form.number_rule ?? {}} onChange={(r) => setField("number_rule", r)} compact />
                        </div>
                    )}

                    {form.data_type === "array" && form.array_rule && (
                        <div>
                            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">Quy tắc Array</p>
                            <ArrayRuleEditor rule={form.array_rule} onChange={(r) => setField("array_rule", r)} compact depth={depth} />
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
            )}
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

function StringRuleView({ rule }: { rule: StringRule }) {
    const { format, min_length, max_length, pattern } = rule;
    const formatLabel = STRING_FORMAT_OPTIONS.find((o) => o.value === format)?.label ?? format;
    return (
        <div className="flex flex-wrap gap-3 text-[13px]">
            <span className="text-gray-500 dark:text-gray-400">
                Định dạng: <span className="font-medium text-gray-700 dark:text-gray-200">{formatLabel}</span>
            </span>
            {format === "none" && pattern && (
                <span className="text-gray-500 dark:text-gray-400">
                    Mẫu: <span className="font-medium text-gray-700 dark:text-gray-200 font-mono">{pattern}</span>
                </span>
            )}
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
            {min_length === undefined && max_length === undefined && format === "none" && !pattern && (
                <span className="text-gray-400 italic">Không có ràng buộc thêm</span>
            )}
        </div>
    );
}

export function DataRuleView({ data_rule }: { data_rule: KdeDataRule }) {
    switch (data_rule.type) {
        case "string":
            return <StringRuleView rule={data_rule.rule} />;
        case "number": {
            const { min, max } = data_rule.rule;
            if (min === undefined && max === undefined) {
                return <span className="text-gray-400 italic text-[13px]">Không có ràng buộc thêm</span>;
            }
            return (
                <div className="flex flex-wrap gap-3 text-[13px]">
                    {min !== undefined && (
                        <span className="text-gray-500 dark:text-gray-400">
                            Tối thiểu: <span className="font-medium text-gray-700 dark:text-gray-200">{min}</span>
                        </span>
                    )}
                    {max !== undefined && (
                        <span className="text-gray-500 dark:text-gray-400">
                            Tối đa: <span className="font-medium text-gray-700 dark:text-gray-200">{max}</span>
                        </span>
                    )}
                </div>
            );
        }
        case "boolean":
            return (
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[13px] text-gray-500 dark:text-gray-400">
                    Không có cấu hình thêm
                </span>
            );
        case "array": {
            const { item_type, string_rule, number_rule, object_rule } = data_rule.rule;
            const itemTypeLabel = ARRAY_ITEM_TYPE_OPTIONS.find((o) => o.value === item_type)?.label ?? item_type;
            return (
                <div className="space-y-1.5 text-[13px]">
                    <div className="text-gray-500 dark:text-gray-400">
                        Kiểu phần tử: <span className="font-medium text-gray-700 dark:text-gray-200">{itemTypeLabel}</span>
                    </div>
                    {item_type === "string" && string_rule && <StringRuleView rule={string_rule} />}
                    {item_type === "number" && number_rule && (number_rule.min !== undefined || number_rule.max !== undefined) && (
                        <div className="flex flex-wrap gap-3">
                            {number_rule.min !== undefined && (
                                <span className="text-gray-500 dark:text-gray-400">
                                    Tối thiểu: <span className="font-medium text-gray-700 dark:text-gray-200">{number_rule.min}</span>
                                </span>
                            )}
                            {number_rule.max !== undefined && (
                                <span className="text-gray-500 dark:text-gray-400">
                                    Tối đa: <span className="font-medium text-gray-700 dark:text-gray-200">{number_rule.max}</span>
                                </span>
                            )}
                        </div>
                    )}
                    {item_type === "object" && object_rule && <ObjectRuleView rule={object_rule} />}
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
            case "number":
                if (data_rule.type !== "number") return null;
                return (
                    <NumberRuleEditor
                        rule={data_rule.rule}
                        onChange={(r) => onChange({ type: "number", rule: r })}
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
