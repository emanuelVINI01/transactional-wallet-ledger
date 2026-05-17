import { ApiError } from "@/lib/api-types";

async function receiptBlob(transactionId: string) {
  const response = await fetch(`/api/transactions/${encodeURIComponent(transactionId)}/receipt`, {
    credentials: "same-origin",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null;
    throw new ApiError(payload?.message ?? "Could not fetch receipt PDF.", response.status);
  }

  return response.blob();
}

export async function openReceiptPdf(transactionId: string) {
  const blob = await receiptBlob(transactionId);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");

  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function downloadReceiptPdf(transactionId: string) {
  const blob = await receiptBlob(transactionId);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `transaction-receipt-${transactionId}.pdf`;
  anchor.click();

  URL.revokeObjectURL(url);
}
