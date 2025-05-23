import { Request, Response } from 'express';
import { produtoService } from '@src/services/ProdutoService';

class ProdutoController {
  async create(req: Request, res: Response) {
    const authToken = res.locals.decryptedToken;

    const result = await produtoService.create(req.body, authToken);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const filters = JSON.parse((req.query?.filters as string) || '[]');
    const sorters = JSON.parse((req.query?.sorters as string) || '[]');

    const result = await produtoService.getAll({ filters, sorters });
    return res.status(200).json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await produtoService.getById(Number(id));
    res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const authToken = res.locals.decryptedToken;

    const result = await produtoService.update(Number(id), req.body, authToken);
    res.status(200).json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const authToken = res.locals.decryptedToken;

    await produtoService.delete(Number(id), authToken);
    res.status(204).send();
  }
}

export const produtoController = new ProdutoController();
