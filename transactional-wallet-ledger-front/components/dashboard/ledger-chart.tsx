"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ApiTransaction } from "@/lib/api-client";

export function LedgerChart({ transactions }: { transactions: ApiTransaction[] }) {
  const data = transactions.slice(0, 8).reverse().map((transaction, index) => ({
    name: `T${index + 1}`,
    credit: transaction.type === "CREDIT" ? transaction.amount : 0,
    debit: transaction.type === "DEBIT" ? transaction.amount : 0,
  }));

  return (
    <div className="glass-surface-2 rounded-3xl p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">Movement shape</h2>
        <p className="mt-1 text-sm text-[#8892B0]">Last ledger rows grouped by direction.</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#8892B0" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#8892B0" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "#121826",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                color: "#E6EAF2",
              }}
            />
            <Bar dataKey="credit" fill="#00FFA3" radius={[8, 8, 0, 0]} />
            <Bar dataKey="debit" fill="#FF2D75" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
