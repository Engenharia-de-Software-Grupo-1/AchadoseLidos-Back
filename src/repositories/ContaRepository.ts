import { TipoConta, Prisma, StatusConta } from '@prisma/client';
import prismaClient from '@src/lib/prismaClient';
import { ContaCreateDTO } from '@src/models/ContaSchema';
import { gerarHashSenha } from '@src/utils/authUtils';

class ContaRepository {
  async create(tx: Prisma.TransactionClient, data: ContaCreateDTO, tipo: TipoConta) {
    const hashSenha = await gerarHashSenha(data.senha);
    return tx.conta.create({
      data: {
        email: data.email,
        senha: hashSenha,
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
      include: {
        sebo: true,
        usuario: true,
      },
    });
  }

  async getByResetToken(token: string) {
    return await prismaClient.conta.findFirst({
      where: {
        resetToken: token,
      },
    });
  }

  async salvarResetToken(email: string, token: string, expiresAt: Date) {
    const conta = await this.getByEmail(email);
    await prismaClient.conta.update({
      where: { id: conta?.id },
      data: {
        resetToken: token,
        resetTokenExpiresAt: expiresAt,
      },
    });
  }

  async atualizarSenha(id: number, senha: string) {
    return prismaClient.conta.update({
      where: { id },
      data: {
        senha,
        resetToken: null,
        resetTokenExpiresAt: null,
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
