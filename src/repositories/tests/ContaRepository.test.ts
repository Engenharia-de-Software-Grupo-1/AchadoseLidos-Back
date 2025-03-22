import { StatusConta, TipoConta } from '@prisma/client';
import { contaRepository } from '@src/repositories/ContaRepository';
import prismaClient from '@src/lib/prismaClient';
import { genSalt, hash } from 'bcrypt';
import { DELETED_CONTA } from '@src/constants/deletedData';

import { prismaMock } from '../../lib/singleton';

jest.mock('@src/lib/prismaClient', () => ({
  prismaClient: {
    conta: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => 'mockedSalt'),
  hash: jest.fn(password => `hashed_${password}`),
}));

describe('ContaRepository', () => {
  const tx = prismaMock;

  it('creates a new account with hashed password', async () => {
    const data = { email: 'test@example.com', senha: 'password123' };
    const tipo = TipoConta.SEBO;
    const mockResponse = {
      id: 1,
      email: data.email,
      senha: 'hashed_password123',
      tipo,
      status: StatusConta.ATIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
      resetToken: null,
      resetTokenExpiresAt: null,
    };
    tx.conta.create.mockResolvedValue(mockResponse);

    const result = await contaRepository.create(tx, data, tipo);

    expect(genSalt).toHaveBeenCalledWith(10);
    expect(hash).toHaveBeenCalledWith(data.senha, 'mockedSalt');
    expect(tx.conta.create).toHaveBeenCalledWith({
      data: {
        email: data.email,
        senha: 'hashed_password123',
        tipo,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('retrieves an account by ID', async () => {
    const mockAccount = { id: 1, email: 'test@example.com' };
    (prismaClient.conta.findUnique as jest.Mock).mockResolvedValue(mockAccount);

    const result = await contaRepository.getById(1);

    expect(prismaClient.conta.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        sebo: { include: { endereco: true } },
        usuario: true,
      },
    });
    expect(result).toEqual(mockAccount);
  });

  it('retrieves an account by email', async () => {
    const mockAccount = { id: 1, email: 'test@example.com' };
    (prismaClient.conta.findFirst as jest.Mock).mockResolvedValue(mockAccount);

    const result = await contaRepository.getByEmail('test@example.com');

    expect(prismaClient.conta.findFirst).toHaveBeenCalledWith({
      where: {
        email: 'test@example.com',
        status: StatusConta.ATIVA,
      },
      include: {
        sebo: true,
        usuario: true,
      },
    });
    expect(result).toEqual(mockAccount);
  });

  it('deletes an account by id', async () => {
    const tx = prismaMock;
    await contaRepository.delete(tx, 1);

    expect(prismaClient.conta.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: DELETED_CONTA,
    });
  });
});
