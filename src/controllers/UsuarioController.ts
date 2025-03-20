import { Request, Response } from 'express';
import { usuarioService } from '@src/services/UsuarioService';

class UsuarioController {
  async create(req: Request, res: Response) {
    const result = await usuarioService.create(req.body);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await usuarioService.getAll();
    return res.status(200).json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await usuarioService.getById(Number(id));
    res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const authToken = res.locals.decryptedToken;

    const result = await usuarioService.update(Number(id), req.body, authToken);
    res.status(200).json(result);
  }
}

export const usuarioController = new UsuarioController();
