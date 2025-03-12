import { TipoConta, Prisma, StatusConta } from '@prisma/client';
import prismaClient from '@src/lib/prismaClient';
import { ContaCreateDTO, ContaUpdateDTO } from '@src/models/ContaSchema';
import { genSalt, hash } from 'bcrypt';

class ContaRepository {
  async create(tx: Prisma.TransactionClient, data: ContaCreateDTO, tipo: TipoConta) {
    const hashedPassword = await this.gerarHashSenha(data.senha);

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
    return await prismaClient.conta.findFirst({
      where: {
        email: email,
        status: StatusConta.ATIVA,
      },
    });
  }

  async atualizarSenha(data: ContaUpdateDTO) {
    const conta = await this.getByEmail(data.email);
    const hashedPassword = await this.gerarHashSenha(data.senha);

    return prismaClient.conta.update({
      where: { id: conta?.id },
      data: { senha: hashedPassword },
    });
  }

  async atualizarStatus(id: number, status: StatusConta) {
    return prismaClient.conta.update({
      where: { id },
      data: { status },
    });
  }

  private async gerarHashSenha(senha: string) {
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    return hash(senha, salt);
  }
}

export const contaRepository = new ContaRepository();
