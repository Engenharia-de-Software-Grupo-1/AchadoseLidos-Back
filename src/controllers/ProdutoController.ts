import { Request, Response } from 'express';
import { produtoService } from '@src/services/ProdutoService';

class ProdutoController {
  async create(req: Request, res: Response) {
    const result = await produtoService.create(req.body);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await produtoService.getAll();
    return res.status(200).json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await produtoService.getById(Number(id));
    res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const result = await produtoService.update(Number(id), req.body);
    res.status(200).json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await produtoService.delete(Number(id));
    res.status(204).send();
  }
}

export const produtoController = new ProdutoController();
