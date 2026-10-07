"use client";

import { useState } from "react";
import { MODS } from "@/lib/health/data";
import type { Sev } from "@/lib/health/types";
import { Card, SEV, SEVRANK, Section, StatCard, WarnCard } from "./widgets";

const ALL = MODS.flatMap((m) => m.warns.map((w) => ({ ...w, _m: m.t, _k: m.k, _href: m.href })));
const BY_MOD = MODS.map((m) => ({ m, n: m.warns.length, crit: m.warns.filter((w) => w.sev === "critical").length }))
  .filter((x) => x.n > 0)
  .sort((a, b) => b.crit - a.crit || b.n - a.n);
const cnt = (s: Sev) => ALL.filter((w) => w.sev === s).reduce((a, w) => a + w.n, 0);
const grp = (s: Sev) => ALL.filter((w) => w.sev === s).length;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 px-3 rounded-md border text-sm font-medium transition ${
        active ? "bg-brand-600 text-white border-brand-600" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function AlertOverview() {
  const [sev, setSev] = useState<Sev | "all">("all");
  const [mod, setMod] = useState("all");
  const list = ALL.filter((w) => (sev === "all" || w.sev === sev) && (mod === "all" || w._k === mod)).sort(
    (a, b) => SEVRANK[a.sev] - SEVRANK[b.sev] || b.n - a.n
  );
  const hi = list.filter((w) => w.sev !== "medium");
  const med = list.filter((w) => w.sev === "medium");
  const empty = <p className="text-sm text-gray-500">Không có nhóm nào.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Cảnh báo</h1>
        <p className="text-sm text-gray-500 mt-1">Giám sát tuân thủ — tổng hợp mọi nhóm cảnh báo từ các module, sắp xếp theo mức độ nghiêm trọng</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Nhóm cảnh báo đang mở" value={ALL.length} d={4.8} bad={1} />
        <StatCard label="Trường hợp mức Nghiêm trọng" value={cnt("critical")} d={-8.2} bad={1} />
        <StatCard label="Trường hợp mức Cao" value={cnt("high")} d={3.1} bad={1} />
        <StatCard label="Trường hợp mức Trung bình" value={cnt("medium")} d={-2.4} bad={1} />
      </div>
      <Card className="p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 w-24">Mức độ</span>
          <Chip active={sev === "all"} onClick={() => setSev("all")}>
            Tất cả
          </Chip>
          {(["critical", "high", "medium"] as Sev[]).map((s) => (
            <Chip key={s} active={sev === s} onClick={() => setSev(s)}>
              {SEV[s]} ({grp(s)})
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 w-24">Module</span>
          <Chip active={mod === "all"} onClick={() => setMod("all")}>
            Tất cả
          </Chip>
          {BY_MOD.map(({ m, n, crit }) => (
            <Chip key={m.k} active={mod === m.k} onClick={() => setMod(m.k)}>
              {m.t} ({n}){crit ? ` · ${crit} nghiêm trọng` : ""}
            </Chip>
          ))}
        </div>
      </Card>
      {list.length ? (
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <Section tone="warn" t="Cảnh báo mức Nghiêm trọng và Cao" sub={`${hi.length} nhóm`}>
            <div className="space-y-4">{hi.length ? hi.map((w) => <WarnCard key={w._k + w.t} w={w} mod={w._m} href={w._href} limit={4} />) : empty}</div>
          </Section>
          <Section tone="muted" t="Cảnh báo mức Trung bình" sub={`${med.length} nhóm · theo dõi định kỳ`}>
            <div className="space-y-4">{med.length ? med.map((w) => <WarnCard key={w._k + w.t} w={w} mod={w._m} href={w._href} limit={4} />) : empty}</div>
          </Section>
        </div>
      ) : (
        <Card className="p-10 text-center text-gray-500 border-dashed">Không có cảnh báo nào khớp bộ lọc. Chọn “Tất cả” để xem toàn bộ.</Card>
      )}
    </div>
  );
}
