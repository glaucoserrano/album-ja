"use client";

import { BottomNavigation } from "@/components/navigation/BottomNavigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-2xl relative border-x border-slate-50">
      <main className="flex-1 pb-24 overflow-x-hidden">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
