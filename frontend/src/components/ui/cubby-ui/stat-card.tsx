"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  unit?: string;
  delta?: {
    value: string;
    trend: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  delta,
  icon,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-[#0c1017] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.4)] transition-all hover:border-white/[0.14]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>{title}</span>
        {icon && <div className="text-slate-400 p-1.5 rounded-lg bg-white/[0.04]">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-emerald-400 font-semibold">{unit}</span>}
      </div>

      {delta && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-bold",
              delta.trend === "up" && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
              delta.trend === "down" && "bg-rose-500/15 text-rose-400 border border-rose-500/30",
              delta.trend === "neutral" && "bg-white/10 text-slate-300 border border-white/20"
            )}
          >
            {delta.trend === "up" && <TrendingUp className="w-3 h-3" />}
            {delta.trend === "down" && <TrendingDown className="w-3 h-3" />}
            {delta.value}
          </span>
          {delta.label && <span className="text-slate-400 text-[10px]">{delta.label}</span>}
        </div>
      )}
    </div>
  );
};
