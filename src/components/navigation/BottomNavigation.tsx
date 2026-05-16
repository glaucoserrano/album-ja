"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, PieChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Início", icon: Home, href: "/" },
  { label: "Álbum", icon: Book, href: "/album" },
  { label: "Stats", icon: PieChart, href: "/estatisticas" },
  { label: "Ajustes", icon: Settings, href: "/configuracoes" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-6 pointer-events-none">
      <div 
        className="max-w-md mx-auto flex items-center justify-around h-18 rounded-[28px] bg-white/90 backdrop-blur-xl pointer-events-auto shadow-[0_-10px_40px_rgba(15,23,42,0.08)] border border-slate-100/50 px-2"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-14 rounded-2xl transition-all duration-300 active:scale-90",
                isActive ? "text-blue-600" : "text-slate-400"
              )}
            >
              {isActive && (
                <div 
                  className="absolute inset-x-2 inset-y-1 rounded-xl bg-blue-50/50"
                />
              )}
              
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={cn(
                  "relative z-10 transition-all duration-300",
                  isActive && "scale-110"
                )}
              />
              
              <span className={cn(
                "relative z-10 text-[9px] mt-1 font-black tracking-widest uppercase transition-opacity",
                isActive ? "opacity-100" : "opacity-40"
              )}>
                {item.label}
              </span>

              {isActive && (
                <div 
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
