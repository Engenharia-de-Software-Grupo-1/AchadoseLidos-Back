import { TipoConta, Prisma, StatusConta } from '@prisma/client';
import prismaClient from '@src/lib/prismaClient';
import { ContaCreateDTO } from '@src/models/ContaSchema';
import { genSalt, hash } from 'bcrypt';

class ContaRepository {
  async create(tx: Prisma.TransactionClient, data: ContaCreateDTO, tipo: TipoConta) {
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(data.senha, salt);

    return tx.conta.create({
      data: {
        email: data.email,
        senha: hashedPassword,
        tipo: tipo,
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
      where: {
        email: email,
        status: StatusConta.ATIVA,
      },
    });
  }

  async atualizarStatus(id: number, status: StatusConta) {
    return prismaClient.conta.update({
      where: { id },
      data: { status },
    });
  }
}

export const contaRepository = new ContaRepository();
