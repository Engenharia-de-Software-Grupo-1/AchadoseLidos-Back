import { Request, Response } from "express";
import { seboService } from "@src/services/SeboService";

class SeboController {

  async create(req: Request, res: Response) {
    const result = await seboService.create(req.body);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await seboService.getAll();
    return res.status(200).json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await seboService.getById(Number(id));
    res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const result = await seboService.update(Number(id), req.body);
    res.status(200).json(result);
  }
}

export const seboController = new SeboController();
