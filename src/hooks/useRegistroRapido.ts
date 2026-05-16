// src/hooks/useRegistroRapido.ts
"use client";

import { useState, useCallback } from "react";
import type { RegistroRapidoResult } from "@/types/album";

export function useRegistroRapido(
  onRegistrar: (input: string) => RegistroRapidoResult
) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<RegistroRapidoResult | null>(null);

  const openModal = useCallback(() => {
    setInput("");
    setResult(null);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setInput("");
    setResult(null);
  }, []);

  const handleRegistrar = useCallback(() => {
    if (!input.trim()) return;
    const r = onRegistrar(input);
    setResult(r);
    setInput("");
  }, [input, onRegistrar]);

  return {
    open,
    input,
    result,
    setInput,
    openModal,
    closeModal,
    handleRegistrar,
    clearResult: () => setResult(null),
  };
}
