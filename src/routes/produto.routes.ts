import { Router } from 'express';
import { produtoController } from '@src/controllers/ProdutoController';
import { ensureIsSebo } from '@src/middleware/authMiddleware';

export const produtoRoutes = Router();

produtoRoutes.post('/', ensureIsSebo, async (req, res) => {
  await produtoController.create(req, res);
});

produtoRoutes.get('/', async (req, res) => {
  await produtoController.getAll(req, res);
});

produtoRoutes.get('/:id', async (req, res) => {
  await produtoController.getById(req, res);
});

produtoRoutes.put('/:id', ensureIsSebo, async (req, res) => {
  await produtoController.update(req, res);
});

produtoRoutes.delete('/:id', async (req, res) => {
  await produtoController.delete(req, res);
});
