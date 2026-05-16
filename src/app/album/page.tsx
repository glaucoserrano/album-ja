"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

import { Zap, BookOpen, Search as SearchIcon } from "lucide-react";
import { useAlbum } from "@/hooks/useAlbum";
import { useRegistroRapido } from "@/hooks/useRegistroRapido";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { AlbumFilterTabs } from "@/components/stickers/AlbumFilterTabs";
import { CategorySection } from "@/components/stickers/CategorySection";
import { EmptyState } from "@/components/shared/EmptyState";
import { FloatingActionButton } from "@/components/shared/FloatingActionButton";
import { RegistroRapidoModal } from "@/components/registro-rapido/RegistroRapidoModal";
import type { AlbumFilter } from "@/types/album";

export default function AlbumPage() {
  const {
    collection,
    stickerMap,
    stickerState,
    stats,
    increment,
    decrement,
    registrarRapido,
    getFilteredStickers,
  } = useAlbum();

  const [filter, setFilter] = useState<AlbumFilter>("todas");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rr = useRegistroRapido(registrarRapido);

  const handleFilterChange = useCallback((f: AlbumFilter) => {
    setFilter(f);
    setSearch("");
  }, []);

  const counts = useMemo(() => ({
    todas:     stickerMap.size,
    faltantes: stats.totalFaltantes,
    repetidas: Array.from(stickerMap.values()).filter(s => (stickerState[s.id] ?? 0) > 1).length,
  }), [stickerMap, stats, stickerState]);

  const visibleSections = useMemo(() => {
    const searchLower = search.toLowerCase();
    
    return collection.categories.map((cat) => {
      let stickers = getFilteredStickers(filter, cat.id);
      
      if (searchLower) {
        stickers = stickers.filter(
          (s) =>
            s.displayName.toLowerCase().includes(searchLower) ||
            s.code.toLowerCase().includes(searchLower)
        );
      }

      // Smart View: Only show if has owned stickers OR searching
      if (!searchLower) {
        const hasOwned = stickers.some(s => (stickerState[s.id] ?? 0) >= 1);
        if (!hasOwned && filter === "todas") return { cat, stickers: [] };
      }

      return { cat, stickers };
    }).filter(({ stickers }) => stickers.length > 0);
  }, [collection.categories, filter, search, getFilteredStickers, stickerState]);

  const totalVisible = useMemo(
    () => visibleSections.reduce((acc, { stickers }) => acc + stickers.length, 0),
    [visibleSections]
  );

  if (!mounted) return null;


  const albumIsTotallyEmpty = stats.figurinhasUnicasObtidas === 0;

  return (
    <>
      <PageHeader
        title="Meu Álbum"
        subtitle={collection.name}
        description="Gerencie sua coleção de figurinhas"
        icon={BookOpen}
        gradient
      />

      <div className="px-4 space-y-4 pb-28">
        <AlbumFilterTabs active={filter} onChange={handleFilterChange} counts={counts} />

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Ex: BRA 01, FWC 02, Messi..."
        />

        {albumIsTotallyEmpty && !search ? (
          <div className="flex flex-col items-center justify-center pt-10 text-center fade-in">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <BookOpen size={48} className="text-blue-500 opacity-20" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Seu álbum está esperando!</h3>
            <p className="text-sm text-slate-500 max-w-[260px] mb-8">
              Você ainda não registrou nenhuma figurinha. Use o botão abaixo para começar.
            </p>
            <button
              onClick={rr.openModal}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white shadow-xl shadow-blue-200 transition-all active:scale-95 premium-button"
              style={{ background: "var(--color-primary)" }}
            >
              <Zap size={20} fill="white" color="white" />
              Começar Coleção
            </button>
          </div>
        ) : totalVisible === 0 ? (
          <EmptyState
            Icon={SearchIcon}
            title={search ? "Busca vazia" : "Nada por aqui"}
            description={search ? "Não encontramos nenhuma figurinha com esse termo." : "Você ainda não tem figurinhas com esse filtro."}
          />
        ) : (
          <div className="space-y-4">
            {visibleSections.map(({ cat, stickers }) => (
              <CategorySection
                key={cat.id}
                id={cat.id}
                name={cat.name}
                emoji={cat.emoji}
                color={cat.color}
                stickers={stickers}
                stickerState={stickerState}
                onIncrement={increment}
                onDecrement={decrement}
                defaultOpen={visibleSections.length === 1 || search !== ""}
              />
            ))}
          </div>
        )}
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
