"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  address?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy";
}

const GRADIENTS = [
  "from-emerald-400 to-cyan-600",
  "from-indigo-500 to-purple-600",
  "from-amber-400 to-rose-600",
  "from-teal-400 to-blue-600",
  "from-fuchsia-500 to-pink-600",
  "from-cyan-400 to-emerald-600",
];

export const Avatar: React.FC<AvatarProps> = ({
  address = "",
  name = "",
  size = "md",
  status,
  className,
  ...props
}) => {
  // Generate deterministic gradient based on address/name
  const hash = (address + name).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradient = GRADIENTS[hash % GRADIENTS.length];

  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
    xl: "w-12 h-12 text-base",
  };

  const getInitials = () => {
    if (name) {
      return name.slice(0, 2).toUpperCase();
    }
    if (address) {
      return address.slice(2, 4).toUpperCase();
    }
    return "0x";
  };

  return (
    <div className="relative inline-block shrink-0" {...props}>
      <div
        className={cn(
          "rounded-full bg-gradient-to-tr font-mono font-bold text-slate-950 flex items-center justify-center ring-2 ring-white/[0.1] shadow-inner select-none",
          gradient,
          sizeClasses[size],
          className
        )}
      >
        <span>{getInitials()}</span>
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-[#080a0e]",
            size === "sm" ? "w-1.5 h-1.5" : "w-2.5 h-2.5",
            status === "online" && "bg-emerald-400 animate-pulse",
            status === "busy" && "bg-amber-400",
            status === "offline" && "bg-slate-500"
          )}
        />
      )}
    </div>
  );
};
