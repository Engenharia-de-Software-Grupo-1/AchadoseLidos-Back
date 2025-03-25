import { favoritoRepository } from '@src/repositories/FavoritoRepository';
import { getAuthTokenId } from '@src/utils/authUtils';

class FavoritoService {
  async create(authToken: unknown, produtoId: number) {
    const authTokenId = getAuthTokenId(authToken);

    return await favoritoRepository.create(authTokenId, produtoId);
  }

  async getAllForUser(authToken: unknown) {
    const authTokenId = getAuthTokenId(authToken);

    return await favoritoRepository.getAllForUser(authTokenId);
  }

  async delete(authToken: unknown, produtoId: number) {
    const authTokenId = getAuthTokenId(authToken);

    return await favoritoRepository.delete(authTokenId, produtoId);
  }
}

export const favoritoService = new FavoritoService();
