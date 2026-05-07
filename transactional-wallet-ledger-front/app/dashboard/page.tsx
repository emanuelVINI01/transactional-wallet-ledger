"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowDownLeft, ArrowUpRight, Fingerprint, KeyRound, Plus, ReceiptText, ShieldCheck, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { ApiWakeGate } from "@/components/layout/api-wake-gate";
import { AppHeader } from "@/components/layout/app-header";
import { TransactionModal } from "@/components/modals/transaction-modal";
import { LedgerChart } from "@/components/dashboard/ledger-chart";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { StatCard } from "@/components/ui/stat-card";
import { useRequireAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useCreatePaymentKey, useWallet } from "@/hooks/use-wallet";
import { formatDate, formatMoney, formatTaxId } from "@/lib/format";

export default function DashboardPage() {
  const auth = useRequireAuth();
  const walletQuery = useWallet(Boolean(auth.token));
  const transactionsQuery = useTransactions(Boolean(auth.token));
  const createKey = useCreatePaymentKey();
  const [modalOpen, setModalOpen] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const user = walletQuery.data ?? auth.user;
  const transactions = useMemo(() => transactionsQuery.data ?? [], [transactionsQuery.data]);

  const metrics = useMemo(() => {
    const sent = transactions.filter((item) => item.type === "DEBIT").reduce((sum, item) => sum + item.amount, 0);
    const received = transactions.filter((item) => item.type === "CREDIT").reduce((sum, item) => sum + item.amount, 0);
    return {
      sent,
      received,
      total: transactions.length,
      last: transactions[0]?.createdAt,
    };
  }, [transactions]);

  async function createPaymentKey() {
    const key = await createKey.mutateAsync();
    setLastKey(key.key);
  }

  return (
    <ApiWakeGate>
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#00E5FF]">Authenticated ledger workspace</p>
              <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8892B0]">
                Protected Next.js client for the Fastify wallet API. Balance, transfer flow and transaction history are fetched through the centralized API client.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-bet flex h-13 items-center justify-center gap-2 px-6 text-sm font-black">
              <Plus className="h-4 w-4" />
              New transfer
            </button>
          </motion.section>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard icon={WalletCards} label="Current balance" value={formatMoney(user?.balance)} tone="green" />
            <StatCard icon={ArrowUpRight} label="Total sent" value={formatMoney(metrics.sent)} tone="pink" />
            <StatCard icon={ArrowDownLeft} label="Total received" value={formatMoney(metrics.received)} tone="cyan" />
            <StatCard icon={ReceiptText} label="Transactions" value={String(metrics.total)} tone="purple" />
            <StatCard icon={Activity} label="Last movement" value={formatDate(metrics.last)} tone="yellow" />
          </section>

          <section className="mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="game-panel rounded-3xl p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF2D75]">Wallet identity</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{user?.name ?? "Loading user"}</h2>
                  <p className="mt-2 text-sm text-[#8892B0]">{user?.email ?? "Fetching authenticated profile..."}</p>
                  <p className="mt-1 font-mono text-sm text-[#00E5FF]">{user?.taxId ? formatTaxId(user.taxId) : "000.000/00"}</p>
                </div>
                <span className="rounded-full bg-[#00FFA3]/10 px-3 py-1 text-xs font-bold text-[#00FFA3]">reconciled</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  [ShieldCheck, "Bearer token attached"],
                  [Fingerprint, "Idempotency key generated"],
                  [KeyRound, "Payment key resolution"],
                ].map(([Icon, label]) => (
                  <div key={String(label)} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-[#D8DFF0]">
                    <Icon className="mb-3 h-5 w-5 text-[#00E5FF]" />
                    {String(label)}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-surface-2 rounded-3xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Payment key</h2>
                  <p className="mt-1 text-sm text-[#8892B0]">Create a key for another demo account to pay you.</p>
                </div>
                <KeyRound className="h-6 w-6 text-[#00E5FF]" />
              </div>
              {lastKey ? (
                <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/[0.06] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8892B0]">New key</p>
                  <p className="mt-2 break-all font-mono text-sm text-[#00E5FF]">{lastKey}</p>
                  <p className="mt-2 text-xs text-[#8892B0]">Share this with another logged-in demo user.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-[#8892B0]">
                  No key generated in this browser session.
                </div>
              )}
              <button onClick={createPaymentKey} disabled={createKey.isPending} className="btn-cashout mt-4 h-12 w-full text-sm font-black disabled:opacity-60">
                {createKey.isPending ? "Creating..." : "Generate payment key"}
              </button>
              <Link href="/payment-keys" className="chip-btn mt-3 flex h-12 items-center justify-center text-sm font-bold">
                View all keys
              </Link>
              {createKey.error ? <p className="mt-3 text-sm text-[#FF86B2]">Could not create key. You may have reached the API limit.</p> : null}
            </div>
          </section>

          <section className="mb-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <LedgerChart transactions={transactions} />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Why this matters", "Duplicate clicks are disabled in the payment modal and every new attempt generates an Idempotency-Key header."],
                ["Auditability", "Reference IDs and paired debit/credit rows make the transaction flow inspectable after execution."],
                ["Operational UX", "The app surfaces backend wake-up, retry, empty and error states without exposing raw failures."],
                ["Production-style split", "Fastify owns business rules; the Next.js client owns presentation, validation and cache invalidation."],
              ].map(([title, text]) => (
                <article key={title} className="glass-surface-2 rounded-3xl p-5">
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#8892B0]">{text}</p>
                </article>
              ))}
            </div>
          </section>

          {transactionsQuery.isLoading ? (
            <div className="glass-surface-2 h-80 animate-pulse rounded-3xl" />
          ) : (
            <div className="space-y-3">
              <div className="flex justify-end">
                <Link href="/transactions" className="chip-btn inline-flex h-10 items-center px-4 text-sm font-bold">
                  Open transactions page
                </Link>
              </div>
              <TransactionTable transactions={transactions} />
            </div>
          )}
        </main>
        <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} balance={user?.balance} />
      </div>
    </ApiWakeGate>
  );
}
