import { Prisma } from '@prisma/client';
import prismaClient from '@src/lib/prismaClient';

class FavoritoRepository {
  async create(usuarioId: number, produtoId: number) {
    return prismaClient.marcacaoFavorito.create({ data: { produtoId, usuarioId } });
  }

  async getFavorito(usuarioId: number, produtoId: number) {
    return prismaClient.marcacaoFavorito.findFirst({ where: { produtoId, usuarioId } });
  }

  async getAllFavoritos(usuarioId: number) {
    return prismaClient.marcacaoFavorito.findMany({
      where: { usuarioId },
      select: {
        produto: { include: { sebo: true, fotos: true } },
      },
    });
  }

  async delete(usuarioId: number, produtoId: number) {
    await prismaClient.marcacaoFavorito.delete({
      where: {
        usuarioId_produtoId: {
          produtoId,
          usuarioId,
        },
      },
    });
  }

  async deleteAllByUsuarioId(tx: Prisma.TransactionClient, usuarioId: number) {
    await tx.marcacaoFavorito.deleteMany({
      where: { usuarioId },
    });
  }

  async deleteAllByProdutoId(tx: Prisma.TransactionClient, produtoId: number) {
    await tx.marcacaoFavorito.deleteMany({
      where: { produtoId },
    });
  }
}

export const favoritoRepository = new FavoritoRepository();
