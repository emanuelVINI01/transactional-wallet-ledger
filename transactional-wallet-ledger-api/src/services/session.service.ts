import type { Prisma } from "@/prisma/generated";
import { prisma } from "@/src/plugins/prisma";
import { sessionUserSelect } from "@/src/services/user.service";
import { randomBytes } from "crypto";

const SESSION_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;

export const publicSessionSelect = {
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    expiresAt: true,
    token: true,
    user: {
        select: sessionUserSelect,
    },
} satisfies Prisma.SessionSelect;

export type PublicSession = Prisma.SessionGetPayload<{
    select: typeof publicSessionSelect;
}>;

export async function findSessionByToken(token: string) : Promise<PublicSession | null> {
    return await prisma.session.findUnique({
        where: {
            token,
        },
        select: publicSessionSelect,
    });
}



export async function revokeSession(token: string) : Promise<boolean> {
    return (await prisma.session.deleteMany({
        where: {
            token,
        },
    })).count > 0;
}

export async function createSession(
    userId: string, 
    expireDate?: Date
) : Promise<PublicSession> {
    const token = randomBytes(32).toString("hex");

    return await prisma.session.create({
        data: {
            token,
            expiresAt: expireDate ?? new Date(Date.now() + SESSION_EXPIRE_TIME),
            userId,
        },
        select: publicSessionSelect,
    });
}
