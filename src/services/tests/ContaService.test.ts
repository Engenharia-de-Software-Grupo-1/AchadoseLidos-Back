import { contaRepository } from '@src/repositories/ContaRepository';
import { StatusConta } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ErrorMessages } from '@src/errors/ErrorMessages';

import { contaService } from '../ContaService';

jest.mock('bcrypt');
jest.mock('@src/repositories/ContaRepository');
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  sign: jest.fn(() => 'exampleToken'),
}));

describe('ContaService', () => {
  it('should return the token', async () => {
    const mockConta = {
      id: 1,
      email: 'test@example.com',
      senha: 'hashedPassword',
      usuario: {
        id: 12,
      },
    };

    (contaRepository.getByEmail as jest.Mock).mockResolvedValue(mockConta);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await contaService.login('test@example.com', 'validPassword');

    expect(result).toEqual('Bearer exampleToken');
    expect(contaRepository.getByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('validPassword', 'hashedPassword');
  });

  it('should throw an error if the email does not exist', async () => {
    (contaRepository.getByEmail as jest.Mock).mockResolvedValue(null);

    await expect(contaService.login('nonexistent@example.com', 'password')).rejects.toEqual({
      message: ErrorMessages.emailNotRegistered,
      statusCode: 404,
    });
    expect(contaRepository.getByEmail).toHaveBeenCalledWith('nonexistent@example.com');
  });

  it('should throw an error if the password is invalid', async () => {
    const mockConta = { id: 1, email: 'test@example.com', senha: 'hashedPassword' };

    (contaRepository.getByEmail as jest.Mock).mockResolvedValue(mockConta);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(contaService.login('test@example.com', 'invalidPassword')).rejects.toEqual({
      message: ErrorMessages.wrongPassword,
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
      message: 'Email já cadastrado',
      statusCode: 409,
    });
  });

  it('should not throw an error if email does not exist', async () => {
    (contaRepository.getByEmail as jest.Mock).mockResolvedValue(false);

    await expect(contaService.validarEmail('test@example.com')).resolves.not.toThrow();
  });
});
