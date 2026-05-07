import z from "zod";

export const transactionParamsSchema = z.object({
    id: z.uuid("Invalid transaction id"),
});

export type TransactionParamsSchema = z.infer<typeof transactionParamsSchema>;
