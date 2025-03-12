import { StatusConta } from '@prisma/client';
import { AppError } from '@src/errors/AppError';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { ContaResponseSchema, ContaUpdateDTO, ContaUpdateSchema } from '@src/models/ContaSchema';
import { contaRepository } from '@src/repositories/ContaRepository';

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
      throw new AppError('Não existe um cadastro para este e-mail', 409);
    }
  }

  async atualizarSenha(data: ContaUpdateDTO) {
    const parsedData = ContaUpdateSchema.parse(data);
    const result = await contaRepository.atualizarSenha(parsedData);
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
