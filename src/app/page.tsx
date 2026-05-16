"use client";

import { useMemo, useState, useEffect } from "react";

import { CheckCircle2, AlertCircle, RefreshCw, Trophy, BookOpen, ChevronRight } from "lucide-react";


import { useAlbum } from "@/hooks/useAlbum";
import { useRegistroRapido } from "@/hooks/useRegistroRapido";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { CuriosidadeCard } from "@/components/dashboard/CuriosidadeCard";
import { FloatingActionButton } from "@/components/shared/FloatingActionButton";
import { RegistroRapidoModal } from "@/components/registro-rapido/RegistroRapidoModal";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

export default function DashboardPage() {
  const { stats, collection, registrarRapido } = useAlbum();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rr = useRegistroRapido(registrarRapido);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  if (!mounted) return null;


  return (
    <>
      <PageHeader
        title={`${greeting}, Colecionador! 🏆`}
        subtitle={APP_NAME}
        description="Sua jornada rumo ao álbum completo"
        icon={Trophy}
        gradient
      />


      <div className="px-6 space-y-6 pb-6 animate-slide-up">
        {/* Main Progress Section */}
        <Link href="/album" className="block active:scale-95 transition-transform">
          <ProgressCard
            percentual={stats.percentualCompleto}
            figurinhasUnicas={stats.figurinhasUnicasObtidas}
            total={collection.totalStickers}
          />
        </Link>

        {/* Analytics Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Visão Geral
            </p>
            <Link href="/estatisticas" className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1">
              Ver tudo <ChevronRight size={12} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <SummaryCard
              label="Obtidas"
              value={stats.figurinhasUnicasObtidas}
              Icon={CheckCircle2}
              color="green"
            />
            <SummaryCard
              label="Faltantes"
              value={stats.totalFaltantes}
              Icon={AlertCircle}
              color="red"
            />
            <Link href="/repetidas" className="block active:scale-95 transition-transform">
              <SummaryCard
                label="Repetidas"
                value={stats.totalRepetidas}
                Icon={RefreshCw}
                color="orange"
                className="h-full"
              />
            </Link>

            <SummaryCard
              label="Total"
              value={stats.totalObtidas}
              Icon={BookOpen}
              color="blue"
            />
          </div>
        </div>

        {/* Event Section (Countdown) */}
        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
            Próximo Grande Evento
          </p>
          <InfoCard />
          <CuriosidadeCard />
        </div>
      </div>

      <FloatingActionButton onClick={rr.openModal} label="Registrar" />

      <RegistroRapidoModal
        open={rr.open}
        input={rr.input}
        result={rr.result}
        onInputChange={rr.setInput}
        onRegistrar={rr.handleRegistrar}
        onClose={rr.closeModal}
        onClearResult={rr.clearResult}
      />
    </>
  );
}
