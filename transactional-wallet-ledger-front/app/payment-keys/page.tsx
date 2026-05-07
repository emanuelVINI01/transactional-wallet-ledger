"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, KeyRound, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { ApiWakeGate } from "@/components/layout/api-wake-gate";
import { AppHeader } from "@/components/layout/app-header";
import { useRequireAuth } from "@/hooks/use-auth";
import { useCreatePaymentKey, useDeletePaymentKey, usePaymentKeys } from "@/hooks/use-wallet";
import { ApiError, type ApiPaymentKey } from "@/lib/api-client";
import { formatDate, formatTaxId, maskKey } from "@/lib/format";

export default function PaymentKeysPage() {
  const auth = useRequireAuth();
  const keysQuery = usePaymentKeys(Boolean(auth.token));
  const createKey = useCreatePaymentKey();
  const deleteKey = useDeletePaymentKey();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const paymentKeys = keysQuery.data ?? [];

  async function createPaymentKey() {
    try {
      setFeedback(null);
      const paymentKey = await createKey.mutateAsync();
      setFeedback(`New key created: ${maskKey(paymentKey.key)}`);
    } catch (error) {
      setFeedback(error instanceof ApiError ? error.message : "Could not create payment key.");
    }
  }

  async function removePaymentKey(key: string) {
    const confirmed = window.confirm("Delete this payment key? Existing transfers cannot use it after removal.");
    if (!confirmed) return;

    try {
      setFeedback(null);
      setDeletingKey(key);
      await deleteKey.mutateAsync(key);
      setFeedback("Payment key deleted.");
    } catch (error) {
      setFeedback(error instanceof ApiError ? error.message : "Could not delete payment key.");
    } finally {
      setDeletingKey(null);
    }
  }

  async function copyKey(key: string) {
    await navigator.clipboard.writeText(key);
    setFeedback("Payment key copied.");
  }

  return (
    <ApiWakeGate>
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Link href="/dashboard" className="chip-btn mb-5 inline-flex h-10 items-center gap-2 px-3 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#00E5FF]">Payment key vault</p>
              <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Your receivable keys</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8892B0]">
                These UUID keys are the pix-like identifiers another authenticated wallet uses to resolve your public user data before paying.
              </p>
            </div>
            <button onClick={createPaymentKey} disabled={createKey.isPending} className="btn-cashout flex h-13 items-center justify-center gap-2 px-6 text-sm font-black disabled:opacity-60">
              {createKey.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Generate key
            </button>
          </motion.section>

          {feedback ? (
            <div className="mb-6 rounded-2xl border border-[#00E5FF]/25 bg-[#00E5FF]/[0.07] px-4 py-3 text-sm text-[#B8F6FF]">
              {feedback}
            </div>
          ) : null}

          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <MetricCard label="Active keys" value={String(paymentKeys.length)} />
            <MetricCard label="Owner tax ID" value={auth.user?.taxId ? formatTaxId(auth.user.taxId) : "000.000/00"} />
            <MetricCard label="Security" value="Bearer protected" />
          </section>

          {keysQuery.isLoading ? (
            <div className="glass-surface-2 h-96 animate-pulse rounded-3xl" />
          ) : paymentKeys.length === 0 ? (
            <EmptyKeys onCreate={createPaymentKey} pending={createKey.isPending} />
          ) : (
            <section className="grid gap-4 lg:grid-cols-2">
              {paymentKeys.map((paymentKey, index) => (
                <PaymentKeyCard
                  key={paymentKey.id}
                  index={index}
                  paymentKey={paymentKey}
                  deleting={deletingKey === paymentKey.key}
                  onCopy={copyKey}
                  onDelete={removePaymentKey}
                />
              ))}
            </section>
          )}
        </main>
      </div>
    </ApiWakeGate>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-surface-2 rounded-3xl p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8892B0]">{label}</p>
      <p className="mt-3 break-all text-xl font-black text-white">{value}</p>
    </div>
  );
}

function EmptyKeys({ onCreate, pending }: { onCreate: () => void; pending: boolean }) {
  return (
    <div className="glass-surface-2 flex min-h-[360px] flex-col items-center justify-center rounded-3xl p-8 text-center">
      <KeyRound className="mb-5 h-12 w-12 text-[#00E5FF]" />
      <h2 className="text-2xl font-black text-white">No active payment keys</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#8892B0]">
        Generate one key to let another demo wallet resolve your account before sending a ledger transfer.
      </p>
      <button onClick={onCreate} disabled={pending} className="btn-bet mt-7 inline-flex h-12 items-center gap-2 px-6 text-sm font-black disabled:opacity-60">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Generate first key
      </button>
    </div>
  );
}

function PaymentKeyCard({
  deleting,
  index,
  onCopy,
  onDelete,
  paymentKey,
}: {
  deleting: boolean;
  index: number;
  onCopy: (key: string) => void;
  onDelete: (key: string) => void;
  paymentKey: ApiPaymentKey;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="game-panel rounded-3xl p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF2D75]">Receivable key</p>
          <p className="mt-3 break-all font-mono text-sm text-[#00E5FF]">{paymentKey.key}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#00FFA3]/10 px-3 py-1 text-xs font-bold text-[#00FFA3]">
          <ShieldCheck className="h-3.5 w-3.5" />
          active
        </span>
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-[#AEB8CF] sm:grid-cols-2">
        <span>Owner: {paymentKey.user.name}</span>
        <span>Tax ID: {formatTaxId(paymentKey.user.taxId)}</span>
        <span className="sm:col-span-2">Created: {formatDate(paymentKey.createdAt)}</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button onClick={() => void onCopy(paymentKey.key)} className="chip-btn flex h-12 items-center justify-center gap-2 px-4 text-sm font-bold">
          <Copy className="h-4 w-4" />
          Copy key
        </button>
        <button
          onClick={() => void onDelete(paymentKey.key)}
          disabled={deleting}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#FF2D75]/35 bg-[#FF2D75]/10 px-4 text-sm font-bold text-[#FF86B2] transition hover:bg-[#FF2D75]/20 disabled:opacity-60"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete
        </button>
      </div>
    </motion.article>
  );
}
