import { Request, Response } from 'express';
import { contaService } from '@src/services/ContaService';

class ContaController {
  async validarEmail(req: Request, res: Response) {
    const email = req.query.email as string;
    await contaService.validarEmail(email);
    res.status(200).json({ mensagem: 'E-mail disponível' });
  }

  async recuperarSenha(req: Request, res: Response) {
    const { email } = req.body;
    await contaService.recuperarSenha(email);
    res.status(200).json({ mensagem: 'E-mail enviado! Verifique sua caixa de Spam' });
  }

  async atualizarSenha(req: Request, res: Response) {
    const result = await contaService.atualizarSenha(req.body);
    res.status(200).json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await contaService.delete(Number(id));
    res.status(204).send();
  }
}

export const contaController = new ContaController();
