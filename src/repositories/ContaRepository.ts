import { Prisma } from "@prisma/client";
import { ContaRequestDTO } from "@src/models/ContaRequestDTO";
import { prismaClient } from "@src/lib/prismaClient";

class ContaRepository {

  async create(tx: Prisma.TransactionClient, conta: ContaRequestDTO) {
    const contaCriada = await tx.conta.create({
      data: {
        email: conta.email,
        senha: conta.senha,
        papel: conta.papel,
      },
    });

    return contaCriada;
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
