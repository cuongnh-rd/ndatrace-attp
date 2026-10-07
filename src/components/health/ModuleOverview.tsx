"use client";

import { useState } from "react";
import type { Mod } from "@/lib/health/types";
import { ChartCard, DiagHead, HealthCard, SEVRANK, Section, WarnCard } from "./widgets";

/** Tab "Tổng quan" của một menu: Health metric → Diagnostic metric + Cảnh báo */
export default function ModuleOverview({ m }: { m: Mod }) {
  const [sel, setSel] = useState<string | null>(null);
  const charts = sel ? m.charts.filter((c) => (c.for ?? []).includes(sel)) : m.charts;
  const warns = [...m.warns].sort((a, b) => SEVRANK[a.sev] - SEVRANK[b.sev]);

  return (
    <div className="space-y-6">
      <section aria-label="Health metric">
        <div className="flex items-baseline gap-2 mb-3">
          <h2 className="text-base font-semibold">Health metric</h2>
          <span className="text-[12px] text-gray-500">Hàng 1: tỉ lệ cốt lõi · Hàng 2: quy mô và rủi ro</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {m.cards.map((c) => (
            <HealthCard key={c.id} c={c} selected={sel === c.id} onClick={() => setSel(sel === c.id ? null : c.id)} />
          ))}
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <Section tone="blue" t="Diagnostic metric" sub={`${charts.length}/${m.charts.length} biểu đồ · giải thích vì sao health metric tốt hay xấu`}>
          <DiagHead cards={m.cards} selected={sel} onClear={() => setSel(null)} />
          <div className="space-y-4">
            {charts.map((c) => (
              <ChartCard key={c.id} c={c} cards={m.cards} />
            ))}
          </div>
        </Section>
        <Section tone="warn" t="Cảnh báo" sub={`${warns.length} nhóm cảnh báo, sắp theo mức độ`}>
          <div className="space-y-4">
            {warns.map((w) => (
              <WarnCard key={w.t} w={w} href={m.href} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
