import { Request, Response } from 'express';
import { seboService } from '@src/services/SeboService';

class SeboController {
  async create(req: Request, res: Response) {
    const result = await seboService.create(req.body);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const filters = JSON.parse((req.query?.filters as string) || '[]');
    const sorters = JSON.parse((req.query?.sorters as string) || '[]');

    const result = await seboService.getAll({ filters, sorters });
    return res.status(200).json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await seboService.getById(Number(id));
    res.status(200).json(result);
  }

  async getPerfilById(req: Request, res: Response) {
    const { id } = req.params;
    const authToken = res.locals.decryptedToken;

    const result = await seboService.getPerfilById(Number(id), authToken);
    res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const authToken = res.locals.decryptedToken;

    const result = await seboService.update(Number(id), req.body, authToken);
    res.status(200).json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const authToken = res.locals.decryptedToken;

    await seboService.delete(Number(id), authToken);
    res.status(204).send();
  }
}

export const seboController = new SeboController();
