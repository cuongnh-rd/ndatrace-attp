"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, BarChart3, Info, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import HealthChart from "./HealthChart";
import { MODS } from "@/lib/health/data";
import type { Chart, HCard, Leader, Sev, Warn } from "@/lib/health/types";

export const SEV: Record<Sev, string> = { critical: "Nghiêm trọng", high: "Cao", medium: "Trung bình" };
export const SEVRANK: Record<Sev, number> = { critical: 0, high: 1, medium: 2 };
const SEV_CLS: Record<Sev, string> = {
  critical: "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/30",
  high: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
  medium: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
};

export const fmt = (n: string | number) => (typeof n === "number" ? n.toLocaleString("vi-VN") : n);
export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);
export const vn = (x: number) => x.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
export const MOD_BY_KEY = Object.fromEntries(MODS.map((m) => [m.k, m]));

const CARD = "rounded-xl border border-gray-200 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${CARD} ${className}`}>{children}</div>;
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[12px] font-medium whitespace-nowrap ${className}`}>{children}</span>
  );
}

/** Icon (i) hiện tooltip công thức khi hover/focus */
export function Tip({ label, text }: { label: string; text: string }) {
  return (
    <span className="group relative inline-flex text-gray-400" tabIndex={0} aria-label={label}>
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

function Trend({ d, bad, rate }: { d: number; bad?: number; rate?: boolean }) {
  if (d === 0) return <span className="text-[12px] text-gray-500">Không đổi so với cùng kỳ tháng trước</span>;
  const good = bad ? d < 0 : d > 0;
  return (
    <span className="text-[12px]">
      <span className={`inline-flex items-center gap-1 font-medium ${good ? "text-green-600" : "text-red-600"}`}>
        {d > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {d > 0 ? "+" : "−"}
        {vn(Math.abs(d))}
        {rate ? " điểm %" : "%"}
      </span>
      <span className="text-gray-500"> so với cùng kỳ tháng trước</span>
    </span>
  );
}

export function StatCard({ label, value, d, bad }: { label: string; value: number; d: number; bad?: number }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-gray-900 dark:text-white">{fmt(value)}</p>
      <div className="mt-1">
        <Trend d={d} bad={bad} />
      </div>
    </Card>
  );
}

export function HealthCard({ c, mod, selected, onClick }: { c: HCard; mod?: string; selected?: boolean; onClick?: () => void }) {
  const isRate = c.d != null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      className={`text-left p-5 transition hover:border-brand-400 ${CARD} ${selected ? "ring-2 ring-brand-500 border-brand-500" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-gray-500 inline-flex items-center gap-1.5">
          {c.l}
          {c.f && <Tip label="Cách tính" text={c.f} />}
        </p>
        {mod && <Badge className="text-gray-500 border-gray-200 dark:border-gray-700">{mod}</Badge>}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-gray-900 dark:text-white">
        {isRate ? `${vn(pct(Number(c.v), c.d!))}%` : fmt(c.v)}
        {isRate && (
          <span className="text-sm font-normal text-gray-500">
            {" "}
            · {fmt(c.v)} / {fmt(c.d!)}
          </span>
        )}
      </p>
      <div className="mt-1">
        <Trend d={c.t} bad={c.bad} rate={isRate} />
      </div>
    </button>
  );
}

