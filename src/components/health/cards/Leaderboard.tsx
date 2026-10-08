"use client";

import { Card } from "../shared/primitives";
import { ChartTitle } from "../charts/ChartCard";
import { fmt } from "@/lib/health/format";
import type { Leader } from "@/lib/health/types";

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
              <th className="h-9 pl-5 pr-2 text-left font-medium text-gray-500 w-10">
                #
              </th>
              {b.cols.map((c, i) => (
                <th
                  key={c}
                  className={`h-9 px-3 font-medium text-gray-500 whitespace-nowrap ${i ? "text-right" : "text-left"}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <td className="pl-5 pr-2 py-2.5">
                  {i < 3 ? (
                    <span
                      className="inline-flex size-6 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                      style={{ background: MEDAL[i] }}
                    >
                      {i + 1}
                    </span>
                  ) : (
                    <span className="tabular-nums text-gray-500 pl-2">
                      {i + 1}
                    </span>
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
