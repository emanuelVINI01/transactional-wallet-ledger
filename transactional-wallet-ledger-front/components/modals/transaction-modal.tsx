"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Search, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useCreatePayment, useResolvePaymentKey } from "@/hooks/use-payment";
import { ApiError, type ApiPaymentKey, type ApiUser } from "@/lib/api-client";
import { formatMoney, makeIdempotencyKey, maskEmail, maskKey } from "@/lib/format";

const resolveSchema = z.object({
  key: z.uuid("Use a valid payment key UUID"),
});

const paySchema = z.object({
  amount: z.number().int().positive("Amount must be greater than zero"),
  description: z.string().trim().max(255).optional(),
});

type ResolveForm = z.infer<typeof resolveSchema>;
type PayForm = z.infer<typeof paySchema>;

export function TransactionModal({
  balance,
  onClose,
  open,
}: {
  balance?: number;
  onClose: () => void;
  open: boolean;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resolved, setResolved] = useState<ApiPaymentKey | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const resolveMutation = useResolvePaymentKey();
  const payMutation = useCreatePayment();
  const resolveForm = useForm<ResolveForm>({ resolver: zodResolver(resolveSchema), defaultValues: { key: "" } });
  const payForm = useForm<PayForm>({ resolver: zodResolver(paySchema), defaultValues: { amount: 1, description: "" } });

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      setStep(1);
      setResolved(null);
      setIdempotencyKey(makeIdempotencyKey());
      resolveForm.reset({ key: "" });
      payForm.reset({ amount: 1, description: "" });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open, payForm, resolveForm]);

  const errorMessage = useMemo(() => {
    const error = resolveMutation.error ?? payMutation.error;
    return error instanceof ApiError ? error.message : null;
  }, [payMutation.error, resolveMutation.error]);

  async function resolveKey(values: ResolveForm) {
    const paymentKey = await resolveMutation.mutateAsync(values.key);
    setResolved(paymentKey);
    setStep(2);
  }

  async function confirmPayment(values: PayForm) {
    if (!resolved) return;
    await payMutation.mutateAsync({
      paymentKey: resolved.id,
      amount: values.amount,
      description: values.description,
      idempotencyKey,
    });
    setStep(3);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 backdrop-blur-lg sm:items-center sm:p-6"
        >
          <motion.section
            initial={{ y: 32, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            className="glass-surface max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[30px] p-5 sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#00E5FF]">Two-step transfer</p>
                <h2 className="mt-2 text-2xl font-black text-white">Send ledger payment</h2>
              </div>
              <button onClick={onClose} className="chip-btn flex h-10 w-10 items-center justify-center" aria-label="Close modal">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2">
              {["Resolve key", "Confirm", "Receipt"].map((label, index) => (
                <div key={label} className={`rounded-2xl px-3 py-2 text-center text-xs font-bold ${step >= index + 1 ? "bg-[#7C3AED]/25 text-white" : "bg-white/[0.04] text-[#8892B0]"}`}>
                  {label}
                </div>
              ))}
            </div>

            {step === 1 ? (
              <form onSubmit={resolveForm.handleSubmit(resolveKey)} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#D8DFF0]">Recipient payment key</span>
                  <input className="input-neon h-13 px-4 font-mono text-sm" placeholder="00000000-0000-0000-0000-000000000000" {...resolveForm.register("key")} />
                  <span className="mt-2 block min-h-5 text-xs text-[#FF86B2]">{resolveForm.formState.errors.key?.message}</span>
                </label>
                {errorMessage ? <ErrorBox message={errorMessage} /> : null}
                <button disabled={resolveMutation.isPending} className="btn-bet flex h-13 w-full items-center justify-center gap-2 text-sm font-black disabled:opacity-60">
                  {resolveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Resolve recipient
                </button>
              </form>
            ) : null}

            {step === 2 && resolved ? (
              <form onSubmit={payForm.handleSubmit(confirmPayment)} className="space-y-5">
                <RecipientCard user={resolved.user} paymentKey={resolved.key} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#D8DFF0]">Amount</span>
                    <input className="input-neon h-13 px-4" type="number" min={1} {...payForm.register("amount", { valueAsNumber: true })} />
                    <span className="mt-2 block min-h-5 text-xs text-[#FF86B2]">{payForm.formState.errors.amount?.message}</span>
                  </label>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs text-[#8892B0]">Current balance</p>
                    <p className="mt-2 text-2xl font-bold text-[#00FFA3]">{formatMoney(balance)}</p>
                  </div>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#D8DFF0]">Description</span>
                  <textarea className="input-neon min-h-24 px-4 py-3" {...payForm.register("description")} />
                </label>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8892B0]">Idempotency key</p>
                  <p className="mt-2 break-all font-mono text-xs text-[#00E5FF]">{idempotencyKey}</p>
                </div>
                {errorMessage ? <ErrorBox message={errorMessage} /> : null}
                <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                  <button type="button" onClick={() => setStep(1)} className="chip-btn flex h-13 items-center justify-center gap-2 px-5 text-sm">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button disabled={payMutation.isPending} className="btn-cashout flex h-13 items-center justify-center gap-2 text-sm font-black disabled:opacity-60">
                    {payMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Confirm transfer
                  </button>
                </div>
              </form>
            ) : null}

            {step === 3 ? (
              <div className="py-8 text-center">
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#00FFA3]/15">
                  <CheckCircle2 className="h-10 w-10 text-[#00FFA3]" />
                </motion.div>
                <h3 className="text-3xl font-black text-white">Transfer committed</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#8892B0]">Queries were invalidated and the dashboard will refresh balance and ledger rows.</p>
                <button onClick={onClose} className="btn-bet mt-7 h-12 px-6 text-sm font-bold">Close receipt</button>
              </div>
            ) : null}
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function RecipientCard({ user, paymentKey }: { user: ApiUser; paymentKey: string }) {
  return (
    <div className="rounded-3xl border border-[#00E5FF]/20 bg-[#00E5FF]/[0.06] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#00E5FF]">You are paying</p>
      <h3 className="mt-3 text-2xl font-black text-white">{user.name}</h3>
      <div className="mt-4 grid gap-3 text-sm text-[#AEB8CF] sm:grid-cols-2">
        <span>Email: {maskEmail(user.email)}</span>
        <span>Tax ID: ***{user.taxId.slice(-3)}</span>
        <span className="sm:col-span-2">Key: <span className="font-mono text-[#00E5FF]">{maskKey(paymentKey)}</span></span>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#FF2D75]/30 bg-[#FF2D75]/10 px-4 py-3 text-sm text-[#FFB6CF]">
      {message}
    </div>
  );
}
