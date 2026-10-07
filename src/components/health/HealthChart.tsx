"use client";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Chart } from "@/lib/health/types";

export const PALETTE = ["#1570ef", "#2a9d8f", "#f08c3a", "#8b5cf6", "#e0b43c", "#9ca3af"];
export const OK = "#16a34a";
export const BAD = "#dc2626";

const AXIS = { fontSize: 12, fill: "#6b7280" };
const vn = (v: number) => v.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
const num = (v: number) => Number(v).toLocaleString("vi-VN", { notation: v >= 10000 ? "compact" : "standard" });
const TOOLTIP = {
  contentStyle: { borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, padding: "8px 10px" },
  labelStyle: { fontWeight: 600, marginBottom: 4 },
};
const LEGEND = { iconType: "square" as const, iconSize: 10, wrapperStyle: { fontSize: 12 } };

function waterfallData(c: Chart) {
  let run = 0;
  return (c.steps ?? []).map(([label, v, kind]) => {
    if (kind === "total") {
      run = v;
      return { label, range: [0, v], raw: v, color: PALETTE[0], total: true };
    }
    const from = run;
    run += v;
    return { label, range: [from, run], raw: v, color: v >= 0 ? OK : BAD, total: false };
  });
}

function Waterfall({ c }: { c: Chart }) {
  const data = waterfallData(c);
  const min = Math.min(...data.map((d) => Math.min(...d.range)));
  const max = Math.max(...data.map((d) => Math.max(...d.range)));
  return (
    <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
      <CartesianGrid vertical={false} stroke="#e5e7eb" />
      <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval={0} />
      <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={num} domain={[Math.floor(min * 0.9), Math.ceil(max * 1.02)]} />
      <Tooltip
        {...TOOLTIP}
        formatter={(_v, _n, item) => {
          const p = item.payload as { raw: number; total: boolean };
          return [`${!p.total && p.raw > 0 ? "+" : ""}${vn(p.raw)}`, "Giá trị"];
        }}
      />
      <Bar dataKey="range" radius={4} maxBarSize={46}>
        {data.map((d, i) => (
          <Cell key={i} fill={d.color} />
        ))}
      </Bar>
    </ComposedChart>
  );
}

function Round({ c }: { c: Chart }) {
  const [, values] = c.ds![0];
  const total = values.reduce((a, b) => a + b, 0);
  const data = (c.labels ?? []).map((name, i) => ({ name, value: values[i] }));
  return (
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={c.type === "doughnut" ? "58%" : 0}
        outerRadius="85%"
        stroke="#fff"
        strokeWidth={2}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
        ))}
      </Pie>
      <Tooltip {...TOOLTIP} formatter={(v) => `${vn(Number(v))} (${vn((Number(v) / total) * 100)}%)`} />
      <Legend {...LEGEND} layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12, maxWidth: "48%" }} />
    </PieChart>
  );
}

function Cartesian({ c }: { c: Chart }) {
  const horizontal = c.type === "hbar";
  const combo = c.type === "combo";
  const stack = c.type === "stack";
  const series = c.ds ?? [];
  const data = (c.labels ?? []).map((label, i) => {
    const row: Record<string, string | number> = { label };
    series.forEach(([name, vals]) => (row[name] = vals[i]));
    return row;
  });
  const barVals = series.filter((s) => s[2] !== "line").flatMap((s) => s[1]);
  const cap = c.pct && Math.max(...barVals) > 30 ? 100 : undefined;
  const pctFmt = (v: number) => `${v}%`;
  const valueFmt = c.pct ? pctFmt : num;
  const isLine = (s: (typeof series)[number]) => c.type === "line" || s[2] === "line";

  return (
    <ComposedChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: combo ? 0 : 8, left: horizontal ? 8 : -8, bottom: 0 }}>
      <CartesianGrid horizontal={!horizontal} vertical={horizontal} stroke="#e5e7eb" />
      {horizontal ? (
        <>
          <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} tickFormatter={valueFmt} domain={[0, cap ?? "auto"]} />
          <YAxis type="category" dataKey="label" tick={AXIS} axisLine={false} tickLine={false} width={150} />
        </>
      ) : (
        <>
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval={0} />
          <YAxis yAxisId="y" tick={AXIS} axisLine={false} tickLine={false} tickFormatter={valueFmt} domain={[0, cap ?? "auto"]} />
          {combo && (
            <YAxis
              yAxisId="y1"
              orientation="right"
              tick={AXIS}
              axisLine={false}
              tickLine={false}
              tickFormatter={c.y2pct ? pctFmt : num}
              domain={c.y2pct && !c.y2free ? [0, 100] : ["auto", "auto"]}
            />
          )}
        </>
      )}
      <Tooltip
        {...TOOLTIP}
        formatter={(v, name) => {
          const s = series.find((x) => x[0] === name);
          const asPct = s && (isLine(s) && combo ? c.y2pct : c.pct);
          return asPct ? `${vn(Number(v))}%` : vn(Number(v));
        }}
      />
      {series.length > 1 && <Legend {...LEGEND} />}
      {series.map((s, i) => {
        const axis = horizontal ? undefined : combo && isLine(s) ? "y1" : "y";
        return isLine(s) ? (
          <Line
            key={s[0]}
            yAxisId={axis}
            type="monotone"
            dataKey={s[0]}
            stroke={PALETTE[i]}
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "#fff", strokeWidth: 2 }}
          />
        ) : (
          <Bar
            key={s[0]}
            yAxisId={axis}
            dataKey={s[0]}
            fill={PALETTE[i]}
            stackId={stack ? "s" : undefined}
            radius={stack ? 0 : horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]}
            maxBarSize={34}
          />
        );
      })}
    </ComposedChart>
  );
}

export default function HealthChart({ c }: { c: Chart }) {
  const round = c.type === "pie" || c.type === "doughnut";
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        {c.type === "waterfall" ? <Waterfall c={c} /> : round ? <Round c={c} /> : <Cartesian c={c} />}
      </ResponsiveContainer>
    </div>
  );
}
