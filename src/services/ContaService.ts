import { StatusConta } from '@prisma/client';
import { AppError } from '@src/errors/AppError';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { ContaResponseSchema, ContaUpdateDTO, ContaUpdateSchema } from '@src/models/ContaSchema';
import { contaRepository } from '@src/repositories/ContaRepository';
import { sendEmail } from '@src/lib/mailer';
import { criarAcessToken, gerarHashSenha, gerarResetToken } from '@src/utils/auth';
import bcrypt from 'bcrypt';
import { Response } from 'express';
import { ensureSelfTargetedAction } from '@src/utils/ensureSelfTargetedAction';
import { TokenInvalidError } from '@src/errors/TokenInvalidError';
import { TokenExpiredError } from '@src/errors/TokenExpiredError';
import { EmailNotRegisteredError } from '@src/errors/EmailNotRegisteredError';
import { IncorrectPasswordError } from '@src/errors/IncorrectPasswordError';

class ContaService {
  async login(email: string, senha: string) {
    const conta = await contaRepository.getByEmail(email);
    if (!conta) {
      throw new EmailNotRegisteredError();
    }

    const senhaValida = await bcrypt.compare(senha, conta.senha);
    if (!senhaValida) {
      throw new IncorrectPasswordError();
    }

    return criarAcessToken(conta);
  }

  async validarEmail(email: string) {
    const emailAtivo = await contaRepository.getByEmail(email);
    if (emailAtivo) {
      throw new AppError('Já existe um cadastro para este e-mail!', 409);
    }
  }

  async recuperarSenha(email: string) {
    const emailAtivo = await contaRepository.getByEmail(email);
    if (!emailAtivo) {
      throw new EmailNotRegisteredError();
    }

    const { token, expiresAt } = gerarResetToken();
    const resetLink = `${process.env.FRONTEND_URL}/recover/reset?token=${token}`;

    await sendEmail(email, 'Recuperação de Senha', 'email-recuperar-senha.html', { resetLink });
    await contaRepository.salvarResetToken(email, token, expiresAt);
  }

  async atualizarSenha(data: ContaUpdateDTO) {
    const parsedData = ContaUpdateSchema.parse(data);
    const conta = await contaRepository.getByResetToken(parsedData.token);

    if (!conta) {
      throw new TokenInvalidError();
    }

    if (conta.resetTokenExpiresAt && conta.resetTokenExpiresAt < new Date()) {
      throw new TokenExpiredError();
    }

    const hashSenha = await gerarHashSenha(parsedData.senha);
    const result = await contaRepository.atualizarSenha(conta.id, hashSenha);

    return ContaResponseSchema.parseAsync(result);
  }

  async delete(id: number, authenticatedConta: unknown) {
    ensureSelfTargetedAction(id, authenticatedConta);

    const conta = await contaRepository.getById(id);
    if (!conta) {
      throw new EntityNotFoundError(id);
    }

    await contaRepository.atualizarStatus(id, StatusConta.EXCLUIDA);
  }

  async logout(res: Response) {
    res.cookie('authToken', '', { maxAge: 1 });
    res.status(200).send();
  }
}

export const contaService = new ContaService();
