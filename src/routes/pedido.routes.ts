import { Router } from 'express';
import { pedidoController } from '@src/controllers/PedidoController';
import { ensureIsSebo, ensureIsUsuario, requireAuth } from '@src/middlewares/authMiddleware';

export const pedidoRoutes = Router();

pedidoRoutes.post('/', ensureIsUsuario, async (req, res) => {
  await pedidoController.create(req, res);
});

pedidoRoutes.get('/', requireAuth, async (req, res) => {
  await pedidoController.getAll(req, res);
});

pedidoRoutes.get('/:id', requireAuth, async (req, res) => {
  await pedidoController.getById(req, res);
});

pedidoRoutes.put('/:id', ensureIsSebo, async (req, res) => {
  await pedidoController.update(req, res);
});
