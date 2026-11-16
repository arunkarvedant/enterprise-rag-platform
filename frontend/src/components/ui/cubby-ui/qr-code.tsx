"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, QrCode as QrIcon } from "lucide-react";

export interface QRCodeProps {
  value: string;
  size?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

// Lightweight deterministic SVG QR pattern generator for EVM addresses & URLs
export function QRCode({
  value,
  size = 140,
  label,
  sublabel,
  className,
}: QRCodeProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic 21x21 matrix based on value hash
  const matrix = React.useMemo(() => {
    const grid = 21;
    const arr: boolean[][] = Array.from({ length: grid }, () =>
      Array(grid).fill(false)
    );

    // 1. Draw 3 corner finder patterns (7x7)
    const drawFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            arr[startY + r][startX + c] = true;
          }
        }
      }
    };
    drawFinder(0, 0); // Top-left
    drawFinder(grid - 7, 0); // Top-right
    drawFinder(0, grid - 7); // Bottom-left

    // 2. Simple deterministic pseudorandom data filling based on char codes
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        // Skip finders
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= grid - 8) ||
          (r >= grid - 8 && c < 8)
        ) {
          continue;
        }
        // Center Ethereum logo zone (leave clear 5x5 in the middle)
        if (r >= 8 && r <= 12 && c >= 8 && c <= 12) {
          continue;
        }
        // Fill based on bit
        const bit = ((hash ^ (r * 13 + c * 37)) & 1) === 1;
        arr[r][c] = bit;
      }
    }

    return arr;
  }, [value]);

  const cellSize = size / 21;

  return (
    <div
      className={cn(
        "flex flex-col items-center p-3 rounded-2xl bg-slate-900 border border-white/[0.08] shadow-xl group",
        className
      )}
    >
      {/* SVG QR Code */}
      <div className="relative p-2.5 rounded-xl bg-white shadow-md">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rounded-lg"
        >
          {matrix.map((row, r) =>
            row.map((active, c) =>
              active ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize * 0.9}
                  height={cellSize * 0.9}
                  rx={cellSize * 0.25}
                  fill="#090d16"
                />
              ) : null
            )
          )}
        </svg>

        {/* Ethereum diamond center emblem */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-700/80 flex items-center justify-center shadow-lg">
            <svg
              className="w-4 h-4 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 19 12 12 16 5 12 12 2" fill="currentColor" fillOpacity="0.2" />
              <polygon points="12 16 19 12 12 22 5 12 12 16" fill="currentColor" fillOpacity="0.4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Copyable Address / Link */}
      <div className="mt-3 w-full flex items-center justify-between gap-2 px-2">
        <div className="overflow-hidden">
          {label && <p className="text-[11px] font-semibold text-slate-200">{label}</p>}
          <p className="text-[10px] font-mono text-slate-400 truncate">
            {sublabel || `${value.slice(0, 8)}...${value.slice(-6)}`}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
