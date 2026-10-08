"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MODS } from "@/lib/health/modules";
import ModuleOverview from "./pages/ModuleOverview";

const BY_PATH = Object.fromEntries(MODS.map((m) => [m.href, m]));
const TABS = [
  ["ov", "Tổng quan"],
  ["list", "Danh sách chi tiết"],
] as const;
type Tab = (typeof TABS)[number][0];

/**
 * Bọc nội dung các menu có trong MODS bằng 2 tab:
 * "Tổng quan" (dashboard health metric) và "Danh sách chi tiết" (màn hiện tại của menu).
 * Mở thẳng tab danh sách bằng `?tab=list`.
 */
export default function ModuleTabs({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const m = BY_PATH[pathname];
  const fromUrl: Tab = useSearchParams().get("tab") === "list" ? "list" : "ov";
  const [picked, setTab] = useState<Tab | null>(null);
  const tab = picked ?? fromUrl;

  if (!m) return <>{children}</>;

  const select = (t: Tab) => {
    setTab(t);
    const url = new URL(window.location.href);
    if (t === "list") url.searchParams.set("tab", "list");
    else url.searchParams.delete("tab");
    window.history.replaceState(null, "", url);
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[12px] text-gray-500">{m.g}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {m.t}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{m.d}</p>
        </div>
        <div
          className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-gray-500"
          role="tablist"
        >
          {TABS.map(([k, l]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              onClick={() => select(k)}
              className={`rounded-md px-3 h-8 text-sm font-medium transition ${
                tab === k
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      {tab === "ov" ? <ModuleOverview m={m} /> : children}
    </>
  );
}
