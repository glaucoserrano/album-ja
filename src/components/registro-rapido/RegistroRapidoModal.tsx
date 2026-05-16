"use client";

import { X, Zap } from "lucide-react";
import { RegistroRapidoResultCard } from "./RegistroRapidoResult";
import type { RegistroRapidoResult } from "@/types/album";
import { cn } from "@/lib/utils";

interface RegistroRapidoModalProps {
  open: boolean;
  input: string;
  result: RegistroRapidoResult | null;
  onInputChange: (v: string) => void;
  onRegistrar: () => void;
  onClose: () => void;
  onClearResult: () => void;
}

export function RegistroRapidoModal({
  open,
  input,
  result,
  onInputChange,
  onRegistrar,
  onClose,
  onClearResult,
}: RegistroRapidoModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet — slides from bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-[32px] p-6 pb-10 bg-white shadow-2xl border-t border-slate-100 animate-slide-up"
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[14px] flex items-center justify-center shadow-lg shadow-blue-100"
              style={{ background: "var(--color-primary)" }}
            >
              <Zap size={18} color="white" strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight">
                Registro Rápido
              </h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Importação em Lote
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 bg-slate-50 border border-slate-100"
          >
            <X size={18} className="text-slate-400" strokeWidth={2.5} />
          </button>
        </div>

        {/* Textarea */}
        {!result && (
          <div className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={"Cole aqui seus códigos...\nEx: BRA 01 BRA 12 FWC 01 FWC 10"}
              rows={6}
              autoFocus
              className="w-full rounded-2xl p-5 text-sm font-bold bg-slate-50 border border-slate-100 outline-none transition-all duration-300 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-200 text-slate-700 resize-none"
            />

            <button
              onClick={onRegistrar}
              disabled={!input.trim()}
              className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all duration-300 active:scale-95 disabled:opacity-40 shadow-xl shadow-blue-200"
              style={{ background: "var(--color-primary)" }}
            >
              REGISTRAR FIGURINHAS
            </button>
            
            <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Suporta: BRA 01, bra1, FWC-01, etc.
            </p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4 animate-fade-in">
            <RegistroRapidoResultCard result={result} onClose={onClearResult} />
            
            <button
              onClick={onClearResult}
              className="w-full py-4 rounded-2xl font-black text-xs text-slate-400 uppercase tracking-widest transition-all active:scale-95 bg-slate-50 border border-slate-100 hover:bg-slate-100"
            >
              Registrar mais
            </button>
          </div>
        )}
      </div>
    </>
  );
}
