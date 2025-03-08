import express from 'express';
import request from 'supertest';

import { contaRoutes } from '../conta.routes';

const app = express();
app.use(express.json());
app.use('/conta', contaRoutes);

jest.mock('@src/controllers/ContaController', () => ({
  contaController: {
    validarEmail: jest.fn((req, res) => res.status(200).send({ message: 'mensagem de email validado' })),
    delete: jest.fn((req, res) => res.status(200).send({ message: 'mensagem de conta deletada' })),
  },
}));

describe('Conta Routes', () => {
  it('validates email', async () => {
    const response = await request(app).get('/conta/validar_email');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'mensagem de email validado' });
  });

  it('deletes conta by id', async () => {
    const response = await request(app).delete('/conta/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'mensagem de conta deletada' });
  });
});
