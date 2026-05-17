"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ExternalLink, Loader2, Search, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useCreatePayment, useResolvePaymentKey } from "@/hooks/use-payment";
import { ApiError, type ApiPaymentKey, type ApiUser } from "@/lib/api-types";
import { formatMoney, formatTaxId, makeIdempotencyKey, maskEmail, maskKey } from "@/lib/format";
import { openReceiptPdf } from "@/lib/receipt";

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
  const [receipt, setReceipt] = useState<{ transactionId: string; receiptUrl?: string } | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [openingReceipt, setOpeningReceipt] = useState(false);
  const resolveMutation = useResolvePaymentKey();
  const payMutation = useCreatePayment();
  const resolveForm = useForm<ResolveForm>({ resolver: zodResolver(resolveSchema), defaultValues: { key: "" } });
  const payForm = useForm<PayForm>({ resolver: zodResolver(paySchema), defaultValues: { amount: 1, description: "" } });

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      setStep(1);
      setResolved(null);
      setReceipt(null);
      setReceiptError(null);
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
    const response = await payMutation.mutateAsync({
      paymentKey: resolved.id,
      amount: values.amount,
      description: values.description,
      idempotencyKey,
    });
    if (response.transactionId) {
      setReceipt({ transactionId: response.transactionId, receiptUrl: response.receiptUrl });
    }
    setStep(3);
  }

  async function accessReceipt() {
    if (!receipt?.transactionId) return;

    try {
      setReceiptError(null);
      setOpeningReceipt(true);
      await openReceiptPdf(receipt.transactionId);
    } catch (error) {
      setReceiptError(error instanceof ApiError ? error.message : "Could not open receipt PDF.");
    } finally {
      setOpeningReceipt(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-lg sm:items-center sm:p-4"
        >
          <motion.section
            initial={{ y: 18, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="glass-surface max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-[26px] p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:max-h-[88vh] sm:rounded-2xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8be9fd]">Two-step transfer</p>
                <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Send ledger payment</h2>
              </div>
              <button onClick={onClose} className="chip-btn flex h-10 w-10 items-center justify-center" aria-label="Close modal">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2">
              {["Resolve key", "Confirm", "Receipt"].map((label, index) => (
                <motion.div
                  key={label}
                  animate={{
                    scale: step === index + 1 ? 1.02 : 1,
                    opacity: step >= index + 1 ? 1 : 0.58,
                  }}
                  className={`rounded-2xl px-2 py-2 text-center text-[11px] font-bold sm:text-xs ${step >= index + 1 ? "bg-[#bd93f9]/25 text-white" : "bg-white/[0.04] text-[#a7b0c8]"}`}
                >
                  {label}
                </motion.div>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {step === 1 ? (
                <StepPanel key="resolve">
                  <form onSubmit={resolveForm.handleSubmit(resolveKey)} className="space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">Recipient payment key</span>
                      <input className="input-neon h-12 px-4 font-mono text-sm" placeholder="00000000-0000-0000-0000-000000000000" {...resolveForm.register("key")} />
                      <span className="mt-2 block min-h-5 text-xs text-[#ff79c6]">{resolveForm.formState.errors.key?.message}</span>
                    </label>
                    {errorMessage ? <ErrorBox message={errorMessage} /> : null}
                    <button disabled={resolveMutation.isPending} className="btn-bet flex h-12 w-full items-center justify-center gap-2 text-sm font-black disabled:opacity-60">
                      {resolveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      Resolve recipient
                    </button>
                  </form>
                </StepPanel>
              ) : null}

              {step === 2 && resolved ? (
                <StepPanel key="confirm">
                  <form onSubmit={payForm.handleSubmit(confirmPayment)} className="space-y-4">
                    <RecipientCard user={resolved.user} paymentKey={resolved.key} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">Amount</span>
                        <input className="input-neon h-12 px-4" type="number" min={1} {...payForm.register("amount", { valueAsNumber: true })} />
                        <span className="mt-2 block min-h-5 text-xs text-[#ff79c6]">{payForm.formState.errors.amount?.message}</span>
                      </label>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                        <p className="text-xs text-[#a7b0c8]">Current balance</p>
                        <p className="mt-2 text-xl font-bold text-[#50fa7b]">{formatMoney(balance)}</p>
                      </div>
                    </div>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#f8f8f2]">Description</span>
                      <textarea className="input-neon min-h-20 px-4 py-3" {...payForm.register("description")} />
                    </label>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#a7b0c8]">Idempotency key</p>
                      <p className="mt-2 break-all font-mono text-[11px] text-[#8be9fd]">{idempotencyKey}</p>
                    </div>
                    {errorMessage ? <ErrorBox message={errorMessage} /> : null}
                    <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                      <button type="button" onClick={() => setStep(1)} className="chip-btn flex h-12 items-center justify-center gap-2 px-5 text-sm">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                      <button disabled={payMutation.isPending} className="btn-cashout flex h-12 items-center justify-center gap-2 text-sm font-black disabled:opacity-60">
                        {payMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Confirm transfer
                      </button>
                    </div>
                  </form>
                </StepPanel>
              ) : null}

              {step === 3 ? (
                <StepPanel key="receipt">
                  <div className="py-5 text-center">
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#50fa7b]/15">
                      <CheckCircle2 className="h-8 w-8 text-[#50fa7b]" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-white">Transfer committed</h3>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#a7b0c8]">The receipt PDF was generated by the API and attached to the debit transaction.</p>
                    {receipt?.transactionId ? (
                      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3 text-left">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#a7b0c8]">Receipt transaction</p>
                        <p className="mt-2 break-all font-mono text-xs text-[#8be9fd]">{receipt.transactionId}</p>
                      </div>
                    ) : null}
                    {receiptError ? <div className="mt-4"><ErrorBox message={receiptError} /></div> : null}
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button onClick={accessReceipt} disabled={!receipt?.transactionId || openingReceipt} className="btn-cashout flex h-12 items-center justify-center gap-2 text-sm font-bold disabled:opacity-60">
                        {openingReceipt ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                        Open PDF receipt
                      </button>
                      <button onClick={onClose} className="chip-btn h-12 px-6 text-sm font-bold">Close</button>
                    </div>
                  </div>
                </StepPanel>
              ) : null}
            </AnimatePresence>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -18, filter: "blur(6px)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function RecipientCard({ user, paymentKey }: { user: ApiUser; paymentKey: string }) {
  return (
    <div className="rounded-xl border border-[#8be9fd]/20 bg-[#8be9fd]/[0.06] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8be9fd]">You are paying</p>
      <h3 className="mt-3 text-xl font-black text-white">{user.name}</h3>
      <div className="mt-4 grid gap-2 text-sm text-[#a7b0c8] sm:grid-cols-2">
        <span>Email: {maskEmail(user.email)}</span>
        <span>Tax ID: {formatTaxId(user.taxId)}</span>
        <span className="sm:col-span-2">Key: <span className="font-mono text-[#8be9fd]">{maskKey(paymentKey)}</span></span>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#ff79c6]/30 bg-[#ff79c6]/10 px-4 py-3 text-sm text-[#ff79c6]">
      {message}
    </div>
  );
}
