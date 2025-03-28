import { AppError } from '@src/errors/AppError';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { FavoritoCreateDTO, FavoritoCreateSchema, FavoritoResponseSchema } from '@src/models/FavoritoSchema';
import { favoritoRepository } from '@src/repositories/FavoritoRepository';
import { getAuthTokenId } from '@src/utils/authUtils';

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

    return favoritoRepository.create(authTokenId, produtoId);
  }

  async getFavoritos(authToken: unknown) {
    const authTokenId = getAuthTokenId(authToken);

    const favoritos = await favoritoRepository.getAllFavoritos(authTokenId);

    const groupedFavoritos = favoritos.reduce(
      (acc, favorito) => {
        const seboKey = `${favorito.produto.sebo.id}-${favorito.produto.sebo.nome}`;
        if (!acc[seboKey]) {
          acc[seboKey] = {
            sebo: favorito.produto.sebo,
            produtos: [],
          };
        }
        acc[seboKey].produtos.push(favorito);
        return acc;
      },
      {} as Record<string, { sebo: { id: number; nome: string }; produtos: typeof favoritos }>,
    );

    const result = Object.values(groupedFavoritos);
    return FavoritoResponseSchema.parseAsync(result);
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
