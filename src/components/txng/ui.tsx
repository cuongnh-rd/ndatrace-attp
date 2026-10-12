"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { X, AlertTriangle, Info } from "lucide-react";

export const btn = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2 text-[13px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
export const btnP = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-brand-600 hover:bg-brand-700 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
export const btnD = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-red-200 bg-white dark:bg-gray-900 px-3.5 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors";
export const btnSm = "!px-2.5 !py-1 !text-[12px]";
export const inp = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-[14px] outline-none focus:border-brand-400 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800/60";
export const card = "bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800";
export const label = "block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

export function Tag({ children, cls = "bg-gray-50 text-gray-600 border-gray-200", title }: { children: ReactNode; cls?: string; title?: string }) {
    return (
        <span title={title} className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[12px] font-medium ${cls}`}>
            {children}
        </span>
    );
}
export const T = {
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    err: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    ok: "bg-brand-50 text-brand-700 border-brand-200",
    gs1: "bg-yellow-50 text-yellow-800 border-yellow-200",
    mute: "bg-gray-50 text-gray-500 border-gray-200",
    new: "bg-emerald-50 text-emerald-700 border-emerald-200",
    mod: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export function Banner({ kind, children, action }: { kind: "warn" | "info" | "err"; children: ReactNode; action?: ReactNode }) {
    const c = { warn: "bg-amber-50 border-amber-200 text-amber-900", info: "bg-blue-50 border-blue-200 text-blue-900", err: "bg-red-50 border-red-200 text-red-900" }[kind];
    const Icon = kind === "info" ? Info : AlertTriangle;
    return (
        <div className={`mt-3 flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13px] ${c}`}>
            <Icon size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1">{children}</div>
            {action}
        </div>
    );
}

export function Dialog({ open, onClose, title, sub, wide, children, footer }: {
    open: boolean; onClose: () => void; title: ReactNode; sub?: ReactNode; wide?: boolean; children: ReactNode; footer?: ReactNode;
}) {
    useEffect(() => {
        if (!open) return;
        const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [open, onClose]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto p-4 pt-[6vh]" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative flex max-h-[88vh] w-full flex-col rounded-2xl bg-white shadow-xl dark:bg-gray-900 ${wide ? "max-w-3xl" : "max-w-xl"}`}>
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                    <div>
                        <h2 className="text-[16px] font-semibold text-gray-900 dark:text-white">{title}</h2>
                        {sub && <div className="mt-0.5 text-[13px] text-gray-500">{sub}</div>}
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Đóng">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>
                <div className="overflow-auto px-5 py-4 text-[14px] text-gray-700 dark:text-gray-300">{children}</div>
                {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 px-5 py-3 dark:border-gray-800">{footer}</div>}
            </div>
        </div>
    );
}

export function IssueList({ items }: { items: { level: "error" | "warn"; msg: ReactNode; action?: ReactNode }[] }) {
    return (
        <ul className="flex flex-col gap-1.5">
            {items.map((x, i) => (
                <li key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 text-[13px] ${x.level === "error" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-800"}`}>
                    {x.level === "error" ? <AlertTriangle size={14} className="mt-0.5 shrink-0" /> : <Info size={14} className="mt-0.5 shrink-0" />}
                    <span className="flex-1">{x.msg}</span>
                    {x.action}
                </li>
            ))}
        </ul>
    );
}

/** Toast có nút Hoàn tác */
export function useToast() {
    const [st, set] = useState<{ msg: string; undo?: () => void } | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const show = (msg: string, undo?: () => void) => {
        set({ msg, undo });
        clearTimeout(timer.current);
        timer.current = setTimeout(() => set(null), 5000);
    };
    const node = st && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-xl bg-gray-900 px-4 py-2.5 text-[13px] text-white shadow-lg">
            <span>{st.msg}</span>
            {st.undo && (
                <button className="font-semibold text-brand-300" onClick={() => { st.undo!(); set(null); }}>
                    Hoàn tác
                </button>
            )}
        </div>
    );
    return { show, node };
}

/** Seg control nhỏ */
export function Seg<V extends string>({ value, options, onChange, disabled, xs }: {
    value: V; options: [V, string][]; onChange: (v: V) => void; disabled?: boolean; xs?: boolean;
}) {
    return (
        <div className={`inline-flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${disabled ? "opacity-60" : ""}`} role="group">
            {options.map(([v, l], i) => (
                <button key={v} type="button" disabled={disabled} onClick={() => onChange(v)}
                    className={`${xs ? "px-2 py-0.5 text-[12px]" : "px-3 py-1.5 text-[13px]"} ${i ? "border-l border-gray-200 dark:border-gray-700" : ""} ${value === v ? "bg-brand-50 font-semibold text-brand-700" : "bg-white text-gray-500 dark:bg-gray-900"} disabled:cursor-not-allowed`}>
                    {l}
                </button>
            ))}
        </div>
    );
}
