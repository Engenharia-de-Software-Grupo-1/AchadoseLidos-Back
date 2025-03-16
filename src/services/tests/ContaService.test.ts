import { contaRepository } from '@src/repositories/ContaRepository';
import { StatusConta } from '@prisma/client';
import bcrypt from 'bcrypt';

import { contaService } from '../ContaService';

jest.mock('bcrypt');
jest.mock('@src/repositories/ContaRepository');

describe('ContaService', () => {
  it('should return the account if email and password are valid', async () => {
    const mockConta = { id: 1, email: 'test@example.com', senha: 'hashedPassword' };

    (contaRepository.getByEmail as jest.Mock).mockResolvedValue(mockConta);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await contaService.login('test@example.com', 'validPassword');

    expect(result).toEqual(mockConta);
    expect(contaRepository.getByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('validPassword', 'hashedPassword');
  });

  it('should throw an error if the email does not exist', async () => {
    (contaRepository.getByEmail as jest.Mock).mockResolvedValue(null);

    await expect(contaService.login('nonexistent@example.com', 'password')).rejects.toEqual({
      message: 'E-mail ou senha incorretos',
      statusCode: 401,
    });
    expect(contaRepository.getByEmail).toHaveBeenCalledWith('nonexistent@example.com');
  });

  it('should throw an error if the password is invalid', async () => {
    const mockConta = { id: 1, email: 'test@example.com', senha: 'hashedPassword' };

    (contaRepository.getByEmail as jest.Mock).mockResolvedValue(mockConta);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(contaService.login('test@example.com', 'invalidPassword')).rejects.toEqual({
      message: 'E-mail ou senha incorretos',
      statusCode: 401,
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('invalidPassword', 'hashedPassword');
  });

  it('should throw an error if email already exists', async () => {
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

  it('should not throw an error if email does not exist', async () => {
    (contaRepository.getByEmail as jest.Mock).mockResolvedValue(false);

    await expect(contaService.validarEmail('test@example.com')).resolves.not.toThrow();
  });

  it('should throw an error if account does not exist', async () => {
    (contaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(contaService.delete(1)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('should update account status to EXCLUIDA if account exists', async () => {
    (contaRepository.getById as jest.Mock).mockResolvedValue({ id: 1 });
    (contaRepository.atualizarStatus as jest.Mock).mockResolvedValue(true);

    await expect(contaService.delete(1)).resolves.not.toThrow();
    expect(contaRepository.atualizarStatus).toHaveBeenCalledWith(1, StatusConta.EXCLUIDA);
  });
});
