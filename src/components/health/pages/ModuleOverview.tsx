"use client";

import { useState } from "react";
import type { Mod } from "@/lib/health/types";
import { HealthCard } from "../cards/HealthCard";
import { WarnCard } from "../cards/WarnCard";
import { ChartCard } from "../charts/ChartCard";
import { DiagHead, Section } from "../shared/Section";
import { SEVRANK } from "@/lib/health/format";

/** Tab "Tổng quan" của một menu: Health metric → Diagnostic metric + Cảnh báo */
export default function ModuleOverview({ m }: { m: Mod }) {
  const [sel, setSel] = useState<string | null>(null);
  const charts = sel
    ? m.charts.filter((c) => (c.for ?? []).includes(sel))
    : m.charts;
  const warns = [...m.warns].sort((a, b) => SEVRANK[a.sev] - SEVRANK[b.sev]);
  const shownWarns = sel
    ? warns.filter((w) => (w.for ?? []).includes(sel))
    : warns;
  const selCard = m.cards.find((c) => c.id === sel);

  return (
    <div className="space-y-6">
      <section aria-label="Chỉ số sức khỏe">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {m.cards.map((c) => (
            <HealthCard
              key={c.id}
              c={c}
              modKey={m.k}
              selected={sel === c.id}
              onClick={() => setSel(sel === c.id ? null : c.id)}
            />
          ))}
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <Section
          tone="blue"
          t="Phân tích chỉ số"
          sub={`${charts.length}/${m.charts.length} biểu đồ`}
        >
          <DiagHead
            cards={m.cards}
            selected={sel}
            onClear={() => setSel(null)}
          />
          <div className="space-y-4">
            {charts.map((c) => (
              <ChartCard key={c.id} c={c} cards={m.cards} />
            ))}
          </div>
        </Section>
        <Section
          tone="warn"
          t="Cảnh báo"
          sub={
            selCard
              ? `Nhóm cảnh báo cần xử lý để cải thiện “${selCard.l}”`
              : `${warns.length} nhóm cảnh báo, sắp theo mức độ`
          }
        >
          <div className="space-y-4">
            {shownWarns.length ? (
              shownWarns.map((w) => <WarnCard key={w.t} w={w} href={m.href} />)
            ) : (
              <p className="text-sm text-gray-500">
                Không có cảnh báo cần xử lý cho chỉ số này.
              </p>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
