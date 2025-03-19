import { Request, Response } from 'express';
import { contaService } from '@src/services/ContaService';

import { contaController } from '../ContaController';

jest.mock('@src/services/ContaService');
jest.mock('@src/utils/auth', () => ({
  cookieExpirationTimeInMilliseconds: 1000,
}));

describe('ContaController', () => {
  describe('login', () => {
    it('returns 200 and sets a cookie if login is successful', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          senha: 'password123',
        },
      } as unknown as Request;

      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockToken = 'exampleToken';

      (contaService.login as jest.Mock).mockResolvedValueOnce(mockToken);

      await contaController.login(req, res);

      expect(contaService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(res.cookie).toHaveBeenCalledWith('authToken', mockToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expect.any(Number),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });
  });

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
      locals: { decryptedToken: { id: 1 } },
    } as unknown as Response;

    (contaService.delete as jest.Mock).mockResolvedValueOnce('resolveu');

    await contaController.delete(req, res);

    expect(contaService.delete).toHaveBeenCalledWith(1, { id: 1 });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('clears the authToken cookie and send a 200 status', async () => {
    const req = {} as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response;

    (contaService.logout as jest.Mock).mockImplementation((res: Response) => {
      res.cookie('authToken', '', { maxAge: 1 });
      res.status(200).send();
    });

    await contaController.logout(req, res);

    expect(res.cookie).toHaveBeenCalledWith('authToken', '', { maxAge: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });
});
