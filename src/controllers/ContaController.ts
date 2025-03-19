import { Request, Response } from 'express';
import { contaService } from '@src/services/ContaService';
import { cookieExpirationTimeInMilliseconds } from '@src/utils/auth';

class ContaController {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;
    const token = await contaService.login(email, senha);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // quando deployar, temos que garantir que node_env tenha o valor de 'production'
      maxAge: cookieExpirationTimeInMilliseconds,
    });

    res.status(200).send();
  }

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
    const { id: deletionId } = req.params;
    const authenticatedConta = res.locals.decryptedToken;

    await contaService.delete(Number(deletionId), authenticatedConta);
    res.status(204).send();
  }

  async logout(_: Request, res: Response) {
    await contaService.logout(res);
  }
}

export const contaController = new ContaController();
