import { Request, Response } from 'express';
import pedidoService from '@src/services/PedidoService';

class PedidoController {
  async create(req: Request, res: Response) {
    const authToken = res.locals.decryptedToken;

    const result = await pedidoService.create(req.body, authToken);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const authToken = res.locals.decryptedToken;
    const filters = JSON.parse((req.query?.filters as string) || '[]');

    const result = await pedidoService.getAll(filters, authToken);
    return res.status(200).json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const authToken = res.locals.decryptedToken;

    const result = await pedidoService.getById(Number(id), authToken);
    return res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const authToken = res.locals.decryptedToken;

    const result = await pedidoService.update(Number(id), req.body, authToken);
    return res.status(200).json(result);
  }
}

export const pedidoController = new PedidoController();
