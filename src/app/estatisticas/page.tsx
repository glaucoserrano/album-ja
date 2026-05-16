"use client";

import { useMemo } from "react";
import { PieChart } from "lucide-react";
import { useAlbum } from "@/hooks/useAlbum";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShareButton } from "@/components/shared/ShareButton";
import { generateShareText } from "@/lib/sticker-utils";

interface StatRowProps {
  label: string;
  value: number | string;
  color?: string;
}
function StatRow({ label, value, color = "var(--text-primary)" }: StatRowProps) {
  return (
    <div
      className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0"
    >
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className="text-sm font-black tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

export default function EstatisticasPage() {
  const { stats, collection, stickerMap, stickerState } = useAlbum();

  const pct = Math.min(100, Math.max(0, stats.percentualCompleto));

  const shareText = useMemo(
    () => generateShareText(collection.name, stickerState, stickerMap),
    [collection.name, stickerState, stickerMap]
  );

  return (
    <>
      <PageHeader 
        title="Estatísticas" 
        subtitle="Análise da Coleção" 
        description="Acompanhe seu desempenho detalhado"
        icon={PieChart}
        gradient 
      />

      <div className="px-4 space-y-4 pb-28">
        {/* Big progress card */}
        <div className="card p-6 bg-white border-blue-50">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Completado
            </span>
            <span className="text-4xl font-black text-blue-600">
              {pct.toFixed(1)}<span className="text-lg">%</span>
            </span>
          </div>
          <div className="progress-track mt-4 mb-3" style={{ height: "12px" }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] font-bold text-slate-400">
            {stats.figurinhasUnicasObtidas} de {collection.totalStickers} figurinhas oficiais
          </p>
        </div>

        {/* Detail stats */}
        <div className="card px-5 py-1 bg-white">
          <StatRow label="Únicas obtidas" value={stats.figurinhasUnicasObtidas} color="var(--color-secondary)" />
          <StatRow label="Faltando no álbum" value={stats.totalFaltantes} color="var(--color-danger)" />
          <StatRow label="Repetidas para troca" value={stats.totalRepetidas} color="var(--color-warning)" />
          <StatRow label="Total registradas" value={stats.totalObtidas} />
          <StatRow label="Capacidade total" value={collection.totalStickers} />
          <div className="flex items-center justify-between py-4">
            <span className="text-sm font-bold text-slate-500">Percentual restante</span>
            <span className="text-sm font-black tabular-nums text-rose-600">
              {(100 - pct).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            Por Categoria
          </p>
          <div className="grid gap-3">
            {collection.categories.map((cat) => {
              const catStickers = Array.from(stickerMap.values()).filter(s => s.categoryId === cat.id);
              const catOwned = catStickers.filter(s => (stickerState[s.id] ?? 0) >= 1).length;
              const catPct = catStickers.length > 0 ? (catOwned / catStickers.length) * 100 : 0;
              return (
                <div key={cat.id} className="card p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                          {cat.id.startsWith("especiais") ? "FWC" : cat.id.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-800">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs font-black tabular-nums text-slate-400">
                      {catOwned} / {catStickers.length}
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: "6px" }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${catPct}%`,
                        background: cat.color || "var(--color-primary)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Share Section */}
        <div className="card p-5 bg-blue-50 border-blue-100 shadow-none">
          <h4 className="text-sm font-black text-blue-900 mb-1">
            Compartilhar Listas
          </h4>
          <p className="text-[11px] text-blue-600 mb-4 font-medium">
            Envie sua lista de faltantes e repetidas para amigos e facilite suas trocas!
          </p>
          <ShareButton text={shareText} className="w-full justify-center h-12 rounded-xl font-black shadow-md shadow-blue-200" />
        </div>
      </div>
    </>
  );
}
