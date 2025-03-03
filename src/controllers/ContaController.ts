import { Request, Response } from "express";
import { contaService } from "@src/services/ContaService";
import { getErrorMessage } from "@src/utils/errorUtils";

class ContaController {

  async verificarEmail(req: Request, res: Response) {
    try {
      const email = req.query.email as string;

      await contaService.verificarEmail(email);

      return res.status(200).json({ mensagem: "E-mail disponível" });
    } catch (error) {
      return res.status(400).json({ erro: getErrorMessage(error) });
    }
  }
}

export const contaController =  new ContaController();
