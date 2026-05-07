"use client";

import Link from "next/link";
import { LogOut, RadioTower, WalletCards } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AppHeader({ apiStatus = "online" }: { apiStatus?: "online" | "checking" }) {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0B0F1A]/82 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#00E5FF] text-white shadow-lg shadow-purple-950/40">
            <WalletCards className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-white">Ledger Demo</span>
            <span className="hidden text-xs text-[#8892B0] sm:block">Fastify transactional wallet</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="chip-btn hidden items-center gap-2 px-3 py-2 text-xs sm:inline-flex">
            <RadioTower className="h-3.5 w-3.5 text-[#00FFA3]" />
            API {apiStatus}
          </span>
          <span className="hidden max-w-[180px] truncate text-sm text-[#8892B0] md:block">{user?.email}</span>
          <button
            onClick={logout}
            className="chip-btn inline-flex h-10 items-center justify-center gap-2 px-3 text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
