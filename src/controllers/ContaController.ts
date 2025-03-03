import { Request, Response } from "express";
import { contaService } from "@src/services/ContaService";
import { EmailIndisponivelError } from "@src/errors/EmailIndisponivelError";

class ContaController {

  async verificarEmail(req: Request, res: Response) {
    try {
      const email = req.query.email as string;

      await contaService.verificarEmail(email);

      return res.status(200).json({ mensagem: "E-mail disponível" });
    } catch (error) {
      if (error instanceof EmailIndisponivelError) {
        return res.status(409).json({ erro: error.message });
      }
      return res.status(400).json({ erro: "Erro ao verificar e-mail" });
    }
  }
}

export const contaController =  new ContaController();
