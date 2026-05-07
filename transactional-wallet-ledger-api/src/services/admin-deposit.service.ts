import { prisma } from "@/src/plugins/prisma";
import { creditValue } from "@/src/services/balance.service";
import { createTransaction } from "@/src/services/transaction.service";

type UserLookup =
    | { userId: string; email?: never; taxId?: never }
    | { userId?: never; email: string; taxId?: never }
    | { userId?: never; email?: never; taxId: string };

export type AdminDepositInput = UserLookup & {
    amount: number;
    referenceId: string;
    description?: string;
};

export type AdminDepositResult =
    | { success: false; error: string }
    | {
        success: true;
        transactionId: string;
        userId: string;
        previousBalance: number;
        newBalance: number;
    };

export async function createAdminDeposit(input: AdminDepositInput): Promise<AdminDepositResult> {
    if (!Number.isSafeInteger(input.amount) || input.amount <= 0) {
        return {
            success: false,
            error: "Amount must be a positive integer",
        };
    }

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
            where: {
                ...(input.userId ? { id: input.userId } : {}),
                ...(input.email ? { email: input.email } : {}),
                ...(input.taxId ? { taxId: input.taxId } : {}),
            },
            select: {
                id: true,
                balance: true,
            },
        });

        if (!user) {
            return {
                success: false,
                error: "User not found",
            };
        }

        const credited = await creditValue(user.id, input.amount, tx);

        if (!credited) {
            throw new Error("Failed to credit user balance");
        }

        const transaction = await createTransaction(
            user.id,
            input.amount,
            "CREDIT",
            input.referenceId,
            input.description ?? "Admin bank deposit",
            tx,
        );

        return {
            success: true,
            transactionId: transaction.id,
            userId: user.id,
            previousBalance: user.balance,
            newBalance: user.balance + input.amount,
        };
    });
}
