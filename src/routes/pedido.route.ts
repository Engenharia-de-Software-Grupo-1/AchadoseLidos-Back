import { Router } from 'express';
import { pedidoController } from '@src/controllers/PedidoController';
import { ensureIsUsuario } from '@src/middlewares/authMiddleware';

export const pedidoRoutes = Router();

pedidoRoutes.post('/', ensureIsUsuario, async (req, res) => {
  await pedidoController.create(req, res);
});

pedidoRoutes.get('/:id', async (req, res) => {
  await pedidoController.getById(req, res);
});

pedidoRoutes.get('/', async (req, res) => {
  await pedidoController.getAll(req, res);
});

pedidoRoutes.patch('/:id/cancelar', async (req, res) => {
  await pedidoController.cancel(req, res);
});
