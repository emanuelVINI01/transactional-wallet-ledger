import bcrypt from "bcrypt";
import type { FastifyReply, FastifyRequest } from "fastify";
import { createSession, findSessionByToken } from "@/src/services/session.service";
import type { PublicSession } from "@/src/services/session.service";
import { publicUserSelect } from "@/src/services/user.service";
import type { PublicUser } from "@/src/services/user.service";
import { prisma } from "../plugins/prisma";

export async function useSession(
    request: FastifyRequest,
    reply: FastifyReply,
    handler: (session: PublicSession) => Promise<FastifyReply>
): Promise<FastifyReply> {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return reply.status(401).send({ message: "Token não enviado" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return reply.status(401).send({ message: "Token mal formatado" });
    }
    const session = await findSessionByToken(token);

    if (!session) {
        return reply.status(401).send({ message: "Sessão não encontrada" });
    }

    if (session.expiresAt < new Date()) {
        return reply.status(401).send({ message: "Sessão expirada" });
    }

    return await handler(session);
}

export async function login(
    email: string,
    password: string
): Promise<PublicSession | null> {
    const user = await prisma.user.findFirst({
        where: {
            email,
        },
        select: {
            id: true,
            password: true,
        },
    });

    if (!user) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        return null;
    }

    return await createSession(user.id);
}

export async function register(
    name: string,
    email: string,
    taxId: string,
    password: string,
): Promise<PublicUser | null> {
    const existingUserWithTaxIdOrEmail = await prisma.user.findFirst({
        where: {
            OR: [
                { taxId },
                { email },
            ],
        },
        select: {
            id: true,
        },
    });

    if (existingUserWithTaxIdOrEmail) {
        return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            taxId,
        },
        select: publicUserSelect,
    });
}
