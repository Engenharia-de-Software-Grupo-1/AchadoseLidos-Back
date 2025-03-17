import { Router } from 'express';
import { seboController } from '@src/controllers/SeboController';
import { ensureIsSebo, requireAuth } from '@src/middleware/authMiddleware';

export const seboRoutes = Router();

seboRoutes.post('/', async (req, res) => {
  await seboController.create(req, res);
});

seboRoutes.get('/', async (req, res) => {
  await seboController.getAll(req, res);
});

seboRoutes.get('/:id', async (req, res) => {
  await seboController.getById(req, res);
});

seboRoutes.put('/:id', requireAuth, ensureIsSebo, async (req, res) => {
  await seboController.update(req, res);
});
