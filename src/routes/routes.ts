import { Router } from 'express';

import { contaRoutes } from './conta.routes';
import { seboRoutes } from './sebo.routes';
import { usuarioRoutes } from './usuario.routes';
import { produtoRoutes } from './produto.routes';
import { favoritoRoutes } from './favorito.routes';
import { cestaRoutes } from './cesta.routes';
import { pedidoRoutes } from './pedido.routes';

export const routes = Router();

routes.use('/contas', contaRoutes);
routes.use('/sebos', seboRoutes);
routes.use('/usuarios', usuarioRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/favoritos', favoritoRoutes);
routes.use('/cesta', cestaRoutes);
routes.use('/pedidos', pedidoRoutes);
