import prismaClient from '@src/lib/prismaClient';
import { Prisma } from '@prisma/client';
import { CestaUpdateDTO } from '@src/models/CestaSchema';

class CestaRepository {
  async getCesta(usuarioId: number) {
    return prismaClient.cestaProduto.findMany({
      where: { usuarioId },
      include: {
        produto: { include: { sebo: true, fotos: true } },
      },
    });
  }

  async addProduto(usuarioId: number, produtoId: number) {
    return prismaClient.cestaProduto.create({
      data: { quantidade: 1, usuarioId, produtoId },
    });
  }

  async getProduto(usuarioId: number, produtoId: number) {
    return prismaClient.cestaProduto.findUnique({
      where: {
        usuarioId_produtoId: {
          usuarioId,
          produtoId,
        },
      },
    });
  }

  async updateProduto(usuarioId: number, produtoId: number, data: CestaUpdateDTO) {
    return prismaClient.cestaProduto.update({
      where: {
        usuarioId_produtoId: {
          usuarioId,
          produtoId,
        },
      },
      data,
    });
  }

  async deleteProduto(usuarioId: number, produtoId: number) {
    await prismaClient.cestaProduto.delete({
      where: {
        usuarioId_produtoId: {
          usuarioId,
          produtoId,
        },
      },
    });
  }

  async deleteAllByUsuarioId(tx: Prisma.TransactionClient, usuarioId: number) {
    await tx.cestaProduto.deleteMany({
      where: { usuarioId },
    });
  }

  async deleteAllByProdutoId(tx: Prisma.TransactionClient, produtoId: number) {
    await tx.cestaProduto.deleteMany({
      where: { produtoId },
    });
  }
}

export const cestaRepository = new CestaRepository();
