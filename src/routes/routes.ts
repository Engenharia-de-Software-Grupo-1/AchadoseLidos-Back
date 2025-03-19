import { Router } from 'express';

import { contaRoutes } from './conta.routes';
import { seboRoutes } from './sebo.routes';
import { usuarioRoutes } from './usuario.route';
import { produtoRoutes } from './produto.route';

export const routes = Router();

routes.use('/contas', contaRoutes);
routes.use('/sebos', seboRoutes);
routes.use('/usuarios', usuarioRoutes);
routes.use('/produtos', produtoRoutes);
