import { Router } from 'express';
import { seboController } from '@src/controllers/SeboController';

export const seboRoutes = Router();

seboRoutes.post('/', async(req, res) => {
  await seboController.create(req, res);
});

seboRoutes.get('/', async(req, res) => {
  await seboController.getAll(req, res);
});

seboRoutes.get('/:id', async(req, res) => {
  await seboController.getById(req, res);
});

seboRoutes.put('/:id', async(req, res) => {
  await seboController.update(req, res);
});
