import { prisma } from "@/src/plugins/prisma";
import { checkAndDebitValue, creditValue } from "@/src/services/balance.service";
import { generatePaymentReceipt, type PaymentReceiptData } from "@/src/services/receipt.service";
import { createTransaction } from "./transaction.service";


export interface PaymentResult {
    success: boolean;
    error?: string;
    transactionId?: string;
    receiptUrl?: string;
}

type PaymentTransactionResult = (
    | { success: false; error: string }
    | {
        success: true;
        transactionId: string;
        debitReceiptData: PaymentReceiptData;
        creditReceiptData: PaymentReceiptData;
    }
);

export async function payTo(
    userId: string,
    amount: number,
    paymentKeyId : string,
    reference: string,
    description?: string,
) : Promise<PaymentResult> {
    const result: PaymentTransactionResult = await prisma.$transaction(async (tx) => {
        const paymentKey = await tx.paymentKey.findUnique({
            where: {
                id: paymentKeyId,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        taxId: true,
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
        const payer = await tx.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                taxId: true,
            },
        });

        if (!payer) {
            return {
                success: false,
                error: "Payer not found",
            };
        }

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
            {
                payerId: payer.id,
                receiverId: targetId,
            },
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
            {
                payerId: payer.id,
                receiverId: targetId,
            },
        );

        if (!creditTransaction) {
            throw Error("Failed to create transaction");
        }

        return {
            success: true,
            transactionId: transaction.id,
            debitReceiptData: {
                transactionId: transaction.id,
                referenceId: reference,
                amount,
                createdAt: transaction.createdAt,
                payer,
                receiver: paymentKey.user,
                ...(description ? { description } : {}),
            },
            creditReceiptData: {
                transactionId: creditTransaction.id,
                referenceId: reference,
                amount,
                createdAt: creditTransaction.createdAt,
                payer,
                receiver: paymentKey.user,
                ...(description ? { description } : {}),
            },
        };
    });

    if (!result.success) {
        return result;
    }

    await generatePaymentReceipt(result.debitReceiptData);
    await generatePaymentReceipt(result.creditReceiptData);

    return {
        success: true,
        transactionId: result.transactionId,
        receiptUrl: `/transactions/${result.transactionId}/receipt`,
    };
}
