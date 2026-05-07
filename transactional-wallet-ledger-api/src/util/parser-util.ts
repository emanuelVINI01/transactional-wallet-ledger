import type { FastifyReply } from "fastify";
import { z } from "zod";

export async function parseOrReturnErrors<TSchema extends z.ZodType>(
    schema: TSchema,
    data: unknown,
    reply: FastifyReply,
    handler: (
        data: z.infer<TSchema>
    ) => Promise<FastifyReply>,
    errorMessage = "Invalid request body",
) : Promise<FastifyReply> {
    const safeParse = schema.safeParse(data);

    if (!safeParse.success) {
        return reply.status(400).send({
            message: errorMessage,
            errors: z.treeifyError(safeParse.error),
        });
    }

    return await handler(safeParse.data);
}
