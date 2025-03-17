import { Router } from 'express';
import { contaController } from '@src/controllers/ContaController';
import { requireAuth } from '@src/middleware/authMiddleware';

export const contaRoutes = Router();
contaRoutes.post('/login', async (req, res) => {
  await contaController.login(req, res);
});

contaRoutes.get('/validar_email', async (req, res) => {
  await contaController.validarEmail(req, res);
});

contaRoutes.post('/recuperar_senha', async (req, res) => {
  await contaController.recuperarSenha(req, res);
});

contaRoutes.put('/atualizar_senha', async (req, res) => {
  await contaController.atualizarSenha(req, res);
});

contaRoutes.delete('/:id', requireAuth, async (req, res) => {
  await contaController.delete(req, res);
});

contaRoutes.post('/logout', async (req, res) => {
  await contaController.logout(req, res);
});
