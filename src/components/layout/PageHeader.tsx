"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  gradient?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  gradient = false,
  actions,
}: PageHeaderProps) {
  return (
    <header className="px-7 pt-14 pb-8 flex flex-col relative overflow-hidden bg-white">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-3">
          {/* Row 1: Icon + App Name (Subtitle) */}
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                <Icon size={16} className="text-blue-600" strokeWidth={2.5} />
              </div>
            )}
            {subtitle && (
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Row 2: Title (Greeting) */}
          <div className="space-y-1">
            <h1 
              className={cn(
                "text-2xl font-black tracking-tight leading-none text-slate-900",
                gradient && "gradient-text-premium"
              )}
            >
              {title}
            </h1>
            
            {/* Row 3: Description */}
            {description && (
              <p className="text-xs font-bold text-slate-400 leading-tight">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      
      <div className="w-12 h-1.5 bg-blue-600 rounded-full mt-6 ml-0.5 opacity-10" />
    </header>
  );
}
