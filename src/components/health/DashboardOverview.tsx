"use client";

import { useState } from "react";
import { DKEY, DMAP, LB, MODS } from "@/lib/health/data";
import type { Chart, HCard } from "@/lib/health/types";
import { ChartCard, DiagHead, HealthCard, Leaderboard, MOD_BY_KEY, Section } from "./widgets";

const ALLC: Record<string, Chart> = Object.fromEntries(MODS.flatMap((m) => m.charts.map((c) => [c.id, c])));
const CHART_MOD: Record<string, string> = Object.fromEntries(MODS.flatMap((m) => m.charts.map((c) => [c.id, m.t])));
const DCARDS: (HCard & { _m: string })[] = DKEY.map(([k, h], i) => ({
  ...MOD_BY_KEY[k].cards.find((c) => c.id === h)!,
  id: "D" + (i + 1),
  _m: MOD_BY_KEY[k].t,
}));

export default function DashboardOverview() {
  const [sel, setSel] = useState<string | null>(null);
  const list = DMAP.filter(([, f]) => !sel || f.includes(sel));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Health metric quan trọng nhất của toàn nền tảng, tháng 9/2026</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DCARDS.map((c) => (
          <HealthCard key={c.id} c={c} mod={c._m} selected={sel === c.id} onClick={() => setSel(sel === c.id ? null : c.id)} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <Section tone="blue" t="Diagnostic metric" sub={`${list.length}/${DMAP.length} biểu đồ · lấy từ các module`}>
          <DiagHead cards={DCARDS} selected={sel} onClear={() => setSel(null)} />
          <div className="space-y-4">
            {list.map(([id, f]) => (
              <ChartCard key={id} c={ALLC[id]} mod={CHART_MOD[id]} cards={DCARDS} forIds={f} />
            ))}
          </div>
        </Section>
        <Section tone="gold" t="Bảng xếp hạng" sub="tháng 9/2026">
          <div className="space-y-4">
            {LB.map((b) => (
              <Leaderboard key={b.t} b={b} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
