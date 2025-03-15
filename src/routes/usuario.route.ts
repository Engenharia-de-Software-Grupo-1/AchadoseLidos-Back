import { Router } from 'express';
import { usuarioController } from '@src/controllers/UsuarioController';

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

usuarioRoutes.put('/:id', async (req, res) => {
  await usuarioController.update(req, res);
});
