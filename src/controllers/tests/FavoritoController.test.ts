import { Request, Response } from 'express';
import { favoritoController } from '@src/controllers/FavoritoController';
import { favoritoService } from '@src/services/FavoritoService';

jest.mock('@src/services/FavoritoService');

describe('FavoritoController', () => {
  const mockAuthToken = 'mockAuthToken';
  const mockProdutoId = 1;

  const jsonMock = jest.fn();
  const statusMock = jest.fn().mockReturnValue({ json: jsonMock, send: jest.fn() });

  const mockRequest: Partial<Request> = {
    body: { produtoId: mockProdutoId },
  };
  const mockResponse: Partial<Response> = {
    locals: { decryptedToken: mockAuthToken },
    status: statusMock,
  };

  describe('create', () => {
    it('creates a favorito and return 201 status', async () => {
      const mockResponseData = { id: 1, produtoId: mockProdutoId };
      (favoritoService.create as jest.Mock).mockResolvedValue(mockResponseData);

      await favoritoController.create(mockRequest as Request, mockResponse as Response);

      expect(favoritoService.create).toHaveBeenCalledWith(mockAuthToken, mockProdutoId);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockResponseData);
    });
  });

  describe('getAllForUser', () => {
    it('returns all favoritos for a user with 200 status', async () => {
      const mockResponseData = [{ id: 1, produtoId: mockProdutoId }];
      (favoritoService.getAllForUser as jest.Mock).mockResolvedValue(mockResponseData);

      await favoritoController.getAllForUser(mockRequest as Request, mockResponse as Response);

      expect(favoritoService.getAllForUser).toHaveBeenCalledWith(mockAuthToken);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockResponseData);
    });
  });

  describe('delete', () => {
    it('deletes a favorito and return 204 status', async () => {
      (favoritoService.delete as jest.Mock).mockResolvedValue(undefined);

      await favoritoController.delete(mockRequest as Request, mockResponse as Response);

      expect(favoritoService.delete).toHaveBeenCalledWith(mockAuthToken, mockProdutoId);
      expect(statusMock).toHaveBeenCalledWith(204);
    });
  });
});
