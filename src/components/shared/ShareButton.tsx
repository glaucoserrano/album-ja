"use client";

import { Share2, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

interface ShareButtonProps {
  text: string;
  className?: string;
}

export function ShareButton({ text, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {/* user cancelled */}
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {/* ignore */}
  }, [text]);

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${className}`}
      style={{
        background: copied
          ? "rgba(34,197,94,0.15)"
          : "linear-gradient(135deg, #005b99, #00a86b)",
        color: copied ? "#22c55e" : "white",
        border: copied ? "1px solid rgba(34,197,94,0.3)" : "none",
      }}
    >
      {copied ? (
        <>
          <Check size={16} />
          Copiado!
        </>
      ) : (
        <>
          <Share2 size={16} />
          Compartilhar
        </>
      )}
    </button>
  );
}
