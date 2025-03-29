import { Request, Response } from 'express';
import pedidoService from '@src/services/PedidoService';

class PedidoController {
  async create(req: Request, res: Response) {
    const usuarioId = res.locals.decryptedToken?.id;
    if (!usuarioId) return res.status(401).json({ error: 'Usuário não autenticado' });

    const pedidoData = { ...req.body, usuarioId };
    const result = await pedidoService.create(pedidoData);

    return res.status(201).json(result);
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const pedido = await pedidoService.getById(id);
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

    return res.status(200).json(pedido);
  }

  async getAll(req: Request, res: Response) {
    const pedidos = await pedidoService.getAll();
    return res.status(200).json(pedidos);
  }

  async cancel(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const pedido = await pedidoService.cancel(id);

    return res.status(200).json(pedido);
  }
}

export const pedidoController = new PedidoController();
