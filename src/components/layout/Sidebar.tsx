"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navigation, NavItem } from "@/lib/nav";
import {
  LayoutDashboard,
  BarChart2,
  BookOpen,
  Plug,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  ArrowRight,
  Building2,
  Utensils,
  Megaphone,
} from "lucide-react";

// ── Icon map ──────────────────────────────────────────────────────────────────
const sectionIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "Tổng quan": LayoutDashboard,
  "Quản lý cơ sở": Building2,
  "Quản lý ATTP": Utensils,
  "Truyền thông ATTP": Megaphone,
  "Báo cáo thống kê": BarChart2,
  "Quản trị hệ thống": ShieldCheck,
  "Danh mục hệ thống": BookOpen,
  "Tích hợp hệ thống": Plug,
};

// ── Flatten all nav items for search ─────────────────────────────────────────
interface FlatItem {
  label: string;
  href: string;
  parent: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

function flattenItems(
  items: NavItem[],
  parentLabel: string,
  icon: React.ComponentType<{ size?: number; className?: string }>
): FlatItem[] {
  return items.flatMap((item) => [
    { label: item.label, href: item.href, parent: parentLabel, icon },
    ...(item.children ? flattenItems(item.children, item.label, icon) : []),
  ]);
}

const allItems: FlatItem[] = navigation.flatMap((section) =>
  flattenItems(
    section.children ?? [],
    section.label,
    sectionIcons[section.label] ?? LayoutDashboard
  )
);

// ── Highlight ─────────────────────────────────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-brand-100 text-brand-800 rounded px-0.5 not-italic font-semibold">
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
}

// ── Sidebar Search ────────────────────────────────────────────────────────────
function SidebarSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim()
    ? allItems
        .filter(
          (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.parent.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => { setActiveIdx(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-sidebar-search]")) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((v) => Math.min(v + 1, results.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((v) => Math.max(v - 1, 0)); }
      else if (e.key === "Enter" && results[activeIdx]) {
        router.push(results[activeIdx].href);
        setQuery(""); setOpen(false); inputRef.current?.blur();
      } else if (e.key === "Escape") {
        setQuery(""); setOpen(false); inputRef.current?.blur();
      }
    },
    [results, activeIdx, router]
  );

  return (
    <div className="px-3 pb-3 relative" data-sidebar-search>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
          open
            ? "border-brand-400 bg-white dark:bg-gray-800"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300"
        }`}
      >
        <Search size={13} className={open ? "text-brand-500" : "text-gray-400"} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Tìm menu..."
          className="flex-1 bg-transparent text-[15px] text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
          {results.length > 0 ? (
            <>
              <p className="px-3 pt-2.5 pb-1 text-[15px] font-semibold text-gray-400 uppercase tracking-wider">
                {results.length} kết quả
              </p>
              <ul>
                {results.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => { setQuery(""); setOpen(false); }}
                        onMouseEnter={() => setActiveIdx(i)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 transition-colors ${
                          i === activeIdx ? "bg-brand-50 dark:bg-brand-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div
                          className={`shrink-0 size-6 rounded-lg flex items-center justify-center ${
                            i === activeIdx ? "bg-brand-100 dark:bg-brand-900/40" : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <Icon size={12} className={i === activeIdx ? "text-brand-600" : "text-gray-500"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-medium text-gray-800 dark:text-gray-200 truncate">
                            <Highlight text={item.label} query={query} />
                          </p>
                          {item.parent && (
                            <p className="text-[15px] text-gray-400 truncate">{item.parent}</p>
                          )}
                        </div>
                        <ArrowRight
                          size={11}
                          className={i === activeIdx ? "text-brand-500" : "text-gray-300"}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="px-3 py-2 text-[15px] text-gray-400 border-t border-gray-50 dark:border-gray-800">
                ↑↓ điều hướng · Enter chọn · Esc đóng
              </p>
            </>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className="text-[15px] font-medium text-gray-500">Không tìm thấy kết quả</p>
              <p className="text-[15px] text-gray-400 mt-0.5">Thử từ khóa khác</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Level-3 leaf link ─────────────────────────────────────────────────────────
function NavLeaf({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={`block pl-3 pr-2 py-1.5 rounded-lg text-[15px] transition-all ${
        active
          ? "text-brand-600 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-900/20"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      {item.label}
    </Link>
  );
}

// ── Level-2: plain link or expandable sub-group ───────────────────────────────
function NavChild({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[15px] transition-all ${
          isActive
            ? "text-brand-600 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-900/20"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        <span
          className={`size-1.5 rounded-full shrink-0 ${
            isActive ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <div
        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[15px] font-medium ${
          isActive
            ? "text-brand-600 dark:text-brand-400"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        <span
          className={`size-1.5 rounded-full shrink-0 ${
            isActive ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
        <span className="flex-1 text-left">{item.label}</span>
      </div>
      <div className="mt-0.5 ml-3.5 space-y-0.5 border-l border-gray-100 dark:border-gray-800 pl-2.5">
        {item.children.map((child) => (
          <NavLeaf key={child.href} item={child} />
        ))}
      </div>
    </div>
  );
}

// ── Level-1: section with icon ────────────────────────────────────────────────
function NavSection({ item, isOpen, onToggle }: { item: NavItem; isOpen: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    pathname.startsWith(item.href + "/") ||
    item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/")) ||
    false;
  const Icon = sectionIcons[item.label] ?? LayoutDashboard;

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
          isActive
            ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        }`}
      >
        <Icon
          size={17}
          className={
            isActive
              ? "text-brand-600 dark:text-brand-400"
              : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
          }
        />
        <span className="flex-1 text-left leading-tight">{item.label}</span>
        {isOpen
          ? <ChevronDown size={13} className="text-gray-400 shrink-0" />
          : <ChevronRight size={13} className="text-gray-400 shrink-0" />
        }
      </button>
      {isOpen && item.children && (
        <div className="mt-1 ml-8 space-y-0.5 border-l border-gray-100 dark:border-gray-800 pl-3 pb-1">
          {item.children.map((child) => (
            <NavChild key={child.href} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar shell ─────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();

  const getActiveHref = () =>
    navigation.find((item) =>
      pathname === item.href ||
      pathname.startsWith(item.href + "/") ||
      item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"))
    )?.href ?? null;

  const [openHref, setOpenHref] = useState<string | null>(getActiveHref);

  // Open the active section when pathname changes
  useEffect(() => {
    const active = getActiveHref();
    if (active) setOpenHref(active);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggle = (href: string) => {
    setOpenHref((v) => (v === href ? null : href));
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[252px] bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col z-30 transition-colors">
      {/* Logo */}
      <div className="flex items-center px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <Link href="/dashboard">
          <Image
            src="/media/logo.svg"
            alt="NDATrace"
            width={160}
            height={40}
            priority
          />
        </Link>
      </div>

      {/* Search */}
      <div className="pt-3">
        <SidebarSearch />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {navigation.map((item) => (
          <NavSection
            key={item.href}
            item={item}
            isOpen={openHref === item.href}
            onToggle={() => handleToggle(item.href)}
          />
        ))}
      </nav>

    </aside>
  );
}
