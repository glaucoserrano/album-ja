// src/lib/constants.ts

export const APP_NAME = "Álbum Já";
export const APP_SLOGAN = "Complete sua coleção de forma rápida e inteligente.";
export const APP_VERSION = "1.0.0";
export const APP_STORAGE_PREFIX = "album-ja:";
export const APP_STORAGE_VERSION = "v5"; // Official Panini Structure Version

export const DEFAULT_COLLECTION_ID = "world-cup-2026";

export const WORLD_CUP_2026 = {
  name: "Copa do Mundo FIFA 2026",
  startDate: new Date("2026-06-11"),
  hosts: ["Estados Unidos", "Canadá", "México"],
  teams: 48,
  totalStickersOfficial: 980,
  stickersPerPack: 7,
  facts: [
    "A Copa de 2026 será a primeira com 48 seleções participantes, um aumento de 16 times em relação ao formato anterior.",
    "Pela primeira vez na história, o torneio será sediado em três países simultaneamente: EUA, México e Canadá.",
    "O México se tornará o primeiro país a sediar a Copa do Mundo três vezes (1970, 1986 e 2026).",
    "A final da Copa de 2026 será realizada no MetLife Stadium, em Nova Jersey, com capacidade para 82.500 pessoas.",
    "O torneio terá um recorde de 104 partidas disputadas em um período de 39 dias.",
    "O Estádio Azteca, no México, será o primeiro a receber três aberturas de Copa do Mundo na história.",
    "A distância entre Vancouver (norte) e Cidade do México (sul) é de mais de 4.000 km.",
    "O novo formato terá 12 grupos de 4 seleções cada, com os melhores terceiros colocados avançando para os mata-matas.",
    "A FIFA estima uma audiência global de mais de 5 bilhões de pessoas para o evento em 2026.",
  ],
} as const;
