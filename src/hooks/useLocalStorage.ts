// src/hooks/useLocalStorage.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { storage } from "@/lib/storage";
import { APP_STORAGE_VERSION } from "@/lib/constants";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const versionedKey = `${APP_STORAGE_VERSION}:${key}`;

  const [storedValue, setStoredValue] = useState<T>(() => {
    // We check for versioned key
    const loaded = storage.load<T>(versionedKey);
    return loaded !== null ? loaded : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === "function"
          ? (value as (prev: T) => T)(prev)
          : value;
        storage.save(versionedKey, next);
        return next;
      });
    },
    [versionedKey]
  );

  const removeValue = useCallback(() => {
    storage.clear(versionedKey);
    setStoredValue(initialValue);
  }, [versionedKey, initialValue]);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      const prefixedKey = `album-ja:${versionedKey}`;
      if (e.key === prefixedKey && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {/* ignore */}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [versionedKey]);

  return [storedValue, setValue, removeValue] as const;
}
