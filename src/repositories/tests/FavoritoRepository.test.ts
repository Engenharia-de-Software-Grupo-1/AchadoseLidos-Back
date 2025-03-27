import prismaClient from '@src/lib/prismaClient';

import { favoritoRepository } from '../FavoritoRepository';

jest.mock('@src/lib/prismaClient');

describe('FavoritoRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a new favorite if it does not already exist', async () => {
      const usuarioId = 1;
      const produtoId = 2;

      (prismaClient.marcacaoFavorito.create as jest.Mock).mockResolvedValue({ id: 1, usuarioId, produtoId });

      const result = await favoritoRepository.create(usuarioId, produtoId);

      expect(prismaClient.marcacaoFavorito.create).toHaveBeenCalledWith({ data: { produtoId, usuarioId } });
      expect(result).toEqual({ id: 1, usuarioId, produtoId });
    });
  });

  describe('getAllForUser', () => {
    it('returns all favorites for a user', async () => {
      const usuarioId = 1;
      const favorites = [
        { usuarioId, produtoId: 2 },
        { usuarioId, produtoId: 3 },
      ];

      (prismaClient.marcacaoFavorito.findMany as jest.Mock).mockResolvedValue(favorites);

      const result = await favoritoRepository.getAllFavoritos(usuarioId);

      expect(prismaClient.marcacaoFavorito.findMany).toHaveBeenCalledWith({
        where: { usuarioId },
        select: {
          produto: {
            include: {
              sebo: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(favorites);
    });
  });

  describe('delete', () => {
    it('deletes a favorite if it exists', async () => {
      const usuarioId = 1;
      const produtoId = 2;

      (prismaClient.marcacaoFavorito.delete as jest.Mock).mockResolvedValue({ id: 1, usuarioId, produtoId });

      const result = await favoritoRepository.delete(usuarioId, produtoId);

      expect(prismaClient.marcacaoFavorito.delete).toHaveBeenCalledWith({
        where: { usuarioId_produtoId: { produtoId, usuarioId } },
      });
      expect(result).toEqual({ id: 1, usuarioId, produtoId });
    });
  });
});
