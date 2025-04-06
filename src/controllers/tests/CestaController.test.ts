import { Request, Response } from 'express';
import { cestaService } from '@src/services/CestaService';

import { cestaController } from '../CestaController';

jest.mock('@src/services/CestaService');

describe('CestaController', () => {
  it('returns 200 and the entity when getCesta is successful', async () => {
    const req = {} as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { decryptedToken: 'testToken' },
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (cestaService.getCesta as jest.Mock).mockResolvedValue(mockResult);

    await cestaController.getCesta(req, res);

    expect(cestaService.getCesta).toHaveBeenCalledWith('testToken');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 201 when adicionarProduto is sucessfull', async () => {
    const req = {
      body: { someBodyKey: 'someBodyValue' },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { decryptedToken: 'testToken' },
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (cestaService.adicionarProduto as jest.Mock).mockResolvedValue(mockResult);

    await cestaController.adicionarProduto(req, res);

    expect(cestaService.adicionarProduto).toHaveBeenCalledWith(req.body, 'testToken');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 200 when atualizarProduto is successfull', async () => {
    const req = {
      params: {
        produtoId: '1',
      },
      body: { someBodyKey: 'someBodyValue' },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { decryptedToken: 'testToken' },
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (cestaService.atualizarProduto as jest.Mock).mockResolvedValue(mockResult);

    await cestaController.atualizarProduto(req, res);

    expect(cestaService.atualizarProduto).toHaveBeenCalledWith(1, req.body, 'testToken');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 204 when removerProduto is successful', async () => {
    const req = {
      params: {
        produtoId: '1',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      locals: { decryptedToken: 'testToken' },
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (cestaService.removerProduto as jest.Mock).mockResolvedValue(mockResult);

    await cestaController.removerProduto(req, res);

    expect(cestaService.removerProduto).toHaveBeenCalledWith(1, 'testToken');
    expect(res.status).toHaveBeenCalledWith(204);
  });
});
