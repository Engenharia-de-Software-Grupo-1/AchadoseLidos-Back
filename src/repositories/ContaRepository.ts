import { Prisma } from "@prisma/client";
import { ContaRequestDTO } from "@src/models/ContaRequestDTO";
import { prismaClient } from "@src/lib/prismaClient";

class ContaRepository {

  async create(tx: Prisma.TransactionClient, data: ContaRequestDTO) {
    const conta = await tx.conta.create({
      data: {
        email: data.email,
        senha: data.senha,
        papel: data.papel,
      },
    });

    return conta;
  }

  async verificarEmailExiste(email: string) {
    const conta = await prismaClient.conta.findUnique({
      where: { email },
      select: { id: true },
    });
    return conta != null;
  }
}

export const contaRepository =  new ContaRepository();
