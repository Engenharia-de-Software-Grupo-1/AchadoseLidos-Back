import { Router } from 'express';
import { cestaController } from '@src/controllers/CestaController';
import { ensureIsUsuario } from '@src/middlewares/authMiddleware';

export const cestaRoutes = Router();

cestaRoutes.get('/', ensureIsUsuario, async (req, res) => {
  await cestaController.getCesta(req, res);
});

cestaRoutes.post('/produtos', ensureIsUsuario, async (req, res) => {
  await cestaController.adicionarProduto(req, res);
});

cestaRoutes.put('/produtos/:produtoId', ensureIsUsuario, async (req, res) => {
  await cestaController.atualizarProduto(req, res);
});

cestaRoutes.delete('/produtos/:produtoId', ensureIsUsuario, async (req, res) => {
  await cestaController.removerProduto(req, res);
});
