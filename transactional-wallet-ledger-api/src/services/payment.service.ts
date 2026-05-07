import { prisma } from "@/src/plugins/prisma";
import { checkAndDebitValue, creditValue } from "@/src/services/balance.service";
import { createTransaction } from "./transaction.service";


export interface PaymentResult {
    success: boolean;
    error?: string;
    transactionId?: string;
}

export async function payTo(
    userId: string,
    amount: number,
    paymentKeyId : string,
    reference: string,
    description?: string,
) : Promise<PaymentResult> {
    const result = await prisma.$transaction(async (tx) => {
        const paymentKey = await tx.paymentKey.findUnique({
            where: {
                id: paymentKeyId,
            },
            select: {
                user: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!paymentKey) {
            return {
                success: false,
                error: "Payment key not found",
            };
        }
        const targetId = paymentKey.user.id;

        if (targetId === userId) {
            return {
                success: false,
                error: "You cannot pay to yourself",
            };
        }


        const hasValue = await checkAndDebitValue(
            userId,
            amount,
            tx,
        );

        if (!hasValue) {
            return {
                success: false,
                error: "Insufficient balance",
            };
        }
        const transaction = await createTransaction(
            userId,
            amount,
            'DEBIT',
            reference,
            description,
            tx,
        );

        if (!transaction) {
            throw Error("Failed to create transaction");
        }

        await creditValue(targetId, amount, tx);

        const creditTransaction = await createTransaction(
            targetId,
            amount,
            'CREDIT',
            reference,
            description,
            tx,
        );

        if (!creditTransaction) {
            throw Error("Failed to create transaction");
        }

        return {
            success: true,
            transactionId: transaction.id,
        };
    });

    return result;
}
