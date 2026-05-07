"use client";

import Link from "next/link";
import Image from "next/image";
import { KeyRound, LayoutDashboard, LogOut, RadioTower, ReceiptText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function AppHeader({ apiStatus = "online" }: { apiStatus?: "online" | "checking" }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: ReceiptText },
    { href: "/payment-keys", label: "Keys", icon: KeyRound },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0B0F1A]/82 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-purple-950/40">
            <Image src="/brand-logo.png" alt="Transactional Wallet Ledger logo" fill sizes="40px" className="object-cover" />
          </span>
          <span>
            <span className="block text-sm font-bold text-white">Ledger Demo</span>
            <span className="hidden text-xs text-[#8892B0] sm:block">Fastify transactional wallet</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`chip-btn inline-flex h-10 items-center gap-2 px-3 text-sm ${pathname === href ? "border-[#00E5FF]/35 text-white" : ""}`}
            >
              <Icon className="h-4 w-4 text-[#00E5FF]" />
              {label}
            </Link>
          ))}
        </nav>
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
