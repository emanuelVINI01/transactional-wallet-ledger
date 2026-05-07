import type { FastifyInstance } from "fastify";
import { useSession } from "../services/auth.service";
import { transactionsQuerySchema } from "@/src/schema/user.schema";
import { findUserTransactions } from "@/src/services/transaction.service";
import { parseOrReturnErrors } from "@/src/util/parser-util";

export async function userRoutes(app: FastifyInstance) {
    app.get("/me", async (request, reply) => {
        return useSession(request, reply, async (session) => {
            return reply.status(200).send({
                user: session.user,
            });
        });
    });
    app.get("/transactions", async (request, reply) => {
        return parseOrReturnErrors(
            transactionsQuerySchema, request.query, reply,
            async (query) => useSession(request, reply, async (session) => {
                const transactions = await findUserTransactions(session.user.id, query);

                return reply.status(200).send({ transactions });
            }),
            "Invalid query params",
        );
    });
}
