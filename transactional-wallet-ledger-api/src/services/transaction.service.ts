import type { Prisma, TransactionType } from "@/prisma/generated";
import { prisma } from "@/src/plugins/prisma";
import type { TransactionsQuerySchema } from "@/src/schema/user.schema";

export const publicTransactionSelect = {
    id: true,
    userId: true,
    amount: true,
    type: true,
    referenceId: true,
    description: true,
    createdAt: true,
} satisfies Prisma.TransactionSelect;

export type PublicTransaction = Prisma.TransactionGetPayload<{
    select: typeof publicTransactionSelect;
}>;

export async function createTransaction(
    userId: string,
    amount: number,
    type: TransactionType,
    referenceId: string,
    description?: string,
    tx: Prisma.TransactionClient = prisma
) {
    return tx.transaction.create({
        data: {
            userId,
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
): Promise<PublicTransaction[]> {
    const where: Prisma.TransactionWhereInput = {
        userId,
    };

    if (filters.paidToTaxIdLast3) {
        if (filters.type === "CREDIT") {
            return [];
        }

        const paidReferences = await prisma.transaction.findMany({
            where: {
                type: "CREDIT",
                userId: {
                    not: userId,
                },
                user: {
                    taxId: {
                        endsWith: filters.paidToTaxIdLast3,
                    },
                },
            },
            distinct: ["referenceId"],
            select: {
                referenceId: true,
            },
        });

        const referenceIds = paidReferences.map(({ referenceId }) => referenceId);

        if (referenceIds.length === 0) {
            return [];
        }

        where.type = "DEBIT";
        where.referenceId = {
            in: referenceIds,
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

    return prisma.transaction.findMany({
        where,
        select: publicTransactionSelect,
        orderBy: {
            createdAt: "desc",
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
    });
}
