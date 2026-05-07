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
    },
  });
}
