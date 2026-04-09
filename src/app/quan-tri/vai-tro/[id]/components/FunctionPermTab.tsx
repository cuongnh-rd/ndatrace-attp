"use client";

import { useState } from "react";
import type { RolePerm } from "../lib/types";
import { permCols } from "../lib/types";
import { permSections } from "../lib/constants";
import { modulesByName } from "../lib/modules";

function FunctionPermTab({ roleId }: { roleId: string }) {
    const [perms, setPerms] = useState<Record<string, RolePerm>>(() =>
        Object.fromEntries(
            modulesByName.map((mod) => [
                mod.name,
                mod.roles[roleId] ?? { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false },
            ])
        )
    );

    function togglePerm(modName: string, key: keyof RolePerm) {
        setPerms((prev) => ({ ...prev, [modName]: { ...prev[modName], [key]: !prev[modName][key] } }));
    }

    function selectAllInModule(modName: string) {
        setPerms((prev) => ({ ...prev, [modName]: { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: true } }));
    }

    function deselectAllInModule(modName: string) {
        setPerms((prev) => ({ ...prev, [modName]: { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false } }));
    }

    function isAllSelected(modName: string) {
        const p = perms[modName];
        return p && p.xem && p.tao && p.sua && p.xoa && p.xuat && p.phe_duyet;
    }

    function selectAllInSection(moduleNames: string[]) {
        setPerms((prev) => {
            const next = { ...prev };
            moduleNames.forEach((name) => {
                if (next[name]) next[name] = { xem: true, tao: true, sua: true, xoa: true, xuat: true, phe_duyet: true };
            });
            return next;
        });
    }

    function deselectAllInSection(moduleNames: string[]) {
        setPerms((prev) => {
            const next = { ...prev };
            moduleNames.forEach((name) => {
                if (next[name]) next[name] = { xem: false, tao: false, sua: false, xoa: false, xuat: false, phe_duyet: false };
            });
            return next;
        });
    }

    function isSectionAllSelected(moduleNames: string[]) {
        return moduleNames.every((name) => isAllSelected(name));
    }

    return (
        <div className="space-y-4">
            {permSections.map((section) => {
                const sectionMods = section.moduleNames
                    .map((name) => modulesByName.find((m) => m.name === name))
                    .filter(Boolean) as typeof modulesByName;
                if (sectionMods.length === 0) return null;
                const allSectionSelected = isSectionAllSelected(section.moduleNames);

                return (
                    <div key={section.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {/* Section header */}
                        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{section.label}</h3>
                            <button
                                onClick={() =>
                                    allSectionSelected ? deselectAllInSection(section.moduleNames) : selectAllInSection(section.moduleNames)
                                }
                                className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${allSectionSelected
                                    ? "text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    : "text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50"
                                    }`}
                            >
                                {allSectionSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50/50 dark:bg-gray-800/30">
                                    <tr>
                                        <th className="text-left px-4 py-2.5 text-[12px] font-semibold text-gray-500 dark:text-gray-400 w-52">
                                            Chức năng
                                        </th>
                                        {permCols.map((col) => (
                                            <th key={col.key} className="text-center px-3 py-2.5 text-[12px] font-semibold text-gray-500 dark:text-gray-400 min-w-[60px]">
                                                {col.label}
                                            </th>
                                        ))}
                                        <th className="px-4 py-2.5 w-32" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sectionMods.map((mod, i) => {
                                        const p =
                                            perms[mod.name] ?? {
                                                xem: false,
                                                tao: false,
                                                sua: false,
                                                xoa: false,
                                                xuat: false,
                                                phe_duyet: false,
                                            };
                                        const allSelected = isAllSelected(mod.name);
                                        return (
                                            <tr key={mod.name} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/60 dark:bg-gray-800/20"}>
                                                <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-[13px]">{mod.name}</td>
                                                {permCols.map((col) => (
                                                    <td key={col.key} className="px-3 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={p[col.key]}
                                                            onChange={() => togglePerm(mod.name, col.key)}
                                                            className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                                                        />
                                                    </td>
                                                ))}
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => (allSelected ? deselectAllInModule(mod.name) : selectAllInModule(mod.name))}
                                                        className={`text-xs font-medium transition-colors whitespace-nowrap ${allSelected ? "text-gray-400 hover:text-gray-600" : "text-brand-600 hover:text-brand-700"
                                                            }`}
                                                    >
                                                        {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default FunctionPermTab;
