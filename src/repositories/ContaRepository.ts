import { prisma } from "@src/lib/prisma";
import { ContaRequestDTO } from "@src/models/ContaRequestDTO";
import { Prisma } from "@prisma/client";

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
    const conta = await prisma.conta.findUnique({
      where: { email },
      select: { id: true },
    });
    return conta != null;
  }
}

export const contaRepository =  new ContaRepository();
