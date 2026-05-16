"use client";

import { Trophy } from "lucide-react";

interface ProgressCardProps {
  percentual: number;
  figurinhasUnicas: number;
  total: number;
}

export function ProgressCard({
  percentual,
  figurinhasUnicas,
  total,
}: ProgressCardProps) {
  const pct = Math.min(100, Math.max(0, percentual));

  return (
    <div 
      className="premium-card p-7 relative overflow-hidden bg-white group"
    >
      {/* Premium accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 text-slate-400">
            Meu Álbum
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-5xl font-black tabular-nums text-slate-900 tracking-tighter">
              {pct.toFixed(1)}
            </h3>
            <span className="text-2xl font-black text-blue-600">%</span>
          </div>
        </div>
        <div 
          className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-xl shadow-blue-100 transition-transform group-hover:rotate-12 duration-500"
          style={{ background: "linear-gradient(135deg, #0057D9, #4f46e5)" }}
        >
          <Trophy size={32} color="white" strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Colecionadas</p>
            <p className="text-lg font-black text-slate-800">{figurinhasUnicas} <span className="text-sm font-bold text-slate-400">/ {total}</span></p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Faltam</p>
            <p className="text-lg font-black text-blue-600">{total - figurinhasUnicas}</p>
          </div>
        </div>
        
        <div className="progress-track-premium" style={{ height: "14px" }}>
          <div 
            className="progress-fill-premium h-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
