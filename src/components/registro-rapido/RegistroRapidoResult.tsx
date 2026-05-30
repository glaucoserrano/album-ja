"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, RefreshCw, X, ChevronDown, ChevronUp } from "lucide-react";
import type { RegistroRapidoResult } from "@/types/album";
import { cn } from "@/lib/utils";

interface RegistroRapidoResultProps {
  result: RegistroRapidoResult;
  onClose: () => void;
}

export function RegistroRapidoResultCard({ result, onClose }: RegistroRapidoResultProps) {
  const [showDuplicates, setShowDuplicates] = useState(false);
  const hasDuplicates = result.repetidasDetalhes && result.repetidasDetalhes.length > 0;

  return (
    <div
      className="rounded-2xl p-5 space-y-4 animate-fade-in bg-slate-50 border border-slate-100"
    >
      <div className="flex items-center justify-between">
        <p className="font-black text-xs uppercase tracking-widest text-slate-400">
          Status da Importação
        </p>
        <button onClick={onClose} className="p-1 rounded-lg opacity-40 hover:opacity-100 transition-all cursor-pointer">
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

        <div
          onClick={() => hasDuplicates && setShowDuplicates(!showDuplicates)}
          className={cn(
            "rounded-xl p-4 bg-white border border-orange-100 shadow-sm select-none transition-all duration-200",
            hasDuplicates ? "cursor-pointer hover:border-orange-300 hover:bg-orange-50/10 active:scale-95" : ""
          )}
        >
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <RefreshCw size={14} className="text-orange-500" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase text-orange-600 tracking-tighter">Duplicatas</span>
            </div>
            {hasDuplicates && (
              <span className="text-slate-400">
                {showDuplicates ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
              </span>
            )}
          </div>
          <p className="text-3xl font-black text-orange-600 tabular-nums tracking-tighter">{result.jaRepetidas}</p>
          {hasDuplicates && !showDuplicates && (
            <p className="text-[8px] font-black uppercase text-orange-400 tracking-tighter mt-1 animate-pulse">
              Clique para ver
            </p>
          )}
        </div>
      </div>

      {showDuplicates && hasDuplicates && (
        <div className="rounded-xl p-4 bg-orange-50/20 border border-orange-100/50 animate-slide-up space-y-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-orange-700">
            Duplicatas neste lote ({result.repetidasDetalhes?.length}):
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {result.repetidasDetalhes?.map((id, index) => {
              const code = id.replace("-", " ");
              return (
                <span
                  key={`${id}-${index}`}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-white border border-orange-200 text-orange-700 shadow-sm"
                >
                  {code}
                </span>
              );
            })}
          </div>
        </div>
      )}

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
