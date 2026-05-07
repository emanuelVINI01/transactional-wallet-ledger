import z from "zod";

export const paymentKeyParamsSchema = z.object({
    key: z.uuid("Invalid payment key"),
});

export type PaymentKeyParamsSchema = z.infer<typeof paymentKeyParamsSchema>;
