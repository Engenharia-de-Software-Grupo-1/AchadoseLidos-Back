import { StatusConta } from '@prisma/client';
import { AppError } from '@src/errors/AppError';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { ContaResponseSchema, ContaUpdateDTO, ContaUpdateSchema } from '@src/models/ContaSchema';
import { contaRepository } from '@src/repositories/ContaRepository';
import { sendEmail } from '@src/lib/mailer';
import { criaAccessToken, gerarHashSenha, gerarResetToken } from '@src/utils/auth';
import bcrypt from 'bcrypt';
import { ErrorMessages } from '@src/utils/ErrorMessages';
import { Response } from 'express';
import { ensureSelfTargetedAction } from '@src/utils/ensureSelfTargetedAction';

class ContaService {
  async login(email: string, senha: string) {
    const conta = await contaRepository.getByEmail(email);
    if (!conta) {
      throw new AppError(ErrorMessages.wrongEmail, 401);
    }

    const senhaEhValida = await bcrypt.compare(senha, conta.senha);

    if (!senhaEhValida) {
      throw new AppError(ErrorMessages.wrongPassword, 401);
    }

    const token = criaAccessToken(conta);

    return token;
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
      throw new AppError('Não existe um cadastro para este e-mail', 404);
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
      throw new AppError('Token inválido', 400);
    }
    if (conta.resetTokenExpiresAt && conta.resetTokenExpiresAt < new Date()) {
      throw new AppError('Token expirado', 401);
    }

    const hashSenha = await gerarHashSenha(parsedData.senha);
    const result = await contaRepository.atualizarSenha(conta.id, hashSenha);

    return ContaResponseSchema.parseAsync(result);
  }

  async delete(deletionId: number, authenticatedConta: unknown) {
    ensureSelfTargetedAction(deletionId, authenticatedConta);

    const conta = await contaRepository.getById(deletionId);
    if (!conta) {
      throw new EntityNotFoundError(deletionId);
    }
    await contaRepository.atualizarStatus(deletionId, StatusConta.EXCLUIDA);
  }

  async logout(res: Response) {
    res.cookie('authToken', '', { maxAge: 1 });
    res.status(200).send();
  }
}

export const contaService = new ContaService();
