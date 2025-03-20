import { Request, Response } from 'express';
import { contaService } from '@src/services/ContaService';
import { COOKIE_EXPIRATION_MS } from '@src/utils/authUtils';

class ContaController {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;
    const token = await contaService.login(email, senha);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).send();
  }

  async recuperarInformacoes(req: Request, res: Response) {
    const authToken = res.locals.decryptedToken;
    const result = await contaService.recuperarInformacoes(authToken);
    res.status(200).json(result);
  }

  async validarEmail(req: Request, res: Response) {
    const email = req.query.email as string;
    await contaService.validarEmail(email);
    res.status(200).json({ mensagem: 'Email disponível' });
  }

  async recuperarSenha(req: Request, res: Response) {
    const { email } = req.body;
    await contaService.recuperarSenha(email);
    res.status(200).json({ mensagem: 'Email enviado. Verifique sua caixa de Spam' });
  }

  async atualizarSenha(req: Request, res: Response) {
    const result = await contaService.atualizarSenha(req.body);
    res.status(200).json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const authToken = res.locals.decryptedToken;

    await contaService.delete(Number(id), authToken);
    res.status(204).send();
  }

  async logout(_: Request, res: Response) {
    res.cookie('authToken', '', { maxAge: 1 });
    res.status(200).send();
  }
}

export const contaController = new ContaController();
