// src/hooks/useAlbum.ts
"use client";

import { useMemo, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { worldCup2026, namedStickers } from "@/lib/collections/world-cup-2026";
import {
  buildStickerMap,
  computeStats,
  processRegistroRapido,
  parseRegistroInput,
} from "@/lib/sticker-utils";
import { storage } from "@/lib/storage";
import type {
  StickerState,
  AlbumStats,
  Sticker,
  RegistroRapidoResult,
  AlbumFilter,
} from "@/types/album";

const STORAGE_KEY = "stickers-world-cup-2026";

// Build sticker map once (stable reference)
const stickerMap = buildStickerMap(worldCup2026);

// Apply named overrides
for (const [id, name] of Object.entries(namedStickers)) {
  const sticker = stickerMap.get(id);
  if (sticker) {
    stickerMap.set(id, { ...sticker, displayName: name });
  }
}

const EMPTY_STATE: StickerState = {};

export function useAlbum() {
  const [stickerState, setStickerState] = useLocalStorage<StickerState>(
    STORAGE_KEY,
    EMPTY_STATE
  );

  // ── Stats (memoized) ───────────────────────────────────────────────────────
  const stats: AlbumStats = useMemo(
    () => computeStats(stickerState, worldCup2026.totalStickers, stickerMap),
    [stickerState]
  );

  // ── Increment / Decrement ──────────────────────────────────────────────────
  const increment = useCallback(
    (id: string) => {
      setStickerState((prev) => ({
        ...prev,
        [id]: (prev[id] ?? 0) + 1,
      }));
    },
    [setStickerState]
  );

  const decrement = useCallback(
    (id: string) => {
      setStickerState((prev) => {
        const current = prev[id] ?? 0;
        if (current <= 0) return prev;
        const next = { ...prev, [id]: current - 1 };
        if (next[id] === 0) delete next[id];
        return next;
      });
    },
    [setStickerState]
  );

  const setQuantity = useCallback(
    (id: string, qty: number) => {
      setStickerState((prev) => {
        if (qty <= 0) {
          const next = { ...prev };
          delete next[id];
          return next;
        }
        return { ...prev, [id]: qty };
      });
    },
    [setStickerState]
  );

  // ── Filtered lists (memoized) ──────────────────────────────────────────────
  const getFilteredStickers = useCallback(
    (filter: AlbumFilter, categoryId?: string): Sticker[] => {
      let stickers = Array.from(stickerMap.values());
      if (categoryId) {
        stickers = stickers.filter((s) => s.categoryId === categoryId);
      }
      return stickers.filter((s) => {
        const qty = stickerState[s.id] ?? 0;
        if (filter === "faltantes") return qty === 0;
        if (filter === "repetidas") return qty > 1;
        return true;
      });
    },
    [stickerState]
  );

  // ── Registro Rápido ────────────────────────────────────────────────────────
  const registrarRapido = useCallback(
    (input: string): RegistroRapidoResult => {
      const ids = parseRegistroInput(input);
      const { newState, result } = processRegistroRapido(
        ids,
        stickerState,
        stickerMap
      );
      setStickerState(newState);
      return result;
    },
    [stickerState, setStickerState]
  );

  // ── Backup ─────────────────────────────────────────────────────────────────
  const exportBackup = useCallback((): string => {
    return JSON.stringify(
      {
        appVersion: "1.0.0",
        storageVersion: "v4",
        collectionId: worldCup2026.id,
        exportedAt: new Date().toISOString(),
        stickers: stickerState,
      },
      null,
      2
    );
  }, [stickerState]);

  const importBackup = useCallback(
    (jsonStr: string): boolean => {
      try {
        const parsed = JSON.parse(jsonStr);
        // We only accept valid sticker objects
        if (parsed.stickers && typeof parsed.stickers === "object") {
          setStickerState(parsed.stickers as StickerState);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [setStickerState]
  );

  const clearAll = useCallback(() => {
    setStickerState(EMPTY_STATE);
    storage.clearAll();
  }, [setStickerState]);

  // ── Getters ────────────────────────────────────────────────────────────────
  const getQuantity = useCallback(
    (id: string): number => stickerState[id] ?? 0,
    [stickerState]
  );

  return {
    // Data
    collection: worldCup2026,
    stickerMap,
    stickerState,
    stats,
    // Actions
    increment,
    decrement,
    setQuantity,
    getQuantity,
    getFilteredStickers,
    registrarRapido,
    // Backup
    exportBackup,
    importBackup,
    clearAll,
  };
}
