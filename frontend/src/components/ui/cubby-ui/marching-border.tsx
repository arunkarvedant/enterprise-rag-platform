"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import "./marching-border.css";

export type MarchingBorderProps = React.ComponentProps<"svg"> & {
  strokeWidth?: number;
  dash?: number;
  gap?: number;
  duration?: number;
  strokeColor?: string;
  borderRadius?: number;
  children?: React.ReactNode;
};

function buildRoundedRectPath(
  width: number,
  height: number,
  radius: number,
  inset: number
): string {
  const innerW = width - 2 * inset;
  const innerH = height - 2 * inset;
  if (innerW <= 0 || innerH <= 0) return "";
  const r = Math.min(radius, innerW / 2, innerH / 2);
  const left = inset;
  const top = inset;
  const right = inset + innerW;
  const bottom = inset + innerH;
  const f = (n: number) => Math.round(n * 100) / 100;
  return [
    `M ${f(left + innerW / 2)} ${f(top)}`,
    `L ${f(right - r)} ${f(top)}`,
    `A ${f(r)} ${f(r)} 0 0 1 ${f(right)} ${f(top + r)}`,
    `L ${f(right)} ${f(bottom - r)}`,
    `A ${f(r)} ${f(r)} 0 0 1 ${f(right - r)} ${f(bottom)}`,
    `L ${f(left + r)} ${f(bottom)}`,
    `A ${f(r)} ${f(r)} 0 0 1 ${f(left)} ${f(bottom - r)}`,
    `L ${f(left)} ${f(top + r)}`,
    `A ${f(r)} ${f(r)} 0 0 1 ${f(left + r)} ${f(top)}`,
    "Z",
  ].join(" ");
}

export function MarchingBorder({
  strokeWidth = 2,
  dash = 1,
  gap = 0.75,
  duration = 0.75,
  strokeColor,
  borderRadius,
  className,
  children,
  ...rest
}: MarchingBorderProps) {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const cycle = dash + gap;
  const pathLength = Math.max(cycle, Math.round(100 / cycle) * cycle);

  React.useLayoutEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const inset = strokeWidth / 2;

    const apply = () => {
      const { width, height } = svg.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      const detected = parseFloat(getComputedStyle(svg).borderTopLeftRadius);
      const outerRadius = borderRadius !== undefined ? borderRadius : Number.isFinite(detected) ? detected : 0;
      const pathRadius = Math.max(0, outerRadius - inset);

      path.setAttribute(
        "d",
        buildRoundedRectPath(width, height, pathRadius, inset)
      );
    };

    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [strokeWidth, borderRadius]);

  const svgElement = (
    <svg
      ref={svgRef}
      aria-hidden
      data-slot="marching-border"
      {...rest}
      className={cn(
        "pointer-events-none absolute inset-0 size-full rounded-[inherit]",
        className
      )}
      style={{
        color: strokeColor,
        borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
        ...rest.style,
      }}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${gap}`}
        strokeLinecap="round"
        pathLength={pathLength}
        className="motion-reduce:animate-none!"
        style={
          {
            "--march-offset": -cycle,
            animation: `dash-march ${duration}s linear infinite`,
          } as React.CSSProperties
        }
      />
    </svg>
  );

  if (children) {
    return (
      <div
        className="relative rounded-[inherit]"
        style={{ borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined }}
      >
        {svgElement}
        {children}
      </div>
    );
  }

  return svgElement;
}
