"use client";

import HealthChart from "./HealthChart";
import { Badge, Card, Tip } from "../shared/primitives";
import { fmt, pct, vn } from "@/lib/health/format";
import type { Chart, HCard } from "@/lib/health/types";

function Ratio({ items }: { items: [string, number, number][] }) {
  return (
    <div className="space-y-4">
      {items.map(([l, a, b]) => {
        const p = pct(a, b);
        const color =
          p >= 80 ? "bg-green-600" : p >= 60 ? "bg-amber-500" : "bg-red-500";
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
              <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${p}%` }}
              />
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
              <th className="text-left font-medium text-gray-500 px-2 py-1.5">
                Nhóm onboard
              </th>
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
                      style={{
                        background: `rgba(21,112,239,${((v[i] / 100) * 0.85).toFixed(2)})`,
                        color: v[i] > 55 ? "#fff" : undefined,
                      }}
                    >
                      {v[i]}%
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-gray-500 mt-2">
        Đọc theo cột: cùng số tháng sau onboard, nhóm mới hơn có tỉ lệ cao hơn
        là đang cải thiện.
      </p>
    </>
  );
}

export function ChartTitle({ t, f }: { t: string; f: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <h3 className="font-semibold leading-snug text-gray-900 dark:text-white">
        {t}
      </h3>
      <Tip label="Công thức" text={f} />
    </div>
  );
}

export function ChartCard({
  c,
  mod,
  cards,
  forIds,
}: {
  c: Chart;
  mod?: string;
  cards?: HCard[];
  forIds?: string[];
}) {
  const ids = forIds ?? c.for ?? [];
  const chips = cards
    ? ids.map((h) => cards.find((x) => x.id === h)).filter(Boolean)
    : [];
  return (
    <Card>
      <div className="p-5 pb-2">
        <div className="flex items-start justify-between gap-2">
          <ChartTitle t={c.t} f={c.f} />
          {mod && (
            <Badge className="text-gray-500 border-gray-200 dark:border-gray-700">
              {mod}
            </Badge>
          )}
        </div>
        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {chips.map((cd) => (
              <span
                key={cd!.id}
                className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[11px] text-gray-700 dark:text-gray-300"
              >
                {cd!.l}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="px-5 pb-5 pt-3">
        {c.type === "ratio" ? (
          <Ratio items={c.items!} />
        ) : c.type === "cohort" ? (
          <Cohort c={c} />
        ) : (
          <HealthChart c={c} />
        )}
      </div>
    </Card>
  );
}
