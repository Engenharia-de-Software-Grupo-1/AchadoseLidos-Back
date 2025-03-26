import prismaClient from '@src/lib/prismaClient';

class FavoritoRepository {
  async create(usuarioId: number, produtoId: number) {
    return await prismaClient.marcacaoFavorito.create({ data: { produtoId, usuarioId } });
  }

  async getFavorito(usuarioId: number, produtoId: number) {
    return await prismaClient.marcacaoFavorito.findFirst({ where: { produtoId, usuarioId } });
  }

  async getAllFavoritos(usuarioId: number) {
    return await prismaClient.marcacaoFavorito.findMany({ where: { usuarioId } });
  }

  async delete(usuarioId: number, produtoId: number) {
    return await prismaClient.marcacaoFavorito.delete({ where: { usuarioId_produtoId: { produtoId, usuarioId } } });
  }
}

export const favoritoRepository = new FavoritoRepository();
