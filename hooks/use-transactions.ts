"use client";

import { useQuery } from "@tanstack/react-query";
import { parseJsonResponse, type ApiTransaction } from "@/lib/api-types";

export function useTransactions(enabled = true) {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch("/api/users/transactions?limit=50", { credentials: "same-origin" });
      const data = await parseJsonResponse<{ transactions: ApiTransaction[] }>(response, "Could not load transactions.");
      return data.transactions;
    },
    enabled,
  });
}
