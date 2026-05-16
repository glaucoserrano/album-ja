// src/lib/collections/world-cup-2026.ts
import type { CollectionDefinition } from "@/types/album";

/** 
 * FIFA Official Country Codes for 48 Teams (Hypothetical/Confirmed mix for 2026)
 * Based on 12 groups of 4 teams.
 */
const TEAM_CODES = [
  // Grupo A
  "MEX", "KOR", "RSA", "CZE",
  // Grupo B
  "CAN", "SUI", "QAT", "BIH",
  // Grupo C
  "BRA", "MAR", "SCO", "HAI",
  // Grupo D
  "USA", "PAR", "AUS", "TUR",
  // Grupo E
  "GER", "ECU", "CIV", "CUW",
  // Grupo F
  "NED", "JPN", "TUN", "SWE",
  // Grupo G
  "BEL", "IRN", "EGY", "NZL",
  // Grupo H
  "ESP", "URU", "KSA", "CPV",
  // Grupo I
  "FRA", "SEN", "NOR", "IRQ",
  // Grupo J
  "ARG", "AUT", "ALG", "JOR",
  // Grupo K
  "POR", "COL", "UZB", "COD",
  // Grupo L
  "ENG", "CRO", "PAN", "GHA"
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
        { prefix: "FWC", from: 0, to: 9, namePrefix: "Introdução" },

        { prefix: "FWC", from: 10, to: 20, namePrefix: "FIFA Museum" },
      ],
    },
    {
      id: "especiais-coca-cola",

      name: "Coca-Cola Fan Album",
      emoji: "🥤",
      color: "#FE001A",
      ranges: [
        { prefix: "CC", from: 1, to: 14, namePrefix: "Coca-Cola" },
      ],
    },

    ...teamList.map((code) => ({
      id: code.toLowerCase(),
      name: getTeamName(code),
      emoji: getTeamEmoji(code),
      color: getTeamColor(code),
      ranges: [
        { prefix: code, from: 1, to: 1, namePrefix: "Escudo" },
        { prefix: code, from: 2, to: 12 },
        { prefix: code, from: 13, to: 13, namePrefix: "Foto do time" },
        { prefix: code, from: 14, to: 20 },


      ],

    })),
  ],
};

/** Mapping for a professional UI */
function getTeamName(code: string): string {
  const names: Record<string, string> = {
    MEX: "MEXICO", KOR: "SOUTH KOREA", RSA: "SOUTH AFRICA", CZE: "CZECHIA",
    CAN: "CANADA", SUI: "SWITZERLAND", QAT: "QATAR", BIH: "BOSNIA AND HERZEGOVINA",
    BRA: "BRAZIL", MAR: "MOROCCO", SCO: "SCOTLAND", HAI: "HAITI",
    USA: "USA", PAR: "PARAGUAY", AUS: "AUSTRALIA", TUR: "TURKIYE",
    GER: "GERMANY", ECU: "ECUADOR", CIV: "IVORY COAST", CUW: "CURACAO",
    NED: "NETHERLANDS", JPN: "JAPAN", TUN: "TUNISIA", SWE: "SWEDEN",
    BEL: "BELGIUM", IRN: "IRAN", EGY: "EGYPT", NZL: "NEW ZEALAND",
    ESP: "SPAIN", URU: "URUGUAY", KSA: "SAUDI ARABIA", CPV: "CAPE VERDE",
    FRA: "FRANCE", SEN: "SENEGAL", NOR: "NORWAY", IRQ: "IRAQ",
    ARG: "ARGENTINA", AUT: "AUSTRIA", ALG: "ALGERIA", JOR: "JORDAN",
    POR: "PORTUGAL", COL: "COLOMBIA", UZB: "UZBEKISTAN", COD: "DR CONGO",
    ENG: "ENGLAND", CRO: "CROATIA", PAN: "PANAMA", GHA: "GHANA"




  };
  return names[code] || code;
}

function getTeamEmoji(code: string): string {
  const emojis: Record<string, string> = {
    MEX: "🇲🇽", KOR: "🇰🇷", RSA: "🇿🇦", CZE: "🇨🇿",
    CAN: "🇨🇦", SUI: "🇨🇭", QAT: "🇶🇦", BIH: "🇧🇦",
    BRA: "🇧🇷", MAR: "🇲🇦", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", HAI: "🇭🇹",
    USA: "🇺🇸", PAR: "🇵🇾", AUS: "🇦🇺", TUR: "🇹🇷",
    GER: "🇩🇪", ECU: "🇪🇨", CIV: "🇨🇮", CUW: "🇨🇼",
    NED: "🇳🇱", JPN: "🇯🇵", TUN: "🇹🇳", SWE: "🇸🇪",
    BEL: "🇧🇪", IRN: "🇮🇷", EGY: "🇪🇬", NZL: "🇳🇿",
    ESP: "🇪🇸", URU: "🇺🇾", KSA: "🇸🇦", CPV: "🇨🇻",
    FRA: "🇫🇷", SEN: "🇸🇳", NOR: "🇳🇴", IRQ: "🇮🇶",
    ARG: "🇦🇷", AUT: "🇦🇹", ALG: "🇩🇿", JOR: "🇯🇴",
    POR: "🇵🇹", COL: "🇨🇴", UZB: "🇺🇿", COD: "🇨🇩",
    ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", CRO: "🇭🇷", PAN: "🇵🇦", GHA: "🇬🇭"


  };
  return emojis[code] || "⚽";
}

function getTeamColor(code: string): string {
  const colors: Record<string, string> = {
    BRA: "#FBC02D", ARG: "#60a5fa", FRA: "#0057D9", GER: "#000000",
    MEX: "#00A86B", USA: "#E53935", CAN: "#E53935", ESP: "#E53935",
    JPN: "#0057D9", MAR: "#E53935", NED: "#FB8C00",

    QAT: "#8D1B3D", KOR: "#E53935", RSA: "#FFD700", CZE: "#0057D9",
    SUI: "#E53935", BIH: "#0057D9", SCO: "#0057D9", HAI: "#0057D9",
    PAR: "#E53935", AUS: "#FFD700", TUR: "#E53935", ECU: "#FFD700",
    CIV: "#FB8C00", CUW: "#0057D9", TUN: "#E53935", SWE: "#FFD700",
    BEL: "#E53935", IRN: "#00A86B", EGY: "#E53935", NZL: "#000000",
    URU: "#60a5fa", KSA: "#00A86B", CPV: "#0057D9", SEN: "#00A86B",
    NOR: "#E53935", IRQ: "#00A86B", AUT: "#E53935", ALG: "#00A86B",
    JOR: "#E53935", POR: "#E53935", COL: "#FFD700", UZB: "#0057D9",
    COD: "#0057D9", ENG: "#0057D9", CRO: "#E53935", PAN: "#E53935",
    GHA: "#FFD700"


  };
  return colors[code] || "#64748B";
}

/** Named overrides for key stickers */
export const namedStickers: Record<string, string> = {
  "FWC-00": "Capa Oficial",
  "FWC-01": "Troféu FIFA World Cup",
  "FWC-02": "Logo Oficial — 2026",
  "FWC-03": "Mascote Oficial",
  "FWC-04": "Bola da Copa",
};

