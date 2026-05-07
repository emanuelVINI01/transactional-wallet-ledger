
import type { Prisma } from "@/prisma/generated";
import { prisma } from "@/src/plugins/prisma";
import { publicUserSelect } from "@/src/services/user.service";

const USER_KEY_LIMIT = 10

export const publicPaymentKeySelect = {
    id: true,
    key: true,
    userId: true,
    createdAt: true,
    user: {
        select: publicUserSelect,
    },
} satisfies Prisma.PaymentKeySelect;

export type PublicPaymentKey = Prisma.PaymentKeyGetPayload<{
    select: typeof publicPaymentKeySelect;
}>;

export type PublicPaymentKeyUser = PublicPaymentKey["user"];

export async function generateKeyForUser(
    userId: string
) : Promise<PublicPaymentKey | null> {

    const userKeys = await prisma.paymentKey.count({
        where: {
            userId,
        }
    });

    if (userKeys >= USER_KEY_LIMIT) {
        return null;
    }

    const key = crypto.randomUUID()

    return await prisma.paymentKey.create({
        data: {
            key,
            userId,
        },
        select: publicPaymentKeySelect,
    });
}

export async function findPaymentKey(
    key: string,
) : Promise<PublicPaymentKey | null> {
    return await prisma.paymentKey.findUnique({
        where: {
            key,
        },
        select: publicPaymentKeySelect,
    });
}

export async function findUserByPaymentKey(
    key: string,
) : Promise<PublicPaymentKeyUser | null> {
    const paymentKey = await findPaymentKey(key);

    return paymentKey?.user ?? null;
}

export async function deletePaymentKey(
    key: string,
    userId: string,
) : Promise<boolean> {
    return (await prisma.paymentKey.deleteMany({
        where: {
            key,
            userId,
        },
    })).count > 0;
}
