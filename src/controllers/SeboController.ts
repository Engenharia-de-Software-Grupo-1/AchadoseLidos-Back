import { Request, Response } from "express";
import { seboService } from "@src/services/SeboService";
import { getErrorMessage } from "@src/utils/errorUtils";

class SeboController {

  async create(req: Request, res: Response) {
    try {
      const result = await seboService.create(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ erro: getErrorMessage(error) });
    }
  }
}

export const seboController = new SeboController();
