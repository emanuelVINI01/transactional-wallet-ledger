import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { createPaymentSchema } from "@/src/schema/payment.schema";
import { payTo } from "@/src/services/payment.service";
import { findPaymentKey } from "@/src/services/payment-key.service";
import { useSession } from "@/src/services/auth.service";
import { parseOrReturnErrors } from "@/src/util/parser-util";

export async function paymentRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        return useSession(request, reply, async (session) => {
            return parseOrReturnErrors(
                createPaymentSchema, request.body, reply,
                async ({ paymentKey, amount, description }) => {
                    const result = await payTo(
                        session.user.id,
                        amount,
                        paymentKey,
                        randomUUID(),
                        description,
                    );

                    if (!result.success) {
                        return reply.status(400).send({ message: result.error });
                    }

                    return reply.status(201).send(result);
                },
            );
        });
    });
}
