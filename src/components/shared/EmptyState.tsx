"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-10 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center mb-8 border border-slate-100/50">
        <Icon size={40} className="text-slate-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[240px]">
        {description}
      </p>
    </div>
  );
}
