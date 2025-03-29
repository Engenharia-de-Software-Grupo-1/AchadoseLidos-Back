import { Request, Response } from 'express';
import { usuarioService } from '@src/services/UsuarioService';

import { usuarioController } from '../UsuarioController';

jest.mock('@src/services/UsuarioService');

describe('UsuarioController', () => {
  it('returns 201 and the created entity when create is successful', async () => {
    const req = {
      body: {},
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (usuarioService.create as jest.Mock).mockResolvedValueOnce(mockResult);

    await usuarioController.create(req, res);

    expect(usuarioService.create).toHaveBeenCalledWith(req.body);
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

    (usuarioService.getAll as jest.Mock).mockResolvedValueOnce(mockResult);

    await usuarioController.getAll(req, res);

    expect(usuarioService.getAll).toHaveBeenCalled();
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
    (usuarioService.getById as jest.Mock).mockResolvedValueOnce(mockResult);

    await usuarioController.getById(req, res);

    expect(usuarioService.getById).toHaveBeenCalledWith(1);
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
      locals: { decryptedToken: 'testToken' },
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (usuarioService.update as jest.Mock).mockResolvedValueOnce(mockResult);

    await usuarioController.update(req, res);

    expect(usuarioService.update).toHaveBeenCalledWith(1, req.body, 'testToken');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 204 if the account is successfully deleted', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      locals: { decryptedToken: { id: 1 } },
    } as unknown as Response;

    (usuarioService.delete as jest.Mock).mockResolvedValueOnce('resolveu');

    await usuarioController.delete(req, res);

    expect(usuarioService.delete).toHaveBeenCalledWith(1, { id: 1 });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
