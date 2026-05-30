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
  HistoryEntry,
} from "@/types/album";

const STORAGE_KEY = "stickers-world-cup-2026";
const HISTORY_STORAGE_KEY = "history-world-cup-2026";

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

  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    HISTORY_STORAGE_KEY,
    []
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

      const sticker = stickerMap.get(id);
      if (sticker) {
        setHistory((prev) => [
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            stickerId: id,
            stickerCode: sticker.code,
            stickerName: sticker.displayName,
            quantityChange: 1,
            actionType: "manual",
          },
          ...prev,
        ]);
      }
    },
    [setStickerState, setHistory]
  );

  const decrement = useCallback(
    (id: string) => {
      let decremented = false;
      setStickerState((prev) => {
        const current = prev[id] ?? 0;
        if (current <= 0) return prev;
        decremented = true;
        const next = { ...prev, [id]: current - 1 };
        if (next[id] === 0) delete next[id];
        return next;
      });

      if (decremented) {
        const sticker = stickerMap.get(id);
        if (sticker) {
          setHistory((prev) => [
            {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
              stickerId: id,
              stickerCode: sticker.code,
              stickerName: sticker.displayName,
              quantityChange: -1,
              actionType: "manual",
            },
            ...prev,
          ]);
        }
      }
    },
    [setStickerState, setHistory]
  );

  const setQuantity = useCallback(
    (id: string, qty: number) => {
      let prevQty = 0;
      setStickerState((prev) => {
        prevQty = prev[id] ?? 0;
        if (qty <= 0) {
          const next = { ...prev };
          delete next[id];
          return next;
        }
        return { ...prev, [id]: qty };
      });

      const change = qty - prevQty;
      if (change !== 0) {
        const sticker = stickerMap.get(id);
        if (sticker) {
          setHistory((prev) => [
            {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
              stickerId: id,
              stickerCode: sticker.code,
              stickerName: sticker.displayName,
              quantityChange: change,
              actionType: "manual",
            },
            ...prev,
          ]);
        }
      }
    },
    [setStickerState, setHistory]
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

      // Log to history
      if (result.validas && result.validas.length > 0) {
        const newEntries: HistoryEntry[] = [];
        const now = new Date().toISOString();
        
        // Count how many of each sticker were added in this batch
        const counts: Record<string, number> = {};
        for (const id of result.validas) {
          counts[id] = (counts[id] ?? 0) + 1;
        }

        for (const [id, count] of Object.entries(counts)) {
          const sticker = stickerMap.get(id);
          if (sticker) {
            newEntries.push({
              id: `${Date.now()}-${id}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: now,
              stickerId: id,
              stickerCode: sticker.code,
              stickerName: sticker.displayName,
              quantityChange: count,
              actionType: "batch",
            });
          }
        }

        setHistory((prev) => [...newEntries, ...prev]);
      }

      return result;
    },
    [stickerState, setStickerState, setHistory]
  );

  // ── Reverter Registro do Histórico ──────────────────────────────────────────
  const revertHistoryEntry = useCallback(
    (entryId: string) => {
      setHistory((prevHistory) => {
        const entry = prevHistory.find((e) => e.id === entryId);
        if (!entry) return prevHistory;

        setStickerState((prevStickers) => {
          const currentQty = prevStickers[entry.stickerId] ?? 0;
          // Subtrai o valor alterado (já que foi adicionado no passado)
          const nextQty = Math.max(0, currentQty - entry.quantityChange);
          const next = { ...prevStickers, [entry.stickerId]: nextQty };
          if (next[entry.stickerId] === 0) delete next[entry.stickerId];
          return next;
        });

        return prevHistory.filter((e) => e.id !== entryId);
      });
    },
    [setStickerState, setHistory]
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
        history: history,
      },
      null,
      2
    );
  }, [stickerState, history]);

  const importBackup = useCallback(
    (jsonStr: string): boolean => {
      try {
        const parsed = JSON.parse(jsonStr);
        // We only accept valid sticker objects
        if (parsed.stickers && typeof parsed.stickers === "object") {
          setStickerState(parsed.stickers as StickerState);
          if (parsed.history && Array.isArray(parsed.history)) {
            setHistory(parsed.history);
          } else {
            setHistory([]);
          }
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [setStickerState, setHistory]
  );

  const clearAll = useCallback(() => {
    setStickerState(EMPTY_STATE);
    setHistory([]);
    storage.clearAll();
  }, [setStickerState, setHistory]);

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
    history,
    // Actions
    increment,
    decrement,
    setQuantity,
    getQuantity,
    getFilteredStickers,
    registrarRapido,
    revertHistoryEntry,
    // Backup
    exportBackup,
    importBackup,
    clearAll,
  };
}
