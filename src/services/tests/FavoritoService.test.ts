import { favoritoRepository } from '@src/repositories/FavoritoRepository';
import { produtoRepository } from '@src/repositories/ProdutoRepository';
import { getAuthTokenId } from '@src/utils/authUtils';

import { favoritoService } from '../FavoritoService';

const mockAuthToken = 'mockAuthToken';
const mockAuthTokenId = 1;
const mockProdutoIdObject = { produtoId: 123 };
const mockProdutoId = 123;

jest.mock('@src/repositories/FavoritoRepository');
jest.mock('@src/utils/authUtils');
jest.mock('@src/repositories/ProdutoRepository');

beforeEach(() => {
  (produtoRepository.getById as jest.Mock).mockResolvedValue({ id: mockProdutoId });
});

describe('FavoritoService', () => {
  beforeEach(() => {
    (getAuthTokenId as jest.Mock).mockReturnValue(mockAuthTokenId);
  });

  describe('create', () => {
    it('calls favoritoRepository.create with correct parameters', async () => {
      (favoritoRepository.create as jest.Mock).mockResolvedValue({ id: 1, produtoId: mockProdutoIdObject });

      const result = await favoritoService.create(mockAuthToken, mockProdutoIdObject);

      expect(getAuthTokenId).toHaveBeenCalledWith(mockAuthToken);
      expect(favoritoRepository.create).toHaveBeenCalledWith(mockAuthTokenId, 123);
      expect(result).toEqual({ id: 1, produtoId: mockProdutoIdObject });
    });
  });

  describe('getAllForUser', () => {
    it('calls favoritoRepository.getAllForUser with correct parameters', async () => {
      const mockFavoritos = [
        {
          id: 1,
          produto: {
            id: mockProdutoId,
            sebo: { id: 1, nome: 'Sebo Example' },
          },
        },
      ];
      (favoritoRepository.getAllFavoritos as jest.Mock).mockResolvedValue(mockFavoritos);

      const result = await favoritoService.getFavoritos(mockAuthToken);

      expect(getAuthTokenId).toHaveBeenCalledWith(mockAuthToken);
      expect(favoritoRepository.getAllFavoritos).toHaveBeenCalledWith(mockAuthTokenId);
      expect(result).toEqual([
        {
          sebo: { id: 1, nome: 'Sebo Example' },
          produtos: mockFavoritos,
        },
      ]);
    });
  });

  describe('delete', () => {
    it('calls favoritoRepository.delete with correct parameters', async () => {
      (favoritoRepository.getFavorito as jest.Mock).mockResolvedValue({ id: 1, produtoId: mockProdutoId });

      (favoritoRepository.delete as jest.Mock).mockResolvedValue(true);

      const result = await favoritoService.delete(mockAuthToken, mockProdutoId);

      expect(getAuthTokenId).toHaveBeenCalledWith(mockAuthToken);
      expect(favoritoRepository.getFavorito).toHaveBeenCalledWith(mockAuthTokenId, mockProdutoId);
      expect(favoritoRepository.delete).toHaveBeenCalledWith(mockAuthTokenId, mockProdutoId);
      expect(result).toBe(true);
    });
  });
});
