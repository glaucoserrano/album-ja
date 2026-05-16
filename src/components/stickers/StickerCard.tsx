"use client";

import { memo, useMemo } from "react";
import { Plus, Minus, RefreshCw, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sticker } from "@/types/album";

interface StickerCardProps {
  sticker: Sticker;
  quantity: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  className?: string;
}

export const StickerCard = memo(function StickerCard({
  sticker,
  quantity,
  onIncrement,
  onDecrement,
  className,
}: StickerCardProps) {
  const isMissing = quantity === 0;
  const isRepeated = quantity > 1;
  const isFwc = sticker.id.startsWith("FWC");

  const statusColor = useMemo(() => {
    if (isMissing) return "var(--color-danger)";
    if (isRepeated) return "var(--color-warning)";
    return "var(--color-secondary)";
  }, [isMissing, isRepeated]);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-[20px] transition-all duration-300 premium-card",
        isMissing ? "bg-white opacity-80" : "bg-white ring-1 ring-blue-50/50",
        className
      )}
    >
      {/* Code Badge (Digital Trading Card style) */}
      <div
        className={cn(
          "flex flex-col items-center justify-center w-14 h-18 rounded-[14px] font-bold text-xs shrink-0 transition-all duration-300 group-active:scale-90 shadow-sm border",
          isMissing ? "badge-missing" : isRepeated ? "badge-repeated" : isFwc ? "badge-fwc" : "badge-owned"
        )}
      >
        <span className="opacity-60 text-[8px] uppercase tracking-[0.2em] leading-none mb-1">
          {sticker.code.split(" ")[0]}
        </span>
        <span className="text-base leading-none font-black text-slate-800">
          {sticker.code.split(" ")[1]}
        </span>
        {isFwc && <Star size={10} className="mt-1.5 fill-blue-500 text-blue-500" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-black truncate text-slate-900 tracking-tight">
          {sticker.displayName}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <div 
            className="w-1.5 h-1.5 rounded-full animate-pulse" 
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: statusColor }}>
            {isMissing ? "Faltante" : isRepeated ? `${quantity}x Disponíveis` : "Obtida"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDecrement(sticker.id)}
            disabled={quantity === 0}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-80 disabled:opacity-20 bg-slate-50 border border-slate-100 hover:bg-slate-100"
          >
            <Minus size={16} className="text-slate-400" strokeWidth={3} />
          </button>
          
          <button
            onClick={() => onIncrement(sticker.id)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-80 shadow-md shadow-blue-100 premium-button"
            style={{ background: "var(--color-primary)" }}
          >
            <Plus size={16} color="white" strokeWidth={3} />
          </button>
        </div>
        <div className="text-center">
          <span className="text-[11px] font-black tabular-nums text-slate-900 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
            {quantity}
          </span>
        </div>
      </div>
    </div>
  );
});
