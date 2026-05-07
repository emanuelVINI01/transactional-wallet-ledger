import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";
import type { ApiTransaction } from "@/lib/api-client";
import { formatDate, formatMoney } from "@/lib/format";

export function TransactionTable({ transactions }: { transactions: ApiTransaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="glass-surface-2 flex min-h-[280px] flex-col items-center justify-center rounded-3xl p-8 text-center">
        <ReceiptText className="mb-4 h-10 w-10 text-[#00E5FF]" />
        <h3 className="text-xl font-bold text-white">No ledger movements yet</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[#8892B0]">Create a payment key or send a transfer to start building an auditable transaction history.</p>
      </div>
    );
  }

  return (
    <div className="glass-surface-2 overflow-hidden rounded-3xl">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-lg font-bold text-white">Ledger transactions</h2>
        <p className="mt-1 text-sm text-[#8892B0]">Debit and credit rows returned by the Fastify API.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.16em] text-[#8892B0]">
            <tr>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {transactions.map((transaction) => {
              const isCredit = transaction.type === "CREDIT";
              return (
                <tr key={transaction.id} className="text-sm text-[#D8DFF0]">
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${isCredit ? "bg-[#00FFA3]/10 text-[#00FFA3]" : "bg-[#FF2D75]/10 text-[#FF86B2]"}`}>
                      {isCredit ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-white">{formatMoney(transaction.amount)}</td>
                  <td className="px-5 py-4 font-mono text-xs text-[#00E5FF]">{transaction.referenceId.slice(0, 12)}...</td>
                  <td className="px-5 py-4 text-[#AEB8CF]">{transaction.description ?? "No description"}</td>
                  <td className="px-5 py-4 text-[#8892B0]">{formatDate(transaction.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
