import express from 'express';
import request from 'supertest';
import { seboController } from '@src/controllers/SeboController';

import { seboRoutes } from '../sebo.routes';

const app = express();
app.use(express.json());
app.use('/sebos', seboRoutes);

jest.mock('@src/controllers/SeboController');
jest.mock('@src/middleware/authMiddleware', () => ({
  requireAuth: jest.fn((req, res, next) => next()),
  ensureIsSebo: jest.fn((req, res, next) => next()),
}));

describe('Sebo Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new sebo entry', async () => {
    (seboController.create as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(201).send({ message: 'mensagem teste para criação' });
    });

    const response = await request(app).post('/sebos/').send({ name: 'New Sebo' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('mensagem teste para criação');
    expect(seboController.create).toHaveBeenCalledTimes(1);
  });

  it('gets all sebo entries', async () => {
    (seboController.getAll as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send([{ id: 1, name: 'sebo teste 1' }]);
    });

    const response = await request(app).get('/sebos/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'sebo teste 1' }]);
    expect(seboController.getAll).toHaveBeenCalledTimes(1);
  });

  it('gets a sebo entry by id', async () => {
    (seboController.getById as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send({ id: 1, name: 'sebo teste 2' });
    });

    const response = await request(app).get('/sebos/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'sebo teste 2' });
    expect(seboController.getById).toHaveBeenCalledTimes(1);
  });

  it('updates a sebo entry by id', async () => {
    (seboController.update as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send({ message: 'mensagem teste para atualização' });
    });

    const response = await request(app).put('/sebos/1').send({ name: 'Updated Sebo' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('mensagem teste para atualização');
    expect(seboController.update).toHaveBeenCalledTimes(1);
  });

  it('deletes a sebo by id', async () => {
    (seboController.delete as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send({ message: 'mensagem teste para exclusão' });
    });

    const response = await request(app).delete('/sebos/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'mensagem teste para exclusão' });
  });
});
