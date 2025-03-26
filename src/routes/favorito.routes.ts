import { favoritoController } from '@src/controllers/FavoritoController';
import { ensureIsUsuario } from '@src/middlewares/authMiddleware';
import { Router } from 'express';

export const favoritoRoutes = Router();

favoritoRoutes.post('/', ensureIsUsuario, async (req, res) => {
  await favoritoController.create(req, res);
});

favoritoRoutes.get('/', ensureIsUsuario, async (req, res) => {
  await favoritoController.getFavoritos(req, res);
});

favoritoRoutes.delete('/delete/:produtoId', ensureIsUsuario, async (req, res) => {
  await favoritoController.delete(req, res);
});
