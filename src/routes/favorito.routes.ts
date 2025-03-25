import { favoritoController } from '@src/controllers/FavoritoController';
import { ensureIsUsuario } from '@src/middlewares/authMiddleware';
import { Router } from 'express';

export const favoritoRoutes = Router();

favoritoRoutes.post('/create', ensureIsUsuario, async (req, res) => {
  await favoritoController.create(req, res);
});

favoritoRoutes.get('/getAllForUser', ensureIsUsuario, async (req, res) => {
  await favoritoController.getAllForUser(req, res);
});

favoritoRoutes.delete('/delete', ensureIsUsuario, async (req, res) => {
  await favoritoController.delete(req, res);
});
