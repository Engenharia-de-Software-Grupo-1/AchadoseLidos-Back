import { AlreadyFavoritedError } from '@src/errors/AlreadyFavoritedError';
import { FavoriteNotFoundError } from '@src/errors/FavoriteNotFoundError';
import prismaClient from '@src/lib/prismaClient';

class FavoritoRepository {
  async create(usuarioId: number, produtoId: number) {
    const favorito = await prismaClient.marcacaoFavorito.findFirst({ where: { produtoId, usuarioId } });

    if (favorito) {
      throw new AlreadyFavoritedError();
    }

    return await prismaClient.marcacaoFavorito.create({ data: { produtoId, usuarioId } });
  }

  async getAllForUser(usuarioId: number) {
    return await prismaClient.marcacaoFavorito.findMany({ where: { usuarioId } });
  }

  async delete(usuarioId: number, produtoId: number) {
    const favorito = await prismaClient.marcacaoFavorito.findFirst({ where: { produtoId, usuarioId } });

    if (!favorito) {
      throw new FavoriteNotFoundError();
    }

    return await prismaClient.marcacaoFavorito.delete({ where: { usuarioId_produtoId: { produtoId, usuarioId } } });
  }
}

export const favoritoRepository = new FavoritoRepository();
