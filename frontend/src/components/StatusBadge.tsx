import type { ReactNode } from "react";

import { cn } from "../lib/utils";

type StatusBadgeProps = {
  tone: "success" | "warning" | "danger" | "neutral" | "signal";
  children: ReactNode;
};

const toneClasses: Record<StatusBadgeProps["tone"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  signal: "border-teal-200 bg-teal-50 text-teal-700",
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}
