import { favoritoRepository } from '@src/repositories/FavoritoRepository';
import { getAuthTokenId } from '@src/utils/authUtils';

import { favoritoService } from '../FavoritoService';

jest.mock('@src/repositories/FavoritoRepository');
jest.mock('@src/utils/authUtils');

describe('FavoritoService', () => {
  const mockAuthToken = 'mockAuthToken';
  const mockAuthTokenId = 1;
  const mockProdutoId = 123;

  beforeEach(() => {
    (getAuthTokenId as jest.Mock).mockReturnValue(mockAuthTokenId);
  });

  describe('create', () => {
    it('calls favoritoRepository.create with correct parameters', async () => {
      (favoritoRepository.create as jest.Mock).mockResolvedValue({ id: 1, produtoId: mockProdutoId });

      const result = await favoritoService.create(mockAuthToken, mockProdutoId);

      expect(getAuthTokenId).toHaveBeenCalledWith(mockAuthToken);
      expect(favoritoRepository.create).toHaveBeenCalledWith(mockAuthTokenId, mockProdutoId);
      expect(result).toEqual({ id: 1, produtoId: mockProdutoId });
    });
  });

  describe('getAllForUser', () => {
    it('calls favoritoRepository.getAllForUser with correct parameters', async () => {
      const mockFavoritos = [{ id: 1, produtoId: mockProdutoId }];
      (favoritoRepository.getAllForUser as jest.Mock).mockResolvedValue(mockFavoritos);

      const result = await favoritoService.getAllForUser(mockAuthToken);

      expect(getAuthTokenId).toHaveBeenCalledWith(mockAuthToken);
      expect(favoritoRepository.getAllForUser).toHaveBeenCalledWith(mockAuthTokenId);
      expect(result).toEqual(mockFavoritos);
    });
  });

  describe('delete', () => {
    it('calls favoritoRepository.delete with correct parameters', async () => {
      (favoritoRepository.delete as jest.Mock).mockResolvedValue(true);

      const result = await favoritoService.delete(mockAuthToken, mockProdutoId);

      expect(getAuthTokenId).toHaveBeenCalledWith(mockAuthToken);
      expect(favoritoRepository.delete).toHaveBeenCalledWith(mockAuthTokenId, mockProdutoId);
      expect(result).toBe(true);
    });
  });
});
