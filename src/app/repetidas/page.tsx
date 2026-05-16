"use client";

import { useState, useMemo, useEffect } from "react";
import { RefreshCw, Search as SearchIcon } from "lucide-react";
import { useAlbum } from "@/hooks/useAlbum";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { CategorySection } from "@/components/stickers/CategorySection";
import { EmptyState } from "@/components/shared/EmptyState";
import { FloatingActionButton } from "@/components/shared/FloatingActionButton";
import { RegistroRapidoModal } from "@/components/registro-rapido/RegistroRapidoModal";
import { useRegistroRapido } from "@/hooks/useRegistroRapido";

export default function RepetidasPage() {
  const {
    collection,
    stickerState,
    increment,
    decrement,
    registrarRapido,
    getFilteredStickers,
  } = useAlbum();

  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rr = useRegistroRapido(registrarRapido);

  const visibleSections = useMemo(() => {
    const searchLower = search.toLowerCase();
    
    return collection.categories.map((cat) => {
      // Filter for "repetidas"
      let stickers = getFilteredStickers("repetidas", cat.id);
      
      if (searchLower) {
        stickers = stickers.filter(
          (s) =>
            s.displayName.toLowerCase().includes(searchLower) ||
            s.code.toLowerCase().includes(searchLower)
        );
      }

      return { cat, stickers };
    }).filter(({ stickers }) => stickers.length > 0);
  }, [collection.categories, search, getFilteredStickers, stickerState]);

  if (!mounted) return null;

  return (
    <>
      <PageHeader
        title="Minhas Repetidas"
        subtitle="Gerenciamento de Trocas"
        description="Visualize e gerencie suas figurinhas para troca"
        icon={RefreshCw}
        gradient
      />

      <div className="px-4 space-y-4 pb-28">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Busque por código ou nome..."
        />

        {visibleSections.length === 0 ? (
          <EmptyState
            Icon={SearchIcon}
            title={search ? "Nenhuma repetida encontrada" : "Você não tem repetidas"}
            description={search 
              ? "Não encontramos nenhuma repetida com esse termo." 
              : "As figurinhas que você tiver mais de uma aparecerão aqui automaticamente."}
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
                defaultOpen={true}
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
