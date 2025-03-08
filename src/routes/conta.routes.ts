import { Router } from 'express';
import { contaController } from '@src/controllers/ContaController';

export const contaRoutes = Router();

contaRoutes.get('/validar_email', async(req, res) => {
  await contaController.validarEmail(req, res);
});

contaRoutes.delete('/:id', async(req, res) => {
  await contaController.delete(req, res);
});
