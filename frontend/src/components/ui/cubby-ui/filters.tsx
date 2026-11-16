"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Filter, X, ChevronDown, Plus, Check } from "lucide-react";

export interface FilterItem {
  id: string;
  field: string;
  operator: "is" | "is not" | "greater than" | "less than";
  value: string;
}

export interface FiltersProps {
  category: string;
  setCategory: (cat: string) => void;
  status: string;
  setStatus: (st: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: string[];
  statuses: string[];
  className?: string;
}

export function SentenceFilters({
  category,
  setCategory,
  status,
  setStatus,
  sortBy,
  setSortBy,
  categories,
  statuses,
  className,
}: FiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-slot=filter-chip]")) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const hasActiveFilters = category !== "All" || status !== "All";

  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-xs", className)}>
      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] mr-1">
        <Filter className="w-3.5 h-3.5 text-emerald-400" />
        <span>where</span>
      </div>

      {/* Filter 1: Category */}
      <div className="relative" data-slot="filter-chip">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
          className={cn(
            "group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium",
            category !== "All"
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm"
              : "bg-slate-900 border-white/[0.08] text-slate-300 hover:border-slate-700"
          )}
        >
          <span className="text-slate-500 font-normal">category</span>
          <span className="font-semibold text-slate-100">{category}</span>
          {category !== "All" ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setCategory("All");
              }}
              className="p-0.5 rounded-md hover:bg-emerald-500/20 text-emerald-400"
            >
              <X className="w-3 h-3" />
            </span>
          ) : (
            <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
          )}
        </button>

        {openDropdown === "category" && (
          <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-500">
              Select Category
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setOpenDropdown(null);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                  category === cat
                    ? "bg-emerald-500/15 text-emerald-300 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <span>{cat}</span>
                {category === cat && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="text-slate-600 font-mono text-[11px]">&</span>

      {/* Filter 2: Status */}
      <div className="relative" data-slot="filter-chip">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
          className={cn(
            "group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium",
            status !== "All"
              ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-sm"
              : "bg-slate-900 border-white/[0.08] text-slate-300 hover:border-slate-700"
          )}
        >
          <span className="text-slate-500 font-normal">status is</span>
          <span className="font-semibold text-slate-100">{status}</span>
          {status !== "All" ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setStatus("All");
              }}
              className="p-0.5 rounded-md hover:bg-cyan-500/20 text-cyan-400"
            >
              <X className="w-3 h-3" />
            </span>
          ) : (
            <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
          )}
        </button>

        {openDropdown === "status" && (
          <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-500">
              Filter by Status
            </div>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatus(st);
                  setOpenDropdown(null);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                  status === st
                    ? "bg-cyan-500/15 text-cyan-300 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <span>{st}</span>
                {status === st && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="text-slate-600 font-mono text-[11px]">•</span>

      {/* Filter 3: Order By */}
      <div className="relative" data-slot="filter-chip">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-slate-900 border-white/[0.08] text-slate-300 hover:border-slate-700 transition-all text-xs font-medium"
        >
          <span className="text-slate-500 font-normal">sort by</span>
          <span className="font-semibold text-slate-100 capitalize">
            {sortBy === "progress"
              ? "% Reached"
              : sortBy === "endingSoon"
              ? "Ending Soonest"
              : sortBy === "newest"
              ? "Newest"
              : "Trending"}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
        </button>

        {openDropdown === "sort" && (
          <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            {[
              { id: "trending", label: "Trending / Featured" },
              { id: "progress", label: "% Reached (Highest)" },
              { id: "endingSoon", label: "Ending Soonest" },
              { id: "newest", label: "Recently Launched" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSortBy(s.id);
                  setOpenDropdown(null);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                  sortBy === s.id
                    ? "bg-slate-800 text-emerald-400 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <span>{s.label}</span>
                {sortBy === s.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset button if active */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            setCategory("All");
            setStatus("All");
          }}
          className="text-slate-500 hover:text-rose-400 text-[11px] underline ml-1 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
