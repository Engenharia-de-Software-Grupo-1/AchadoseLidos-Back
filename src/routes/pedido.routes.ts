import { Router } from 'express';
import { pedidoController } from '@src/controllers/PedidoCotroller';

export const pedidoRoutes = Router();

pedidoRoutes.post('/', async (req, res) => {
  await pedidoController.create(req, res);
});

pedidoRoutes.get('/', async (req, res) => {
  await pedidoController.getAll(req, res);
});

pedidoRoutes.get('/:id', async (req, res) => {
  await pedidoController.getById(req, res);
});

pedidoRoutes.put('/:id/cancelar', async (req, res) => {
  await pedidoController.cancelarPedido(req, res);
});
