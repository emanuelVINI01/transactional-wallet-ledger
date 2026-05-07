"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Database,
  Fingerprint,
  GitBranch,
  Layers3,
  LockKeyhole,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

const stack = ["Fastify", "PostgreSQL", "Redis-ready locks", "Prisma", "Next.js", "TypeScript"];
const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/emanuelVINI01";

const hardProblems = [
  { icon: Fingerprint, title: "Idempotent transactions", text: "Client-generated request identity prevents duplicate visual commits and models production retry safety." },
  { icon: WalletCards, title: "Wallet ledger", text: "Debit and credit movements are stored as auditable ledger events instead of mutable balances only." },
  { icon: LockKeyhole, title: "Transactional consistency", text: "Fastify routes coordinate Prisma transactions around balance checks, debit, credit and transaction creation." },
  { icon: ReceiptText, title: "Auditability", text: "Each movement carries reference IDs, descriptions and timestamps for reconciliation-style inspection." },
  { icon: RefreshCcw, title: "Reconciliation mindset", text: "The UI exposes sent, received, last activity and ledger health signals for operational review." },
  { icon: ShieldCheck, title: "Bearer auth", text: "Protected flows centralize token handling and authorization headers in one API client." },
];

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grid-noise pointer-events-none absolute inset-0 opacity-70" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-purple-950/40">
            <Image src="/brand-logo.png" alt="Transactional Wallet Ledger logo" fill sizes="48px" className="object-cover" priority />
          </span>
          <span>
            <span className="block text-sm font-bold text-white">Transactional Wallet Ledger</span>
            <span className="hidden text-xs text-[#8892B0] sm:block">Production-style API demo</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="chip-btn px-4 py-2 text-sm">Login</Link>
          <Link href="/dashboard" className="btn-bet hidden px-5 py-2.5 text-sm font-bold sm:inline-flex">Open dashboard</Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="chip-btn mb-6 inline-flex px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#00E5FF]">
            Portfolio demo for backend reliability
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            A fintech-grade ledger demo built to prove transactional thinking.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#B7C0D6]">
            This is a portfolio demo for a production-style transactional wallet ledger API. It presents authentication, wallet balance, payment-like transfers, audit-friendly transactions and a polished Next.js client.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="btn-bet inline-flex h-13 items-center justify-center gap-2 px-6 text-sm font-bold">
              Try the live ledger demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={githubUrl} target="_blank" rel="noreferrer" className="chip-btn inline-flex h-13 items-center justify-center gap-2 px-6 text-sm font-semibold">
              View technical architecture
              <GitBranch className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-[#C8D1E5]">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="gradient-ring rounded-[32px]">
          <div className="game-panel rounded-[32px] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#00E5FF]">Live ledger mock</p>
                <h2 className="mt-1 text-2xl font-bold text-white">Wallet control plane</h2>
              </div>
              <span className="rounded-full bg-[#00FFA3]/10 px-3 py-1 text-xs font-bold text-[#00FFA3]">healthy</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Balance", "$12,840", "neon-text-green"],
                ["Sent", "$4,210", "neon-text-pink"],
                ["Received", "$8,630", "neon-text-cyan"],
              ].map(([label, value, className]) => (
                <div key={label} className="glass-surface rounded-3xl p-4">
                  <p className="text-xs text-[#8892B0]">{label}</p>
                  <p className={`mt-2 text-2xl font-bold ${className}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {["DEBIT reference_82a", "CREDIT reference_82a", "DEBIT retry-safe"].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3">
                  <span className="flex items-center gap-3 text-sm text-[#D8DFF0]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_18px_rgba(0,229,255,0.9)]" />
                    {item}
                  </span>
                  <span className="text-xs text-[#8892B0]">T+{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#FF2D75]">Built for backend reliability</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">Hard problems surfaced as product UX.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#8892B0]">The client turns reliability concerns into visible states: waking backend, retry-safe payments, ledger movement tables and audit-ready signals.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hardProblems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04 }}
              className="glass-surface-2 rounded-3xl p-5"
            >
              <item.icon className="mb-5 h-6 w-6 text-[#00E5FF]" />
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#8892B0]">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            [Layers3, "Ledger-first architecture", "Moves are modeled as transaction rows with shared references for debit and credit sides."],
            [Database, "What this demo proves", "A recruiter can click through auth, protected pages, payment-key resolution and transfer confirmation."],
            [Sparkles, "Premium product finish", "The same API is presented with wake-up handling, mobile-first forms, motion and operational empty states."],
          ].map(([Icon, title, text]) => (
            <article key={String(title)} className="game-panel rounded-3xl p-6">
              <Icon className="h-7 w-7 text-[#FFC107]" />
              <h3 className="mt-5 text-xl font-bold text-white">{String(title)}</h3>
              <p className="mt-3 text-sm leading-6 text-[#AEB8CF]">{String(text)}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:flex-row">
          <span className="flex items-center gap-3 text-sm text-[#D8DFF0]">
            <Activity className="h-5 w-5 text-[#00FFA3]" />
            Duplicate requests do not create duplicate visual transactions in the client flow.
          </span>
          <Link href="/register" className="btn-cashout inline-flex h-12 items-center justify-center px-5 text-sm font-black">
            Start demo
          </Link>
        </div>
      </section>
    </main>
  );
}
