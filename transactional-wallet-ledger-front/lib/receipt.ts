import { endpoints } from "@/lib/api-client";

export async function openReceiptPdf(transactionId: string) {
  const blob = await endpoints.receipt(transactionId);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");

  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function downloadReceiptPdf(transactionId: string) {
  const blob = await endpoints.receipt(transactionId);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `transaction-receipt-${transactionId}.pdf`;
  anchor.click();

  URL.revokeObjectURL(url);
}
