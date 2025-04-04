import express from 'express';
import request from 'supertest';
import { cestaController } from '@src/controllers/CestaController';
import { ensureIsUsuario } from '@src/middlewares/authMiddleware';

import { cestaRoutes } from '../cesta.routes';

const app = express();
app.use(express.json());
app.use('/cestas', cestaRoutes);

jest.mock('@src/controllers/CestaController');
jest.mock('@src/middlewares/authMiddleware', () => ({
  requireAuth: jest.fn((req, res, next) => next()),
  ensureIsUsuario: jest.fn((req, res, next) => next()),
}));

describe('Cesta Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets a basket entry', async () => {
    (cestaController.getCesta as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send({ message: 'Cesta retornada com sucesso' });
    });

    const response = await request(app).get('/cestas/');

    expect(ensureIsUsuario).toHaveBeenCalled();
    expect(cestaController.getCesta).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Cesta retornada com sucesso' });
  });

  it("adds a product to a use's basket", async () => {
    (cestaController.adicionarProduto as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(201).send({ message: 'Produto adicionado com sucesso' });
    });

    const response = await request(app).post('/cestas/produtos').send({ name: 'produto' });

    expect(ensureIsUsuario).toHaveBeenCalled();
    expect(cestaController.adicionarProduto).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Produto adicionado com sucesso' });
  });

  it("updates a product in a user's basket", async () => {
    (cestaController.atualizarProduto as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send({ message: 'Produto atualizado com sucesso' });
    });

    const response = await request(app).put('/cestas/produtos/1').send({ name: 'produto atualizado' });

    expect(ensureIsUsuario).toHaveBeenCalled();
    expect(cestaController.atualizarProduto).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Produto atualizado com sucesso' });
  });

  it("removes a product from a user's basket", async () => {
    (cestaController.removerProduto as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(204).send();
    });

    const response = await request(app).delete('/cestas/produtos/1');

    expect(ensureIsUsuario).toHaveBeenCalled();
    expect(cestaController.removerProduto).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(204);
  });
});
