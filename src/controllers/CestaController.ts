import { Request, Response } from 'express';
import { cestaService } from '@src/services/CestaService';

class CestaController {
  async getCesta(req: Request, res: Response) {
    const authToken = res.locals.decryptedToken;

    const result = await cestaService.getCesta(authToken);
    return res.status(200).json(result);
  }

  async adicionarProduto(req: Request, res: Response) {
    const authToken = res.locals.decryptedToken;

    const result = await cestaService.adicionarProduto(req.body, authToken);
    return res.status(201).json(result);
  }

  async atualizarProduto(req: Request, res: Response) {
    const { produtoId } = req.params;
    const authToken = res.locals.decryptedToken;

    const result = await cestaService.atualizarProduto(Number(produtoId), req.body, authToken);
    res.status(200).json(result);
  }

  async removerProduto(req: Request, res: Response) {
    const { produtoId } = req.params;
    const authToken = res.locals.decryptedToken;

    await cestaService.removerProduto(Number(produtoId), authToken);
    res.status(204).send();
  }
}

export const cestaController = new CestaController();
