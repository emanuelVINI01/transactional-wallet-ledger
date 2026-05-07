import type { Prisma } from "@/prisma/generated";
import { prisma } from "@/src/plugins/prisma";

/**
 * Validates if the user has enough balance and debits it in a single atomic operation.
 * Valida se o usuário tem saldo suficiente e realiza o débito em uma operação atômica.
 * 
 * @param userId User identifier / Identificador do usuário
 * @param amount Amount to debit / Valor a debitar
 * @param tx Optional transaction client / Cliente de transação opcional
 * @returns True if successful, false otherwise / Verdadeiro se bem sucedido, falso caso contrário
 */
export async function checkAndDebitValue(userId: string, amount: number, tx: Prisma.TransactionClient = prisma) {
  // Verificamos se o usuário é um bot (para isenção financeira)
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { balance: true }
  });

  if (!user) return false;

  const updatedUser = await tx.user.updateMany({
    where: {
      id: userId,
      balance: { gte: amount }
    },
    data: {
      balance: { decrement: amount }
    }
  });

  return updatedUser.count > 0;
}

export async function creditValue(
  userId: string,
  amount: number,
  tx: Prisma.TransactionClient = prisma
) : Promise<boolean> {
  return (await tx.user.updateMany({
    where: {
      id: userId,
    },
    data: {
      balance: { increment: amount }
    }
  })).count > 0
}

