import { MODS } from "./modules";
import type { Sev } from "./types";

export const SEV: Record<Sev, string> = {
  critical: "Nghiêm trọng",
  high: "Cao",
  medium: "Trung bình",
};
export const SEVRANK: Record<Sev, number> = { critical: 0, high: 1, medium: 2 };

export const fmt = (n: string | number) =>
  typeof n === "number" ? n.toLocaleString("vi-VN") : n;
export const pct = (a: number, b: number) =>
  b ? Math.round((a / b) * 1000) / 10 : 0;
export const vn = (x: number) =>
  x.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
export const MOD_BY_KEY = Object.fromEntries(MODS.map((m) => [m.k, m]));
