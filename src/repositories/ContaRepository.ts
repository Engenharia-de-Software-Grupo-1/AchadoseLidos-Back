import { Papel, Prisma, Status } from "@prisma/client";
import { ContaRequestDTO } from "@src/models/ContaRequestDTO";
import { prismaClient } from "@src/lib/prismaClient";

class ContaRepository {

  async create(tx: Prisma.TransactionClient, data: ContaRequestDTO, papel: Papel) {
    return tx.conta.create({
      data: {
        email: data.email,
        senha: data.senha,
        papel: papel,
      },
    });
  }

  async getById(id: number) {
    return prismaClient.conta.findUnique({
      where: { id },
    });
  }

  async getByEmail(email: string) {
    return await prismaClient.conta.findUnique({
      where: { email },
    });
  }

  async atualizarStatus(id: number, status: Status) {
    return prismaClient.conta.update({
      where: { id },
      data: { status },
    });
  }
}

export const contaRepository =  new ContaRepository();
