"use client";

import { useState } from "react";
import { DKEY, DMAP, LB } from "@/lib/health/dashboard";
import { MODS } from "@/lib/health/modules";
import type { Chart, HCard } from "@/lib/health/types";
import { HealthCard } from "../cards/HealthCard";
import { Leaderboard } from "../cards/Leaderboard";
import { WarnCard } from "../cards/WarnCard";
import { ChartCard } from "../charts/ChartCard";
import { DiagHead, Section } from "../shared/Section";
import { MOD_BY_KEY, SEVRANK } from "@/lib/health/format";

const ALLC: Record<string, Chart> = Object.fromEntries(
  MODS.flatMap((m) => m.charts.map((c) => [c.id, c])),
);
const CHART_MOD: Record<string, string> = Object.fromEntries(
  MODS.flatMap((m) => m.charts.map((c) => [c.id, m.t])),
);
const DCARDS: (HCard & { _m: string; _k: string; _h: string })[] = DKEY.map(
  ([k, h], i) => ({
    ...MOD_BY_KEY[k].cards.find((c) => c.id === h)!,
    id: "D" + (i + 1),
    _m: MOD_BY_KEY[k].t,
    _k: k,
    _h: h,
  }),
);

export default function DashboardOverview() {
  const [sel, setSel] = useState<string | null>(null);
  const list = DMAP.filter(([, f]) => !sel || f.includes(sel));
  const selCard = DCARDS.find((c) => c.id === sel);
  const selMod = selCard && MOD_BY_KEY[selCard._k];
  const selWarns = selMod
    ? selMod.warns
        .filter((w) => (w.for ?? []).includes(selCard._h))
        .sort((a, b) => SEVRANK[a.sev] - SEVRANK[b.sev])
    : [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DCARDS.map((c) => (
          <HealthCard
            key={c.id}
            c={c}
            modKey={c._k}
            cardId={c._h}
            mod={c._m}
            selected={sel === c.id}
            onClick={() => setSel(sel === c.id ? null : c.id)}
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <Section
          tone="blue"
          t="Phân tích chỉ số"
          sub={`${list.length}/${DMAP.length} biểu đồ · lấy từ các module`}
        >
          <DiagHead
            cards={DCARDS}
            selected={sel}
            onClear={() => setSel(null)}
          />
          <div className="space-y-4">
            {list.map(([id, f]) => (
              <ChartCard
                key={id}
                c={ALLC[id]}
                mod={CHART_MOD[id]}
                cards={DCARDS}
                forIds={f}
              />
            ))}
          </div>
        </Section>
        {selCard && selMod ? (
          <Section
            tone="warn"
            t="Cảnh báo"
            sub={`Nhóm cảnh báo cần xử lý để cải thiện “${selCard.l}”`}
          >
            <div className="space-y-4">
              {selWarns.length ? (
                selWarns.map((w) => (
                  <WarnCard key={w.t} w={w} mod={selMod.t} href={selMod.href} />
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Không có cảnh báo cần xử lý cho chỉ số này.
                </p>
              )}
            </div>
          </Section>
        ) : (
          <Section
            tone="gold"
            t="Bảng xếp hạng"
            sub="tháng 9/2026 · bấm một card để xem cảnh báo cần xử lý"
          >
            <div className="space-y-4">
              {LB.map((b) => (
                <Leaderboard key={b.t} b={b} />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
