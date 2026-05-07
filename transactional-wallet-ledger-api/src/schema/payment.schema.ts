import z from "zod";

export const createPaymentSchema = z.object({
    paymentKey: z.uuid("Invalid payment key"),
    amount: z.coerce.number().int().positive("Amount must be greater than zero"),
    description: z.string().trim().min(1).max(255).optional(),
});

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;
