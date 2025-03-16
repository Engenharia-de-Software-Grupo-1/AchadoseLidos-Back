import { StatusConta } from '@prisma/client';
import { AppError } from '@src/errors/AppError';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { ContaResponseSchema, ContaUpdateDTO, ContaUpdateSchema } from '@src/models/ContaSchema';
import { contaRepository } from '@src/repositories/ContaRepository';
import { sendEmail } from '@src/lib/mailer';
import { gerarHashSenha, gerarResetToken } from '@src/utils/auth';

class ContaService {
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

  async delete(id: number) {
    const conta = await contaRepository.getById(id);
    if (!conta) {
      throw new EntityNotFoundError(id);
    }
    await contaRepository.atualizarStatus(id, StatusConta.EXCLUIDA);
  }
}

export const contaService = new ContaService();
