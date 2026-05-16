"use client";

import { cn } from "@/lib/utils";
import type { AlbumFilter } from "@/types/album";

interface AlbumFilterTabsProps {
  active: AlbumFilter;
  onChange: (filter: AlbumFilter) => void;
  counts: {
    todas: number;
    faltantes: number;
    repetidas: number;
  };
}

export function AlbumFilterTabs({
  active,
  onChange,
  counts,
}: AlbumFilterTabsProps) {
  const tabs: { id: AlbumFilter; label: string; count: number }[] = [
    { id: "todas", label: "Todas", count: counts.todas },
    { id: "faltantes", label: "Faltam", count: counts.faltantes },
    { id: "repetidas", label: "Repetidas", count: counts.repetidas },
  ];

  return (
    <div className="flex p-1.5 bg-slate-50 rounded-[20px] border border-slate-100 gap-1 animate-fade-in">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all active:scale-95",
              isActive
                ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                : "text-slate-400 hover:text-slate-500"
            )}
          >
            {tab.label}
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-black",
              isActive ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
            )}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
