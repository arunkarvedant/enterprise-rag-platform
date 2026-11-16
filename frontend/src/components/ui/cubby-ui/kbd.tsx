"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const kbdVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-0.5 font-mono font-medium whitespace-nowrap transition-[background-color,box-shadow,translate] duration-100 ease-out data-pressed:translate-y-px data-pressed:duration-0 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        xs: "h-4 min-w-4 rounded px-1 text-[10px] [&_svg]:size-2.5",
        sm: "h-5 min-w-5 rounded px-1 text-[11px] [&_svg]:size-3",
        md: "h-5.5 min-w-5.5 rounded-md px-1.5 text-xs [&_svg]:size-3",
        lg: "h-6.5 min-w-6.5 rounded-md px-2 text-[13px] [&_svg]:size-3.5",
      },
      variant: {
        default: [
          "bg-white/[0.08] text-slate-200 border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_1px_rgba(0,0,0,0.4)]",
        ],
        emerald: [
          "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[inset_0_1px_0_rgba(16,185,129,0.2),0_1px_1px_rgba(0,0,0,0.4)]",
        ],
        outline: "bg-slate-900/80 text-slate-300 border border-slate-700/80 shadow-sm",
        ghost: "bg-transparent text-slate-400 hover:text-white",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

type Platform = "mac" | "windows";

const KEY_LEGENDS: Record<string, { mac: string; windows: string; label?: string }> = {
  mod: { mac: "⌘", windows: "Ctrl", label: "Command" },
  cmd: { mac: "⌘", windows: "Ctrl", label: "Command" },
  ctrl: { mac: "⌃", windows: "Ctrl", label: "Control" },
  alt: { mac: "⌥", windows: "Alt", label: "Option" },
  shift: { mac: "⇧", windows: "Shift", label: "Shift" },
  enter: { mac: "↵", windows: "Enter", label: "Return" },
  esc: { mac: "Esc", windows: "Esc" },
  tab: { mac: "⇥", windows: "Tab" },
  k: { mac: "K", windows: "K" },
};

export type KbdProps = React.ComponentProps<"kbd"> &
  VariantProps<typeof kbdVariants> & {
    keys?: string[];
    separator?: React.ReactNode;
  };

export function Kbd({
  className,
  size,
  variant,
  keys,
  separator = "",
  children,
  ...props
}: KbdProps) {
  const [platform, setPlatform] = React.useState<Platform>("mac");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
      setPlatform(isMac ? "mac" : "windows");
    }
  }, []);

  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ size, variant }), className)}
      {...props}
    >
      {keys
        ? keys.map((key, index) => {
            const legend = KEY_LEGENDS[key.toLowerCase()];
            const glyph = legend ? legend[platform] : key.toUpperCase();
            return (
              <React.Fragment key={`${index}-${key}`}>
                {index > 0 && separator && (
                  <span className="opacity-50 mx-0.5">{separator}</span>
                )}
                <span>{glyph}</span>
              </React.Fragment>
            );
          })
        : children}
    </kbd>
  );
}

export function KbdGroup({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs",
        className
      )}
      {...props}
    />
  );
}
