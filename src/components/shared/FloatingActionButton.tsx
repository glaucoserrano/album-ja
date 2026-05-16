"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function FloatingActionButton({ onClick, label, className }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-28 right-7 h-16 rounded-[24px] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(0,87,217,0.4)] transition-all active:scale-95 z-30 group px-5 gap-3",
        !label && "w-16 px-0",
        className
      )}
      style={{ background: "linear-gradient(135deg, #0057D9, #4f46e5)" }}
      aria-label={label || "Registrar Figurinhas"}
    >
      <Plus size={24} className="text-white transition-transform group-hover:rotate-90 duration-300" strokeWidth={3} />
      {label && (
        <span className="text-sm font-black uppercase tracking-widest pr-1">
          {label}
        </span>
      )}
    </button>
  );
}
