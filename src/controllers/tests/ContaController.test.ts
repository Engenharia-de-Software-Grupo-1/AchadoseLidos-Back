import { Request, Response } from 'express';
import { contaService } from '@src/services/ContaService';

import { contaController } from '../ContaController';

jest.mock('@src/services/ContaService');

describe('ContaController', () => {
  it('returns 200 and a success message if email is valid', async () => {
    const req = {
      query: {
        email: 'test@example.com',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (contaService.validarEmail as jest.Mock).mockResolvedValueOnce('resolveu');

    await contaController.validarEmail(req, res);

    expect(contaService.validarEmail).toHaveBeenCalledWith('test@example.com');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'E-mail disponível' });
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
    } as unknown as Response;

    (contaService.delete as jest.Mock).mockResolvedValueOnce('resolveu');

    await contaController.delete(req, res);

    expect(contaService.delete).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
