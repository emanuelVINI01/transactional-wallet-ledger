"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api-client";

export function useResolvePaymentKey() {
  return useMutation({
    mutationFn: async (key: string) => {
      const response = await endpoints.resolvePaymentKey(key);
      return response.paymentKey;
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { paymentKey: string; amount: number; description?: string; idempotencyKey: string }) => {
      return endpoints.createPayment({
        paymentKey: input.paymentKey,
        amount: input.amount,
        description: input.description,
      }, input.idempotencyKey);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
