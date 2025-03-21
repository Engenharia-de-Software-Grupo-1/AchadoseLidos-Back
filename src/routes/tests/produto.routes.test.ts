import express from 'express';
import request from 'supertest';
import { produtoController } from '@src/controllers/ProdutoController';
import { reset } from 'module-alias';

import { produtoRoutes } from '../produto.route';

const app = express();
app.use(express.json());
app.use('/produtos', produtoRoutes);

jest.mock('@src/controllers/ProdutoController');

describe('Produto Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new product entry', async () => {
    (produtoController.create as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(201).send({ message: 'mensagem teste para criação' });
    });

    const response = await request(app).post('/produtos/').send({ name: 'new product' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('mensagem teste para criação');
    expect(produtoController.create).toHaveBeenCalledTimes(1);
  });

  it('gets all products entries', async () => {
    (produtoController.getAll as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send([{ id: 1, name: 'produto teste 1' }]);
    });

    const response = await request(app).get('/produtos/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'produto teste 1' }]);
    expect(produtoController.getAll).toHaveBeenCalledTimes(1);
  });

  it('gets a product entry by id', async () => {
    (produtoController.getById as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send({ id: 1, name: 'produto teste 2' });
    });

    const response = await request(app).get('/produtos/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'produto teste 2' });
    expect(produtoController.getById).toHaveBeenCalledTimes(1);
  });

  it('updates a product entry by id', async () => {
    (produtoController.update as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send({ message: 'mensagem teste para atualização' });
    });

    const response = await request(app).put('/produtos/1').send({ name: 'Updated product' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('mensagem teste para atualização');
    expect(produtoController.update).toHaveBeenCalledTimes(1);
  });

  it('deletes a product entry by id', async () => {
    (produtoController.delete as jest.Mock).mockImplementation((req, res) => {
      res.status(204).send();
    });

    const response = await request(app).delete('/produtos/1');

    expect(response.status).toBe(204);
    expect(produtoController.delete).toHaveBeenCalledTimes(1);
  });
});
