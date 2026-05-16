"use client";

import { useEffect, useState } from "react";
import { WORLD_CUP_2026 } from "@/lib/constants";
import { Lightbulb, Info } from "lucide-react";

export function CuriosidadeCard() {
  const [mounted, setMounted] = useState(false);
  const [fact, setFact] = useState("");

  useEffect(() => {
    setMounted(true);
    const facts = WORLD_CUP_2026.facts;
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setFact(randomFact);
  }, []);

  if (!mounted) return null;

  return (
    <div className="premium-card p-6 bg-white overflow-hidden relative animate-fade-in">
      {/* Subtle background decoration */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-50 rounded-full blur-3xl opacity-60" />
      
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
              <Lightbulb size={18} className="text-amber-500" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Você sabia?</p>
              <h4 className="text-sm font-black text-slate-800 tracking-tight">Curiosidade da Copa</h4>
            </div>
          </div>
          <div className="px-2.5 py-1 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-1.5">
            <Info size={12} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Fato Real</span>
          </div>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
          <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
            "{fact}"
          </p>
        </div>

        <div className="flex items-center justify-center pt-1">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
