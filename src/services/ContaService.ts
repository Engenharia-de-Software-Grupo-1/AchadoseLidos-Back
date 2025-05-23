import bcrypt from 'bcrypt';
import { AppError } from '@src/errors/AppError';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import {
  ContaExtendedResponseSchema,
  ContaResponseSchema,
  ContaUpdateDTO,
  ContaUpdateSchema,
} from '@src/models/ContaSchema';
import { JwtPayload } from 'jsonwebtoken';
import { contaRepository } from '@src/repositories/ContaRepository';
import { sendEmail } from '@src/lib/mailer';
import { gerarAuthToken, gerarHashSenha, gerarResetToken } from '@src/utils/authUtils';
import { InvalidTokenError } from '@src/errors/InvalidTokenError';
import { ExpiredTokenError } from '@src/errors/ExpiredTokenError';
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

    return gerarAuthToken(conta);
  }

  async getPerfil(authToken: JwtPayload) {
    if (!authToken) {
      return { autenticado: false };
    }

    const conta = await contaRepository.getById(authToken.contaId);
    if (!conta) {
      throw new EntityNotFoundError(authToken.contaId);
    }

    const parsedData = await ContaExtendedResponseSchema.parseAsync(conta);
    return { autenticado: true, conta: parsedData };
  }

  async validarEmail(email: string) {
    const emailAtivo = await contaRepository.getByEmail(email);
    if (emailAtivo) {
      throw new AppError('Email já cadastrado', 409);
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
      throw new InvalidTokenError();
    }

    if (conta.resetTokenExpiresAt && conta.resetTokenExpiresAt < new Date()) {
      throw new ExpiredTokenError();
    }

    const hashSenha = await gerarHashSenha(parsedData.senha);
    const result = await contaRepository.atualizarSenha(conta.id, hashSenha);

    return ContaResponseSchema.parseAsync(result);
  }
}

export const contaService = new ContaService();
