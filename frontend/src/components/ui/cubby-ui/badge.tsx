"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-mono text-xs font-semibold transition-colors focus:outline-none select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white/[0.08] text-slate-200 border border-white/[0.12] hover:bg-white/[0.12]",
        success:
          "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20",
        warning:
          "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20",
        danger:
          "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20",
        cyan:
          "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20",
        purple:
          "bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20",
        outline:
          "border border-white/20 text-slate-300 hover:border-white/40",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] rounded-md",
        md: "px-2.5 py-1 text-xs rounded-lg",
        lg: "px-3 py-1.5 text-xs rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  size,
  dot,
  pulse,
  children,
  ...props
}) => {
  const getDotColor = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-400";
      case "warning":
        return "bg-amber-400";
      case "danger":
        return "bg-rose-400";
      case "cyan":
        return "bg-cyan-400";
      case "purple":
        return "bg-purple-400";
      default:
        return "bg-slate-300";
    }
  };

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            getDotColor(),
            pulse && "animate-pulse"
          )}
        />
      )}
      {children}
    </div>
  );
};
