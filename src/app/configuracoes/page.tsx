"use client";

import { useRef, useState, useCallback } from "react";
import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlbum } from "@/hooks/useAlbum";
import { PageHeader } from "@/components/layout/PageHeader";
import { APP_NAME, APP_VERSION } from "@/lib/constants";

type ToastType = "success" | "error" | "info";

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const show = useCallback((msg: string, type: ToastType = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

function Toast({ msg, type }: { msg: string; type: ToastType }) {
  const Icon = type === "success" ? CheckCircle2 : type === "error" ? XCircle : Info;
  const colors = {
    success: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
    error:   { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
    info:    { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  }[type];

  const c = colors;

  return (
    <div
      className={cn(
        "fixed top-6 left-4 right-4 z-50 max-w-md mx-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg fade-in",
        c.bg, c.border
      )}
    >
      <Icon size={20} className={c.text} />
      <p className={cn("text-sm font-bold", c.text)}>{msg}</p>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { exportBackup, importBackup, clearAll, stats } = useAlbum();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const { toast, show } = useToast();

  const handleExport = useCallback(() => {
    const json = exportBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `album-ja-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    show("Backup exportado!", "success");
  }, [exportBackup, show]);

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const ok = importBackup(text);
        if (ok) {
          show("Backup restaurado!", "success");
        } else {
          show("Arquivo inválido.", "error");
        }
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [importBackup, show]
  );

  const handleClear = useCallback(() => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    clearAll();
    setConfirmClear(false);
    show("Coleção resetada.", "info");
  }, [confirmClear, clearAll, show]);

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <PageHeader 
        title="Ajustes" 
        subtitle="Gerenciamento" 
        description="Configure backups e sua conta"
        icon={Settings}
        gradient 
      />

      <div className="px-4 space-y-6 pb-28">
        <div className="card p-5 flex items-center gap-4 bg-white border-blue-50">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-100"
            style={{ background: "var(--color-primary)" }}
          >
            ⚽
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">{APP_NAME}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Versão {APP_VERSION} · {stats.figurinhasUnicasObtidas} Registradas
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
            Backup & Restauração
          </p>
          <div className="card overflow-hidden divide-y divide-slate-50 bg-white">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-4 px-5 py-5 transition-all hover:bg-slate-50 active:bg-slate-100"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Download size={20} className="text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Exportar Backup</p>
                <p className="text-[11px] text-slate-400 font-medium">Salvar seu progresso em um arquivo .json</p>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-4 px-5 py-5 transition-all hover:bg-slate-50 active:bg-slate-100"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Upload size={20} className="text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Importar Backup</p>
                <p className="text-[11px] text-slate-400 font-medium">Restaurar figurinhas de um backup anterior</p>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </div>

        <div className="card p-5 space-y-4 bg-white border-rose-50">
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="text-emerald-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800">Privacidade dos Dados</p>
              <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                Suas figurinhas são armazenadas apenas no seu dispositivo. Recomendamos fazer backup regularmente para não perder seu progresso.
              </p>
            </div>
          </div>

          <div className="h-[1px] w-full bg-slate-50" />

          {confirmClear && (
            <div
              className="rounded-xl p-3 flex items-start gap-2 bg-rose-50 border border-rose-100 fade-in"
            >
              <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-rose-700">
                Cuidado: Isso apagará todas as figurinhas permanentemente! Toque novamente para confirmar.
              </p>
            </div>
          )}
          
          <button
            onClick={handleClear}
            className={cn(
              "w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-200 active:scale-95 border font-black uppercase tracking-widest text-[10px]",
              confirmClear ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200" : "bg-rose-50 border-rose-100 text-rose-600"
            )}
          >
            <Trash2 size={16} />
            {confirmClear ? "Confirmar Reset" : "Limpar Coleção"}
          </button>
        </div>

        <div className="card p-6 bg-slate-50 border-slate-100 shadow-none">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Sobre o Álbum Já</p>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            O Álbum Já foi desenvolvido para colecionadores que buscam praticidade e organização. 
            Inspirado na identidade oficial da Copa do Mundo FIFA 2026, oferecemos uma ferramenta premium para você gerenciar sua coleção, trocas e progresso rumo ao álbum completo.
          </p>
        </div>
      </div>
    </>
  );
}
