import { Router } from 'express';
import { usuarioController } from '@src/controllers/UsuarioController';
import { ensureIsUsuario } from '@src/middlewares/authMiddleware';

export const usuarioRoutes = Router();

usuarioRoutes.post('/', async (req, res) => {
  await usuarioController.create(req, res);
});

usuarioRoutes.get('/', async (req, res) => {
  await usuarioController.getAll(req, res);
});

usuarioRoutes.get('/:id', async (req, res) => {
  await usuarioController.getById(req, res);
});

usuarioRoutes.get('/perfil/:id', ensureIsUsuario, async (req, res) => {
  await usuarioController.getPerfilById(req, res);
});

usuarioRoutes.put('/:id', ensureIsUsuario, async (req, res) => {
  await usuarioController.update(req, res);
});

usuarioRoutes.delete('/:id', ensureIsUsuario, async (req, res) => {
  await usuarioController.delete(req, res);
});
