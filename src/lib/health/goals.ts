// Mục tiêu do người dùng đặt cho từng health card, lưu trên trình duyệt (localStorage).
import { useSyncExternalStore } from "react";
import type { HCard } from "./types";

export type Goal = { type: "pct" | "num"; v: number };
/** null = người dùng đã xóa mục tiêu (kể cả mục tiêu mặc định) */
type Store = Record<string, Goal | null>;

const KEY = "ndatrace-health-goals-v1";
const listeners = new Set<() => void>();
let cache: Store | null = null;
const EMPTY: Store = {};

function read(): Store {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch {
    cache = {};
  }
  return cache!;
}

function write(next: Store) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* bỏ qua khi trình duyệt chặn lưu trữ */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useGoals(): Store {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const goalKey = (modKey: string, cardId: string) =>
  `${modKey}|${cardId}`;

/** Mục tiêu hiệu lực: người dùng đặt > mặc định trong dữ liệu */
export function resolveGoal(
  store: Store,
  modKey: string,
  c: HCard,
): Goal | null {
  const key = goalKey(modKey, c.id);
  if (key in store) return store[key];
  if (c.goal) return { type: "pct", v: c.goal };
  if (c.goalN) return { type: "num", v: c.goalN };
  return null;
}

export function setGoal(modKey: string, cardId: string, goal: Goal | null) {
  write({ ...read(), [goalKey(modKey, cardId)]: goal });
}

/** Thẻ được phép đặt mục tiêu: giá trị là số và không phải chỉ số "tăng là xấu" */
export const canSetGoal = (c: HCard) => typeof c.v === "number" && !c.bad;
