// src/types/album.ts

// ─── Generic collection abstractions ─────────────────────────────────────────

export interface StickerRange {
  prefix: string;        // e.g. "BRA", "STA"
  from: number;
  to: number;
  namePrefix?: string;   // e.g. "Jogador", "Estádio"
}

export interface CategoryDefinition {
  id: string;
  name: string;
  emoji?: string;           // e.g. "🇧🇷", "🏟️", "⭐"
  confederation?: string;
  ranges: StickerRange[];
  color?: string;           // accent color for UI
}

export interface CollectionDefinition {
  id: string;
  name: string;
  description: string;
  year: number;
  totalStickers: number;   // configurable
  categories: CategoryDefinition[];
  theme: "world-cup" | "generic";
}

// ─── Individual sticker ───────────────────────────────────────────────────────

export interface Sticker {
  id: string;            // Internal ID like "BRA-01"
  code: string;          // Display code like "BRA 01"
  displayName: string;   // Name like "Alisson"
  categoryId: string;
  isSpecial: boolean;
}

// ─── Runtime state ────────────────────────────────────────────────────────────

/** Key = sticker ID (string), Value = quantity owned */
export type StickerState = Record<string, number>;

export interface AlbumData {
  version: string;       // Storage version for migrations
  collectionId: string;
  stickers: StickerState;
  lastUpdated: string;   // ISO date string
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface AlbumStats {
  totalObtidas: number;              // total stickers owned (incl. duplicates)
  totalFaltantes: number;            // stickers with qty = 0
  totalRepetidas: number;            // total duplicate stickers (qty > 1 → sum of extras)
  percentualCompleto: number;        // 0–100
  figurinhasUnicasObtidas: number;   // unique sticker IDs with qty >= 1
}

// ─── Registro Rápido ──────────────────────────────────────────────────────────

export interface RegistroRapidoResult {
  processadas: number;   // count of inputs found
  adicionadas: number;   // successfully added stickers
  jaRepetidas: number;   // stickers that were already in the album
  invalidas: string[];   // raw strings that couldn't be parsed or don't exist
}

// ─── Filter for album view ────────────────────────────────────────────────────

export type AlbumFilter = "todas" | "faltantes" | "repetidas";
