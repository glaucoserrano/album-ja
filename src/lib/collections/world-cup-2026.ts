// src/lib/collections/world-cup-2026.ts
import type { CollectionDefinition } from "@/types/album";

/** 
 * FIFA Official Country Codes for 48 Teams (Hypothetical/Confirmed mix for 2026)
 * Based on 12 groups of 4 teams.
 */
const TEAM_CODES = [
  // Hosts
  "CAN", "MEX", "USA",
  // Favorites & Common Qualified
  "BRA", "ARG", "FRA", "GER", "ESP", "ENG", "ITA", "BEL", "NED",
  "POR", "CRO", "URU", "COL", "MAR", "SEN", "JPN", "KOR", "AUS",
  "KSA", "IRN", "EGY", "NGA", "CMR", "GHA", "ECU", "PAR", "CHI",
  "PER", "AUT", "DEN", "SUI", "SRB", "POL", "UKR", "SWE", "TUR",
  "GRE", "CZE", "NOR", "WAL", "SCO", "IRL", "TUN", "ALG", "CIV"
];

const teamList = TEAM_CODES.slice(0, 48); // Ensure exactly 48

export const worldCup2026: CollectionDefinition = {
  id: "world-cup-2026",
  name: "Copa do Mundo FIFA 2026",
  description: "Álbum oficial Panini da Copa do Mundo FIFA 2026 — Expanded 48-team edition",
  year: 2026,
  totalStickers: 980, // Total oficial Panini
  theme: "world-cup",
  categories: [
    {
      id: "especiais-fwc",
      name: "Especiais FIFA",
      emoji: "🏆",
      color: "#0057D9",
      ranges: [
        { prefix: "FWC", from: 1, to: 9, namePrefix: "Introdução" },
        { prefix: "FWC", from: 10, to: 20, namePrefix: "FIFA Museum" },
      ],
    },
    ...teamList.map((code) => ({
      id: code.toLowerCase(),
      name: getTeamName(code),
      emoji: getTeamEmoji(code),
      color: getTeamColor(code),
      ranges: [
        { prefix: code, from: 1, to: 1, namePrefix: "Escudo" },
        { prefix: code, from: 2, to: 2, namePrefix: "Foto do Time" },
        { prefix: code, from: 3, to: 20, namePrefix: "Jogador" },
      ],
    })),
  ],
};

/** Mapping for a professional UI */
function getTeamName(code: string): string {
  const names: Record<string, string> = {
    CAN: "Canadá", MEX: "México", USA: "Estados Unidos",
    BRA: "Brasil", ARG: "Argentina", FRA: "França", GER: "Alemanha",
    ESP: "Espanha", ENG: "Inglaterra", ITA: "Itália", BEL: "Bélgica",
    NED: "Holanda", POR: "Portugal", CRO: "Croácia", URU: "Uruguai",
    COL: "Colômbia", MAR: "Marrocos", SEN: "Senegal", JPN: "Japão",
    KOR: "Coreia do Sul", AUS: "Austrália", KSA: "Arábia Saudita",
    IRN: "Irã", EGY: "Egito", NGA: "Nigéria", CMR: "Camarões",
    GHA: "Gana", ECU: "Equador", PAR: "Paraguai", CHI: "Chile",
    PER: "Peru", AUT: "Áustria", DEN: "Dinamarca", SUI: "Suíça",
    SRB: "Sérvia", POL: "Polônia", UKR: "Ucrânia", SWE: "Suécia",
    TUR: "Turquia", GRE: "Grécia", CZE: "Chéquia", NOR: "Noruega",
    WAL: "Gales", SCO: "Escócia", IRL: "Irlanda", TUN: "Tunísia",
    ALG: "Argélia", CIV: "Costa do Marfim"
  };
  return names[code] || code;
}

function getTeamEmoji(code: string): string {
  const emojis: Record<string, string> = {
    CAN: "🇨🇦", MEX: "🇲🇽", USA: "🇺🇸", BRA: "🇧🇷", ARG: "🇦🇷", FRA: "🇫🇷", GER: "🇩🇪",
    ESP: "🇪🇸", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", ITA: "🇮🇹", BEL: "🇧🇪", NED: "🇳🇱", POR: "🇵🇹", CRO: "🇭🇷",
    URU: "🇺🇾", COL: "🇨🇴", MAR: "🇲🇦", SEN: "🇸🇳", JPN: "🇯🇵", KOR: "🇰🇷", AUS: "🇦🇺"
  };
  return emojis[code] || "⚽";
}

function getTeamColor(code: string): string {
  const colors: Record<string, string> = {
    BRA: "#FBC02D", ARG: "#60a5fa", FRA: "#0057D9", GER: "#000000",
    MEX: "#00A86B", USA: "#E53935", CAN: "#E53935", ESP: "#E53935",
    ITA: "#0057D9", JPN: "#0057D9", MAR: "#E53935", NED: "#FB8C00"
  };
  return colors[code] || "#64748B";
}

/** Named overrides for key stickers */
export const namedStickers: Record<string, string> = {
  "FWC-01": "Capa Oficial — Panini",
  "FWC-02": "Troféu FIFA World Cup",
  "FWC-03": "Logo Oficial — 2026",
  "FWC-04": "Mascote Oficial",
  "FWC-05": "Bola da Copa",
  "BRA-01": "Escudo do Brasil",
  "BRA-02": "Seleção Brasileira (Foto)",
  "BRA-12": "Vinícius Jr.",
  "ARG-01": "Escudo da Argentina",
  "ARG-02": "Seleção Argentina (Foto)",
  "ARG-11": "Lionel Messi",
};
