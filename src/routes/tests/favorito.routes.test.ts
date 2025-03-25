import express from 'express';
import request from 'supertest';

import { favoritoRoutes } from '../favorito.routes';

const app = express();
app.use(express.json());
app.use('/favorito', favoritoRoutes);

jest.mock('@src/middlewares/authMiddleware', () => ({
  ensureIsUsuario: jest.fn((req, res, next) => next()),
}));

jest.mock('@src/controllers/FavoritoController', () => ({
  favoritoController: {
    create: jest.fn((req, res) => res.status(201).send({ message: 'Favorito criado com sucesso' })),
    getAllForUser: jest.fn((req, res) => res.status(200).send({ favoritos: [] })),
    delete: jest.fn((req, res) => res.status(200).send({ message: 'Favorito deletado com sucesso' })),
  },
}));

describe('Favorito Routes', () => {
  it('cria um favorito', async () => {
    const response = await request(app).post('/favorito/create').send({ itemId: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Favorito criado com sucesso' });
  });

  it('obtém todos os favoritos do usuário', async () => {
    const response = await request(app).get('/favorito/getAllForUser');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ favoritos: [] });
  });

  it('deleta um favorito', async () => {
    const response = await request(app).delete('/favorito/delete').send({ itemId: 1 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Favorito deletado com sucesso' });
  });
});
