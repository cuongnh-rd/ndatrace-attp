"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

const DEFAULT_CATEGORIES = [
    "Chung",
    "Nông sản",
    "Chuỗi lạnh",
    "Thủy sản",
    "Thực phẩm chế biến",
    "Sữa và sản phẩm sữa",
    "Lúa gạo",
];

interface Props {
    current: string[];
    onSave: (selected: string[]) => void;
    onClose: () => void;
}

export default function NhomThongTinModal({ current, onSave, onClose }: Props) {
    const [allCategories, setAllCategories] = useState<string[]>(() => {
        const extras = current.filter((c) => !DEFAULT_CATEGORIES.includes(c));
        return [...DEFAULT_CATEGORIES, ...extras];
    });
    const [selected, setSelected] = useState<string[]>(current);
    const [newInput, setNewInput] = useState("");

    const toggle = (cat: string) => {
        setSelected((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const addNew = () => {
        const trimmed = newInput.trim();
        if (!trimmed || allCategories.includes(trimmed)) return;
        setAllCategories((prev) => [...prev, trimmed]);
        setSelected((prev) => [...prev, trimmed]);
        setNewInput("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">Gắn nhóm thông tin</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-3 max-h-64 overflow-y-auto">
                    {allCategories.map((cat) => (
                        <label
                            key={cat}
                            className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(cat)}
                                onChange={() => toggle(cat)}
                                className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                            />
                            <span className="text-[14px] text-gray-800 dark:text-gray-200">{cat}</span>
                        </label>
                    ))}
                </div>

                <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-2">Thêm nhóm mới</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newInput}
                            onChange={(e) => setNewInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addNew()}
                            placeholder="Nhập tên nhóm..."
                            className="flex-1 px-3 py-2 text-[14px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                        <button
                            onClick={addNew}
                            disabled={!newInput.trim() || allCategories.includes(newInput.trim())}
                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[14px] rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onSave(selected)}
                        className="px-4 py-2 text-[14px] rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors font-medium"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
