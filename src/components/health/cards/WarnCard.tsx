"use client";

import Link from "next/link";
import { Badge, Card } from "../shared/primitives";
import { fmt, SEV } from "@/lib/health/format";
import type { Sev, Warn } from "@/lib/health/types";

const SEV_CLS: Record<Sev, string> = {
  critical:
    "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/30",
  high: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
  medium:
    "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
};

export function WarnCard({
  w,
  mod,
  href,
  limit,
}: {
  w: Warn;
  mod?: string;
  href?: string;
  limit?: number;
}) {
  const rows = w.rows.slice(0, limit ?? w.rows.length);
  return (
    <Card>
      <div className="p-5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold leading-snug text-gray-900 dark:text-white">
            {w.t}
          </h3>
          <Badge className={SEV_CLS[w.sev]}>{SEV[w.sev]}</Badge>
          {mod && (
            <Badge className="text-gray-500 border-gray-200 dark:border-gray-700">
              {mod}
            </Badge>
          )}
        </div>
        <p className="text-[12px] text-gray-500 mt-1">
          {fmt(w.n)} trường hợp cần xử lý
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 dark:border-gray-800">
              {w.cols.map((c) => (
                <th
                  key={c}
                  className="h-9 px-4 text-left font-medium text-gray-500 whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                {r.map((v, j) => (
                  <td
                    key={j}
                    className={`px-4 py-2.5 ${j ? "text-gray-500" : "text-gray-900 dark:text-gray-100"} ${typeof v === "number" ? "tabular-nums" : ""}`}
                  >
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
          <Link
            href={`${href}?tab=list`}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Xem tất cả {fmt(w.n)} trường hợp
          </Link>
        </div>
      )}
    </Card>
  );
}
