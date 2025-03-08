import { contaRepository } from '@src/repositories/ContaRepository';
import { StatusConta } from '@prisma/client';

import { contaService } from '../ContaService';

jest.mock('@src/repositories/ContaRepository');

describe('ContaService', () => {
  it('should throw an error if email already exists', async() => {
    const fixedDate = new Date('2025-03-07');
    (contaRepository.getByEmail as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      senha: 'password123',
      status: StatusConta.ATIVA,
      id: 1,
      tipo: 'SEBO',
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });

    await expect(contaService.validarEmail('test@example.com')).rejects.toEqual({
      message: 'Já existe um cadastro para este e-mail!',
      statusCode: 409,
    });
  });

  it('should not throw an error if email does not exist', async() => {
    (contaRepository.getByEmail as jest.Mock).mockResolvedValue(false);

    await expect(contaService.validarEmail('test@example.com')).resolves.not.toThrow();
  });

  it('should throw an error if account does not exist', async() => {
    (contaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(contaService.delete(1)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('should update account status to EXCLUIDA if account exists', async() => {
    (contaRepository.getById as jest.Mock).mockResolvedValue({ id: 1 });
    (contaRepository.atualizarStatus as jest.Mock).mockResolvedValue(true);

    await expect(contaService.delete(1)).resolves.not.toThrow();
    expect(contaRepository.atualizarStatus).toHaveBeenCalledWith(1, StatusConta.EXCLUIDA);
  });
});
