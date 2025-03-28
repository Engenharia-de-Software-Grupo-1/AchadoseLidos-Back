import { Request, Response } from 'express';
import { pedidoService } from '@src/services/PedidoService';
import { AppError } from '@src/errors/AppError';
import { PedidoCreateSchema } from '@src/models/PedidoSchema';

export class PedidoController {
  async create(req: Request, res: Response) {
    try {
      const data = PedidoCreateSchema.parse(req.body);
      const pedido = await pedidoService.create(data);
      return res.status(201).json(pedido);
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const pedidos = await pedidoService.getAll();
      return res.status(200).json(pedidos);
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const pedido = await pedidoService.getById(id);
      return res.status(200).json(pedido);
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  async cancelarPedido(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const pedidoCancelado = await pedidoService.cancelarPedido(id);
      return res.status(200).json(pedidoCancelado);
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }
}

export const pedidoController = new PedidoController();
