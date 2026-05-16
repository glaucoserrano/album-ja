"use client";

import { memo, useState, useCallback, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { StickerCard } from "./StickerCard";
import type { Sticker, StickerState } from "@/types/album";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  stickers: Sticker[];
  stickerState: StickerState;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  defaultOpen?: boolean;
}

export const CategorySection = memo(function CategorySection({
  id,
  name,
  emoji,

  color = "#0057D9",
  stickers,
  stickerState,
  onIncrement,
  onDecrement,
  defaultOpen = true,
}: CategorySectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const { owned, total } = useMemo(() => {
    const ownedCount = stickers.filter((s) => (stickerState[s.id] ?? 0) >= 1).length;
    return { owned: ownedCount, total: stickers.length };
  }, [stickers, stickerState]);

  if (stickers.length === 0) return null;

  const isComplete = owned === total && total > 0;

  return (
    <div className="mb-4 animate-fade-in">
      {/* Header */}
      <button
        onClick={toggle}
        className={cn(
          "w-full flex items-center gap-3 px-5 py-4 transition-all duration-300 premium-card",
          open ? "border-blue-100 shadow-md" : "border-slate-50 shadow-sm"
        )}
      >
        <div 
          className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0"
        >
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
            {id === "especiais-coca-cola" ? "CC" : id.startsWith("especiais") ? "FWC" : id.toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1 text-left">
          <span className="block text-sm font-black text-slate-800 tracking-tight">
            {name}
          </span>






          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${(owned / total) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-black tabular-nums text-slate-400 uppercase tracking-widest">
              {owned}/{total}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isComplete && (
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          )}
          <div className={cn("transition-transform duration-300", open && "rotate-180")}>
            <ChevronDown size={18} className="text-slate-300" strokeWidth={2.5} />
          </div>
        </div>
      </button>

      {/* Sticker list */}
      {open && (
        <div className="mt-3 space-y-3 px-1 animate-slide-up">
          {stickers.map((sticker) => (
            <StickerCard
              key={sticker.id}
              sticker={sticker}
              quantity={stickerState[sticker.id] ?? 0}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          ))}
        </div>
      )}
    </div>
  );
});
