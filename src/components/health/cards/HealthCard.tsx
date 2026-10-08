"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Badge, CARD, Tip, Trend } from "../shared/primitives";
import GoalDialog from "./GoalDialog";
import { fmt, pct, vn } from "@/lib/health/format";
import {
  canSetGoal,
  resolveGoal,
  useGoals,
  type Goal,
} from "@/lib/health/goals";
import type { HCard } from "@/lib/health/types";

function GoalStatus({ c, g }: { c: HCard; g: Goal }) {
  const v = Number(c.v);
  if (g.type === "pct" && c.d != null) {
    const ok = pct(v, c.d) >= g.v;
    return (
      <span
        className={`text-[12px] font-medium ${ok ? "text-green-600" : "text-red-600"}`}
      >
        Mục tiêu ≥ {vn(g.v)}% · {ok ? "Đạt" : "Chưa đạt"}
      </span>
    );
  }
  const ok = v >= g.v;
  return (
    <div className="flex-1 min-w-[140px]">
      <div className="flex justify-between gap-2 text-[12px]">
        <span
          className={`font-medium ${ok ? "text-green-600" : "text-red-600"}`}
        >
          Mục tiêu {fmt(g.v)} · {ok ? "Đạt" : "Chưa đạt"}
        </span>
        <span className="text-gray-500 tabular-nums">{vn(pct(v, g.v))}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${ok ? "bg-green-600" : "bg-amber-500"}`}
          style={{ width: `${Math.min(100, pct(v, g.v))}%` }}
        />
      </div>
    </div>
  );
}

interface Props {
  c: HCard;
  /** Module chứa card – dùng để lưu mục tiêu */
  modKey: string;
  /** Id gốc của card trong module (trên Dashboard id hiển thị là D1..D8) */
  cardId?: string;
  /** Nhãn module, hiển thị trên Dashboard */
  mod?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function HealthCard({
  c,
  modKey,
  cardId = c.id,
  mod,
  selected,
  onClick,
}: Props) {
  const goals = useGoals();
  const [editing, setEditing] = useState(false);
  const base = { ...c, id: cardId };
  const goal = resolveGoal(goals, modKey, base);
  const editable = canSetGoal(c);
  const isRate = c.d != null;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") &&
          e.target === e.currentTarget &&
          (e.preventDefault(), onClick?.())
        }
        aria-pressed={!!selected}
        className={`cursor-pointer text-left p-5 transition hover:border-brand-400 ${CARD} ${selected ? "ring-2 ring-brand-500 border-brand-500" : ""}`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-gray-500 inline-flex items-center gap-1.5">
            {c.l}
            {c.f && <Tip label="Cách tính" text={c.f} />}
          </p>
          {mod && (
            <Badge className="text-gray-500 border-gray-200 dark:border-gray-700">
              {mod}
            </Badge>
          )}
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
        {(goal || editable) && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-x-3 gap-y-1">
            {goal ? (
              <GoalStatus c={c} g={goal} />
            ) : (
              <span className="text-[12px] text-gray-500">
                Chưa đặt mục tiêu
              </span>
            )}
            {editable && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
                className="ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800"
                aria-label="Cấu hình mục tiêu"
                title="Cấu hình mục tiêu"
              >
                <Settings size={14} />
              </button>
            )}
          </div>
        )}
      </div>
      {editing && (
        <GoalDialog
          c={base}
          modKey={modKey}
          current={goal}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
