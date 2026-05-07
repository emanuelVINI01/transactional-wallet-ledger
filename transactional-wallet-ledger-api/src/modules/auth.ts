import type { FastifyInstance } from "fastify";
import { loginSchema, registerSchema } from "@/src/schema/auth.schema";
import { login, register } from "@/src/services/auth.service";
import { parseOrReturnErrors } from "../util/parser-util";

export async function authRoutes(app: FastifyInstance) {
    app.post("/login", async (request, reply) => {
        return parseOrReturnErrors(
            loginSchema, request.body, reply,
            async ({ email, password }) => {

                const session = await login(email, password);

                if (!session) {
                    return reply.status(401).send({ message: "Invalid email or password" });
                }

                return reply.status(200).send({ session });
            });
    });

    app.post("/register", async (request, reply) => {
        return parseOrReturnErrors(
            registerSchema, request.body, reply,
            async ({ name, email, taxId, password }) => {

                const user = await register(name, email, taxId, password);

                if (!user) {
                    return reply.status(409).send({ message: "User already exists" });
                }

                return reply.status(201).send({ user });
            });
    });
}
