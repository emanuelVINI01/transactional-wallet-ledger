import type { Prisma } from "@/prisma/generated";
import { prisma } from "@/src/plugins/prisma";

export const publicUserSelect = {
    id: true,
    name: true,
    email: true,
    taxId: true,
} satisfies Prisma.UserSelect;

export const sessionUserSelect = {
    ...publicUserSelect,
    balance: true,
    createdAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
    select: typeof publicUserSelect;
}>;

export async function findUserBySessionId(
    sessionId: string
) : Promise<PublicUser | null> {
    return await prisma.user.findFirst({
        where: {
            sessions: {
                some: {
                    id: sessionId,
                },
            },
        },
        select: publicUserSelect,
    });
}
