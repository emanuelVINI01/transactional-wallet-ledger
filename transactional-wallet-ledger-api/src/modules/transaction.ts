import { createReadStream } from "node:fs";
import type { FastifyInstance } from "fastify";
import { transactionParamsSchema } from "@/src/schema/transaction.schema";
import { prisma } from "@/src/plugins/prisma";
import { useSession } from "@/src/services/auth.service";
import { getReceiptPath, receiptExists } from "@/src/services/receipt.service";
import { parseOrReturnErrors } from "@/src/util/parser-util";

export async function transactionRoutes(app: FastifyInstance) {
    app.get("/:id/receipt", async (request, reply) => {
        return useSession(request, reply, async (session) => {
            return parseOrReturnErrors(
                transactionParamsSchema, request.params, reply,
                async ({ id }) => {
                    const transaction = await prisma.transaction.findFirst({
                        where: {
                            id,
                            userId: session.user.id,
                        },
                        select: {
                            id: true,
                        },
                    });

                    if (!transaction || !receiptExists(id)) {
                        return reply.status(404).send({ message: "Receipt not found" });
                    }

                    return reply
                        .header("Content-Type", "application/pdf")
                        .header("Content-Disposition", `inline; filename="${id}.pdf"`)
                        .send(createReadStream(getReceiptPath(id)));
                },
                "Invalid route params",
            );
        });
    });
}
