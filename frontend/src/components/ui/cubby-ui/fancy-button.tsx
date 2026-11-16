"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const fancyButtonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-xs font-semibold tracking-tight transition-all duration-150 outline-none select-none disabled:pointer-events-none disabled:opacity-50 shrink-0 rounded-xl active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-slate-100 border border-slate-700/80 hover:bg-slate-800/90 hover:border-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.5)] active:shadow-inner",
        primary:
          "bg-gradient-to-b from-emerald-400 to-emerald-600 text-slate-950 border border-emerald-400/50 hover:from-emerald-300 hover:to-emerald-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_8px_rgba(16,185,129,0.25)] active:shadow-inner font-bold",
        emerald:
          "bg-gradient-to-b from-emerald-400 to-emerald-600 text-slate-950 border border-emerald-400/50 hover:from-emerald-300 hover:to-emerald-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_8px_rgba(16,185,129,0.25)] active:shadow-inner font-bold",
        cyan:
          "bg-gradient-to-b from-cyan-400 to-cyan-600 text-slate-950 border border-cyan-400/50 hover:from-cyan-300 hover:to-cyan-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_8px_rgba(6,182,212,0.25)] active:shadow-inner font-bold",
        danger:
          "bg-gradient-to-b from-rose-500 to-rose-700 text-white border border-rose-500/40 hover:from-rose-400 hover:to-rose-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(244,63,94,0.25)] active:shadow-inner",
        subtle:
          "bg-slate-900/50 text-slate-300 border border-slate-800 hover:bg-slate-800/80 hover:text-white",
        ghost:
          "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]",
      },
      size: {
        xs: "h-7 px-2.5 gap-1.5 text-[11px] rounded-lg",
        sm: "h-8.5 px-3 gap-1.5 text-xs rounded-lg",
        md: "h-10 px-4 gap-2 text-xs rounded-xl",
        default: "h-10 px-4 gap-2 text-xs rounded-xl",
        lg: "h-12 px-5 gap-2.5 text-sm rounded-xl font-bold",
        icon: "size-9 p-0 rounded-xl",
        icon_sm: "size-8 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type FancyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof fancyButtonVariants> & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
  };

export function FancyButton({
  children,
  size,
  variant,
  leftIcon,
  rightIcon,
  isLoading,
  className,
  disabled,
  ...props
}: FancyButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(fancyButtonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}
