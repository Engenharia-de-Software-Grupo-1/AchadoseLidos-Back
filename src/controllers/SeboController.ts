import { Request, Response } from "express";
import { seboService } from "@src/services/SeboService";

class SeboController {

  async create(req: Request, res: Response) {
    const result = await seboService.create(req.body);
    return res.status(201).json(result);
  }
}

export const seboController = new SeboController();
