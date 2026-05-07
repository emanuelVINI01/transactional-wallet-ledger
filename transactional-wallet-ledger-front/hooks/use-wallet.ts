"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api-client";

export function useWallet(enabled = true) {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await endpoints.me();
      return response.user;
    },
    enabled,
  });
}

export function useCreatePaymentKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await endpoints.createPaymentKey();
      return response.paymentKey;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      void queryClient.invalidateQueries({ queryKey: ["payment-keys"] });
    },
  });
}

export function usePaymentKeys(enabled = true) {
  return useQuery({
    queryKey: ["payment-keys"],
    queryFn: async () => {
      const response = await endpoints.paymentKeys();
      return response.paymentKeys;
    },
    enabled,
  });
}

export function useDeletePaymentKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: endpoints.deletePaymentKey,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["payment-keys"] });
    },
  });
}
