import type { Prisma, Transaction, User } from "@prisma/client";
import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const USER_PAYMENT_KEY_LIMIT = 10;

export type PublicUser = Pick<User, "id" | "name" | "email" | "taxId" | "balance" | "createdAt">;

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  taxId: true,
  balance: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const paymentKeySelect = {
  id: true,
  key: true,
  userId: true,
  createdAt: true,
  user: {
    select: publicUserSelect,
  },
} satisfies Prisma.PaymentKeySelect;

export const transactionSelect = {
  id: true,
  userId: true,
  payerId: true,
  receiverId: true,
  amount: true,
  type: true,
  referenceId: true,
  description: true,
  createdAt: true,
  payer: {
    select: publicUserSelect,
  },
  receiver: {
    select: publicUserSelect,
  },
} satisfies Prisma.TransactionSelect;

export type PublicPaymentKey = Prisma.PaymentKeyGetPayload<{ select: typeof paymentKeySelect }>;
export type PublicTransaction = Prisma.TransactionGetPayload<{ select: typeof transactionSelect }> & {
  receiptUrl?: string;
};

export function publicUser(user: PublicUser) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };
}

export function publicPaymentKey(paymentKey: PublicPaymentKey) {
  return {
    ...paymentKey,
    createdAt: paymentKey.createdAt.toISOString(),
    user: publicUser(paymentKey.user),
  };
}

export function publicTransaction(transaction: PublicTransaction) {
  const hasReceipt = transaction.type === TransactionType.DEBIT && transaction.payerId && transaction.receiverId;

  return {
    ...transaction,
    createdAt: transaction.createdAt.toISOString(),
    receiptUrl: hasReceipt ? `/api/transactions/${transaction.id}/receipt` : transaction.receiptUrl,
  };
}

export async function findCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });
}

export async function createPaymentKey(userId: string) {
  const existingKeys = await prisma.paymentKey.count({ where: { userId } });

  if (existingKeys >= USER_PAYMENT_KEY_LIMIT) {
    throw new Error("Payment key limit reached.");
  }

  return prisma.paymentKey.create({
    data: {
      userId,
      key: crypto.randomUUID(),
    },
    select: paymentKeySelect,
  });
}

export async function createLedgerPayment(input: {
  amount: number;
  description?: string;
  idempotencyKey: string;
  payerId: string;
  paymentKeyId: string;
}) {
  const existingDebit = await prisma.transaction.findFirst({
    where: {
      userId: input.payerId,
      referenceId: input.idempotencyKey,
      type: TransactionType.DEBIT,
    },
    select: { id: true },
  });

  if (existingDebit) {
    return {
      success: true as const,
      transactionId: existingDebit.id,
      receiptUrl: `/api/transactions/${existingDebit.id}/receipt`,
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const paymentKey = await tx.paymentKey.findUnique({
      where: { id: input.paymentKeyId },
      select: {
        user: {
          select: publicUserSelect,
        },
      },
    });

    if (!paymentKey) {
      return { success: false as const, error: "Payment key not found." };
    }

    if (paymentKey.user.id === input.payerId) {
      return { success: false as const, error: "You cannot pay yourself." };
    }

    const payer = await tx.user.findUnique({
      where: { id: input.payerId },
      select: publicUserSelect,
    });

    if (!payer) {
      return { success: false as const, error: "Authenticated user not found." };
    }

    const debit = await tx.user.updateMany({
      where: {
        id: input.payerId,
        balance: { gte: input.amount },
      },
      data: {
        balance: { decrement: input.amount },
      },
    });

    if (debit.count === 0) {
      return { success: false as const, error: "Insufficient balance." };
    }

    await tx.user.update({
      where: { id: paymentKey.user.id },
      data: {
        balance: { increment: input.amount },
      },
    });

    const transactionData = {
      amount: input.amount,
      referenceId: input.idempotencyKey,
      description: input.description || null,
      payerId: payer.id,
      receiverId: paymentKey.user.id,
    };

    const debitTransaction = await tx.transaction.create({
      data: {
        ...transactionData,
        userId: payer.id,
        type: TransactionType.DEBIT,
      },
    });

    await tx.transaction.create({
      data: {
        ...transactionData,
        userId: paymentKey.user.id,
        type: TransactionType.CREDIT,
      },
    });

    return {
      success: true as const,
      transactionId: debitTransaction.id,
      receiptUrl: `/api/transactions/${debitTransaction.id}/receipt`,
    };
  });

  return result;
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdfLines(transaction: Transaction & { payer: PublicUser | null; receiver: PublicUser | null }) {
  return [
    "Transactional Wallet Ledger",
    "Payment receipt",
    `Transaction: ${transaction.id}`,
    `Reference: ${transaction.referenceId}`,
    `Amount: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(transaction.amount)}`,
    `Date: ${transaction.createdAt.toISOString()}`,
    `Payer: ${transaction.payer?.name ?? "Unknown"} (${transaction.payer?.email ?? "hidden"})`,
    `Receiver: ${transaction.receiver?.name ?? "Unknown"} (${transaction.receiver?.email ?? "hidden"})`,
    `Description: ${transaction.description ?? "No description provided"}`,
  ];
}

export function generateReceiptPdf(transaction: Transaction & { payer: PublicUser | null; receiver: PublicUser | null }) {
  const lines = buildPdfLines(transaction);
  const content = [
    "BT",
    "/F1 22 Tf",
    "50 770 Td",
    `(${escapePdfText(lines[0])}) Tj`,
    "/F1 16 Tf",
    "0 -36 Td",
    `(${escapePdfText(lines[1])}) Tj`,
    "/F1 10 Tf",
    ...lines.slice(2).flatMap((line) => ["0 -24 Td", `(${escapePdfText(line)}) Tj`]),
    "ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];

  const chunks = ["%PDF-1.4\n"];
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(chunks.join("")));
    chunks.push(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });

  const xrefOffset = Buffer.byteLength(chunks.join(""));
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((offset) => {
    chunks.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  });
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return Buffer.from(chunks.join(""));
}
