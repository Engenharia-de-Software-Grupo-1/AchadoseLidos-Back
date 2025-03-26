import { Request, Response } from 'express';
import { favoritoService } from '@src/services/FavoritoService';

class FavoritoController {
  async create(req: Request, res: Response) {
    const { produtoId } = req.body;
    const authToken = res.locals.decryptedToken;

    const result = await favoritoService.create(authToken, Number(produtoId));
    return res.status(201).json(result);
  }

  async getFavoritos(_: Request, res: Response) {
    const authToken = res.locals.decryptedToken;

    const result = await favoritoService.getFavoritos(authToken);
    return res.status(200).json(result);
  }

  async delete(req: Request, res: Response) {
    const { produtoId } = req.body;
    const authToken = res.locals.decryptedToken;

    await favoritoService.delete(authToken, Number(produtoId));
    res.status(204).send();
  }
}

export const favoritoController = new FavoritoController();
