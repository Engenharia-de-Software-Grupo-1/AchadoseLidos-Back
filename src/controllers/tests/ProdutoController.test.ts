import { Request, Response } from 'express';
import { produtoService } from '@src/services/ProdutoService';

import { produtoController } from '../ProdutoController';

jest.mock('@src/services/ProdutoService');

describe('ProdutoController', () => {
  it('returns 201 and the created entity when create is successful', async () => {
    const req = {
      body: {},
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (produtoService.create as jest.Mock).mockResolvedValueOnce(mockResult);

    await produtoController.create(req, res);

    expect(produtoService.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 200 and all entities when getAll is successful', async () => {
    const req = {} as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };

    (produtoService.getAll as jest.Mock).mockResolvedValueOnce(mockResult);

    await produtoController.getAll(req, res);

    expect(produtoService.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 200 and the entity when getById is successful', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (produtoService.getById as jest.Mock).mockResolvedValueOnce(mockResult);

    await produtoController.getById(req, res);

    expect(produtoService.getById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 200 and the updated entity when update is successful', async () => {
    const req = {
      params: {
        id: '1',
      },
      body: { someBodyKey: 'someBodyValue' },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (produtoService.update as jest.Mock).mockResolvedValueOnce(mockResult);

    await produtoController.update(req, res);

    expect(produtoService.update).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 204 and if the product is successfully deleted', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    (produtoService.delete as jest.Mock).mockResolvedValueOnce({ id: 1 });

    await produtoController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(produtoService.delete).toHaveBeenCalledWith(1);
  });
});
