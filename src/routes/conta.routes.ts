import { Router } from 'express';
import { contaController } from '@src/controllers/ContaController';

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

contaRoutes.delete('/:id', async (req, res) => {
  await contaController.delete(req, res);
});
