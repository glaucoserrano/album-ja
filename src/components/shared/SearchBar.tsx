"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative group animate-fade-in", className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search
          size={18}
          className="text-slate-300 group-focus-within:text-blue-500 transition-colors"
          strokeWidth={2.5}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-11 pr-11 py-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all border border-slate-50 focus:border-blue-200"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
