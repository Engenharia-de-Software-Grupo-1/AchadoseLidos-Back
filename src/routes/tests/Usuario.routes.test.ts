import express from 'express';
import request from 'supertest';
import { usuarioController } from '@src/controllers/UsuarioController';

import { usuarioRoutes } from '../usuario.routes';

const app = express();
app.use(express.json());
app.use('/usuarios', usuarioRoutes);

jest.mock('@src/controllers/UsuarioController');
jest.mock('@src/middlewares/authMiddleware', () => ({
  requireAuth: jest.fn((req, res, next) => next()),
  ensureIsUsuario: jest.fn((req, res, next) => next()),
}));

describe('Usuario Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new usuario entry', async () => {
    (usuarioController.create as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(201).send({ message: 'Mensagem teste para criação' });
    });

    const response = await request(app).post('/usuarios/').send({ name: 'New Usuario' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Mensagem teste para criação');
    expect(usuarioController.create).toHaveBeenCalledTimes(1);
  });

  it('gets all usuario entries', async () => {
    (usuarioController.getAll as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send([{ id: 1, name: 'Usuario teste 1' }]);
    });

    const response = await request(app).get('/usuarios/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Usuario teste 1' }]);
    expect(usuarioController.getAll).toHaveBeenCalledTimes(1);
  });

  it('gets a usuario entry by id', async () => {
    (usuarioController.getById as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send({ id: 1, name: 'Usuario teste 2' });
    });

    const response = await request(app).get('/usuarios/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'Usuario teste 2' });
    expect(usuarioController.getById).toHaveBeenCalledTimes(1);
  });

  it('updates a usuario entry by id', async () => {
    (usuarioController.update as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send({ message: 'Mensagem teste para atualização' });
    });

    const response = await request(app).put('/usuarios/1').send({ name: 'Updated Usuario' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Mensagem teste para atualização');
    expect(usuarioController.update).toHaveBeenCalledTimes(1);
  });

  it('deletes a usuario by id', async () => {
    (usuarioController.delete as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(200).send();
    });

    const response = await request(app).delete('/usuarios/1');

    expect(response.status).toBe(200);
    expect(usuarioController.delete).toHaveBeenCalledTimes(1);
  });
});