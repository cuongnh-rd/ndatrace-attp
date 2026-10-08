"use client";

import type { ReactNode } from "react";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { fmt, vn } from "@/lib/health/format";

export const CARD =
  "rounded-xl border border-gray-200 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${CARD} ${className}`}>{children}</div>;
}

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[12px] font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

/** Icon (i) hiện tooltip công thức khi hover/focus */
export function Tip({ label, text }: { label: string; text: string }) {
  return (
    <span
      className="group relative inline-flex text-gray-400"
      tabIndex={0}
      aria-label={label}
    >
      <Info size={14} />
      <span
        role="tooltip"
        className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 transition-opacity absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 z-50 w-[300px] max-w-[80vw] rounded-md bg-gray-900 text-white text-[12px] leading-snug font-normal px-2.5 py-2 pointer-events-none"
      >
        <b>{label}:</b> {text}
      </span>
    </span>
  );
}

export function Trend({
  d,
  bad,
  rate,
}: {
  d: number;
  bad?: number;
  rate?: boolean;
}) {
  if (d === 0)
    return (
      <span className="text-[12px] text-gray-500">
        Không đổi so với cùng kỳ tháng trước
      </span>
    );
  const good = bad ? d < 0 : d > 0;
  return (
    <span className="text-[12px]">
      <span
        className={`inline-flex items-center gap-1 font-medium ${good ? "text-green-600" : "text-red-600"}`}
      >
        {d > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {d > 0 ? "+" : "−"}
        {vn(Math.abs(d))}
        {rate ? " điểm %" : "%"}
      </span>
      <span className="text-gray-500"> so với cùng kỳ tháng trước</span>
    </span>
  );
}

export function StatCard({
  label,
  value,
  d,
  bad,
}: {
  label: string;
  value: number;
  d: number;
  bad?: number;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-gray-900 dark:text-white">
        {fmt(value)}
      </p>
      <div className="mt-1">
        <Trend d={d} bad={bad} />
      </div>
    </Card>
  );
}
