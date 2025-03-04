import { Request, Response } from "express";
import { contaService } from "@src/services/ContaService";

class ContaController {

  async verificarEmail(req: Request, res: Response) {
    const email = req.query.email as string;
    await contaService.verificarEmail(email);

    res.status(200).json({ mensagem: "E-mail disponível" });
  }
}

export const contaController =  new ContaController();
