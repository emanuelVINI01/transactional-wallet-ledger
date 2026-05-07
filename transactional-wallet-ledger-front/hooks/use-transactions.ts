"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api-client";

export function useTransactions(enabled = true) {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await endpoints.transactions();
      return response.transactions;
    },
    enabled,
  });
}
