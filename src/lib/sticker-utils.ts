// src/lib/sticker-utils.ts
import type {
  CollectionDefinition,
  StickerState,
  AlbumStats,
  Sticker,
  RegistroRapidoResult,
} from "@/types/album";

/** Helper to format numbers with leading zero if needed (Panini style) */
function formatNumber(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Build a flat map of all stickers from a CollectionDefinition */
export function buildStickerMap(
  collection: CollectionDefinition
): Map<string, Sticker> {
  const map = new Map<string, Sticker>();

  for (const category of collection.categories) {
    for (const range of category.ranges) {
      for (let n = range.from; n <= range.to; n++) {
        const numStr = formatNumber(n);
        const id = `${range.prefix}-${numStr}`;
        const code = `${range.prefix} ${numStr}`;
        
        const posInRange = n - range.from + 1;
        const totalInRange = range.to - range.from + 1;
        
        let displayName = range.namePrefix
          ? (totalInRange > 1 ? `${range.namePrefix} ${posInRange}` : range.namePrefix)
          : numStr;

        let stickerCode = code;
        
        // Special case for 00
        if (range.prefix === "FWC" && n === 0) {
          displayName = "00";
          stickerCode = "00";
        }

        map.set(id, {
          id,
          code: stickerCode,
          displayName,
          categoryId: category.id,
          isSpecial: category.id.startsWith("especiais") || range.prefix === "FWC",
        });
      }
    }
  }

  return map;
}

/** Compute stats from current sticker state */
export function computeStats(
  state: StickerState,
  totalStickers: number,
  stickerMap: Map<string, Sticker>
): AlbumStats {
  let figurinhasUnicasObtidas = 0;
  let totalObtidas = 0;
  let totalRepetidas = 0;

  for (const [id, qty] of Object.entries(state)) {
    if (!stickerMap.has(id)) continue;
    
    const q = qty as number;
    if (q >= 1) {
      figurinhasUnicasObtidas++;
      totalObtidas += q;
      if (q > 1) totalRepetidas += q - 1;
    }
  }

  const totalFaltantes = stickerMap.size - figurinhasUnicasObtidas;
  const percentualCompleto =
    stickerMap.size > 0
      ? Math.min(100, (figurinhasUnicasObtidas / stickerMap.size) * 100)
      : 0;

  return {
    totalObtidas,
    totalFaltantes,
    totalRepetidas,
    percentualCompleto,
    figurinhasUnicasObtidas,
  };
}

/** 
 * Normalizes user input into standard ID format (BRA-01)
 * Tolerant to: bra01, BRA 01, BRA-01, Bra 1
 */
export function normalizeStickerInput(raw: string): string | null {
  const normalized = raw.toUpperCase().trim();
  
  // Special case for 00
  if (normalized === "00") return "FWC-00";

  // Regex to capture [PREFIX][optional separators][NUMBER]
  // Supports 2-4 letters followed by digits
  const match = normalized.match(/^([A-Z]{2,4})[-\s]*(\d+)$/);
  
  if (!match) return null;
  
  const prefix = match[1];
  const num = parseInt(match[2], 10);
  
  return `${prefix}-${formatNumber(num)}`;
}


/** Parse a free-text input of sticker codes */
export function parseRegistroInput(input: string): string[] {
  // Split by common separators
  const parts = input
    .split(/[\s,;|\n\t]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // We need to handle cases like "BRA 01" which split into ["BRA", "01"]
  // A smarter approach: find all alphanumeric blobs that look like stickers
  
  // Try to find patterns like [PREFIX][NUMBER] in the whole string
  const stickersFound: string[] = [];
  
  // Re-joining and using a global regex is often more reliable for mixed input
  const normalizedText = input.toUpperCase().replace(/-/g, " ");
  
  // Find standard [PREFIX][NUMBER]
  const regex = /([A-Z]{2,4})\s*(\d+)/g;
  let match;
  while ((match = regex.exec(normalizedText)) !== null) {
    const prefix = match[1];
    const num = parseInt(match[2], 10);
    stickersFound.push(`${prefix}-${formatNumber(num)}`);
  }

  // Find standalone "00"
  const standaloneRegex = /(?:^|[\s,;|\n\t])(00)(?:$|[\s,;|\n\t])/g;
  let match00;
  while ((match00 = standaloneRegex.exec(normalizedText)) !== null) {
    stickersFound.push("FWC-00");
  }
  
  return stickersFound;
}


/** Process a list of sticker IDs, return result + updated state */
export function processRegistroRapido(
  ids: string[],
  currentState: StickerState,
  stickerMap: Map<string, Sticker>
): { newState: StickerState; result: RegistroRapidoResult } {
  const newState: StickerState = { ...currentState };
  let adicionadas = 0;
  let jaRepetidas = 0;
  const invalidas: string[] = [];
  const repetidasDetalhes: string[] = [];
  const validas: string[] = [];

  for (const id of ids) {
    if (!stickerMap.has(id)) {
      invalidas.push(id.replace("-", " ")); // Show as "BRA 01" to user
      continue;
    }
    const current = newState[id] ?? 0;
    if (current >= 1) {
      jaRepetidas++;
      repetidasDetalhes.push(id);
    }
    newState[id] = current + 1;
    adicionadas++;
    validas.push(id);
  }

  return {
    newState,
    result: {
      processadas: ids.length,
      adicionadas,
      jaRepetidas,
      invalidas,
      repetidasDetalhes,
      validas,
    },
  };
}

/** Sorting function for natural alphanumeric order */
export function sortStickers(a: Sticker, b: Sticker): number {
  return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
}

/** Get stickers for a category filtered and sorted */
export function getStickersByCategory(
  categoryId: string,
  stickerMap: Map<string, Sticker>,
  state: StickerState,
  filter: "todas" | "faltantes" | "repetidas"
): Sticker[] {
  const stickers = Array.from(stickerMap.values())
    .filter((s) => s.categoryId === categoryId);

  return stickers
    .filter((s) => {
      const qty = state[s.id] ?? 0;
      if (filter === "faltantes") return qty === 0;
      if (filter === "repetidas") return qty > 1;
      return true;
    })
    .sort(sortStickers);
}

/** Generate share text */
export function generateShareText(
  collectionName: string,
  state: StickerState,
  stickerMap: Map<string, Sticker>
): string {
  const allStickers = Array.from(stickerMap.values()).sort(sortStickers);
  
  const faltantes = allStickers
    .filter((s) => (state[s.id] ?? 0) === 0)
    .map(s => s.code);

  const repetidas = allStickers
    .filter((s) => (state[s.id] ?? 0) > 1)
    .map(s => s.code);

  let text = `📘 ${collectionName} — Álbum Já\n\n`;

  if (faltantes.length > 0) {
    text += `❌ Faltam (${faltantes.length}): ${faltantes.join(", ")}\n\n`;
  } else {
    text += `🏆 Nenhuma faltando!\n\n`;
  }

  if (repetidas.length > 0) {
    text += `🔁 Repetidas (${repetidas.length}): ${repetidas.join(", ")}\n\n`;
  }

  text += `Gerado pelo Álbum Já 📲`;
  return text;
}
