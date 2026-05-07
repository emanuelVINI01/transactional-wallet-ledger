import type { Prisma, TransactionType } from "@/prisma/generated";
import { prisma } from "@/src/plugins/prisma";
import type { TransactionsQuerySchema } from "@/src/schema/user.schema";

export const publicTransactionSelect = {
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
        select: {
            id: true,
            name: true,
            email: true,
            taxId: true,
        },
    },
    receiver: {
        select: {
            id: true,
            name: true,
            email: true,
            taxId: true,
        },
    },
} satisfies Prisma.TransactionSelect;

export type PublicTransaction = Prisma.TransactionGetPayload<{
    select: typeof publicTransactionSelect;
}>;

export type PublicTransactionWithReceipt = PublicTransaction & {
    receiptUrl?: string;
};

type TransferParties = {
    payerId: string;
    receiverId: string;
};

export async function createTransaction(
    userId: string,
    amount: number,
    type: TransactionType,
    referenceId: string,
    description?: string,
    tx: Prisma.TransactionClient = prisma,
    transferParties?: TransferParties,
) {
    return tx.transaction.create({
        data: {
            userId,
            ...(transferParties ? {
                payerId: transferParties.payerId,
                receiverId: transferParties.receiverId,
            } : {}),
            amount,
            type,
            referenceId,
            description: description || null
        },
    });
}

export async function findUserTransactions(
    userId: string,
    filters: TransactionsQuerySchema,
): Promise<PublicTransactionWithReceipt[]> {
    const where: Prisma.TransactionWhereInput = {
        userId,
    };

    if (filters.paidToTaxIdLast3) {
        if (filters.type === "CREDIT") {
            return [];
        }

        where.type = "DEBIT";
        where.receiver = {
            taxId: {
                endsWith: filters.paidToTaxIdLast3,
            },
        };
    } else if (filters.type) {
        where.type = filters.type;
    }

    if (filters.referenceId) {
        where.referenceId = filters.paidToTaxIdLast3
            ? {
                ...(where.referenceId as Prisma.StringFilter<"Transaction">),
                equals: filters.referenceId,
            }
            : filters.referenceId;
    }

    if (filters.description) {
        where.description = {
            contains: filters.description,
        };
    }

    if (filters.amount) {
        where.amount = filters.amount;
    } else if (filters.minAmount || filters.maxAmount) {
        where.amount = {
            ...(filters.minAmount ? { gte: filters.minAmount } : {}),
            ...(filters.maxAmount ? { lte: filters.maxAmount } : {}),
        };
    }

    if (filters.from || filters.to) {
        where.createdAt = {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: filters.to } : {}),
        };
    }

    const transactions = await prisma.transaction.findMany({
        where,
        select: publicTransactionSelect,
        orderBy: {
            createdAt: "desc",
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
    });

    return transactions.map((transaction) => transaction.type === "DEBIT" || (transaction.payer && transaction.receiver)
        ? {
            ...transaction,
            receiptUrl: `/transactions/${transaction.id}/receipt`,
        }
        : transaction,
    );
}
