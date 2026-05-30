"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  History, 
  ArrowLeft, 
  Trash2, 
  Calendar, 
  Clock, 
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useAlbum } from "@/hooks/useAlbum";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import type { HistoryEntry } from "@/types/album";

// Helper to format ISO date to readable local date
function getLocalDateString(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("pt-BR", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  } catch {
    return "Data desconhecida";
  }
}

// Helper to format ISO date to readable local time
function getLocalTimeString(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("pt-BR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  } catch {
    return "--:--";
  }
}

// Helper to determine date header
function getGroupHeader(dateStr: string): string {
  try {
    const today = new Date().toLocaleDateString("pt-BR", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
    
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toLocaleDateString("pt-BR", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
    
    if (dateStr === today) return "Hoje";
    if (dateStr === yesterday) return "Ontem";
    return dateStr;
  } catch {
    return dateStr;
  }
}

type DateFilter = "todos" | "hoje" | "semana";

export default function HistoricoPage() {
  const { history, revertHistoryEntry } = useAlbum();
  const [mounted, setMounted] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("todos");
  const [revertingId, setRevertingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfSevenDaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

    return history.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      
      if (dateFilter === "hoje") {
        return entryDate >= startOfToday;
      }
      if (dateFilter === "semana") {
        return entryDate >= startOfSevenDaysAgo;
      }
      return true;
    });
  }, [history, dateFilter]);

  // Group filtered history entries by local date string
  const groupedEntries = useMemo(() => {
    const groups: Record<string, HistoryEntry[]> = {};
    
    for (const entry of filteredHistory) {
      const dateStr = getLocalDateString(entry.timestamp);
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(entry);
    }
    
    // Convert to sorted array of [dateStr, entries]
    return Object.entries(groups).sort((a, b) => {
      // Sort dates in descending order (newest first)
      const dateA = new Date(a[1][0].timestamp);
      const dateB = new Date(b[1][0].timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredHistory]);

  const handleRevert = async (id: string) => {
    setRevertingId(id);
    // Add small timeout for animation to look smooth
    setTimeout(() => {
      revertHistoryEntry(id);
      setRevertingId(null);
    }, 300);
  };

  if (!mounted) return null;

  return (
    <>
      <PageHeader 
        title="Histórico" 
        subtitle="Linha do Tempo" 
        description="Acompanhe os lançamentos efetuados no álbum"
        icon={History}
        gradient
        actions={
          <Link
            href="/"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-900 transition-all hover:bg-slate-100 active:scale-90 cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </Link>
        }
      />

      <div className="px-4 space-y-4 pb-28">
        {/* Quick Date Filters */}
        <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100/50">
          {(["todos", "hoje", "semana"] as DateFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer select-none",
                dateFilter === f
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {f === "todos" ? "Todos" : f === "hoje" ? "Hoje" : "Últimos 7 dias"}
            </button>
          ))}
        </div>

        {groupedEntries.length === 0 ? (
          <EmptyState
            Icon={Calendar}
            title={dateFilter === "hoje" ? "Nenhum lançamento hoje" : dateFilter === "semana" ? "Sem lançamentos nesta semana" : "Histórico Vazio"}
            description={
              dateFilter !== "todos" 
                ? "Não encontramos lançamentos para o período selecionado."
                : "Os lançamentos de figurinhas que você fizer aparecerão aqui organizados por data."
            }
          />
        ) : (
          <div className="space-y-6">
            {groupedEntries.map(([dateStr, entries]) => (
              <div key={dateStr} className="space-y-3 animate-fade-in">
                {/* Date Header */}
                <div className="flex items-center gap-2 px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    {getGroupHeader(dateStr)}
                  </h3>
                  <span className="text-[9px] font-bold text-slate-300 ml-auto bg-slate-50 border border-slate-100/50 px-2 py-0.5 rounded-full">
                    {entries.length} registro{entries.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Entries List */}
                <div className="space-y-2.5">
                  {entries.map((entry) => {
                    const isAddition = entry.quantityChange > 0;
                    const changeLabel = isAddition 
                      ? `+${entry.quantityChange}` 
                      : `${entry.quantityChange}`;
                    
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-[20px] bg-white ring-1 ring-slate-100/50 border border-transparent hover:border-slate-100 transition-all duration-300 shadow-sm",
                          revertingId === entry.id ? "opacity-30 scale-95" : ""
                        )}
                      >
                        {/* Status Change Indicator */}
                        <div
                          className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-xl font-bold text-xs shrink-0",
                            isAddition 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          )}
                        >
                          {changeLabel}
                        </div>

                        {/* Sticker Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-mono shrink-0">
                              {entry.stickerCode}
                            </span>
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {entry.stickerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                              <Clock size={10} />
                              <span>{getLocalTimeString(entry.timestamp)}</span>
                            </div>
                            <span 
                              className={cn(
                                "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border",
                                entry.actionType === "batch"
                                  ? "bg-orange-50/50 border-orange-100 text-orange-600"
                                  : "bg-blue-50/50 border-blue-100 text-blue-600"
                              )}
                            >
                              {entry.actionType === "batch" ? "Lote" : "Manual"}
                            </span>
                          </div>
                        </div>

                        {/* Action - Delete/Undo */}
                        <button
                          onClick={() => handleRevert(entry.id)}
                          disabled={revertingId !== null}
                          className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 text-slate-400 hover:text-rose-600 transition-all active:scale-90 cursor-pointer disabled:opacity-40"
                          title="Desfazer lançamento"
                        >
                          <Trash2 size={15} strokeWidth={2.5} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
