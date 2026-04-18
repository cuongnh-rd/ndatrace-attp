"use client";

import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { CheckStatus } from "@/types/report-admin";

interface CheckItemProps {
    label: string;
    value: string;
    status: CheckStatus;
}

export default function CheckItem({ label, value, status }: CheckItemProps) {
    const icon =
        status === "ok" ? (
            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
        ) : status === "warning" ? (
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
        ) : status === "danger" ? (
            <XCircle size={16} className="text-red-500 flex-shrink-0" />
        ) : (
            <AlertCircle size={16} className="text-gray-400 flex-shrink-0" />
        );

    return (
        <div className="flex items-start gap-2.5 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
            {icon}
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5 leading-tight">
                    {value}
                </p>
            </div>
        </div>
    );
}
