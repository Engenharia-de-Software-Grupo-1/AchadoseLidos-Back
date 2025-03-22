import express from 'express';
import request from 'supertest';

import { contaRoutes } from '../conta.routes';

const app = express();
app.use(express.json());
app.use('/conta', contaRoutes);
jest.mock('@src/middlewares/authMiddleware', () => ({
  getAuth: jest.fn((req, res, next) => next()),
  requireAuth: jest.fn((req, res, next) => next()),
}));

jest.mock('@src/controllers/ContaController', () => ({
  contaController: {
    validarEmail: jest.fn((req, res) => res.status(200).send({ message: 'mensagem de email validado' })),
    delete: jest.fn((req, res) => res.status(200).send({ message: 'mensagem de conta deletada' })),
    login: jest.fn((req, res) => res.status(200).send({ message: 'mensagem de login' })),
    logout: jest.fn((req, res) => res.status(200).send({ message: 'mensagem de logout' })),
  },
}));

describe('Conta Routes', () => {
  it('loga', async () => {
    const response = await request(app).post('/conta/login');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'mensagem de login' });
  });

  it('validates email', async () => {
    const response = await request(app).get('/conta/validar_email');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'mensagem de email validado' });
  });

  it('desloga', async () => {
    const response = await request(app).post('/conta/logout');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'mensagem de logout' });
  });
});
