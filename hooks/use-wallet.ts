"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseJsonResponse, type ApiPaymentKey, type ApiUser } from "@/lib/api-types";

export function useWallet(enabled = true) {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/users/me", { credentials: "same-origin" });
      const data = await parseJsonResponse<{ user: ApiUser }>(response, "Could not load wallet profile.");
      return data.user;
    },
    enabled,
  });
}

export function useCreatePaymentKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/payment-keys", {
        method: "POST",
        credentials: "same-origin",
      });
      const data = await parseJsonResponse<{ paymentKey: ApiPaymentKey }>(response, "Could not create payment key.");
      return data.paymentKey;
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
      const response = await fetch("/api/payment-keys", { credentials: "same-origin" });
      const data = await parseJsonResponse<{ paymentKeys: ApiPaymentKey[] }>(response, "Could not load payment keys.");
      return data.paymentKeys;
    },
    enabled,
  });
}

export function useDeletePaymentKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      const response = await fetch(`/api/payment-keys/${encodeURIComponent(key)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (response.status === 204) return;

      await parseJsonResponse<unknown>(response, "Could not delete payment key.");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["payment-keys"] });
    },
  });
}
