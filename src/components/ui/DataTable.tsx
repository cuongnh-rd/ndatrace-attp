"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import TableToolbar from "@/components/ui/TableToolbar";

type SortDir = "asc" | "desc" | null;

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchKeys?: (keyof T | string)[];
}

function smartCompare(a: unknown, b: unknown): number {
  const na = Number(a), nb = Number(b);
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  const da = new Date(String(a)), db = new Date(String(b));
  if (!isNaN(da.getTime()) && !isNaN(db.getTime())) return da.getTime() - db.getTime();
  return String(a ?? "").localeCompare(String(b ?? ""), "vi", { sensitivity: "base" });
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = false,
  searchKeys = [],
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const perPage = 10;

  // Auto-detect filterable columns (non-render, ≤15 unique values)
  const filterableCols = useMemo(() => {
    return columns.filter((col) => {
      if (col.render) return false; // skip rendered cols
      const key = String(col.key);
      const vals = new Set(data.map((r) => String(r[key] ?? "")));
      return vals.size >= 2 && vals.size <= 15;
    });
  }, [columns, data]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleSort = (key: string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); }
    else if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir(null); }
    setPage(1);
  };

  const setFilter = (key: string, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const clearFilters = () => { setFilters({}); setPage(1); };

  const filtered = useMemo(() => {
    let rows = data;
    // Apply search
    if (searchable && searchQuery.trim() && searchKeys.length > 0) {
      const q = searchQuery.trim().toLowerCase();
      rows = rows.filter((row) =>
        (searchKeys as string[]).some((key) =>
          String(row[key] ?? "").toLowerCase().includes(q)
        )
      );
    }
    // Apply dropdown filters
    for (const [key, val] of Object.entries(filters)) {
      if (!val) continue;
      rows = rows.filter((row) => String(row[key] ?? "") === val);
    }
    return rows;
  }, [data, filters, searchable, searchQuery, searchKeys]);

  const sorted = useMemo(() =>
    sortKey && sortDir
      ? [...filtered].sort((a, b) => {
        const cmp = smartCompare(a[sortKey], b[sortKey]);
        return sortDir === "asc" ? cmp : -cmp;
      })
      : filtered,
    [filtered, sortKey, sortDir]
  );

  const total = sorted.length;
  const pages = Math.ceil(total / perPage);
  const slice = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <TableToolbar
        searchable={searchable}
        searchQuery={searchQuery}
        onSearchChange={(v) => { setSearchQuery(v); setPage(1); }}
        filterableCols={filterableCols.map((col) => ({ key: String(col.key), label: col.label }))}
        data={data}
        filters={filters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        total={total}
      />
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
              {columns.map((col) => {
                const key = String(col.key);
                const isActive = sortKey === key;
                const isSortable = col.sortable !== false;
                return (
                  <th
                    key={key}
                    style={{ width: col.width }}
                    className={`text-left px-5 py-3 ${isSortable ? "cursor-pointer select-none" : ""}`}
                    onClick={() => isSortable && handleSort(key)}
                  >
                    <div className="flex items-center gap-1.5 group">
                      <span className={`text-[14px] font-semibold uppercase tracking-wide transition-colors ${isActive ? "text-brand-600 dark:text-brand-400" : "text-gray-500 dark:text-gray-400"
                        }`}>
                        {col.label}
                      </span>
                      {isSortable && (
                        <span className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}>
                          {!isActive || sortDir === null ? (
                            <ArrowUpDown size={12} className="text-gray-400" />
                          ) : sortDir === "asc" ? (
                            <ArrowUp size={12} className="text-brand-500" />
                          ) : (
                            <ArrowDown size={12} className="text-brand-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-5 py-3.5 text-gray-700 dark:text-gray-300">
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {slice.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-400 text-[14px]">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-[14px] text-gray-500">
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} / {total} bản ghi
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`min-w-[28px] h-7 rounded-lg text-[14px] font-medium transition-colors ${p === page ? "bg-brand-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
