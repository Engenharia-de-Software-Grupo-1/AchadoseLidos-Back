import { Request, Response } from 'express';
import { seboService } from '@src/services/SeboService';

import { seboController } from '../SeboController';

jest.mock('@src/services/SeboService');

describe('SeboController', () => {
  it('returns 201 and the created entity when create is successful', async () => {
    const req = {
      body: {},
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockResult = { someResultKey: 'someResultValue' };
    (seboService.create as jest.Mock).mockResolvedValueOnce(mockResult);

    await seboController.create(req, res);

    expect(seboService.create).toHaveBeenCalledWith(req.body);
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

    (seboService.getAll as jest.Mock).mockResolvedValueOnce(mockResult);

    await seboController.getAll(req, res);

    expect(seboService.getAll).toHaveBeenCalled();
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
    (seboService.getById as jest.Mock).mockResolvedValueOnce(mockResult);

    await seboController.getById(req, res);

    expect(seboService.getById).toHaveBeenCalledWith(1);
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
    (seboService.update as jest.Mock).mockResolvedValueOnce(mockResult);

    await seboController.update(req, res);

    expect(seboService.update).toHaveBeenCalledWith(1, req.body, 'testToken');
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

    (seboService.delete as jest.Mock).mockResolvedValueOnce('resolveu');

    await seboController.delete(req, res);

    expect(seboService.delete).toHaveBeenCalledWith(1, { id: 1 });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
