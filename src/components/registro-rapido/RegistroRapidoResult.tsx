"use client";

import { CheckCircle2, AlertTriangle, RefreshCw, X } from "lucide-react";
import type { RegistroRapidoResult } from "@/types/album";
import { cn } from "@/lib/utils";

interface RegistroRapidoResultProps {
  result: RegistroRapidoResult;
  onClose: () => void;
}

export function RegistroRapidoResultCard({ result, onClose }: RegistroRapidoResultProps) {
  return (
    <div
      className="rounded-2xl p-5 space-y-4 animate-fade-in bg-slate-50 border border-slate-100"
    >
      <div className="flex items-center justify-between">
        <p className="font-black text-xs uppercase tracking-widest text-slate-400">
          Status da Importação
        </p>
        <button onClick={onClose} className="p-1 rounded-lg opacity-40 hover:opacity-100 transition-all">
          <X size={14} className="text-slate-900" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4 bg-white border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-tighter">Processadas</span>
          </div>
          <p className="text-3xl font-black text-emerald-600 tabular-nums tracking-tighter">{result.adicionadas}</p>
        </div>

        <div className="rounded-xl p-4 bg-white border border-orange-100 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1.5">
            <RefreshCw size={14} className="text-orange-500" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase text-orange-600 tracking-tighter">Duplicatas</span>
          </div>
          <p className="text-3xl font-black text-orange-600 tabular-nums tracking-tighter">{result.jaRepetidas}</p>
        </div>
      </div>

      {result.invalidas.length > 0 && (
        <div className="rounded-xl p-4 bg-rose-50/50 border border-rose-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center">
              <AlertTriangle size={14} className="text-rose-600" strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-700">
              {result.invalidas.length} Erro{result.invalidas.length > 1 ? "s" : ""} de Identificação
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap">
            {result.invalidas.slice(0, 20).join(", ")}
            {result.invalidas.length > 20 ? ` ... (+${result.invalidas.length - 20})` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
