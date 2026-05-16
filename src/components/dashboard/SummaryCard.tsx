"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  color?: "blue" | "green" | "red" | "orange";
  className?: string;
}

export function SummaryCard({
  label,
  value,
  Icon,
  color = "blue",
  className,
}: SummaryCardProps) {
  const colorMap = {
    blue:   { bg: "bg-blue-50/50", text: "text-blue-600", icon: "text-blue-500", border: "border-blue-100/50" },
    green:  { bg: "bg-emerald-50/50", text: "text-emerald-600", icon: "text-emerald-500", border: "border-emerald-100/50" },
    red:    { bg: "bg-rose-50/50", text: "text-rose-600", icon: "text-rose-500", border: "border-rose-100/50" },
    orange: { bg: "bg-orange-50/50", text: "text-orange-600", icon: "text-orange-500", border: "border-orange-100/50" },
  };

  const c = colorMap[color];

  return (
    <div className={cn("premium-card p-6 flex flex-col gap-4 bg-white hover:border-slate-200 transition-colors", className)}>
      <div className={cn("w-12 h-12 rounded-[18px] flex items-center justify-center border", c.bg, c.border)}>
        <Icon size={24} className={c.icon} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
          {label}
        </p>
        <p className={cn("text-3xl font-black tabular-nums tracking-tight", c.text)}>
          {value}
        </p>
      </div>
    </div>
  );
}
