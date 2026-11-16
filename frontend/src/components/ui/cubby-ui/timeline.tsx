"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check, Clock, Sparkles } from "lucide-react";

export interface TimelineEntry {
  id: string | number;
  title: string;
  description: string;
  timestamp: number | string;
  cid?: string;
  status: "completed" | "current" | "pending";
}

export interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

export function Timeline({ entries, className }: TimelineProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-xs">
        No timeline milestones recorded yet.
      </div>
    );
  }

  return (
    <div className={cn("relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/[0.08]", className)}>
      {entries.map((entry, idx) => {
        const isCompleted = entry.status === "completed";
        const isCurrent = entry.status === "current";

        return (
          <div key={entry.id} className="relative group">
            {/* Step Indicator Dot */}
            <div
              className={cn(
                "absolute -left-6 top-0.5 size-5.5 rounded-full flex items-center justify-center transition-all shadow-md",
                isCompleted
                  ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20"
                  : isCurrent
                  ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/25 animate-pulse"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
              )}
            >
              {isCompleted ? (
                <Check className="w-3 h-3 stroke-[3]" />
              ) : isCurrent ? (
                <Sparkles className="w-3 h-3" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              )}
            </div>

            {/* Entry Content Card */}
            <div className="bg-slate-900/60 rounded-xl border border-white/[0.08] hover:border-slate-700 p-4 space-y-1.5 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-100 tracking-tight text-sm group-hover:text-emerald-400 transition-colors">
                  {entry.title}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {typeof entry.timestamp === "number"
                    ? new Date(entry.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : entry.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {entry.description}
              </p>

              {entry.cid && (
                <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/90">
                  <span className="text-slate-500">IPFS CID:</span>
                  <span className="truncate max-w-xs">{entry.cid}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
