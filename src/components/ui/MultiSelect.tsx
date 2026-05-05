"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (open) updateDropdownPosition();
  }, [open, updateDropdownPosition]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inContainer = containerRef.current?.contains(target);
      const dropdownEl = document.getElementById("multiselect-dropdown");
      const inDropdown = dropdownEl?.contains(target);
      if (!inContainer && !inDropdown) setOpen(false);
    }
    function handleScroll() { if (open) updateDropdownPosition(); }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, updateDropdownPosition]);

  function toggle(val: string) {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  }

  function remove(val: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  }

  const selectedLabels = options.filter((o) => value.includes(o.value));

  const dropdown = open ? (
    <div
      id="multiselect-dropdown"
      style={dropdownStyle}
      className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto"
    >
      {options.length === 0 && (
        <div className="px-3 py-2 text-[13px] text-gray-400">Không có lựa chọn</div>
      )}
      {options.map((o) => (
        <label
          key={o.value}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700"
        >
          <input
            type="checkbox"
            checked={value.includes(o.value)}
            onChange={() => toggle(o.value)}
            className="accent-brand-600 rounded"
          />
          {o.label}
        </label>
      ))}
    </div>
  ) : null;

  return (
    <div ref={containerRef}>
      <div
        ref={triggerRef}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`min-h-[36px] px-3 py-1.5 text-[14px] border border-gray-200 rounded-xl flex flex-wrap gap-1 items-center cursor-pointer bg-white transition-colors ${
          disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : "hover:border-gray-300"
        } ${open ? "border-brand-500 ring-1 ring-brand-200" : ""}`}
      >
        {selectedLabels.length === 0 && (
          <span className="text-gray-400">{placeholder}</span>
        )}
        {selectedLabels.map((o) => (
          <span
            key={o.value}
            className="flex items-center gap-1 bg-brand-50 text-brand-700 text-[12px] px-2 py-0.5 rounded-lg font-medium"
          >
            {o.label}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => remove(o.value, e)}
                className="hover:text-brand-900"
              >
                <X size={10} />
              </button>
            )}
          </span>
        ))}
        <ChevronDown
          size={14}
          className={`ml-auto text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {typeof window !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}
