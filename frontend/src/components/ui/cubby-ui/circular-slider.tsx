"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CircularSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
  className?: string;
}

export function CircularSlider({
  value,
  min = 0.01,
  max = 5.0,
  step = 0.05,
  onChange,
  size = 180,
  strokeWidth = 10,
  label = "Contribution Amount",
  unit = "ETH",
  className,
}: CircularSliderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Sweep angle: 260 degrees (leaving an opening at the bottom)
  const sweep = 260;
  const startAngle = 180 + (360 - sweep) / 2; // Starts at bottom-left

  // Radius & center
  const center = size / 2;
  const radius = center - strokeWidth - 8;
  const circumference = 2 * Math.PI * radius;

  // Fraction of total range
  const fraction = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const currentSweepAngle = fraction * sweep;

  // Converts angle in degrees to (x, y) coordinates
  const polarToCartesian = (angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(angleRad),
      y: center + radius * Math.sin(angleRad),
    };
  };

  // Build SVG path for track
  const describeArc = (start: number, end: number) => {
    const startPt = polarToCartesian(start);
    const endPt = polarToCartesian(end);
    const largeArc = end - start <= 180 ? 0 : 1;
    return `M ${startPt.x} ${startPt.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPt.x} ${endPt.y}`;
  };

  // Handle pointer drag
  const handlePointer = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;

    // Angle relative to 12 o'clock (clockwise)
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;

    // Relative to startAngle
    let rel = deg - startAngle;
    if (rel < 0) rel += 360;

    if (rel > sweep + (360 - sweep) / 2) {
      // In dead zone nearer to start
      rel = 0;
    } else if (rel > sweep) {
      // In dead zone nearer to max
      rel = sweep;
    }

    const newFraction = rel / sweep;
    let rawVal = min + newFraction * (max - min);
    // Snap to step
    const steps = Math.round(rawVal / step);
    let snapped = steps * step;
    snapped = Math.min(Math.max(snapped, min), max);
    // Fix floating point precision
    const decimals = step.toString().split(".")[1]?.length || 2;
    onChange(Number(snapped.toFixed(decimals)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handlePointer(e.clientX, e.clientY);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handlePointer(e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const thumbPos = polarToCartesian(startAngle + currentSweepAngle);

  // Generate tick marks
  const tickCount = 18;
  const ticks = Array.from({ length: tickCount }).map((_, i) => {
    const tickFraction = i / (tickCount - 1);
    const tickAngle = startAngle + tickFraction * sweep;
    const innerRadius = radius - 10;
    const outerRadius = radius - 5;
    const angleRad = ((tickAngle - 90) * Math.PI) / 180;
    const isLit = tickFraction <= fraction;
    return {
      x1: center + innerRadius * Math.cos(angleRad),
      y1: center + innerRadius * Math.sin(angleRad),
      x2: center + outerRadius * Math.cos(angleRad),
      y2: center + outerRadius * Math.sin(angleRad),
      isLit,
    };
  });

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        "relative flex flex-col items-center justify-center select-none touch-none cursor-pointer group",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Background Arc */}
        <path
          d={describeArc(startAngle, startAngle + sweep)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Ticks */}
        {ticks.map((t, idx) => (
          <line
            key={idx}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.isLit ? "#10b981" : "rgba(255, 255, 255, 0.15)"}
            strokeWidth={1.5}
            strokeLinecap="round"
            className="transition-colors duration-150"
          />
        ))}

        {/* Active Filled Arc */}
        {currentSweepAngle > 0 && (
          <path
            d={describeArc(startAngle, startAngle + currentSweepAngle)}
            fill="none"
            stroke="url(#dialGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}

        {/* Gradients */}
        <defs>
          <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="thumbGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Tactile Thumb Handle */}
        <g
          transform={`translate(${thumbPos.x}, ${thumbPos.y})`}
          filter="url(#thumbGlow)"
          className="transition-transform duration-75"
        >
          <circle
            r={strokeWidth * 0.85}
            fill="#ffffff"
            stroke="#10b981"
            strokeWidth={3}
            className={cn(
              "cursor-grab active:cursor-grabbing transition-transform",
              isDragging && "scale-110"
            )}
          />
          <circle r={2.5} fill="#0f172a" />
        </g>
      </svg>

      {/* Center Label & Dynamic Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-mono text-2xl font-black text-white tracking-tight">
            {value.toFixed(2)}
          </span>
          <span className="font-mono text-xs font-bold text-emerald-400">
            {unit}
          </span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono mt-0.5">
          drag dial to adjust
        </span>
      </div>
    </div>
  );
}
