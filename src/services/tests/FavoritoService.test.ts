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
      (favoritoRepository.create as jest.Mock).mockResolvedValue({ id: 1, produtoId: mockProdutoId });

      const result = await favoritoService.create(mockAuthToken, mockProdutoIdObject);

      expect(getAuthTokenId).toHaveBeenCalledWith(mockAuthToken);
      expect(favoritoRepository.create).toHaveBeenCalledWith(mockAuthTokenId, 123);
      expect(result).toEqual({ produtoId: mockProdutoId });
    });
  });

  describe('getAllForUser', () => {
    it('calls favoritoRepository.getAllForUser with correct parameters', async () => {
      const mockFavoritos = [
        {
          produto: {
            id: 1,
            nome: 'Livro Teste Exclusão 2',
            preco: 29.9,
            status: 'ATIVO',
            categoria: 'LIVRO',
            generos: ['ACAO'],
            qtdEstoque: 1,
            estadoConservacao: 'SEMINOVO',
            anoEdicao: null,
            anoLancamento: null,
            autores: 'Marvel',
            descricao: '',
            createdAt: new Date('2025-03-26T15:18:22.077Z'),
            updatedAt: new Date('2025-03-26T15:18:22.077Z'),
            seboId: 1,
            sebo: { id: 1, nome: 'Sebo Example', concordaVender: true },
            fotos: [{ id: 1, url: 'https://google.com', produtoId: 5 }],
          },
        },
      ];
      (favoritoRepository.getAllFavoritos as jest.Mock).mockResolvedValue(mockFavoritos);

      const result = await favoritoService.getFavoritos(mockAuthToken);

      expect(getAuthTokenId).toHaveBeenCalledWith(mockAuthToken);
      expect(favoritoRepository.getAllFavoritos).toHaveBeenCalledWith(mockAuthTokenId);
      expect(result).toEqual([
        {
          produtos: [
            {
              produto: {
                id: 1,
                nome: 'Livro Teste Exclusão 2',
                preco: 29.9,
                categoria: 'LIVRO',
                qtdEstoque: 1,
                fotos: [{ url: 'https://google.com' }],
              },
            },
          ],
          sebo: {
            id: 1,
            nome: 'Sebo Example',
            concordaVender: true,
          },
        },
      ]);
    });
  });

  describe('delete', () => {
    it('calls favoritoRepository.delete with correct parameters', async () => {
      (favoritoRepository.getFavorito as jest.Mock).mockResolvedValue({ id: 1, produtoId: mockProdutoId });

      (favoritoRepository.delete as jest.Mock).mockResolvedValue(true);

      await favoritoService.delete(mockAuthToken, mockProdutoId);

      expect(getAuthTokenId).toHaveBeenCalledWith(mockAuthToken);
      expect(favoritoRepository.getFavorito).toHaveBeenCalledWith(mockAuthTokenId, mockProdutoId);
      expect(favoritoRepository.delete).toHaveBeenCalledWith(mockAuthTokenId, mockProdutoId);
    });
  });
});
