"use client";

import { useState } from "react";
import { Check, Save, Users } from "lucide-react";
import type { RoleInfo } from "../lib/types";

function RoleInfoTab({ role }: { role: RoleInfo }) {
    const [ten, setTen] = useState(role.ten);
    const [moTa, setMoTa] = useState(role.mo_ta);
    const [trangThai, setTrangThai] = useState(true);
    const [saved, setSaved] = useState(false);

    function handleSave() {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <div className="space-y-5 max-w-2xl">
            {/* Card thông tin chính */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thông tin vai trò</h2>
                </div>

                <div className="px-5 py-5 space-y-5">
                    {/* Tên vai trò */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Tên vai trò <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={ten}
                            onChange={(e) => setTen(e.target.value)}
                            placeholder="Nhập tên vai trò..."
                            className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-colors"
                        />
                    </div>

                    {/* Mô tả vai trò */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Mô tả vai trò
                        </label>
                        <textarea
                            value={moTa}
                            onChange={(e) => setMoTa(e.target.value)}
                            placeholder="Nhập mô tả cho vai trò này..."
                            rows={4}
                            className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-colors resize-none"
                        />
                    </div>

                    {/* Trạng thái */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Trạng thái
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setTrangThai(!trangThai)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${trangThai ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${trangThai ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                            <span className={`text-sm font-medium ${trangThai ? "text-green-600" : "text-gray-400"}`}>
                                {trangThai ? "Hoạt động" : "Không hoạt động"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card thông tin hệ thống (read-only) */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thông tin hệ thống</h2>
                </div>
                <div className="px-5 py-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400">Mã vai trò</p>
                        <p className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">{role.id}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400">Số người dùng</p>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                            <Users size={13} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{role.so_nguoi.toLocaleString()} người</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoleInfoTab;
