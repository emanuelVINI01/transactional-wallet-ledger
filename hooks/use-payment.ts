"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseJsonResponse, type ApiPaymentKey } from "@/lib/api-types";

export function useResolvePaymentKey() {
  return useMutation({
    mutationFn: async (key: string) => {
      const response = await fetch(`/api/payment-keys/${encodeURIComponent(key)}`, { credentials: "same-origin" });
      const data = await parseJsonResponse<{ paymentKey: ApiPaymentKey }>(response, "Could not resolve payment key.");
      return data.paymentKey;
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { paymentKey: string; amount: number; description?: string; idempotencyKey: string }) => {
      const response = await fetch("/api/payments", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": input.idempotencyKey,
        },
        body: JSON.stringify({
          paymentKey: input.paymentKey,
          amount: input.amount,
          description: input.description,
        }),
      });

      return parseJsonResponse<{ success: boolean; transactionId?: string; receiptUrl?: string; error?: string }>(response, "Could not create payment.");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
