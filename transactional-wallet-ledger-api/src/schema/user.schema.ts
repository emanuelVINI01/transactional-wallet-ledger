import z from "zod";

const emptyStringToUndefined = (value: unknown) => {
    if (typeof value === "string" && value.trim() === "") {
        return undefined;
    }

    return value;
};

const optionalPositiveInt = z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().positive().optional(),
);

const optionalDate = z.preprocess(
    emptyStringToUndefined,
    z.coerce.date().optional(),
);

export const transactionsQuerySchema = z.object({
    paidToTaxIdLast3: z.preprocess(
        emptyStringToUndefined,
        z.string().regex(/^\d{3}$/, "paidToTaxIdLast3 must contain exactly 3 digits").optional(),
    ),
    amount: optionalPositiveInt,
    minAmount: optionalPositiveInt,
    maxAmount: optionalPositiveInt,
    from: optionalDate,
    to: optionalDate,
    type: z.preprocess(
        emptyStringToUndefined,
        z.enum(["DEBIT", "CREDIT"]).optional(),
    ),
    referenceId: z.preprocess(
        emptyStringToUndefined,
        z.string().min(1).optional(),
    ),
    description: z.preprocess(
        emptyStringToUndefined,
        z.string().min(1).optional(),
    ),
    page: z.preprocess(
        emptyStringToUndefined,
        z.coerce.number().int().positive().default(1),
    ),
    limit: z.preprocess(
        emptyStringToUndefined,
        z.coerce.number().int().positive().max(100).default(20),
    ),
}).refine(
    ({ minAmount, maxAmount }) => !minAmount || !maxAmount || minAmount <= maxAmount,
    {
        message: "minAmount must be less than or equal to maxAmount",
        path: ["minAmount"],
    },
).refine(
    ({ from, to }) => !from || !to || from <= to,
    {
        message: "from must be before or equal to to",
        path: ["from"],
    },
);

export type TransactionsQuerySchema = z.infer<typeof transactionsQuerySchema>;
