"use client";

import type { ReactNode } from "react";
import { AlertTriangle, BarChart3, Trophy } from "lucide-react";
import type { HCard } from "@/lib/health/types";

function SectionHead({
  t,
  sub,
  icon,
}: {
  t: string;
  sub?: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
        {icon}
      </span>
      <div>
        <h2 className="text-base font-semibold leading-tight">{t}</h2>
        {sub && <p className="text-[12px] text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

type Tone = "blue" | "warn" | "gold" | "muted";
const TONE: Record<Tone, { box: string; head: string; icon: ReactNode }> = {
  blue: {
    box: "bg-brand-50/60 border-brand-200 dark:bg-brand-500/5 dark:border-brand-500/20",
    head: "text-brand-600",
    icon: <BarChart3 size={16} />,
  },
  warn: {
    box: "bg-amber-50/60 border-amber-200 dark:bg-amber-500/5 dark:border-amber-500/25",
    head: "text-amber-600",
    icon: <AlertTriangle size={16} />,
  },
  gold: {
    box: "bg-yellow-50/70 border-yellow-300/60 dark:bg-yellow-500/5 dark:border-yellow-500/25",
    head: "text-yellow-600",
    icon: <Trophy size={16} />,
  },
  muted: {
    box: "bg-gray-100/70 border-gray-200 dark:bg-gray-900/60 dark:border-gray-800",
    head: "text-gray-500",
    icon: <AlertTriangle size={16} />,
  },
};

export function Section({
  t,
  sub,
  tone,
  children,
}: {
  t: string;
  sub?: string;
  tone: Tone;
  children: ReactNode;
}) {
  const s = TONE[tone];
  return (
    <section
      className={`rounded-2xl border p-4 md:p-5 ${s.box}`}
      aria-label={t}
    >
      <div className={s.head}>
        <SectionHead t={t} sub={sub} icon={s.icon} />
      </div>
      {children}
    </section>
  );
}

/** Dải lọc "Đang xem phân tích cho …" phía trên danh sách biểu đồ */
export function DiagHead({
  cards,
  selected,
  onClear,
}: {
  cards: HCard[];
  selected: string | null;
  onClear: () => void;
}) {
  if (!selected)
    return (
      <p className="text-[12px] text-gray-500 mb-3">
        Bấm một card để xem phân tích và cảnh báo cần xử lý của chỉ số đó.
      </p>
    );
  const cd = cards.find((x) => x.id === selected);
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm">
      <span className="text-gray-500">Đang xem phân tích cho</span>
      <b>{cd?.l}</b>
      <button
        type="button"
        onClick={onClear}
        className="ml-auto text-brand-600 font-medium hover:underline"
      >
        Bỏ lọc
      </button>
    </div>
  );
}
