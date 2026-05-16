"use client";

import { useEffect, useState, useMemo } from "react";
import { WORLD_CUP_2026 } from "@/lib/constants";
import { Trophy, Calendar, Globe } from "lucide-react";

export function InfoCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const daysLeft = useMemo(() => {
    const now = new Date();
    const diff = WORLD_CUP_2026.startDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, []);

  if (!mounted) return null;

  return (
    <div className="premium-card p-6 bg-white overflow-hidden relative group">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
      
      <div className="flex flex-col gap-5 relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <Globe size={20} className="text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 tracking-tight">
                Copa do Mundo 2026
              </h4>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                Contagem Regressiva
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
            <Trophy size={18} className="text-blue-600" />
          </div>
        </div>

        {/* Countdown Section */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">
                {daysLeft}
              </span>
              <span className="text-lg font-black text-blue-600">dias</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mt-1">
              Faltam para o apito inicial
            </p>
          </div>
          
          <div className="h-10 w-[1px] bg-slate-100" />
          
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-1.5 text-slate-800 mb-1">
              <Calendar size={14} className="text-blue-500" />
              <span className="text-xs font-black">11 de Junho</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400">
              EUA • Canadá • México
            </p>
          </div>
        </div>

        {/* Status bar */}
        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500" 
            style={{ width: '100%' }} // Fixed visual for future dynamic progress
          />
        </div>
      </div>
    </div>
  );
}
