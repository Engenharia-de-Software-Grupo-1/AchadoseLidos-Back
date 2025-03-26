import { AlreadyFavoritedError } from '@src/errors/AlreadyFavoritedError';
import { FavoriteNotFoundError } from '@src/errors/FavoriteNotFoundError';
import { ProdutoNotFoundError } from '@src/errors/ProdutoNotFoundError';
import { favoritoRepository } from '@src/repositories/FavoritoRepository';
import { produtoRepository } from '@src/repositories/ProdutoRepository';
import { getAuthTokenId } from '@src/utils/authUtils';

class FavoritoService {
  async create(authToken: unknown, produtoId: number) {
    const authTokenId = getAuthTokenId(authToken);
    const produto = await produtoRepository.getById(produtoId);
    if (!produto) {
      throw new ProdutoNotFoundError();
    }

    const favorito = await favoritoRepository.getFavorito(authTokenId, produtoId);
    if (favorito) {
      throw new AlreadyFavoritedError();
    }

    return await favoritoRepository.create(authTokenId, produtoId);
  }

  async getFavoritos(authToken: unknown) {
    const authTokenId = getAuthTokenId(authToken);

    return await favoritoRepository.getAllFavoritos(authTokenId);
  }

  async delete(authToken: unknown, produtoId: number) {
    const authTokenId = getAuthTokenId(authToken);
    const produto = await produtoRepository.getById(produtoId);
    if (!produto) {
      throw new ProdutoNotFoundError();
    }

    const favorito = await favoritoRepository.getFavorito(authTokenId, produtoId);
    if (!favorito) {
      throw new FavoriteNotFoundError();
    }

    return await favoritoRepository.delete(authTokenId, produtoId);
  }
}

export const favoritoService = new FavoritoService();
