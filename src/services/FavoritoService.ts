import { AppError } from '@src/errors/AppError';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import {
  FavoritoAgrupadoSchema,
  FavoritoCreateDTO,
  FavoritoCreateSchema,
  FavoritoResponseSchema,
} from '@src/models/FavoritoSchema';
import { favoritoRepository } from '@src/repositories/FavoritoRepository';
import { getAuthTokenId } from '@src/utils/authUtils';
import { groupBySebo } from '@src/utils/groupBySebo';

import { produtoService } from './ProdutoService';

class FavoritoService {
  async create(authToken: unknown, data: FavoritoCreateDTO) {
    const authTokenId = getAuthTokenId(authToken);
    const { produtoId } = FavoritoCreateSchema.parse(data);

    await produtoService.validarProduto(produtoId);

    const favorito = await favoritoRepository.getFavorito(authTokenId, produtoId);
    if (favorito) {
      throw new AppError('Produto já favoritado', 409);
    }

    const result = await favoritoRepository.create(authTokenId, produtoId);
    return FavoritoResponseSchema.parseAsync(result);
  }

  async getFavoritos(authToken: unknown) {
    const authTokenId = getAuthTokenId(authToken);

    const favoritos = await favoritoRepository.getAllFavoritos(authTokenId);
    const favoritosAgrupados = groupBySebo(favoritos);
    return FavoritoAgrupadoSchema.array().parseAsync(favoritosAgrupados);
  }

  async delete(authToken: unknown, produtoId: number) {
    const authTokenId = getAuthTokenId(authToken);
    await produtoService.validarProduto(produtoId);

    const favorito = await favoritoRepository.getFavorito(authTokenId, produtoId);
    if (!favorito) {
      throw new EntityNotFoundError(produtoId);
    }

    await favoritoRepository.delete(authTokenId, produtoId);
  }
}

export const favoritoService = new FavoritoService();
