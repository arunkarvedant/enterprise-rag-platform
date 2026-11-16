"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "base" | "raised" | "overlay";
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation = "base", interactive = false, children, ...props }, ref) => {
    const elevationClasses = {
      base: "bg-[#0b0f16] border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_20px_-4px_rgba(0,0,0,0.5)]",
      raised: "bg-[#101622] border-white/[0.1] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_10px_30px_-10px_rgba(0,0,0,0.7)]",
      overlay: "bg-[#151c2c] border-white/[0.14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_20px_40px_-15px_rgba(0,0,0,0.8)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border text-slate-100 transition-all duration-200",
          elevationClasses[elevation],
          interactive &&
            "hover:border-white/[0.18] hover:translate-y-[-1px] cursor-pointer active:translate-y-[0px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pb-4 flex flex-col space-y-1.5", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-base sm:text-lg font-bold tracking-tight text-white", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs sm:text-sm text-slate-400 leading-relaxed", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0 text-slate-300", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0 flex items-center border-t border-white/[0.06] mt-4 pt-4", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";
