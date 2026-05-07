import type { FastifyInstance } from "fastify";
import { paymentKeyParamsSchema } from "@/src/schema/payment-key.schema";
import { useSession } from "@/src/services/auth.service";
import {
    deletePaymentKey,
    findPaymentKey,
    findUserByPaymentKey,
    generateKeyForUser,
} from "@/src/services/payment-key.service";
import { parseOrReturnErrors } from "@/src/util/parser-util";

export async function paymentKeyRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        return useSession(request, reply, async (session) => {
            const paymentKey = await generateKeyForUser(session.user.id);

            if (!paymentKey) {
                return reply.status(409).send({ message: "Payment key limit reached" });
            }

            return reply.status(201).send({ paymentKey });
        });
    });

    app.get("/:key", async (request, reply) => {
        return useSession(request, reply, async () => {
            return parseOrReturnErrors(
                paymentKeyParamsSchema, request.params, reply,
                async ({ key }) => {
                    const paymentKey = await findPaymentKey(key);

                    if (!paymentKey) {
                        return reply.status(404).send({ message: "Payment key not found" });
                    }

                    return reply.status(200).send({ paymentKey });
                },
                "Invalid route params",
            );
        });
    });

    app.get("/:key/user", async (request, reply) => {
        return useSession(request, reply, async () => {
            return parseOrReturnErrors(
                paymentKeyParamsSchema, request.params, reply,
                async ({ key }) => {
                    const user = await findUserByPaymentKey(key);

                    if (!user) {
                        return reply.status(404).send({ message: "Payment key not found" });
                    }

                    return reply.status(200).send({ user });
                },
                "Invalid route params",
            );
        });
    });

    app.delete("/:key", async (request, reply) => {
        return useSession(request, reply, async (session) => {
            return parseOrReturnErrors(
                paymentKeyParamsSchema, request.params, reply,
                async ({ key }) => {
                    const deleted = await deletePaymentKey(key, session.user.id);

                    if (!deleted) {
                        return reply.status(404).send({ message: "Payment key not found" });
                    }

                    return reply.status(204).send();
                },
                "Invalid route params",
            );
        });
    });
}
