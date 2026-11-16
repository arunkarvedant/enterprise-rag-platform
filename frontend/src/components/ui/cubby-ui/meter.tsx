"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MeterProps {
  value: number; // e.g. 75 (%)
  max?: number;
  segments?: number;
  label?: string;
  showValue?: boolean;
  valueSuffix?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Meter({
  value,
  max = 100,
  segments = 24,
  label,
  showValue = true,
  valueSuffix = "%",
  className,
  size = "md",
}: MeterProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isOverFunded = value >= max;

  const heightClass = {
    sm: "h-2",
    md: "h-2.5",
    lg: "h-3.5",
  }[size];

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className="font-semibold text-slate-300 tracking-tight flex items-center gap-1.5">
              {label}
            </span>
          )}
          {showValue && (
            <span className="font-mono font-bold text-slate-100 tabular-nums">
              {Math.round(value)}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      {/* Meter Track with Cubby UI segmented notches */}
      <div
        className={cn(
          "relative w-full rounded-full bg-slate-900 border border-white/[0.08] overflow-hidden p-[1.5px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]",
          heightClass
        )}
      >
        {/* Filled Indicator */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out relative",
            isOverFunded
              ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              : percentage > 50
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-amber-500 to-emerald-500"
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Glowing head tick */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        </div>

        {/* Notched scale overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none flex justify-between px-1"
        >
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className="w-[1px] h-full bg-black/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