function Ratio({ items }: { items: [string, number, number][] }) {
  return (
    <div className="space-y-4">
      {items.map(([l, a, b]) => {
        const p = pct(a, b);
        const color = p >= 80 ? "bg-green-600" : p >= 60 ? "bg-amber-500" : "bg-red-500";
        return (
          <div key={l}>
            <div className="flex justify-between gap-3 text-sm mb-1.5">
              <span className="text-gray-700 dark:text-gray-300">{l}</span>
              <span className="tabular-nums whitespace-nowrap">
                <b>{fmt(a)}</b>
                <span className="text-gray-500">
                  {" "}
                  / {fmt(b)} · {vn(p)}%
                </span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${p}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Cohort({ c }: { c: Chart }) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] tabular-nums">
          <thead>
            <tr>
              <th className="text-left font-medium text-gray-500 px-2 py-1.5">Nhóm onboard</th>
              {c.cols!.map((x) => (
                <th key={x} className="font-medium text-gray-500 px-2 py-1.5">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows!.map(([l, v]) => (
              <tr key={l}>
                <td className="px-2 py-1 whitespace-nowrap">{l}</td>
                {c.cols!.map((_, i) =>
                  v[i] == null ? (
                    <td key={i} />
                  ) : (
                    <td
                      key={i}
                      className="px-2 py-1 text-center rounded"
                      style={{ background: `rgba(21,112,239,${((v[i] / 100) * 0.85).toFixed(2)})`, color: v[i] > 55 ? "#fff" : undefined }}
                    >
                      {v[i]}%
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-gray-500 mt-2">Đọc theo cột: cùng số tháng sau onboard, nhóm mới hơn có tỉ lệ cao hơn là đang cải thiện.</p>
    </>
  );
}

export function ChartTitle({ t, f }: { t: string; f: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <h3 className="font-semibold leading-snug text-gray-900 dark:text-white">{t}</h3>
      <Tip label="Công thức" text={f} />
    </div>
  );
}

export function ChartCard({ c, mod, cards, forIds }: { c: Chart; mod?: string; cards?: HCard[]; forIds?: string[] }) {
  const ids = forIds ?? c.for ?? [];
  const chips = cards ? ids.map((h) => cards.find((x) => x.id === h)).filter(Boolean) : [];
  return (
    <Card>
      <div className="p-5 pb-2">
        <div className="flex items-start justify-between gap-2">
          <ChartTitle t={c.t} f={c.f} />
          {mod && <Badge className="text-gray-500 border-gray-200 dark:border-gray-700">{mod}</Badge>}
        </div>
        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {chips.map((cd) => (
              <span key={cd!.id} className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[11px] text-gray-700 dark:text-gray-300">
                {cd!.l}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="px-5 pb-5 pt-3">
        {c.type === "ratio" ? <Ratio items={c.items!} /> : c.type === "cohort" ? <Cohort c={c} /> : <HealthChart c={c} />}
      </div>
    </Card>
  );
}

export function WarnCard({ w, mod, href, limit }: { w: Warn; mod?: string; href?: string; limit?: number }) {
  const rows = w.rows.slice(0, limit ?? w.rows.length);
  return (
    <Card>
      <div className="p-5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold leading-snug text-gray-900 dark:text-white">{w.t}</h3>
          <Badge className={SEV_CLS[w.sev]}>{SEV[w.sev]}</Badge>
          {mod && <Badge className="text-gray-500 border-gray-200 dark:border-gray-700">{mod}</Badge>}
        </div>
        <p className="text-[12px] text-gray-500 mt-1">{fmt(w.n)} trường hợp cần xử lý</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 dark:border-gray-800">
              {w.cols.map((c) => (
                <th key={c} className="h-9 px-4 text-left font-medium text-gray-500 whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                {r.map((v, j) => (
                  <td key={j} className={`px-4 py-2.5 ${j ? "text-gray-500" : "text-gray-900 dark:text-gray-100"} ${typeof v === "number" ? "tabular-nums" : ""}`}>
                    {fmt(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {href && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
          <Link href={`${href}?tab=list`} className="text-sm font-medium text-brand-600 hover:underline">
            Xem tất cả {fmt(w.n)} trường hợp
          </Link>
        </div>
      )}
    </Card>
  );
}

const MEDAL = ["#d4a017", "#9ca3af", "#b87333"];

export function Leaderboard({ b }: { b: Leader }) {
  return (
    <Card>
      <div className="p-5 pb-3">
        <ChartTitle t={b.t} f={b.f} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 dark:border-gray-800">
              <th className="h-9 pl-5 pr-2 text-left font-medium text-gray-500 w-10">#</th>
              {b.cols.map((c, i) => (
                <th key={c} className={`h-9 px-3 font-medium text-gray-500 whitespace-nowrap ${i ? "text-right" : "text-left"}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="pl-5 pr-2 py-2.5">
                  {i < 3 ? (
                    <span className="inline-flex size-6 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ background: MEDAL[i] }}>
                      {i + 1}
                    </span>
                  ) : (
                    <span className="tabular-nums text-gray-500 pl-2">{i + 1}</span>
                  )}
                </td>
                {r.map((v, j) => (
                  <td
                    key={j}
                    className={`px-3 py-2.5 ${j ? "text-right tabular-nums" : ""} ${j === r.length - 1 ? "font-semibold" : ""} ${j && j < r.length - 1 ? "text-gray-500" : ""}`}
                  >
                    {fmt(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SectionHead({ t, sub, icon }: { t: string; sub?: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">{icon}</span>
      <div>
        <h2 className="text-base font-semibold leading-tight">{t}</h2>
        {sub && <p className="text-[12px] text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

type Tone = "blue" | "warn" | "gold" | "muted";
const TONE: Record<Tone, { box: string; head: string; icon: ReactNode }> = {
  blue: { box: "bg-brand-50/60 border-brand-200 dark:bg-brand-500/5 dark:border-brand-500/20", head: "text-brand-600", icon: <BarChart3 size={16} /> },
  warn: { box: "bg-amber-50/60 border-amber-200 dark:bg-amber-500/5 dark:border-amber-500/25", head: "text-amber-600", icon: <AlertTriangle size={16} /> },
  gold: { box: "bg-yellow-50/70 border-yellow-300/60 dark:bg-yellow-500/5 dark:border-yellow-500/25", head: "text-yellow-600", icon: <Trophy size={16} /> },
  muted: { box: "bg-gray-100/70 border-gray-200 dark:bg-gray-900/60 dark:border-gray-800", head: "text-gray-500", icon: <AlertTriangle size={16} /> },
};

export function Section({ t, sub, tone, children }: { t: string; sub?: string; tone: Tone; children: ReactNode }) {
  const s = TONE[tone];
  return (
    <section className={`rounded-2xl border p-4 md:p-5 ${s.box}`} aria-label={t}>
      <div className={s.head}>
        <SectionHead t={t} sub={sub} icon={s.icon} />
      </div>
      {children}
    </section>
  );
}

/** Dải lọc "Đang xem diagnostic cho …" phía trên danh sách biểu đồ */
export function DiagHead({ cards, selected, onClear }: { cards: HCard[]; selected: string | null; onClear: () => void }) {
  if (!selected) return <p className="text-[12px] text-gray-500 mb-3">Bấm một health card để chỉ xem diagnostic giải thích cho card đó.</p>;
  const cd = cards.find((x) => x.id === selected);
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm">
      <span className="text-gray-500">Đang xem diagnostic cho</span>
      <b>{cd?.l}</b>
      <button type="button" onClick={onClear} className="ml-auto text-brand-600 font-medium hover:underline">
        Bỏ lọc
      </button>
    </div>
  );
}
