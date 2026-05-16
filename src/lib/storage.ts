// src/lib/storage.ts
import { APP_STORAGE_PREFIX } from "./constants";

export interface StorageAdapter {
  save: <T>(key: string, value: T) => void;
  load: <T>(key: string) => T | null;
  clear: (key: string) => void;
  clearAll: () => void;
}

export const storage: StorageAdapter = {
  save: (key, value) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${APP_STORAGE_PREFIX}${key}`, JSON.stringify(value));
  },

  load: (key) => {
    if (typeof window === "undefined") return null;
    const item = localStorage.getItem(`${APP_STORAGE_PREFIX}${key}`);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  },

  clear: (key) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`${APP_STORAGE_PREFIX}${key}`);
  },

  clearAll: () => {
    if (typeof window === "undefined") return;
    // We only clear keys with our prefix
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(APP_STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },
};
