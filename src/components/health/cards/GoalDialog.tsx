"use client";

import { useState } from "react";
import { fmt, MOD_BY_KEY, pct, vn } from "@/lib/health/format";
import { setGoal, type Goal } from "@/lib/health/goals";
import type { HCard } from "@/lib/health/types";

const parse = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));

/** Hộp thoại cấu hình mục tiêu cho một health card */
export default function GoalDialog({
  c,
  modKey,
  current,
  onClose,
}: {
  c: HCard;
  modKey: string;
  current: Goal | null;
  onClose: () => void;
}) {
  const isRate = c.d != null;
  const v = Number(c.v);
  const [type, setType] = useState<Goal["type"]>(
    current?.type ?? (isRate ? "pct" : "num"),
  );
  const [val, setVal] = useState(
    current ? String(current.v).replace(".", ",") : "",
  );
  const [invalid, setInvalid] = useState(false);
  const nv = parse(val);
  const rate = isRate ? pct(v, c.d!) : 0;

  const preview =
    !val || isNaN(nv)
      ? "Nhập giá trị mục tiêu."
      : type === "pct"
        ? `Hiện tại ${vn(rate)}% → mục tiêu ${vn(nv)}% · ${rate >= nv ? "Đạt" : "Chưa đạt"}`
        : `Hiện tại ${fmt(v)} → mục tiêu ${fmt(nv)} · hoàn thành ${vn(pct(v, nv))}%`;

  const save = () => {
    if (!val || isNaN(nv) || nv <= 0 || (type === "pct" && nv > 100))
      return setInvalid(true);
    setGoal(modKey, c.id, { type, v: nv });
    onClose();
  };
  const clear = () => {
    setGoal(modKey, c.id, null);
    onClose();
  };

  const opt = (k: Goal["type"], l: string) => (
    <button
      type="button"
      onClick={() => {
        setType(k);
        setVal("");
        setInvalid(false);
      }}
      className={`flex-1 h-9 rounded-md text-sm font-medium ${type === k ? "bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white" : "text-gray-500"}`}
    >
      {l}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-title"
        className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-lg"
      >
        <h2
          id="goal-title"
          className="text-lg font-semibold text-gray-900 dark:text-white"
        >
          Cấu hình mục tiêu
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {c.l} · {MOD_BY_KEY[modKey]?.t}
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-sm font-medium mb-1.5">Loại mục tiêu</p>
            <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
              {isRate && opt("pct", "Tỉ lệ (%)")}
              {opt("num", "Số lượng")}
            </div>
            <p className="text-[12px] text-gray-500 mt-1.5">
              {type === "pct"
                ? "So sánh với tỉ lệ đang hiển thị trên card."
                : isRate
                  ? `So sánh với tử số (${fmt(v)}).`
                  : `So sánh với giá trị hiện tại (${fmt(v)}).`}
            </p>
          </div>
          <div>
            <label htmlFor="goal-val" className="text-sm font-medium">
              Giá trị mục tiêu {type === "pct" ? "(%)" : ""}
            </label>
            <input
              id="goal-val"
              autoFocus
              inputMode="decimal"
              value={val}
              onChange={(e) => {
                setVal(e.target.value);
                setInvalid(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && save()}
              aria-invalid={invalid}
              placeholder={type === "pct" ? "VD: 85" : "VD: 500"}
              className={`mt-1.5 h-9 w-full rounded-md border bg-white dark:bg-gray-900 px-3 text-sm outline-none focus:border-brand-400 ${invalid ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
            />
            {invalid && (
              <p className="text-[12px] text-red-600 mt-1">
                {type === "pct"
                  ? "Nhập số từ 0 đến 100."
                  : "Nhập số lớn hơn 0."}
              </p>
            )}
          </div>
          <p className="text-sm rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-2">
            {preview}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="h-9 px-3 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Xóa mục tiêu
          </button>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={save}
              className="h-9 px-4 rounded-md bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
