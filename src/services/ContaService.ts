import { StatusConta } from '@prisma/client';
import { AppError } from '@src/errors/AppError';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { contaRepository } from '@src/repositories/ContaRepository';

class ContaService {
  async validarEmail(email: string) {
    const emailJaExiste = await contaRepository.getByEmail(email);
    if (emailJaExiste) {
      throw new AppError('Já existe um cadastro para este e-mail!', 409);
    }
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
